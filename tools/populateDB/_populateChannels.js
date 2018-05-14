/**
 * populate channels table.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

const fs                    = require('fs');
const promisify             = require('util').promisify;
const async                 = require('async');
const Chance                = require('chance');
const chance                = new Chance();
const ProgressBar           = require('ascii-progress');
const models                = require('../../src/server/models/index.js');
const channelStatus         = require('../../src/server/enums/channelStatus');

const iconName              = '09d24402-a4b8-4e8a-9d39-d4d74687b3a7.png';
let channels                = [];

module.exports.populateChannels = async (HOW_MANY_CHANNELS) => {
    const bar = new ProgressBar({
        total: HOW_MANY_CHANNELS,
        schema: 'CHANNELS       :: [:bar] :current/:total :percent :elapseds :etas'
    });

    await _copyIcon();

    return new Promise((resolve, reject) => {
        for (let i = 0; i < HOW_MANY_CHANNELS; i++) {
            channels.push(_generateOneChannel(i));
        }

        async.eachLimit(channels, 25,  (channel, done) => {
            channel.save()
                .then((c) => {
                    bar.tick();
                    done(null, c);
                    return null;
                })
                .catch((err) => { return done(err); });
        }, (err) => {
            if(err) reject(err);
            resolve(channels);
        });
    });
};

let _copyIcon = async () => {
    const src = './tools/assets/channel-icon.png';
    const dst = './public/content/icons/' +  iconName;
    await promisify(fs.copyFile)(src, dst);
};

let _generateOneChannel = (i) => {
    return models.Channel.build({
        name: 'Channel' + i,
        description: chance.paragraph(),
        slug: 'ch' + i,
        icon: iconName,
        status: channelStatus.OPEN
    });
};
