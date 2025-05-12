import { FastifyInstance, FastifyReply, FastifyRequest, RouteHandler } from "fastify";
import fastifyPassport from "@fastify/passport";


export default async function homePage(fastify: FastifyInstance) {
    fastify.get("/login", {
        preValidation: fastifyPassport.authenticate('google', { successRedirect: '/', authInfo: false })
    }, handler);

    fastify.get("/google/callback", {
        preValidation: fastifyPassport.authenticate('google', { scope: ['profile', 'email'], successRedirect: '/', authInfo: false })
    }, handler);

    fastify.log.info("Login route registered");
}

const handler: RouteHandler = async function(request: FastifyRequest, response: FastifyReply) {
    const articles = await this.db.selectFrom('articles').select('articles.title').select('articles.date_created').select('articles.series').select('articles.id').limit(3).execute();
    return response.viewAsync('index.eta', { 
        articles: articles,
        user: request.user
    });
}