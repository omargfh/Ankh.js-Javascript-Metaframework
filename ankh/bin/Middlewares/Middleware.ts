import { AnkhApiRequest, AnkhClosure, AnkhApiResponse, Abort } from "@ankh/bin/Http/types";
import Kernel from "@ankh/middlewares/Kernel";

export class Middleware {
    handler(req: AnkhApiRequest, next: AnkhClosure): AnkhApiResponse {
        let response = next(req);
        return response;
    }

    // @middleware decorator
    static async expose(req: AnkhApiRequest, res: AnkhApiResponse, routeName: string = '', groups: string[] = []): Promise<AnkhApiResponse> {
        let middlewareGroups = Object.keys(Kernel.middlewareGroups)
        .filter((group) => groups.includes(group))
            // @ts-ignore
            .map((group) => Kernel.middlewareGroups[group])
        // Ignore the following line from ESLint and TypeScript compiler. This is SAFE.
        // @ts-ignore
        let routeMiddleware = Kernel.routeMiddleware.hasOwnProperty(routeName) ? [Kernel.routeMiddleware[routeName]] : [];

        // Collect all relevant middlewares
        let middlewareQueue = [...middlewareGroups, ...routeMiddleware];
        // Execute the middleware queue
        for (let ref of middlewareQueue) {
            // Create a closure to pass to the middleware
            // This closure takes a request, ignores the
            // middleware and returns the response
            // This allows the middleware to modify the request
            // and the response
            let next = (req: AnkhApiRequest) => {
                // Return the response of the handler
                return res;
            }
            // Execute the middleware and update the response
            // @ts-ignore
            res = await Kernel.middlewares[ref](req, next);
            // Update request
            for (let key in req) {
                if (req.hasOwnProperty(key)) {
                    // @ts-ignore
                    res.req[key] = req[key];
                }
            }
        }
        // Return the response
        return res;
    }
}
