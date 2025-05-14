import { FastifyInstance, FastifyRequest } from "fastify";
import {fastifyPlugin} from "fastify-plugin";
import fastifyMultipart from "@fastify/multipart";
import { createWriteStream, existsSync, mkdir, mkdirSync } from "fs";
import { pipeline } from "stream/promises";
import path = require("path");

declare module "fastify" {
    interface FastifyInstance {
        uploadImage: (request: FastifyRequest, outDir: string) => void
    }
}

async function events(fastify: FastifyInstance) {
    fastify.register(fastifyMultipart);

    fastify.decorate("uploadImage", async (request: FastifyRequest, outDir: string) => {
        if (!request.session.user) throw new Error("Image upload unauthorized");

        const data = await request.file();

        if (!data?.file || !data?.filename) throw new Error("Image upload is missing data");

        const out = path.join(__dirname, "..", "dist", "blog", outDir);
        if (!existsSync(out)) {
            mkdirSync(out,  { recursive: true });
        }

        await pipeline(data.file, createWriteStream(path.join(out, data.filename)));
    });

    fastify.log.info("Registered image upload plugin");
}

export default fastifyPlugin(events);
