var mysqldb = require('../mysqldb.js');
var util = require('util');
var crypto = require('crypto');
function randomValueHex (len) {
    return crypto.randomBytes(Math.ceil(len/2))
        .toString('hex') // convert to hexadecimal format
        .slice(0,len);   // return required number of characters
}
var value = randomValueHex(7); 

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