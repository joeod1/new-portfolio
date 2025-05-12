import { FastifyInstance, FastifyReply, FastifyRequest, RouteHandler } from "fastify";
import * as marked from "marked";
import fastifyPassport from "@fastify/passport";


export default async function blog(fastify: FastifyInstance) {
    fastify.get("/:id", handler);
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

    const { id } = request.params as any;

    const article = await this.db.selectFrom('articles').selectAll().where('articles.id', '=', id).execute();

    console.log(article);
    article[0].content = await marked.parse(article[0].content ?? "");

    // console.log(request.session.user);

    return response.viewAsync('blog.eta', { 
        articles: articles,
        article: article[0] ?? {},
        user: request.session.user
    });
}