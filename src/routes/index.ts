import { FastifyInstance, FastifyReply, FastifyRequest, RouteHandler } from "fastify";


export default async function homePage(fastify: FastifyInstance) {
    fastify.get("/", handler);
    fastify.log.info("Homepage route registered");
}

const handler: RouteHandler = async function(request: FastifyRequest, response: FastifyReply) {
    console.log("\n\n\n\nUser:");
    console.log(request.user);
    const articles = await this.db
        .selectFrom('articles')
            .select('articles.title')
            .select('articles.date_created')
            .select('articles.series')
            .select('articles.id')
            .select('articles.public')
        .orderBy('articles.date_created desc')
        .where('articles.public', '=', true)
        .limit(3).execute();
    return response.viewAsync('index.eta', { 
        articles: articles,
        nonce: response.cspNonce ?? {style: "", script: ""}
    });
}