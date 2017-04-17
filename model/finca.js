var conexion = require('./conexion');
var User = require('./user.js');
var Lote = require('./lote.js');

module.exports = class Finca{
    constructor(){
        this.id= null;
        this.name = null; //string Max 100 caracteres
        this.lote = []; //Array de Lotes
        this.user = null; //Usuario - No esta en la Base de datos
    }

    validaDatos(){
        if((this.id) && (this.lote) && (this.name) && (this.user)){
            return true;
        }else{
            return false;
        }
    }
    save(){
        if(validaDatos()){
            var sentencia = "";
            if(this.id){
                //UPDATE
                sentencia = "UPDATE finca SET name` = ? WHERE `idFinca` = "+ this.id;
            }else{
                //INSERT
                sentencia = "INSERT INTO finca (name) VALUES ( ? )";
            }
            conexion.query({
                sql: sentencia,
                timeout: 20000,
                values: [this.name]
            }, function(error){
                console.log(error);
            })
        }
    }

    setId(ID){
        this.id = ID;
    }
    setName(NAME){
        if(NAME.length <= 100){
            this.name = NAME;
        }
    }
    setLote(LOTE){
            this.lote.push(LOTE);
    }
    setUser(USER){
        this.user = USER;        
    }
    getId(){
        return this.id;
    }
    getName(){
        return this.name;
    }
    getAllsLote(){
        return this.lote;
    }
    getLoteByPos(posicion){
        return this.lote[posicion];
    }
    getLoteById(ID){
        for(i in this.lote){
            if(i.Id()==ID){
                return i;
            }
        }
        return null;
    }
}