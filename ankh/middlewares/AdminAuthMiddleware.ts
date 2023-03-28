import { Middleware } from '@ankh/bin/Middlewares/Middleware';
import { AnkhApiRequest, AnkhApiResponse, AnkhClosure } from '@ankh/bin/Http/types';
import { BaseMiddleware } from '../bin/Middlewares/BaseMiddleware';

export default class AdminAuthMiddleWare extends BaseMiddleware {
    static async handler(req: AnkhApiRequest, next: AnkhClosure): Promise<AnkhApiResponse> {
        let response = next(req);
        // @ts-ignore
        response.req.query.id = '123';
        return response;
    }
}