import { Model, ModelCollection } from "@root/knex/models/bin/Model";
export class UserSalt extends Model {
    constructor() {
        super();
    }
    table = "user_salt";
    hidden = ["salt"];
}