import fastify from "fastify";
import {fastifyAutoload} from "@fastify/autoload";
import {fastifyStatic} from "@fastify/static";
import * as path from "path";
import "dotenv";
import { configDotenv } from "dotenv";
import { readFileSync } from "fs";


async function run() {
    // Load environment variables
    configDotenv({
        path: path.join(__dirname, "../.env")
    });

    // Initialize Fastify
    const server = fastify({
        logger: true,
        https: {
            cert: readFileSync(process.env.SSL_CERT as string),
            key: readFileSync(process.env.SSL_KEY as string),
        }
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