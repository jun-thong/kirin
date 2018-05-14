/**
 * Sequelize helpers.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

const moment      = require('moment');

/**
 * Generic beforeCreate hook.
 * model must be a sequelize model's instance, and must contain createdAt and updatedAt field.
 * Used to store an Integer instead of the Date datatype to store date.
 *
 * @param {Object} model
 * @returns {*}
 */
module.exports.beforeCreateTimestamp = (model) => {
    model.createdAt = moment().valueOf();
    model.updatedAt = moment().valueOf();
};

/**
 * Generic beforeUpdate hook.
 * model must be a sequelize model's instance, and must contain createdAt and updatedAt field.
 * Used to store an Integer instead of the Date datatype to store date.
 *
 * @param {Object} model
 * @returns {*}
 */
module.exports.beforeUpdateTimestamp = (model) => {
    model.updatedAt = moment().valueOf();
};
