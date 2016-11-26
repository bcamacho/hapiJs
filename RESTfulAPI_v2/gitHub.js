var Hapi = require('hapi');
var Bell = require('bell');
var AuthCookie = require('hapi-auth-cookie');


var server = new Hapi.Server();
// https://www.sitepoint.com/oauth-integration-using-hapi/

server.connection({ port: 3000});

server.register([Bell, AuthCookie], function (err) {
    if (err) {
        console.error(err);
        return process.exit(1);
    }

    var authCookieOptions = {
           password: 'cookie_encryption_password_secure', //Password used for encryption
           cookie: 'github-oauth', // Name of cookie to set
           isSecure: false
       };

      server.auth.strategy('session', 'cookie', authCookieOptions);

       var bellAuthOptions = {
           provider: 'github',
           password: 'github-encryption-password_secure_long_and_complex', //Password used for encryption
           clientId: 'ebb8f5392fc0b0dceb0a',//'YourAppId',
           clientSecret: '9c098283cbfee03dd2bbd80b406d865b3f7f53e2',//'YourAppSecret',
           isSecure: false
       };

       server.auth.strategy('github-oauth', 'bell', bellAuthOptions);

       server.auth.default('github-oauth');

    server.route([{
            method: 'GET',
            path: '/auth/github/login',
            config: {
              auth: 'github-oauth', //<-- use our auth strategy and let bell take over
              handler: function(request, reply) {
                if (!request.auth.isAuthenticated) {
                  return reply(Boom.unauthorized('Authentication failed: ' + request.auth.error.message));
                }
                //Just store a part of the auth profile information in the session as an example. You could do something
                //more useful here - like loading or setting up an account (social signup).
                const profile = request.auth.credentials.profile;
                request.cookieAuth.set({
                  id: profile.id,
                  username: profile.username,
                  displayName: profile.displayName,
                  profile: profile
                });
                return reply.redirect('/auth/github');
              }
            }
          }, {
            method: 'GET',
            path: '/auth/github/account',
            config: {
              auth: {
                  strategy: 'session',
                  mode: 'try'
              },
                handler: function (request, reply) {
                    reply('<pre>' + JSON.stringify(request.auth.credentials, null, 4) + '</pre>');
                }
            }
        }, {
            method: 'GET',
            path: '/auth/github',
            config: {
              // auth: 'session',
              auth: {
                  strategy: 'session',
                  mode: 'try'
              },
              handler: function (request, reply) {
                  if (request.auth.isAuthenticated) {
                    console.log(request.auth);
                      return reply('<h1>welcome back ' + request.auth.credentials.displayName+'</h1><br /><ul><li><a href="/auth/github/account">Account Details</a><li><a href="/auth/github/logout">Logout</a></ul>');
                  }
                  reply('hello stranger! <a href="/auth/github/login">Ready to login?</a>');
              }
            }
        }, {
            method: 'GET',
            path: '/auth/github/logout',
            config: {
                // auth: false,
                auth: {
                    strategy: 'session',
                    mode: 'try'
                },
                handler: function (request, reply) {
                  if (request.auth.isAuthenticated) {
                    request.cookieAuth.clear();
                    return reply.redirect('/auth/github');
                  }
                  reply('<a href="/auth/github/login">hello stranger! Ready to login?</a>');
                    // request.auth.session.clear();
                    // reply.redirect('/');
                }
            }
        }
    ]);
    server.start(function (err) {

        if (err) {
            console.error(err);
            return process.exit(1);
        }

       console.log('Server started at %s', server.info.uri);
    });
});
