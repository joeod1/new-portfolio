import fastify, { FastifyReply, FastifyRequest } from "fastify";
import {fastifyAutoload} from "@fastify/autoload";
import {fastifyStatic} from "@fastify/static";
import * as path from "path";
import "dotenv";
import { configDotenv } from "dotenv";
import { readFileSync } from "fs";
import * as httpsRedirect from "fastify-https-redirect";
import "@fastify/helmet";
import fastifyHelmet from "@fastify/helmet";


async function run() {
    // Load environment variables
    configDotenv({
        path: path.join(__dirname, "../.env")
    });

    // Initialize Fastify
    const server = fastify({
        logger: {
            transport: {
                target: 'pino-pretty',
                options: {

                }
            }
        },
        https: (process.env.NODE_ENV == "production") ? {
            cert: readFileSync(process.env.SSL_CERT as string),
            key: readFileSync(process.env.SSL_KEY as string),
        } : null
    });

    // server.addHook("onSend", (req, reply, payload, done) => {
    // //     console.log("Sent!");
    //     reply.header("strict-transport-security", "Strict-Transport-Security: max-age=31536000; includeSubDomains");
    //     reply.header("content-security-policy", "default-src 'self' font.google.com cdn.jsdelivr.net rawgit.com cdnjs.cloudflare.com unpkg.com; unsafe-inline");
    //     reply.header("x-frame-options", "SAMEORIGIN");
    //     reply.header("x-content-type-options", "nosniff");
    //     reply.header("referrer-policy", "origin-when-cross-origin");
    //     reply.header("permissions-policy", "");
    //     done(null, payload);
    // });

    await server.register(fastifyHelmet, {
        global: true,
        contentSecurityPolicy: false
        // enableCSPNonces: true,
        // contentSecurityPolicy: {
        //     directives: {
        //         "default-src": "'self' fonts.googleapis.com cdn.jsdelivr.net rawgit.com cdnjs.cloudflare.com unpkg.com",
        //         "style-src": ["'self'", "fonts.googleapis.com", "cdnjs.cloudflare.com", "'unsafe-inline'"],
        //         "script-src": [
        //             "'self'", "cdn.jsdelivr.net", "rawgit.com", "cdnjs.cloudflare.com unpkg.com", "'unsafe-inline'"
        //         ]
        //     }
        // }
    });

    

    // Register static files
    await server.register(fastifyStatic, {
        root: path.join(__dirname, "dist"),
    })

    // Register plugins
    await server.register(fastifyAutoload, {
        dir: path.join(__dirname, "plugins")
    });

    // Register normal routes
    await server.register(fastifyAutoload, {
        dir: path.join(__dirname, "routes"),
        dirNameRoutePrefix: true
    });

    // Attempt to listen on port 8080; if it fails, recursively try the next port
    function listenServer(port: number) {
        server.listen({port: port, host: "0.0.0.0"}).catch(e => {
            listenServer(port + 1);
        });
    }

    if (process.env.NODE_ENV == "production") {
        server.register(httpsRedirect);

        server.listen({
            port: 443,
            host: "0.0.0.0",
        });
    } else { 
        listenServer(8080);
    }

    await server.ready();
}

run();