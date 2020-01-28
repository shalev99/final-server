const url = require('url');
const cocktail = require('./schemas/cocktailSchema');
const private = require('./schemas/privateSchema');
const bar = require('./schemas/barSchema');
const mongoose = require('mongoose');
const constants = require('./constants');
const paypal = require('paypal-rest-sdk')




const { DB_HOST, DB_USER, DB_PASS } = constants;
const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}



const mongourl = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}`;



const getAllStock = (req, res) => {

    const urlObj = url.parse(req.url, true);
    const query = urlObj.query;
    if (query.name == null) {
        res.status(200).end('no bar with such name')
    }
    else {

        mongoose.connect(mongourl, options)
            .then(async () => {
                let result = await bar.find({ name: query.name }, (err) => {
                    if (err)
                        throw err;
                });
                if(result[0]==null)
                {
                    res.end('non-viable bar name')
                    return;
                }
                if (result) {
                    
                    let tempDrinkArr = []
                    console.log('result is:\n' + result);
                    //console.log('this is the result:\n'+result[0]);
                    //console.log('this is the the first stock:\n'+result[0].stock[0]);
                    //console.log('this is the the stock length:\n'+temp.length);
                    for (let i = 0; i < (result[0].stock).length; i++) {
                        tempDrinkArr.push(`${result[0].stock[i].bottles} bottles of ${result[0].stock[i].name} in stock`);
                    }

                    res.writeHead(200);
                    res.end(tempDrinkArr.toString());
                }
                else {
                    res.end('no drinks in stock');
                }
            })
            .catch(err => {
                console.error('some error occurred', err)
                res.end(err.message);
            })
    }
};


const getAllCocktails = (req, res) => {

    let result;//our search results
    mongoose.connect(mongourl, options)
        .then(async () => {
            result = await cocktail.find({}, (err) => {
                if (err)
                    throw err;
            });

            if(result[0]==null)
            {
                res.end('no cocktails in DB')
                return;
            }
            if (result) {
                //console.log('this is the result:\n' + result)
                let tempCocktailArr = []

                for (let i = 0; i < result.length; i++) {

                    tempCocktailArr.push(`${result[i].name}`);

                    for (let j = 0; j < result[i].tags.length; j++) {

                        tempCocktailArr.push(result[i].tags[j]);

                    }
                }


                res.writeHead(200);
                res.end(tempCocktailArr.toString());
            }
            else {
                res.end('no cocktails in bar DB');
            }
        })
        .catch(err => {
            console.error('some error occurred', err)
            res.end(err.message);
        })


};

const getByTag = (req, res) => {

    const urlObj = url.parse(req.url, true);
    const query = urlObj.query;
    let result;
    
    if(query.tag==null){

        res.end('incorrect input')

    }
    mongoose.connect(mongourl, options)
        .then(async () => {
            result = await cocktail.find({}, (err) => {
                if (err)
                    throw err;
            });
            if(result[0]==null)
            {
                res.end('no cocktails with this tag in DB')
                return
            }

            if (result) {


                let cocktailsarr = [];
                if (!(query == null)) {

                    for (let i = 0; i < result.length; i++) {
                        for (let j = 0; j < result[i].tags.length; j++) {
                            if (result[i].tags[j] == query.tag)
                                cocktailsarr.push(result[i].name);
                        }
                    }
                    if (cocktailsarr[0] != null) {
                        res.status(200).end(cocktailsarr.toString());
                    }
                    else {
                        res.status(200).end('no cocktails with that tag were found');
                    }
                }
                else {
                    res.status(200).end('no tag was entered');
                }
            }
            else
                res.end('no cocktails in database with that tag');
        })
        .catch(err => {
            console.error('some error occurred', err)
            res.end(err.message);
        })


};



const getByName = (req, res) => {

    const urlObj = url.parse(req.url, true);
    const query = urlObj.query;
    let result;

    if(query.name==null){

        res.end('incorrect input')

    }

    let cocktailsarr = [];
    mongoose.connect(mongourl, options)
        .then(async () => {
            result = await cocktail.find({
                name: query.name
            }, (err) => {
                if (err)
                    throw err;
            })
            if(result[0]==null){
                res.end('no cocktails with this name')
                return
            }
            if (!(result == null)) {
                if (query != null) {

                    for (let i = 0; i < result.length; i++) {
                        cocktailsarr.push(result[i].name);
                        for (let j = 0; j < result[i].ingredients.length; j++) {
                            cocktailsarr.push(result[i].ingredients[j]);
                        }

                    }



                    res.status(200).end(cocktailsarr.toString());

                }
                else {
                    res.status(200).end('no cocktails with that name');
                }
            }
            else {
                res.status(200).end('no cocktails in the bar DB');
            }
        })
        .catch(err => {
            console.error('some error occurred', err)
            res.end(err.message);
        })
};


const removeDrinks = (req, res) => {

    
    let { name = null,
        drink = null } = req.body;

    if (name == null || drink == null) {
        res.status(200).end(' no input try agian');
        return;
    }
    let newstockarr=[];
    let result=[];
    let stockarr=[];
    
    mongoose.connect(mongourl, options)
        .then(async () => {
            await bar.find({ name: name }, (err, result) => {
                if (err)
                    throw err;
                   
                 stockarr=result[0].stock;
                 if(result[0]==null)
                 {
                     res.end("no bars in DB")
                     return;
                 }
                for (let j = 0; j < stockarr.length; j++) {
                    if(stockarr[j].name!=drink&& j==stockarr.length-1){

                        res.end(' the drink doesn`t exists!!!!');
                        return;
                        
                    }
                    
                }
                for(let m = 0; m < stockarr.length; m++){
                    if(stockarr[m].name==drink){
                        stockarr[m]=null;
                    }
                }
                
            })
        })


        .then( async () => {
            result = await bar.update({
                name: name

            }, { $set: { stock: stockarr } }, (err) => {
                if (err)
                    throw err;
            })
            res.status(200).end(' deleted successfully');
            //node ServersideIndex.js
 
        })
        .catch(err => {
            console.error('some error occurred', err)
            res.end(err.message);
        })
};


const updateAmount = (req, res) => {
    
    let { name = null,
        stock = null } = req.body;

    if (name == null || stock == null) {
        res.status(200).end(' no input try agian');
        return;
    }
    let newstockarr=[];
    let result=[];
    let stockarr=[];
    
    mongoose.connect(mongourl, options)
        .then(async () => {
            await bar.find({ name: name }, (err, result) => {
                if (err)
                    throw err;
                   
                 stockarr=result[0].stock;
                 if(stockarr[0]==null)
                 {
                     res.end("no bottles in DB")
                     return;
                 }
                for (let j = 0; j < stockarr[0].length; j++) {
                    if(stockarr[j].name!=stock[0].name&& j==stockarr.length-1){
                        
                        res.end(' the drink doesn`t exists!!!!');
                        return;
                        
                    }
                    
                }
                for(let m = 0; m < stockarr.length; m++){
                    if(((stockarr[m].name)==(stock[0].name))&&((stockarr[m].bottles)>(stock[0].bottles))){
                        stockarr[m].bottles=stock[0].bottles;
                    }
                    
                    
                }
                
            })
        })


        .then( async () => {
            result = await bar.update({
                name: name

            }, { $set: { stock: stockarr } }, (err) => {
                if (err)
                    throw err;
            })
            res.status(200).end('updated successfully');
            //node ServersideIndex.js
 
        })
        .catch(err => {
            console.error('some error occurred', err)
            res.end(err.message);
        })
};




const buyDrinks = (req, res) => {
    paypal.configure({
        'mode': 'sandbox',
        'client_id': constants.client_id,
        'client_secret': constants.secret
    })
    const payment_json = {
        'intent': 'sale',
        'payer': {
            'payment_method': 'paypal'
        },
        'redirect_urls': {
            'return_url': 'https://dcs-final-project-mixer.herokuapp.com/success',
            'cancel_url': 'https://dcs-final-project-mixer.herokuapp.com/cancel'
        },
        'transactions': [{
            'item_list': {
                'items': [{
                    'name': req.body.drinkToBuy,
                    'sku': 'what is sku?',
                    'price': '65',
                    'currency': 'ILS',
                    'quantity': req.body.quantity
                }]
            },
            'amount': {
                'currency': 'ILS',
                'total': 65 * req.body.quantity
            },
            'description': 'no desc'
        }]
    }
    
    paypal.payment.create(payment_json, (error, payment) => {
        if (error) {
            throw error;
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel == 'approval_url') {
                    res.redirect(payment.links[i].href);
                }

            }

            res.end('test');
        }
    })
};






const addNewCocktail = (req, res) => {





    let { name = null,
        ingresarr = null,
        tagsarr = null,
         price = null } = req.body;
        
        if(name==null&&ingresarr==null&&tagsarr==null&&price==null){

            res.status(200).end('incorrect input');

        }
        
    if (ingresarr != null && tagsarr != null) {

        ingresarr = ingresarr.split(",");
        tagsarr = tagsarr.split(",");
    }






    let newCocktail = {
        name: name,
        ingredients: ingresarr,
        tags: tagsarr,
        price: req.body.price
    };



    let result;
    mongoose.connect(mongourl, options)
        .then(async () => {
            result = await cocktail.find({

                name: name
            }, (err) => {
                if (err)
                    throw err;
            })

            //node ServersideIndex.js
            if (result[0] != null) {

                console.log("the cocktail already exists");
                res.status(200).end(' the cocktail already exists');

            }
            else {
                console.log("cocktail was added to bar DB2");
                await cocktail.create(newCocktail);
                res.status(200).end(`cocktail ${req.body.name} was added to bar DB`);
            }
        })
        .catch(err => {
            console.error('some error occurred', err)
            res.end(err.message);
        })


};


const getAllFavorites = (req, res) => {


    
    const urlObj = url.parse(req.url, true);
    const query = urlObj.query;

    if (query.name == null) {
        res.status(200).end('no user with such name')
    }
    else {

        mongoose.connect(mongourl, options)
            .then(async () => {
                await private.find({ name: query.name }, (err, result) => {
                    if (err)
                        throw err;


                    if (result[0] != null) {

                        //let tempFavArr = []

                        //  for (let i = 0; i < (result[0].favorites).length; i++) {
                        //   tempFavArr.push(`${result[0].favorites} `);
                        // }
                        
                        
                        res.status(200).end((result[0].favorites).toString());
                    }
                    else {
                        res.end('no drinks in fave try another name ');
                        
                    }
                });
            })
            .catch(err => {
                console.error('some error occurred', err)
                res.end(err.message);
            })
    }
};

const addToFavorites = (req, res) => {


    let { name = null,
        favorite = null } = req.body;

    if (name == null || favorite == null) {
        res.status(200).end(' no input try agian');
        return;
    }

    let newfavorite = {
        name: name,
        favorites: favorite
    };

    let result;
    let favarr;
    mongoose.connect(mongourl, options)
        .then(async () => {
            await private.find({ name: name }, (err, result) => {
                if (err)
                    throw err;
                 //   console.log(result);
                 favarr=result[0].favorites;
                for (let j = 0; j < favarr.length; j++) {
                    if(favarr[j]==favorite){

                        res.end(' the favorite exists');
                        return;
                        
                    }
                    
                }
                favarr.push(favorite);

            })
        })


        .then( async () => {
            result = await private.update({
                name: name

            }, { $set: { favorites: favarr } }, (err) => {
                if (err)
                    throw err;
            })
            res.status(200).end(' added successfully');
            //node ServersideIndex.js
 
        })
        .catch(err => {
            console.error('some error occurred', err)
            res.end(err.message);
        })
};

const removeFromFavorites = (req, res) => {

    let { name = null,
        favorite = null } = req.body;

    if (name == null || favorite == null) {
        res.status(200).end(' no input try agian');
        return;
    }
    let newfavarr=[];
    let result=[];
    let favarr=[];
    
    mongoose.connect(mongourl, options)
        .then(async () => {
            await private.find({ name: name }, (err, result) => {
                if (err)
                    throw err;
                 //   console.log(result);
                 favarr=result[0].favorites;
                for (let j = 0; j < favarr.length; j++) {
                    if(favarr[j]!=favorite&& j==favarr.length-1){

                        res.end(' the favorite not exists!!!!');
                        return;
                        
                    }
                    
                }
                for(let m = 0; m < favarr.length; m++){
                    if(favarr[m]!=favorite){
                        newfavarr.push(favarr[0]);
                    }
                }

            })
        })


        .then( async () => {
            result = await private.update({
                name: name

            }, { $set: { favorites: newfavarr } }, (err) => {
                if (err)
                    throw err;
            })
            res.status(200).end(' deleted successfully');
            //node ServersideIndex.js
 
        })
        .catch(err => {
            console.error('some error occurred', err)
            res.end(err.message);
        })
 
};

const success = (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
        'payer_id': payerId,
        'transactions': [{
            'amount': {
                'currency': 'ILS',
                'total': '130'
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
        if (error) {
            console.log(error.response);
            throw error;

        } else {
            let placeInStock = 0;//the place in the stock where you'll need to update the same drink you bought
            let newStock;//the new stock

            //finding the place of the slot of the old stock according to the purchase made
            mongoose.connect(mongourl, options)
                .then(async () => {
                    await bar.find({ emailOfAdmin: payment.payer.payer_info.email }, (err, result) => {
                        if (err)
                            throw err;


                        if (result) {
                            let i = 0;

                            for (; i < result[0].stock.length; i++) {
                                if (result[0].stock[i].name == payment.transactions[0].item_list.items[0].name) {
                                    placeInStock = i;
                                    newStock = result[0].stock[i];
                                }
                            }
                            if (i < result[0].stock.length) {
                                //in case you have the drink in stock and want to increase its amount
                                newStock.bottles += payment.transactions[0].item_list.items[0].quantity;
                            }
                            else {
                                newStock = result[0].stock;
                                const tempobj = {
                                    name: payment.transactions[0].item_list.items[0].name,
                                    bottles: payment.transactions[0].item_list.items[0].quantity
                                }
                                newStock.push(tempobj);
                            }
                        }
                        else
                            res.end('crap');
                    })
                })
                .then(async () => {

                    await bar.updateOne({ emailOfAdmin: payment.payer.payer_info.email }, {
                        $set: { stock: newStock }
                    }, (err, res) => {
                        if (err)
                            throw err;


                    })
                    res.end('success');
                })
                /*.catch(err => {
                    console.error('some error occurred', err)
                    res.end(err.message);
                })*/

                //updating the stock

                //mongoose.connect(mongourl, options)

                .catch(err => {
                    console.error('some error occurred', err)
                    res.end(err.message);
                })
            //payment.transactions[0].item_list.items[0].name
            //payment.payer.payer_info.first_name

            //res.end(payment.transactions[0].item_list.items[0].name + "was added to the bar's stock successfully");
        }
    })

}

module.exports = {
    getAllStock,
    getAllCocktails,
    getByTag,
    getByName,
    updateAmount,
    buyDrinks,
    removeDrinks,
    addNewCocktail,
    getAllFavorites,
    addToFavorites,
    removeFromFavorites,
    success
}