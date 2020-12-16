//Importa as dependências que acabamos de instalar
const express = require('express');
const path = require('path');

const app = express();

// Serve os arquivos estáticos da pasta dist (gerada pelo ng build)
app.use(express.static(__dirname + '/dist/hoomeeasy'));

app.get('/*', function(req,res) {
    
res.sendFile(path.join(__dirname  + '/dist/hoomeeasyindex.html'));
});

// Inicia a aplicação pela porta configurada
app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
