/**
 * Post's service.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

const logger                    = require(require.resolve('../middlewares/logger.js'))();
const cfg                       = require('config');
const models                    = require('../models/index.js');
const channelStatus             = require('../enums/channelStatus.js');
const channelService            = require('../services/channelService.js');
const errors                    = require('../factories/errorFactory.js');

module.exports.getPostsForChannel = async (uid, cid) => {
    const channel = await models.Channel.findById(cid, {
        attributes: ['isPrivate'],
        raw: true
    });

    // TODO factorize that ?
    if(channel.isPrivate){
        const channelSubscription = await channelService.getChannelSubscriptionForUser(uid, cid);
        // silently ignore if no subscription found.
        if(!channelSubscription) return errors.NotFound();
    }

    return await models.Post.find({
        where: {
            channelId: cid
        },
        limit: cfg.get('ITEM_PER_PAGE.POST')
    });
};

module.exports.getPost = async (uid, pid) => {
    logger.debug(`postService.getPost(pid: ${pid})`);

    const query = `SELECT p.id, p.title, p.thumbnail, p.author, u.nickname AS "authorNick", u.slug AS "authorSlug", p."cntComments", p."updatedAt", c.slug AS "channelSlug", c.name AS "channelName", c."isVisible" AS "channelIsVisible", c."isPrivate" AS "channelIsPrivate", c.status AS "channelStatus"
FROM "Posts" AS p
LEFT JOIN "Users" AS u ON u.id = p.author
LEFT JOIN "Channels" AS c ON c.id = p."channelId"
WHERE p.id = '${pid}' AND c.status = ${channelStatus.OPEN}`;
    const post = await models.sequelize.query(query, { type: models.sequelize.QueryTypes.SELECT });

    if(!post) return errors.NotFound();

    // TODO factorize that ?
    if(post.channelIsPrivate){
        const channelSubscription = await channelService.getChannelSubscriptionForUser(uid, post.channelId);
        // silently ignore if no subscription found.
        if(!channelSubscription) return errors.NotFound();
    }

    return post;
};
