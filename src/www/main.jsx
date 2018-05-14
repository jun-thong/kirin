/**
 * Bundle entry point for main page script.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

import React from 'react';
import reactDom from 'react-dom';

import AppContainer from './containers/AppContainer.jsx';

reactDom.hydrate(
    <AppContainer />,
    document.getElementById('app')
);
