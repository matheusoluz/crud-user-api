'use strict';
const debug = require('debug')('Usuarios');
const lodash = require('lodash');

module.exports = Usuario => {
  Usuario.computeACL = async (item) => {
    debug('Criando lista de permissões!');
    if (!item.id) return undefined;
    const {Role, RoleMapping} = Usuario.app.models;
    const roleMappingUser = await RoleMapping.findOne({
      where: {
        principalId: item.id,
        principalType: 'USER',
      },
    });
    if (roleMappingUser) return await Role.findById(roleMappingUser.roleId, {fields: ['id', 'name', 'description']});
    else return undefined;
  };
};
