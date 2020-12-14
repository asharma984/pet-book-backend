const fetch = require("node-fetch");
const router = require('express').Router();

// creditials for petfinder.com API
const APIKey = "hHU1MtX7PMLlBnjaE16jR77Kv5OVX4SVmWWnvKCM5SKILHSYgi";
const SECRET = "FhaZVEb2BQ3ZQ8C9Xt27uaPEuw1PlJ4oFmBjVODX";

const COMPRISED = `grant_type=client_credentials&client_id=${APIKey}&client_secret=${SECRET}`;

const AnimalTypes = "https://api.petfinder.com/v2/types";
const PetFinderAuthURL = "https://api.petfinder.com/v2/oauth2/token";
const PetFinderURL = "https://api.petfinder.com/v2";


// Get all types of animals
router.route('/petfinder/types/').get((req, res) => {

    /* Purpose is to get auth token */
    fetch(`${PetFinderAuthURL}`, {
        method: 'POST',
        body: `${COMPRISED}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(response => response.json())

        .then(responsejson => {
            fetch(`${AnimalTypes}`, {
                headers: {
                    'Authorization': responsejson.token_type + ' ' + responsejson.access_token,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(response => response.json())
                .then(typesOfAnimals => res.json(typesOfAnimals)
                )
        });
});

// Get all breeds of animals for a type
router.route('/petfinder/breeds/:animalType').get((req, res) => {
    fetch(`${PetFinderAuthURL}`, {
        method: 'POST',
        body: `${COMPRISED}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(response => response.json())

        //get animal breeds dynamically
        .then(responsejson => {
            fetch(`${AnimalTypes}/${req.params.animalType}/breeds`, {
                headers: {
                    'Authorization': responsejson.token_type + ' ' + responsejson.access_token,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(response => response.json())
                .then(breedsOfAnimal => res.json(breedsOfAnimal))
        });
});

// get the search results from petfinder.com for a search string
router.route('/petfinder/animals/&').get((req, res) => {
    fetch(`${PetFinderAuthURL}`, {
        method: 'POST',
        body: `${COMPRISED}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(response => response.json())

        //get animal types
        .then(responsejson => {
            fetch(`${PetFinderURL}/animals${handleSearch(new URLSearchParams(req.url))}`, {
                headers: {
                    'Authorization': responsejson.token_type + ' '
                                     + responsejson.access_token,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(response => response.json())
                .then(listofAnimals => res.json(listofAnimals))
        });
});

// get an animal by ID
router.route('/petfinder/:animalId').get((req, res) => {
    fetch(`${PetFinderAuthURL}`, {
    method: 'POST',
    body: `${COMPRISED}`,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    }
})
    .then(response => response.json())
        .then(responsejson => {
              fetch(`https://api.petfinder.com/v2/animals/${req.params.animalId}`, {
                  headers: {
                      'Authorization': responsejson.token_type + ' '
                                       + responsejson.access_token,
                      'Content-Type': 'application/x-www-form-urlencoded'
                  }
              })
                  .then(response => response.json())
                .then(pet => res.json(pet))
        })
})

// get cities with population over 5,000 for a specific state
router.route('/location/cities/:theState').get((req, res) => {
    fetch("https://www.universal-tutorial.com/api/getaccesstoken", {
        method: 'GET',
        headers: {
            "Accept": "application/json",
            "api-token": "jPL506i7-WYSDgeyQTbaLDI7wourV8uOI-pzr8JiPY4OMpaxiObPGYCfEgUXYmG90xo",
            "user-email": "email@davidryan.dev"
        }
    }).then(response => response.json())

        .then(response => {
            fetch(`https://www.universal-tutorial.com/api/cities/${req.params.theState}`, {
                headers: {
                    "Authorization": `Bearer ${response.auth_token}`,
                    "Accept": "application/json"
                }
            }).then(response => response.json())
                .then(listOfCities => res.json(listOfCities))

        });
});
module.exports = router;


/*
The purpose of this function is to handle the search string for our requests, it take a URLSearchParams
 */
const handleSearch=(searchParams)=>{
    let temp = "";
    searchParams.forEach((value,key) => {
        if(value !== 'null' && key !== '/petfinder/animals/'){
            temp=(`${temp}${key}=${value}&`);
        }
    });

    return temp
};