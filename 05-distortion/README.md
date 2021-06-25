# Distortion
In the last tutorial, we will briefly introduce another common technique for implementing the focus + context, usually employed in graph visualizations.

It consists of using a lens metaphor on the current visualization. We can control the lens through the pointer (mouse or touch) and the underlying area will change its appeareance applyign a magnification function.

According to the function we use for defining the magnification distortion, the appearance of the visualization changes. 

If you would like more information on the lens equations, you can have a look to the [fisheye lens description on Wikipedia](https://en.wikipedia.org/wiki/Fisheye_lens). Another interesting source of information about this technique is the [InfoVis Wiki page about Fisheye Views](https://infovis-wiki.net/wiki/Fisheye_View)

For our purposes, visualizing the effects without going into the math will be enough. We exploit a [D3 fisheye plugin](https://github.com/d3/d3-plugins/tree/master/fisheye) for implementing the distortion. The documentation is a good starting point for understanding how to use the API. 


## Step 0
In the first step, we will familiarize with the lens metaphor. We simply display a grid and we drag the lens on top of it for showing how the grid will be distorted. The implementation of the fisheye function is defined into a dedicated D3 plugin. 

## Step 1
In the second step, we apply the distortion to a highly connected network. We discuss how to create such visualization and the effect of the fisheye. 