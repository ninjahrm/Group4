const mysql = require('mysql2/promise');

const dbConfig = {
  host: '49.249.28.218',      // change as per your DB
  port: 3333,
  user: 'root@%',
  password: 'root',
  database: 'crm',
};

/*connection.connect((error) => {
  if(error){
    console.log('Error connecting to the MySQL Database');
    return;
  }
  console.log('Connection established sucessfully');
});
connection.end((error) => {
});*/

async function queryDB(sql, params = []) {
  const connection = await mysql.createConnection(dbConfig);
  try {
    const [rows] = await connection.execute(sql, params);
    return rows;
  } finally {
    await connection.end();
  }
}

module.exports = { queryDB };