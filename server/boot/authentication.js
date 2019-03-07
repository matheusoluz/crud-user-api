'use strict';
const debug = require('debug')('Autenticacao');

module.exports = async (server) => {
  debug('enable authentication');
  server.enableAuth();
};

