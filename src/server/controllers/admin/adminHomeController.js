/**
 * Define the admin homepage controller.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

const React                 = require('react');
const ReactDOMServer        = require('react-dom/server');
const logger                = require(require.resolve('../../middlewares/logger.js'))();
const AdminHomeContainer    = require('../../views/admin.ssr.js');
const cfg                   = require('config');

/**
 * Render index page.
 *
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise<void>}
 */
module.exports.index = async (req, res) => {
    logger.debug('adminHomeController.index()');

    const markup = ReactDOMServer.renderToString(React.createElement(AdminHomeContainer));
    res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <link rel="stylesheet" href="/assets/adminStyles.css" />
          </head>
    
          <body id="indexBody">
            <div id="home">${markup}</div>
            <script type="text/javascript" src="/assets/admin.bundle.js" defer></script>
          </body>
        </html>
    `);
};