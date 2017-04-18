var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var Modelo = require('./model/model.js');
var parsers = require('./controller/parsear.js');

var Finca = Modelo.Finca;
var User = Modelo.User;
var Lote = Modelo.Lote;
var Linea = Modelo.Linea;
var Palma = Modelo.Palma;

app.set('view engine', 'pug');


app.use('/public', express.static('public'));
app.use(session({
  secret: 'hvsdfvdsfuvcnbusbcadbfqiuhnbnsfsfers',
  resave: true,
  saveUninitialized: true
}));

app.get('/', function(req, res){
  res.render('index', {
    pagekey: 'Inicio',
    session: req.session.user,
    lotes: req.session.user ? req.session.user.finca.lote[0] : null
  });
});

app.get('/logout', function(req, res){
  req.session.destroy();
  res.redirect('/');
});

app.post('/lote', urlencodedParser, function(req, res){
  if(req.body.id){
    req.session.loteId = req.body.id;
    res.send({
      url: '/lote/' + req.body.id,
      ok: true
    });
    return;
  }else{
    res.send({
      ok: false
    })
  }
});

app.get('/lote/:id', function(req, res){
  if(sessionIniciada(req)){
    if( req.session.loteId && (req.session.loteId == req.params.id)){
      //Cargar informacion(Las lineas pertenecientes al lote) y enviar
      Modelo.loadLineasByLote(req.session.loteId, function(err, result){
        req.session.lineasUso = result;
        res.render('loteId', {
          pagekey: 'Lotes',
          session: req.session.user,
          loteId: req.session.loteId,
          lineas: result
        });
      });
    }else{
      res.send(404);
    }
  }else{
    req.session.destroy();
    res.redirect('/');
  }
});

app.post('/linea', urlencodedParser, function(req, res){
  if(req.body.id){
    req.session.lineaId = req.body.id;
    req.session.lineaNumber = req.body.numero;
    res.send({
      ok: true,
      url: "/linea/"+req.session.lineaNumber
    });
    return;
  }else{
    res.send({
      ok:false
    })
  }
});

app.get('/linea/:numero',urlencodedParser, function(req, res){
  if(sessionIniciada(req)){
    if(req.session.lineaId && (req.session.lineaNumber == req.params.numero)){
      //Cargar informacion (las palmas de la linea) y enviar
      Modelo.loadPalmasByLinea(req.session.lineaId, function(err, result){
        req.session.palmasenUso = result;
        res.render('lineaId', {
          pagekey: 'Linea',
          session: req.session.user,
          lineaId: req.session.lineaId,
          lineaNumero: req.session.lineaNumber,
          palmas: result
        });
      });
    }else{
      res.send(404);
    }
  }else{
    res.redirect('/');
  }
});

app.post('/IniciarSession', urlencodedParser, function(req, res){
  //Verificamos que no haya una session ya iniciada, si la hay la cerramos
  if(req.session.user){
    req.session.destroy();
  }

  //validamos que haya parametros
  if(!req.body) return res.send(400);

  //validar credenciales
  Modelo.loadUser(req.body.userName, req.body.psw, function(err, result){
    if(err) return res.send('0');
    if(result){
      req.session.user = result;
      res.send('1');
      return;
    }
    res.send('0');
  });
});

// =================================================================================================
//ELIMINACIONES

app.post('/eliPalma', urlencodedParser, function(req, res){
  if(sessionIniciada(req) && req.body.id){
    req.session.palmasenUso.forEach(function(item, index){
      if(item.idPalma == req.body.id){
        Modelo.eliminarPalma(item.idPalma, function(err, result){
          actualizarDataUser(req, function(){
            res.send({ok:true});
          });
        });
      }
    });
  }else{
    res.send({ok:false});
  }
});

app.post('/eliLinea', urlencodedParser, function(req, res){
  if(sessionIniciada(req) && req.body.id ){
    req.session.lineasUso.forEach(function(item, index){
      if(item.idLinea == req.body.id){
        Modelo.eliminarLinea(item.idLinea, function(){
          console.log("entro");
          actualizarDataUser(req, function(){
            res.send({ok:true});
          });
          return;
        });
      }
    });
  }else{
    res.send({ok:false});
  }
});

app.post('/eliminarLote', urlencodedParser, function(req, res){
  if(sessionIniciada(req)){
    req.session.user.finca.lote[0].forEach(function(val) {
      if(val.id == req.body.id){
        Modelo.eliminarLote(req.body.id, function(){
          actualizarDataUser(req, function(){
            res.send({ok: true});
            return;
          })
        });
      }
    });
  }else{
    res.end();
  }
});

// ==================================================================================================
// Registrar

app.get("/newLote/:id",urlencodedParser, function(req, res){
  if(sessionIniciada(req) && req.params.id && req.session.user.finca.id == req.params.id){
    res.render('createLote', {
      session : req.session.user
    });
  }else{
    res.redirect('/');
  }
});

app.post('/newLote', urlencodedParser, function(req, res){
  if(sessionIniciada(req) && req.body.numero){
    if(!exitsLotebyNumero(req.body.numero, req.session.user.finca.lote[0])){
      Modelo.crearLote(req.body.numero, req.session.user.finca.id, function(){
        actualizarDataUser(req, function(){
          res.send({ok: true});
        });
      });
    }else{
      res.send({ok:false});  
    }
  }else{
    res.send({ok:false});
  }
});

app.listen(8000);

function sessionIniciada(req){
  if(req.session.user){
    return true;
  }
  return false;
}

function actualizarDataUser(req, callback){
  Modelo.loadUser(req.session.user.name, req.session.user.password, function(err, result){
    if(result){
      req.session.user = result;
      return callback();
    }
  });
}

function exitsLotebyNumero(numero, lotes){
  for (var item in lotes){
    if(numero == lotes[item].numero){
      return true;
    }
  }
  return false;
}