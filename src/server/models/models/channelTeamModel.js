/**
 * A channel's model.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

const seqHelpers      = require('../../helpers/sequelizeHelpers.js');

/**
 * Exports the channel's model.
 * Channel can be private (requiring invitation) and visible.
 * But an invisible channel must be private.
 *
 * @param {Object} sequelize
 * @param {Object} types
 * @returns {*|Sequelize.Model|Model}
 */
module.exports = function(sequelize, types) {
    return sequelize.define('ChannelTeam', {
        id: { type: types.UUID, defaultValue: types.UUIDV4, primaryKey: true },
        channelId: { type: types.UUID, allowNull: false },
        channelSlug: { type: types.STRING, allowNull: false },
        userId: { type: types.UUID, allowNull: false },
        role: { type: types.INTEGER, allowNull: true, defaultValue: null },

        updatedAt: { type: types.BIGINT, allowNull: false, defaultValue: 0 },
        createdAt: { type: types.BIGINT, allowNull: false, defaultValue: 0 }
    }, {
        indexes: [
            { fields: ['channelSlug', 'userId'], unique: true }
        ],
        timestamps: false,

        hooks: {
            beforeCreate: seqHelpers.beforeCreateTimestamp,
            beforeUpdate: seqHelpers.beforeUpdateTimestamp
        }
    });
};
