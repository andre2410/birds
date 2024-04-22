const dotenv = require('dotenv')
const path = require('path');
const express = require('express');
const bird_router = require('./routers/bird_router');
const image_router = require('./routers/image_router');
const Birds = require('./models/bird');

/* load .env */
dotenv.config();

/* create Express app */
const app = express();

/* setup Express middleware */
// Pug for SSR (static site rendering)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// TODO: middleware for parsing POST body (help)
// TODO: middleware for uploading files (in bird.router)

/* host static resources (.css, .js, ...) */
app.use('/images/', image_router);
app.use('/', express.static(path.resolve(__dirname, 'public/')));

/* redirect root route `/` to `/birds/` */
app.get('/', (req, res) => {
    res.redirect('/birds/');
});

app.get('api/bird', async (request, response) => {
    const birds = await Birds.find({});
    response.json(birds);
});

app.use('/birds/', bird_router);

// TODO: 404 page
app.get('*', (request, response) => {
    response.status(404)
    response.sendFile(path.resolve(__dirname, 'views/404-not-found.pug'));
});

// TODO: connect to a database
const mongoose = require("mongoose");
const user = process.env.ATLAS_USER;
const password = process.env.ATLAS_PASSWORD;
const db_name = 'bird-data'
const db_url = `mongodb+srv://${user}:${password}@cluster0.vlchdof.mongodb.net/${db_name}?retryWrites=true&w=majority`
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}
mongoose.connect(db_url, options).then(() => {
    console.log('successfully connected!')
}).catch((e) => {
    console.error(e, 'could not connect!')
});

/* start the server */
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is live http://localhost:${PORT}`);
});
