'use strict'

$( document ).ready(watchForm());

//Hides containers before showing//
$('.infoContainer').hide();
$('.tubeContainer').hide();

//Waits for "Search" button to be clicked//
function watchForm() {
    $('form').submit(event => {
        event.preventDefault()
        getGameInfo()
    })
}

//Where magic happens. Searches if Game API has info on gaem, then displays it, then runs YouTube API call// 
function getGameInfo() {
    let inputVal = $(".searchBox").val();

    const searchUrl = `https://cors-anywhere.herokuapp.com/http://www.giantbomb.com/api/search/?api_key=a6341e2763bab65b72518f7d85807ecba870afae&format=json&query=${inputVal}&field_list=name,platforms,image,description&resource_type=game`;

    if(!inputVal){
        return;
    }

    $('.errorMessage').empty()
    $('.errorMessage').hide()
    $('.tubeResults').hide();
    $('.tubeContainer').hide();
    $('.infoContainer').fadeOut(500);
    $('.infoResults').fadeOut(500);
    $('.loadingMessage').show()
    $('.loadingMessage').text('Searching...')

   

    fetch(searchUrl)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText)
    })
    .then(newResponse => {

        let filteredResults = newResponse.results.filter(
            item =>
              item.platforms &&
              item.platforms.find(platform => platform.name === "Arcade")
        );
        
        if(filteredResults.length > 0) {
            $('.loading').hide()
            $('.errorMessage').hide()
            displayResults(filteredResults)
            console.log(filteredResults)
            getTubeInfo()
        
        } else {
            $('.loadingMessage').hide()
            $('.errorMessage').show()
            $('.errorMessage').text('No information on this game. Please try again.')
        };
        
    })
    .catch(err => {
        $('.loading').hide()
        $('.errorMessage').show()
        $('.errorMessage').append(`<p>Error: ${err.message}</p>`)
    })
}

//displays Game API info to DOM//
function displayResults(filteredResults) {
    
    $('.infoResults').empty();

    for(let i = 0; i < filteredResults.length; i++) {
        $('.infoResults').append(
            `
            <input class="imageOne" type="image" src="${filteredResults[i].image.small_url}" alt=>
            <div class="description">
                <p>${filteredResults[i].description}</p>
            </div>
            <div class="credit">
                <p>All information being pulled from www.giantbomb.com<p>
            </div>
            `
        )
    }

    $('.infoContainer').fadeIn(1500);
    $('.infoResults').fadeIn(1500);
}

//Calls YouTube API for info//
function getTubeInfo() {
    let inputVal = $('.searchBox').val();

    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q="${inputVal}+Arcade+Gameplay"&maxResults=3&key=AIzaSyBS0DdV2r80IS0_n1RsSpn2NTP2NP_xDBQ`;

    fetch(searchUrl)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText)
    })
    .then(tubeResponse => displayTube(tubeResponse, inputVal))
    .catch(err => {
        $('.loading').hide()
        $('.errorMessage').show()
        $('.errorMessage').append(`<p>Error: ${err.message}</p>`)
    })
}

//Displays YouTube API info to DOM//
function displayTube(tubeResponse){
    $('.tubeList').empty();
    
    for(let i = 0; i < tubeResponse.items.length; i++) {
        $('.tubeList').append(
            `
            <a href="https://www.youtube.com/watch?v=${tubeResponse.items[i].id.videoId}" target="_blank"><h3>${tubeResponse.items[i].snippet.title}</h3></a>
            <iframe src="https://www.youtube.com/embed/${tubeResponse.items[i].id.videoId}"></iframe>
            `
        )
    }
    
    $('.tubeResults').fadeIn(3000);
    $('.tubeContainer').fadeIn(3000);
}

//Arrow "back to top" function//
$(document).scroll(function() {
    let y = $(this).scrollTop();
    if (y > 425) {
        $('.arrow').removeClass('hidden')
        $('.arrowImage').fadeIn();
    } else {
      $('.arrowImage').fadeOut();
    }
});