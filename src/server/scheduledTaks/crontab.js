/**
 * crontab configuration.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

const path                      = require('path');
const crontab                   = require('crontab');
const logger                    = require(require.resolve('../middlewares/logger.js'))();

const cleanTmpDirId = 'kirin-3107ce6b-5b48-461c-aef5-9c21fd82f575';

module.exports.init = () => {
    crontab.load((err, crontab) => {
        if (err) return logger.error(err);
    });

    // clean previous task
    crontab.remove({comment: cleanTmpDirId});

    /*  =============================================================================
        Daily tasks
        ============================================================================= */
    const cleanTmpDirPath = path.resolve(__dirname, '/src/server/scheduledTaks/dailyTasks/cleanTmpDir.js');
    crontab(`node ${cleanTmpDirPath}`, '0 4 * * *', cleanTmpDirId);
};
