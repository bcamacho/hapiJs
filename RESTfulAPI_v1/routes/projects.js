
'use strict';

const Boom = require('boom');
const uuid = require('uuid');
const Joi = require('joi');

exports.register = function(server, options, next) {

  const db = server.app.db;

// list all the projects currently stored in MongoDB
  server.route({
      method: 'GET',
      path: '/v1/projects',
      handler: function (request, reply) {
          db.projects.find((err, docs) => {
              if (err) {
                  return reply(Boom.wrap(err, 'Internal MongoDB error'));
              }
              reply(docs);
          });
      }
  });
  // get one single projects
  server.route({
      method: 'GET',
      path: '/v1/projects/{id}',
      handler: function (request, reply) {
          db.projects.findOne({
              _id: request.params.id
          }, (err, doc) => {
              if (err) {
                  return reply(Boom.wrap(err, 'Internal MongoDB error'));
              }
              if (!doc) {
                  return reply(Boom.notFound());
              }
              reply(doc);
          });
      }
  });
  // create new project
  server.route({
      method: 'POST',
      path: '/v1/projects',
      handler: function (request, reply) {

          const project = request.payload;

          //Create an id
          project._id = uuid.v1();

          db.projects.save(project, (err, result) => {

              if (err) {
                  return reply(Boom.wrap(err, 'Internal MongoDB error'));
              }

              reply(project);
          });
      },
      config: {
          validate: {
              payload: {
                  title: Joi.string().min(4).max(50).required(),
                  tpm_id: Joi.string().min(4).max(50).required(),
                  sow_id: Joi.number()
              }
          }
      }
  });
  // Update a single project
  server.route({
    method: 'PATCH',
    path: '/v1/projects/{id}',
    handler: function (request, reply) {
        db.projects.update({
            _id: request.params.id
        }, {
            $set: request.payload
        }, function (err, result) {
            if (err) {
                return reply(Boom.wrap(err, 'Internal MongoDB error'));
            }
            if (result.n === 0) {
                return reply(Boom.notFound());
            }
            reply().code(204);
        });
    },
    config: {
        validate: {
            payload: Joi.object({
                title: Joi.string().min(4).max(50).optional(),
                tpm_id: Joi.string().min(4).max(50).optional(),
                sow_id: Joi.number().optional()
            }).required().min(1)
        }
    }
});
// Delete a single project
server.route({
    method: 'DELETE',
    path: '/v1/projects/{id}',
    handler: function (request, reply) {

        db.projects.remove({
            _id: request.params.id
        }, function (err, result) {

            if (err) {
                return reply(Boom.wrap(err, 'Internal MongoDB error'));
            }

            if (result.n === 0) {
                return reply(Boom.notFound());
            }

            reply().code(204);
        });
    }
});

  return next();
};


/* This defines a new hapi plugin called routes-projects
which encapsulates our routes definitions and handlers.
Plugins are a central concept of hapi and allow to
build modular applications. */

exports.register.attributes = {
  name: 'routes-projects'
};
