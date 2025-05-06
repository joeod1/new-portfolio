import { FastifyInstance } from "fastify";
import {fastifyWebsocket} from "@fastify/websocket";
import {fastifyPlugin} from "fastify-plugin";

async function websocket(fastify: FastifyInstance) {
    fastify.register(fastifyWebsocket);

    fastify.log.info("Registered @fastify/websocket");
}

export default fastifyPlugin(websocket);