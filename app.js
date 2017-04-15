let express = require('express');
let path = require('path');
let exphbs = require('express-handlebars');
let bodyParser = require('body-parser');
let cassandra = require('cassandra-driver');

let client = new cassandra.Client({contactPoints:['127.0.0.1']});
client.connect((err, result) => {
});

let routes = require('./routes/index');
let doctors = require('./routes/doctors');
let categories = require('./routes/categories');

let app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

let query = "SELECT * FROM findadoc.categories";
  client.execute(query, [], (err, results) => {
    if(err){
      res.status(404).send({msg: err});
    } else {
     app.locals.cats = results.rows;
    }
  });


app.use('/', routes);
app.use('/doctors', doctors);
app.use('/categories', categories);

app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), () => {
	console.log('Server started on port: '+app.get('port'));
});
