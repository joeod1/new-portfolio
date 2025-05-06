# wst
This project serves as a starting point for a web server.

## Dependencies
Install the dependencies with `npm i`.
The template was built with Fastify, SASS, Webpack, Typescript, and ETA.

## Usage
After installing dependencies, run the development server with `npm start`. Run the production server with `npm start --production`.

`src/client/index.ts` is compiled to `src/dist/bundle.js` alongside all of its dependencies. The CSS is extracted to `src/dist/main.css` when ran in production mode.

The server binds to port 8080 by default in development mode. 
