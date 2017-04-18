function createLote(){
    alert($("#numeroNewLote").val());
    $.ajax({
        url: "/newLote",
        method: "POST",
        data: {numero: $("#numeroNewLote").val()},
        error: function(){
            alert("Ha ocurrido un error");
        },
        success: function(response){
            if(response.ok){
                window.location.href = "/";
            }else{
                alert("Error en los datos");
            }
        }
    });
}