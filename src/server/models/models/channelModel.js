/**
 * A channel's model.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

const seqHelpers        = require('../../helpers/sequelizeHelpers.js');
const channelType       = require('../../enums/channelTypes');
const channelStatus     = require('../../enums/channelStatus.js');

/**
 * Exports the  channel's model.
 * Channel can be private (requiring invitation) and visible.
 * But an invisible channel must be private.
 *
 * @param {Object} sequelize
 * @param {Object} types
 * @returns {*|Sequelize.Model|Model}
 */
module.exports = function(sequelize, types) {
    return sequelize.define('Channel', {
        id: { type: types.UUID, defaultValue: types.UUIDV4, primaryKey: true },
        name: { type: types.STRING(255), allowNull: false },
        slug: { type: types.STRING(4), allowNull: false },
        icon: { type: types.STRING(255), allowNull: false },
        description: { type: types.TEXT, allowNull: false },
        type: { type: types.INTEGER, allowNull: false, defaultValue: channelType.CREATED_BY_USER },
        status: { type: types.INTEGER, allowNull: false, defaultValue: channelStatus.PENDING },
        isPrivate: { type: types.BOOLEAN, allowNull: false, defaultValue: false },
        isVisible: { type: types.BOOLEAN, allowNull: false, defaultValue: true },
        cntPost: { type: types.INTEGER, allowNull: false, defaultValue: 0 },
        cntAdmins: { type: types.INTEGER, defaultValue: 0 },
        cntModerators: { type: types.INTEGER, defaultValue: 0 },

        updatedAt: { type: types.BIGINT, allowNull: false, defaultValue: 0 },
        createdAt: { type: types.BIGINT, allowNull: false, defaultValue: 0 }
    }, {
        indexes: [
            { fields: ['name'], unique: true },
            { fields: ['slug'], unique: true }
        ],
        timestamps: false,

        hooks: {
            beforeCreate: seqHelpers.beforeCreateTimestamp,
            beforeUpdate: seqHelpers.beforeUpdateTimestamp
        }
    });
};
