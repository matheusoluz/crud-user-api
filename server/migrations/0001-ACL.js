'use strict';
const debug = require('debug')('migration:0001-ACL')

module.exports = {
  up: async (app, callback) => {
    const { Role, RoleMapping, User } = app.models;

    await app.dataSources.db.autoupdate(['Role', 'RoleMapping']);

    debug('Limpando tabelas');
    await Role.destroyAll();
    await RoleMapping.destroyAll();
    await User.destroyAll();

    const roleCreated = await Role.create([
      { name: 'admin', description: 'Administrador' },
      { name: 'employee', description: 'Colaborador' },
      { name: 'client', description: 'Cliente' }
    ]);

    const userCreated = await User.create({
      realm: 'unirede',
      username: 'admin',
      email: 'admin@unirede.net',
      password: '123qwe!@#',
      emailVerified: true
    });

    debug('roleCreated', roleCreated);
    debug('userCreated', userCreated);
    if (roleCreated && roleCreated.length && userCreated) {
      await roleCreated[0].principals.create({
        principalType: RoleMapping.USER,
        principalId: userCreated.id
      });
    }

    callback();
  },

  down: (app, callback) => { callback(); },
};
