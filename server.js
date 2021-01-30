//Instalacja serwera expressjs
const express = require('express');
const path = require('path');

const app = express();

// Udostępnianie są tylko pliki statyczne z katalogu dist
app.use(express.static(__dirname + '/dist/apps/snmp-monitor'));

app.get('/*', function(req,res) {
    
res.sendFile(path.join(__dirname+'/dist/apps/snmp-monitor/index.html'));
});

// Aplikacja uruchomiona na porcie 8080
app.listen(process.env.PORT || 8080);
