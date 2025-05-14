import { FastifyInstance, FastifyReply, FastifyRequest, RouteHandler } from "fastify";

export default async function uploadImage(fastify: FastifyInstance) {
    fastify.post("/:id/upload-image", handler);

    fastify.log.info("Blog update API endpoint registered");
}

const handler: RouteHandler = async function(request: FastifyRequest, response: FastifyReply) {
    if (request.session.user == null) {
        response.code(401);
        return "Unauthorized";
    }

    const { id } = request.params as any;

    this.uploadImage(request, parseInt(id as string).toString());

    return response.redirect(`/blog/${id}/edit`);
}