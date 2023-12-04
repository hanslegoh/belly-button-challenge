// Read in the JSON file from the URL
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';
const dataBellyButton = d3.json(url);

// Create function for sorting arrays
function compareFunction(firstNum, secondNum) {
    return secondNum - firstNum;
  };

dataBellyButton.then(function(data) {
    // Add all of the test subjects' IDs in the dropdown menu
    let select = document.getElementById('selDataset');
    let options = data.names;

    for (let i = 0; i < options.length; i++) {
        let option = options[i];
        let element = document.createElement('option');
        element.text = option;
        element.value = option;
        select.add(element);
    }
    
    // Display the charts for name "940" in initial stage
    // Assign variables for bar chart
    let  xBarInit = data.samples[0].sample_values.sort(compareFunction).slice(0, 10).reverse();
    let  yBarInit = data.samples[0].otu_ids.map(id => `OTU ${id}`).slice(0, 10).reverse();
    let  textBarInit = data.samples[0].otu_labels.slice(0, 10).reverse();

    // Assign variables for bubble chart
    let xBubbleInit = data.samples[0].otu_ids;
    let yBubbleInit = data.samples[0].sample_values;
    let markSizeBubbleInit = data.samples[0].sample_values;
    let markColorBubbleInit = data.samples[0].otu_ids;
    let textBubbleInit = data.samples[0].otu_labels;

    // Assign variables for metadata chart
    let metaInit = data.metadata[0];
    let metaKeys = Object.keys(metaInit);

    // Create function for plotting initial charts
    function init() {
        // Plot the initial bar chart
        let dataBarInit = [{
          x: xBarInit,
          y: yBarInit,
          hovertext: textBarInit,
          type: "bar",
          orientation: 'h'
        }];
      
        Plotly.newPlot("bar", dataBarInit);
        
        // Plot the initial bubble chart
        let dataBubbleInit = [{
          x: xBubbleInit,
          y: yBubbleInit,
          hovertext: textBubbleInit,
          mode: 'markers',
          marker: {
            color: markColorBubbleInit,
            size: markSizeBubbleInit
          }
        }];

        let layoutBubbleInit = {
            xaxis: {
                title: {
                    text: 'OTU ID'
                }
            }
        }
      
        Plotly.newPlot("bubble", dataBubbleInit, layoutBubbleInit);

        // Plot the initial metadata chart
        d3.select('#sample-metadata').html(`${metaKeys[0]}: ${metaInit[metaKeys[0]]} 
                                            <br> ${metaKeys[1]}: ${metaInit[metaKeys[1]]}
                                            <br> ${metaKeys[2]}: ${metaInit[metaKeys[2]]}
                                            <br> ${metaKeys[3]}: ${metaInit[metaKeys[3]]}
                                            <br> ${metaKeys[4]}: ${metaInit[metaKeys[4]]}
                                            <br> ${metaKeys[5]}: ${metaInit[metaKeys[5]]}
                                            <br> ${metaKeys[6]}: ${metaInit[metaKeys[6]]}`);
    };

    // Initialize the charts
    init(); 

    return dataBellyButton;
});

// Call optionChanged() when a change takes place to the DOM
d3.selectAll("#selDataset").on("change", optionChanged());

// Assign the correct values for the clicked test subject ID
function optionChanged(testSubjectID) {
    dataBellyButton.then(function(data) {
        // Get the index of the clicked test subject ID in the names array
        namesArray = data.names;
        subjectIndex = namesArray.indexOf(testSubjectID);
        if (subjectIndex != -1) {

        // Assign variables to update bar chart
        let  xBar = data.samples[subjectIndex].sample_values.sort(compareFunction).slice(0, 10).reverse();
        let  yBar = data.samples[subjectIndex].otu_ids.map(id => `OTU ${id}`).slice(0, 10).reverse();
        let  textBar = data.samples[subjectIndex].otu_labels.slice(0, 10).reverse();

        // Assign variables to update bubble chart
        let xBubble = data.samples[subjectIndex].otu_ids;
        let yBubble = data.samples[subjectIndex].sample_values;
        let markSizeBubble = data.samples[subjectIndex].sample_values;
        let markColorBubble = data.samples[subjectIndex].otu_ids;
        let textBubble = data.samples[subjectIndex].otu_labels;

        // Assign variables to update metadata chart
        let meta = data.metadata[subjectIndex];
        let metaKeys = Object.keys(meta);
        
        // Call updatePlotlyAndMeta() to update the charts with the new data
        updatePlotlyAndMeta(xBar, yBar, textBar, 
            xBubble, yBubble, textBubble, markColorBubble, markSizeBubble, 
            meta, metaKeys);
        }
    });
}

// Update charts
function updatePlotlyAndMeta(xBar, yBar, textBar, 
    xBubble, yBubble, textBubble, markColorBubble, markSizeBubble, 
    meta, metaKeys) {
    // Update bar chart
    Plotly.restyle("bar", 'x', [xBar]);
    Plotly.restyle("bar", 'y', [yBar]);
    Plotly.restyle("bar", 'hovertext', [textBar]);
    
    // Update bubble chart
    Plotly.restyle("bubble", 'x', [xBubble]);
    Plotly.restyle("bubble", 'y', [yBubble]);
    Plotly.restyle("bubble", 'hovertext', [textBubble]);
    Plotly.restyle("bubble", 'marker.color', [markColorBubble]);
    Plotly.restyle("bubble", 'marker.size', [markSizeBubble]);

    // Update metadata chart
    d3.select('#sample-metadata').html(`${metaKeys[0]}: ${meta[metaKeys[0]]} 
                                        <br> ${metaKeys[1]}: ${meta[metaKeys[1]]}
                                        <br> ${metaKeys[2]}: ${meta[metaKeys[2]]}
                                        <br> ${metaKeys[3]}: ${meta[metaKeys[3]]}
                                        <br> ${metaKeys[4]}: ${meta[metaKeys[4]]}
                                        <br> ${metaKeys[5]}: ${meta[metaKeys[5]]}
                                        <br> ${metaKeys[6]}: ${meta[metaKeys[6]]}`);
  }
