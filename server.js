const mongoose = require("mongoose");

const app = require('./app')
const DB_HOST = "mongodb+srv://Murlykin:rjhb7777@cluster0.0tv83ky.mongodb.net/db-contacts?retryWrites=true&w=majority";
mongoose.connect(DB_HOST)
  .then(() => {
    app.listen(3000);
})

  .catch(error => {
    console.log(error.message);
    process.exit(1);
})


