var Joi = require('joi');
var Boom = require('boom');


exports.register = function(server, options, next){

// Register bell with the server
server.register([require('bell')], function(err) {
    if (err) {
        console.error('Failed to load a plugin:', err);
        throw err;
    }
    // Declare an authentication strategy using the bell scheme
    // with the name of the provider, cookie encryption password,
    // and the OAuth client credentials.
    server.auth.strategy('twitter', 'bell', {
        provider: 'twitter',
        password: 'cookie_encryption_password_secure',
        clientId: 'bg7dihGJftNodkmaIBYXmKzEa',
        clientSecret: 'XYPkpkSyHU7Q2efpCTIX1B2FMejeZibCVI8HrHsGL3mM9LbEvK',
        isSecure: false     // Terrible idea but required if not using HTTPS especially if developing locally
    });

    server.route({
        method: ['GET', 'POST'], // Must handle both GET and POST
        path: '/login',          // The callback endpoint registered with the provider
        config: {
            auth: 'twitter',
            handler: function (request, reply) {

                if (!request.auth.isAuthenticated) {
                    return reply('Authentication failed due to: ' + request.auth.error.message);
                }

                // Perform any account lookup or registration, setup local session,
                // and redirect to the application. The third-party credentials are
                // stored in request.auth.credentials. Any query parameters from
                // the initial request are passed back via request.auth.credentials.query.
                return reply.redirect('/home');
            }
        }
    });
    server.route({
        method: ['GET'],
        path: '/home',          // The callback endpoint registered with the provider
        config: {
          auth: 'twitter',
            handler: function (request, reply) {
              return reply('Home Screen');
            }
        }
    });
    server.route([
        {
            method: 'GET',
            path: '/1',
            handler: function (request, reply) {

                reply('hello stranger!');
            }
        }, {
            method: 'GET',
            path: '/2',
            handler: function (request, reply) {

                reply('hello darling!');
            }
        }
    ]);
  });

  return next();
};

exports.register.attributes = {
    name: 'routes-auth'
};
