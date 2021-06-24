# Pan and Zoom

This tutorial shows the basics of how to support two very common interactions in data visualizations, especially for maps. Both are related to the camera metaphor on interactive views.

[Panning](https://en.wikipedia.org/wiki/Panning_(camera)) in cinematography means swivelling a video camera horizontally, changing its point of view. In the metaphor used in visualization, means moving the viewport (the visible part of visualization) up/down/left/right.  As we will see in the examples, this means applying a translate transform to the current view.

In turn [zooming](https://en.wikipedia.org/wiki/Zoom_lens) means increasing or decreasing the dimensions of the visualization, which corresponds to a scale transform. 

We call the latter **geometric zoom** since it simply changes the dimension of the current view, but it does not change the content. In contrast, the **semantic zoom** exploits the available space adding/removing details or even changing the entire visualization. 

The D3 library has two dedicated behaviours that solve the problem of implementing such an interaction in most of the visualizations:
* [D3 zoom](https://github.com/d3/d3-zoom)
* [D3 drag](https://github.com/d3/d3-drag)

The samples are a revised version of the Murray's book on D3 (Chapter 7) [Interactive Data Visualization for the Web](https://github.com/d3/d3-drag )

## Step 0
We build a Choropleths map containing a visualization of agricultural production data in the United States. The visualization is not actually important, it's just a map.

## Step 1
We use the combination of the zoom and drag behaviour for implementing the pan interaction. 

The zoom behaviour contains the functions for handling the set of transforms (translate and scaling) implementing the camera metaphor. We apply such transformations for changing the reference system from the original static visualization to the current state defined by the user's interaction. 

The drag behaviour allows to track the pointer movements, incrementally updating the current transform as a delta between the old position and the new one. The trick for having it working is inverting the coordinates: the mouse X and Y belongs to the current user's view reference system and we must use the visualization original system instead. 

## Step 2
Once we set up the solution in the previous step, adding the zoom is only a matter of maintaining a scale factor and applying the transform when we use the mouse wheel. We can exchange this with any other interaction (e.g., multitouch pinch). We can also set the zoom velocity for increasing/descreasing the map between the input device and the view change. 


