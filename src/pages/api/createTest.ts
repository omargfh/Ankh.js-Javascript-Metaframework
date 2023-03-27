import { getKnex } from '@root/knex';
import bcrypt from 'bcrypt';
import validator from 'validator';
import { User } from '@models/User';

export default async function handler(req: any, res: any) {

    let email = Math.random().toString(36).substring(7) + "@uk.com";
    let user = await User.create(
        "omar",
        email,
        "123456789",
        "admin"
    );

    // Create user profile
    res.status(200).json({
        message: 'User created successfully',
        user: user.serialize()
    });
}