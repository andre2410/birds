const express = require('express');
var bird_controller = require('../controllers/bird_controller');
const { findById } = require('../models/bird');
const Birds = require('../models/bird');
const multer = require('multer');
//multer storage specifications. Credit to Chris Mao for helping as without this file cannot be defined and stored incorrectly.
const storage = multer.diskStorage({
    destination: function(request, file, callback){
        callback(null, "./public/images");
    },
    filename: function(request, file, callback){
        callback(null, file.originalname);
    },

});
//multer storage specifications. Credit to Chris Mao for helping as without this file size cannot be defined and stored incorrectly.
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024*1024*3
    },
});


/* create a router (to export) */
const router = express.Router();


/* route the default URL: `/birds/ */
router.get('/', async (req, res) => {
    // extract the query params
    const search = req.query.search;
    const status = req.query.status;
    const sort = req.query.sort;

    // render the Pug template 'home.pug' with the filtered data
    res.render('home', {
        birds: await bird_controller.filter_bird_data(search, status, sort)
    });
})

// TODO: finishe the "Create" route(s)
router.get('/create', async (req, res) => {
    res.render('create_bird', {})
});
router.post('/create', upload.single("photo_upload"), async (req, res)=> {
    //Check if file exists
    const file = req.file;
    var filename;
    if(!file){//check if image file exists if not set it to old image file. Help received from Chris Mao
        filename = 'default.jpg';
    }else{
        filename = file.originalname;
    }
    // get the data from the request body 
    const bird_new = {
        primary_name: req.body.primary_name,
        english_name: req.body.english_name,
        scientific_name: req.body.scientific_name,
        order: req.body.order,
        family: req.body.family,
        other_names: req.body.other_names,
        status: req.body.status,
        photo: {
            credit: req.body.photo_credit,
            source: filename
        },
        size: {
            length: {
                value: req.body.length,
                units: "cm"
            },
            weight: {
                value: req.body.weight,
                units: "g"
            }
        }
    };
    
    // insert the data into the database
    const db_info = await Birds.create(bird_new);
    
    
    // tell the client it worked!
    console.log("success! created bird");
    res.redirect('/birds');
});

// TODO: get individual bird route(s)
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const theBird = await Birds.findOne({_id : id});
    //render bird_page template.
    res.render('bird_page', { 
        birds: [theBird]
    })
});

// TODO: Update bird route(s)
router.get('/:id/edit', async (req, res) => {
    const id = req.params.id;
    const theBird = await Birds.findOne({_id : id});
    //render bird_page template.
    res.render('edit_bird', { 
        birds: [theBird]
    })
});
router.post('/:id/edit', upload.single("photo_upload"), async (req, res)=> {
    const id = req.params.id;
    const theBird = await Birds.findOne({_id : id});
    //define file
    const file = req.file;
    var filename;
    if(!file){//check if image file exists if not set it to old image file. Help received from Chris Mao
        filename = theBird.photo.source;
    }else{
        filename = file.originalname;
    }
    
    // insert the data into the database
    const db_info = await Birds.updateOne({_id : id}, 
        {$set : {
            primary_name: req.body.primary_name,
            english_name: req.body.english_name,
            scientific_name: req.body.scientific_name,
            order: req.body.order,
            family: req.body.family,
            other_names: req.body.other_names,
            status: req.body.status,
            photo: {
                credit: req.body.photo_credit,
                source: filename
            },
            size: {
                length: {
                    value: req.body.length,
                    units: "cm"
                },
                weight: {
                    value: req.body.weight,
                    units: "g"
                }
            }
        }
});
    
    // tell the client it worked!
    console.log("success! updated bird");
    res.redirect('/birds');
});

// TODO: Delete bird route(s)
router.get('/:id/delete', async (req, res) => {
    const id = req.params.id;
    const db_info = await Birds.findOneAndRemove({ _id: id });
    console.log('deleted bird with id: ' + id);
    res.redirect('/birds');
});

module.exports = router; // export the router