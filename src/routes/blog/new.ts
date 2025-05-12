import { FastifyInstance, FastifyReply, FastifyRequest, RouteHandler } from "fastify";
import BlogUpdate from "../../common/blog-interfaces";
import { sql } from "kysely";


export default async function newPost(fastify: FastifyInstance) {
    fastify.get("/new", handler);

    fastify.log.info("Blog update API endpoint registered");
}

const handler: RouteHandler = async function(request: FastifyRequest, response: FastifyReply) {
    if (request.session.user == null) {
        response.code(401);
        return "Unauthorized";
    }

    const row = await this.db.insertInto('articles').values({public: false}).returning('articles.id').executeTakeFirst();

    response.redirect("/blog/" + row?.id + "/edit");    
    return true;
}