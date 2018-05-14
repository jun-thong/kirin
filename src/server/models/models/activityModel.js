/**
 * An activity's model.
 *
 * @author jun.thong@me.com (Jun Thong)
 */
// TODO work on indexes.

const seqHelpers      = require('../../helpers/sequelizeHelpers.js');

module.exports = function(sequelize, types) {
    return sequelize.define('Activity', {
        id: { type: types.UUID, defaultValue: types.UUIDV4, primaryKey: true },
        // emitter is a valid user id. describe who's instigated the action.
        emitter: { type: types.UUID, allowNull: false },
        emitterSlug: { type: types.INTEGER, allowNull: true, defaultValue: null },
        /**
         * Subject can be a user id, a post id, ... Describe what receive the action.
         *
         * users follow subject.
         * By default, a user follow himself.
         *
         * example :
         * UserA commented status from UserB. emitter: UserA, subject: UserB.
         * UserB must follow himself to get notification from all his status.
         * Status's id is passed through metadata.
         */
        subject: { type: types.UUID, allowNull: false },
        subjectType: { type: types.INTEGER, allowNull: false },
        type: { type: types.INTEGER, allowNull: false },
        metadata: { type: types.JSON, allowNull: false },
        createdAt: { type: types.BIGINT, allowNull: false, defaultValue: 0 }
    }, {
        indexes: [
            { fields: ['emitter'] },
            { fields: ['emitterSlug'] },
            { fields: ['subject'] },
            { fields: ['createdAt'] }
        ],
        timestamps: false,
        hooks: {
            beforeCreate: seqHelpers.beforeCreateTimestamp
        }
    });
};
