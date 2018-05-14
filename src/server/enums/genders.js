/**
 * Gender Enumeration.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

let genders = {};

/**
 * User's roles.
 *
 * @type PropertyDescriptorMap
 */
const props = {
    'MALE': { value: 1, writable: false, enumerable: true, configurable: true },
    'FEMALE': { value: 2, writable: false, enumerable: true, configurable: true },
    'OTHER': { value: 3, writable: false, enumerable: true, configurable: true }
};

Object.defineProperties(genders, props);

/**
 * Exports gender's enumeration.
 *
 * @type {{}}
 * @property {Number} MALE
 * @property {Number} FEMALE
 * @property {Number} OTHER
 */
module.exports = genders;
