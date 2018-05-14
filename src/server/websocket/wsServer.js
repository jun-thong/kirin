/**
 * Socket.io configurations.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

const socketio              = require('socket.io');
const ioPgAdapter           = require('socket.io-adapter-postgres');
const wsAuth                = require('./wsAuth.js');
const {jwtOpts, jwtVerify}  = require('../middlewares/passport.js');
const cfg                   = require('config');
const subscriptionService   = require('../services/subscriptionService.js');

const dbUri = `postgresql://${cfg.get('SQL.USER')}:${cfg.get('SQL.PASSWD')}@${cfg.get('SQL.HOST')}:${cfg.get('SQL.PORT')}/${cfg.get('SQL.DB')}`;
const adapter = ioPgAdapter(dbUri);
let io = null;

/**
 * Return an initialized socket.io instance.
 *
 * @return {Object}
 */
module.exports.io = () => {
    if(!io) return new Error('Socket.io is not yet initialized');
    return io;
};

/**
 * Initialize a socket.io instance.
 *
 * @param {Object} server
 * @returns {*}
 */
module.exports.init = (server) => {
    io = socketio(server);
    io.adapter(adapter);
    io.use(wsAuth(jwtOpts, jwtVerify));

    io.on('connection', _connection);

    return io;
};

/**
 * Handle socket connections.
 *
 * @param {Object} socket
 * @returns {Promise<void>}
 * @private
 */
let _connection = async (socket) => {
    let subscriptions = await subscriptionService.getPreprocessedSubscription(socket.request.user.id);
    socket.join(subscriptions);
};
