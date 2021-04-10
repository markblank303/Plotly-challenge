
function buildPlot(sample){
    d3.json('data/samples.json').then((data) => {console.log(data)
        var samples = data.samples[0]['sample_values'];
        var ids = data.samples[0]['otu_ids'];
        var labels = data.samples[0]['otu_labels'].slice(0,10).reverse();

        var trace1 = {
            type: "bar",
            x: samples.slice(0,10).reverse(),
            y: ids.slice(0,10).map(otu_ids => `OTU ${otu_ids}`).reverse(),
            marker:{
            color: 'green'
            },
            orientation: 'h'
        };

        var data = [trace1];

        var layout = {
            title:'Top 10 OTU',
            margin: {
            autorange: true,
            type: 'linear'
            }
        };
        Plotly.newPlot("bar", data, layout);

        var trace2 = {
            x: ids,
            y: samples,
            mode: 'markers',
            marker: {
                size:samples,
                color: ids
            },
            text: labels
        };

        var layout2 = {
            xaxis: {title: "OTU ID"},
            height: 600,
            width: 1000
        };

        var data2 = [trace2];

        Plotly.newPlot("bubble", data2, layout2);

    });
};

buildPlot();

function buildMetadata(sample) {
    d3.json('data/samples.json').then((data) => {
        var metaData = data.metadata;
        var arr = metaData.filter(sampleObject => sampleObject.id == sample);
        var info = arr[0];
        var referInfo = d3.select("#sample-metadata");

        referInfo.html("");
        Object.entries(info).forEach(([key, value]) => {
            referInfo.append('h5').text(`${key}: ${value}`);
        });
    });
};

function init(){
    var dropdownMenu = d3.select("#selDataset");
    d3.json('data/samples.json').then((data) => {
        var sampleInfo = data.names;
        sampleInfo.forEach((sample) => {
            dropdownMenu
                .append("option")
                .text(sample)
                .property('value', sample);
        });
        var intialSample = sampleInfo[0];
        buildPlot(intialSample);
        buildMetadata(intialSample);
    });
}

function optionChanged(nextSample) {
    buildPlot(nextSample);
    buildMetadata(nextSample);
}

init();