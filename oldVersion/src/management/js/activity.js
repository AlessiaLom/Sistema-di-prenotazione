$(document).ready(function () {
    $('#addActivityButton').click(function (e) {
        // console.log("You've clicked the: " + $(e.target).attr('id'))
        addEmptyActivityRow()
    });

    $('.deleteActivityButton').click(function (e) {
        // console.log("You've clicked the: " + $(e.target).attr('name'))
        deleteActivityRow(e.target)
    });
});

function deleteActivityRow(button) {
    rowToDelete = $(button).closest('tr')
    $(rowToDelete).remove()
}

function listenNewElements() {

    // Listen delete row buttons
    $('.deleteActivityButton').click(function (e) {
        // // console.log("You've clicked the: " + $(e.target).attr('class'))
        deleteActivityRow(e.target)
    });
}

function addEmptyActivityRow() {
    // Retrieve table element
    $('#activitiesTable > tbody:last-child').append("<tr><th scope='row'><div class='input-group'><input type='text' class='form-control' placeholder='es. Apertivo'aria-describedby='basic-addon1'></div></th><td><div class='input-group'><input type='text' class='form-control' placeholder='es. Apertivo'aria-describedby='basic-addon1'></div></td><td><div class='input-group'><input type='text' class='form-control' placeholder='es. Apertivo'aria-describedby='basic-addon1'></div></td><td><div class='form-check form-check-inline'><input class='form-check-input' type='checkbox' id='LCheckbox' value='option1'><label class='form-check-label' for='inlineCheckbox1'>L</label></div><div class='form-check form-check-inline'><input class='form-check-input' type='checkbox' id='MaCheckbox' value='option2'><label class='form-check-label' for='inlineCheckbox2'>Ma</label></div><div class='form-check form-check-inline'><input class='form-check-input' type='checkbox' id='MeCheckbox' value='option3'><label class='form-check-label' for='inlineCheckbox3'>Me</label></div><div class='form-check form-check-inline'><input class='form-check-input' type='checkbox' id='GCheckbox' value='option3'><label class='form-check-label' for='inlineCheckbox3'>G</label></div><div class='form-check form-check-inline'><input class='form-check-input' type='checkbox' id='VCheckbox' value='option3'><label class='form-check-label' for='inlineCheckbox3'>V</label></div><div class='form-check form-check-inline'><input class='form-check-input' type='checkbox' id='SCheckbox' value='option3'><label class='form-check-label' for='inlineCheckbox3'>S</label></div><div class='form-check form-check-inline'><input class='form-check-input' type='checkbox' id='DCheckbox' value='option3'><label class='form-check-label' for='inlineCheckbox3'>D</label></div></td><td><button type='button' class='deleteActivityButton btn btn-outline-danger'><i class='bi bi-trash'></i></button></td></tr>")
    listenNewElements()
}