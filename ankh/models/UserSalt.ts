import { Model, ModelCollection } from "@root/ankh/bin/Models/Model";
export class UserSalt extends Model {
    constructor() {
        super();
    }
    table = "user_salt";
    hidden = ["salt"];
    foreignKeys = ["user_id"];
}