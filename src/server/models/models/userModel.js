/**
 * A user's model.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

const moment            = require('moment');
const bcrypt            = require('bcrypt');
const userRoles         = require('../../enums/userRoles.js');

const SALT_WORK_FACTOR = 10;

/**
 * Exports the  user's model.
 *
 * @param {Object} sequelize
 * @param {Object} types
 * @returns {*|Sequelize.Model|Model}
 */
module.exports = function(sequelize, types) {
    let User = sequelize.define('User', {
        id: { type: types.UUID, defaultValue: types.UUIDV4, primaryKey: true },
        slug: { type: types.INTEGER, autoIncrement: true },
        mail: { type: types.STRING(255), allowNull: false },
        nickname: { type: types.STRING(32), allowNull: false },
        password: { type: types.STRING(128), allowNull: false },
        invitedBy: { type: types.UUID, allowNull: true },
        role: { type: types.INTEGER, allowNull: false, defaultValue: userRoles.USER },

        avatar: { type: types.STRING(45), allowNull: false },
        cover: { type: types.STRING(45) },
        qa: { type: types.JSON },
        description: { type: types.TEXT },
        gender: { type: types.INTEGER, allowNull: false },
        genderDesc: { type: types.STRING(32), allowNull: true },
        isOnline: { type: types.BOOLEAN, allowNull: false, defaultValue: false },
        lastOnline: { type: types.BIGINT, allowNull: false, defaultValue: 0 },

        cntGallery: { type: types.INTEGER, defaultValue: 0 },
        cntFollower: { type: types.INTEGER, defaultValue: 0 },
        cntFollowed: { type: types.INTEGER, defaultValue: 0 },
        cntComment: { type: types.INTEGER, defaultValue: 0 },
        cntMsg: { type: types.INTEGER, defaultValue: 0 },
        cntMsgUnread: { type: types.INTEGER, defaultValue: 0 },

        // This is a pre-fetched array of subscription id
        // Used to quickly subscribe to socket.io channels.
        subscriptions: { type: types.ARRAY(types.UUID), defaultValue: [] },

        updatedAt: { type: types.BIGINT, allowNull: false, defaultValue: 0 },
        createdAt: { type: types.BIGINT, allowNull: false, defaultValue: 0 }
    }, {
        indexes: [
            { fields: ['mail'], unique: true },
            { fields: ['slug'], unique: true }
        ],

        timestamps: false,

        hooks: {
            beforeCreate: _beforeCreate,
            beforeUpdate: _beforeUpdate
        }
    });

    User.prototype.comparePassword = _comparePassword;
    return User;
};

/**
 * Before create hook.
 *
 * @param {Object} user
 * @param {Object} options
 * @returns {*}
 * @private
 */
let _beforeCreate = async (user, options) => {
    user.createdAt = moment().valueOf();
    user.updatedAt = moment().valueOf();
    return _hashPassword(user, options);
};

/**
 * Before update hook.
 *
 * @param {Object} user
 * @param {Object} options
 * @returns {*}
 * @private
 */
let _beforeUpdate = (user, options) => {
    user.updatedAt = moment().valueOf();
    return _hashPassword(user, options);
};

/**
 * Hash password. Use
 *
 * @param {Object} user
 * @returns {*}
 * @private
 */
let _hashPassword =  (user) => {
    return new Promise((resolve, reject) => {
        if (!user.password || !user.changed('password')) return resolve(user);
        bcrypt.hash(user.password, SALT_WORK_FACTOR).then((hash) => {
            user.password = hash;
            resolve(user);
        }).catch(reject);
    });
};

/**
 * Compare clear password with hashed stored password.
 *
 * @param {String} candidatePassword as a string
 */
let _comparePassword = async function(candidatePassword){
    return await bcrypt.compare(candidatePassword, this.password);
};
