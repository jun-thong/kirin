/**
 * Define the client routes.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

const router                    = require('express').Router();
const routerAuth                = require('express').Router();
const routerApi                 = require('express').Router();
const routerAdmin               = require('express').Router();
const ensureLogin               = require('../middlewares/ensureLogin.js');
const homeController            = require('../controllers/www/homeController.js');
const clientController          = require('../controllers/www/mainController.js');
const dashboardController       = require('../controllers/api/dashboardController.js');
const profileController         = require('../controllers/api/profileController');
const adminHomeController       = require('../controllers/admin/adminHomeController');
const wrap                      = require('../middlewares/errorsHandler').wrapper;

/**
 * Configure route for the web app client.
 * /!\ all controller method used by get(), post()... must be async.
 *
 * @param {Object} app , an express app.
 */
module.exports = (app) => {
    // public routes
    router.get('/', ensureLogin.anonAuth, wrap(homeController.index));
    router.post('/login', wrap(homeController.login));

    // private routes
    routerAuth.get('/w', wrap(clientController.index));
    routerAuth.get('/w/*', wrap(clientController.index));

    // private API route
    routerApi.get('/dashboard', wrap(dashboardController.dashboard));
    routerApi.get('/dashboard/feed/after/:offset', wrap(dashboardController.getMoreActivities));
    routerApi.get('/profile', wrap(profileController.profile));
    routerApi.get('/profile/:slug', wrap(profileController.profile));
    routerApi.get('/profile/:slug/feed/after/:offset', wrap(profileController.getMoreActivities));

    // admin route
    routerAdmin.get('/0', wrap(adminHomeController.index));
    routerAdmin.get('/0/*', wrap(adminHomeController.index));

    app.post(wrap(homeController.login));
    app.use('/', router);
    app.use('/', ensureLogin.ensureAuth, routerAuth);
    app.use('/api', ensureLogin.ensureAuth, routerApi);
    app.use('/', ensureLogin.ensureModerator, routerAdmin);
};
