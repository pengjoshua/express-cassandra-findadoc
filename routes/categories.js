let express = require('express');
let router = express.Router();
let cassandra = require('cassandra-driver');

let client = new cassandra.Client({contactPoints:['127.0.0.1']});
client.connect((err, result) => {
	console.log('Cassandra Connected');
});

router.get('/', (req, res, next) => {
  res.render('categories');
});

router.get('/add', (req, res, next) => {
  res.render('add-categories');
});

router.post('/add', (req, res, next) => {
  let cat_id = cassandra.types.uuid();
  let query = "INSERT INTO findadoc.categories(cat_id, name) VALUES(?,?)";

  client.execute(query,
  	[cat_id,
  	req.body.name
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
