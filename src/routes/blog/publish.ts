import { FastifyInstance, FastifyReply, FastifyRequest, RouteHandler } from "fastify";
import BlogUpdate from "../../common/blog-interfaces";
import { sql } from "kysely";


export default async function publish(fastify: FastifyInstance) {
    fastify.get("/:id/publish", handler);

    fastify.log.info("Blog publish API endpoint registered");
}

const handler: RouteHandler = async function(request: FastifyRequest, response: FastifyReply) {
    if (request.session.user == null) {
        response.code(401);
        return "Unauthorized";
    }

    const { id } = request.params as any;

    await this.db.updateTable('articles').where('articles.id', '=', id ?? -1).set((eb) => ({
        public: true
    })).execute();

    response.redirect("/blog/" + id);
    
    return true;
}