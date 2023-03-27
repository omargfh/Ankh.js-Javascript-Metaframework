import { getKnex } from '@root/knex';
import schemaInspector from 'knex-schema-inspector';

type Knex = ReturnType<typeof getKnex>;
interface Relationship {
    model: Model | ModelCollection;
    foreignKey: string;
    localKey: string;
    relationship:
        "hasOne" | "hasMany" | "belongsTo" | "belongsToMany";
}
interface RelationshipExternalIdentifier {
    name: string;
    model: typeof Model;
    foreignKey: string;
    localKey: string;
    relationship: "hasOne" | "hasMany" | "belongsTo" | "belongsToMany";
}

export class Model {

    // Manages the connection to the database
    knex: Knex;
    // The name of the table in the database
    table: string = "";
    // The names of the columns in the database
    columns: string[] = [];
    // The names of the columns that can be serialized
    fillable: string[] = [];
    // The names of the columns that should be hidden
    hidden: string[] = [];
    // The names of the tables that should be joined eagerly
    with: string[] = [];
    // Pagination settings
    perPage: number = 10;
    // Controls whether the model should be timestamped
    timestamps: boolean = true;
    // The name of the column that stores the creation date
    createdAt: string = "created_at";
    // The name of the column that stores the update date
    updatedAt: string = "updated_at";
    // The instance of the model
    instance: Record<string, any> = {};
    instanceTypes: Record<string, string> = {};
    // The name of the primary key
    primaryKey: string = "id";
    // The relationships that have been defined
    relationships: Relationship[] = [];
    hasRelation: RelationshipExternalIdentifier[] = [];
    // Define whether the constructor is abstract
    abstractConstructor: boolean = false;
    // Determines whether the model is booted
    isBooted: boolean = false;

    // Constructors
    constructor() {
        this.knex = getKnex();
        this.abstractConstructor = true;
    }

    async init() {
        await this.bootIfNotBooted();
        return this;
    }

    // Static constructor methods
    static async New(): Promise<Model> {
        let abstractInstance = new this();
        await abstractInstance.init();
        abstractInstance.abstractConstructor = true;
        return abstractInstance;
    }

    static async Find(id: number): Promise<Model> {
        let abstractInstance = new this();
        await abstractInstance.init();
        abstractInstance.abstractConstructor = false;
        return abstractInstance.find(id);
    }

    static async Where(where: Record<string, any>): Promise<ModelCollection> {
        let abstractInstance = new this();
        await abstractInstance.init();
        abstractInstance.abstractConstructor = false;
        return abstractInstance.where(where);
    }

    static async All(): Promise<ModelCollection> {
        let abstractInstance = new this();
        await abstractInstance.init();
        abstractInstance.abstractConstructor = false;
        return abstractInstance.all();
    }

    static async Query(query: string): Promise<ModelCollection> {
        let abstractInstance = new this();
        await abstractInstance.init();
        abstractInstance.abstractConstructor = false;
        return abstractInstance.query(query);
    }

    static async KnexQuery(query: ReturnType<Knex>): Promise<ModelCollection> {
        let abstractInstance = new this();
        await abstractInstance.init();
        abstractInstance.abstractConstructor = false;
        return abstractInstance.knexQuery(query);
    }

    static __type() {
        let abstractInstance = new this();
        return abstractInstance;
    }

    // Booting Helpers
    async boot() {
        await this.bootTraits();
    }

    async bootTraits() {
        // Load class name
        this.table = this.__constructTableName();

        // Load columns
        let columns = await this.knex(this.table).columnInfo();
        this.columns = Object.keys(columns);
        this.primaryKey = this.__getPrimaryKey();
        if (!this.fillable.length && !this.hidden.length) {
            this.fillable = this.columns;
        }

        // Dynamically load columns as properties of the model
        for (let attribute of this.columns) {
            this.instance[attribute] = null;
            if (this.hidden.includes(attribute)) {
                Object.defineProperty(this, attribute, {
                    get: () => undefined,
                    set: (value: any) => this.instance[attribute] = value
                });
                continue;
            }
            Object.defineProperty(this, attribute, {
                get: () => this.instance[attribute],
                set: (value: any) => this.instance[attribute] = value
            });
            // Set the type of the column
            this.instanceTypes[attribute] = columns[attribute].type;
        }

        // Dynamically load relationships as properties of the model
        // TODO: dynamically load relationships on non-abstract models
        for (let relation of this.hasRelation) {
            if (relation.relationship === "hasOne") {
                let foreignModel = await this.hasOne(relation.model, relation.foreignKey, relation.localKey);
                Object.defineProperty(this, relation.name, {
                    get: () => foreignModel,
                    // TODO: Fix this
                    set: (value: typeof relation.model | Model) => undefined
                });
            }
        }
    }

    async booting() {
        //
    }

    async booted() {
        this.isBooted = true;
    }

    async bootIfNotBooted() {
        if (!this.isBooted) {
            await this.booting();
            await this.boot();
            await this.booted();
        }
    }


    // Constructor helpers
    __constructTableName() {
        // Check if the table name has been set
        if (this.table) {
            return this.table;
        }
        // Generate a default name based on the class name
        // and remove the trailing "s" if it exists
        let defaultName = this.constructor.name.toLowerCase();
        if (defaultName.slice(-1) === "s") {
            return defaultName.slice(0, -1);
        }
        return defaultName;
    }

    __getColumnType(column: string) {
        return this.knex(this.table).columnInfo()[column].type;
    }

    // Hidden getters
    __getPrimaryKey() {
        if (this.columns.includes("id")) {
            return "id";
        }
        return this.columns[0];
    }


    async __constructModel(knexResults: Record<string, any>): Promise<Model> {
        // TODO: Check why TS is complaining about this
        let model = new this.constructor();
        await model.init();
        model.abstractConstructor = false;
        Object.keys(model.instance).forEach(key => {
            model.instance[key] = knexResults[key];
        });
        return model;
    }

    async __popualteRelationships() {
        for (let relation of this.relationships) {
            if (relation.relationship === "hasOne") {
                let results = await this.knex(relation.model.table).where(relation.foreignKey, this.instance[relation.localKey]).first();
                if (results) {
                    relation.model.instance = results;
                    relation.model.abstractConstructor = false;
                }
            }
        }
    }

    // Relationship Constructor
    async hasOne(model: typeof Model, foreignKey: string, localKey: string = this.__getPrimaryKey()) {
        let foreignModel: Awaited<ReturnType<typeof model.New>>;
        if (this.abstractConstructor) {
            foreignModel = await model.New();
        }
        else { // if the models refers to a specific instance
            let models = await model.Where({ [foreignKey]: this.instance[localKey] });
            if (models.length === 0) {
                foreignModel = await model.New();
            } else {
                foreignModel = models.first();
            }
        }
        this.relationships.push({
            model: foreignModel,
            foreignKey: foreignKey,
            localKey: localKey,
            relationship: "hasOne"
        });
        return foreignModel;
    }

    async hasMany(model: typeof Model, foreignKey: string, localKey: string = this.__getPrimaryKey()) {
        let foreignModels = await model.Where({ [foreignKey]: this.instance[localKey] });
        this.relationships.push({
            model: foreignModels,
            foreignKey: foreignKey,
            localKey: localKey,
            relationship: "hasMany"
        });
        return foreignModels;
    }

    async belongsTo(model: typeof Model, foreignKey: string, localKey: string = this.__getPrimaryKey()) {
        let foreignModel = await model.Where({ [localKey]: this.instance[foreignKey] });
        this.relationships.push({
            model: foreignModel.first(),
            foreignKey: foreignKey,
            localKey: localKey,
            relationship: "belongsTo"
        });
        return foreignModel.first();
    }

    async belongsToMany(model: typeof Model, foreignKey: string, localKey: string = this.__getPrimaryKey()) {
        let foreignModels = await model.Where({ [foreignKey]: this.instance[localKey] });
        this.relationships.push({
            model: foreignModels,
            foreignKey: foreignKey,
            localKey: localKey,
            relationship: "belongsToMany"
        });
        return foreignModels;
    }

    // Getters
    async find(id: number) {
        let knexResults = await this.knex(this.table).where(this.__getPrimaryKey(), id).first();
        Object.keys(this.instance).forEach(key => {
            this.instance[key] = knexResults[key];
        });
        // Populate relationships
        await this.__popualteRelationships();
        return this;
    }

    async where(where: Record<string, any>) {
        let knexResults = await this.knex(this.table).where(where);
        let models: Model[] = [];
        for (let result of knexResults) {
            let model = await this.__constructModel(result);
            models.push(model);
        }
        return new ModelCollection(models);
    }

    async all() {
        let knexResults = await this.knex(this.table);
        let models: Model[] = [];
        for (let result of knexResults) {
            let model = await this.__constructModel(result);
            models.push(model);
        }
        return new ModelCollection(models);
    }

    async query(query: string) {
        let knexResults = await this.knex.raw(query);
        let models: Model[] = [];
        for (let result of knexResults) {
            let model = await this.__constructModel(result);
            models.push(model);
        }
        return new ModelCollection(models);
    }

    async knexQuery(query: ReturnType<Knex>) {
        let knexResults = await query;
        let models: Model[] = [];
        for (let result of knexResults) {
            let model = await this.__constructModel(result);
            models.push(model);
        }
        return new ModelCollection(models);
    }

    // Value getters
    get(key: string) {
        if (this.hidden.includes(key)) {
            throw new Error("Cannot get hidden value");
        }
        return this.instance[key];
    }

    getInstance() {
        // Load model values
        let instance: Record<string, any> = {};
        Object.keys(this.instance).forEach(key => {
            if (!this.hidden.includes(key)) {
                instance[key] = this.instance[key];
            }
        });
        instance[this.__getPrimaryKey()] = this.instance[this.__getPrimaryKey()];

        // Load relationship values
        for (let relationship of this.with) {
            // TODO: Implement this
        }
        return instance;
    }

    serialize() {
        return this.getInstance();
    }

    // Value setters
    set(key: string, value: any) {
        if (!this.columns.includes(key)) {
            throw new Error("Cannot set non-column value");
        }
        else if (this.fillable.length > 0 && !this.fillable.includes(key)) {
            throw new Error("Cannot set non-fillable value");
        }
        else if (this.instanceTypes[key] === "integer") {
            value = parseInt(value);
        }
        else if (this.instanceTypes[key] === "float") {
            value = parseFloat(value);
        }
        else if (this.instanceTypes[key] === "boolean") {
            value = !!value;
        }
        else if (this.instanceTypes[key] === "date" || this.instanceTypes[key] === "datetime" || this.instanceTypes[key] === "timestamp") {
            value = new Date(value);
        }
        else {
            this.instance[key] = value;
        }
    }

    // Setters
    async push() {
        if (this.abstractConstructor === true) {
            throw new Error("Can only push reference-based models");
        }
        if (this.timestamps) {
            this.instance.updated_at = new Date();
            if (!this.instance.created_at) {
                this.instance.created_at = new Date();
            }
        }
        await this.knex(this.table).where("id", this.instance.id).update(this.instance);
        for (let relationship of this.relationships) {
            await relationship.model.push();
        }
    }

    async save() {
        if (!this.abstractConstructor) {
            throw new Error("Can only save abstract models");
        }
        if (this.timestamps) {
            this.instance.updated_at = new Date();
            if (!this.instance.created_at) {
                this.instance.created_at = new Date();
            }
        }
        let id = await this.knex(this.table).insert(this.instance).returning(this.__getPrimaryKey());
        this.instance.id = id[0];
        for (let relationship of this.relationships) {
            if (typeof relationship.relationship === "string" && relationship.relationship === "hasOne") {
                relationship.model.instance[relationship.foreignKey] = this.instance[relationship.localKey];
                await relationship.model.save();
            }
            else {
                for (let model of relationship.model) {
                    model.instance[relationship.foreignKey] = this.instance[relationship.localKey];
                    await model.save();
                }
            }
        }
    }
}

export class ModelCollection {
    models: Model[];
    length: number;
    constructor(models: Model[]) {
        this.models = models;
        this.length = models.length;
    }
    async push() {
        for (let model of this.models) {
            await model.push();
        }
    }

    async save() {
        for (let model of this.models) {
            model.save();
        }
    }

    first() {
        return this.models[0];
    }

    last() {
        return this.models[this.models.length - 1];
    }
}