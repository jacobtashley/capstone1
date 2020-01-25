'use strict'

watchForm();

$(document).scroll(function() {
    var y = $(this).scrollTop();
    if (y > 425) {
        $('.arrow').removeClass('hidden')
        $('#arrowImage').fadeIn();
    } else {
      $('#arrowImage').fadeOut();
    }
});

function watchForm(){
    $('form').submit(event => {
    event.preventDefault();
    getGameInfo();
    getTubeInfo();
    })
}

function getGameInfo(){
    var inputVal = $(".searchBox").val();

    const searchUrl = `https://cors-anywhere.herokuapp.com/http://www.giantbomb.com/api/search/?api_key=a6341e2763bab65b72518f7d85807ecba870afae&format=json&query=${inputVal}&field_list=name,platforms,image,description&resource_type=game`;

    fetch(searchUrl)
    .then(response => response.json())
    .then(newResponse => displayResults(newResponse, inputVal))
}

function displayResults(newResponse) {
    
    let filteredResults = newResponse.results.filter(
        item =>
          item.platforms &&
          item.platforms.find(platform => platform.name === "Arcade")
      );
    
    $('#infoResults').empty();

    for(let i = 0; i < filteredResults.length; i++) {
        $('#infoResults').append(
            `
            <input id="imageOne" type="image" src="${filteredResults[i].image.small_url}">
            <p>${filteredResults[i].description}</p>
            <p>All information being pulled from www.giantbomb.com<p>
            `
        )
    }
    // $('#infoResults').removeClass('hidden')
    // $('.infoContainer').removeClass('hidden')
    $('.infoContainer').fadeIn(1500);
    $('#infoResults').fadeIn(1500);
}

function getTubeInfo(){
    var inputVal = $(".searchBox").val();

    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q="${inputVal}+Arcade+Gameplay"&maxResults=3&key=AIzaSyBS0DdV2r80IS0_n1RsSpn2NTP2NP_xDBQ`;

    fetch(searchUrl)
    .then(response => response.json())
    .then(tubeResponse => displayTube(tubeResponse, inputVal))
}

function displayTube(tubeResponse){
    $('#results-list2').empty();
    
    for(let i = 0; i < tubeResponse.items.length; i++) {
        $('#results-list2').append(
            `
            <a href="https://www.youtube.com/watch?v=${tubeResponse.items[i].id.videoId}" target="_blank"><h3>${tubeResponse.items[i].snippet.title}</h3></a>
            <a href="https://www.youtube.com/watch?v=${tubeResponse.items[i].id.videoId}" target="_blank"><img id="youTubeImages" src='${tubeResponse.items[i].snippet.thumbnails.medium.url}'></a>
            `)
    }
    $('#tubeResults').fadeIn(3000);
    $('.tubeContainer').fadeIn(3000);
}