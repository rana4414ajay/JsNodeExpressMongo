const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'Ajay_Rana',
    password: 'rana_ajay14',
    database: 'airbnb',
})

module.exports = pool.promise();