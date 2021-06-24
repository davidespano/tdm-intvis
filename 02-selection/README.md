# Selection

This tutorial shows the fundamentals of implementing
selections in D3.js. 

Referring to the **Shneiderman's mantra** (_Overview first, zoom and filter, then details on demand_), we will scratch the surface of the techniques for implementing the request of the details. 

Selections may be implemented through different mouse-based interactions, in particular through click and and hover. 

The implemented examples are a revised version of the tutorial in [D3 interactions](https://observablehq.com/@d3/learn-d3-interaction?collection=@d3/learn-d3)

## Step 0
We start again from a base static line chart, showing the value of the Apple stocks.

## Step 1
We implement the first method for obtaining the detail of a point in the line chart. We exploit the mouse hovering (but it may be replaced by a click). We show a tooltip containing the date and the value in $ associated to the selected point. 

## Step 2
In the previous version, picking the point is particularly tedious, since the line is thin and centering the exact point requires precision. However, we can ignore the position on
the Y axis, and consider a rectangular selection area depending only on the X axis projection of the current mouse position. 

## Step 3
We can refine the approach determining, in for each point of the chart, the closest point on our line, in order to support a more convenient selection. From a geometry point of view, we can solve the problem using a [Voronoi diagram](https://github.com/d3/d3-delaunay).  We use closest data point to the mouse determines the tooltip and we show the resulting diagram. 

This highlights that, for improving the usability of the interaction, the visualization drawing primitives may have interactive areas that differ from their appearance. 

## Step 4
Finally, we show how to implement a custom tooltip, going beyond the SVG title element.
Building such kind of component is the standard implementation technique, since usually displaying detailed information requires showing formatted contents and multimedia elements (e.g. images).

Please note the following properties:
1. The detail visualization potentially occludes a large part of the visualization. That's why you want to show it _on demand_
2. You need some visual encoding of the selection, for helping the user in identifying the selected object in the visualization. This "steals" some values either in the mark (e.g., a shape) or in some channel that encodes information (e.g., the colour) or in both. 
3. We used the mouse over event, but we can adapt the code for supporting the mouse click. 
D3 provides a handy high-level representation of pointing-based interaction events for abstracting from the pointing device (e.g., the mouse or touch). Please see the documentation of the [D3 pointer](https://github.com/d3/d3-selection/blob/v3.0.0/README.md#pointer)
   


