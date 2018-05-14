/**
 * Configure i18n middleware.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

const i18next     = require('i18next');
const i18nBackend = require('i18next-sync-fs-backend');
const cfg         = require('config');

/**
 *  Configure i18n middleware.
 *  The i18n module is initiated synchronously.
 *
 *  Also configure an helper for handlerbar.
 */
module.exports = function(){
    i18next
        .use(i18nBackend)
        .init({
            // This is necessary for this sync version of the backend to work:
            initImmediate: false,
            backend: {
                loadPath: process.cwd() + '/locales/{{lng}}/{{ns}}.json',
                addPath: process.cwd() + '/locales/{{lng}}/{{ns}}.missing.json',
                jsonIndent: 4
            },
            // i18next options
            lng: cfg.get('APP.LANG'),
            fallbackLng: cfg.get('APP.LANG'),
            ns: 'commons',
            defaultNS: 'commons',
            preload: [cfg.get('APP.LANG')],
            saveMissing: (process.env.NODE_ENV === 'development'),
            saveMissingTo: 'current',
            debug: cfg.get('LOG.I18N'),
            react: { wait: false }
        });
};
