/**
 * Bundle entry point for home page script.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

import React from 'react';
import reactDom from 'react-dom';
import HomeContainer from './containers/HomeContainer.jsx';

reactDom.hydrate(
    <HomeContainer />,
    document.getElementById('home')
);
