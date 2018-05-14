/**
 * Bundle entry point for main page script.
 *
 * @author jun.thong@me.com (Jun Thong)
 */

import React from 'react';
import reactDom from 'react-dom';

import AdminContainer from './containers/AdminContainer.jsx';

reactDom.hydrate(
    <AdminContainer />,
    document.getElementById('app')
);
