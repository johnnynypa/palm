function irLote(id){
    $.ajax({
        url: "/lote/",
        data: {id: id},
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

function newLote(id){
    window.location.href = "/newLote/"+id;
}

function eliminarLote(id){
    $.ajax({
        url: "/eliminarLote",
        data:{id: id},
        method: "POST",
        error: function(){
            alert("Ha ocurrido un error, cierre session y vuelva a intentarlo");
        },
        success: function(response){
            if(response.ok){
                window.location.href = "/";
            }else{
                alert("Error en los datos");
            }
        }
    })
}