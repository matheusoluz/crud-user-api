'use strict';
const debug = require('debug')('Usuarios');

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
    if (roleMappingUser) {
      return await Role.findById(roleMappingUser.roleId, {fields: ['id', 'name', 'description']})
        .then(Res => {
          return {
            label: Res.name,
            sublabel: Res.description,
            value: Res.id,
          };
        });
    } else return undefined;
  };

  /**
 * Cria/atualiza usuário juntamente com permissões de usuário
 * @param {object} form Dados do formulário de insert/update
 */
  Usuario.CreateOrUpdateWhithACL = async (form) => {
    let where;

    if (form.id) where = {id: form.id};
    delete form.id;

    const user = Usuario.upsertWithWhere(where, form);

    user.then(Res => {
      const roleMappingData = {
        roleId: form.userACL,
        principalId: Res.id,
        principalType: 'USER',
      };
      Usuario.app.models.RoleMapping.upsertWithWhere({roleId: form.userACL}, roleMappingData);
    });

    return user;
  };
};
