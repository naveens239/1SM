module.exports = {
    port    : 80,
    //NOTE: can only override the entire top level object
    dbconfig: {
        dbpath            : "./mongo", //NOTE: may switch with cassandra or any db here provided u have that db's .js module with same method signatures
        dbextension_module: "mongo_extension",//Note: may switch with cassandra_extension etc provided u provide cassandra_extension.js in page folders
        dbname            : "wb",
        host              : "localhost",
        port              : 27017,
        dburl             : "167.88.41.30:27017/wb",
        dbConnectionConfig: {
            // the key name here must be exactly same as the key of the connection string in Mongodb (assuming Mongodb is used)
            connectionTimeoutMS: -1,
            maxPoolSize        : 5
        }
    }
};