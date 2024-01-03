// plugin_mssql.js
import mssql from 'msnodesqlv8' // NODE-SQLSERVER-V8
const ERR_OPEN_DB = 'MSSQLの命令を使う前に『MSSQL開く』でデータベースを開いてください。';
const PluginMSSQL = {
  '初期化': {
    type: 'func',
    josi: [],
    fn: function (sys) {
      sys.__mssql_db = null
    }
  },
  // @SQLServer
  'MSSQL開': { // @データベースを開く // @MSSQLひらく
    type: 'func',
    josi: [['を', 'の', 'で']],
    asyncFn: true,
    pure: true,
    fn: function (s, sys) {
      return new Promise((resolve, reject) => {
        mssql.open(connStr, function (err, conn) {
          if (err) {
            reject(err)
            return
          }
          sys.__mssql_db = conn
          resolve(conn)
        })
      })
    }
  },
  'MSSQL実行': { // @SQLとパラメータPARAMSでSQLを実行し、変数『対象』に結果を得る。 // @MSSQLじっこう
    type: 'func',
    josi: [['を'], ['で']],
    asyncFn: true,
    pure: true,
    fn: function (sql, params, sys) {
      return new Promise((resolve, reject) => {
        if (!sys.__mssql_db) {
          reject(new Error(ERR_OPEN_DB))
          return
        }
        sys.__mssql_db.prepare(sql, (e, ps) => {
          if (e) {
            reject(e)
            return
          }
          ps.preparedQuery(params, (err, fetched)=>{
            if (err) {
              reject(err)
              return
            }
            sys.__v0['対象'] = fetched
            resolve(fetched)
            ps.free(()=>{})
          })
        })
      })
    },
    return_none: false
  },
  'MSSQL閉': { // @開いているデータベースを閉じる // @MSSQLとじる
    type: 'func',
    josi: [],
    asyncFn: true,
    pure: true,
    fn: function (sys) {
      return new Promise((resolve, reject) => {
        if (!sys.__mssql_db) {
          // reject(new Error(ERR_OPEN_DB)) // 開いていないなら何もしない
          resolve()
          return
        }
        sys.__mssql_db.close(function (err) {
          resolve()
        })
      })
    },
    return_none: true
  },
}

export default PluginMSSQL
// module.exports = PluginMSSQL

