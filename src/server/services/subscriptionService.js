/**
 * Subscription's service.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

const moment                    = require('moment');
const logger                    = require(require.resolve('../middlewares/logger.js'))();
const cfg                       = require('config');
const models                    = require('../models/index.js');
const Op                        = models.Sequelize.Op;
const errors                    = require('../factories/errorFactory.js');
const subjectTypes              = require('../enums/subjectTypes.js');

/**
 * Get one subscription.
 *
 * @param {String} uid
 * @param {String} subject
 * @param {Number} subjectType
 * @returns {Promise<*>}
 */
module.exports.getSubscription = async (uid, subject, subjectType) => {
    logger.debug(`subscriptionService.getSubscription(uid: ${uid}, subject: ${subject}, subjectType: ${subjectType});`);
    return await models.Subscription.findOne({
        where: {
            follower: uid,
            followed: subject,
            followedType: subjectType
        }
    });
};

/**
 * Get a user preprocessed subscription list.
 *
 * @param uid
 * @returns {Promise<*|[]|subscription|null|Subscription|_Subscription2.default>}
 */
module.exports.getPreprocessedSubscription = async (uid) => {
    logger.debug(`subscriptionService.getPreprocessedSubscription(uid: ${uid});`);
    let user = await models.User.findOne({
        where: { id: uid }
    }, {
        attributes: ['subscriptions'],
        raw: true
    });

    return user.subscriptions;
};

/**
 * Get followers for given user.
 * If offsetTime is provided, get a paginated result.
 *
 * @param {Number} uid
 * @param {Number} offsetTime
 * @returns {Promise.<*>}
 */
module.exports.getFollowersFor = async (uid, offsetTime = 0) => {
    logger.debug(`subscriptionService.getFollowersFor(uid: ${uid}, offsetTime: ${offsetTime});`);

    offsetTime = offsetTime || moment().valueOf();

    let query = {
        where: {
            [Op.and]: {
                followed: uid,
                [Op.not]: { follower: uid },
                createdAt: { [Op.gt]: offsetTime }
            }
        },
        attributes: ['id', 'createdAt'],
        order: [['createdAt', 'DESC']],
        limit: cfg.get('ITEM_PER_PAGE.FOLLOWERS'),
        raw: true,
        include: [{
            model: models.User,
            as: 'followr',
            attributes: ['id', 'nickname', 'avatar']
        }]};

    return await models.Subscription.findAll(query);
};

/**
 * Get followed for given user.
 * If offsetTime is provided, get a paginated result.
 *
 * @param {Number} uid
 * @param {Number} offsetTime
 * @returns {Promise.<*>}
 */
module.exports.getFollowedFor = async (uid, offsetTime = 0) => {
    logger.debug(`subscriptionService.getFollowedFor(uid: ${uid}, offsetTime: ${offsetTime});`);

    offsetTime = offsetTime || moment().valueOf();

    return await models.Subscription.findAll({
        where: {
            [Op.and]: {
                follower: uid,
                createdAt: {[Op.lt]: offsetTime},
                [Op.not]: { followed: uid }
            }
        },
        attributes: ['id', 'createdAt'],
        order: [['createdAt', 'DESC']],
        limit: cfg.get('ITEM_PER_PAGE.FOLLOWERS'),
        raw: true,
        include: [{
            model: models.User,
            as: 'followd',
            attributes: ['id', 'nickname', 'avatar']
        }]
    });
};

/**
 * SubscribeTo abstract method.
 *
 * @param {String} uid
 * @param {String} subject
 * @param {Number} subjectType
 * @returns {Promise<*>}
 * @private
 */
    // TODO change all of this...
let _abstractSubscribe = async (uid, subject, subjectType) => {
    logger.debug(`subscriptionService._abstractSubscribe(uid: ${uid}, subject: ${subject});`);

    if(uid === subject) return false; // silently ignore.

    // if subscribing to user, post or channel check if it exists.
    let modelToCheck = _getModelToFollow(subjectType);
    if(modelToCheck){
        let subjectChecked = await modelToCheck.findById(subject, { attributes: ['id'], raw: true });
        if(!subjectChecked) throw new errors.NotFound();
    }

    // UPDATE "Users"
    // SET subscriptions = array_append(subscriptions,'${subject}'), "countFollowed" = "countFollowed" + 1
    // WHERE id ='${uid}' AND NOT subscriptions @> '{${subject}}'::uuid[]
    let t = await models.sequelize.transaction(),
        promises = [
            // create subscription
            models.Subscription.create({ follower: uid, followed: subject, followedType: subjectType }, { transaction: t }),
            models.User.update({
                countFollowed: models.sequelize.literal('"countFollowed" +1'), // TODO update only if subjectType === subjectTypes.USER
                subscription: models.sequelize.fn('array_append', models.sequelize.col('subscription'), subject)
            }, {
                where: {
                    [Op.and]: {
                        id: uid,
                        subscription: { [Op.not]: { [Op.contains]: subject } }
                    } },
                transaction: t
            })
        ];

    if(subjectType === subjectTypes.USER){
        promises.push(
            models.User.update({ countFollower: models.sequelize.literal('"follower" +1') }, {
                where: { id: subject },
                transaction: t
            })
        );
    }

    return await Promise.all(promises);
};
/*
 * Return a model based on subjectType.
 *
 * @param {Number} subjectType
 * @returns {*}
 * @private
 */
let _getModelToFollow = (subjectType) => {
    if(subjectType === subjectTypes.USER) return models.User;
    if(subjectType === subjectTypes.POST) return models.Post;
    // if(subjectType === subjectTypes.STATUS) return models.Channel;
    // ignore check if subjectType === status.
    // TODO TO complete
    return null;
};