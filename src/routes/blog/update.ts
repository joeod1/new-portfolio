import { FastifyInstance, FastifyReply, FastifyRequest, RouteHandler } from "fastify";
import BlogUpdate from "../../common/blog-interfaces";
import { sql } from "kysely";


export default async function blog(fastify: FastifyInstance) {
    fastify.post("/:id/update", {
        schema: {
            body: {
                type: "object",
                properties: {
                    series: { type: "string" },
                    title: { type: "string" },
                    id: { type: "integer" },
                    content: { type: "string" },
                }
            }
        }
    }, handler);

    fastify.log.info("Blog update API endpoint registered");
}

const handler: RouteHandler = async function(request: FastifyRequest, response: FastifyReply) {
    if (request.session.user == null) {
        response.code(401);
        return "Unauthorized";
    }
    
    const obj = request.body as BlogUpdate;

    await this.db.updateTable('articles').where('articles.id', '=', obj.id ?? -1).set((eb) => ({
        series: obj.series,
        title: obj.title,
        content: obj.content,
        date_modified: sql`CURRENT_TIMESTAMP`
    })).execute();
    
    return true;
}