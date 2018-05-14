/**
 * Channel type Enumeration.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

let channelType = {};

const props = {
    'CREATED_BY_ADMIN': { value: 1, writable: false, enumerable: true, configurable: true },
    'CREATED_BY_USER': { value: 2, writable: false, enumerable: true, configurable: true }
};

Object.defineProperties(channelType, props);

/**
 * Exports channel type's enumeration.
 *
 * @type {{}}
 * @property {Number} CREATED_BY_ADMIN
 * @property {Number} CREATED_BY_USER
 */
module.exports = channelType;
