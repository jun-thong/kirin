/**
 * Clean Tmp Dir task.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

const fs                        = require('fs/promises');
const logger                    = require(require.resolve('../middlewares/logger.js'))();
const cfg                       = require('config');

const cleanTmpPictures = async () => {
    const ls = await fs.readdir(cfg.get('PICTURES.TMP_DIR'));

    let promises = [];
    ls.forEach((file) => {
        if(file !== '.gitignore') promises.push(fs.unlink(file));
    });

    return Promise.all(promises);
};

cleanTmpPictures()
    .then(() => {
        logger.info('TMP dir cleaned.');
    })
    .catch((err) => {
        logger.error(err);
    });

