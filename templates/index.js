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
                prediction = response.prediction
                $("#original-display").attr("src", originalURL)
                $("#heatmap-display").attr("src", heatmapURL)
                $("#image-model-prediction").text("Model Prediction: " + prediction)
                $("#heatmaps").removeClass("hidden")
                $("#heatmap-separator").removeClass("hidden")
            } else if (http.readyState == 4) {
                stop_loading_modal()
                alert("Error processing image: " + http.responseText)
            }
        }
        http.send(form_data)
    });

    $('#image-dropzone').on(
        'dragover',
        function(e) {
            $("#drop-icon").addClass('drop-active');
            $("#file-drop-message").text('Drop to Select Image');

            e.preventDefault();
            e.stopPropagation();
        }
    )

    $('#image-dropzone').on(
        'dragleave',
        function(e) {
            $("#drop-icon").removeClass('drop-active');
            $("#drop-icon").removeClass('dropped');
            $("file-drop-message").text("Drag & Drop")
            e.preventDefault();
            e.stopPropagation();
        }
    )

    $('#image-dropzone').on(
        'dragenter',
        function(e) {
            e.preventDefault();
            e.stopPropagation();
        }
    )

    $('#image-dropzone').on('drop',
        function(e){
            e.preventDefault();
            e.stopPropagation();
            
            if(e.originalEvent.dataTransfer && e.originalEvent.dataTransfer.files.length) {
                $('#image-file').prop("files", e.originalEvent.dataTransfer.files) 
                $("#drop-icon").removeClass('drop-active');
                $("#drop-icon").addClass('dropped');
                let filename = e.originalEvent.dataTransfer.files[0].name
                let l = filename.length
                if (l > 20) {

                    filename = filename.substring(0, 8) + "..." + filename.substring(l-8, l)
                }
                $("#file-drop-message").text(filename + ' Selected!');
            }
        }
    )

    plot_regression()

    /* For adding navbar shadow on scroll ... remove the class from html first
    $(window).scroll(function() {     
      var scroll = $(window).scrollTop();
      if (scroll > 100) {
          $(".navbar").addClass("navbar-shadow");
      }
      else {
          $(".navbar").removeClass("navbar-shadow");
      }
    }); */
})

function plot_regression() {
    let reg_features = [
        "CRIM",   
        "ZN",   
        "INDUS",  
        "CHAS",  
        "NOX",    
        "RM",     
        "AGE",    
        "DIS",    
        "RAD",    
        "TAX",    
        "PTRATIO",
        "B",      
        "LSTAT"   
    ]
    let reg_descriptions = [
        "Per capita crime rate by town",
        "Proportion of residential land zoned for lots over 25,000 sq.ft.",
        "Proportion of non-retail business acres per town",
        "Bounds Charles River",
        "Nitric oxides concentration (parts per 10 million)",
        "Average number of rooms per dwelling",
        "Proportion of owner-occupied units built prior to 1940",
        "Weighted distances to five Boston employment centres",
        "Index of accessibility to radial highways",
        "Full-value property-tax rate per $10,000",
        "Pupil-teacher ratio by town",
        "Proportion of black residents",
        "Percent 'lower' status of the population"
    ]
    let weights = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]

    var reg_data = [{
      x: reg_features,
      y: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
      type: 'bar',
      text: reg_descriptions,
    }];

    var layout = {
      title: 'Feature Significance for Boston Housing Data',
      font:{
        family: 'Raleway, sans-serif'
      },
      showlegend: false,
      xaxis: {
        tickangle: -45
      },
      yaxis: {
        zeroline: false,
        gridwidth: 2
      },
      bargap :0.05,
      autosize: true,
    };


    Plotly.newPlot('regression-bar-chart', reg_data, layout);
}