/**
 * Activity type's Enumeration.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

let activityTypes = {};

const props = {
    /*  =============================================================================
        User related activities
        ============================================================================= */
    'USER_ACCEPT_REGISTRATION': { value: 1, writable: false, enumerable: true, configurable: true },
    'USER_SENT_STATUS': { value: 101, writable: false, enumerable: true, configurable: true },
    'USER_ADDED_PICTURES': { value: 102, writable: false, enumerable: true, configurable: true },
    'USER_CREATED_POST': { value: 201, writable: false, enumerable: true, configurable: true },
    'USER_COMMENTED_POST': { value: 301, writable: false, enumerable: true, configurable: true },
    'USER_COMMENTED_STATUS': { value: 302, writable: false, enumerable: true, configurable: true },
    'USER_COMMENTED_PICTURE': { value: 303, writable: false, enumerable: true, configurable: true }
};

Object.defineProperties(activityTypes, props);

/**
 * Exports activity type's enumeration.
 *
 * @type {{}}
 * @property {Number} USER_ACCEPT_REGISTRATION
 * @property {Number} USER_SENT_STATUS
 * @property {Number} USER_ADDED_PICTURES
 * @property {Number} USER_CREATED_POST
 * @property {Number} USER_COMMENTED_POST
 * @property {Number} USER_COMMENTED_STATUS
 * @property {Number} USER_COMMENTED_PICTURE
 */
module.exports = activityTypes;
