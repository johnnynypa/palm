function createLote(){
    $.ajax({
        url: "/newLote",
        method: "POST",
        data: {numero: $("#numeroNewLote").val()},
        error: function(){
            alert("Ha ocurrido un error");
        },
        success: function(response){
            if(response.ok){
                window.location.href = window.history.back();
            }else{
                alert("Error en los datos");
            }
        }
    });
}