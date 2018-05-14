/**
 * Sequelize wrapper for Express.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

const fs          = require('fs');
const path        = require('path');
const Sequelize   = require('sequelize');
const logger      = require(require.resolve('../middlewares/logger.js'))();
const cfg         = require('config');

/*  =============================================================================
    Configure models
    ============================================================================= */
const sequelize = new Sequelize(cfg.get('SQL.DB'), cfg.get('SQL.USER'), cfg.get('SQL.PASSWD'), {
    dialect: 'postgres',
    host: cfg.get('SQL.HOST'),
    port: cfg.get('SQL.PORT'),
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    logging: (cfg.get('LOG.SQL')) ? logger.debug : null
});
const db = {};

fs
    .readdirSync(path.join(__dirname, 'models'))
    .filter((file) => {
        return (file.indexOf('.') !== 0) && (file !== 'index.js');
    })
    .forEach((file) => {
        const model = sequelize.import(path.join(__dirname, 'models', file));
        db[model.name] = model;
    });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

/*  =============================================================================
    Configure associations
    ============================================================================= */
db.User.hasMany(db.Gallery, { foreignKey: 'ownerId', sourceKey: 'id' });

/*  =============================================================================
    Configure associations
    ============================================================================= */
db.createCustomType = async () => {
    return sequelize.query(`
        DO $$
        BEGIN
            DROP TYPE IF EXISTS jsonActors;
            CREATE TYPE jsonActors AS ("emitterSlug" integer, nickname varchar(32));
        END$$;
    `);
};

/**
 * Exports sequelize object with all models.
 *
 * @type {{}}
 * @property {*|Sequelize.Model|Model|Sequelize.Instance|Instance} Announcement
 * @property {*|Sequelize.Model|Model|Sequelize.Instance|Instance} AnalyticsDaily
 * @property {*|Sequelize.Model|Model|Sequelize.Instance|Instance} AnalyticsGlobal
 * @property {*|Sequelize.Model|Model|Sequelize.Instance|Instance} Alert
 * @property {*|Sequelize.Model|Model|Sequelize.Instance|Instance} BannedMail
 * @property {*|Sequelize.Model|Model|Sequelize.Instance|Instance} BannedPicture
 * @property {*|Sequelize.Model|Model|Sequelize.Instance|Instance} Case
 * @property {*|Sequelize.Model|Model|Sequelize.Instance|Instance} Channel
 * @property {*|Sequelize.Model|Model|Sequelize.Instance|Instance} ChannelTeam
 * @property {*|Sequelize.Model|Model|Sequelize.Instance|Instance} Comment
 * @property {*|Sequelize.Model|Model|Sequelize.Instance|Instance} Activity
 * @property {*|Sequelize.Model|Model|Sequelize.Instance|Instance} Subscription
 * @property {*|Sequelize.Model|Model|Sequelize.Instance|Instance} Post
 * @property {*|Sequelize.Model|Model|Sequelize.Instance|Instance} User
 * @property {*|Sequelize.Model|Model|Sequelize.Instance|Instance} Gallery
 *
 */
module.exports = db;
