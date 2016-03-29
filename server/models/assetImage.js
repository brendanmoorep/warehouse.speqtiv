var mongoose = require('mongoose');
var Schema = mongoose.Schema();
var assetImageModel = new Schema({
  assetId : {
    type : String
  }
});

module.exports = mongoose.model('assetImage', assetImageModel);
