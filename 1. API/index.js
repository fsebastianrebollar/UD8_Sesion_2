const express = require('express'); 
const app = express();
app.use(express.urlencoded({extended: true}));

var items = [];

app.get('/item', (req, res) => {   
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(items))
    res.end();
});

app.post('/item', (req, res) => {   
    const item = req.body.item

    if (items.length >= 5) {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.write(JSON.stringify({error_description: "limit reached"}))
        res.end();
    } else {
        items.push(item)
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(items))
        res.end();}
});

app.delete('/item', (req, res) => {   
    items = []
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(JSON.stringify(items)))
    res.end();
});

app.listen(3000, () => {       
    console.log("Servidor escuchando en el puerto 3000"); 
});