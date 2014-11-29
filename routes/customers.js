var mysqldb = require('../mysqldb.js');
var util = require('util');
var flash = require('req-flash');
var crypto = require('crypto');

function randomValueHex (len) {
    return crypto.randomBytes(Math.ceil(len/2))
        .toString('hex') // convert to hexadecimal format
        .slice(0,len);   // return required number of characters
}
var value = randomValueHex(7);
var express = require('express'),
app = express();
app.use(express.bodyParser());
/*
 * GET users listing.
 */

exports.list = function(req, res) {
    var coneection = mysqldb.getConnection();
    connection.query('SELECT * FROM customer', function(err, rows) {
        if (err)
            console.log("Error Selecting : %s ", err);
        res.render('customers', {
            page_title: "Customers - Node.js",
            data: rows
        });
    });
    connection.end();

};

exports.listCategory = function(req, res) {
    // console.log(req.session.fname);
    // if(req.session.fname == undefined){
    // res.redirect("/");
    // }
    // else{
    var connection = mysqldb.getConnection();
    connection.connect();
    connection.query('SELECT * from category', function(err, rows) {
        if (err)
            console.log("Error getting vlaues % s", err);
        res.render('categories', {
            page_title: "Categories",
            data: rows,
            isAdmin: sess.isAdmin,
            name: sess.fname,
            email: sess.email,
            lastlogin: sess.lastlogin
        });
    });
    connection.end();
    // }
}

exports.signup = function(req, res) {
    res.render('signup', {
        page_title: "Sign Up"
    });
}
exports.add = function(req, res) {
    res.render('add_customer', {
        page_title: "Add Customers"
    });
}

exports.addCategory = function(req, res) {
    // if(req.session.fname == undefined){
    // res.redirect("/");
    // }
    // else{
    var input = JSON.parse(JSON.stringify(req.body));
    var data = {
        name: input.name,
        description: input.description,
    };
    var connection = mysqldb.getConnection();
    console.log(data);
    connection.connect();
    var query = connection.query("Insert into category set ? ", data, function(err, rows) {
        if (err)
            console.log("Error inserting : %s", err);
        res.redirect('/home');
        // res.render('categories', {page_title:"Categories", data:rows,
        // name:sess.fname, lastlogin: sess.lastlogin, email :sess.email});
    });
    connection.end();
    // }
}

exports.addElement = function(req, res) {
    // if(req.session.fname == undefined){
    // res.redirect("/");
    // }
    // else {
    //
    var input = JSON.parse(JSON.stringify(req.body));
    var data = {
        name: input.name,
        description: input.description,
        address: input.address,
        total_reviews: 0,
        category_name: input.category_name
    };
    var connection = mysqldb.getConnection();
    console.log(data);
    connection.connect();

    var query = connection.query("Insert into element set ? ", data, function(err, rows) {
        if (err)
            console.log("Error inserting : %s", err);
        res.redirect('/getDetails/' + data.category_name);
    });
    connection.end();
    // }

}
exports.edit = function(req, res) {
    var id = req.params.id;
    req.getConnection(function(err, connection) {
        connection.query('select * from customer where id = ?', [id],
            function(err, rows) {
                if (err) {
                    cosole.log("error : %s", err);
                }
                res.render('edit_customer', {
                    page_title: "Edit Customers",
                    data: rows
                });
            });
    });
};

exports.save = function(req, res) {
    // var input = JSON.parse(JSON.stringify(req.body));
    // console.log(input);
    // var connection = mysqldb.getConnection();
    // connection.connect();
    // var data = {
    // firstName : input.firstName,
    // lastName : input.lastName,
    // email : input.email,
    // password : input.password,
    // isAdmin : 'N',
    // lastlogin: new Date()
    // };
    // console.log(data);
    // var query = connection.query("Insert into users set ? ", data,
    // function(err, rows){
    // if(err)
    // console.log("Error inserting : %s", err);
    // res.redirect('/');
    // });
    // connection.end();
    var rest = require('restler');

    rest.get('http://localhost:8080/NewGumBall/machines').on('complete',
        function(result) {
            if (result instanceof Error) {
                console.log('Error:', result.message);
                this.retry(5000); // try again after 5 sec
            } else {
                console.log(result);
            }
        });

}
exports.login = function(req, res) {
    // console.log(mysqldb.getName());
    res.render('login', {
        page_title: "Login"
    });
};
exports.scan = function(req, res) {
    // console.log(mysqldb.getName());
    res.render('scan', {
        page_title: "Scan"
    });
};

exports.logindo = function(req, res) {
    if (req.method === 'OPTIONS') {
        console.log('!OPTIONS');
        var headers = {};
        // IE8 does not allow domains to be specified, just the *
        // headers["Access-Control-Allow-Origin"] = req.headers.origin;
        headers["Access-Control-Allow-Origin"] = "*";
        headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
        headers["Access-Control-Allow-Credentials"] = false;
        headers["Access-Control-Max-Age"] = '86400'; // 24 hours
        headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
        res.writeHead(200, headers);
        res.end();
    } else {
        console.log(req.body);
        var input = JSON.parse(JSON.stringify(req.body));
        var connection = mysqldb.getConnection();
        var data = {
            email: input.userid,
            password: input.password,
        };
        connection.connect();
        console.log("das" + data);
        var result = 'false';
        var query = connection.query("SELECT * from user WHERE email = ? ", [data.email], function(err, rows) {
            if (err)
                console.log("Error fecthing details : %s", err);
            if (rows[0] == undefined) {
                result = 'false';
            }
            if (rows[0].password == data.password) {
                // sess = req.session;
                // console.log(req.session);
                // console.log(rows[0].firstName);
                // sess.fname = rows[0].firstName;
                // sess.lname = rows[0].lastName;
                // sess.email = rows[0].email;
                console.log(rows);
                result = 'true';

            } else {
                res.redirect('/');
            }
            console.log(result);
            res.json({
                "email": data.email,
                "result": result
            });
            // res.end(result);
        });
    }

}

///////prashant luthra/////////

exports.listAccessPoints = function(req, res){
	var connection = mysqldb.getConnection();
	connection.connect();
	connection.query('SELECT * from accesspoints', function(err, rows){
		if(err)
			console.log("Error getting values % s", err);
		res.render('listAccessPoints', {page_title:"AccessPoints", data:rows});
	});
	connection.end();
	//}
}

exports.showUserAccess = function(req,res){
	var id = req.params.id;
	var connection = mysqldb.getConnection();
	connection.connect();
	connection.query("SELECT ap.id as ap_id,ap.name as ap_name, u.firstname as firstname,u.lastname as lastname, a.user_id as user_id, a.isAllowed as isAllowed, a.valid_upto as valid_upto from accesspoints ap join access a join user u WHERE a.access_id = ap.id AND a.user_id= u.id AND a.access_id = ?", [id], function(err, rows){
		if(err)
			console.log("Error fetching results : %s", err);
		console.log(rows);
/*		var validity = rows[0].valid_upto.toString();
		validity = validity.substring(0, validity.length-42);
		console.log(validity);*/
		res.render('showUserAccess',{page_title:"Access to Users", data: rows,ap_name:rows[0].ap_name,ap_id:rows[0].ap_id});
	});
	connection.end();
}

exports.assignAccess = function(req,res){
	var id = req.params.id;
	console.log("id: " +id);
	var connection = mysqldb.getConnection();
	connection.connect();
	connection.query("SELECT * from user", function(err, rows){
		if(err)
			console.log("Error getting values % s", err);
		//console.log("Users: "+ rows[0].email);
		res.render('assignAccess', {page_title:"Assign Access", data:rows, ap_id: id});
		
	});
	connection.end();
}

exports.postAccess = function(req, res){
		//var user_id = req.params.user_id;
		var ap_id = req.params.id;
		console.log("ap_id: "+ ap_id);
		
		var input = JSON.parse(JSON.stringify(req.body));
		console.log(input);
		var connection = mysqldb.getConnection();
		connection.connect();
		
		//console.log(valid_string);
		var data1 = {
					access_id: ap_id,
					user_id : input.user,
					isAllowed: 1,
					valid_upto : input.validity,
				};
				console.log(data1);
				connection.query("Insert into access set ?", data1, function(err,rows1){
					if(err)
						console.log("Error inserting : %s", err);
					else
						{
						connection.query("SELECT ap.id as ap_id,ap.name as ap_name, u.firstname as firstname,u.lastname as lastname, a.user_id as user_id, a.isAllowed as isAllowed, a.valid_upto as valid_upto from accesspoints ap join access a join user u WHERE a.access_id = ap.id AND a.user_id= u.id AND a.access_id = ?", [ap_id], function(err, rows){
							if(err)
								console.log("Error fetching results : %s", err);
							console.log(rows);
							res.render('showUserAccess',{page_title:"Access to Users", data: rows,ap_name:rows[0].ap_name,ap_id:rows[0].ap_id});
						});
						connection.end();
						}
				});
			
		
}

exports.updateUserAccess = function(req,res){
	var us_id = req.params.id;
	console.log(us_id);
	var connection = mysqldb.getConnection();
	connection.connect();
	var queryString = 'SELECT u.id as u_id,u.email as email, a.access_id as access_id, a.isAllowed as isAllowed, a.valid_upto as valid_upto FROM user u JOIN access a WHERE u.id = a.user_id AND a.user_id = ?';
	connection.query(queryString, [us_id], function(err, rows){;
		if(err)
			console.log("Error getting values % s", err);
		console.log("Rows(email): "+rows[0].email);
		console.log("Rows(): "+rows[0].valid_upto);
		res.render('updateUserAccess', {page_title:"Update user access", data:rows[0], valid_temp:rows[0].valid_upto, email_temp: rows[0].email, allowed_temp: rows[0].isAllowed});
		//console.log(data);
		
	});
	
	connection.end();
}

exports.postUpdate = function(req,res){
	var id = req.params.id;
	console.log(id);
	
	var input = JSON.parse(JSON.stringify(req.body));
	console.log(input);
	console.log(typeof(input.validity));
	//var validity = new Date(input.validity);
	//console.log(typeof(validity));
	var connection = mysqldb.getConnection();
	connection.connect();
	
	var data = {
			isAllowed : input.isallowed,
			valid_upto : input.validity,
	};

	var	query = connection.query("UPDATE access set ? where user_id =? AND access_id = ?",[data, id,input.access_id],function(err,rows){
		if(err)
			console.log("Error Inserting: %s",err);
		else
			{
			connection.query("SELECT ap.id as ap_id,ap.name as ap_name, u.firstname as firstname,u.lastname as lastname, a.user_id as user_id, a.isAllowed as isAllowed, a.valid_upto as valid_upto from accesspoints ap join access a join user u WHERE a.access_id = ap.id AND a.user_id= u.id AND a.access_id = ?", [input.access_id], function(err, rows){
				if(err)
					console.log("Error fetching results : %s", err);
				console.log(rows);
				res.render('showUserAccess',{page_title:"Access to Users", data: rows,ap_name:rows[0].ap_name,ap_id:rows[0].ap_id});
			});
			connection.end();
			}
		//connection.end();
	});
}


////////// PL - end////////////



exports.get_reviews = function(req, res) {
    var name = req.params.name;
    // if(req.session.fname == undefined){
    // res.redirect("/");
    // }
    // else {
    var connection = mysqldb.getConnection();

    connection.query("Select * from reviews where element_name = ?", [name],
        function(err, rows) {
            if (err)
                console.log("Error fetching results : %s", err);
            res.render('get_reviews', {
                page_title: "Categories",
                data: rows,
                element_name: name,
                name: sess.fname,
                lastlogin: sess.lastlogin,
                email: sess.email
            });
        });
    connection.end();
    // }

}

exports.save_edit = function(req, res) {
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.params.id;
    req.getConnection(function(err, connection) {
        var data = {
            name: input.name,
            address: input.address,
            email: input.email,
            phone: input.phone

        };

        connection.query("UPDATE customer set ? WHERE id = ? ", [data, id],
            function(err, rows) {

                if (err)
                    console.log("Error Updating : %s ", err);

                res.redirect('/customers');

            });

    });
};

exports.delete_customer = function(req, res) {

    var id = req.params.id;

    req.getConnection(function(err, connection) {

        connection.query("DELETE FROM customer  WHERE id = ? ", [id],
            function(err, rows) {

                if (err)
                    console.log("Error deleting : %s ", err);

                res.redirect('/customers');

            });

    });
};



exports.logout = function(req, res) {
    var email = sess.email;
    var lastlogin = new Date();
    console.log(email);
    req.session.destroy(function(err) {
        if (err) {
            console.log(err);
        } else {
            var connection = mysqldb.getConnection();

            connection.query("UPDATE users set lastlogin = ? WHERE email = ? ", [lastlogin, email], function(err, rows) {
                if (err) {
                    cosole.log("error : %s", err);
                }
                res.redirect('/');
            });

            connection.end();
        }
    });
}

exports.getHistoryPage = function(req, res) {
    res.render('History', {
        page_title: "",
        dataVar: "ABC"
    });
}

exports.getBiddingHistory = function(req, res) {
    var connection = mysqldb.getConnection();
    var id = 1 // session user-id
    connection
        .query(
            "select p.id as purchase_id, pr.id as product_id, pr.name as product_name, pr.details as product_details, " + " pr.image, s.id as seller_id," + " s.firstname as seller_name, s.membership_no as membership_no, p.bid_amount, p.submitted_on, p.rating " + " from Purchase p JOIN Products pr" + " ON p.product_id = pr.id " + " JOIN person s ON s.id = pr.seller_id " + " WHERE p.customer_id = ? AND pr.isForAuction = 1", [id],
            function(err, rows) {
                if (err)
                    console.log("Error fetching results : %s", err);
                console.log(rows + "************");
                res.render('BiddingHistory', {
                    page_title: "",
                    dataVar: rows
                });
            });

    connection.end();
}

exports.getPurchaseHistory = function(req, res) {
    var connection = mysqldb.getConnection();
    var id = 1 // session user-id
    connection
        .query(
            "	select p.id as purchase_id, pr.id as product_id, pr.name " + " as product_name,pr.details as product_details, pr.image, s.id " + " as seller_id,s.firstname as seller_name, p.bid_amount, " + " p.submitted_on, p.rating " + " from Purchase p JOIN Products pr ON p.product_id = pr.id JOIN person s " + " ON s.id = pr.seller_id WHERE p.customer_id = ? AND p.sold=1", [id],
            function(err, rows) {
                if (err)
                    console.log("Error fetching results : %s", err);
                console.log(rows + "************");
                res.render('BiddingHistory', {
                    page_title: "",
                    dataVar: rows
                });
            });

    connection.end();
}

exports.getSellingHistory = function(req, res) {
    var connection = mysqldb.getConnection();
    var id = 2 // session user-id
    connection
        .query(
            "select p.id as purchase_id, pr.id as product_id, pr.name as product_name, pr.image as image, " + " s.id as seller_id, s.firstname as seller_name, p.bid_amount as bid_amount, p.submitted_on, p.rating, " + " c.firstname as customer_name, c.id as customer_id, p.quantity " + " from Purchase p JOIN Products pr ON p.product_id = pr.id " + " JOIN person s ON s.id = pr.seller_id JOIN  person c " + " ON c.id = p.customer_id WHERE pr.seller_id = 2 AND p.sold=1", [id],
            function(err, rows) {
                if (err)
                    console.log("Error fetching results : %s", err);
                console.log(rows + "************");
                res.render('SellingHistory', {
                    page_title: "",
                    dataVar: rows
                });
            });

    connection.end();
}

exports.imageForm = function(req, res) {
    res.render('upload', {
        title: 'Upload Images'
    });
};

exports.options = function(req, res) {
    console.log('!OPTIONS');
    var headers = {};
    // IE8 does not allow domains to be specified, just the *
    // headers["Access-Control-Allow-Origin"] = req.headers.origin;
    headers["Access-Control-Allow-Origin"] = "*";
    headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
    headers["Access-Control-Allow-Credentials"] = false;
    headers["Access-Control-Max-Age"] = '86400'; // 24 hours
    headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
    res.writeHead(200, headers);
    res.end();
}
exports.uploadImage = function(req, res, next) {
    // console.log('file info: ',req.files.image);

    // split the url into an array and then get the last chunk and render it out
    // in the send req.
    var pathArray = req.files.image.path.split('/');

    var ts = new Date();
    console.log('A : ' + req.files.image.name);
    console.log('A1 : ' + req.files.image.size);
    console.log('A2 : ' + req.files.image.path);
    console.log('A3 : ' + req.body.title);
    console.log('A4 : ' + req.files.image);
    console.log('A5 :' + pathArray)

    var fs = require('fs');
    fs.rename(req.files.image.path,
        '/Users/prashantyadav/Documents/images/uploads/AF.png',
        function(err) {
            if (err)
                console.log('ERROR: ' + err);
        });

    res
        .send(util
            .format('<img src="/Users/prashantyadav/Documents/images/uploads/AF.png">'));
};

exports.verify = function(req, res) {
    var text = req.params.email;
    var param = text.split(",");
    var email = param[0];
    var hash = param[1];

    var connection = mysqldb.getConnection();
    connection.connect();
    console.log(email + " : " + hash);
    var result = null;
    var query = connection.query(
        "select u.user_id from user u join Access a on u.id = a.user_id " + "join AccessPoints ap on ap.id = a.access_id " + "WHERE u.email = ? and ap.access_point_id = ? " + "and a.isAllowed = 1 and a.valid_upto > now()", [email,
            hash
        ],
        function(err, rows) {
            if (err)
                console.log("Error fecthing details : %s", err);
            if (rows[0] == undefined) {
                result = 'false';
            } else {
                console.log(rows);
                result = 'true';

            }
            console.log(result);
            res.send(result);
            // res.end(result);
        });

}
exports.home = function(req, res) {
    res.render('admin-home');
}
exports.test = function(req, res) {
    res.render('index-1');
}

exports.orgList = function(req, res) {
    var connection = mysqldb.getConnection();
    connection.connect();
    connection.query('SELECT * FROM organization', function(err, rows) {

        if (err)
            console.log("Error Selecting : %s ", err);

        console.log(rows);
        res.render('organizations', {
            page_title : "All Organizations - Node.js",
            data : rows
        });
    });
    connection.end();
};

exports.usersList = function(req, res) {
    var org_id = req.params.id;
    console.log(org_id);
    var connection = mysqldb.getConnection();
    connection.connect();
    connection.query("SELECT * FROM user where org_id = ?", [ org_id ],
            function(err, rows) {

                if (err)
                    console.log("Error Selecting : %s ", err);
                console.log(rows);

                res.render('users', {
                    page_title : "users - Node.js",
                    data : rows
                });

            });
    connection.end();
};
exports.addUser = function(req, res) {
    res.render('add_user', {
        page_title : "Add Users-Node.js"
    });
};
exports.editUser = function(req, res) {
    console.log("here");
    var user_id = req.params.user_id;
    console.log(user_id);
    var connection = mysqldb.getConnection();
    console.log("here");
    connection.connect();
    connection.query('SELECT * FROM user WHERE user_id = ?', [ user_id ],
            function(err, rows) {

                if (err)
                    console.log("Error Selecting : %s ", err);
                console.log("here");
                res.render('edit_user', {
                    page_title : "Edit Users - Node.js",
                    data : rows
                });
            });
    console.log("here - editUser");
    connection.end();
};
/* Save the customer */
exports.saveUser = function(req, res) {
    console.log("Here");
    
    var input = JSON.parse(JSON.stringify(req.body));
    console.log(input);
    var connection = mysqldb.getConnection();
    connection.connect();
    var data = {

        firstname : input.firstname,
        lastname : input.lastname,
        email : input.email,
        user_id : input.user_id,
        contact : input.contact,
        isActive : 1,
        qr : null,
        org_id : req.body.org_id
    };
    console.log("Here");
    var query = connection.query("SELECT * from user WHERE email = ? ",[ data.email ],
                    function(err, rows) {
                        
                        if (err){
                                    console.log("Error fecthing details : %s", err);
                                    connection.end();
                                    res.redirect('/organizations/' + input.org_id+ '/users');
                        }
                        console.log("Found user:" + rows.length);
                        if (!rows.length) {
                            console.log("Here Insert query" + input.firstname + input.lastname);
                            connection.query("INSERT INTO user set firstname = '" + input.firstname + "',lastname = '" + input.lastname + "',email = '" + input.email + "', user_id = '"+value+"',password = SHA1('" + input.password + "'),contact = '" + input.contact + "',isActive = 1, org_id = '" + input.org_id + "';" ,
                                            function(err, rows) {
                                                if (err)
                                                    console.log("Error Inserting: %s",err);
                                                //req.flash('error','You are registerd.Please Login!');
                                                connection.end();
                                                res.redirect('/organizations/'+ input.org_id+ '/users');

                                            });

                        } else {
                            if (rows[0].email == input.email) {
                                //req.flash('error','Email ID already exists. Please try another email.');
                                connection.end();
                                res.redirect('/organizations/' + input.org_id+ '/users');
                                
                            }
                        }
                    });
    // console.log(query.sql); get raw query
    
};/* Save edited customer */

exports.save_edit_user = function(req, res) {
    console.log("save Edit User");
    var input = JSON.parse(JSON.stringify(req.body));
    var user_id = input.user_id;
    var firstname = input.firstname;
    var lastname = input.lastname;
    var email = input.email;
    var contact = input.contact;
    var isActive = req.body.isActive;
    var qr = req.params.qr;
    var org_id = req.body.org_id;
    var connection = mysqldb.getConnection();
    connection.connect();
    console.log(firstname);
    /*connection.query("UPDATE user SET firstname = '" + input.firstname + "',lastname = '" + input.lastname + "',email = '" + input.email + "',contact = '" + input.contact + "',isActive =" + req.body.isActive + ",org_id = " + req.body.org_id + "where user_id = '"+input.user_id+"';" ,
            function(err, rows) {
        if (err)
            console.log("Error Updating : %s ", err);
        console.log("save edit user ");
res.redirect('/organizations/' + input.org_id + '/users');
    });
    connection.end();
};*/
    var query = connection.query("SELECT * from user WHERE email = ? AND user_id != ?",[ input.email,input.user_id ],
            function(err, rows) {
                
                if (err){
                            console.log("Error fecthing details : %s", err);
                            connection.end();
                            res.redirect('/organizations/' + input.org_id+ '/users');
                }
                console.log("Found user:" + rows.length);
                if (!rows.length) {
                    console.log("Here Insert query" + input.firstname + input.lastname);
                    connection.query("Update `user` SET firstname = '" + input.firstname + "',lastname = '" + input.lastname + "',email = '" + input.email + "',password = SHA1('" + input.password + "'),contact = '" + input.contact + "',isActive =" + req.body.isActive + ", org_id = " + req.body.org_id + " where user_id = '"+input.user_id+"';"  ,
                                    function(err, rows) {
                                        if (err)
                                            console.log("Error Inserting: %s",err);
                                        //req.flash('error','You are registerd.Please Login!');
                                        connection.end();
                                        res.redirect('/organizations/'+ input.org_id+ '/users');

                                    });

                } else {
                    if (rows[0].email == input.email) {
                        //req.flash('error','Email ID already exists. Please try another email.');
                        connection.end();
                        res.redirect('/organizations/' + input.org_id+ '/users');
                        
                    }
                }
            });
// console.log(query.sql); get raw query

};

exports.delete_user = function(req, res) {
    var user_id = req.params.user_id;
    var org_id = req.params.org_id;
    console.log("here");
    console.log(user_id);
    console.log(org_id);
    var connection = mysqldb.getConnection();
    connection.connect();
    var data = {

        isActive : 0
    };

    connection.query("UPDATE user set ? WHERE user_id = ? ", [ data, user_id ],
            function(err, rows) {

                if (err)
                    console.log("Error deleting : %s ", err);

                res.redirect('/organizations/' + org_id + '/users');

            });
};

exports.getOrganization = function(req, res) {
    var connection = mysqldb.getConnection();
    connection.query('SELECT * FROM organization', function(err, rows) {
        if (err)
            console.log("Error Selecting : %s ", err);
        console.log(rows);
        res.render('view_org', {
            page_title : "view organizations",
            data : rows
        });
    });

    connection.end();

};

exports.addOrganization = function(req, res) {
    var connection = mysqldb.getConnection();
    connection.query('SELECT * FROM organization', function(err, rows) {
        if (err)
            console.log("Error Selecting : %s ", err);
        console.log(rows);
        res.render('add_org', {
            page_title : "add organizations",
            data : rows
        });
    });

    connection.end();

};

exports.save = function(req, res) {

    var input = JSON.parse(JSON.stringify(req.body));
    var data = {
        name : input.name,
        description : input.description,
    };
    var connection = mysqldb.getConnection();
    console.log(data);
    connection.connect();
    var query = connection.query("Insert into Organization set ?", data,
            function(err, rows) {
                if (err)
                    console.log("Error inserting : %s", err);
                res.redirect('/organizations');
            });
    connection.end();
}

exports.home = function(req, res) {
    var connection = mysqldb.getConnection();
    connection.query('SELECT * FROM Organization', function(err, rows) {
        if (err)
            console.log("Error Selecting : %s ", err);
        console.log(rows);
        res.render('home', {
            page_title : "home",
            data : rows
        });
    });

    connection.end();

};

exports.editOrganization = function(req, res) {

    var connection = mysqldb.getConnection();
    var query = connection.query('SELECT * FROM Organization', function(err,
            rows) {
        if (err)
            console.log("Error Selecting : %s ", err);
        console.log(rows);
        res.render('edit_org', {
            page_title : "home",
            data : rows
        });
    });

    connection.end();

};

exports.editOrg = function(req, res) {
    console.log("Here");
    var id = req.params.id;
    console.log(id);
    var connection = mysqldb.getConnection();
    connection.connect();
    var query = connection.query("select * from Organization WHERE id = ?",
            [ id ], function(err, rows) {
                if (err)
                    console.log("Error inserting : %s", err);
                console.log(rows);

                res.render('edit_org', {
                    page_title : "Details",
                    data : rows,
                    id : rows[0].id,
                    name : rows[0].name,
                    description : rows[0].description

                })
            });
    connection.end();
}

exports.saveDetails = function(req, res) {

    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.params.id;
    var connection = mysqldb.getConnection();
    connection.connect();

    var data = {
        name : input.name,
        description : input.description,
    };
    var connection = mysqldb.getConnection();
    console.log(data);
    connection.connect();

    var query = connection.query(
            "UPDATE Organization set name=?, description = ? WHERE id = ?", [
                    data.name, data.description, id ], function(err, rows) {

                if (err)
                    console.log("Error Updating : %s ", err);
                console.log(rows);
                res.redirect('/organizations');

            });

};

exports.deleteOrganization = function(req, res) {

    var id = req.params.id;
    var connection = mysqldb.getConnection();
    connection.connect();

    var query = connection.query("DELETE FROM Organization WHERE id = ?", id,
            function(err, rows) {

                if (err)
                    console.log("Error deleting : %s ", err);

                res.redirect('/organizations');

            });
    connection.end();
}

/*
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * access points
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */

exports.getAccessPoints = function(req, res) {
    var org_id = req.params.org_id;
    var connection = mysqldb.getConnection();
    connection.query('SELECT * FROM AccessPoints where organization_id=?',
            [ org_id ], function(err, rows) {
                if (err)
                    console.log("Error Selecting : %s ", err);
                console.log(rows);
                res.render('view_accesspoints', {
                    page_title : "view acces points",
                    data : rows,
                    organization_id : org_id
                });
            });

    connection.end();

};

exports.addAccessPoints = function(req, res) {
    var org_id = req.params.org_id;

    res.render('add_accesspoints', {
        page_title : "add AccessPoints",
        org_id : org_id
    });
};

exports.saveAccessPoints = function(req, res) {
    var org_id = req.params.org_id;
    var input = JSON.parse(JSON.stringify(req.body));
    console.log("input ------" + input);
    var data = {
        name : input.name,
        organization_id : org_id
    };
    console.log("data.name" + data.name);
    var connection = mysqldb.getConnection();
    console.log(data);
    connection.connect();
    var query = connection.query("Insert into accesspoints set ?", data,
            function(err, rows) {
                if (err)
                    console.log("Error inserting : %s", err);
                res.redirect('/organizations/' + org_id + '/accesspoints');
            });
    connection.end();
}

exports.editAccessPoints = function(req, res) {
    var id = req.params.id;
    var org_id = req.params.org_id;
    var connection = mysqldb.getConnection();
    connection.connect();
    var query = connection.query(
            "select * from accesspoints WHERE id = ?", [ id ],
            function(err, rows) {
                if (err)
                    console.log("Error inserting : %s", err);
                console.log(rows);

                res.render('edit_accesspoints', {
                    page_title : "Details",
                    data : rows,
                    org_id : org_id,
                    id : id
                })
            });
    connection.end();
}

exports.saveDetailsAccessPoints = function(req, res) {

    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.params.id;
    var org_id = req.params.org_id;
    var connection = mysqldb.getConnection();
    connection.connect();

    var data = {
        id : id,
        name : input.name
    };
    var connection = mysqldb.getConnection();
    console.log(data);
    connection.connect();

    var query = connection.query("update accesspoints set name = '"+input.name+"', organization_id = "+org_id+" where id = "+id,
                    function(err, rows) {
                        if (err)

                            console.log("Error Updating : %s ", err);
                        console.log(rows);
                        res.redirect('/organizations/' + org_id + '/accesspoints');

                    });

};

exports.deleteAccessPoints = function(req, res) {

    var id = req.params.id;
    console.log(id);
    var org_id = req.params.org_id;

    console.log(org_id);
    var connection = mysqldb.getConnection();
    connection.connect();
    console.log("Called*****");
    var query = connection.query("DELETE FROM accesspoints WHERE id = ?",
            [ id ], function(err, rows) {

                if (err)
                    console.log("Error deleting : %s ", err);

                res.redirect('/organizations/' + org_id + '/accesspoints');

            });
    connection.end();
}
