/**
 * Rollup configuration file.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import nodeResolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import postcss from 'rollup-plugin-postcss';
import cssnext from 'postcss-cssnext';
import atImport from 'postcss-import';

/**
 * Set each bundle basic configuration.
 *
 * @type {{}}
 */
const cfg = {
    homeFront: {
        input: './src/www/home.jsx',
        name: 'home',
        output: './public/assets/home.bundle.js'
    },
    homeSSR: {
        name: 'home',
        input: './src/www/containers/HomeContainer.jsx',
        output: './src/server/views/home.ssr.js'
    },
    mainFront: {
        name: 'app',
        input: './src/www/main.jsx',
        output: './public/assets/kirin.bundle.js'
    },
    mainSSR: {
        name: 'app',
        input: './src/www/containers/AppContainer.ssr.jsx',
        output: './src/server/views/main.ssr.js'
    },
    admin: {
        name: 'admin',
        input: './src/admin/main.jsx',
        output: './public/assets/admin.bundle.js'
    },
    adminSSR: {
        name: 'admin',
        input: './src/admin/containers/AdminContainer.ssr.jsx',
        output: './src/server/views/admin.ssr.js'
    },
    css: {
        name: 'styles',
        input: './src/www/css/styles.js',
        output: './public/assets/styles.js'
    },
    adminCSS: {
        name: 'adminStyles',
        input: './src/admin/css/styles.js',
        output: './public/assets/adminStyles.js'
    }
};

const env = process.env.NODE_ENV;
const reload = (env === 'development') ? livereload() : null;

const watcherConfiguration = {
    watch: {
        exclude: 'node_modules/**',
        clearScreen: false,
        chokidar: true
    }
};

const commonJSConfiguration = {
    namedExports: {
        'node_modules/react/index.js': ['Component', 'PureComponent', 'Fragment', 'Children', 'createElement'],
        'node_modules/react-dom/index.js': ['render']
    }
};

/**
 * Makes a JS bundle for front-end usage.
 *
 * @param {String} name
 * @param {String} input
 * @param {String} output
 * @returns {{}}
 */
const bundleJSForFront = (name, input, output) => {
    return Object.assign({
        input: input,
        output: {
            name: name,
            file: output,
            format: 'es',
            sourcemap: true
        },
        plugins: [
            nodeResolve(),
            replace({ 'process.env.NODE_ENV': JSON.stringify(env) }),
            commonjs(commonJSConfiguration),
            babel({
                exclude: 'node_modules/**',
                'presets': [
                    ['env', {
                        targets: {
                            browsers: ['last 2 Chrome versions']
                        },
                        modules: false
                    }],
                    'react',
                    'stage-2'
                ],
                plugins: [
                    'transform-decorators-legacy',
                    ['inline-json-import', {}]
                ]
            }),
            env === 'production' && uglify(),
            env === 'development' && reload
        ]
    }, watcherConfiguration);
};

/**
 * Makes a JS bundle for back-end usage.
 *
 * @param {String} name
 * @param {String} input
 * @param {String} output
 * @returns {{}}
 */
let bundleJSForBack = (name, input, output) => {
    const pkg = require('./package.json');

    return Object.assign({
        input: input,
        output: {
            name: name,
            file: output,
            format: 'cjs',
            sourcemap: true
        },
        external: Object.keys(pkg.dependencies),
        plugins: [
            nodeResolve(),
            commonjs(commonJSConfiguration),
            babel({
                exclude: 'node_modules/**',
                presets: [
                    ['env', {
                        targets: {
                            node: 'current'
                        },
                        modules: false
                    }],
                    'react',
                    'stage-2'
                ],
                plugins: [
                    'transform-decorators-legacy',
                    ['inline-json-import', {}]
                ]
            }),
            uglify()
        ]
    }, watcherConfiguration);
};

/**
 * Makes a CSS bundle.
 *
 * @param {String} name
 * @param {String} input
 * @param {String} output
 * @returns {{}}
 */
const bundleCSS = (name, input, output) => {
    return Object.assign({
        input: input,
        output: {
            file: output,
            format: 'es'
        },
        plugins: [
            postcss({
                plugins: [
                    atImport(),
                    cssnext()
                ],
                sourceMap: true,
                extract: true,
                minimize: true
            })
        ]
    }, watcherConfiguration);
};

const homeBundle = bundleJSForFront(cfg.homeFront.name, cfg.homeFront.input, cfg.homeFront.output);
const homeSSRBundle = bundleJSForBack(cfg.homeSSR.name, cfg.homeSSR.input, cfg.homeSSR.output);
const mainBundle = bundleJSForFront(cfg.mainFront.name, cfg.mainFront.input, cfg.mainFront.output);
const mainSSRBundle = bundleJSForBack(cfg.mainSSR.name, cfg.mainSSR.input, cfg.mainSSR.output);
const adminBundle = bundleJSForFront(cfg.admin.name, cfg.admin.input, cfg.admin.output);
const adminSSRBundle = bundleJSForBack(cfg.adminSSR.name, cfg.adminSSR.input, cfg.adminSSR.output);
const cssBundle = bundleCSS(cfg.css.name, cfg.css.input, cfg.css.output);
const constadminCssBundle = bundleCSS(cfg.adminCSS.name, cfg.adminCSS.input, cfg.adminCSS.output);

export default [homeBundle, homeSSRBundle, mainBundle, mainSSRBundle, adminBundle, adminSSRBundle, cssBundle, constadminCssBundle];
