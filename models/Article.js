var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: {
    type:String,
    unique: true,
    required:true
  },
  link: {
    type:String,
    required:true
  },
  note: {
      type: Schema.Types.ObjectId,
      ref: 'Note'
  }
});

ArticleSchema.plugin(uniqueValidator);

var Article = mongoose.model('Article', ArticleSchema);
module.exports = Article;