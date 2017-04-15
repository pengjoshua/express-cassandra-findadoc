let express = require('express');
let router = express.Router();
let cassandra = require('cassandra-driver');

let client = new cassandra.Client({contactPoints:['127.0.0.1']});
client.connect((err, result) => {
	console.log('Cassandra Connected');
});

router.get('/', (req, res, next) => {
	if(req.query.state){
		let query = "SELECT * FROM findadoc.doctors WHERE state = ?";
		client.execute(query, [req.query.state], (err, results) => {
		if(err){
			res.status(404).send({msg: err});
		} else {
			res.render('doctors',{
				doctors: results.rows
			});
		}
	});
	} else {
		let query = "SELECT * FROM findadoc.doctors";
		client.execute(query, [], (err, results) => {
		if(err){
			res.status(404).send({msg: err});
		} else {
			res.render('doctors',{
				doctors: results.rows
			});
		}
	});
	}
});

router.get('/details/:id', (req, res, next) => {
	let query = "SELECT * FROM findadoc.doctors WHERE doc_id = ?";
	client.execute(query, [req.params.id], (err, result) => {
		if(err){
			res.status(404).send({msg: err});
		} else {
			res.render('details',{
				doctor: result.rows['0']
			});
		}
	});
});

router.get('/category/:name', (req, res, next) => {
  let query = "SELECT * FROM findadoc.doctors WHERE category = ?";
	client.execute(query, [req.params.name], (err, results) => {
		if(err){
			res.status(404).send({msg: err});
		} else {
			res.render('doctors',{
				doctors: results.rows
			});
		}
	});
});

router.get('/add', (req, res, next) => {
	let query = "SELECT * FROM findadoc.categories";
	client.execute(query, [], (err, results) => {
		if(err){
			res.status(404).send({msg : err});
		} else {
			//res.json(result);
			res.render('add-doctors', {
				categories: results.rows
			});
		}
	});
});

router.post('/add', (req, res, next) => {
  let doc_id = cassandra.types.uuid();
  let query = "INSERT INTO findadoc.doctors(doc_id, full_name, category, new_patients, graduation_year, practice_name, street_address, city, state) VALUES(?,?,?,?,?,?,?,?,?)";

  client.execute(query,
  	[doc_id,
  	req.body.full_name,
  	req.body.category,
  	req.body.new_patients,
  	req.body.graduation_year,
  	req.body.practice_name,
  	req.body.street_address,
  	req.body.city,
  	req.body.state,
  	], {prepare: true}, (err, result) => {
  		if(err){
  			res.status(404).send({msg: err});
  		} else {
	  		res.location('/doctors');
	  		res.redirect('/doctors');
  		}
  	});
});

module.exports = router;
