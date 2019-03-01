'use strict';
const debug = require('debug')('Migration');

module.exports = async (app) => {
  debug('Atualizando o banco de dados');
  delete app.models.Migration.definition.settings.indexes;
  delete app.models.MigrationMap.definition.settings.indexes;

  await app.dataSources.db.autoupdate('Migration');
  await app.models.Migration.migrate('up');
  await app.dataSources.db.autoupdate(AutoUpdateTables);

  return undefined;
};

const modelConfig = require('../model-config.json');
const AutoUpdateTables = Object.entries(modelConfig)
  .filter(Model => Model[0] !== '_meta')
  .filter(Model => Model[1].dataSource === 'db')
  .filter(Model => {
    if (!Model[1].options) return true;
    return !(Model[1].options.ignoreMigrate === true);
  })
  .map(Model => Model[0]);
