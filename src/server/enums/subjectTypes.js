/**
 * subject's type Enumeration.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

let subjectTypes = {};

const props = {
    'USER': { value: 0, writable: false, enumerable: true, configurable: true },
    'STATUS': { value: 1, writable: false, enumerable: true, configurable: true },
    'PICTURE': { value: 2, writable: false, enumerable: true, configurable: true },
    'POST': { value: 3, writable: false, enumerable: true, configurable: true }
};

Object.defineProperties(subjectTypes, props);

/**
 * Exports channel type's enumeration.
 *
 * @type {{}}
 * @property {Number} USER
 * @property {Number} POST
 * @property {Number} STATUS
 * @property {Number} PICTURE
 */
module.exports = subjectTypes;
