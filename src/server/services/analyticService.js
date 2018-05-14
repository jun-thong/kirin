/**
 * App analytic's service.
 *
 * @author jun.thong@me.com (Jun Thong)
 */
// TODO update global analitycs on a daily task.

const logger                    = require(require.resolve('../middlewares/logger.js'))();
const moment                    = require('moment');
const models                    = require('../models/index.js');

/**
 * Get global data's
 * ID in database must be 1.
 *
 * @returns {Promise.<*>}
 */
module.exports.getGlobalData = async () => {
    logger.debug('dataService.getGlobalData()');

    return await models.AnalyticsGlobal.findOne({
        where: { when: 0 }
    });
};

/**
 * Return daily data for last 30 days.
 *
 * @returns {Promise.<*>}
 */
module.exports.getDataLast30days = async () => {
    logger.debug('dataService.getGlobalData()');

    return await models.AnalyticsDaily.findAll({
        limit: 30,
        order: ['when', 'DESC'],
        raw: true
    });
};

/*  =============================================================================
    Updaters Factory
    Generate all increment / decrement method.
    ============================================================================= */
const _updaters = [
    { name: 'FemaleCount', field: 'cntMemberFemaleRegistered' },
    { name: 'MaleCount', field: 'cntMemberMaleRegistered' },
    { name: 'OtherCount', field: 'cntMemberOtherRegistered' },
    { name: 'InvitationSent', field: 'cntInvitationSent' },
    { name: 'InvitationAnswered', field: 'cntInvitationAnswered' },
    { name: 'PrivateChannelsCreated', field: 'cntPrivateChannelsCreated' },
    { name: 'PrivatePostCreated', field: 'cntPrivatePostsCreated' },
    { name: 'PublicPostCreated', field: 'cntPublicPostsCreated' },
    { name: 'PrivateCommentCreated', field: 'cntPrivateCommentCreated' },
    { name: 'PublicCommentCreated', field: 'cntPublicCommentCreated' },
    { name: 'StatusSent', field: 'cntStatusSent' },
    { name: 'MessageSent', field: 'cntMessageSent' },
    { name: 'PictureUploaded', field: 'cntPictureUploaded' }
];

/**
 * Abstract update method.
 *
 * @param {String} field
 * @param {String} value
 * @param {Object} transaction
 * @returns {Promise<[any , any , any , any , any , any , any , any , any , any]>}
 * @private
 */
const _abstractUpdateCounter = async (field, value, transaction = null) => {
    logger.debug(`dataService._abstractUpdateCounter(field: ${field}, value: ${value}, hasTransaction: ${(transaction)}`);

    // just in case, check if value is in the range of the two allowed values.
    value = (value === '+1' || value === '-1') ? value : '+1';

    return models.AnalyticsDaily.upsert({ [field]: models.sequelize.literal(`"${field}" ${value}`) }, {
        where: {
            when: moment().hour(0).minute(0).second(0).millisecond(0).valueOf() // today 00:00:00
        },
        transaction: transaction || null
    });
};

/**
 * increment Decrement function's factory.
 *
 * @type {{}}
 * @private
 */
let _methods = Object.keys(_updaters).reduce((acc, current) => {
    return {
        ...acc,
        ['increment' + current.name]: async (transaction = null) => {
            return await _abstractUpdateCounter(current.field, '+1', transaction);
        },
        ['decrement' + current.name]: async (transaction = null) => {
            return await _abstractUpdateCounter(current.field, '-1', transaction);
        }
    };
}, {});

/**
 * @type {{}}
 * @property {Function} incrementFemaleCount
 * @property {Function} incrementMaleCount
 * @property {Function} incrementOtherCount
 * @property {Function} incrementInvitationSent
 * @property {Function} incrementInvitationAnswered
 * @property {Function} incrementPrivateChannelsCreated
 * @property {Function} incrementPrivatePostCreated
 * @property {Function} incrementPrivateCommentCreated
 * @property {Function} incrementPublicPostCreated
 * @property {Function} incrementPublicCommentCreated
 * @property {Function} incrementStatusSent
 * @property {Function} incrementMessageSent
 * @property {Function} incrementPictureUploaded
 * @property {Function} decrementFemaleCount
 * @property {Function} decrementMaleCount
 * @property {Function} decrementOtherCount
 * @property {Function} decrementInvitationSent
 * @property {Function} decrementInvitationAnswered
 * @property {Function} decrementPrivateChannelsCreated
 * @property {Function} decrementPrivatePostCreated
 * @property {Function} decrementPrivateCommentCreated
 * @property {Function} decrementPublicPostCreated
 * @property {Function} decrementPublicCommentCreated
 * @property {Function} decrementStatusSent
 * @property {Function} decrementMessageSent
 * @property {Function} decrementPictureUploaded
 */
module.exports = _methods;
