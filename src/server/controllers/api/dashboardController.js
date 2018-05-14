/**
 * Define dashboard related controllers.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

const logger                = require('../../middlewares/logger.js')();
const prefetchService       = require('../../services/prefetchService.js');
const activityService       = require('../../services/activityService.js');

/**
 * Dashboard handler.
 *
 * @param {Object} req
 * @param {Object} res
 */
module.exports.dashboard = async (req, res) => {
    logger.debug('dashboardController.dashboard();');

    const data = Object.assign(
        { user: req.user },
        await prefetchService.dashboard(req.user.id)
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
    logger.debug(`dashboardController.getMoreActivities(offset: ${req.params.offset});`);

    res.json({
        user: req.user,
        activities: await activityService.getFeedForUser(req.user.id, req.params.offset)
    });
};
