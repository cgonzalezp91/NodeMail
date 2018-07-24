const sql = require('mssql')
const { configdb } = require('../../config/keys')

async function getUsers () {
  try {
    let pool = await sql.connect(configdb)
    let result1 = await pool.request()
      // .input('input_parameter', sql.Int, value)
      .query('select top 10 usuario_id,nombre, email from users ') // where id = @input_parameter

    // console.log(JSON.stringify(result1))
    // let html = tableify(JSON.stringify(result1).recordsets)
    // console.log(html)
    pool.close()
    sql.close()
    return (result1)
  } catch (err) {
    sql.close()
    console.log(err)
  }
}

sql.on('error', err => {
  // ... error handler
  console.log(err)
})

module.exports = getUsers
