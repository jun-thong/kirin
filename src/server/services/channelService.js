/**
 * Channel's service.
 *
 * @author jun.thong@me.com (Jun Thong)
 */
// TODO implement modifyChannel
// TODO implement inviteToChannel

const logger                    = require(require.resolve('../middlewares/logger.js'))();
const cfg                       = require('config');
const models                    = require('../models/index.js');
const channelStatus             = require('../enums/channelStatus.js');
const channelRoles              = require('../enums/channelRoles.js');
const errors                    = require('../factories/errorFactory.js');

/**
 * Return a channel by its slug.
 * Handle visibility logic for hidden channel.
 *
 * @param {String} uid
 * @param {String} slug
 * @returns {Promise.<*>}
 */
module.exports.getChannelBySlug = async (uid, slug) => {
    logger.debug(`channelService.getChannelById(uid: ${uid}, slug: ${slug});`);

    const query = `SELECT c.id, c.name, c.slug, c.icon, c.description, c."cntPost", COALESCE(t.role, ${channelRoles.NONE}) AS role
FROM "Channels" AS c 
LEFT JOIN "ChannelTeams" AS t ON c.id = t."channelId" AND t."userId" = ${uid}
WHERE c.slug = '${slug}'
AND c.status = ${channelStatus.OPEN} 
AND ( c."isPrivate" = FALSE OR ( c."isPrivate" != FALSE AND role != ${channelRoles.NONE}) )`;
    const channel = await models.sequelize.query(query, { type: models.sequelize.QueryTypes.SELECT });

    if(!channel) return new errors.NotFound();
    return channel;
};

/**
 * Get visible channels and invisible channel where user got a subscription.
 *
 * @param {String} uid
 * @param {Number} page
 * @returns {Promise.<*>}
 */
module.exports.getChannels = async (uid, page = 1) => {
    logger.debug(`channelService.getChannels(uid: ${uid}, page : ${page});`);

    const offset = (page - 1) * cfg.get('ITEM_PER_PAGE.CHANNELS');
    const query = `SELECT c.id, c.name, c.slug, c.description, c.type, c."isVisible", c."isPrivate", c."cntPost", c."createdAt", COALESCE(t.role, 0) AS role
FROM "Channels" AS c
LEFT JOIN "ChannelTeams" AS t ON c.id = t."channelId" AND t."userId" = ${uid}
WHERE (c."isVisible" = TRUE
OR (c."isVisible" = FALSE AND role != 0) )
AND c.status = ${channelStatus.OPEN} 
ORDER BY c.slug ASC LIMIT ${cfg.get('ITEM_PER_PAGE.CHANNELS')}
OFFSET ${offset}`;

    return await models.sequelize.query(query, { type: models.sequelize.QueryTypes.SELECT });
};

/**
 * Delete a channel. Only administrator of the channel can delete it.
 * User's id is required to check user role.
 *
 * @param {String} uid
 * @param {String} cid
 * @returns {Promise<*>}
 */
module.exports.deleteChannelById = async (uid, cid) => {
    logger.debug(`channelService.deleteChannelById(uid: ${uid}, cid: ${cid});`);
    const channel = await _getChannelById(uid, cid);

    if(channel.role !== channelRoles.ADMIN) return errors.Forbidden();

    // TODO Those query may timeout, should consider something else.
    const t = await models.sequelize.transaction();
    const p = [
        models.Comment.delete({ where: { channelId: cid } }, { transaction: t }), // TODO cid may disapear from Comment model
        models.Post.delete({ where: { channelId: cid } }, { transaction: t }),
        models.Channel.delete({ where: { id: cid } }, { transaction: t })
    ];

    await Promise.all(p);
    return true;
};

/**
 * get a channel by id.
 *
 * @param {String} uid
 * @param {String} cid
 * @returns {Promise<*>}
 * @private
 */
let _getChannelById = async (uid, cid) => {
    const query = `SELECT c.id, c.name, c.slug, c.icon, c.description, c."cntPost", COALESCE(t.role, ${channelRoles.NONE}) AS role
FROM "Channels" AS c 
LEFT JOIN "ChannelTeams" AS t ON c.id = t."channelId" AND t."userId" = ${uid}
WHERE c.id = '${cid}'
LIMIT 1`;

    return await models.sequelize.query(query, { type: models.sequelize.QueryTypes.SELECT });
};

/**
 * Create a channel.
 * TODO maybe add more check before channel creation.
 *
 * @param {String} uid
 * @param {String} name
 * @param {String} slug
 * @param {String} icon
 * @param {String} description
 * @param {Boolean} isPrivate
 * @param {Boolean} isVisible
 * @returns {Promise<this|Errors.ValidationError>}
 */
module.exports.createChannel =  async (uid, name, slug, icon, description, isPrivate, isVisible) => {
    logger.debug(`channelService.createChannel(uid: ${uid}, name: ${name}, slug: ${slug});`);

    const t = await models.sequelize.transaction();
    const channel = models.Channel.save({
        name,
        slug,
        icon,
        description,
        isPrivate,
        isVisible,
        status: channelStatus.PENDING,
        cntAdmins: 1
    }, { transaction: t });

    await models.ChannelTeam.save({
        channelId: channel.id,
        userId: uid,
        role: channelRoles.ADMIN
    }, { transaction: t });

    return channel;
};

/**
 * Get a channel subscription for a user.
 *
 * @param {String} uid
 * @param {String} cid
 * @returns {Promise<* | TInstance | null>}
 */
module.exports.getChannelSubscriptionForUser = async (uid, cid) => {
    logger.debug(`channelService.getChannelTeamForUser(uid: ${uid}, cid: ${cid});`);

    return await models.ChannelTeam.findOne({
        channelId: cid,
        userId: uid
    });
};
