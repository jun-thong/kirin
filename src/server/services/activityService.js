/**
 * Activity's service.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

const moment                = require('moment');
const logger                = require(require.resolve('../middlewares/logger.js'))();
const cfg                   = require('config');
const models                = require('../models/index.js');
const Op                    = models.Sequelize.Op;

/**
 * Get a user's feed to display on dashboard.
 * From is date generated with moment().valueOf(), used for pagination.
 *
 * @param {String} uid
 * @param {Number} offset
 * @returns {Promise.<*>}
 */
module.exports.getFeedForUser = async (uid, offset) => {
    logger.debug(`activityService.getFeedForUser(uid: ${uid}, offset: ${offset});`);
    offset = (offset <= 0) ? moment().valueOf() : offset;

    // TODO monitor this query in real life.
    // TODO check if more metadata is need for emitter.
    // TODO check if JOIN on outer query is more efficient than in inner query.
    // TODO maybe could replace ANY((SELECT array_agg(s.followed) with a pre-processed subscription list for enhanced performance.
    let query = `SELECT md5(array_to_string(array_agg(a.aid ORDER BY a."createdAt" DESC), '')) AS hash, 
       to_json(array_agg((a."emitterSlug", a."emitterNickname")::jsonactors ORDER BY a."createdAt" DESC)) AS actors,
       a.subject,
       a."subjectType",
       a."subjectName",
       a."subjectSlug",
       a.type,
       (array_agg(a.metadata))[1] AS metadata, max(a."createdAt") AS created
FROM(
    SELECT a1.id AS aid, a1.emitter, a1."emitterSlug", au.nickname AS "emitterNickname", a1.subject, a1."subjectType", COALESCE(sp.title, su.nickname) AS "subjectName", su.slug AS "subjectSlug", a1.type, a1.metadata, a1."createdAt"
    FROM "Activities" AS a1
    LEFT JOIN "Users" AS au ON a1.emitter = au.id
    LEFT JOIN "Users" AS su ON a1.subject = su.id  
    LEFT JOIN "Posts" AS sp ON a1.subject = sp.id
    WHERE a1.emitter = ANY((SELECT array_agg(s.followed)
                           FROM "Subscriptions" AS s
                           WHERE s.follower = '${uid}')::UUID[])
    AND a1."createdAt" < ${offset}
    ORDER BY a1."createdAt"
    LIMIT 2000
) AS a 
GROUP BY a.subject, a.type, a."subjectType", "subjectName", "subjectSlug"
LIMIT ${cfg.get('ITEM_PER_PAGE.FEEDS')}`;

    return await models.sequelize.query(query, { type: models.sequelize.QueryTypes.SELECT });
};

/**
 * Get activities for given user.
 * If offsetTime is provided, get a paginated result.
 * TODO add more condition on activity type.
 *
 * @param {String} slug
 * @param {Number} offset
 * @returns {Promise.<*>}
 */
module.exports.getUserActivities = async (slug, offset) => {
    logger.debug(`activityService.getUserActivities(slug: ${slug}, offsetTime: ${offset});`);

    offset = (offset <= 0) ? moment().valueOf() : offset;
    const query = {
        where: {
            [Op.and]: {
                emitterSlug: slug,
                'createdAt': { [Op.lt]: offset }
            }
        },
        order: [['createdAt', 'DESC']],
        limit: cfg.get('ITEM_PER_PAGE.FEEDS'),
        raw: true
    };

    return await models.Activity.findAll(query);
};
