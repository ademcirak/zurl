const Joi = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const createHash = require('./createhash');
const hashLength = 8;

const base_url = process.env.BASE_URL || 'http://localhost:3000';

// Schema
const redirSchema = new Schema({
  shortUrl: String,
  url: String,
  createdAt: Date,
});

const Redir = mongoose.model('Redir', redirSchema);

const routes = [];

routes.push({
  method: 'GET',
  path: '/',
  handler(request, reply) {
    return reply.file('views/index.html');
  },
});

routes.push({
  method: 'GET',
  path: '/public/{file}',
  handler(request, reply) {
    return reply.file(`public/${request.params.file}`);
  },
});

routes.push({
  method: 'POST',
  path: '/new',
  handler(request, reply) {
    const uniqueID = createHash(hashLen);
    const newRedir = new Redir({
      shortUrl: `${baseUrl}/${uniqueID}`,
      url: request.payload.url,
      createdAt: new Date(),
    });

    return newRedir.save((err, redir) => {
      if (err) {
        reply(err);
      } else {
        reply(redir);
      }
    });
  },
  config: {
    validate: {
      payload: {
        url: Joi.string()
             .regex(/^https?:\/\/([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/)
             .required()
      },
    },
  },
});

routes.push({
  method: 'GET',
  path: '/{hash}',
  handler(request, reply) {
    const query = {
      shortUrl: `${baseUrl}/${request.params.hash}`,
    };

    Redir.findOne(query, (err, redir) => {
      if (err) {
        return reply(err);
      } else if (redir) {
        return reply().redirect(redir.url);
      }

      return reply.file('views/404.html').code(404);
    });
  },
});

module.exports = routes;

