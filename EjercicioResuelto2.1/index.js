const express = require('express'); 
const app = express();
app.use(express.urlencoded({extended: true}));

const session = require("express-session");
app.use(session({
    secret: "1234",
    saveUninitialized: true,
    resave: true,
}));

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const User = require('./models/user');

mongoose.connect('mongodb+srv://root:root@cluster0.6bozca9.mongodb.net/ramazon?retryWrites=true&w=majority')
    .catch(err => console.log(err))
    .then(console.log("Connected to MongoDB"));

app.post('/register', (req, res) => {   
    const username = req.body.username
    const password = req.body.password
    const new_user = new User({username: username, password: password});
    new_user.save()
        .then(user => {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(JSON.stringify({success:1, description:"User created", data:user}));
            res.end();
        })
        .catch(err => {
            res.writeHead(404, {'Content-Type': 'application/json'});
            res.write(JSON.stringify({success:0, description:err}));
            res.end();
        });
});

app.post('/singin', (req, res) => {      
    const username = req.body.username
    const password = req.body.password
    User.findOne({ username: username, password: password})
        .then(user=>{
            if (user) {
                req.session.username = username
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.write(JSON.stringify({success:1, description:"Loged In", data: user}))
                res.end();
            } else if (user) {
                req.session.username = ""
                res.writeHead(404, {'Content-Type': 'application/json'});
                res.write(JSON.stringify({success:0, description:"Usuario y contraseña incorrectos"}))
                res.end();
            }
            
        })
        .catch(err=>{
            req.session.username = ""
            res.writeHead(404, {'Content-Type': 'application/json'});
            res.write(JSON.stringify({success:0, description:err}))
            res.end();
        })
});  

app.get('/pedidos', (req, res) => {   
    const username = req.session.username
    if (username) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify({success:1, description:"Loged In", data: username}))
        res.end();
    } else {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.write(JSON.stringify({success:0, description:"Usuario no logeado"}))
        res.end();
    }
});

app.get('/logout', (req, res) => {   
    req.session.username = ""
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify({success:1, description:"Loged Out"}))
    res.end();
});


app.listen(3000, () => {       
    console.log("Servidor escuchando en el puerto 3000"); 
});