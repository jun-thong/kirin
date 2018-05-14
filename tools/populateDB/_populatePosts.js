/**
 * populate posts table.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

const async                 = require('async');
const Chance                = require('chance');
const chance                = new Chance();
const ProgressBar           = require('ascii-progress');
const models                = require('../../src/server/models/index.js');

let posts = [];

module.exports.populatePosts = (HOW_MANY_TOPICS, users, channels) => {
    return new Promise((resolve, reject) => {
        for (let i = 0, l = channels.length; i < l; i++) {
            posts = posts.concat(_generatePosts(channels[i].id, users, HOW_MANY_TOPICS));
        }

        const bar = new ProgressBar({
            total: posts.length,
            schema: 'POSTS          :: [:bar] :current/:total :percent :elapseds :etas'
        });

        async.eachLimit(posts, 25,  (post, done) => {
            post.save()
                .then(() => {
                    bar.tick();
                    done(null, post);
                    return null;
                })
                .catch((err) => { return done(err); });
        }, (err) => {
            if(err) reject(err);
            resolve(posts);
        });
    });
};

let _generatePosts = (channelId, users, HOW_MANY_POSTS) => {
    let _posts = [];

    for(let i = 0; i < HOW_MANY_POSTS; i++){
        _posts.push(_generateOnePost(channelId, users));
    }

    return _posts;
};

let _generateOnePost = (channelId, users) => {
    return models.Post.build({
        channelId: channelId,
        title: chance.sentence({words: chance.integer({min: 4, max: 12})}),
        author: users[ chance.integer({ min: 0, max: users.length - 1 }) ].id
    });
};
