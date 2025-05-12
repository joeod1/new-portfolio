import { FastifyInstance, FastifyRequest } from "fastify";
import {fastifyPlugin} from "fastify-plugin";
import fastifyPassport from "@fastify/passport";
import fastifySecureSession from "@fastify/secure-session";
import fastifyCookie from "@fastify/cookie";
import {Strategy as GoogleStrategy} from  "passport-google-oauth2";
import { readFileSync } from "fs";
import { join } from "path";

declare module "fastify" {
    interface FastifyInstance {
    }
}

async function events(fastify: FastifyInstance) {
    fastify.register(fastifyCookie);
    fastify.register(fastifySecureSession, {
        sessionName: "session",
        cookieName: "session-cookie",
        key: readFileSync(join(__dirname, "..", "..", "secret-key")),
        expiry: 24 * 60 * 60,
        cookie: {
            path: '/',
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        }
    });

    fastify.register(fastifyPassport.initialize());
    fastify.register(fastifyPassport.secureSession());

    fastifyPassport.use('google', new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: "http://localhost:8080/auth/google/callback",
        passReqToCallback: true,
    }, function(req: FastifyRequest, accessToken: any, refreshToken: any, profile: any, cb: any) {
        if (process.env.ADMIN_EMAIL == profile.email) {
            req.session.set("user", profile);
            return cb(null, profile);
        } else {
            return cb(null, null);
        }
    }));
    
    fastify.log.info("Registered events plugin");
}

export default fastifyPlugin(events);
