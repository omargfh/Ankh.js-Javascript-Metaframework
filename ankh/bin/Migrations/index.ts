import knex from 'knex';
import config from '@ankh/bin/Migrations/config';

/**
* Global is used here to ensure the connection
* is cached across hot-reloads in development
*
* see https://github.com/vercel/next.js/discussions/12229#discussioncomment-83372
*/
// TODO: Figure out why TS is complaining about this
let cached: any = global.sql
if (!cached) cached = global.sql = {}

export function getKnex() {
    if (!cached.instance) cached.instance = knex(config)
    return cached.instance
}