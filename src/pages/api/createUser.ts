import { getKnex } from '@root/ankh/bin/Migrations';
import bcrypt from 'bcrypt';
import validator from 'validator';

export default async function handler(req: any, res: any) {
    // limit to POST requests
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' })
        return
    }

    const query = req.query;
    const knex = getKnex();

    // Validate data
    let validators: Record<string, boolean> = {
        name: validator.isLength(query.name ?? "", { min: 3, max: 50 }),
        email: validator.isEmail(query.email ?? "", {min: 1}),
        password: validator.isLength(query.password ?? "", { min: 8, max: 50 }),
        role: validator.isIn(query.role ?? "", ['admin', 'user'], { ignoreCase: true })
    }

    Object.keys(validators).forEach(key => {
        if (!validators[key]) {
            res.status(400).json({
                message: `Invalid ${key} provided.`
            });
        }
    });

    // Check unique email
    let emailExists = await knex('users').where('email', query.email).first();
    if (emailExists) {
        res.status(400).json({
            message: 'Email already exists.'
        });
    }


    // Hash password
    let salt = bcrypt.genSaltSync(10);
    query.password = bcrypt.hashSync(query.password, salt);

    // Create user
    try {
        var id = await knex('users').insert({
            name: query.name,
            email: query.email,
            password: query.password,
            role: query.role
        }).returning('id');
    } catch (e) {
        res.status(500).json({
            message: 'User creation failed'
        });
    }

    // Create user salt
    try {
        await knex('user_salt').insert({
            user_id: id,
            salt: salt
        });
    }
    catch (e) {
        await knex('users').where('id', id).del();
        res.status(500).json({
            message: 'User creation failed'
        });
    }

    // Create user profile
    res.status(200).json({
        message: 'User created successfully'
    });
}