/**
 * User role Enumeration.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

let userRoles = {};

/**
 * User's roles.
 *
 * @type PropertyDescriptorMap
 */
const props = {
    USER: { value: 1, writable: false, enumerable: true, configurable: true },
    MODERATOR: { value: 2, writable: false, enumerable: true, configurable: true },
    ADMIN: { value: 3, writable: false, enumerable: true, configurable: true }
};

Object.defineProperties(userRoles, props);

/**
 * Exports activity type's enumeration.
 *
 * @type {{}}
 * @property {Number} USER
 * @property {Number} MODERATOR
 * @property {Number} ADMIN
 */
module.exports = userRoles;
