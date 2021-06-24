# Interactive Visualization Course Samples
[Urban Computing 2021 Second Summer School](http://school2021.tdm-project.it)

The project contains a collection of samples adapted 
for presenting the basic concepts on building
interactive data visualizations.

The package contains a [WebStorm](https://www.jetbrains.com/webstorm/) 
project including the following content:

* A local installation of the [D3.js](https://d3js.org) library;
* 5 folders with examples categorised by interaction technique
  (animation, selection, zoom, brush, distortion)   
* This readme file

The easiest way for running the code is downloading the zip 
package of the entire repository, opening it in WebStorm and,
through the Terminal pane at the bottom run the following commands:
    
    npm install
    http-server -p 8080 .

This will launch a webserver in your local machine and open your
browser showing a page with the folder listings. You can browse
the samples from there.

It's also possible to run the project without Webstorm as a simple
node.js project. Or, it's also possible to copy-paste the samples
in the public html folder of your preferred local webserver. 

## How to follow the different steps in the tutorials

All the samples contain the same file structure:
* the index.html page, which is the file to be loaded through the browser
* the vis.js script, containing the code for generating the visualizations
* the style.css, containing a few (or none) settings for displaying the page
* a set of CSV files containing the data to show

Most samples start from a static visualization and add the 
interactive features on top of it. Only the samples having multiple 
coordinate views or employing distortions have the aspects packed
together. 

Each sample leverages on the _window.onload_ event for appending 
the visualization to the page body. The handler function contains 
the variable _step_ you can modify for going forward in the tutorial.
The switch shows which visualizations or interactions are active
at the corresponding step. 