function createLinea(){
    alert($("#numeroNewLinea").val());
    $.ajax({
        url: "/newLinea",
        method: "POST",
        data: {numero: $("#numeroNewLinea").val()},
        error: function(){
            alert("Ha ocurrido un error");
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