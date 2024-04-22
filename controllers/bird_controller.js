const { appendFile } = require('fs');
// const birds_json = require('../public/nzbird.json');
// const server = require('./server');
const { bird_sort, search_string } = require('./bird_utils.js');
// const app = express();
const Birds = require('../models/bird');



// get all birds (filtered)
async function filter_bird_data(search, status, sort) {
    var results = await Birds.find({});
    //var results = birds_json;
    // filter by conservation status 
    if (status !== undefined && status !== "All") {
        results = results.filter((b) => b.status == status);
    }
    // filter by search string
    if (search !== undefined && search !== "") {
        results = search_string(results, search);
    }
    // sort by
    if (sort !== undefined) {
        results = bird_sort(results, sort);
    }
    
    return results;
}

module.exports = { filter_bird_data };