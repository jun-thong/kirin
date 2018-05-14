/**
 * A comment's model.
 * Comments are related to any commentables content, except Posts.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

const seqHelpers            = require('../../helpers/sequelizeHelpers.js');

module.exports = function(sequelize, types) {
    return sequelize.define('Comment', {
        id: { type: types.UUID, defaultValue: types.UUIDV4, primaryKey: true },
        author: { type: types.UUID, allowNull: false },
        subject: { type: types.UUID, allowNull: false },
        subjectType: { type: types.INTEGER, allowNull: false },
        content: { type: types.TEXT, allowNull: false },
        createdAt: { type: types.BIGINT, allowNull: false, defaultValue: 0 },
        updatedAt: { type: types.BIGINT, allowNull: false, defaultValue: 0 }
    }, {
        indexes: [
            { fields: ['subject'] }
        ],
        timestamps: false,
        hooks: {
            beforeCreate: seqHelpers.beforeCreateTimestamp,
            beforeUpdate: seqHelpers.beforeUpdateTimestamp
        }
    });
};
