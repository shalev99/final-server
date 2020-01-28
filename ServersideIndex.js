const express = require('express');
const controller = require('./controller');
const app = express();
const port = process.env.PORT || 8000;
const bodyParser = require('body-parser')

const constants = require('./constants');



//views for the html part
const ejs = require('ejs')
app.set('view engine', 'ejs');


app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));




//admin actions
app.get("/getAllStock", (req, res) => {
    //if(authUser=="admin"||authUser=="employee")
    controller.getAllStock(req, res);
    //else
    //res.end('doesn't work at the bar, can't get stock)
});

app.get("/getAllCocktails", (req, res) => {

    controller.getAllCocktails(req, res);

});

app.get("/getByName", (req, res) => {
    controller.getByName(req, res);
})

app.get("/getByTag", (req, res) => {

    controller.getByTag(req, res);

})


app.delete("/removeDrinks", (req, res) => {
    //if(authUser=="admin"||authUser=="employee")
    controller.removeDrinks(req, res);
    //else
    //res.end('doesn't work at the bar, can't remove stock)
});


app.put("/updateAmount", (req, res) => {
    //if(authUser=="admin"||authUser=="employee")
    controller.updateAmount(req, res);
    //else
    //res.end('doesn't work at the bar, can't decrease stock)
})

app.post("/buyDrinks", (req, res) => {
    //if(authUser=="admin")
    controller.buyDrinks(req, res);
    //else
    //res.end('not admin, can't buy stock)
});


//bartender actions

app.post("/addNewCocktail", (req, res) => {
    //if(authUser=="employee")
    controller.addNewCocktail(req, res);
    //else
    //res.end('not a bartender- can't add a cocktail')
});



//private user actions

app.get('/getAllFavorites', (req, res) => {
    //if(authUser=="user")
    controller.getAllFavorites(req, res);
    //else
    //res.end('not a private user can't favorites')
});

app.put('/addToFavorites', (req, res) => {
    //if(authUser=="user")
    controller.addToFavorites(req, res);
    //else
    //res.end('not a private user can't add from favorites')
});

app.delete('/removeFromFavorites', (req, res) => {
    //if(authUser=="user")
    controller.removeFromFavorites(req, res);
    //else
    //res.end('not a private user can't remove from favorites')
});

//for the paypal api
app.get('/success', (req, res) => {
    controller.success(req, res);
});

app.get('/cancel', (req, res) => res.end('cancelled'));

//default route

app.all('/', (req, res) => {
    res.render('index');//just for the serverside submission
    
});

app.listen(port);

console.log(`listening on port ${port}`);




