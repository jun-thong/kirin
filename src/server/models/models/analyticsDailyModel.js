/**
 * App daily data's model.
 * Each row should represent one day
 *
 * @author jun.thong@me.com (Jun Thong)
 */

const seqHelpers      = require('../../helpers/sequelizeHelpers.js');

/**
 * Exports the  AppDailyData's model.
 *
 * @param {Object} sequelize
 * @param {Object} types
 * @returns {*|Sequelize.Model|Model}
 */
module.exports = function(sequelize, types) {
    return sequelize.define('AnalyticsDaily', {
        id: { type: types.UUID, defaultValue: types.UUIDV4, primaryKey: true },
        // when is different of createdAt, this one keep the data at time 00:00:00;
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
