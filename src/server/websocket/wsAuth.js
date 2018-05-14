/**
 * based on https://github.com/erreina/passport-jwt.socketio
 * But i don't why this module isn't published on NPM.
 *
 * @author ???@???.com (Ernesto Rodriguez Reina)
 */

const JwtStrategy = require('passport-jwt').Strategy

module.exports = (options, verify) => {
    const strategy = new JwtStrategy(options, verify);

    return function authorize (socket, accept) {
        // --- Begin strategy augmentation ala passport
        strategy.success = function success (user) {
            socket.handshake.user = user;
            accept();
        }

        strategy.fail = info => accept(new Error(info));

        strategy.error = error => accept(error);
        // --- End strategy augmentation

        strategy.authenticate(socket.request, {});
    };
};
