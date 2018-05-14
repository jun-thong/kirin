import Profile              from './pages/Profile.jsx';
import Dashboard            from './pages/Dashboard.jsx';

/**
 * React router configuration.
 */

const routes = [
    { path: '/', exact: true, component: Dashboard, method: 'dashboard', apiUrl: '/api/dashboard'},
    { path: '/profile', exact: false, component: Profile },
    { path: '/profile/:slug', exact: true, component: Profile },
];

export { routes as default };
