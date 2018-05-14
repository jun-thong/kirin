/**
 * A subscription's model.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

const seqHelpers      = require('../../helpers/sequelizeHelpers.js');

/**
 * Export the subscription model.
 * isPermanent indicate that the row is to be cleaned.
 *
 * @param {Object} sequelize
 * @param {Object} types
 * @returns {*|Sequelize.Model|Model}
 */
module.exports = function(sequelize, types) {
    return sequelize.define('Subscription', {
        id: { type: types.UUID, defaultValue: types.UUIDV4, primaryKey: true },
        follower: { type: types.UUID, allowNull: false },
        followed: { type: types.UUID, allowNull: false }, // the activity subject
        followedType: { type: types.INTEGER, allowNull: false },
        createdAt: { type: types.BIGINT, allowNull: false, defaultValue: 0 }
    }, {
        indexes: [ { fields: ['follower', 'followed'], unique: true } ],
        timestamps: false,
        hooks: {
            beforeCreate: seqHelpers.beforeCreateTimestamp
        }
    });
};
