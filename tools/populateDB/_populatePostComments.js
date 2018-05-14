/**
 * populate post comments's table.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

const async                 = require('async');
const Chance                = require('chance');
const chance                = new Chance();
const ProgressBar           = require('ascii-progress');
const models                = require('../../src/server/models/index.js');
const subjectTypes          = require('../../src/server/enums/subjectTypes.js');

let postComments = [];

module.exports.populatePostComments = (HOW_MANY_POSTCOMMENTS, users, posts) => {
    return new Promise((resolve, reject) => {
        for (let i = 0, l = posts.length; i < l; i++) {
            postComments = postComments.concat(_generatePostComments(posts[i].id, users, chance.integer({min: 1, max: HOW_MANY_POSTCOMMENTS})));
        }

        let bar = new ProgressBar({
            total: postComments.length,
            schema: 'POST COMMENTS  :: [:bar] :current/:total :percent :elapseds :etas'
        });

        async.eachLimit(postComments, 50,  (postComment, done) => {
            postComment.save()
                .then((p) => {
                    bar.tick();
                    done(null, p);
                    return null;
                })
                .catch((err) => { return done(err); });
        }, (err) => {
            if(err) reject(err);
            resolve(postComments);
        });
    });
};

let _generatePostComments = (postId, users, HOW_MANY_POSTCOMMENTS) => {
    let _postComments = [];

    for(let i = 0; i < HOW_MANY_POSTCOMMENTS; i++){
        _postComments.push(_generateOnePostComment(postId, users));
    }

    return _postComments;
};

let _generateOnePostComment = (postId, users) => {
    return models.Comment.build({
        author: users[ chance.integer({ min: 0, max: users.length - 1 }) ].id,
        subject: postId,
        subjectType: subjectTypes.POST,
        content: chance.paragraph()
    });
};
