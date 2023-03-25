import { getKnex } from '@root/knex';

export default async function handler(req: any, res: any) {
    const { id } = req.query;
    const knex = getKnex();
    let result = await knex('users')
        .where('users.id', id)
        .leftOuterJoin(
            'user_profile',
            knex.ref('users.id'),
            knex.ref('user_profile.user_id')
        )
    res.status(200).json(result && result.length > 0 ? result : []);
}