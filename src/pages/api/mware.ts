import { RouteGate } from '@root/ankh/bin/Http/RouteGate';
import { AnkhApiResponse, Abort } from '@root/ankh/bin/Http/types.d';
import { Middleware } from '@root/ankh/bin/Middlewares/Middleware';

function controller(response: AnkhApiResponse) {
    response.status(200).json(response.req.query.id);
}

export default async function handler(req: any, res: any) {
    if (RouteGate(req, res, ["GET", "POST"]) == Abort) {
        return;
    }
    await Middleware.expose(req, res, []).then((res: AnkhApiResponse | typeof Abort) => {
        if (res == Abort) {
            return;
        }
        controller(res as AnkhApiResponse);
    });
}
