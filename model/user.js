var conexion = require('./conexion.js');
var Finca = require('./finca.js');

module.exports = class User{
    constructor(){
        this.id = null; // int
        this.name = null; //string
        this.password = null; //virtual String
        this.passwordHash = null; // string
        this.finca = null; //Finca
        this.mail = null;
    }

    setMail(correo){
        this.mail = correo;
    }

    getMail(){
        return this.mail;
    }

    setId(ID){
        this.id = ID;
    }

    getId(){
        return this.id;
    }

    getName(){
        return this.name;
    }

    getPassword(){
        return this.password;
    }

    setName(NAME){
        if(NAME.length <= 100){
            this.name = NAME;
            return true;
        }
        return false;
    }

    setPassword(psw){
        this.password = psw;
    }

    getFinca(){
        return this.finca;
    }

    setFinca(f){
        this.finca = f;
    }

    save(){
        if(this.id){
            //UPDATE
        }else{
            //INSERT
        }
    }

    delete(){

    }
}