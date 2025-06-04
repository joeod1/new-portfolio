import { FastifyInstance } from "fastify";
import {fastifyView} from "@fastify/view";
import {fastifyPlugin} from "fastify-plugin";
import * as path from "path";

declare module "fastify" {
    interface FastifyReply {
        locals: any
    }
}

async function view(fastify: FastifyInstance) {
    fastify.register(fastifyView, {
        engine: {
            eta: new (await import("eta")).Eta()
        },
        templates: path.join(__dirname, "../views")
    });

    fastify.addHook("preHandler", function(request, response, done) {
        response.locals = {
            nonce: response.cspNonce ?? { style: "", script: "" }
        };

        return done();
    });

    fastify.log.info("Registered @fastify/view");
}

export default fastifyPlugin(view);