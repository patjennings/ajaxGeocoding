var CSVPath = "villes.txt";
var p = 0; // pointer qui s'incrémente à mesure que les requêtes sont lancées — pour naviguer dans lines[]
var timer; // interval
var interval = 300; // intervalle avec lequel se lance la requête vers l'API geoloc
var lines = []; // stocke les lignes du csv
var randomizeSamePoints = "true"; // permet d'étaler les points en random sur une zone, si la ville est la même.
var headers;
var villePosition;

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

                // On checke laquelle est la colonne City, pour établir la référence qui nous sert plus tard
                if(headers[j] == "VILLE" || headers[j] == "ville" || headers[j] == "Ville" || headers[j] == "CITY" || headers[j] == "city" || headers[j] == "City"){
                  villePosition = j;
                }
            }
            lines.push(tarr);
        }
    }
    startRequestLauncher();
}

function startRequestLauncher(){
  timer = setInterval(launchRequest, interval);
}

function launchRequest(){
  //https://adresse.data.gouv.fr/api
  var rqUrl = 'https://api-adresse.data.gouv.fr/search/?q='+lines[p][villePosition];

  $.ajax({
  	type: 'GET',
  	url: rqUrl,
  	jsonpCallback: 'jsonCallback',
  	success: function(data)
  	{
      displayData(data);
  	},
  	error: function(e)
  	{
  	   console.log(e.message);
  	}
  });
}



function displayData(data){
  var id = p;
  var lat, long;

  var isAtPoint = checkSame(lines[p][villePosition]);//

  if(isAtPoint == "true" && randomizeSamePoints == "true"){
    var long = randomizePoint(data.features[0].geometry.coordinates[0]);
    var lat = randomizePoint(data.features[0].geometry.coordinates[1]);

  } else{
    var long = data.features[0].geometry.coordinates[0];
    var lat = data.features[0].geometry.coordinates[1];
  }

  if(p == 0){
    id = "ID";
    lat = "LAT";
    long = "LONG";
  }

  // construction de l'output
  var output = '<div class="result">';
  output += '<div class="cell">'+id+',</div>';
  for(var i = 0 ; i < headers.length ; i++){
    output += '<div class="cell">'+lines[p][i]+',</div>';
  }
  output += '<div class="cell">'+lat+',</div>';
  output += '<div class="cell">'+long+',</div>';
  output += '</div>';

  // on écrit l'output
  $('#jsonp-results').append(output);

  // on incrémente le pointer
  incrementPointer();
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
