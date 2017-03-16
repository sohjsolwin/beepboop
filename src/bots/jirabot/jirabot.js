var JiraBot = (function() {
    var RestClient = require('node-rest-client-promise').Client;
    var client = new RestClient();

    var isInit = false;

    var session = undefined;

    var baseUrl = "";

    var searchFunction = function(searchParams) {
        // Get the session information and store it in a cookie in the header
            var searchArgs = {
                    headers: {
                            // Set the cookie from the session information
                            cookie: session.name + '=' + session.value,
                            "Content-Type": "application/json"
                    },
                    data: {
                            // Provide additional data for the JIRA search. You can modify the JQL to search for whatever you want.
                            jql: searchParams.jql
                    }
            };
            // Make the request return the search results, passing the header information including the cookie.
            return client.postPromise(baseUrl +"/rest/api/2/search", searchArgs);
    };

    var createFunction = function(createParams) {
        // Get the session information and store it in a cookie in the header
            var createArgs = {
                headers: {
                        // Set the cookie from the session information
                        cookie: session.name + '=' + session.value,
                        "Content-Type": "application/json"
                },
                data: {
                    "fields": {
                        "project":
                        {
                            "key": createParams.projectKey
                        },
                        "summary": createParams.summary,
                        "description": createParams.description,
                        "issuetype": {
                            "name": createParams.issueTypeName
                        }
                    }
                }
            };
            
            return client.postPromise(baseUrl +"/rest/api/2/issue", searchArgs);
    };

    return {
        /*
            initParams = {
                baseUrl: string
            }
        */
        init: function(initParams) {
            baseUrl = initParams.baseUrl;
            isInit = true;
        },
        /*
            authParams = {
                username: string,
                password: string,
            }
        */
        auth: function(authParams) {
            if (!isInit) return new Promise(function(resolve, reject) { reject({connected: false, statusCode: 400, message: 'JiraBot has not been initialized. Init first.'}); });

            var loginArgs = {
                data: {
                    "username": authParams.username,
                    "password": authParams.password
                },
                headers: {
                    "Content-Type": "application/json"
                } 
            };

            return client.postPromise(baseUrl +"/rest/auth/1/session", loginArgs).then(function(res){
                return new Promise(function(resolve, reject) { 
                    if (res.response.statusCode == 200) {
                        session = res.data.session;
                        resolve({ connected: true, statusCode: 200, message: 'Connection Successful.' });
                    }
                    else {
                        session = undefined;
                        reject({ connected: false, statusCode: res.response.statusCode, message: res.response.message });
                    }
                });
            });
        },
        /*  
            execParams = {
               action: string
               data: object
            }
        */
        execute: function(execParams) {
            if (!isInit) return new Promise(function(resolve, reject) { reject({results: undefined, statusCode: 400, message: 'JiraBot has not been initialized. Init first.'}); });
            if (typeof session === 'undefined') return new Promise(function(resolve, reject) { reject({results: undefined, statusCode: 403, message: 'JiraBot has not been authenticated. Auth first.'}); });

            var functionToRun = undefined;
            if (execParams.action === 'create') {
                functionToRun = createFunction;
            } else {
                functionToRun = searchFunction;
            }

            return functionToRun(execParams.data).then(function(results) {
                return new Promise(function (resolve, reject) {
                    if (results.response.statusCode == 200) {
                        resolve({results: results.data, statusCode: 200, message: "Results Found" });
                    } else {
                        reject({results: undefined, statusCode: results.response.statusCode, message: results.response.message });
                    }
                });
            });
        }
    };
})();


module.exports = JiraBot; 