/**
 * Passport ensure auth configurations.
 *
 * @author jun.thong@me.com (Jun Thong)
 * @author contact@obsidev.com (Jerome Glatigny)
 */

const passport        = require('passport');
const moment          = require('moment');
const logger          = require(require.resolve('./logger.js'))();
const models          = require('../models/index.js');
const userRoles       = require('../enums/userRoles.js');

/**
 * Ensure that a user is authenticated.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns {*}
 */
module.exports.ensureAuth = (req, res, next) => {
    logger.debug('ensureLogin.ensureAuth()');

    passport.authenticate('jwt', {session: false}, (err, user) => {
        if (err || !user) {
            return res.status(401).redirect('/');
        }

        req.login(user, {session: false}, (err) => {
            if (err) return res.status(401).redirect('/');
            _updateLastOnline(user.id);
            next();
        });
    })(req, res);
};

/**
 * Add passport magic to req even if no user is logged in.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns {*}
 */
module.exports.anonAuth = (req, res, next) => {
    logger.debug('ensureLogin.anonAuth()');

    passport.authenticate('jwt', {session: false}, (err, user) => {
        if(err) return next(err);
        req.login(user, {session: false}, (err) => {
            if(err) return next(err);
            next();
        });
    })(req, res);
};

/**
 * Ensure that a user a moderator or an admin.
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @returns {*}
 */
module.exports.ensureModerator = function(req, res, next){
    if (req.isAuthenticated()) {
        _updateLastOnline(req.user.id);

        if (req.user.role && (req.user.role === userRoles.ADMIN || req.user.role === userRoles.MODERATOR)) {
            return next();
        }
    }
    res.redirect('/');
};

/**
 * Update last online date on user.
 *
 * @private
 * @param {String} userId
 * @returns {*}
 */
let _updateLastOnline = (userId) => {
    // Fire and forget.
    models.User.update({lastOnline: moment().valueOf()}, {
        where: {
            id: userId
        }
    }).catch((err) => {
        // exceptionally, ignore exception. Just log it.
        logger.err(err);
    });
};
