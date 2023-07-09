const mysql = require('mysql');

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "@@root123Edu",
    database: "CjrProcessoTrainee",
});

const query = 'SELECT * FROM users WHERE email = ?';
connection.connect();
connection.query(query, ["lindo@gmail.com"], function(err, result) {
    return console.log(result.length);
})

