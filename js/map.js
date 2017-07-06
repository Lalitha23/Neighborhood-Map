// Creating the JSON data
var json = [{
    "title": "Acadia",
    "lat": 44.577741,
    "lng": -68.291683,
    "description": "Covering most of Mount Desert Island and other coastal islands, Acadia features the tallest mountain on the Atlantic coast of the United States.Located in Maine State."
}, {
    "title": "Arches",
    "lat": 38.616840,
    "lng": -109.619826,
    "description": "This site features more than 2,000 natural sandstone arches, with some of the most popular arches in the park being Delicate Arch, Landscape Arch and Double Arch.Located in Utha."
}, {
    "title": "Black Canyon of the Gunnison",
    "lat": 38.543928,
    "lng": -107.689702,
    "description": "The canyon features some of the steepest cliffs and oldest rock in North America, and is a popular site for river rafting and rock climbing. Located in Colorado."
}, {
    "title": "Crater Lake",
    "lat": 42.870376,
    "lng": -122.169898,
    "description": "Crater Lake is the deepest lake in the United States and is noted for its vivid blue color and water clarity. Located in the state of Oregon."
}, {
    "title": "Grand Canyon",
    "lat": 36.144354,
    "lng": -112.140138,
    "description": "Grand Canyon National Park is the 15th site in the United States. It's central feature is the Grand Canyon, a gorge of the Colorado River, which is often considered one of the Wonders of the World. Located in Arizona."
}, {
    "title": "Mount Rainier",
    "lat": 46.880676,
    "lng": -121.727977,
    "description": "Mount Rainier, an active stratovolcano, is the most prominent peak in the Cascades, and is covered by 26 named glaciers. Located in Washington state."
}, {
    "title": "Yellowstone",
    "lat": 44.461056,
    "lng": -110.665231,
    "description": "Situated on the Yellowstone Caldera, the park has an expansive network of geothermal areas including boiling mud pots, vividly colored hot springs such as Grand Prismatic Spring, and regularly erupting geysers, the best-known being Old Faithful. Located in Wyoming, Montana and Idaho."
}];

var markers = [];

//ViewModel

var ViewModel = function() {
    var self = this;

    self.markers = ko.observableArray(markers);
    self.query = ko.observable('');

    map = new google.maps.Map(document.getElementById("map"), {
        center: {
            lat: 37.8,
            lng: -101.5
        },
        zoom: 4,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var infowindow = new google.maps.InfoWindow();
    var clickMarker = function() {
        var marker = this;
        marker.setAnimation(google.maps.Animation.BOUNCE);setTimeout(
            function(){ marker.setAnimation(null); }, 1500);
        self.populateInfoWindow(this, infowindow);
    };

    for (var i = 0; i < json.length; i++) {
        var latLng = new google.maps.LatLng(json[i].lat, json[i].lng);
        var title = json[i].title;
        var description = json[i].description;

        var marker = new google.maps.Marker({
            position: latLng,
            map: map,
            title: title,
            animation: google.maps.Animation.DROP,
            description: description
        });
        marker.addListener('click', clickMarker);
        markers.push(marker);
    }

    self.populateInfoWindow = function(marker, infowindow) {
        if (infowindow.marker != marker) {

            infowindow.setContent('');
            infowindow.marker = marker;
            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
                marker.setAnimation(null);
            });
            var articleUrl;
            var wikiURL = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&format=json&callback=wikiCallback';

            var wikiTimeout = setTimeout(function() {
                alert("Not able to load wiki at this time");
            }, 10000);

            //Wiki ajax requst
            $.ajax({
                url: wikiURL,
                dataType: "jsonp"
            }).done(function(response) {
                clearTimeout(wikiTimeout);
                wikilink = response[3][0];
                console.log(wikilink);
                infowindow.setContent('<b><div>' + marker.title + '</b></div>' + marker.description + '<p>Find more info at:<a href="' + wikilink + '"> Wikilink</a></p>');
            });
            //  infowindow.setContent(wikilink);
            //	infowindow.setContent('<b><div>' + marker.title +'</b></div>'+ marker.description + '<p>Find more info at:<a href="'+ articleUrl +'"> Wikilink</a></p>' );

            if (infowindow) {
                infowindow.close();
            }
            infowindow.open(map, marker);
        }
    };

    self.selectPlace = function(marker) {
        marker.setAnimation(google.maps.Animation.BOUNCE);setTimeout(
          function(){ marker.setAnimation(null); }, 1500);
        self.populateInfoWindow(marker, infowindow);
    };

    self.showListings = function() {
        showListings();
    };

    self.hideListings = function() {
        hideListings();
    };

    self.search = ko.computed(function() {

        for (i = 0; i < markers.length; i++) {
            markers[i].setVisible(false);
        }
        return ko.utils.arrayFilter(self.markers(), function(marker) {
            var match = marker.title.toLowerCase().indexOf(self.query().toLowerCase()) >= 0;
            marker.setVisible(match);
            return match;
        });
    });
};

function ErrorHandler() {
    alert('Oops! Please try it again');
}

function showListings() {
    var bounds = new google.maps.LatLngBounds();

    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    google.maps.event.addDomListener(window, 'resize', function() {
        map.fitBounds(bounds);
    });
}

function hideListings() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}

createMap = function() {
    ko.applyBindings(new ViewModel());
};
