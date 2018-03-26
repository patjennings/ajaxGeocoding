// PARAMÈTRES //
var CSVPath = "input/input_routes.csv";
var startingPoint = [-4.09904, 47.983397,]; //long lat
var interval = 500; // intervalle avec lequel se lance la requête vers l'API geoloc
var randomizeSamePoints = "true"; // permet d'étaler les points en random sur une zone, si la ville est la même.

// VARS //
var p = 1; // pointer qui s'incrémente à mesure que les requêtes sont lancées — pour naviguer dans lines[] - on commence à 1, mpour éviter la ligne de header
var timer; // interval
var lines = []; // stocke les lignes du csv
var headers; // En-têtes du tableau
var latRef; // position de la colonne 'lat' dans le CSV
var longRef; // position de la colonne 'long' dans le CSV

$(document).ready(function(){
  loadCSV();
});

function loadCSV(){
  $.ajax({
      type: "GET",
      url: CSVPath,
      dataType: "text",
      success: function(data) {processData(data);}
   });

}

function processData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    headers = allTextLines[0].split(',');

    for (var i=0; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');

        if (data.length == headers.length) {

            var tarr = [];
            for (var j=0; j<headers.length; j++) {
                tarr.push(/*headers[j]+":"+*/data[j]);

                // On checke laquelle est la colonne lat, pour établir la référence qui nous sert plus tard
                if(headers[j] == "LAT" || headers[j] == "lat" || headers[j] == "Lat"){
                  latRef = j;
                }
                else if(headers[j] == "LON" || headers[j] == "lon" || headers[j] == "Lon" || headers[j] == "LONG" || headers[j] == "long" || headers[j] == "Long"){
                  longRef = j;
                }
            }
            lines.push(tarr);
        }

    }

    displayHeaders();
    startRequestLauncher();
}

function startRequestLauncher(){
  timer = setInterval(launchRequest, interval);
}

function launchRequest(){
  //https://adresse.data.gouv.fr/api
  // http://router.project-osrm.org/route/v1/driving/13.388860,52.517037;13.397634,52.529407;13.428555,52.523219?overview=false
  var rqUrl = 'http://router.project-osrm.org/route/v1/driving/'+startingPoint[0]+','+startingPoint[1]+';'+lines[p][longRef]+','+lines[p][latRef]+'?overview=false';

  $.ajax({
  	type: 'GET',
  	url: rqUrl,
  	jsonpCallback: 'jsonCallback',
  	success: function(data)
  	{
      displayDataAsCSV(data);
  	},
  	error: function(e)
  	{
  	   console.log(e.message);
  	}
  });
  // incrementPointer();
  // console.log("end");
}

function displayHeaders(){
  var output = "id,";
  for(var i = 0 ; i < headers.length ; i++){
    output += lines[0][i]+",";
  }
  output += "duration,";
  output += "distance";
  output += "<br/>";

  $('#jsonp-results').append(output);
}

function displayDataAsCSV(data){
  var id = p;
  var lat, long, duration, distance;

  var duration = data.routes[0].duration;
  var distance = data.routes[0].distance;

  // construction de l'output
  var output = id+",";
  for(var i = 0 ; i < headers.length ; i++){
    output += lines[p][i]+",";
  }
  // output += lat+",";
  // output += long+",";
  output += durationToMinutes(duration)+",";
  output += metersToKilometers(distance);
  output += "<br/>";

  // on écrit l'output
  $('#jsonp-results').append(output);

  // on incrémente le pointer
  incrementPointer();
}

function durationToMinutes(_duration){
  var d = _duration;
  var dm = Math.round(d/60); // le temps en minutes
  if(dm > 59){
    var h, m;
    h = Math.floor(dm/60);
    m = dm-(h*60);
    return h+"h"+Math.round(m);
  }
  else{
    return "00h"+dm;
  }


}

function metersToKilometers(_distance){
  var d = _distance;
  var r = (d/1000).toFixed(2);
  return r+" kms";
}

function incrementPointer(){
  if(p == lines.length-1){
    clearInterval(timer);
  } else{
    p++;
    // console.log(lines.length);
  }
}

function randomizePoint(num){
  var newNum = num+(Math.random()/500);
  return newNum;
}

function checkSame(city){
  var state = "false";

  for(var i = 0; i<p ; i++){
    if(lines[i][2] == city){
      state = "true";
    }
  }
  return state;
}
