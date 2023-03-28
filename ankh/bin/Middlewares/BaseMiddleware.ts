import { AnkhApiRequest, AnkhClosure, AnkhApiResponse } from "../Http/types";

export class BaseMiddleware {
    static async handler(req: AnkhApiRequest, next: AnkhClosure): Promise<AnkhApiResponse> {
        let response = next(req);
        return response;
    }
}