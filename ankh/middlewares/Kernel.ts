import AdminAuthMiddleware from '@ankh/middlewares/AdminAuthMiddleware';
const Kernel = {
    'middlewares': {
        'AdminAuthMiddleware': AdminAuthMiddleware.handler
    },
    'middlewareGroups': {
        'web': [],
        'api': [],
    },
    'routeMiddleware': {
        'api/mware': 'AdminAuthMiddleware',
    }
}

export default Kernel;