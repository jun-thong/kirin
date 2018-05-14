/**
 * I18next configuration.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

import i18next from 'i18next';
import commons from '../../../locales/fr/commons.json';
import home from '../../../locales/fr/home.json';

const locales = { commons, home };

const i18nCfg = {
    lng: 'fr',
    fallbackLng: 'fr',
    debug: false,
    ns: ['commons', 'home', 'nav'],
    defaultNS: 'commons',

    interpolation: {
        escapeValue: false // not needed for react!!
    },

    // react i18next special options (optional)
    react: {
        wait: false,
        nsMode: 'default'
    },

    resources: {
        fr: locales
    }
};

i18next.init(i18nCfg);

export { i18next as default };
