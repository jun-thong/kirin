/**
 * App global data's model.
 * Contain global stats for tall the app.
 * Should always contains only one entry in the database.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

const seqHelpers      = require('../../helpers/sequelizeHelpers.js');

/**
 * Exports the  AppGlobalData's model.
 *
 * @param {Object} sequelize
 * @param {Object} types
 * @returns {*|Sequelize.Model|Model}
 */
module.exports = function(sequelize, types) {
    return sequelize.define('AnalyticsGlobal', {
        id: { type: types.UUID, defaultValue: types.UUIDV4, primaryKey: true },
        // when is different of createdAt, this one keep the data at time 00:00:00;
        // this table as only one row with when = 0;
        when: { type: types.BIGINT, allowNull: false, defaultValue: 0 },

        cntMemberFemaleRegistered: { type: types.INTEGER, defaultValue: 0 },
        cntMemberMaleRegistered: { type: types.INTEGER, defaultValue: 0 },
        cntMemberOtherRegistered: { type: types.INTEGER, defaultValue: 0 },
        cntInvitationSent: { type: types.INTEGER, defaultValue: 0 },
        cntInvitationAnswered: { type: types.INTEGER, defaultValue: 0 },
        cntPrivateChannelsCreated: { type: types.INTEGER, defaultValue: 0 },
        cntPrivatePostsCreated: { type: types.INTEGER, defaultValue: 0 },
        cntPublicPostsCreated: { type: types.INTEGER, defaultValue: 0 },
        cntPrivateCommentCreated: { type: types.INTEGER, defaultValue: 0 },
        cntPublicCommentCreated: { type: types.INTEGER, defaultValue: 0 },
        cntStatusSent: { type: types.INTEGER, defaultValue: 0 },
        cntMessageSent: { type: types.INTEGER, defaultValue: 0 },
        cntPictureUploaded: { type: types.INTEGER, defaultValue: 0 },

        updatedAt: { type: types.BIGINT, allowNull: false, defaultValue: 0 }
    }, {
        indexes: [
            { fields: ['when'], unique: 'true' }
        ],
        timestamps: false,

        hooks: {
            beforeUpdate: seqHelpers.beforeUpdateTimestamp
        }
    });
};
