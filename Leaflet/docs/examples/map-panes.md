---
layout: tutorial
title: Working with map panes
---

## What are panes?

In Leaflet, map panes group layers together implicitly, without the developer knowing about it. This grouping allows web browsers to work with several layers at once in a more efficient way than working with layers individually.

Map panes use the [z-index CSS property](https://developer.mozilla.org/docs/Web/CSS/z-index) to always show some layers on top of others. The [default order](http://leafletjs.com/reference.html#map-panes) is:

* `TileLayer`s and `GridLayer`s
* `Path`s, like lines, polylines, circles, or `GeoJSON` layers.
* `Marker` shadows
* `Marker` icons
* `Popup`s

This is why, in Leaflet maps, popups always show "on top" of other layers, markers always show on top of tile layers, etc.

A new feature of **Leaflet 1.0.0** (not present in 0.7.x) is custom map panes, which allows for customization of this order.

## The default is not always right

In some particular cases, the default order is not the right one for the map. We can demonstrate this with the [CartoDB basemaps](https://cartodb.com/basemaps/) and labels:


<style>
.tiles img {
    border: 1px solid #ccc;
    border-radius: 5px;
}
</style>

<div class='tiles'>
<div style='display: inline-block'>
<img src="http://a.basemaps.cartocdn.com/light_nolabels/0/0/0.png" class="bordered-img" /><br/>
Basemap tile with no labels
</div>

<div style='display: inline-block'>
<img src="http://a.basemaps.cartocdn.com/light_only_labels/0/0/0.png" class="bordered-img" /><br/>
Transparent labels-only tile
</div>

<div style='display: inline-block; position:relative;'>
<img src="http://a.basemaps.cartocdn.com/light_nolabels/0/0/0.png" class="bordered-img" />
<img src="http://a.basemaps.cartocdn.com/light_only_labels/0/0/0.png"  style='position:absolute; left:0; top:0;'/><br/>
Labels on top of basemap
</div>
</div>

If we create a Leaflet map with these two tile layers, any marker or polygon will show on top of both, but having the labels on top [looks much nicer](http://blog.cartodb.com/let-your-labels-shine/). How can we do that?


<div id="map" class="map" style="height: 250px"></div>

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.0.0-rc.3/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.0.0-rc.3/dist/leaflet.js"></script>
<script type="text/javascript" src="eu-countries.js"></script>
<script>
var map = L.map('map');

map.createPane('labels');

// This pane is above markers but below popups
map.getPane('labels').style.zIndex = 650;

// Layers in this pane are non-interactive and do not obscure mouse/touch events
map.getPane('labels').style.pointerEvents = 'none';


var cartodbAttribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>';

var positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
        attribution: cartodbAttribution
}).addTo(map);

var positronLabels = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
        attribution: cartodbAttribution,
        pane: 'labels'
}).addTo(map);

geojson = L.geoJson(euCountries).addTo(map);

geojson.eachLayer(function (layer) {
    layer.bindPopup(layer.feature.properties.name);
});

map.setView({ lat: 47.040182144806664, lng: 9.667968750000002 }, 4);
</script>

## Custom pane

We can use the defaults for the basemap tiles and some overlays like GeoJSON layers, but we have to define a custom pane for the labels, so they show on top of the GeoJSON data.

Custom map panes are created on a per-map basis, so first create an instance of `L.Map` and the pane:


    var map = L.map('map');
    map.createPane('labels');


The next step is setting the z-index of the pane. Looking at the [defaults](https://github.com/Leaflet/Leaflet/blob/master/dist/leaflet.css#L73), a value of 650 will make the `TileLayer` with the labels show on top of markers but below pop-ups. By using `getPane()`, we have a reference to the [`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement) representing the pane, and change its z-index:


    map.getPane('labels').style.zIndex = 650;


One of the problems of having image tiles on top of other map layers is that the tiles will capture clicks and touches. If a user clicks anywhere on the map, the web browser will assume she clicked on the labels tiles, and not on the GeoJSON or on the markers. This can be solved using [the `pointer-events` CSS property](https://developer.mozilla.org/en-US/docs/Web/CSS/pointer-events):


    map.getPane('labels').style.pointerEvents = 'none';


With the pane now ready, we can add the layers, paying attention to use the `pane` option on the labels tiles:


    var positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
            attribution: '??OpenStreetMap, ??CartoDB'
    }).addTo(map);

    var positronLabels = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
            attribution: '??OpenStreetMap, ??CartoDB',
            pane: 'labels'
    }).addTo(map);

    var geojson = L.geoJson(GeoJsonData, geoJsonOptions).addTo(map);

Finally, add some interaction to each feature on the GeoJSON layer:

    geojson.eachLayer(function (layer) {
        layer.bindPopup(layer.feature.properties.name);
    });

    map.fitBounds(geojson.getBounds());


Now the [example map](map-panes-example.html) is complete!




