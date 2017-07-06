// Creating the JSON data
var json = [
	{
		"title": "Park Ave Penthouse",
		"lat": 40.7713024,
		"lng": -73.9632393,
		"description": "loction marker 1"
	}, {
		"title": "Chelsea Loft",
		"lat": 40.7444883,
		"lng": -73.9949465,
		"description": "location marker 2"
	}, {
		"title": "Union Square Open Floor Plan",
		"lat": 40.7347062,
		"lng": -73.9895759,
		"description":"location marker 3"
	}, {
		"title": "East Village Hip Studio",
		"lat": 40.7281777,
		"lng": -73.984377,
		"description":"location marker 4"
	}, {
		"title": "TriBeCa Artsy Bachelor Pad",
		"lat": 40.7195264,
		"lng": -87.828103,
		"description":"location marker 5"
	}
];

var marker;
//ViewModel
var ViewModel = function(){
	var self = this;

   map = new google.maps.Map(document.getElementById("map"), {
			center: {lat:40.7413549, lng:-73.9980244},
			zoom:13,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});

		var infoWindow = new google.maps.InfoWindow();

		this.json_List = ko.observableArray([]);

		//pushing locations to observableArray following the Udacity Lession 5 27, 28 video
		json.forEach(function(jsonItem){
			self.json_List.push(new Marker(jsonItem, self));
		});

		//setting current location to first element in the array
		self.currentList = ko.observable(this.json_List()[0]);

	//	marker.addListener('click', function(){
	//		self.populateInfoWindow(self, infoWindow);
	//	});
	self.triggerMarker = function (place) {
		google.maps.event.addListener(marker, "click", function(e) {
					infoWindow.setContent(self.json_List.description);
					infoWindow.open(map, marker);
			});
		}
}

//Marker model
var Marker = function(jsonItem, model){

	var self = this;

	//getting location properties following Udacity Lesson 5 27, 26, 28 videos
	self.title = jsonItem.title;
	self.lat = jsonItem.lat;
	self.lng = jsonItem.lng;
	self.description = jsonItem.description;


	latLng = new google.maps.LatLng(self.lat, self.lng);

// Creating a marker and putting it on the map
	this.marker = new google.maps.Marker({
		position: latLng,
		map: map,
		title: self.title,
		animation: google.maps.Animation.BOUNCE,
	});

	// marker.addListener('click', function(){
	//	self.populateInfoWindow(self, infoWindow);
//	});



}




createMap = function(){
	ko.applyBindings(new ViewModel());
}
