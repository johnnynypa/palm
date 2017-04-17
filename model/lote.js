var conexion = require('./conexion');
var Finca = require('./finca.js');


module.exports = class Lote{
    constructor(){
        this.id= null; //Int
        this.numero = null; //Int identificador de el lote en la finca
        this.idFinca = null; //Id
    }
    
    validaDatos(){
        if((this.idFinca) && (this.id) && (this.numero)){
            return true;
        }
        return false;
    }

    save(){
        if(validaDatos()){
            var sentencia ="";
            if(this.id){
                //UPDATE
                sentencia = "UPDATE lote SET  number = ?, Finca_idFinca = ? WHERE idLote = "+this.id+" AND Finca_idFinca =?";
            }else{
                //INSERT
                sentencia = "INSERT INTO lote (number, Finca_idFinca) VALUES ( ?, ?)";
            }
            conexion.query({
                sql:sentencia,
                timeout: 20000,
                values: [this.numero, this.idFinca]
            }, function(error){
                if(error){
                    console.log(error);
                }
            })
        }
    }

    setId(ID){
        this.id = ID;
    }
    getId(){
        return this.id;
    }
    setNumero(Num){
        this.numero = Num;
    }
    getNumero(){
        return this.numero;
    }
    setIdFinca(F){
        this.idFinca = F;
    }
    delete(){
        conexion.query({
            sql: "",
            values:[getId()]
        }, function(err){
            if(err) console.log(err);
        });
    }
}