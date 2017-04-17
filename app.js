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

app.get('/linea/:numero', function(req, res){
  if(sessionIniciada(req)){
    if(req.session.lineaId && (req.session.lineaNumber == req.params.numero)){
      //Cargar informacion (las palmas de la linea) y enviar
      Modelo.loadPalmasByLinea(req.session.lineaId, function(err, result){
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

//Para lo ultimo aun no esta terminado, tiene errores... ///////////////////////////////////////////
app.post('/eliminarLote', urlencodedParser, function(req, res){
  console.log("Here 1");
  
  if(sessionIniciada(req)){
    req.session.user.finca.lote[0].forEach(function(val) {
      if(val.id == req.body.id){
        parsers.parsearLote(val, function(LoteParseado){
          Modelo.eliminarLote(LoteParseado, function(err){
            console.log(err);
            //Cargamos la nueva informacion del usuario
            Modelo.loadUser(req.session.user.name, req.session.password, function(err, result){
              if(result){
                req.session.user = result;
                res.send('1');
              }
              res.send('0');
            });
          });
        });
        return;
      }else{
        res.end();
      }
    }, this)
  }
});

app.listen(8000);

function sessionIniciada(req){
  if(req.session.user){
    return true;
  }
  return false;
}