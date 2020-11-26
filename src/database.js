const mongoose = require('mongoose');
// const db = 'mongodb+srv://guasimone:Mf0krgwFqPviMxwg@cluster0-abpj6.mongodb.net/merntasks';
const db = 'mongodb+srv://guasimone:Mf0krgwFqPviMxwg@cluster0-abpj6.mongodb.net/nodejs-hbs-fazt?authSource=admin&replicaSet=Cluster0-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true';

mongoose.connect(db, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
})
.then(db => console.log('MondoDB is connected'))
.catch(err => console.error(err));

