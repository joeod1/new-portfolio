import { FastifyInstance, FastifyReply, FastifyRequest, RouteHandler } from "fastify";
import { STATUS_CODES } from "http";


export default async function blog(fastify: FastifyInstance) {
    fastify.get("/:id/edit", handler);
    fastify.log.info("Blog edit route registered");
}

const handler: RouteHandler = async function(request: FastifyRequest, response: FastifyReply) {
    if (request.session.user == null) {
        response.code(401);
        return "Unauthorized";
    }
    
    const { id } = request.params as any;
    const series = await this.db.selectFrom('articles').select('articles.series').groupBy('articles.series').execute();
    const article = await this.db.selectFrom('articles').selectAll().select('articles.content').where('articles.id', '=', id).execute();
    return response.viewAsync('blog-edit.eta', { 
        article: article[0],
        series: series
    });
}