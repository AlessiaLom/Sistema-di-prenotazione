$(document).ready(function(){
    $(".secondSection").hide();
    $(".thirdSection").hide();
    $(".buttonsContainer2").hide();
    $(".buttonsContainer3").hide();

    $("#nextButton1").click(function(){ 
        if($("#bookingDate").val() != "" && $("#bookingTime").val() != "" && $("#bookingGuests").val() != ""){
            event.preventDefault();
            $(".secondSection").show();
            $(".buttonsContainer2").show();
            $(".firstSection").hide();
            $(".buttonsContainer1").hide();
            $("p#privacyError").remove();
        }
    });

    $("#nextButton2").click(function(){
       if(!$("#guestPrivacy").prop("checked") && $("#privacyError").length == 0){
        $("#privacyLabel").after("<p id=\"privacyError\" style=\"color:red; margin-left:1%;\">Devi accettare il consenso per la privacy</p>")
       } else if($("#guestName").val() != "" && $("#guestSurname").val() != "" && $("#guestEmail").val() != "" && $("#guestPhone").val() != "" && $("#guestPrivacy").prop("checked")){
            event.preventDefault();
            $(".secondSection").hide();
            $(".buttonsContainer2").hide();
            $(".thirdSection").show();
            $(".buttonsContainer3").show();

            if($("#guestInfo").val() == ""){
                $("output").html("Data: " + $("#bookingDate").val() + "<br>Ora: " + $("#bookingTime").val() + "<br>Coperti: " + $("#bookingGuests").val() + "<br>Nome: " + $("#guestName").val() + "<br>Cognome: "+ $("#guestSurname").val() + "<br>Email: " + $("#guestEmail").val() + "<br>Cellulare: " + $("#guestPhone").val());
            } else {
                $("output").html("Data: " + $("#bookingDate").val() + "<br>Ora: " + $("#bookingTime").val() + "<br>Coperti: " + $("#bookingGuests").val() + "<br>Nome: " + $("#guestName").val() + "<br>Cognome: "+ $("#guestSurname").val() + "<br>Email: " + $("#guestEmail").val() + "<br>Cellulare: " + $("#guestPhone").val() + "<br>Informazioni aggiuntive: " + $("#guestInfo").val());
            }
        }
    });

    $("#backButton1").click(function(){
        event.preventDefault();
        $(".firstSection").show();
        $(".buttonsContainer1").show();
        $(".secondSection").hide();
        $(".buttonsContainer2").hide();
    });

    $("#backButton2").click(function(){
        event.preventDefault();
        $(".secondSection").show();
        $(".buttonsContainer2").show();
        $(".thirdSection").hide();
        $(".buttonsContainer3").hide();
        $("p#privacyError").remove();
    });
});