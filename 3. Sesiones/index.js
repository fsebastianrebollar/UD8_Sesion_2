const express = require('express'); 
const app = express();

const session = require("express-session");
app.use(session({
    secret: "1234",
    saveUninitialized: false,
    resave: true,
}));

app.get('/guardar', (req, res) => {   
    req.session.nombre = "Paco";
    req.session.edad = 28;
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify({success:1, description:"Datos de sesión guardados"}))
    res.end();
});

app.get('/leer', (req, res) => {   
    if(!req.session.nombre){
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.write(JSON.stringify({success:0, description:"No tienes datos de sesión"}))
        res.end();
      }else{
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify({success:0, description:"Hola " + req.session.nombre + "_" + req.session.edad}))
        res.end();
      }
});

app.listen(3000, () => {       
    console.log("Servidor escuchando en el puerto 3000"); 
});