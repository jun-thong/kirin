/**
 * Kirin App.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

/*  =============================================================================
    Dependencies
    ============================================================================= */
const fs                  = require('fs');
const path                = require('path');
const spdy                = require('spdy');
const express             = require('express');
const enforce             = require('express-sslify');
const bodyParser          = require('body-parser');
const cookieParser        = require('cookie-parser');
const favicon             = require('serve-favicon');
const helmet              = require('helmet');
const compress            = require('compression');
const serveStatic         = require('serve-static');
const passport            = require('passport');
const cors                = require('cors');
const nocache             = require('nocache');
const cfg                 = require('config');
const logger              = require(require.resolve('./middlewares/logger.js'))();
const models              = require('./models/index.js');
const errorsHandler       = require('./middlewares/errorsHandler.js').errorHandler;

/*  =============================================================================
    Express App
    ============================================================================= */
const app = module.exports  = express();
const server = spdy.createServer({
    key: fs.readFileSync(path.resolve(cfg.get('SSL.KEY'))).toString(),
    cert: fs.readFileSync(path.resolve(cfg.get('SSL.CERT'))).toString()
}, app);

/*  =============================================================================
    Configure i18n
    ============================================================================= */
require('./middlewares/i18next.js')();

/*  =============================================================================
    Configure Express App
    ============================================================================= */
if (process.env.NODE_ENV === 'development') {
    app.use(cors());
    app.use(nocache());
}

app.use(enforce.HTTPS());
app.use(helmet());
app.use(compress());
app.use(serveStatic(path.resolve('./public'), { index: false }));
app.use(favicon(path.resolve('./public/favicon.ico')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

/*  =============================================================================
    Passport
    ============================================================================= */
require('./middlewares/passport.js')();

/*  =============================================================================
    App routes
    ============================================================================= */
require('./routers/wwwRouter.js')(app);

/*  =============================================================================
    Configure Socket.io
    ============================================================================= */
let io = require('./websocket/wsServer.js').init(server);

/*  =============================================================================
    Error Handler
    ============================================================================= */
app.use(errorsHandler);

process.on('unhandledRejection', (err, reason, p) => {
    logger.warn(err, reason, p);
});

/*  =============================================================================
    App starter
    ============================================================================= */
app.start = (port) => {
    logger.info('=============================================================================');
    logger.info(`    PHOENIX/WWW starting on port ${port}...`);
    logger.info('=============================================================================');
    logger.info(`    NODE_ENV: ${process.env.NODE_ENV}`);
    logger.info('=============================================================================');
    models.createCustomType().then(() => {
        logger.info('    MODELS HAD BEEN SET UP');
        logger.info('=============================================================================');
        server.listen(port);
        logger.info(`    Server listining on port ${port}...`);
        logger.info('=============================================================================');
        io.listen(server);
        logger.info('    IO server listening on port ' + port + '...');
        logger.info('=============================================================================');
        logger.info('    APP STARTED.');
        logger.info('=============================================================================');
    }).catch((err) => {
        logger.error(err);
    });
};
