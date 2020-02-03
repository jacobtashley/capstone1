'use strict'

watchForm();

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
    var inputVal = $(".searchBox").val();

    const searchUrl = `https://cors-anywhere.herokuapp.com/http://www.giantbomb.com/api/search/?api_key=a6341e2763bab65b72518f7d85807ecba870afae&format=json&query=${inputVal}&field_list=name,platforms,image,description&resource_type=game`;

    if(!inputVal){
        return;
    }

    $('.errorMessage').hide()
    $('.tubeResults').hide();
    $('.tubeContainer').hide();
    $('.infoContainer').fadeOut(500);
    $('.infoResults').fadeOut(500);
    $('.loadingMessage').show()
    $('.loadingMessage').text('Searching...')

   

    fetch(searchUrl)
    .then(response => response.json())
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
            getTubeInfo()
        
        } else {
            $('.loadingMessage').hide()
            $('.errorMessage').show()
            $('.errorMessage').text('No information on this game. Please try again.')
        };
        
    })
}

//displays Game API info to DOM//
function displayResults(filteredResults) {
    
    $('.infoResults').empty();

    for(let i = 0; i < filteredResults.length; i++) {
        $('.infoResults').append(
            `
            <input class="imageOne" type="image" src="${filteredResults[i].image.small_url}">
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
    var inputVal = $('.searchBox').val();

    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q="${inputVal}+Arcade+Gameplay"&maxResults=3&key=AIzaSyBS0DdV2r80IS0_n1RsSpn2NTP2NP_xDBQ`;

    fetch(searchUrl)
    .then(response => response.json())
    .then(tubeResponse => displayTube(tubeResponse, inputVal))
}

//Displays YouTube API info to DOM//
function displayTube(tubeResponse){
    $('.tubeList').empty();
    
    for(let i = 0; i < tubeResponse.items.length; i++) {
        $('.tubeList').append(
            `
            <a href="https://www.youtube.com/watch?v=${tubeResponse.items[i].id.videoId}" target="_blank"><h3>${tubeResponse.items[i].snippet.title}</h3></a>
            <a href="https://www.youtube.com/watch?v=${tubeResponse.items[i].id.videoId}" target="_blank"><img class="youTubeImages" src="${tubeResponse.items[i].snippet.thumbnails.medium.url}" alt="Image Of Video"></a>
            `
        )
    }
    
    $('.tubeResults').fadeIn(3000);
    $('.tubeContainer').fadeIn(3000);
}

//Arrow "back to top" function//
$(document).scroll(function() {
    var y = $(this).scrollTop();
    if (y > 425) {
        $('.arrow').removeClass('hidden')
        $('.arrowImage').fadeIn();
    } else {
      $('.arrowImage').fadeOut();
    }
});