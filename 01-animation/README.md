# Animations

This tutorial shows the fundamentals of creating
animations in D3.

The samples are based on:
* [D3 animation tutorial](https://observablehq.com/@d3/learn-d3-animation?collection=@d3/learn-d3)
* [D3 bar chart race sample](https://observablehq.com/@d3/bar-chart-race-explained)

## Step 0
We visualize a simple line chart showing the closing
of Apple stocks from 2007 to 2012.

## Step 1
To the static version of the sample, we add
an animation revealing the line in 5s. We proceed as follows:

1. We define the initial configuration, where we have only the chart axes
2. We define the final configuration, where the entire line is shown
3. We interpolate (_tween_) the initial configuration to the final configuration, 
modifying the _stroke-dasharray_ attribute changing the balancing between the solid line and the dash length.
   
D3 helps us in defining the frames in between configuration 1 and 2.

## Step 2
We take a deeper look to how the interpolation works. We implement a
procedure based on a javascript timer that controls the frame generation
through the variable _t_.a single graphic but a sequence of graphics over time. 
We control the animation as a sequence (a function) that returns the graphic 
for a given time _t_. For simplicity, we often use normalized time where _t_ = 0 is the 
start of the animation and _t_ = 1 is the end.

## Step 3
We can animate multiple attributes at a time. In this example
we change both the line length and its color, going from blue 
to orange, following a linear gradient. 

## Step 4
We are ready for (partially) applying a mini-version of **Shneiderman's mantra**: 
_Overview first, zoom and filter, then stop this time, but details on 
demand in the general case_.

We use the _changes over time_ for highlighting the transition
between the initial context and the final zoomed version. 

Things to notice in the implementation:

1. We animate two elements: the x axis and the line path
2. We are basically implementing a geometric zoom, without using the usual technique we present in tutorial 3.
3. Even if it seems, it's not a filtering technique. We do not 
create a filtered version of the data before starting the visualization. 
   
## Step 5
The last sample is a chart bar race, which uses the animation for
showing the time dimension on a dataset saving the value of the
top 100 companies from 2000 to 2019. 

We are not going to discuss it in detail, we only discuss why 
it is effective from a theoretical point of view. Complete details
are available in the [D3 bar chart race sample](https://observablehq.com/@d3/bar-chart-race-explained)
