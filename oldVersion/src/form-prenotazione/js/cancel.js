$(document).ready(function(){
    /**
     * Regex function for validating emails.
     * @param {*} email 
     * @returns true is mail is valid, false otherwise 
     */
     function validateEmail (email) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
    }

    $("form").submit(function() { 
        $("p").remove();
        if($("#bookingID").val() == "" && $("#IDError").length == 0){
            $("#labelID").before("<p id=\"IDError\" style=\"color:red; margin: 0 0 0 2%;\">Devi inserire il numero di prenotazione</p>")
        }
        if($("#guestName").val() == "" && $("#nameError").length == 0){
            $("#labelName").before("<p id=\"nameError\" style=\"color:red; margin: 0 0 0 2%;\">Devi inserire il tuo nome</p>")
        }
        if($("#guestSurname").val() == "" && $("#surnameError").length == 0){
            $("#labelSurname").before("<p id=\"surnameError\" style=\"color:red; margin: 0 0 0 2%;\">Devi inserire il tuo cognome</p>")
        }
        if($("#guestEmail").val() == "" && $("#emailError").length == 0){
            $("#labelEmail").before("<p id=\"emailError\" style=\"color:red; margin: 0 0 0 2%;\">Devi inserire la tua mail</p>")
        }
        if(!validateEmail($("#guestEmail").val())){
            $("#labelEmail").before("<p id=\"emailFormatError\" style=\"color:red; margin: 0 0 0 2%;\">La mail deve rispettare il formato corretto (example@mail.com)</p>")
        }
        if($("#guestPhone").val() == "" && $("#phoneError").length == 0){
            $("#labelPhone").before("<p id=\"phoneError\" style=\"color:red; margin: 0 0 0 2%;\">Devi inserire il tuo numero di cellulare</p>")
        }
        if($("#guestName").val() != "" && $("#guestSurname").val() != "" && $("#guestEmail").val() != "" && validateEmail($("#guestEmail").val()) && $("#guestPhone").val() != "" &&  $("#bookingID").val() != ""){
            return true;
        } else {
            return false;
        }
    });
});