/**
 * Status's service.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

const fs                        = require('fs').promises;
const fsConst                   = require('fs').constants;
const logger                    = require(require.resolve('../middlewares/logger.js'))();
const cfg                       = require('config');
const models                    = require('../models/index.js');
const activityTypes             = require('../enums/activityTypes.js');
const subjectTypes              = require('../enums/subjectTypes.js');
const error                     = require('../factories/errorFactory.js');

const tmpDir                    = cfg.get('PICTURES.TMP_DIR');
const picturesDir               = cfg.get('PICTURES.STATUS_DIR');

/**
 * Publish a status.
 *
 * @param {String} emitter
 * @param {String} emitterSlug
 * @param {String} text
 * @param {Array} pictures
 * @returns {Promise<this | Errors.ValidationError>}
 */
module.exports.publish = async (emitter, emitterSlug, text, pictures) => {
    await _checkMovePictures(pictures);

    return models.Activity.save({
        emitter,
        emitterSlug,
        subject: emitter,
        subjectType: subjectTypes.STATUS,
        type: activityTypes.USER_SENT_STATUS,
        metadata: {
            text,
            pictures
        }
    }).catch((err) => {
        _cleanPictures(pictures).catch(() => {
            logger.error('statusService.publish(): error while deleting picture.', err);
        });
        return new error.InternalServerError();
    });
};

/**
 * Check if pictures exist and move them out of tmp dir.
 *
 * @param {Array} pictures
 * @returns {Promise<[any]>}
 * @private
 */
const _checkMovePictures = async (pictures) => {
    const promises = pictures.map(async (file) => {
        await fs.access(tmpDir + file, fsConst.F_OK);
        return await fs.rename(tmpDir + file, picturesDir + file);
    });
    return await Promise.all(promises);
};

/**
 * Clean pictures from final destination.
 *
 * @param {Array} pictures
 * @returns {Promise<[any]>}
 * @private
 */
const _cleanPictures = async (pictures) => {
    const promises = pictures.map((file) => {
        return fs.unlink(picturesDir + file);
    });
    return await Promise.all(promises);
};
