'use strict';
var core     = require(__server_path + '/core'),
    config   = require(__server_path + '/modules/config/config').getConfig(),
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

function setProfileInSession(req) {
    var profile = req.session.passport.user.user_profile ? req.session.passport.user.user_profile : {};
    //console.log(JSON.stringify(req.body));
    //TODO: should check for valid_items before saving in session
    /*var valid_items = ['vendor_name', 'email', 'website', 'facebook', 'twitter',
     'mobile', 'altphone', 'landphone', 'addressline1', 'addressline2', 'city', 'pincode', 'state',
     'selectSevice'];

     _.each(valid_items, function(item){
     if(req.body[item]){
     profile[item] = req.body[item];
     }
     });*/
    _.each(req.body, function (value, key) {
        profile[key] = value;
    });

    req.session.passport.user.user_profile = profile;
    return profile;
}

function user_profile(req, res) {
    var user = req.session.passport.user;
    console.log('in /user_profile');
    console.log('user:'+JSON.stringify(user));

    if (!user || !user.username) {
        console.log("Error finding username");
        res.redirect("/");
        return;
    }

    var user_profile_model = require('./models/user_profile');

    user_profile_model.findOne({username:user.username}, function (err, user_profile) {
        if(err) {
            console.log(err);
            return;
        }

        var flat_data={};
        if(user_profile){
            core.model_to_flat_data(user_profile, flat_data);
        }
        else{
            flat_data = { email: user.email, mobile: user.mobile };
        }
        //massage data before displaying
        flat_data.mobile = core.remove_country_code(flat_data.mobile);
        if(flat_data.best_way_to_contact){//TODO: why is this needed. store as array of strings.
            flat_data.best_way_to_contact = flat_data.best_way_to_contact.split(',');
        }

        console.log('response flat_data::'+JSON.stringify(flat_data));
        var response_data = _.extend(core.is_logged_in(req, true), core.bind_data(flat_data), { 'vendor_services': config.vendor_services});
        res.render('user_profile/user_profile', response_data);
    });
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
    var username = req.session.passport.user.username,
        user_profile_model = require('./models/user_profile');

    user_profile_model.findOne({username:username}, function (err, user_profile) {
        if(err) {
            console.log(err);
            return;
        }

        if(!user_profile){
            user_profile = new user_profile_model();
            user_profile.username = username;
        }

        var profile_data = setProfileInSession(req);
        profile_data.is_vendor = (profile_data.vendor_name.length>0);

        core.flat_data_to_model(profile_data, user_profile);

        console.log(user_profile);

        user_profile.save(function(err) {
            if(err) {
                console.log("Error: could not save user: " + username);
                return res.send(false);
            }
            else {
                console.log("Saved user: " + username);
                return res.send(true);
            }
        });
    });
}

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
