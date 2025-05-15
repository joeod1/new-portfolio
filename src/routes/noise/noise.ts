import { FastifyInstance, FastifyReply, FastifyRequest, RouteHandler } from "fastify";

export default async function noiseRoute(fastify: FastifyInstance) {
    fastify.get("/", handler)
}

const handler: RouteHandler = async function(request: FastifyRequest, response: FastifyReply) {
    return response.viewAsync("noise.eta", {
        nonce: {style: "", script: ""}
    });
}