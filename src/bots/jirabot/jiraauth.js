var express = require('express');
var router = express.Router();

var credentials = require('./credentials');


var baseUrl = 'https://jira.dealeron.com';
// Provide user credentials, which will be used to log in to JIRA.
var loginArgs = {
        data: {
                "username": credentials.username,
                "password": credentials.password
        },
        headers: {
                "Content-Type": "application/json"
        } 
};
var Client = require('node-rest-client').Client;
client = new Client();


var session = undefined;


/* GET users listing. */
router.get('/', function(req, res, next) {

    console.log("attempting login");
    client.post(baseUrl +"/rest/auth/1/session", loginArgs, function(data, response){
            console.log("Status: " + response.statusCode);
            if (response.statusCode == 200) {
                    console.log('succesfully logged in, session:', data.session);
                    session = data.session;
                    res.redirect('/jira/search');
            }
            else {
                    console.log("Login Failed");
                    res.send("Login failed :(");
            }
    });
});

router.get('/search', function(req, res, next) {
    if (typeof session === 'undefined') {
        console.log("not logged in, redirecting");
        res.redirect('/jira');
    }
    // Get the session information and store it in a cookie in the header
    var searchArgs = {
            headers: {
                    // Set the cookie from the session information
                    cookie: session.name + '=' + session.value,
                    "Content-Type": "application/json"
            },
            data: {
                    // Provide additional data for the JIRA search. You can modify the JQL to search for whatever you want.
                    jql: "type=Bug AND status=Closed"
            }
    };
    // Make the request return the search results, passing the header information including the cookie.
    client.post(baseUrl +"/rest/api/2/search", searchArgs, function(searchResult, response) {
            console.log('status code:', response.statusCode);
            console.log('search result:', searchResult);
            res.send(JSON.stringify(searchResult));
    });
});

module.exports = router;

