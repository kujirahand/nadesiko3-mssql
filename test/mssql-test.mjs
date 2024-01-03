import assert from 'assert'
import { NakoCompiler } from 'nadesiko3/core/src/nako3.mjs'
import PluginNode from 'nadesiko3/src/plugin_node.mjs'
import PluginMSSQL from '../src/plugin_mssql.mjs'

const config = "server=.;Database=Master;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}"

describe('mssql_test', () => {
  // console.log(nako.gen.plugins)
  // nako.debug = true
  const cmp = async (code, res) => {
    const nako = new NakoCompiler()
    nako.addPluginObject('PluginNode', PluginNode)
    nako.addPluginObject('PluginMSSQL', PluginMSSQL)
      const g = await nako.runAsync(code)
    assert.strictEqual(g.log, res)
  }
  // --- test ---
  it('表示', async () => {
    await cmp('3を表示', '3')
    // await cmp('3を表示', '５')
  })
  // --- MSSQLのテスト ---
  it('MSSQL 作成', async () => {
    await cmp(
      `『${config}』をMSSQL開く。\n` +
      '「CREATE TABLE tt (id BIGINT, value BIGINT);」を[]でMSSQL実行\n' +
      'MSSQL閉じる。\n', ''
    )
  })
  it('MSSQL  挿入', async () => {
    await cmp(
      `『${config}』をMSSQL開く。\n` +
      '「BEGIN TRANSACTION」を[]でMSSQL実行\n' +
      '「INSERT INTO tt (id, value)VALUES(1,321);」を[]でMSSQL実行\n' +
      '「INSERT INTO tt (id, value)VALUES(?,?);」を[2,333]でMSSQL実行\n' +
      '「INSERT INTO tt (id, value)VALUES(3,222);」を[]でMSSQL実行\n' +
      '「COMMIT TRANSACTION」を[]でMSSQL実行\n' +
      'MSSQL閉じる。\n', ''
    )
  })
  it('MSSQL 抽出', async () => {
    await cmp(
      `『${config}』をMSSQL開く。\n` +
      'S=「SELECT * FROM tt ORDER BY id ASC LIMIT 1」を[]でMSSQL実行\n' +
      'SをJSONエンコードして表示\n', ''
    )
  })
  it('MSSQL 削除', async () => {
    await cmp(
      `『${config}』をMSSQL開く。\n` +
      '「DROP TABLE tt」を[]でMSSQL実行\n', ''
    )
  })
})
