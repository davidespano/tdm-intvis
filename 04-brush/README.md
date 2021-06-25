# Brush

The brushing techinque allows selecting a set of data items by drawing a selection area, using a pointer (e.g., a mouse or touch). Such technique was successfully applied in coordinating the selection through multiple views, supporting the user in creating the area in one of the views and showing the selection results in the other ones. 

You can find more information about the brushing techique in the InfoVis Wiki, reading the page about [brushing](https://infovis-wiki.net/wiki/Brushing) and [linking and brushing](https://infovis-wiki.net/wiki/Linking_and_Brushing).

In this tutorial, we will first introduce the fundamentals of implementing the brushing technique in D3.js, then we will show two typical sample applications, defining a Focus + Context visualization and a linked highlighting technique on small multiple views. 

The samples we discuss are based on:
1. [D3 brush tutorial](https://observablehq.com/@d3/brush-filter?collection=@d3/d3-brush)
2. [D3 focus + context tutorial](https://observablehq.com/@d3/focus-context) 
3- [D3 Brushable Scatterplot Matrix](https://observablehq.com/@d3/brushable-scatterplot-matrix)

## Step 0
In this step, we create a scatterplot displaying randomly generated data points. We will use a uniform distribution for randomly picking the X and Y coordinates respectively from the [0, width] and the [0, height] range. 

## Step 1
In this step, we create the brush using the [D3 brush](https://github.com/d3/d3-brush/blob/main/README.md#brush_filter).

Its implementation creates the SVG elements necessary to display the brush selection and to receive input events for interaction. For instance, it contains a rectange having CSS class "overlay" which displays the selected area. 

Internally, the brush uses selection.on to bind the necessary event listeners for dragging. In addition, we can set a filter for ignoring the events that we do not want to receive. For instance, we can use the filter for activating the brushing only if a given key combination is used. If the filter returns false, the events are ignored.

In our sample, we must press CTRL or the META key on MacOS for activating the brush. In addition, we cannot brush on the currently selected area.

Finally, we add an event handler to the events that pass the filter, for changing the selected points stroke. 

## Step 2
In this step, we will create a brushable [focus + context](https://infovis-wiki.net/wiki/Focus-plus-Context) view on the Apple stock dataset from 2007 to 2012. We basically create the same view two times. The differences are on the height: the lower view shows the overview (context) and supports brushing on the X axis. 

The upper view shows the focus, corresponding to a zoomed view on the brushed data. It's another different implementation of the first two points in the Shneiderman's mantra. 

## Step 3
The final step in this tutorial shows a sample of the [linked highlighting](https://infovis-wiki.net/wiki/Linking_and_Brushing) technique. 

We start from a dataset containing the characteristics of penguins, including the species, the island where they lived, measures of the bird's bill, sex and so on. 

Since the dimension of the attributes to show is higher than 2, it's useful to show a pairwise comparison of the numerical attributes, to see if there are some characteristics peculiar of a species. The species is color coded in the data points. 

The trick is keeping taking all the data items outside the selection in the current cell and then add a "hidden" CSS class to the points in all cells corresponding to those data items.

For selecting these data points we leverage on the [D3 filtering](https://github.com/d3/d3-array/blob/v3.0.1/README.md#filter), which allows selecting a subset of the dataset before showing the visualization. 

We reset the selection if the brush is empty. 

