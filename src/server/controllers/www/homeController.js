/**
 * Define the homepage controller.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

const passport          = require('passport');
const jwt               = require('jsonwebtoken');
const moment            = require('moment');
const React             = require('react');
const ReactDOMServer    = require('react-dom/server');
const logger            = require(require.resolve('../../middlewares/logger.js'))();
const HomeContainer     = require('../../views/home.ssr.js');
const cfg               = require('config');

/**
 * Render index page.
 *
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise<void>}
 */
module.exports.index = async (req, res) => {
    logger.debug('homeController.index()', req.isAuthenticated());

    if(req.isAuthenticated()) return res.redirect('/w');

    const markup = ReactDOMServer.renderToString(React.createElement(HomeContainer));
    res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <link rel="stylesheet" href="/assets/styles.css" />
          </head>
    
          <body id="indexBody">
            <div id="home">${markup}</div>
            <script type="text/javascript" src="/assets/home.bundle.js" defer></script>
          </body>
        </html>
    `);
};

/**
 * Handle POST /login.
 *
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise<void>}
 */
module.exports.login = async (req, res) => {
    logger.debug('homeController.login()');

    passport.authenticate('local', {session: false}, (err, user) => {
        if (err || !user) {
            return res.status(400).json({ login: false });
        }

        req.login(user, {session: false}, (err) => {
            if (err) {
                logger.debug('login error');
                res.send(err);
            }
            // generate a signed son web token with the contents of user object and return it in the response
            const userData = {
                // token public claims
                sub: user.id,
                iss: cfg.get('APP.JWT_ISSUER'),
                auth_time: moment().valueOf(),

                // token private claims
                slug: user.slug,
                nickname: user.nickname,
                avatar: user.avatar,
                role: user.role,
                cntMsgUnread: user.cntMsgUnread
            };
            const token = jwt.sign(userData, cfg.get('APP.JWT_SECRET'));
            res.cookie('token', token);
            return res.json({ token, success: true });
        });
    })(req, res);
};
