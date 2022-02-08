const mongoose = require('mongoose');

mongoose.connect('ur database url');

const db= mongoose.connection
db.on('error',console.error.bind(console,'error in database')) // errors

db.once('open',function(){
  console.log("Successfully coonected to database")
})
