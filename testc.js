$(document).ready(function(){
  $(".button").click(function(event){
    LatLonCall();
    Menu();
    event.preventDefault();
  })

  $('form input:text').click(function(e){
    e.target.value=""
  })

});
function LatLonCall(){
  var address = $("input#address").val();
  //var address = "1801 Belmont St NW";
  var city = $("input#city").val();
  //var city = "Washington";
  var state = $("input#state").val();
 // var state = "DC";
  var DataString = 'address'+address+'city'+city+'state'+state;
  var FullAddress = address+", "+city+", "+state;
  FullAddress = FullAddress.replace(/ /g,"+");
  console.log("https://maps.googleapis.com/maps/api/geocode/json?" + "address="+FullAddress+"&key=AIzaSyAGt3oFrXSziqC7au4sGmMTadhBbqfjstY");

  var params = {"address":FullAddress,"key":"AIzaSyAGt3oFrXSziqC7au4sGmMTadhBbqfjstY"}
  $.ajax({url: "https://maps.googleapis.com/maps/api/geocode/json?" + "address="+FullAddress+"&key=AIzaSyAGt3oFrXSziqC7au4sGmMTadhBbqfjstY",type: "GET",})

  //$.ajax({url: "https://api.wmata.com/Bus.svc/json/jStopSchedule?StopID=3002578&api_key=f9a8294236b6475990ef9d0085bc3826",type: "POST",})

  .done(function(data){
    console.log("FINALLY");
    lat = data.results[0].geometry.location.lat;
    lon = data.results[0].geometry.location.lng;
    console.log(lat);
    console.log(lon);
    StationCall(lat,lon);
    WeatherCall(lat,lon);
  })
  .fail(function(data){
    console.log(data);
    alert("LatLonCall Failure!")
  });
}
function StationCall(lat,lon){
  var Latitude = lat;
  var Longitude = lon;
  var Radius = 300;
  var api_key = "f9a8294236b6475990ef9d0085bc3826";
  var params = {
            "api_key": "f9a8294236b6475990ef9d0085bc3826",
            "Lat": Latitude,"Lon": Longitude,"Radius": "300",};
  console.log("https://api.wmata.com/Bus.svc/json/jStops?Lat="+Latitude+"&Lon="+Longitude+"&Radius="+Radius+"&api_key="+api_key);
  $.ajax({url: "https://api.wmata.com/Bus.svc/json/jStops?"+$.param(params),type: "GET"})
  alert(api_key);
  alert(Latitude);
  alert(Longitude);
  console.log("https://api.wmata.com/Bus.svc/json/jStops?Lat="+Latitude+"&Lon="+Longitude+"&Radius="+Radius+"&api_key="+api_key);
  $.ajax({url: "https://api.wmata.com/Bus.svc/json/jStops?"+$.param(params),type: "GET"})
  .done(function(result){
    console.log("PAUL IS AWESOME!");
    var id= result.Stops[0].StopID;
    BusSchedule(id);
  })
  
  .fail(function(result,response,text){
    console.log("Failure of StatioNCall");
    console.log(result);
    console.log(response);
    console.log(text);
    console.log("StationCall Failure!");
  });
}
function BusSchedule(response){
  var api_key = "f9a8294236b6475990ef9d0085bc3826";
  var StopID = response;
  $.ajax({url: "https://api.wmata.com/NextBusService.svc/json/jPredictions?StopID="+StopID+"&api_key="+api_key,type: "GET",})
  .done(function(data){
    console.log("https://api.wmata.com/NextBusService.svc/json/jPredictions?StopID="+StopID+"&api_key="+api_key)
    console.log(data);
    BusTable(data);
  })
  .fail(function(data){
    alert("BusSchedule Failure!");
  })
}
function WeatherCall(lat,lon){
  var Latitude = lat;
  var Longitude = lon;
  var api_key = "ba8b7446125d48c50976f35f68653f07";
  var params = {
    "appid": "ba8b7446125d48c50976f35f68653f07",
    "lat": Latitude, "lon": Longitude,"units":"imperial",};
  $.ajax({url: "http://api.openweathermap.org/data/2.5/weather?"+$.param(params),type: "GET"})
  .done(function(WeatherData){
    console.log("Weather works");
    console.log(WeatherData.main.temp);
    $('#WeatherWidget').html('<p>Current Temperature: <br>'+WeatherData.main.temp);
  })
  .fail(function(WeatherData){
    console.log("Weather failure");
  });
}
function BusTable(bus){
  var $table = $('<table/>');
  var $headingRow = $('<tr/>', {'id': 'header'});
  var headings = ["Route ID", "Direction", "Minutes till arrival"]
  $.each(headings, function(index, heading) {
    var tableHeading = $('<th/>').html(heading)
    $headingRow.append(tableHeading)
  });
  $table.html($headingRow);
  var TableRowIds = ["RouteID","DirectionText","Minutes"];
  $.each(bus.Predictions, function(index, prediction){
    var $TableRow = $('<tr/>')
    $.each(TableRowIds, function(idIndex, rowId) {
      var TableRowData = $('<td/>', {'id': rowId}).html(prediction[rowId]);
      $TableRow.append(TableRowData);
    })
    $table.append($TableRow);
  });
  $('#BusWidget').html($table);
    AlertBus();
}
function AlertBus(){
  $("tr").each(function(){
    var col_val = $(this).find("td#Minutes").text();
    //console.log(col_val, $(this))
    if ($(this).attr("id") == "header" ) {
      $(this).css('background-color', 'blue')
    }
    else if (col_val < 10){
      $(this).addClass('LastChance');
    }
    else if (col_val < 20){
      $(this).addClass('GetReady');
    }
  });
}
function Menu(){
  var $Menu = $('<table/>');
  var $MenuHeader = $('<tr/>',{'id':'MenuHeader'});
  var MenuHeadingsTxt = ["Establishment","Item","Description","Price"];
  $.ajax({url: "http://www.carlsondigitalsigns.com/results.json",type:"GET"})
  .done(function(MenuData){
    console.log("menu loaded");
    $.each(MenuHeadingsTxt,function(index, Txt){
      var MenuHeadings = $('<th/>').html(Txt);
      $MenuHeader.append(MenuHeadings);
    });
    $Menu.html($MenuHeader);
    var MenuRowIds = ["Establishment","MenuItem","MenuDescription","Price"];
    $.each(MenuData, function(index, item){
      var $MenuRow = $('<tr/>');
      $.each(MenuRowIds, function(IdIndex, id){
        //console.log(item[id]);
        var MenuRowData = $('<td/>',{'id':id}).html(item[id]);
        $MenuRow.append(MenuRowData);
      })
      $Menu.append($MenuRow);
    })
    $('#Menu').html($Menu);
  })
  .fail(function(MenuData){
    console.log("Menu load fail");
  })
}