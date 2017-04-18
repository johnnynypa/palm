function createLote(){
    $.ajax({
        url: "/newLote",
        method: "POST",
        data: {numero: $("#numeroNewLote").val()},
        error: function(err){
            
        },
        success: function(response){
            if(response.ok){
                window.location.href = '/';
            }else{
                alert("Error en los datos");
            }
        }
    });
}
