var conexion = require('./conexion');
var Finca = require('./finca.js');
var User = require('./user.js');
var Lote = require('./lote.js');
var Linea = require('./linea.js');
var Palma = require('./palma.js');

var findLotes = function(idFinca, callback){
    conexion.query({
        sql: "SELECT idLote, number FROM lote WHERE Finca_idFinca = ?",
        timeout: 20000,
        values: [idFinca]
    }, function(err, result){
        if(err) return callback(err, null);

        if(!result[0]) return callback(null, null);
        var i = 0;
        var lotes = [];
        while(result[i]){
            var l = new Lote();
            l.setId(result[i]['idLote']);
            l.setNumero(result[i]['number']);
            l.setIdFinca(idFinca);
            lotes.push(l);
            i++;
        }
        callback(null, lotes);
    })
}

var eliminarPalma = function(idPalma, callback){
    console.log(conexion.query({
        sql:"DELETE FROM palma WHERE idPalma = ?",
        values: [idPalma]
    }, function(err, result){
        console.log(err);
        callback(err, result);
    }));
}

var findFinca = function(id, callback){
    conexion.query({
        sql: "SELECT name FROM finca WHERE idFinca = ?",
        timeout: 20000,
        values: [id]
    }, function (err, result){
        if(err) return callback(err, null);

        //creamos el objeto finca si existe
        if(!result[0]) return callback(null, null);
        
        var finca = new Finca();
        finca.setName(result[0]['name']);
        finca.setId(id);
        findLotes(id, function(err, lotes){
            if (err){
                callback(err, null);
                return;
            }
            finca.setLote(lotes);
            callback(null, finca);
        })
    });
}

var loadPalmasByLinea = function(idLinea, callback){
    conexion.query({
        sql: "SELECT idPalma, number, cGeograficaN, cGeograficaW, cPlanaN, cPlanaW FROM palma WHERE Linea_idLinea = ?",
        values: [idLinea]
    },function(err, result){
        callback(err, result);
    })
}

var loadLineasByLote = function(idLote, callback){
    conexion.query({
        sql: "SELECT idLinea, number FROM linea WHERE Lote_idLote = ?",
        values: [idLote]
    },function(err, result){
        return callback(err, result)
    })
}

var eliminarLinea = function(linea, callback){
}

var loadAllLineaByLote = function(lote, callback){
    conexion.query({
        sql: "SELECT idLinea, number FROM linea WHERE Lote_idLote = ?",
        timeout: 10000,
        values: [lote.getId()]
    }, function(err, results){
        if(err) return callback(err, null);
        if(results) return callback(null, results);
        return callback(null, null);
    })
}

var eliminarLote = function(lote, callback){
    loadAllLineaByLote(lote, function(err, lineas){
        if(err) return callback(err, lineas);

        if(lineas){
            lineas.forEach(function(element){
                //Borramos las palmas de la linea
                conexion.query({
                    sql: "DELETE FROM palma WHERE Linea_idLinea = ?",
                    values: [element.idLinea]
                }, function(err, result){
                    if(err) console.log(err);
                    if(result) console.log(result);
                });
            }, function(){
                //borrar la linea
                conexion.query({
                    sql: "DELETE FROM linea WHERE Lote_idLote = ?",
                    values: [element.Lote_idLote]
                }, function(err, result){
                    if(err) console.log(err);
                    if(result) console.log(result);
                });
            }, function(){
                //eliminar el lote
                lote.delete()
                return callback(null, true);
            });
        }
    });
}

var loadUser = function(userName, psw, callback){
    conexion.query({
        sql: "SELECT idUser, mail, Finca_idFinca FROM user WHERE userName = ? AND password = ?",
        timeout: 20000,
        values: [userName, psw]
    }, function(err, results){
        if(err){
            callback(err, null);
            return;
        }

        //creamos el objeto usuario si existe
        if(!results[0]){
            callback(null, null);
            return;
        }else{
            var usuario = new User();
            usuario.setId(results[0]['idUser']);
            usuario.setMail(results[0]['mail']);
            usuario.setName(userName);
            usuario.setPassword(psw);
            findFinca(results[0]['Finca_idFinca'], function(err, finca){
                usuario.setFinca(finca);
                callback(null, usuario); //lo devolvemos
            });
            
        }   
        
    });
}

module.exports.Finca = Finca;
module.exports.User = User;
module.exports.Lote = Lote;
module.exports.Linea = Linea;
module.exports.Palma = Palma;
module.exports.findFinca = findFinca;
module.exports.loadUser = loadUser;
module.exports.findLotes = findLotes;
module.exports.eliminarLote = eliminarLote;
module.exports.loadLineasByLote = loadLineasByLote;
module.exports.loadPalmasByLinea = loadPalmasByLinea;
module.exports.eliminarPalma = eliminarPalma;