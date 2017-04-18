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

var eliminarPalmasOfLinea = function(idLinea, callback){
    conexion.query({
        sql: "DELETE FROM palma WHERE Linea_idLinea = ?",
        values: [idLinea]
    }, function(err, result){
        if(err) console.log(err);
        callback(idLinea);
    })
}

var eliminarLinea = function(idLinea, callback){
    eliminarPalmasOfLinea(idLinea, function(idLinea){
        conexion.query({
            sql: "DELETE FROM linea WHERE idLinea = ?",
            values: [idLinea]
        }, function(err, result){
            if(err) console.log(err);
            callback();
        });
    })
}

var eliminarPalma = function(idPalma, callback){
    conexion.query({
        sql:"DELETE FROM palma WHERE idPalma = ?",
        values: [idPalma]
    }, function(err, result){
        if(err) console.log(err);
        callback(err, result);
    });
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

var loadAllLineaByLote = function(idLote, callback, callbackFn){
    conexion.query({
        sql: "SELECT idLinea, number FROM linea WHERE Lote_idLote = ?",
        timeout: 10000,
        values: [idLote]
    }, function(err, results){
        if(err) return callback(err, null);
        callback(null, results, callbackFn);
			  
    })
}

var elimDatosLote = function(idLote, callback){
	loadAllLineaByLote(idLote, function(err, results){
		if(err) console.log(err);
		for (item in results){
			eliminarLinea(item.idLinea);
		}
		callback();
	});
}

var crearPalma = function(numero, idLinea, geoN, geoW, planaN, planaW, callback){
    var palma = new Palma();
    palma.setNumero(numero);
    palma.setLinea(new Linea());
    palma.getLinea().setId(idLinea);
    palma.setCGeograficaN(geoN);
    palma.setCGeograficaW(geoW);
    palma.setCPlanaN(planaN);
    palma.setCPlanaW(planaW);
    palma.save();
    callback();
}

var crearLinea = function(numero, idLote, callback){
    var li = new Linea();
    li.setLote(new Lote());
    li.getLote().setId(idLote);
    li.setNumero(numero);
    li.save();
    callback();
}

var crearLote = function(numero, idFinca, callback){
    var lo = new Lote();
    lo.setIdFinca(idFinca);
    lo.setNumero(numero);
    lo.save();
    callback();
}

var eliminarLote = function(idLote, callback){
	elimDatosLote(idLote, function(){
		//Despues de eliminar todas sus lineas y palmas se elimina el lote
		conexion.query({
			sql: "DELETE FROM lote WHERE idLote = ?",
			values: [idLote]
		}, function(err){
			if(err) console.log(err);
			return callback();
		});
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
module.exports.eliminarLinea = eliminarLinea;
module.exports.crearLote = crearLote;
module.exports.crearLinea = crearLinea;
module.exports.crearPalma = crearPalma;