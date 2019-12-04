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
                show_heatmaps(originalURL, heatmapURL, prediction)
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
            } else {
                $("#drop-icon").removeClass('drop-active');
                $("#drop-icon").removeClass('dropped');
                $("file-drop-message").text("Drag & Drop")
            }
        }
    )

    plot_regression()

    /* For adding navbar shadow on scroll ... remove the class from html first */
    $(window).scroll(function() {     
      var scroll = $(window).scrollTop();
      if (scroll > 100) {
          $(".navbar").addClass("navbar-shadow");
      }
      else {
          $(".navbar").removeClass("navbar-shadow");
      }
    }); /* */


    /* Update slider text */
    $("#CRIM").on("change", (e) => {$("#CRIM-value").text($("#CRIM").val()); plot_regression()})
    $("#ZN").on("change", (e) => {$("#ZN-value").text($("#ZN").val()); plot_regression()})
    $("#INDUS").on("change", (e) => {$("#INDUS-value").text($("#INDUS").val()); plot_regression()})
    $("#NOX").on("change", (e) => {$("#NOX-value").text($("#NOX").val()); plot_regression()})
    $("#RM").on("change", (e) => {$("#RM-value").text($("#RM").val()); plot_regression()})
    $("#AGE").on("change", (e) => {$("#AGE-value").text($("#AGE").val()); plot_regression()})
    $("#DIS").on("change", (e) => {$("#DIS-value").text($("#DIS").val()); plot_regression()})
    $("#RAD").on("change", (e) => {$("#RAD-value").text($("#RAD").val()); plot_regression()})
    $("#TAX").on("change", (e) => {$("#TAX-value").text($("#TAX").val()); plot_regression()})
    $("#PTRATIO").on("change", (e) => {$("#PTRATIO-value").text($("#PTRATIO").val()); plot_regression()})
    $("#B").on("change", (e) => {$("#B-value").text($("#B").val()); plot_regression()})
    $("#LSTAT").on("change", (e) => {$("#LSTAT-value").text($("#LSTAT").val()); plot_regression()})
    $("#CHAS").on("change", (e) => {plot_regression()})
    $(window).resize(function(){plot_regression()}) /* keeps plot centered and appropriately sized */

    $(".0-example").on("click", (e) => {
        e.preventDefault()
        show_heatmaps("/img/0.png", "/img/0_heatmap.png", "0")
    })
    $(".1-example").on("click", (e) => {
        e.preventDefault()
        show_heatmaps("/img/1.png", "/img/1_heatmap.png", "1")
    })
    $(".2-example").on("click", (e) => {
        e.preventDefault()
        show_heatmaps("/img/2.png", "/img/2_heatmap.png", "2")
    })
    $(".3-example").on("click", (e) => {
        e.preventDefault()
        show_heatmaps("/img/3.png", "/img/3_heatmap.png", "3")
    })
    $(".4-example").on("click", (e) => {
        e.preventDefault()
        show_heatmaps("/img/4.png", "/img/4_heatmap.png", "4")
    })
    $(".5-example").on("click", (e) => {
        e.preventDefault()
        show_heatmaps("/img/5.png", "/img/5_heatmap.png", "5")
    })
    $(".6-example").on("click", (e) => {
        e.preventDefault()
        show_heatmaps("/img/6.png", "/img/6_heatmap.png", "6")
    })
    $(".7-example").on("click", (e) => {
        e.preventDefault()
        show_heatmaps("/img/7.png", "/img/7_heatmap.png", "7")
    })
    $(".8-example").on("click", (e) => {
        e.preventDefault()
        show_heatmaps("/img/8.png", "/img/8_heatmap.png", "8")
    })
    $(".9-example").on("click", (e) => {
        e.preventDefault()
        show_heatmaps("/img/9.png", "/img/9_heatmap.png", "9")
    })

})

function show_heatmaps(originalURL, heatmapURL, prediction) {
    $("#original-display").attr("src", originalURL)
    $("#heatmap-display").attr("src", heatmapURL)
    $("#image-model-prediction").text("Model Prediction: " + prediction)
    $("#heatmaps").removeClass("hidden")
    $("#heatmap-separator").removeClass("hidden")
}

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
        "Weighted distances to five Boston employment centers",
        "Index of accessibility to radial highways",
        "Full-value property-tax rate per $10,000",
        "Pupil-teacher ratio by town",
        "Proportion of black residents",
        "Percent 'lower' status of the population"
    ]
    let weights = [
        -0.108,
        0.046,
        0.021,
        2.687,
        -17.767,
        3.810,
        0.001,
        -1.476,
        0.306,
        -0.012,
        -0.953,
        0.009,
        -0.525
    ]

    let chas = 0; 
    if ($("#CHAS option:selected").val() == "YES") chas = 1

    let crim = $("#CRIM").val()
    let zn = $("#ZN").val()
    let indus = $("#INDUS").val()
    let nox = $("#NOX").val()
    let rm = $("#RM").val()
    let age = $("#AGE").val()
    let dis = $("#DIS").val()
    let rad = $("#RAD").val()
    let tax = $("#TAX").val()
    let ptratio = $("#PTRATIO").val()
    let b = $("#B").val()
    let lstat = $("#LSTAT").val()
    /* VALIDATE THESE FIRST */

    values = [crim, zn, indus, chas, nox, rm, age, dis, rad, tax, ptratio, b, lstat]

    let contributions = []
    for (let i=0; i < weights.length; i++) {
        contributions.push(values[i] * weights[i])
    }

    const COLORS = [
        "#F20000", 
        "#059BBB", 
        "#059BBB", 
        "#059BBB", 
        "#F20000", 
        "#059BBB", 
        "#059BBB", 
        "#F20000", 
        "#059BBB", 
        "#F20000", 
        "#F20000", 
        "#059BBB", 
        "#F20000"
    ]

    var reg_data = [{
      x: reg_features,
      y: contributions,
      type: 'bar',
      text: reg_descriptions,
      marker: {color: COLORS},
    }];

    var layout = {
      title: 'Feature Significance for Regression',
      font:{
        family: 'Raleway, sans-serif'
      },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      showlegend: false,
      xaxis: {
        tickangle: -45
      },
      yaxis: {
        zeroline: false,
        title: "Contribution",
        gridwidth: 2
      },
      bargap :0.05,
      autosize: true,
    };

    prediction = 0
    for (let c of contributions) {
        prediction += c
    }
    prediction += 36.45948838508994 // bias
    prediction *= 1000 // scaling per dataset
    $("#regression-prediction").text("Predicted House Price: $" + prediction.toFixed(2))

    Plotly.newPlot('regression-bar-chart', reg_data, layout);
}