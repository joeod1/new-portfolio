import { FastifyInstance } from "fastify";
import {fastifyPlugin} from "fastify-plugin";
import { EventEmitter } from "stream";
import { Kysely, PostgresDialect } from "kysely";
import { DB } from "kysely-codegen/dist/db";
import * as pg from "pg";

declare module "fastify" {
    interface FastifyInstance {
        db: Kysely<DB>;
    }
}

async function db(fastify: FastifyInstance) {
    console.log(process.env.DATABASE_URL);
    const db = new Kysely<DB>({
        dialect: new PostgresDialect({
            pool: new pg.Pool({
                connectionString: process.env.DATABASE_URL,
            }),
        }),
    });

    fastify.decorate("db", db);
    
    fastify.log.info("Registered database plugin");
}

export default fastifyPlugin(db);
