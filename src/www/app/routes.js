const routes = {
    '/': { exact: true, component: '', backFetcher: 'prefetchDashboard', frontFetcher: '/api/dashboard' },
    '/profile': { exact: false, component: '', backFetcher: 'prefetchProfile', frontFetcher: '/api/profile' },
    '/profile/:uid': { exact: false, component: '', backFetcher: 'prefetchProfile', frontFetcher: '/api/profile:uid' }
};

export default routes;
