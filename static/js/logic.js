// store our API endpoint inside query URL 
var queryurl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// perform get request for queryURL 
d3.json(queryurl, function(data){
	//console.log(data)
	// once we get a response, send the data.features object to the createFeatures function 
	createFeatures(data.features);
	});

function createFeatures(earthquakeData){
	// define a function we want to run for each feature in features array
	// give each feature a popup describing the place and time of the earthquake	
	//console.log(features)
	function onEachFeature(feature, layer) {
		layer.bindPopup(`<h3> ${feature.properties.place} </h3> <hr><p> ${new Date(feature.properties.time)}`)
	}
	
	function getColor(magnitude) {
		switch (true) {
			case magnitude >= 5:
				return '#ea2c2c';
			case magnitude >= 4:
				return '#ea822c';
			case magnitude >= 3:
				return '#ee9c00';
			case magnitude >= 2:
				return '#eecc00';
			case magnitude >= 1:
				return '#d4ee00';
			default:
				return '#98ee00';	
		}
	}
	function getRadius(magnitude) {
		if (magnitude === 0){
			return 1;
		}
		
		return magnitude * 4;
	}
	
	function styleInfo(feature) {
		return {
			opacity: 1,
			fillOpacity: 1,
			fillColor: getColor(feature.properties.mag),
			//color: '#191919',
			radius: getRadius(feature.properties.mag),
			stroke: true,
			weight: 0.5
		}
	};

// create a GeoJSON layer containing the features array on the earthquakeData object
// run the onEachFeature function once for each piece of data in the array	
	var earthquakes = L.geoJSON(earthquakeData, {
		
		onEachFeature: onEachFeature,
		pointToLayer: function(feature, latlng) {
			
			return L.circleMarker(latlng);
		},
		style: styleInfo
	});

// sending our earthquake layer to the createMap function
	createMap(earthquakes);
};

function createMap(earthquakes){
	// define streetmap and darkmap layers
	var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });
  
  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });
  
  // define a baseMap object to hold our base layers
  var baseMaps = {
	  "Street Map": streetmap,
	  "Dark Map": darkmap
  };
  
  // create overlay object to hold our overlay layer
  var overlayMaps = {
	  Earthquakes: earthquakes
  };
  
  // create our map giving it streetmap and earthquake layers to display on load
   var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });
  
  // create a layer control
  // pass in our baseMaps and overlayMaps
  // add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
	  collapsed: false
  }).addTo(myMap);
  
  // adding the legend
  var legend = L.control({position: 'bottomright'});
  
  legend.onAdd = function () {
	  var grades = [0, 1, 2, 3, 4, 5];
	  var colors = [
	  "#98ee00",
	  "#d4ee00",
	  "#eecc00",
	  "#ee9c00",
	  "#ea822c",
	  "#ea2c2c"
	  ];
	  
	  var div = L.DomUtil.create('div', 'legend');
	  
	  // loop through our density intervals and generate a label with colored squared for each intervals
	  for (var i = 0; i <= 5; i++) {
		  div.innerHTML +=
			'<i style="background:' + colors[i] + '"></i> ' + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>': '+');
	  }
	  
	  return div;
  };
  
  legend.addTo(myMap);
	
};
	
	



