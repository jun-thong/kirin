/**
 * populate user table with some users.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

const async                 = require('async');
const Chance                = require('chance');
const chance                = new Chance();
const ProgressBar           = require('ascii-progress');
const models                = require('../../src/server/models/index.js');
const activityTypes         = require('../../src/server/enums/activityTypes.js');
const subjectTypes          = require('../../src/server/enums/subjectTypes.js');

module.exports.populateSubscriptions = (users) => {
    return new Promise((resolve, reject) => {
        let subscriptions = [];

        users.forEach(followed => {
            users.forEach(follower => {
                subscriptions.push(_generateOneSubscription(follower.id, followed.id));
            });
        });

        const bar = new ProgressBar({
            total: subscriptions.length,
            schema: 'SUBSCRIPTION   :: [:bar] :current/:total :percent :elapseds :etas'
        });

        async.eachLimit(subscriptions, 50,  (subscription, done) => {
            subscription.save()
                .then((s) => {
                    let query = `UPDATE "Users" SET subscriptions = array_append(subscriptions, '${s.followed}') WHERE id ='${s.follower}' AND NOT subscriptions @> '{${s.followed}}'::uuid[]`;

                    return {s, u: models.sequelize.query(query, { type: models.sequelize.QueryTypes.UPDATE })};
                })
                .then(({s}) => {
                    bar.tick();
                    done(null, s);
                    return null;
                })
                .catch((err) => { return done(err); });
        }, (err) => {
            if(err) reject(err);
            resolve(subscriptions);
        });
    });
};

module.exports.populateActivities = (users) => {
    return new Promise((resolve, reject) => {
        let activities = [];

        users.forEach(user => {
            for(let i = 0, l = 30; i < l; i++) {
                activities.push(_generateOneActivity(user.id, user.slug, users));
            }
        });

        const bar = new ProgressBar({
            total: activities.length,
            schema: 'ACTIVITIES     :: [:bar] :current/:total :percent :elapseds :etas'
        });

        async.eachLimit(activities, 50,  (activity, done) => {
            activity.save()
                .then((a) => {
                    bar.tick();
                    done(null, a);
                    return null;
                })
                .catch((err) => { return done(err); });
        }, (err) => {
            if(err) reject(err);
            resolve(activities);
        });
    });
};

let _generateOneSubscription = (followerId, followedId) => {
    return models.Subscription.build({
        follower: followerId,
        followed: followedId,
        followedType: 1
    });
};

let _generateOneActivity = (userId, userSlug, users) => {
    return models.Activity.build({
        emitter: userId,
        emitterSlug: userSlug,
        type: Object.values(activityTypes)[chance.integer({min: 0, max: Object.values(activityTypes).length - 1})],
        subject: users[chance.integer({min: 1, max: 20})].id,
        subjectType: subjectTypes.USER,
        metadata: {
            title: '/v/' + chance.sentence()
        }
    });
};
