/**
 * Channel role's Enumeration.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

let channelRoles = {};

const props = {
    'NONE': { value: 0, writable: false, enumerable: true, configurable: true },
    'MEMBER': { value: 1, writable: false, enumerable: true, configurable: true },
    'MODERATOR': { value: 2, writable: false, enumerable: true, configurable: true },
    'ADMIN': { value: 3, writable: false, enumerable: true, configurable: true }
};

Object.defineProperties(channelRoles, props);

/**
 * Exports channel subscription role's enumeration.
 *
 * @type {{}}
 * @property {Number} NONE
 * @property {Number} MEMBER
 * @property {Number} ADMIN
 * @property {Number} MODERATOR
 */
module.exports = channelRoles;
