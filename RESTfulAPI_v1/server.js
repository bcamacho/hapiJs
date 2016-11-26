'use strict';

const Hapi = require('hapi');
const mongojs = require('mongojs');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    port: 3000
});
//Connect to db
server.app.db = mongojs('hapi-rest-mongo', ['projects']);

//Load plugins and start server
server.register([
  require('./routes/projects')
], (err) => {

  if (err) {
    throw err;
  }
  // Start the server
  server.start((err) => {
    console.log('Server running at:', server.info.uri);
  });
});
