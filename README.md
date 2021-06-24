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