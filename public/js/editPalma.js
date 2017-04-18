function edit(id){
  $.ajax({
    url:"editPalma",
    method: "POST",
    data:{
      geoN: $("#geoN").val(),
      geoW: $("#geoW").val(),
      planaN: $("#planaN").val(),
      planaW: $("#planaW").val()
    },
    success: function(response){
      if(response.ok){
        window.reload();
      }
    }
  });
}
