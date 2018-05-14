/**
 * Pino's logger configuration.
 *
 * Not exactly a middleware, but don't wanted to create a directory just for this file...
 *
 * @author jun.thong@me.com (Jun Thong)
 */

const pino            = require('pino');
const cfg             = require('config');

/**
 * Singleton instance.
 *
 * @type {P.Logger | *}
 */
let i = null;

/**
 * Return a configured logger.
 *
 * @returns {P.Logger | *}
 */
module.exports = () => {
    if(i === null) {
        i = pino({
            name: 'logger',
            level: cfg.get('LOG.LEVEL')
        });
    }
    return i;
};
