import { AnkhApiRequest, AnkhApiResponse } from '@root/ankh/bin/Http/types';
import { Middleware } from '@root/ankh/bin/Middlewares/Middleware';
import { getKnex } from '@root/knex';
import validator from 'validator';

export default async function handler(req: any, res: any) {
    Middleware.expose(req, res, 'auth', []).then((response: AnkhApiResponse) => {
        res.status(200).json(response.req.query.id);
    });
}
