var conexion = require('./conexion');
var Finca = require('./finca.js');
var Lote = require('./lote.js');

module.exports = class Linea{

    constructor(){
        this.id = null; //int
        this.numero = null; //int en la tabla es numero, el numero de la Linea
        this.lote = null; //Objeto lote al cual pertenece la Linea
    }

    validaDatos(){
        if((this.numero != null) && (this.lote !=null) ){
            return true;
        }
        return false;
    }
    save(){
        if(this.validaDatos()){
            var sentencia = "";
            if(this.id != null){
                //UPDATE
                sentencia = "UPDATE linea SET number = ? WHERE idLinea = "+ this.id +" AND Lote_idLote = ?";
            }else{
                //INSERT
                sentencia = "INSERT INTO linea (number, Lote_idLote) VALUES (?, ?)";
            }
            conexion.query({
                sql: sentencia,
                timeout: 20000,
                values: [this.numero, this.lote.getId()]
            }, function(error){
                if(error){
                    console.log(error);
                }
            })
        }
    }

    setLote(l){
        this.lote=l;
    }

    getLote(){
        return this.lote;
    }

    setNumero(n){
        this.numero = n;
    }

    getNumero(){
        return this.numero;
    }

     setId(ID){
            this.id = ID;
    }

    getId(){
        return this.id;
    }
}