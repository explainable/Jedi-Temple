var modalDisplayed = false

//subtext optional
function display_loading_modal(maintext, subtext) {
    $("#loading-modal").on('shown.bs.modal', function () {
        if (!modalDisplayed) // If stopped before finished loading
            $("#loading-modal").modal("hide")
    })

    modalDisplayed = true
    $("#loader-maintext").text(maintext)
    if (subtext) {
        $("#loader-subtext").text(subtext)
    }
    $("#loading-modal").modal({
      backdrop: "static", //remove ability to close modal with click
      keyboard: false, //remove option to close with keyboard
      show: true //Display loader!
    });
}

function stop_loading_modal() {
    modalDisplayed = false
    $("#loading-modal").modal("hide")
}