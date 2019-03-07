'use strict';
const debug = require('debug')('Usuarios');
const lodash = require('lodash');

module.exports = Usuario => {
  Usuario.computeACL = async (item, ctx) => {
    debug('Criando lista de permissões!');
    if (!item.id) return undefined;
    const query = require('../functions/query')(Usuario.app.datasources.db);
    const result = lodash(await query(stmt, {principalId: item.id}))
      .map(El => El.name)
      .uniq()
      .sort()
      .value();

    debug('computeACL: ', item.id, result);
    return result[0];
  };
};

const stmt = `SELECT R.name
FROM RoleMapping AS RM
INNER JOIN Role AS R ON RM.roleId = R.id
WHERE (RM.principalType = 'USER')
  AND (RM.principalId = @principalId)`;
