const React                 = require('react');
const ReactDOMServer        = require('react-dom/server');
const AppContainer          = require('../../views/main.ssr.js');

const prefetchService     = require('../../services/prefetchService.js');

const logger                = require(require.resolve('../../middlewares/logger.js'))();

/**
 * Render main page, container the SPA after login screen.
 *
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise<void>}
 */
module.exports.index = async (req, res) => {
    logger.debug(`clientController.index(url: ${req.url})`);
    const initialState = await prefetchService.dashboard(req.user.id);

    const markup = ReactDOMServer.renderToString(React.createElement(AppContainer, {
        context: {},
        location: req.url,
        initialState
    }));

    res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>SSR with RR</title>
            <link rel="stylesheet" href="/assets/styles.css" />
          </head>
    
          <body>
            <div id="app">${markup}</div>
            <script type="text/javascript">
                window.__INITIAL_STORE__ = ${JSON.stringify(initialState)};
            </script>
            <script type="text/javascript" src="/assets/kirin.bundle.js" defer></script>
          </body>
        </html>
    `);
};
