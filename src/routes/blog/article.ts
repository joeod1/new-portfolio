import { FastifyInstance, FastifyReply, FastifyRequest, RouteHandler } from "fastify";
import fastifyPassport from "@fastify/passport";

import { Marked, Tokens } from "marked";
import Mermaid from "mermaid";

import {markedHighlight} from "marked-highlight";
import hljs from "highlight.js";

// const marked = new Marked();
const marked = new Marked(
    markedHighlight({
      emptyLangClass: 'hljs',
      langPrefix: 'hljs language-',
      highlight(code, lang, info) {
        // if (lang == "mermaid") {
            
        // } else {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
        // }
      }
    })
  );
  

marked.use({
    renderer: {
        image({href, title, text, tokens}) {
            return `<div class="w-100 d-flex flex-row justify-content-center">
                        <img src="${href}" tooltip="${title}">
                    </div>`;
        },
        code(o : Tokens.Code) {
            console.log(o.lang);
            if (o.lang == "mermaid") {
                // console.log(o.raw.substring(11, o.raw.length - 4));
                return "<pre class='mermaid'>" + o.text + "</pre>";
            } else {
                return `<pre><code class='hljs language-${o.lang}'>${o.text}</code></pre>`;
            }
        }
    }
});

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

    const preview = (article[0]?.content ?? "").substring(0, 500);
    article[0].content = await marked.parse(article[0].content ?? "");

    return response.viewAsync('blog.eta', { 
        articles: articles,
        article: article[0] ?? {},
        user: request.session.user,
        title: article[0].series + ": " + article[0].title,
        meta: {
            description: preview ?? null
        },
        nonce: response.cspNonce ?? {style: "", script: ""}
    });
}