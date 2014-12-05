'use strict';
var core     = require(__server_path + '/core'),
    config   = require(__server_path + '/modules/config/config')().getConfig(),//TODO: ppc, find a better way for config
    //util     = require('util'),
    fs       = require('fs'),
    path     = require('path'),
    //gm       = require('gm'),
    //Busboy   = require('busboy'),
    _        = require('underscore');

module.exports = {
    page_routes: function (router) {
        router.get('/user_profile', user_profile);
        router.post('/user_profile_save', user_profile_save);
    },

    api_routes: function (router) {
        router.post('/save_in_session', save_in_session);
        //router.post("/upload", upload);
        //router.get('/gallery', gallery);
    }
};

/*
 fetch gallery picture paths
 */
/*function gallery(req, res) {
    var folder_name = req.session.passport.user.oauth_id;
    var relative_folder_path = '/uploads/' + folder_name + '/';
    var folder_path = __client_path + relative_folder_path;
    //var MAX_FILES = 9;
    fs.readdir(folder_path, function (err, files) {
        if (err) {
            console.log("error reading user's upload folder:" + folder_path);
            return;
        }
        var filenames = {}, i, filename, filenameWithoutExtension;
        //TODO: limit the number of files in gallery
        //files = files.splice(MAX_FILES);?
        for (i in files) {
            filename = files[i];
            // skip small size images to avoid duplication
            if (filename.indexOf("_s.png") != -1) {
                continue;
            }
            // make sure only image files are shown
            if (!filename.match(/(\.|\/)(gif|jpe?g|png)$/i)) {
                continue;
            }
            filenameWithoutExtension = filename.replace(path.extname(filename), "");
            filenames[relative_folder_path + filenameWithoutExtension + '_s.png'] = relative_folder_path + filename;
        }

        res.send({images: filenames});
    });
}
*/
/*
 upload
 */
/*function upload(req, res) {
    console.log("start processing file upload");
    var folder_name = req.session.passport.user.oauth_id;
    var relative_folder_path = '/uploads/' + folder_name;
    var dir = __client_path + relative_folder_path;
    var busboy = new Busboy({headers: req.headers});

    // make sure folder exists
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    var fileNameObj = {};
    busboy.on('file',
        function (fieldname, file, name, encoding, mimetype) {
            startUpload(file, name, res, dir, fileNameObj);
        });
    busboy.on('finish', function () {
        finishUpload(res, dir, fileNameObj)
    });
    req.pipe(busboy);
}

function startUpload(file, name, res, dir, fileNameObj) {
    var filename = name,
        extension = path.extname(filename),
        filenameWithoutExtension = filename.replace(extension, "");

    if (!extension.match(/(\.|\/)(gif|jpe?g|png)$/i).length) {
        console.log("unknown file type");
        res.status(500);
        return res.send("error");
    }
    // append random string to filename
    filenameWithoutExtension = filenameWithoutExtension + "_" + Math.random().toString(36).substring(7);
    filename = filenameWithoutExtension + extension;
    var saveTo = path.join(dir, filename);
    file.pipe(fs.createWriteStream(saveTo));

    //pass these values back
    fileNameObj.filename = filename;
    fileNameObj.extension = extension;
    fileNameObj.filenameWithoutExtension = filenameWithoutExtension;
}

function finishUpload(res, dir, fileNameObj) {
    console.log(path.join(dir, fileNameObj.filenameWithoutExtension + "_s.png"));
    gm(path.join(dir, fileNameObj.filename + (fileNameObj.extension.toLowerCase() == '.gif' ? '[0]' : '')))
        .options({imageMagick: true})
        .resize(240, 240)
        .autoOrient()
        .noProfile()
        .write(path.join(dir, fileNameObj.filenameWithoutExtension + "_s.png"), function (err) {

            if (!err) {
                res.status(200);
                return res.send({});
            } else {
                console.log("cannot write image");
                res.status(500);
                return res.send("error");
            }
        });
}*/
//working code below
/*function upload(req, res) {
 var form = new formidable.IncomingForm();
 form.parse(req, function (err, fields, files) {
 res.writeHead(200, {'content-type': 'text/plain'});
 res.write('received upload:\n\n');
 res.end(util.inspect({fields: fields, files: files}));
 });

 form.on('end', function (fields, files) {
 *//* Temporary location of our uploaded file *//*
 var temp_path = this.openedFiles[0].path;
 *//* The file name of the uploaded file *//*
 var file_name = this.openedFiles[0].name;
 *//* Location where we want to copy the uploaded file *//*
 var new_location = __client_path + '/uploads/' + req.session.passport.user.oauth_id;

 try {
 if (!fs.existsSync(new_location)) {
 fs.mkdirpSync(new_location);
 }
 fs.copy(temp_path, new_location + '/' + file_name, function (err) {
 if (err) {
 console.error(err);
 } else {
 console.log("success!")
 }
 });
 } catch (e) {
 throw e;
 }
 });
 }*/

function setProfileInSession(req) {
    var profile = req.session.passport.user.user_profile ? req.session.passport.user.user_profile : {};
    console.log(JSON.stringify(req.body));
    //TODO: should check for valid_items before storing in db.
    /*var valid_items = ['vendor_name', 'email', 'website', 'facebook', 'twitter',
     'mobile', 'altphone', 'landphone', 'addressline1', 'addressline2', 'city', 'pincode', 'state',
     'selectSevice'];

     _.each(valid_items, function(item){
     if(req.body[item]){
     profile[item] = req.body[item];
     }
     });*/
    //TODO: replace with above commented code once valid_items are known
    _.each(req.body, function (value, key) {
        profile[key] = value;
    });

    req.session.passport.user.user_profile = profile;
    return profile;
}

function user_profile(req, res) {
    var user = req.session.passport.user;
    console.log('user:'+JSON.stringify(user));
    if (!user || !user.username) {
        console.log("Error finding username");
        res.redirect("/");
        return;
    }
    var oauth_id = user.username;
    console.log("user_profile for oauth_id:" + oauth_id);

    if (user.user_profile) {
        var profile = user.user_profile;
        res.render('user_profile/user_profile', _.extend(core.bind_data(profile), {'vendor_services': config.vendor_services}));
    } else {
        //TODO: ppc, fix this with mongoose
        req.db.getVendorAccount(oauth_id, function (e, docs) {
            console.log("account -> " + JSON.stringify(docs));
            if (docs && docs.user_profile) {
                user.user_profile = docs.user_profile;
            }
            var profile = user.user_profile ? user.user_profile : { email: user.email, mobile: user.mobile };
            res.render('user_profile/user_profile', _.extend(core.bind_data(profile), {'vendor_services': config.vendor_services}));
        });
    }
}

//Test code to skip mandatory login check
/*function user_profile(req, res) {
 res.render('user_profile/user_profile', {});
 }*/

function save_in_session(req, res) {
    setProfileInSession(req);
    res.send(true);
}

function user_profile_save(req, res) {
    var profile = setProfileInSession(req);

    var username = req.session.passport.user.username;
    req.db.saveVendorProfile(username, profile);//Save profile in database
    res.send(true);
}