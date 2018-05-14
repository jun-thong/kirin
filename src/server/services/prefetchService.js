/**
 * Prefetch service.
 * Get data for server side rendering.
 * Every methods here should return an initialState object.
 *
 * @author jun.thong@me.com (Jun Thong)
 */
const logger                    = require(require.resolve('../middlewares/logger.js'))();
const userService               = require('./userService.js');
const activityService           = require('./activityService.js');

module.exports.dashboard = async (uid) => {
    logger.debug(`prefetchService.dashboard(${uid})`);
    /* const promises = [
        activityService.getFeedForUser(uid, 0)
    ];

    const [ feed ] = Promise.all(promises); */

    return {
        feed: await activityService.getFeedForUser(uid, 0)
    };
};

module.exports.profile = async (userSlug, slug) => {
    logger.debug(`prefetchService.profile(slug: ${slug});`);

    const promises = [
        await userService.getUserProfileBySlug(slug),
        await activityService.getUserActivities(slug, 0)
    ];

    const [profile, feed] = await Promise.all(promises);

    return {
        isOwnProfile: (userSlug === slug),
        profile,
        feed
    };
};
