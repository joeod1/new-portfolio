import { FastifyInstance, FastifyReply, FastifyRequest, RouteHandler } from "fastify";


export default async function blog(fastify: FastifyInstance) {
    fastify.get("/", handler);
    fastify.log.info("Blog route registered");
}

const handler: RouteHandler = async function(request: FastifyRequest, response: FastifyReply) {
    let articleQuery = this.db
        .selectFrom('articles')
            .select('articles.title')
            .select('articles.date_created')
            .select('articles.series')
            .select('articles.id')
            .select('articles.public')
        .orderBy('articles.date_created desc');

    if (request.session.user == null) {
        articleQuery = articleQuery.where('articles.public', '=', true);
    }
    const articles = await articleQuery.execute();

    return response.viewAsync('blog.eta', { 
        articles: articles
    });
}