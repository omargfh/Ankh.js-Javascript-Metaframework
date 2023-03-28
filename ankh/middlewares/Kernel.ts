import AdminAuthMiddleware from '@ankh/middlewares/AdminAuthMiddleware';
const Kernel = {
    'middlewares': {
        'AdminAuthMiddleware': AdminAuthMiddleware.handler
    },
    'middlewareGroups': {
        'web': [],
        'api': []
    },
    'routeMiddleware': {
        'auth': 'AdminAuthMiddleware',
    }
}

export default Kernel;