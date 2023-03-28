import { Model, ModelCollection } from "@ankh/bin/Models/Model";
import validator from "validator";
import validatorFn from "@root/ankh/validators/userValidator";
import bcrypt from "bcrypt";
import { UserSalt } from "@root/ankh/models/UserSalt";

interface UserInterface {
    name: string;
    email: string;
    password: string;
    role: string;
}

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
        // Validate data
        let validators: Record<string, boolean> = validatorFn({ name, email, password, role });
        Object.keys(validators).forEach(key => {
            if (!validators[key]) {
                throw new Error(`Invalid ${key} provided.`);
            }
        });

        // Check unique email
        let users = await User.Where({ email });
        if (users.length > 0) {
            throw new Error("Email already exists.");
        }

        // Hash password
        let salt = bcrypt.genSaltSync(10);
        password = bcrypt.hashSync(password, salt);

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