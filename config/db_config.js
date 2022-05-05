const mysql = require('mysql2');
const db_config = require('./db_config.json');

var conn = mysql.createConnection({
    host : db_config.host,
    user : db_config.username,
    password : db_config.password,
    database : db_config.database
});

conn.connect();

module.exports = conn;