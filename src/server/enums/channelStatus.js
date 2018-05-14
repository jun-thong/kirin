/**
 * Channel status Enumeration.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

let channelStatus = {};

/**
 * Open : channel open
 * Closed: channel closed
 * Pending: channel creation is pending.
 *
 * @type {{}}
 */
const props = {
    'OPEN': { value: 1, writable: false, enumerable: true, configurable: true },
    'PENDING': { value: 2, writable: false, enumerable: true, configurable: true },
    'CLOSED': { value: 3, writable: false, enumerable: true, configurable: true }
};

Object.defineProperties(channelStatus, props);

/**
 * Exports activity type's enumeration.
 *
 * @type {{}}
 * @property {Number} OPEN
 * @property {Number} PENDING
 * @property {Number} CLOSED
 */
module.exports = channelStatus;
