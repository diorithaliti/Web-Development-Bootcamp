
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

let items = ["Eat food","Buy food","Cook food"] ;
let workItems = [];

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", function(req, res) {

  let day = date.getDay();

  res.render("list", { listTittle: day , listItems: items});

});

app.post("/",function(req,res){
  console.log(req.body);

   let item = req.body.newItem;

   if (req.body.list === "Work list"){
     workItems.push(item);
     res.redirect("/work");
   }else{
     items.push(item);
     res.redirect("/");
   }

})

app.get("/work",function(req,res){
  res.render("list", { listTittle: "Work list", listItems:workItems});
})

app.post("/work",function (req,res) {
  let item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
})

app.get("/about",function (req,res) {
  res.render("about");
});


app.listen(3000, function() {
  console.log("port 3000");
});
