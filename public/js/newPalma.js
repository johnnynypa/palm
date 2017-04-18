function createPalma(){
    $.ajax({
        url: "/newPalma",
        method: "POST",
        data: {
            numero: $("#numeroNewPalma").val(),
            geoN : $("#geoN").val(),
            geoW : $("#geoW").val(),
            planaN : $("#planaN").val(),
            planaW : $("#planaW").val(),
        },
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
  window.location.href = "/linea/"+id;
}
