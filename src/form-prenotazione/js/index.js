$(document).ready(function(){
    $(".secondSection").hide();
    $(".thirdSection").hide();
    $(".buttonsContainer2").hide();
    $(".buttonsContainer3").hide();


    /**
     * Regex function for validating emails.
     * @param {*} email 
     * @returns true is mail is valid, false otherwise 
     */
    function validateEmail (email) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
    }

    //Go to second step
    $("#nextButton1").click(function(){
        $("p").remove();
        if($("#bookingDate").val() == "" && $("#privacyError").length == 0){
            $("#labelDate").before("<p id=\"dateError\" style=\"color:red; margin: 0 0 0 2%;\">Devi inserire la data di prenotazione</p>")
        }
        if($("#bookingTime").val() == "" && $("#timeError").length == 0){
            $("#labelTime").before("<p id=\"timeError\" style=\"color:red; margin: 0 0 0 2%;\">Devi inserire l'orario di prenotazione</p>")
        }
        if($("#bookingGuests").val() == "" && $("#guestsError").length == 0){
            $("#labelGuests").before("<p id=\"guestsError\" style=\"color:red; margin: 0 0 0 2%;\">Devi inserire il numero di coperti</p>")
        }

        if($("#bookingDate").val() != "" && $("#bookingTime").val() != "" && $("#bookingGuests").val() != ""){
            $(".secondSection").show();
            $(".buttonsContainer2").show();
            $(".firstSection").hide();
            $(".buttonsContainer1").hide();
            $("p#privacyError").remove();
        }
    });

    //Go to third step
    $("#nextButton2").click(function(){
        $("p").remove();

        if($("#guestName").val() == "" && $("#nameError").length == 0){
            $("#labelName").before("<p id=\"nameError\" style=\"color:red; margin: 0 0 0 2%;\">Devi inserire il tuo nome</p>")
        }
        if($("#guestSurname").val() == "" && $("#surnameError").length == 0){
            $("#labelSurname").before("<p id=\"surnameError\" style=\"color:red; margin: 0 0 0 2%;\">Devi inserire il tuo cognome</p>")
        }
        if($("#guestEmail").val() == "" && $("#emailError").length == 0){
            $("#labelEmail").before("<p id=\"emailError\" style=\"color:red; margin: 0 0 0 2%;\">Devi inserire la tua email</p>")
        }
        if(!validateEmail($("#guestEmail").val())){
            $("#labelEmail").before("<p id=\"emailFormatError\" style=\"color:red; margin: 0 0 0 2%;\">La mail deve rispettare il formato corretto (example@mail.com)</p>")
        }
        if($("#guestPhone").val() == "" && $("#guestError").length == 0){
            $("#labelPhone").before("<p id=\"guestError\" style=\"color:red; margin: 0 0 0 2%;\">Devi inserire il tuo numero di cellulare</p>")
        }

        if(!$("#guestPrivacy").prop("checked") && $("#privacyError").length == 0){
            $("#privacyLabel").after("<p id=\"privacyError\" style=\"color:red; margin-left:1%;\">Devi accettare il consenso per la privacy</p>")
        } else if($("#guestName").val() != "" && $("#guestSurname").val() != "" && $("#guestEmail").val() != "" && validateEmail($("#guestEmail").val()) && $("#guestPhone").val() != "" && $("#guestPrivacy").prop("checked")){
                $(".secondSection").hide();
                $(".buttonsContainer2").hide();
                $(".thirdSection").show();
                $(".buttonsContainer3").show();

                const year = $("#bookingDate").val().split("-")[0];
                const month = $("#bookingDate").val().split("-")[1];
                const day = $("#bookingDate").val().split("-")[2];

                if($("#guestInfo").val() == ""){
                    $("output").html("Data: " + day + "/" + month + "/" + year + "<br>Ora: " + $("#bookingTime").val() + "<br>Coperti: " + $("#bookingGuests").val() + "<br>Nome: " + $("#guestName").val() + "<br>Cognome: "+ $("#guestSurname").val() + "<br>Email: " + $("#guestEmail").val() + "<br>Cellulare: " + $("#guestPhone").val());
                } else {
                    $("output").html("Data: " + day + "/" + month + "/" + year + "<br>Ora: " + $("#bookingTime").val() + "<br>Coperti: " + $("#bookingGuests").val() + "<br>Nome: " + $("#guestName").val() + "<br>Cognome: "+ $("#guestSurname").val() + "<br>Email: " + $("#guestEmail").val() + "<br>Cellulare: " + $("#guestPhone").val() + "<br>Informazioni aggiuntive: " + $("#guestInfo").val());
                }
            }
    });

    //Back to first step
    $("#backButton1").click(function(){
        $(".firstSection").show();
        $(".buttonsContainer1").show();
        $(".secondSection").hide();
        $(".buttonsContainer2").hide();
        $("p").remove();
    });

    //Back to second step
    $("#backButton2").click(function(){
        $(".secondSection").show();
        $(".buttonsContainer2").show();
        $(".thirdSection").hide();
        $(".buttonsContainer3").hide();
        $("p").remove();
    });
});