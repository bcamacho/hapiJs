'use strict';

const Hapi = require('hapi'),
      config = require('./config');
const mongojs = require('mongojs');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    port: config.server.port,
    routes: config.server.routes,
    router: { stripTrailingSlash: true }
});
// Exports server
module.exports = server;

// Connect to db
server.app.db = mongojs(config.database.db, [config.database.collection]);

// Load plugins and start server
server.register([
  {
    register: require('./routes/projects')
  },
  {
    register: require('./routes/base')
  },
  {
    register: require('./routes/auth')
  }], (err) => {
  if (err) {
    throw err;
  }

  // Start the server
  server.start((err) => {
    console.log('Server running at:', server.info.uri);
  });
});
