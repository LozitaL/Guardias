import mysql from 'mysql2';

const db = mysql.createConnection({
  host: 'localhost',  
  user: 'root',
  password: 'admin',
  database: 'profesores',
});

export default db;
