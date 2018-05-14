/**
 * A post's model.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

const seqHelpers      = require('../../helpers/sequelizeHelpers.js');

/**
 * Exports the  post's model.
 *
 * @param {Object} sequelize
 * @param {Object} types
 * @returns {*|Sequelize.Model|Model}
 */
module.exports = function(sequelize, types) {
    return sequelize.define('Post', {
        id: { type: types.UUID, defaultValue: types.UUIDV4, primaryKey: true },
        channelId: { type: types.UUID, allowNull: false },
        author: { type: types.UUID, allowNull: false },
        title: { type: types.STRING(255), allowNull: false },
        thumbnail: { type: types.STRING(45), allowNull: true },

        cntComments: { type: types.INTEGER, allowNull: false, defaultValue: 0 },

        updatedAt: { type: types.BIGINT, allowNull: false, defaultValue: 0 },
        createdAt: { type: types.BIGINT, allowNull: false, defaultValue: 0 }
    }, {
        indexes: [
            { fields: ['channelId'] },
            { fields: ['updatedAt'] },
            { fields: ['updatedAt', 'cntComments'] }
        ],

        timestamps: false,

        hooks: {
            beforeCreate: seqHelpers.beforeCreateTimestamp,
            beforeUpdate: seqHelpers.beforeUpdateTimestamp
        }
    });
};
