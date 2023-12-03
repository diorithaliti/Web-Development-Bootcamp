require('events').EventEmitter.defaultMaxListeners = 0; // e lash se e qitke ni bug nconsole per emmiter.maxListeners() wtf???

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/fruitsDB", { useNewUrlParser: true });

const fruitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true,"Please check data entry"]
  },
  rating:{
    type: Number,
    min: 1,
    max: 10
  },
  review: String
});

const Fruit = mongoose.model("Fruit", fruitSchema);

const fruit = new Fruit({
  name: "Peach",
  rating: 7,
  review: "mid"
});

// fruit.save();

const personSchema = new mongoose.Schema({
  name: String,
  age: Number,
  favoriteFruit: fruitSchema
});

const Person = mongoose.model("Person",personSchema);

const pineapple = new Fruit ({
  name: "pineapple",
  rating: 10,
  review: "awesome"
});

// pineapple.save();

const mango = new Fruit ({
  name: "mango",
  rating: 10,
  review: "awesome"
});

// mango.save();

Person.updateOne({age: {$gt: 15}}, {favoriteFruit: mango},function (err) {

    console.log("success");

});

// const person = new Person({
//   name: "dea",
//   age: 14,
//   favoriteFruit: pineapple
// });


// const person = new Person({
//   name: "dimi",
//   age: 26
// });
//
//
// person.save()

// const kiwi = new Fruit({
//     name: "kiwi",
//     rating: 10,
//     review: "Best fruit in the world",
//   });
//
//   const orange = new Fruit({
//     name: "Orange",
//     rating: 5,
//     review: "Too sour for me",
//   });
//
//   const banana = new Fruit({
//     name: "Banana",
//     rating: 8,
//     review: "Weird Texture",
//   });

  // Fruit.insertMany([kiwi,orange,banana],function (err) {
  //   if(err){
  //     console.log(err);
  //   }else {
  //     console.log("Succes");
  //   }
  // });

  Fruit.find(function (err, fruits) { // emri fruits mund te vendoset shkado , jan thjesht results

    if(err){
      console.log(err);
    }else {
      // for (var i = 0; i < fruits.length; i++) {
      //   console.log(fruits[i].name);
      // }

      fruits.forEach(function(fruit){
        console.log(fruit.name);

        mongoose.connection.close();

      });

    }

  })

  Fruit.updateOne({_id: "63535b04f500eee2b07f9e83"}, {name: "Peach", function(err){
    if(err){
      console.log(err);
    }else {
      console.log("Success");
    }
  }});

  // Fruit.deleteMany({name: "peach"}, function(err){
  //   if(err){
  //     console.log(err);
  //   }else {
  //     console.log("mir o");
  //   }
  // });

  // Person.
