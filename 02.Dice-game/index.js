var randomNumber1 = Math.floor(Math.random() * 6 )+ 1 ; //randmon number 1-6

var randomDiceImage = "dice"+randomNumber1+".png";//dice1.png-dice6.png

var randomImageSource = "images/"+randomDiceImage; //images/dice1.png - images/dice6.png

var image1 = document.querySelectorAll("img")[0];

image1.setAttribute("src", randomImageSource);


var randomNumber2 = Math.floor(Math.random() * 6 )+ 1 ; //randmon number 1-6

// var randomDiceImage2 = "dice"+randomNumber2+".png";//dice1.png-dice6.png

// var randomImageSource2 = "images/dice"+randomNumber2+".png"; //images/dice1.png - images/dice6.png
//
// var image2 = document.querySelectorAll("img")[1];

document.querySelectorAll("img")[1].setAttribute("src",  "images/dice"+randomNumber2+".png");



 if (randomNumber1 > randomNumber2){
   document.querySelector("h1").innerHTML = "🚩 player one wins"; //if player one wins , we change innerHtml of h1
 }
 else if (randomNumber2 > randomNumber1){
   document.querySelector("h1").innerHTML = "player two wins 🚩"; //if player two wins , we change innerHtml of h1
 }
 else {
   document.querySelector("h1").innerHTML = "draw"; //if its a draw , we change innerHtml of h1
 }


 
