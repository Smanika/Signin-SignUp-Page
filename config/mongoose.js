const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/login');

const db= mongoose.connection
db.on('error',console.error.bind(console,'error in database')) // errors

db.once('open',function(){
  console.log("Successfully coonected to database")
})