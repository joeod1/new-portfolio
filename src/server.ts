import fastify from "fastify";
import {fastifyAutoload} from "@fastify/autoload";
import {fastifyStatic} from "@fastify/static";
import path from "path";


async function run() {
    // 
    const server = fastify({
        logger: true
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

    // await fastify.ready();

    function listenServer(port: number) {
        server.listen({port: port, host: "0.0.0.0"}).catch(e => {
            listenServer(port + 1);
        });
    }

    listenServer(8080);

    await server.ready();
}

run();