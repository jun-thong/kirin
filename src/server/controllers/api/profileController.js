/**
 * Define dashboard related controllers.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

const logger                = require('../../middlewares/logger.js')();
const prefetchService       = require('../../services/prefetchService.js');
const activityService        = require('../../services/activityService.js');

/**
 * profile page handler.
 *
 * @param {Object} req
 * @param {Object} res
 */
module.exports.profile = async (req, res) => {
    logger.debug(`profileController.profile(slug: ${req.params.slug});`);

    const slug = (req.params.slug) ? req.params.slug : req.user.slug;
    const data = Object.assign(
        { user: req.user },
        await prefetchService.profile(req.user.slug, slug)
    );

    res.json(data);
};

/**
 * Load more activities for infinite scrolling.
 *
 * @param {Object} req
 * @param {Object} res
 */
module.exports.getMoreActivities = async (req, res) => {
    logger.debug(`profileController.getMoreActivities(slug: ${req.params.slug}, offset: ${req.params.offset});`);

    const slug = (req.params.slug) ? req.params.slug : req.user.slug;
    res.json({
        user: req.user,
        activities: await activityService.getUserActivities(slug, Number(req.params.offset))
    });
};
