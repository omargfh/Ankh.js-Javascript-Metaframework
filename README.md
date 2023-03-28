<div width=400>
![Ankh.js](public/logo.png)
</div>
<h1 align="center">A comprehensive metaframework for web development built on Next.js</h1>

This project is a comprehensive Next.js starter kit built on top of the Next.js framework. It is a metaframework that provides a solid foundation for building a web application with Next.js. It is a great starting point for building a web application with Next.js. The project is built with Typescript, Knex, MySQL, Nunjucks, and MVC architecture, with a direct influence from Laravel. This is an ongoing project, and I will be adding more features as I go along as well as fix bugs and update the documentation.

### Key Features
- [x] Knex Interface with MySQL (Documentation: [Knex](http://knexjs.org/))
- [x] Knex Migrations (Documentation: [Knex Migrations](http://knexjs.org/#Migrations))
- [x] Knex Seeds (Documentation: [Knex Seeds](http://knexjs.org/#Seeds))
- [ ] Model Interface built on top of Knex (In Progress)
- [ ] Controller Interface
- [ ] Middlewares (In Progress)
- [x] Nunjucks Template Render Engine (Documentation: [Nunjucks](https://mozilla.github.io/nunjucks/))
- [x] Validator Interface using Validator (Documentation: [Validator](https://www.npmjs.com/package/validator))
- [x] Encryption Interface using Bcrypt (Documentation: [Bcrypt](https://www.npmjs.com/package/bcrypt))
- [ ] Route Manager
- [ ] Utility Scripts
- [ ] Authentication
- [ ] Authorization
- [ ] Session Management
- [ ] Error Handling
- [ ] Logging
- [ ] Testing
- [ ] Deployment
- [ ] Documentation

### Working Examples
#### Knex Interface with MySQL
```typescript
import { getKnex } from '@root/knex';

export default async function handler(req: any, res: any) {
    const knex = getKnex();
    const users = await knex('users').select('*');
    res.status(200).json(users);
    }
```

#### Knex Migrations
```javascript
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('users', table => {
        table.increments('id').primary();
        table.string('name', 255).notNullable();
        table.string('email', 255).notNullable();
        table.string('password', 255).notNullable();
        table.string('role', 255).notNullable();
        table.string('remember_token', 255).nullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
}
```

#### Model Interface
```typescript
import { Model, ModelCollection } from "@root/knex/models/bin/Model";
import { UserSalt } from "@models/UserSalt";

export class User extends Model {
    constructor() {
        super();
    }
    table = "users";
    timestamps = true;
    hidden = ["password"];
    fillable = ["name", "email", "password", "role"];
    with = ["user_salt"];
    hasRelation = [
        {
            name: "salt",
            model: UserSalt,
            foreignKey: "user_id",
            localKey: "id",
            relationship: "hasOne"
        }
    ]

    static async create(name: string, email: string, password: string, role: string) {
        // Create user
        let user = await User.New();
        user.name = name;
        user.email = email;
        user.password = password;
        user.role = role;
        user.salt.salt = salt;
        await user.save();

        return user;
    }
}
```