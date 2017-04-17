function irLinea(id, num){
    $.ajax({
        url: "/linea/",
        data: {id: id, numero:num },
        method: 'POST',
        error: function(){
            alert("Ha ocurrido un error, cierre session y vuelva a intentarlo");
        },
        success(response){
            if(response.ok){
                window.location.href = response.url;
            }else{
                alert("Error en los datos");
            }
        }
    })
}

function eliminarLinea(id){
    $.ajax({
        url: "/eliLinea",
        method: "POST",
        data: {id: id},
        error: function(){
            alert("Ha ocurrido un error, cierre session y vuelva a intentarlo");
        },
        success: function(response){
            if(response.ok){
                location.reload();
            }else{
                alert("La Linea no se ha podido eliminar");
            }
        }
    })
}