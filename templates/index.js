var currentImageModel = "PICTURE_MODEL1"

$(document).ready(function() {
    $("#image-upload").submit(function(e) {
        e.preventDefault();
        
        let URL = "/mlmodel?model=" + currentImageModel
        var file_data = $('#image-file').prop('files')[0];
        if (!file_data) {
            alert("You must select an image first.")
            return
        }

        let form_data = new FormData();
        form_data.append('pic', file_data);

        display_loading_modal("Processing Image", "Generating Heatmap...")

        var http = new XMLHttpRequest()
        http.open("POST", URL, true)
        http.onreadystatechange = () => {
            if (http.readyState == 4 && http.status == 200) {
                stop_loading_modal()
                response = JSON.parse(http.responseText)
                originalURL = response.original.replace("templates", "")
                heatmapURL = response.heatmap.replace("templates", "")
                $("#original-display").attr("src", originalURL)
                $("#heatmap-display").attr("src", heatmapURL)
                $("#original-display").removeClass("hidden")
                $("#heatmap-display").removeClass("hidden")
            } else if (http.readyState == 4) {
                stop_loading_modal()
                alert("Error processing image: " + http.responseText)
            }
        }
        http.send(form_data)
    });
})