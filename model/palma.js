var conexion = require('./conexion.js');
var Linea = require('./linea.js');


module.exports = class Palma{
    
    constructor(){
        this.id = null; //int
        this.numero = null; //int //En la tabla es number
        this.cGeograficaN = null; //Float Coordenada Geofrafica N
        this.cGeograficaW = null; //Float Coordenada Geografica W
        this.cPlanaN = null; //float coordenada plana N 
        this.cPlanaW = null; //float coordenada plana cW 
        this.linea = null; //Objeto linea al que pertenece la palma 
    }

    validaDatos(){
        if(this.cGeograficaN && this.cGeograficaW && this.cPlanaN && this.cPlanaW && this.linea && this.numero){
            return true;
        }
        return false;
    }

    save(){
        if(this.validaDatos()){
            var sentencia = "";
            if(this.id){
                //UPDATE
                sentencia = "UPDATE palma SET number = ?, cGeograficaN = ?, cGeograficaW = ?, cPlanaN = ?, cPlanaW = ? WHERE idPalma = "+ this.id +" AND Linea_idLinea = ?";
            }else{
                //INSERT
                sentencia = "INSERT INTO palma (number, cGeograficaN, cGeograficaW, cPlanaN, cPlanaW, Linea_idLinea) VALUES (?, ?, ?, ?, ?, ?)";
            }
            conexion.query({
                sql: sentencia,
                timeout: 20000, //20 segundos,
                values: [this.numero, this.cGeograficaN, this.cGeograficaW, this.cPlanaN, this.cPlanaW, this.linea.getId()]
            }, function(error){
                if(error){
                    console.log("Error: "+ error);
                }
            });
        }
    }

    setLinea(l){
        this.linea = l;
    }

    getLinea(){
        return this.linea;
    }

    setCPlanaW(c){
        this.cPlanaW=c;
    }
    
    getCPlanaW(){
        return this.cPlanaW;
    }

    setCPlanaN(c){
            this.cPlanaN = c;
    }
    
    getCPlanaN(){
        return this.cPlanaN;
    }

    setCGeograficaW(c){
        this.cGeograficaW = c;
    }
    
    getCGeograficaW(){
        return this.cGeograficaW;
    }

    setCGeograficaN(c){
            this.cGeograficaN = c;
    }
    
    getCGeograficaN(){
        return this.cGeograficaN;
    }

    setid(ID){
        this.id = ID;
    }

    getid(){
        return this.id;
    }

    setNumero(n){
        this.numero = n;
    }

    getNumero(){
        return this.numero;
    }
}