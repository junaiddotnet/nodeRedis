const express  = require('express');
const exphbs  = require('express-handlebars');
const path  = require('path');
const bodyparser  = require('body-parser');
const methodoveride  = require('method-override');
const redis  = require('redis');
// Set up the Redis
let client = redis.createClient();
client.on('connect',function(){
    console.log('Conncted to Redis ...');

});

// set up the port
const port = 3000;
// Init App
const app  = express();

// view Engine 
app.engine('handlebars',exphbs({defaultLayout:'main'}));
app.set('view engine','handlebars');

// body parser
app.use(bodyparser.json());
app.use (bodyparser.urlencoded({extended:false}));

// method override
app.use(methodoveride('_method'));

app.get('/',function(req,res,next){
   res.render('searchuser'); 
});
app.post('/users/search',function(req,res,next){

    let id  = req.body.id;
    console.log(id);
    client.hgetall(id,function(err,obj){
        console.log(err);
            if (!obj)
            {
                res.render('searchuser',{error:'User does not exist ...'});
            }
            else
            {
                obj.id = id;
                res.render('details',{users:obj});
            }

    });
});

app.get('/users/add',function(req,res,next){
    res.render('adduser');
});
app.post('/users/add',function(req,res,next){
    let id = req.body.id;
    let firstname  = req.body.firstname;
    let lastname  = req.body.lastname;
    let email  = req.body.email;
    let phone = req.body.phone;
    client.hmset(id,[
        'firstname',firstname,
        'lastname',lastname,
        'email',email,
        'phone',phone
    ],function(err,reply){
        if (err)
        {
            console.log(err);
        }
        else
        {
            console.log('success data inn');
            res.redirect('/');
        }
    });

});

app.listen(port,function(){
    console.log("Server Runn on .."+port);

});