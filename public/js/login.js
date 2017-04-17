function iniciarSession(){
  $.ajax({
    url:"/IniciarSession",
    method: 'POST',
    data: {
      userName : $('#userName').val(),
      psw : $('#psw').val()
    },
    dataType: 'text',
    cache: false,
    success: function(response){
      if(response == '1'){
        window.location.href = '/';
      }else{
        $('#myAlert').show();
      }
    }
  })
}