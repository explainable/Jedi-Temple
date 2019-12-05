var currentImageModel = "PICTURE_MODEL1"
var currentClassificationModel = "TITANIC_TREE"
var lastTreePrediction = "Alive"
var lastTreePredictionNode = "Abel"

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
    plot_decision_tree(true)
    $(window).resize(function(){plot_regression(); plot_decision_tree(false)}) /* keeps plot centered and appropriately sized */


    /* For adding navbar shadow on scroll ... remove the class from html first */
    $(window).scroll(function() {     
      var scroll = $(window).scrollTop();
      if (scroll > 60) {
          $(".navbar").addClass("navbar-shadow");
      }
      else {
          $(".navbar").removeClass("navbar-shadow");
      }
    }); /* */


    /* Update regression on interaction */
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

    /* Update decision tree on interaction */
    $("#P-AGE").on("change", (e) => {$("#P-AGE-value").text($("#P-AGE").val()); plot_decision_tree(true)})
    $("#FARE").on("change", (e) => {$("#FARE-value").text($("#FARE").val()); plot_decision_tree(true)})
    $("#PCLASS").on("change", (e) => {plot_decision_tree(true)})
    $("#SPOUSES").on("change", (e) => {plot_decision_tree(true)})
    $("#SEX").on("change", (e) => {plot_decision_tree(true)})
    $("#CHILDREN").on("change", (e) => {plot_decision_tree(true)})


    /* load example heatmaps on click */
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

function plot_decision_tree(shouldQuery) {
    let result = ""
    let node = ""
    const DEFAULT_NODE = "3: Siblings/Spouses Aboard<=2.5"

    if (shouldQuery) { // query new result 
        let pclass = parseInt($("#PCLASS option:selected").val())
        let spouses = parseInt($("#SPOUSES option:selected").val()) 
        let sex = $("#SEX option:selected").val()
        if (sex == "MALE") {
            sex = 0
        } else {
            sex = 1
        }
        let children = parseInt($("#CHILDREN  option:selected").val())
        let fare = $("#FARE").val()
        let age = $("#P-AGE").val()

        let values = [pclass, sex, age, spouses, children, fare] // same order as csv

        let URL = "/mlmodel?model=" + currentClassificationModel
        var http = new XMLHttpRequest()
        http.open("POST", URL, true)
        http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
        http.onreadystatechange = () => {
            if (http.readyState == 4 && http.status == 200) {
                response = JSON.parse(http.responseText)
                if (parseFloat(response.alive_percent) >= .5) {
                    result = "Alive"
                } else {
                    result = "Dead"
                }
                
                node = response.label // node label in tree
                lastTreePrediction = result
                lastTreePredictionNode = node

                render_decision_tree_plot(result, node)
            } else if (http.readyState == 4) {
                console.error(http.responseText)
                render_decision_tree_plot(lastTreePrediction, DEFAULT_NODE)
            }
        }
        http.send("features=" + JSON.stringify(values))
    } else {
        render_decision_tree_plot(lastTreePrediction, lastTreePredictionNode)
    }
}

function render_decision_tree_plot(result, node) {
    $("#decision-tree-prediction").text("Prediction: " + result)

    // ["Eve", "Cain", "Seth", "Enos", "Noam", "Abel", "Awan", "Enoch", "Azura"]
    // ["", "Eve", "Eve", "Seth", "Seth", "Eve", "Eve", "Awan", "Eve" ]

    let nodes = ['Everyone', '1: Sex<=0.5', '26: Sex>0.5', '2: Age<=13.0', '13: Age>13.0', '3: Siblings/Spouses Aboard<=2.5', '8: Siblings/Spouses Aboard>2.5', '4: Parents/Children Aboard<=0.5', '7: Parents/Children Aboard>0.5', '5: Fare<=15.014600276947021', '6: Fare>15.014600276947021', '9: Age<=3.5', '12: Age>3.5', '10: Age<=2.5', '11: Age>2.5', '14: Fare<=26.268750190734863', '21: Fare>26.268750190734863', '15: Age<=32.5', '18: Age>32.5', '16: Age<=30.75', '17: Age>30.75', '19: Fare<=7.910400152206421', '20: Fare>7.910400152206421', '22: Fare<=26.46875', '23: Fare>26.46875', '24: Age<=24.5', '25: Age>24.5', '27: Pclass<=2.5', '38: Pclass>2.5', '28: Age<=2.5', '31: Age>2.5', '29: Pclass<=1.5', '30: Pclass>1.5', '32: Fare<=28.856249809265137', '35: Fare>28.856249809265137', '33: Fare<=28.231249809265137', '34: Fare>28.231249809265137', '36: Parents/Children Aboard<=1.5', '37: Parents/Children Aboard>1.5', '39: Fare<=23.350000381469727', '46: Fare>23.350000381469727', '40: Age<=36.5', '43: Age>36.5', '41: Age<=32.5', '42: Age>32.5', '44: Age<=62.5', '45: Age>62.5', '47: Parents/Children Aboard<=0.5', '48: Parents/Children Aboard>0.5', '49: Fare<=31.331250190734863', '50: Fare>31.331250190734863']
    let parents =  ['', '', '', '1: Sex<=0.5', '1: Sex<=0.5', '2: Age<=13.0', '2: Age<=13.0', '3: Siblings/Spouses Aboard<=2.5', '3: Siblings/Spouses Aboard<=2.5', '4: Parents/Children Aboard<=0.5', '4: Parents/Children Aboard<=0.5', '8: Siblings/Spouses Aboard>2.5', '8: Siblings/Spouses Aboard>2.5', '9: Age<=3.5', '9: Age<=3.5', '13: Age>13.0', '13: Age>13.0', '14: Fare<=26.268750190734863', '14: Fare<=26.268750190734863', '15: Age<=32.5', '15: Age<=32.5', '18: Age>32.5', '18: Age>32.5', '21: Fare>26.268750190734863', '21: Fare>26.268750190734863', '23: Fare>26.46875', '23: Fare>26.46875', '26: Sex>0.5', '26: Sex>0.5', '27: Pclass<=2.5', '27: Pclass<=2.5', '28: Age<=2.5', '28: Age<=2.5', '31: Age>2.5', '31: Age>2.5', '32: Fare<=28.856249809265137', '32: Fare<=28.856249809265137', '35: Fare>28.856249809265137', '35: Fare>28.856249809265137', '38: Pclass>2.5', '38: Pclass>2.5', '39: Fare<=23.350000381469727', '39: Fare<=23.350000381469727', '40: Age<=36.5', '40: Age<=36.5', '43: Age>36.5', '43: Age>36.5', '46: Fare>23.350000381469727', '46: Fare>23.350000381469727', '48: Parents/Children Aboard>0.5', '48: Parents/Children Aboard>0.5']
    let values = ['Dead = 65%, Live = 34%', 'Dead = 95%, Live = 4%', 'Dead = 11%, Live = 88%', 'Dead = 43%, Live = 56%', 'Dead = 99%, Live = 0%', 'Dead = 4%, Live = 95%', 'Dead = 94%, Live = 5%', 'Dead = 50%, Live = 50%', 'Dead = 0%, Live = 100%', 'Dead = 0%, Live = 100%', 'Dead = 100%, Live = 0%', 'Dead = 83%, Live = 16%', 'Dead = 100%, Live = 0%', 'Dead = 100%, Live = 0%', 'Dead = 0%, Live = 100%', 'Dead = 100%, Live = 0%', 'Dead = 97%, Live = 2%', 'Dead = 100%, Live = 0%', 'Dead = 100%, Live = 0%', 'Dead = 100%, Live = 0%', 'Dead = 100%, Live = 0%', 'Dead = 100%, Live = 0%', 'Dead = 100%, Live = 0%', 'Dead = 0%, Live = 100%', 'Dead = 100%, Live = 0%', 'Dead = 100%, Live = 0%', 'Dead = 100%, Live = 0%', 'Dead = 1%, Live = 98%', 'Dead = 24%, Live = 75%', 'Dead = 50%, Live = 50%', 'Dead = 0%, Live = 99%', 'Dead = 100%, Live = 0%', 'Dead = 0%, Live = 100%', 'Dead = 1%, Live = 98%', 'Dead = 0%, Live = 100%', 'Dead = 0%, Live = 100%', 'Dead = 100%, Live = 0%', 'Dead = 0%, Live = 100%', 'Dead = 0%, Live = 100%', 'Dead = 7%, Live = 92%', 'Dead = 96%, Live = 3%', 'Dead = 0%, Live = 100%', 'Dead = 90%, Live = 10%', 'Dead = 0%, Live = 100%', 'Dead = 0%, Live = 100%', 'Dead = 100%, Live = 0%', 'Dead = 0%, Live = 100%', 'Dead = 0%, Live = 100%', 'Dead = 100%, Live = 0%', 'Dead = 100%, Live = 0%', 'Dead = 100%, Live = 0%']

    colors = []
    for (let n of nodes) {
        if (n.startsWith(node)) {
            colors.push("#059BBB")
        } else {
            colors.push("rgba(250,76,5,.5)")
        }
    }

    // TODO: should just have nodes and parents in this form for future work
    name_mapping = {}
    for (let i=0; i < values.length; i++) {
        let oldName = nodes[i]
        let appendString = " | " + values[i]
        let newName = oldName + appendString
        nodes[i] = newName
        name_mapping[oldName] = newName
    }
    for (let i=0; i < parents.length; i++) {
        parents[i] = name_mapping[parents[i]]
    }

    data = [{
          type: "treemap",
          labels: nodes,
          parents: parents,
          marker: {colors: colors}
    }]

    var layout = {
      title: 'Decision Hierarchy',
      font:{
        family: 'Raleway, sans-serif'
      },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
    };

    Plotly.newPlot('decision-tree-chart', data, layout)
}







