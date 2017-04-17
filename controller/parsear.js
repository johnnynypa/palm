var Modelo = require('../model/model.js');

var Finca = Modelo.Finca;
var User = Modelo.User;
var Lote = Modelo.Lote;
var Linea = Modelo.Linea;
var Palma = Modelo.Palma;

var parsearLote = function(lote, callback){
    if(!lote) return callback(null);
    console.log("AQUI PARSEADO");
    var l = new Lote();
    l.setId(lote.id);
    l.setNumero(lote.numero);
    l.setIdFinca(lote.idFinca);
    return callback(l);
}

var parsearFinca = function(finca, callback){
    var f = new Finca();
    f.setId(finca.id);
    f.setName(finca.name);
    parsearLote(finca.lote, function(l){
        f.setLote(l);
        callback(f);
    });
}

var parsearUser = function(user, callback){
    var u = new User();
    u.setId(user.id);
    u.setMail(user.mail);
    u.setName(user.name);
    u.setPassword(user.password);
    parsearFinca(user.finca, function(f){
        u.setFinca(f);
        callback(u);
    });
}

module.exports.parsearUser = parsearUser;
module.exports.parsearLote = parsearLote;
module.exports.parsearFinca = parsearFinca;