/**
 * Module dependencies.
 */
var express = require('express');
//var routes = require('./routes');
var http = require('http');
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');
var fs = require('fs');
//load customers route
var customers = require('./routes/customers'); 
var users = require('./routes/users'); 
var organizations = require('./routes/organizations'); 
var accesspoints = require('./routes/accesspoints'); 
var app = express();
var connection  = require('express-myconnection'); 
//var mysql = require('mysql');
var sess=null;	
// all environments
app.set('port', process.env.PORT || 4300);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.use(express.favicon());
app.use(session({secret: 'ssshhhhh'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser({ keepExtensions: true, uploadDir:'/Users/prashantyadav/Documents/images/uploads' }));
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
//Enables CORS
app.use(function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	  next();
	});
app.post('/badge/login', customers.logindo);
app.get('/', customers.login);
app.get('/scan', customers.scan);
app.get('/test', customers.test);
app.get('/home', customers.home);
app.options('/badge/login', customers.options);
app.get('/verify/:email', customers.verify);


//--------------Our Use Cases----

//Organizations Routes

app.get('/organizations', organizations.orgList);
app.get('/organizations/add', organizations.addOrganization);
app.post('/organizations', organizations.saveOrg);
app.get('/organizations/delete/:id', organizations.deleteOrganization);
app.get('/organizations/edit/:id', organizations.editOrg);
app.post('/organizations/:id', organizations.saveDetails);

//Users Routes

app.get('/users/register', users.addUser);
app.post('/users/register', users.saveUser);//route delete customer
app.get('/organizations/:id/users', users.usersList);
app.get('/organizations/:org_id/users/delete/:user_id', users.delete_user);//edit customer route , get n post
app.get('/organizations/:org_id/users/edit/:user_id', users.editUser);
app.post('/organizations/:org_id/users/edit/:user_id',users.save_edit_user);

//Accesspoints Routes

app.get('/organizations/:org_id/accesspoints', accesspoints.getAccessPoints);
app.get('/organizations/:org_id/accesspoints/add', accesspoints.addAccessPoints);
app.post('/organizations/:org_id/accesspoints/', accesspoints.saveAccessPoints);
app.get('/organizations/:org_id/accesspoints/delete/:id', accesspoints.deleteAccessPoints);
app.get('/organizations/:org_id/accesspoints/edit/:id', accesspoints.editAccessPoints);
app.post('/organizations/:org_id/accesspoints/:id', accesspoints.saveDetailsAccessPoints);


//-----------------------------------------------------------------

app.use(app.router);
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});