const express = require('express'); 
const app = express();
app.use(express.urlencoded({extended: true}));

const User = require('./models/user');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

mongoose.connect('mongodb+srv://root:root@cluster0.6bozca9.mongodb.net/crud?retryWrites=true&w=majority')
    .catch(err => console.log(err))
    .then(console.log("Connected to MongoDB"))

app.post('/create', (req, res) => {   
    const username = req.body.username
    const name = req.body.name
    const password = req.body.password
    const new_user = new User({ username: username, name:name, password:password });
    new_user.save((err, user) => {
        if (err) {
            res.writeHead(404, {'Content-Type': 'application/json'});
            res.write(JSON.stringify({success:0, description:err}))
            res.end();
        } else {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(JSON.stringify({success:1, description:"User created", data:user}))
            res.end();
        }
      }); 
});

app.post('/read', (req, res) => {      
    const username = req.body.username
    User.findOne({ username: username }, (err, user) => {
        if (err || user==null) {
            res.writeHead(404, {'Content-Type': 'application/json'});
            res.write(JSON.stringify({success:0, description:err||"El usuario no existe"}))
            res.end();
        } else {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(JSON.stringify({success:1, description:"User found", data: user}))
            res.end();
        }
    });
});

app.post('/update', (req, res) => {
    const username = req.body.username
    const name = req.body.name     
    const password = req.body.password   
    User.findOne({ username: username }, (err, user) => {
        if (err || user == null) {
            res.writeHead(404, {'Content-Type': 'application/json'});
            res.write(JSON.stringify({success:0, description:(err || "El usuario no existe")}))
            res.end();
        } else {
            if (name) user.name = name;
            if (password) user.password = password;
            user.save((err, user_updated) => {
                if (err) {
                    res.writeHead(404, {'Content-Type': 'application/json'});
                    res.write(JSON.stringify({success:0, description:err}))
                    res.end();
                } else {
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.write(JSON.stringify({success:1, description:"User updated.", data: user_updated}))
                    res.end();
                }
              })
        }
    });
});

app.post('/delete', (req, res) => {
    const username = req.body.username   
    User.findOneAndDelete({ username: username }, (err, user) => {
        if (err || user == null) {
            res.writeHead(404, {'Content-Type': 'application/json'});
            res.write(JSON.stringify({success:0, description:(err || "El usuario no existe")}))
            res.end();
        } else {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(JSON.stringify({success:1, description:"User deleted", data: user}))
            res.end();
        }
    });
});

app.listen(3000, () => {       
    console.log("Servidor escuchando en el puerto 3000"); 
});