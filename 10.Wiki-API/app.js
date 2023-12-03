//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/WikiDB", {useNewUrlParser: true});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

/////////////////////// REQUEST TAREGTING ALL ARTICLES///////////

app.route("/articles")

.get(function (req,res) {

  Article.find(function(err ,foundArticles){
    if(!err){
    res.send(foundArticles);
  }else {
    res.send(err);
  }
  });
})

.post(function (req, res) {

  const newArticle = new Article({
    title: req.body.title ,
    content: req.body.content
  });
  newArticle.save(function (err) {
    if(!err){
      console.log("successfully added a new article");
    }else {
      console.log(err);
    }
  });

})

.delete(function(req,res){

  Article.deleteMany(function (err, tgjitha) {
    if(!err){
      console.log("i fshina ");
    }else {
      console.log(err);
    }
  })
});


///////////////////// REQUEST TARGETING A SPECIFIC  ARTICLE ////////////////

app.route("/articles/:articleTitle")

.get(function(req, res){
  Article.findOne({title: req.params.articleTitle},function(err, foundArticle){
    if(foundArticle){
      res.send(foundArticle)
    }else{
      res.send("no articles matching")
    }
  })
})
.put(function(req,res){
  Article.replaceOne(
    {title: req.params.articleTitle}, //conditions
    {title: req.body.title , content: req.body.content}, //update
    {overwrite: true},
    function(err){ 
      if(!err){
        res.send("successfully updated article");
      }
    }
  )
})

.patch(function(req,res){
Article.updateOne(
  {title: req.params.articleTitle},
  {$set: {title: req.body.title}},
  function(err){
    if(!err){
      res.send("success");
    }else {
      res.send(err);
    }
  }
)
})

.delete(function(req, res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(err){
        console.log(err);
      }else{
        res.send("success");
      }
    }
  );
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
