/**
 * Kirin Launcher. Handle multiple process.
 * TODO : review all of this, adapt it for gandi's simplehosting. Also rework logging here.
 *
 * @author jun
 */

let cluster         = require('cluster'),
    cfg             = require('config'),
    logger          = require(require.resolve('./middlewares/logger.js'))(),
    app             = require('./app.js');

/*  =============================================================================
    Dead fork handler
    ============================================================================= */
cluster.on('exit', function (worker) {
    logger.error('Worker %d died :(', worker.id);
    cluster.fork();
});

/*  =============================================================================
    CRON config
    ============================================================================= */
if(cluster.isMaster && process.env.NODE_ENV === 'production'){
    require('./scheduledTaks/crontab.js')();
}

/*  =============================================================================
    Cluster handler
    ============================================================================= */
if(cluster.isMaster && process.env.NODE_ENV !== 'development'){
    let cpuCount = (cfg.get('APP.MAX_CLUSTER')) ? cfg.get('APP.MAX_CLUSTER') : require('os').cpus().length;

    for (let i = 0; i < cpuCount; i++) {
        cluster.fork();
    }
}else{
    app.start(cfg.get('APP.PORT'));
}
