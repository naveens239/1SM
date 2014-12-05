/**
 * All configurations are made here
 * eg. for switching database, mention the path of the module in dbpath, like  "./cassandra or './mongo', and mention the dbextension_module name"
 */
'use strict';

module.exports = {
    port       : process.env.PORT || 3000,
    dbconfig   : {
        dburl             : "localhost:27017/1SM"
    },
    "oauth"    : {
        "facebook": {
            "clientID"    : "813703648669257",
            "clientSecret": "39427539054aa777d7dfb76fe743e3b3",
            "callbackURL" : "http://1stopwed.com/auth/facebook/callback"
        },
        "twitter" : {
            "consumerKey"   : "39427539054aa777d7dfb76fe743e3b3",
            "consumerSecret": "j9hp6iYQZWBMFus5lYCZ7db0KmhMylNpOWUYA7ar8isoWk0tdb",
            "callbackURL"   : "http://1stopwed.com/auth/twitter/callback"
        },
        "google"  : {
            "clientID": "44376929588-eucb7ibmgft6m098t8f5afiajok36edb.apps.googleusercontent.com",
            "clientSecret"    : "AOrF78uP90X5qDPHvPqBRHfq",
            "callbackURL"   : "http://1stopwed.com/auth/google/callback"
        }
    }
}