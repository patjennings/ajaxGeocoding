var p = 0; // pointer qui s'incrémente à mesure que les requêtes sont lancées — pour naviguer dans lines[]
var timer; // interval
var interval = 300; // intervalle avec lequel se lance la requête vers l'API geoloc
var lines = []; // stocke les lignes du csv
var randomizeSamePoints = "true"; // permet d'étaler les points en random sur une zone, si la ville est la même.

$(document).ready(function(){
  loadCSV();
});

function loadCSV(){
  $.ajax({
      type: "GET",
      url: "liste_ecoles_29.txt",
      dataType: "text",
      success: function(data) {processData(data);}
   });
}

function processData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');

    for (var i=0; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');

        if (data.length == headers.length) {

            var tarr = [];
            for (var j=0; j<headers.length; j++) {
                tarr.push(/*headers[j]+":"+*/data[j]);

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
  var rqUrl = 'https://api-adresse.data.gouv.fr/search/?q='+lines[p][2];

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
  var type = lines[p][0];
  var ecole = lines[p][1];
  var ville = lines[p][2];
  var niveau = lines[p][3];
  var circo = lines[p][4];
  var autreVille;



  var isAtPoint = checkSame(ville);

  if(isAtPoint == "true" && randomizeSamePoints == "true"){
    var long = randomizePoint(data.features[0].geometry.coordinates[0]);
    var lat = randomizePoint(data.features[0].geometry.coordinates[1]);

    autreVille = "doublon";
  } else{
    var long = data.features[0].geometry.coordinates[0];
    var lat = data.features[0].geometry.coordinates[1];
    autreVille = "-";
  }

  var id = p;

  if(p < 1){
    id = "ID";
    lat = "LAT";
    long = "LONG";
  }


  $('#jsonp-results').append('<div class="result">'+id+', '+type+', '+ecole+', '+ville+', '+niveau+', '+circo+', '+lat+', '+long+'</div>');

  // var output = '<div class="result">';
  // output += '<div class="cell">'+id+',</div>';
  // output += '<div class="cell">'+type+',</div>';
  // output += '<div class="cell">'+ecole+',</div>';
  // output += '<div class="cell">'+ville+',</div>';
  // output += '<div class="cell">'+autreVille+',</div>';
  // output += '<div class="cell">'+niveau+',</div>';
  // output += '<div class="cell">'+circo+',</div>';
  // output += '<div class="cell">'+lat+',</div>';
  // output += '<div class="cell">'+long+'</div>';
  // output += '</div>';
  //
  // $('#jsonp-results').append(output);

  incrementPointer();
}



function incrementPointer(){
  if(p >= lines.length-1){
    clearInterval(timer);
  } else{
    p++;
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
