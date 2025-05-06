import { FastifyInstance } from "fastify";
import {fastifyView} from "@fastify/view";
import {fastifyPlugin} from "fastify-plugin";
import path from "path";

async function view(fastify: FastifyInstance) {
    fastify.register(fastifyView, {
        engine: {
            eta: new (await import("eta")).Eta()
        },
        templates: path.join(__dirname, "../views")
    });

    fastify.log.info("Registered @fastify/view");
}

export default fastifyPlugin(view);