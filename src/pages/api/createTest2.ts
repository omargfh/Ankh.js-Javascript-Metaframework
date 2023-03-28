import { getKnex } from '@root/ankh/bin/Migrations';
import validator from 'validator';
import { User } from '@root/ankh/models/User';

export default async function handler(req: any, res: any) {
    let user = await User.Find(req.query.id || 63);
    user.name = "Omar Ibrahim";
    await user.push();
    res.status(200).json(user.serialize());
}