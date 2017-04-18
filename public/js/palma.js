function eliminarPalma(id){
    $.ajax({
        url: "/eliPalma",
        data:{id: id},
        method: "POST",
        error: function(){
            alert("Ha ocurrido un error.");
            alert("Cierre session y vuelva a intentar, si el error persiste contacte al administrador");
        },
        success: function(response){
            if(response.ok){
                location.reload();
            }else{
                alert("La palma no se ha podido eliminar");
            }
        }
    });
}

function irNewPalma(){
    window.location.href = "/newPalma";
}