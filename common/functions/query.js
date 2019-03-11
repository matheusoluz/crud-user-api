'use strict';

/**
 * Otiizações para o comando QueryExecute!
 * @param {string} stmt Comando Query a ser executado
 * @param {object} params Parâmetos do comando Query a ser executado
 * @param {Function(Error, object)} callback
 */
module.exports = db => function(stmt, params = {}, callback = () => { }) {
  const regexSQLParams = /\@([\w.$]+|"[^"]+"|'[^']+')/g;
  let args = stmt.match(regexSQLParams);
  if (args) args = args.map(Field => params[Field.replace('@', '')]);
  const sql = stmt.replace(regexSQLParams, '(?)');

  return new Promise((resolve, reject) => {
    db.connector.execute(sql, args, (Err, Rows) => {
      if (Err) reject(Err);
      else resolve(Rows);

      callback(Err, Rows);
    });
  });
};

