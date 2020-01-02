// declaration mysql
const mysql = require('mysql');

// declaration express
const express = require('express');

// declaration body-parser
const bodyparser = require('body-parser');

// use json
var app = express();
app.use(bodyparser.json());

// declaration database 
var mysqlConnection = mysql.createConnection({
host: 'localhost',
user: 'root',
password: '',
database: 'goprot.com'
});

//  database connection
mysqlConnection.connect((err) => {
	if(!err) {
		console.log('DB Connecyion succeded');
	}else{
		console.log('DB Connecyion filed');
	}
});

app.listen(3000, () => {
console.log('server id donne');
});

app.get('/all_uers',(req, res) => {
mysqlConnection.query('SELECT * FROM users', (err, rows, fields) => {
	if(!err){
		res.send(rows);

	}else{
		console.log(err);
	}
});
});

// users specifique
app.get('/users/:id',(req, res) => {
mysqlConnection.query('SELECT * FROM users where id = ?',[req.params.id], (err, rows, fields) => {
	if(!err){
		res.send(rows);

	}else{
		console.log(err);
	}
});
});

//rest api to create a new record into mysql database
app.post('/charge', function (req, res) {
   var postData  = req.body;
   mysqlConnection.query('INSERT INTO charge SET ?', postData, function (error, results, fields) {
	  if (error) throw error;
	  res.end(JSON.stringify(results));
	});
});






