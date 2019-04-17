// plugin_mssql.js
const mssql = require('msnodesqlv8') // NODE-SQLSERVER-V8
const ERR_OPEN_DB = 'MSSQLの命令を使う前に『MSSQL逐次開く』でデータベースを開いてください。';
const ERR_ASYNC = '『逐次実行』構文で使ってください。';
const PluginMSSQL = {
  '初期化': {
    type: 'func',
    josi: [],
    fn: function (sys) {
      sys.__mssql_db = null
    }
  },
  // @SQLServer
  'MSSQL逐次開': { // @逐次実行構文にてデータベースを開く // @MSSQLちくじひらく
    type: 'func',
    josi: [['を', 'の', 'で']],
    fn: function (s, sys) {
      if (!sys.resolve) throw new Error('『MSSQL開』は' + ERR_ASYNC)
      sys.resolveCount++
      const resolve = sys.resolve
      mssql.open(s, function (err, db) {
        if (err) {
          throw new Error('MSSQL接続エラー:' + err.message)
        }
        sys.__mssql_db = db
        resolve()
      })
    }
  },
  'MSSQL逐次実行': { // @逐次実行構文にて、SQLとパラメータPARAMSでSQLを実行し、変数『対象』に結果を得る。 // @MSSQLちくじじっこう
    type: 'func',
    josi: [['を'], ['で']],
    fn: function (sql, params, sys) {
      if (!sys.resolve) throw new Error(ERR_ASYNC)
      sys.resolveCount++
      const resolve = sys.resolve
      if (!sys.__mssql_db) throw new Error(ERR_OPEN_DB)
      sys.__mssql_db.query(sql, params, function (err, rows) {
        if (err) {
          throw new Error('MSSQL逐次実行のエラー『' + sql + '』' + err.message)
        }
        sys.__v0['対象'] = rows
        resolve()
      })
    },
    return_none: true
  },
  'MSSQL逐次閉': { // @開いているデータベースを閉じる // @MSSQLとじる
    type: 'func',
    josi: [],
    fn: function (sys) {
      if (!sys.__mssql_db) throw new Error(ERR_OPEN_DB)
      if (!sys.resolve) throw new Error(ERR_ASYNC)
      sys.resolveCount++
      const resolve = sys.resolve
      if (!sys.__mssql_db) throw new Error(ERR_OPEN_DB)
      sys.__mssql_db.close(function (err) {
        resolve()
      })
    },
    return_none: true
  },
}

module.exports = PluginMSSQL

