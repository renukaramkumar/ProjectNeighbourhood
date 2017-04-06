var locList=[
{
'name':"Cabin Coffee Cafe",
'address':"6525 W Happy Valley Rd,Glendale, AZ 85301",
'latlng':{'lat':33.711167,'lng':-112.200089},
'marker':0
},
{
'name':"Ammos Mediterranean Grill",
'address':"6530 West Happy Valley Road #114, Glendale",
'latlng':{'lat':33.713686,'lng':-112.200761	},
'marker':1
},
{
'name':"Mi Familia Mexican Food",
'address':"25155 North 67th Avenue #138, Phoenix"	,
'latlng':{'lat':33.713577,'lng':-112.202300},
'marker':2
}
];



     var map;
     var infowindow;
     var markers=[];
     var locations=[];

//initial lattitude and longitude
      function initMap() {
      
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 33.7136892, lng: -112.2019998},
          zoom: 16
        });
        for(var i=0;i<locList.length;i++){
          var name=locList[i].name;
          var address=locList[i].address;
          var position= locList[i].latlng;
          locations.push(locList[i]);
//creates marker for each place
        var marker=new google.maps.Marker({
        map: map,
      position: position,
        animation: google.maps.Animation.DROP
        });           
       markers.push(marker);


//upon clicking each marker infowindow opens 

      infowindow = new google.maps.InfoWindow();
       google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent('<div><strong>' + name + '</strong><br>'+ address+'</div>');
        infowindow.open(map, this);   
        });
   }

//autocomplete the search input       
//var input = document.getElementById('place-input');
//ar searchBox = new google.maps.places.Autocomplete(input);
}


locList.list=ko.observableArray([]);

//filter the items using the filter text

locList.inputText =ko.observable('');


locList.searchResults = ko.computed(function() {
    var search = locList.inputText();
    for(var i=0;i<markers.length;i++){
   	if(!search){
   		markers[i].setVisible(true);
   	}
   	else if(locList[i].name.includes(search))

   		{
   			
   			markers[i].setVisible(true);
   	}
   	else
   	{
   		markers[i].setVisible(false);
   	}

   }
 
    return locList.filter(function(place) {
    return place.name.toLowerCase().indexOf(search) >= 0;

   
    	
    });

});


ko.applyBindings(locList);







