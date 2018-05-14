/**
 * A gallery's model.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

const seqHelpers      = require('../../helpers/sequelizeHelpers.js');

/**
 * Exports the gallery's model.
 *
 * @param {Object} sequelize
 * @param {Object} types
 * @returns {*|Sequelize.Model|Model}
 */
module.exports = function(sequelize, types) {
    return sequelize.define('Gallery', {
        id: { type: types.UUID, defaultValue: types.UUIDV4, primaryKey: true },
        ownerId: { type: types.UUID, allowNull: false },
        title: { type: types.STRING(45), allowNull: false },
        content: { type: types.ARRAY(types.STRING), allowNull: false },

        updatedAt: { type: types.BIGINT, allowNull: false, defaultValue: 0 },
        createdAt: { type: types.BIGINT, allowNull: false, defaultValue: 0 }
    }, {
        indexes: [
            { fields: ['ownerId'] },
            { fields: ['updatedAt'] }
        ],
        timestamps: false,

        hooks: {
            beforeCreate: seqHelpers.beforeCreateTimestamp,
            beforeUpdate: seqHelpers.beforeUpdateTimestamp
        }
    });
};
