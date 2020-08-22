function initialPage(data){

    const subject = 0;

    // Extracting the demographic data:
    id = data.metadata[subject].id;
    ethnicity= data.metadata[subject].ethnicity;
    gender = data.metadata[subject].gender;
    age = data.metadata[subject].age;
    loc = data.metadata[subject].location;
    bbtype = data.metadata[subject].bbtype;
    wfreq = data.metadata[subject].wfreq;

    // Displaying demographic data:
    demographic_info = d3.select("#demographic_info");
    demographic_info.append("li").html(`<strong>id: </strong> ${id}`);
    demographic_info.append("li").html(`<strong>ethnicity: </strong> ${ethnicity}`);
    demographic_info.append("li").html(`<strong>gender: </strong> ${gender}`);
    demographic_info.append("li").html(`<strong>age: </strong> ${age}`);
    demographic_info.append("li").html(`<strong>location: </strong> ${loc}`);
    demographic_info.append("li").html(`<strong>bbtype: </strong> ${bbtype}`);
    demographic_info.append("li").html(`<strong>wfreq: </strong> ${wfreq}`);
    
    
    //Extracting sample data
    otu_IDs = data.samples[subject].otu_ids;
    otu_samples = data.samples[subject].sample_values; 
    otu_labels = data.samples[subject].otu_labels; 
    
    //slicing to the ten top sample values
    otu_IDs_10= otu_IDs.slice(0,10).map(row => "OTU "+ row).reverse();
    otu_samples_10 = otu_samples.slice(0,10).sort((a,b)=>a-b);
    otu_labels_10 = otu_labels.slice(0,10);

    //  Create the bar dataset
    var dataset_bar = [{
        x: otu_samples_10,
        y: otu_IDs_10,
        type: "bar",
        name: "Sample Values",
        text: otu_labels_10,
        orientation: 'h',
        width: 0.5,
        marker: {
            color: '#00008B',
          }
    }];

    //  Create the bubble dataset
    var dataset_bubble =[{
      x: otu_IDs,
      y: otu_samples,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: otu_samples,
        color: otu_IDs
      }
    }];
  
  
    // Define the bar and bubble plot layout
    var layout_bar = {
      xaxis: { title: "Sample Value" },
      margin: {
        t: 10,
        pad: 4
      },
      hovermode:'closest'
    };

    var layout_bubble = { 
      xaxis:{title: "OTU ID"},
      yaxis:{title: "Sample Value"},
      margin: {
        t: 10,
        pad: 4
      }
    }
  
  //Guage Chart:
  // Trig to calc meter point
  var degrees = 180 - ((180/9)*wfreq);
  radius = .5;
  var radians = degrees * Math.PI / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  // Path: may have to change to create a better triangle
  var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
       pathX = String(x),
       space = ' ',
       pathY = String(y),
       pathEnd = ' Z';
  var path = mainPath.concat(pathX,space,pathY,pathEnd);

  var data_guag = [{ type: 'scatter',
     x: [0], y:[0],
      marker: {size: 20, color:'850000'},
      showlegend: false,},
    { values: [50, 50/9, 50/9, 50/9, 50/9, 50/9,50/9,50/9, 50/9,50/9],
    rotation: 90,
    text: ["",'0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
      direction: 'clockwise',
    textinfo: 'text',
    textposition:'inside',	  
       marker: {
        colors: ["white","#FAFAD2","#f7f1c0","#f5eeaf","#e1f08c","#b8dc70","#aed75b","#a4d247","#8bb92d","#5d7b1e"],
        labels: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
        hoverinfo: 'none'
      },

    hole: .5,
    type: 'pie',
    showlegend: false
  }];

  var layout_guag = {
    margin: {
      t: 60,
      pad: 4
    },
    shapes:[{
        layer: 'above',
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
          color: '850000'
        }
      }],
    title: { text: "Belly Button Washing Frequency <br>Scrubs per Week" },
    height: 450,
    width: 450,
    xaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
               showgrid: false, range: [-1, 1]}
  };

   // Plot the chart to a div tag with id "plot"
   Plotly.newPlot("bar-plot", dataset_bar, layout_bar);
   Plotly.newPlot("bubble-plot", dataset_bubble, layout_bubble);
   Plotly.newPlot('gauge-plot', data_guag, layout_guag); 
   
};


(async function(){

    //
    var data = await d3.json("data/samples.json");
   

    initialPage(data);

    // Select the button
    var button = d3.select("#button");

    // Select the form
    var form_input = d3.select("#form-input");

    // Create event handlers 
    button.on("click", updatePage);
    form_input.on("submit",updatePage);


    function updatePage(){

        d3.event.preventDefault();

        //Selecting the user input:
        subject = d3.select("#subject_ID").node().value;

        // updating data using user request:
        id = data.metadata[subject].id;
        ethnicity= data.metadata[subject].ethnicity;
        gender = data.metadata[subject].gender;
        age = data.metadata[subject].age;
        loc = data.metadata[subject].location;
        bbtype = data.metadata[subject].bbtype;
        wfreq = data.metadata[subject].wfreq;

        //updating the display of demographic info based on user request:
        demographic_info = d3.select("#demographic_info");
        demographic_info.html(`<strong>id: </strong> ${id}`);
        demographic_info.append("li").html(`<strong>ethnicity: </strong> ${ethnicity}`);
        demographic_info.append("li").html(`<strong>gender: </strong> ${gender}`);
        demographic_info.append("li").html(`<strong>age: </strong> ${age}`);
        demographic_info.append("li").html(`<strong>location: </strong> ${loc}`);
        demographic_info.append("li").html(`<strong>bbtype: </strong> ${bbtype}`);
        demographic_info.append("li").html(`<strong>wfreq: </strong> ${wfreq}`);


      //updating the bar chart and bubble chart regarding user request:
        otu_IDs = data.samples[subject].otu_ids;
        otu_samples = data.samples[subject].sample_values; 
        otu_labels = data.samples[subject].otu_labels; 
        
        otu_IDs_10 = otu_IDs.slice(0,10).map(row => "OTU "+ row).reverse();
        otu_samples_10 = otu_samples.slice(0,10).sort((a,b)=>a-b);
        otu_labels_10 = otu_labels.slice(0,10);
    
        Plotly.restyle("bar-plot", "x", [otu_samples_10]);
        Plotly.restyle("bar-plot", "y", [otu_IDs_10]);

        Plotly.restyle("bubble-plot", "x", [otu_IDs]);
        Plotly.restyle("bubble-plot", "y", [otu_samples]);


         //Updating Guage Chart:
        // Trig to calc meter point
        var degrees = 180 - ((180/9)*wfreq);
        radius = .5;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);

        // Path: may have to change to create a better triangle
        var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
            pathX = String(x),
            space = ' ',
            pathY = String(y),
            pathEnd = ' Z';
        var path = mainPath.concat(pathX,space,pathY,pathEnd);

        var data_guag = [{ type: 'scatter',
          x: [0], y:[0],
            marker: {size: 20, color:'850000'},
            showlegend: false,},
          { values: [50, 50/9, 50/9, 50/9, 50/9, 50/9,50/9,50/9, 50/9,50/9],
          rotation: 90,
          text: ["",'0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
            direction: 'clockwise',
          textinfo: 'text',
          textposition:'inside',	  
            marker: {
              colors: ["white","#FAFAD2","#f7f1c0","#f5eeaf","#e1f08c","#b8dc70","#aed75b","#a4d247","#8bb92d","#5d7b1e",'white'],
              labels: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
              hoverinfo: 'none'
            },

          hole: .5,
          type: 'pie',
          showlegend: false
        }];

        var layout_guag = {
          margin: {
            t: 60,
            pad: 4
          },
          shapes:[{
              layer: 'above',
              type: 'path',
              path: path,
              fillcolor: '850000',
              line: {
                color: '850000'
              }
            }],
          title: { text: "Belly Button Washing Frequency <br>Scrubs per Week" },
          height: 450,
          width: 450,
          xaxis: {zeroline:false, showticklabels:false,
                    showgrid: false, range: [-1, 1]},
          yaxis: {zeroline:false, showticklabels:false,
                    showgrid: false, range: [-1, 1]}
        };


        Plotly.newPlot('gauge-plot', data_guag, layout_guag);   
    
      }
    
  })();

  
  
