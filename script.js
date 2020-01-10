'use strict'

$(watchForm());

const searchUrl = 'https://cors-anywhere.herokuapp.com/http://www.giantbomb.com/api/search/?api_key=a6341e2763bab65b72518f7d85807ecba870afae&format=json&query="donkey+kong"&field_list=name,platforms&resource_type=game';

function watchForm(){
    $('form').submit(event => {
    event.preventDefault();
    getGameInfo();
    })
}

function getGameInfo(){
    
    fetch(searchUrl)
    .then(response => response.json())
    .then(newResponse => {
        console.log(newResponse);
    })
}