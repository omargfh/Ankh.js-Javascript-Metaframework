import { getKnex } from '@root/knex';
import validator from 'validator';
import { User } from '@models/User';

export default async function handler(req: any, res: any) {
    let user = await User.Find(req.query.id || 63);
    console.log(`salt = ${JSON.stringify(user.salt)}`);
    user.name = "Omar Ibrahim";
    await user.push();
    res.status(200).json(user.serialize());
}