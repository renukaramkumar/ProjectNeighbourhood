var locList = [{
        'name': "Cabin Coffee Cafe",
        'address': "6525 W Happy Valley Rd,Glendale, AZ 85301",
        'latlng': {
            'lat': 33.711167,
            'lng': -112.200089
        },
        'marker': 0,
        'foursquareId': "4b5dba9df964a520cd6829e3"
    },
    {
        'name': "Ammos Mediterranean Grill",
        'address': "6530 West Happy Valley Road #114, Glendale",
        'latlng': {
            'lat': 33.713686,
            'lng': -112.200761
        },
        'marker': 1,
        'foursquareId': "4fe01338e4b066c019d606c2"
    },
    {
        'name': "Mi Familia Mexican Food",
        'address': "25155 North 67th Avenue #138, Phoenix",
        'latlng': {
            'lat': 33.713577,
            'lng': -112.202300
        },
        'marker': 2,
        'foursquareId': "4bd4efeb637ba5931dc9f570"
    },
    {
        'name': "McDonalds",
        'address': "6535 W Happy Valley Rd ,Glendale, AZ 85310",
        'latlng': {
            'lat': 33.711686,
            'lng': -112.200575
        },
        'marker': 3,
        'foursquareId': "4b450c94f964a520710226e3"
    },
    {
        'name': "Brother's Pizza",
        'address': " 6635 W Happy Valley Rd A107, Glendale, AZ 85310",
        'latlng': {
            'lat': 33.710591,
            'lng': -112.202332
        },
        'marker': 4,
        'foursquareId': "4b450dd7f964a520b10226e3"
    }
];



var map;
var infowindow;
var markers = [];

function googleError() {
    setTimeout(function() {
        alert("Google Maps cannot load")
    }, 1000);
};

//initial lattitude and longitude
function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 33.7136892,
            lng: -112.2019998
        },
        zoom: 16
    });
    for (var i = 0; i < locList.length; i++) {
        var name = locList[i].name;
        var address = locList[i].address;
        var position = locList[i].latlng;
        var loc = locList[i].foursquareId;

        //creates marker for each place
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            animation: google.maps.Animation.DROP,
            name: name,
            address: address,
            id: loc,

        });
        markers.push(marker);


        //upon clicking each marker infowindow opens 

        infowindow = new google.maps.InfoWindow();

        //infowindow without foursquare

        /*   google.maps.event.addListener(marker,'click', function() {    
        infowindow.setContent('<div><strong>' + this.name + '</strong><br>'+ this.address+'</div>');
       
         infowindow.open(map, this); 

        });

}
};*/

        //autocomplete the search input 

        //var input = document.getElementById('place-input');
        //ar searchBox = new google.maps.places.Autocomplete(input);


        //infowindow using Foursquare API
        google.maps.event.addListener(marker, "click", (function(marker) {

            return function(evt) {
                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() {
                    marker.setAnimation(null);
                }, 1000);
                foursquareUrl = 'https://api.foursquare.com/v2/venues/' + marker.id + '?client_id=IHFQF3NIJLHVYNXRU3MUW1N5AVG2U3Z41GVIEPZCKRHRW01K&client_secret=WF0DGDJE0UN1DMDBHPSY5ZRYGK1BB1LPYAY0SPB1TKAQH1FX&v=20170411';

                $.ajax({

                    url: foursquareUrl,
                    dataType: 'json',
                    data: {
                        async: true
                    },
                    success: function(data) {

                        var title = data.response.venue.name;
                        var addr = data.response.venue.location.formattedAddress;
                        var rating = data.response.venue.rating;
                        var url = data.response.venue.url;

                        //one of the restuarants doesnt have an url returned in the data from the request                  
                        if (typeof(url) === 'undefined') {
                            url = "Website link not available! ";
                        } else {
                            url = data.response.venue.url;
                        }

                        //rating for one of the restuarant is not available

                        if (typeof(rating) === 'undefined') {
                            rating = "Rating not available";
                        } else {
                            rating = data.response.venue.rating;
                        }
                        infowindow.setContent('<div><strong>' + title + '</strong><br>' + addr + '<br><strong>Stars:</strong>' + '  ' + rating + '<br>' + '<a href="' + url + '">' + url + '</a></div>');

                        infowindow.open(map, marker);
                    },
                    error: function(data) {
                        alert("Could not load data from foursquare!");
                    }


                });
            };
        })(marker));
    }
};


//viewModel

var viewModel = function() {
    var self = this;

    //filter the items using the filter text

    self.inputText = ko.observable('');
    self.locList = ko.observableArray(locList);
    self.searchResults = ko.computed(function() {
        var search = self.inputText();

        //when a place on the list is clicked corresponding marker is made to bounce
        self.setMarker = function(clickedPlace) {
            var mark = clickedPlace.marker;

            google.maps.event.trigger(markers[mark], 'click');

            markers[mark].setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                markers[mark].setAnimation(null);
            }, 1000);
        };
        //depending on the search list only the corresponding markers are set visible 

        for (var i = 0; i < markers.length; i++) {
            var placeMarker = markers[i].name.toLowerCase();

            if (placeMarker.includes(search)) {
                markers[i].setVisible(true);
            } else {
                markers[i].setVisible(false);
            }
        }


        //returns the filtered list of search places

        return ko.utils.arrayFilter(self.locList(), function(location) {
            var match = location.name.toLowerCase().indexOf(search) >= 0;
            return match;

        });

    });

};

ko.applyBindings(new viewModel());