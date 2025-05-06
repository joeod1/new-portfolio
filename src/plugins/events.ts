import { FastifyInstance } from "fastify";
import {fastifyPlugin} from "fastify-plugin";
import { EventEmitter } from "stream";

declare module "fastify" {
    interface FastifyInstance {
        events: EventEmitter
    }
}

async function events(fastify: FastifyInstance) {
    fastify.decorate("events", new EventEmitter());
    
    fastify.log.info("Registered events plugin");
}

export default fastifyPlugin(events);
