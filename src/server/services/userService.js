/**
 * Define all user related logic.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

const logger                = require(require.resolve('../middlewares/logger.js'))();
const models                = require('../models/index.js');
const errors                = require('../factories/errorFactory');

/**
 * Get a user profile from his/her id.factories
 *
 * @param {String} slug
 * @returns {Promise.<*>}
 */
module.exports.getUserProfileBySlug = async (slug) => {
    logger.debug(`userService.getUserProfile(slug: ${slug});`);
    let profile = await models.User.findOne({
        where: {
            slug
        },
        raw: true,
        attributes: ['id', 'slug', 'nickname', 'avatar', 'cover', 'qa', 'description', 'isOnline', 'cntGallery', 'cntFollower', 'cntFollowed'],
        include: {
            model: [models.Gallery],
            separate: true,
            limit: 5
        },
        order: [
            [ { model: models.Gallery }, 'createdAt', 'DESC' ]
        ]
    });

    if(!profile) throw new errors.NotFound();
    return profile;
};
