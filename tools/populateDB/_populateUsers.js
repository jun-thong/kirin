/**
 * populate user table with some users.
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
const genders               = require('../../src/server/enums/genders.js');
const userRoles             = require('../../src/server/enums/userRoles.js');

const assetSrc              = './tools/assets/';
const avatarDst             = './public/content/avatar';
const coverDst              = './public/content/cover';
const maleAvatarId          = '1356f62f-41bd-4ec1-b54e-68946e7a097f';
const femaleAvatarId        = '1fd2a406-bbe9-4abe-ae2d-3ccdf57e904c';
let users                   = [];

module.exports.populate = async (HOW_MANY_USER) => {
    const bar = new ProgressBar({
        total: HOW_MANY_USER,
        schema: 'USERS          :: [:bar] :current/:total :percent :elapseds :etas'
    });

    await _checkFolders();
    await _copyAvatars();

    return new Promise((resolve, reject) => {
        for (let i = 0; i < HOW_MANY_USER; i++) {
            users.push(_generateOneUser(i));
        }

        async.eachLimit(users, 25,  (user, done) => {
            user.save().then(() => {
                bar.tick();
                done();
                return null;
            }).catch(done);
        }, (err) => {
            if(err) reject(err);
            resolve(users);
        });
    });
};

const _checkFolders = async () => {
    await _checkOneFolder('./public/content');
    await _checkOneFolder('./public/content');
    await _checkOneFolder(avatarDst);
    await _checkOneFolder(coverDst);
    await _checkOneFolder('./public/content/icons');
};

const _checkOneFolder = (path) => {
    return new Promise((resolve, reject) => {
        fs.access(path, fs.constants.R_OK | fs.constants.W_OK, (err) => {
            if (!err) return resolve();
            fs.mkdir(path, (err) => {
                if (err) return reject(err);
                return resolve();
            });
        });
    });
};

let _copyAvatars = async () => {
    let avatars = {
            male: {
                src: assetSrc + 'avatar-male.jpg',
                dst: avatarDst +  '/' + maleAvatarId + '.jpg'
            },
            female: {
                src: assetSrc + 'avatar-female.jpg',
                dst: avatarDst + '/' + femaleAvatarId + '.jpg'
            }
        },
        cover = coverDst + '/' + femaleAvatarId + '.jpg';

    let promises = [
        promisify(fs.copyFile)(avatars.male.src, avatars.male.dst),
        promisify(fs.copyFile)(avatars.female.src, avatars.female.dst),
        promisify(fs.copyFile)(avatars.female.src, cover)
    ];

    await Promise.all(promises);
};

const _generateOneUser = (i) => {
    const gender      = Object.values(genders)[ chance.integer({ min: 0, max: 1 }) ];
    const avatar      = (gender === genders.MALE) ? maleAvatarId + '.jpg' : femaleAvatarId + '.jpg';
    const cover       = femaleAvatarId + '.jpg';
    const role        = (i === 0) ? userRoles.ADMIN : ((i === 1) ? userRoles.MODERATOR : userRoles.USER);
    const invitedBy   = (i >= 1) ? users[0].id : null;

    return models.User.build({
        mail: i + '@kirin.com',
        nickname: 'user' + i,
        password: i + '@kirin.com',
        description: chance.paragraph({ sentences: 5 }),
        invitedBy,
        avatar,
        cover,
        gender,
        role
    });
};
