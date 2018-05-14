/**
 * populate galleries table.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

const fs                    = require('fs');
const promisify             = require('util').promisify;
const async                 = require('async');
const ProgressBar           = require('ascii-progress');
const models                = require('../../src/server/models/index.js');

const pictureSrc              = './tools/assets/';
const pictureDst              = './public/content/gallery/';
const pictureId             = '1fd2a406-bbe9-4abe-ae2d-3ccdf57e904c';
let galleries               = [];

module.exports.populateGalleries = async (users) => {
    return new Promise((resolve, reject) => {
        _copyPicture().then(() => {
            users.forEach((user, i) => {
                for(let j = 0; j < 5; j++) {
                    const identifier = i.toString() + j.toString();
                    galleries.push(_generateOneGallery(identifier, user.id));
                }
            });

            const bar = new ProgressBar({
                total: galleries.length,
                schema: 'GALLERY        :: [:bar] :current/:total :percent :elapseds :etas'
            });

            async.eachLimit(galleries, 50,  (gallery, done) => {
                gallery.save().then(({g}) => {
                    bar.tick();
                    done(null, g);
                    return null;
                }).catch((err) => { return reject(err); });
            });

            async.eachLimit(users, 50,  (user, done) => {
                let query = `UPDATE "Users" SET "cntGallery" = 5 WHERE id ='${user.id}'`;
                models.sequelize.query(query, { type: models.sequelize.QueryTypes.UPDATE }).then((u) => {
                    done(null, u);
                    return null;
                }).catch((err) => { return done(err); });
            }, (err) => {
                if(err) reject(err);
                resolve();
            });
        });
    });
};

let _copyPicture = async () => {
    const src = pictureSrc + 'avatar-female.jpg';
    const dst = pictureDst +  '/' + pictureId + '.jpg';
    return await promisify(fs.copyFile)(src, dst);
};

let _generateOneGallery = (i, ownerId) => {
    return models.Gallery.build({
        ownerId,
        title: `Gallery ${i}`,
        content: [
            pictureId + '.jpg',
            pictureId + '.jpg',
            pictureId + '.jpg',
            pictureId + '.jpg',
            pictureId + '.jpg',
            pictureId + '.jpg'
        ]
    });
};
