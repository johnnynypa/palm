function createLinea(){
    $.ajax({
        url: "/newLinea",
        method: "POST",
        data: {numero: $("#numeroNewLinea").val()},
        error: function(){

        },
        success: function(response){
            if(response.ok){
                window.location.href = response.url;
            }else{
                alert("Error en los datos");
            }
        }
    });
}

function volver(id){
  window.location.href = "/lote/"+id;
}
