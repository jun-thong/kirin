/**
 * Notification's service.
 * TODO implement IOS and android notification here.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

const logger                    = require(require.resolve('../middlewares/logger.js'))();
const io                        = require('../websocket/wsServer').io();
const ioEvents                  = require('../enums/ioEventTypes.js');

/**
 * Notify a message.
 * For chat.
 *
 * @param {String} to
 * @param {Object} msg
 */
module.exports.notifyMsg = (to, msg) => {
    _notify(ioEvents.MESSAGE, to, msg);
};

/**
 * Notify an activity.
 *
 * @param {String} to
 * @param {Object} activity
 */
module.exports.notifyActivity = (to, activity) => {
    _notify(ioEvents.ACTIVITY, to, activity);
};

/**
 * Notify a new post comment.
 * For post real time update.
 *
 * @param to
 * @param comment
 */
module.exports.notifyPostComment = (to, comment) => {
    _notify(ioEvents.NEW_POST_COMMENT, to, comment);
};

/**
 * Abstract notify method.
 *
 * @param {String} eventType
 * @param {String} roomId
 * @param {Object} payload
 * @private
 */
const _notify = (eventType, roomId, payload) => {
    logger.debug(`notificationService.notify(eventType: ${eventType}), roomId: ${roomId}, payload: ${payload}`);

    io.to(roomId).emit(eventType, payload);
};
