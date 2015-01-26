var core = require('../../server/core');
core.set_globals();

var expect = require('chai').expect,
    _ = require('underscore'),
    flatten = require('flat'),
    categories_model = core.require_model('categories'),
    config_module = core.require_module('config'),
    categories_array = require('./categories.json');

config_module.init('development');//initialized only once
var config = config_module.getConfig();
core.databaseConfig(config.dbconfig);

var traverse_path;
var _id = 0;
var category_array=[];
var index = 0;

 describe("Model::categories", function() {
     it("drop collection", drop);
     it("insert test data", insert);
 });


function drop(done) {
    categories_model.remove({}, function (err) {
        expect(err).to.not.be.ok;
        done();
    });
}

function insert(done) {
    _.each(categories_array, function(value){
        traverse_path = [];
        _.each(flatten(value), callback_insert);

    });
    rearrange_array(category_array);
    arrange_child(category_array);
    done();
}

function callback_insert(value, key,id) {
    var path_array=[],
        counter = key.split('children').length - 1;
    // inserting value at the count of children
    traverse_path[counter] = value;
    // retrieving path
    for (var j = 0; j < counter; j++) {
        path_array.push(traverse_path[j]);
    }

    save_in_array(value, path_array.join(','),_id);
   // console.log('id',_id);
    _id = _id + 1;

}

function save_in_array(text, path, id){
    //TODO: also pass children
   // console.log('id:',id,'text:',text,'; path:', path);
    var category = new categories_model({
        'id' : id,
        'text': text,
        'parent_path': path
    });
    //console.log(category);
    if(category !== null){
        category_array[index] = category;
        index++;
    }

   /* category.save(function (err, doc) {
        expect(err).to.not.be.ok;
    });  */
}
// rearranging the path string to consist of ids of each rows
function rearrange_array(array){
    for(var k = 0; k <array.length; k++ ){
        var path_array = array[k].parent_path.split(',');
        //console.log(path);
        for(var p=0; p < path_array.length; p++){
           // console.log('print',path_array[p]);
            if(path_array[p] !== ''){
                for(var i=0; i<array.length; i++){
                    if(path_array[p] === array[i].text){
                       //  console.log(path_array[p]);
                      //   console.log('text',array[i].text);
                        path_array[p]=array[i].id;

                    }

                }

            }
        }
        array[k].parent_path = path_array.join(',');
      //  console.log('path', array[k].parent_path);
    }
}
// finding the children from the arrays by looping through
function arrange_child(array){
    var child;
    var child_array = [];
    for(var a=0; a < array.length; a++){
        child_array = [];
        child = null;
        // checking for null
        if(array[a].parent_path !== '') {

             child = array[a].parent_path + ',' + array[a].id;
            //console.log(array[a].parent_path + ',' + array[a].id);
        }
        else {
             child = array[a].id;
           // console.log('parent :',array[a].parent_path, 'child: ',child);
        }

        for( var b =0; b < array.length; b++){
           // console.log('parent',array[b].parent_path.trim(),'text',array[b].text,'child',child);
            // purposely did double equal to and not triple.
            if(child == (array[b].parent_path) && (array[b].parent_path !=='')){
              //  console.log('child',child, 'array',array[b].text ,'id',array[b].id);
                child_array.push(array[b].id);
            }
        }

        var final = new categories_model({
            'id' : array[a].id,
            'text': array[a].text,
            'parent_path': array[a].parent_path,
            'children':child_array
        });
        console.log('id:',array[a].id,'text:',array[a].text,'; path:', array[a].parent_path,':child:', child_array);

          final.save(function (err, doc) {
              expect(err).to.not.be.ok;
          });

    }

}