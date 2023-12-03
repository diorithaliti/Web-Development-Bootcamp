
const express = require("express");
const bodyParser = require("body-parser");
// const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));

app.get("/",function(req,res){
  res.sendFile(__dirname + "/signup.html");
});

app.post("/",function(req,res){

  const firstName= req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address : email,
        status : "subscribed",
        marge_fields : {
          FNAME : firstName,
          LNAME : lastName

        }
      }
    ]
  }

  const jsonData = JSON.stringify(data);

    const url = "https://us9.api.mailchimp.com/3.0/lists/a0f5a99165";

    const options = {
      method: "POST",
      auth: "diorit1:5dac6d289ba2ba642f7f83536f50b050-us9"
    }

    const request1 = https.request(url , options , function(response){

        if (response.statusCode === 200){
          res.sendFile(__dirname + "/succes.html");
        }else {
          res.sendFile(__dirname + "/failure.html");
        }

      response.on("data",function(data){
        console.log(JSON.parse(data));
      })
    })

    request1.write(jsonData);
    request1.end();

});


app.listen(process.env.PORT || 3000 , function () {

  console.log("server is running on port 3000");
})

