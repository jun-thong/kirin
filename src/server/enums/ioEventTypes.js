/**
 * socketIO event type's Enumeration.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

let ioEventTypes = {};

const props = {
    /*  =============================================================================
        User related activities
        ============================================================================= */
    'MESSAGE': { value: 'message', writable: false, enumerable: true, configurable: true },
    'ACTIVITY': { value: 'newActivity', writable: false, enumerable: true, configurable: true },
    'NEW_POST_COMMENT': { value: 'newPostComment', writable: false, enumerable: true, configurable: true }
};

Object.defineProperties(ioEventTypes, props);

/**
 * Exports notification type's enumeration.
 *
 * @type {{}}
 * @property {String} MESSAGE
 * @property {String} ACTIVITY
 * @property {String} NEW_POST_COMMENT
 */
module.exports = ioEventTypes;
