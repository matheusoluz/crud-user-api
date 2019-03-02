'use strict';
const debug = require('debug')('Autenticacao');
const _ = require('lodash');

module.exports = async (server) => {
  debug('enable authentication');
  server.enableAuth();

  var Role = server.models.Role;

  Role.registerResolver('user', ACLValidate(Role));
};

const ACLValidate = Role => async (role, ctx) => {
  debug('Valida se o usuário esta logado');
  const accessToken = ctx.remotingContext.req.accessToken;
  if (!accessToken) return false;

  debug('Valida se o usuário tem permissão de acesso');
  return server.models.User.findById(accessToken.userId)
    .then(Inst => {
      if (Inst.username == 'admin') return callback(null, true);
      const { methodString } = ctx.remotingContext;

      return (Inst.userACL || []).includes(methodString);
    });
}
