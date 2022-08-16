/*
*/
$(document).ready(function () {
    $("a.nav-link").click(function (e) {
        previouslyActive = $("a.nav-link.active") // Previously active link that has to be changed to inactive
        clickedOption = $(e.target) // Newly clicked link that will be changed to active

        // console.log("You've clicked the link: " + clickedOption.attr("name") + ". Previously active: " + previouslyActive.attr("name"));
        manageMenuOptionSelection(previouslyActive, clickedOption) // Manages the change of the active link and the content visualized in the main frame 

    });
});

/**
 * New link changes to active and old link changes to inactive
 * @param {*} previouslyActive 
 * @param {*} clickedOption 
 */
function changeActiveLink(previouslyActive, clickedOption) {
    previouslyActive.removeClass("active")
    previouslyActive.addClass("link-dark")
    clickedOption.removeClass("link-dark")
    clickedOption.addClass("active")
}

/**
 * Change content of the iframe
 * @param {*} clickedOption 
 */
function changeMainContent(clickedOption) {
    sourceHtml = "./" + clickedOption.attr("name") + ".html" // Generate the name of the html file to be retrieved based on the name of the clicked link
    // console.log(sourceHtml)
    $("#mainContentFrame").attr("src", sourceHtml) // Substitute iframe source with the new html file
}


function manageMenuOptionSelection(previouslyActive, clickedOption) {
    changeActiveLink(previouslyActive, clickedOption)
    changeMainContent(clickedOption)
}