/**
 * Passport middleware configurations.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

const passport          = require('passport');
const LocalStrategy     = require('passport-local');
const JWTStrategy       = require('passport-jwt').Strategy;
const logger            = require(require.resolve('./logger.js'))();
const cfg               = require('config');
const models            = require('../models/index.js');

/**
 * Configure passport with defined strategy.
 */
module.exports = () => {
    passport.use('local', new LocalStrategy({
        usernameField: 'mail',
        passwordField: 'password'
    }, _localStrategyImpl));

    passport.use('jwt', new JWTStrategy(_JWTStrategyOpts, _jwtStrategyImpl));
};

/**
 * email/password login strategy.
 *
 * @param {String} username
 * @param {String} password
 * @param {Function} done
 * @returns {Promise<*>}
 * @private
 */
const _localStrategyImpl = async (username, password, done) => {
    logger.debug('auth._localStrategyImpl()');

    try {
        const user = await models.User.findOne({
            where: {mail: username},
            attributes: ['id', 'slug', 'password', 'nickname', 'avatar', 'role', 'cntMsgUnread']
        });
        if(!user || !await user.comparePassword(password)){
            return done(null, false, {message: 'InvalidLogin'});
        }

        logger.debug('User ' + user.nickname + ' successfully log-in', { id: user.id, mail: user.mail });
        return done(null, user);
    }catch(err){
        return done(null, false, {message: 'InvalidLogin'});
    }
};

/**
 * Bearer JWT strategy.
 *
 * @param {Object} payload
 * @param {Function} done
 * @returns {Promise<*>}
 * @private
 */
const _jwtStrategyImpl = async (payload, done) => {
    logger.debug('auth._jwtStrategyImpl(payload)');
    // TODO is it enought for security ?
    try {
        const user = await models.User.findOne({
            where: {id: payload.sub},
            attributes: ['id', 'slug', 'nickname', 'avatar', 'role', 'cntMsgUnread']
        });
        return done(null, user);
    }catch(err){
        return done(err);
    }
};

/**
 * Extract token from either :
 * - ?access_token query param
 * - access_token in request body
 * - token in cookie
 * - authorization:Bearer <token> in header
 *
 * RFC6750 states the access_token MUST NOT be provided
 * in more than one place in a single request.
 *
 * @param {Object} req
 * @returns {String|null}
 * @private
 */
const _tokenExtractor = (req) => {
    let token;

    if(req.query && req.query['access_token']) {
        token = req.query['access_token'];
    }

    if (req.body && req.body['access_token']) {
        if(token) return null;
        token = req.body['access_token'];
    }

    if(req.cookies && req.cookies['token']){
        if(token) return null;
        token = req.cookies['token'];
    }

    if(req.headers && req.headers.authorization) {
        const parts = req.headers.authorization.split(' ');
        if((parts.length === 2 && parts[0] === 'Bearer') || (parts.length === 3 && parts[1] === 'Bearer')){
            if(token) return null;
            token = parts[parts.length - 1];
        }
    }

    return token;
};

const _JWTStrategyOpts = {
    jwtFromRequest: _tokenExtractor,
    secretOrKey: cfg.get('APP.JWT_SECRET')
};

// following exports for socket.io auth.
module.exports.jwtOpts = _JWTStrategyOpts;
module.exports.jwtVerify = _jwtStrategyImpl;
