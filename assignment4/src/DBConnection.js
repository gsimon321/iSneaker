const mysql = require('mysql2');


// A function that returns a connection link to the GoogleCloud database.
function newConnection(){

    let conn = mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'SE3309root#',
        database:'iSneaker',
        multipleStatements: true
    });
    
    return conn;
}


module.exports = newConnection;
