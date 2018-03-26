## Obtenir la géolocalisation à partir d'un fichier csv
On se sert de l'api [adresse.data.gouv.fr](https://adresse.data.gouv.fr/api) pour obtenir la géolocalisation de nos adresses. On peut se servir simplement de villes, ou être plus fin et rentrer des adresses de rues.
> curl http://localhost/ajaxGeocoding/getLocations.html

Input :
- lat départ
- long départ
- adresse (tout ensemble dans une cellule, au format `n° rue` - `commune`)

```js
var CSVPath = "assets/base.csv";
```

##### Exemple de CSV
```csv
Nom,adresse,commentaires
Use Design,25 rue Henry Monnier - Paris, une agence de design
Hyptique,13 Cité joly - Paris, une autre agence de design
ESAM Caen,17, cours Caffarelli - Caen, une école
```

## Obtenir le temps de route et la distance entre un point initial et de multiples destinations
On se sert de l'api [OSRM](http://project-osrm.org/docs/v5.15.2/api/#general-options) pour obtenir les temps de trajets et les distances.
> curl http://localhost/ajaxGeocoding/getRoute.html

Input :
- lat et long départ ― à renseigner dans le fichier (variable `startingPoint` in `js/getRoute.js`)
- lat arrivée
- long arrivée

```js
var startingPoint = [-4.09904, 47.983397,];
```

Renseigner l'adresse du csv dans `js/getRoute.js`

```js
var CSVPath = "assets/base_locations.csv";
```

##### Exemple de CSV
```csv
id,Nom,adresse,commentaires,lat,long
1,Use Design,25 rue Henry Monnier - Paris, une agence de design,48.880514,2.337481
2,Hyptique,13 Cité joly - Paris, une autre agence de design,48.862651,2.382743
3,ESAM Caen,17 cours Caffarelli - Caen, une école,49.180415,-0.346498
```
