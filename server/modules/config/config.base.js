/**
 * All configurations are made here
 */
'use strict';

module.exports = {
    port       : process.env.PORT || 3000,
    dbconfig   : {
        dburl             : "localhost:27017/1SM"
    },
    "oauth"    : {
        "facebook": {
            "clientID"    : "1539116369666898",
            "clientSecret": "68df0aa984dad2458db26af49ed0297b",
            "callbackURL" : "http://1stopmake.com/auth/facebook/callback"
        },
        "twitter" : {
            "consumerKey"   : "39427539054aa777d7dfb76fe743e3b3",
            "consumerSecret": "j9hp6iYQZWBMFus5lYCZ7db0KmhMylNpOWUYA7ar8isoWk0tdb",
            "callbackURL"   : "http://1stopmake.com/auth/twitter/callback"
        },
        "google"  : {
            "clientID": "44376929588-eucb7ibmgft6m098t8f5afiajok36edb.apps.googleusercontent.com",
            "clientSecret"    : "AOrF78uP90X5qDPHvPqBRHfq",
            "callbackURL"   : "http://1stopmake.com/auth/google/callback"
        }
    }
}