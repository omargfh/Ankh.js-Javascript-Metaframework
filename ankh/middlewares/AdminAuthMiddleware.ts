import { Middleware } from '@ankh/bin/Middlewares/Middleware';
import { AnkhApiRequest, AnkhApiResponse, AnkhClosure, Abort } from '@ankh/bin/Http/types';

export default class AdminAuthMiddleWare {
    static handler(req: AnkhApiRequest, next: AnkhClosure): AnkhApiResponse {
        let response = next(req);
        response.req.query.id = '123';
        return response;
    }
}