var express = require('express');
var router = express.Router();

var credentials = require('./credentials');
var baseUrl = 'https://jira.dealeron.com';

var JiraBot = require('./jirabot');

/* GET users listing. */
router.get('/', function(req, res, next) {

    console.log("attempting login");
    JiraBot.init({baseUrl: baseUrl});

    JiraBot.auth({username: credentials.username, password: credentials.password}).then(function(authRes) {
        if (authRes.connected) {
                console.log("success");
        } else {
                console.log("failure");
        }
        res.json(authRes);
    }, 
    function(authRes) {
        //auth failed. 
        console.log("failure");
        res.json(authRes);
    });
});

router.get('/search', function(req, res, next) {
    JiraBot.execute({jql: 'type=Bug AND status=Closed'}).then(function(execRes) {
        if (execRes.statusCode == 200) {
            console.log("search success");
            res.json(execRes);
        } else if (execRes.statusCode == 403) {
            console.log("search failure (login)");
            res.redirect('/jira');
        } else {
            console.log("search failure (other)");
            res.json(execRes);
        }
    }, 
    function(execRes) {
        if (execRes.statusCode == 403) {
            console.log("search failure (login)");
            res.redirect('/jira');
        } else {
            console.log("search failure (other)");
            res.json(execRes);
        }
    });
});

module.exports = router;

