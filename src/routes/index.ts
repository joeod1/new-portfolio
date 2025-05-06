import { FastifyInstance, FastifyReply, FastifyRequest, RouteHandler } from "fastify";


export default async function homePage(fastify: FastifyInstance) {
    fastify.get("/", handler);
    fastify.log.info("Homepage route registered");
}

const handler: RouteHandler = async function(request: FastifyRequest, response: FastifyReply) {
    return response.viewAsync('index.eta', { text: 'text' });
}