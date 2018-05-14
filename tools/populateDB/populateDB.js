/**
 * TOOLS : Populate database.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

/* m
    populateFeeds           = require(path.join(__dirname, '/_populateFeeds.js')); */

const models                    = require('../../src/server/models/index.js');
const populateUsers             = require('./_populateUsers.js');
const populateGalleries         = require('./_populateGalleries.js');
const populateChannels          = require('./_populateChannels.js');
const populatePosts             = require('./_populatePosts.js');
const populatePostComments      = require('./_populatePostComments.js');
const populateFeeds             = require('./_populateFeeds.js');

const HOW_MANY_USER             = 50;
const HOW_MANY_CHANNELS         = 10;
const HOW_MANY_POSTS            = 30;   // per channels
const HOW_MANY_POSTCOMMENTS     = 30;   // per posts

let main = async () => {
    await models.sequelize.sync({force: true});
    const users         = await populateUsers.populate(HOW_MANY_USER);
    const channels      = await populateChannels.populateChannels(HOW_MANY_CHANNELS);
    const posts         = await populatePosts.populatePosts(HOW_MANY_POSTS, users, channels);

    await populateGalleries.populateGalleries(users);
    await populatePostComments.populatePostComments(HOW_MANY_POSTCOMMENTS, users, posts);
    await populateFeeds.populateSubscriptions(users);
    await populateFeeds.populateActivities(users);

    console.log('done !');
};

process.on('unhandledRejection', (reason, promise) => {
    console.error('Reason: ' + reason);
    console.error(promise);
    process.exit();
});

main().then(() => {
    setTimeout(() => {
        process.exit();
    }, 200);
}).catch((err) => {
    console.error('=============================================================================');
    console.error(err);
    process.exit();
});
