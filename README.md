# Folk Atlas

Folk Atlas is an interactive web application that lets you explore folk melodies from various countries. Select a country to hear a traditional folk melody, change the scale and tonality, and see the characteristic drum pattern being played through the rhytmhic wheel. Additionally, enjoy a fun game where you can guess the country a song belongs to, available in both single-player and multiplayer modes!

## Links of the project
Here you can find the link of the project [Folk Atlas](https://diegopini.github.io/ACTaM-2023-2024/).

Check out also the [video](https://www.youtube.com/watch?v=mSk8SOocMwI) demonstration of the project.

## Map

Exploring the map is very easy and intuitive. 
There are folk songs from 9 countries: Italy, France, Spain, United Kingdom, Austria, USA, Jamaica, Brazil and Australia.

Click on a marker and a popup will show up: 
- At the top there's the song title with a brief description of the tradition it comes from.
- On the left, you’ll find the rhythmic wheel, which displays the distinctive drum pattern.
- In the middle, a progress bar indicates the loop's progress. Additionally, there are four mute buttons, one for each instrument, which can be activated by clicking on them.
- On the right, a circle of fifths is displayed, allowing you to select the song's tonality, along with a dropdown menu for choosing the scale.

<p align="center">
   <img src="https://github.com/DiegoPini/ACTaM-2023-2024/assets/127502273/ff5aa33d-ee3c-413f-98a3-7c43047cf011">
</p>


## Game


Clicking the button at the top left of the page lets you play a game where you guess which song belongs to which country. You can play solo or challenge a friend. To play in multiplayer mode, you need to create a lobby or join an existing one. All lobby names are displayed below and can be easily copied and pasted.

<p align="center">
   <img src="https://github.com/DiegoPini/ACTaM-2023-2024/assets/127502273/85c6ccbc-6489-4b49-8452-c99bd9210260">
</p>

When the game starts, the rhythmic wheel appears: click "Play" to hear the song and "Select" to choose the country. Be careful—once you click "Select," you can't replay the song or see the rhythmic pattern again!

If you recognize the drum pattern immediately, you'll be the fastest among your friends and likely win the game! For each correct answer, you earn 1 point; for each wrong answer, you lose 1 point. Reach -3 points and you lose; reach 5 points and you win!

<p align="center">
   <img src="https://github.com/DiegoPini/ACTaM-2023-2024/assets/127502273/bcf6794e-76b1-4efd-b4da-f4b994fec0ae">
</p>



## Implementation


Map -> Map.js interacts with the map created via the Mapbox site (a site that allows developers to customise maps), to handle click events on specific geographic areas and to manipulate user interface elements based on these interactions. Map contains the token link and style, characteristic of the project developed on the site. In the index.html file we find the inclusion of the Mapbox API, the link to game and all objects in the pop-up. Features.json contains the coordinates of all countries selectable on the map.

Scores - >MusicBeat.json collects a set of strings that are called each time a country is selected. The main ones include song speed in bpm, description of the music genre, percussion in numbers from 1 to a maximum of 4, 4 instruments with note frequency in MIDI format and their duration. 

Pop-up -> Progress bar and Rhythmic wheel are Canvas, while the Circle of fifths is an SVG.

Game -> developed via the Google Firebase API. Players are associated with a user ID within the game database. Each time the database (or part of it) changes, the onvalue function works as a listener, i.e. it handles the change. The get function takes the data from the database, while the set function sets the data. The game takes advantage of the changes in the data in the database to continue the game, with functions being activated for all players in parallel.
Player -> suonaLoop.js to be able to play the scores and to be able to change the channels for each instrument, ProgBar (html, css, js) to be able to display the progress bar, ChangeKey.js to be able to change the key.


## Difficulties faced

The two main difficulties faced are the inclusion of the Mapbox and Firebase APIs, so that they are consistent with the rest of the project; secondly, the construction of the pop-up in a cohesive and balanced manner, to achieve a union of objects that function in a coordinated but independent manner.
