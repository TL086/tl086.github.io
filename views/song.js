
export async function song(root) {

    renderSong(root);
    
    const audioPlayer = document.getElementById('player');
    const repeatButton = document.getElementById('repeat-button');
    let repeatisActive = false; // Initialize the repeatbutton state as not pressed
    const previousButton = document.getElementById('previous-button');
    const playPauseButton = document.getElementById('play-pause-button');
    const nextButton = document.getElementById('next-button');
    const shuffleButton = document.getElementById('random-button');
    let shuffleisActive = false; // Initialize the shufflebutton state as not pressed
    const progressContainer = document.getElementById('progress-container');
    const progress = document.getElementById('progress');
    const volumeSlider = document.getElementById('volume-slider');
    const currentTimeDisplay = document.getElementById('current-time');
    const durationDisplay = document.getElementById('duration');
    const genreSelector = document.getElementById("genre-select");
    const backButton = document.getElementById('back-button-song');
    const reloadButton = document.getElementById('reload-button-song');
    let currentSongIndex = 0;
    let indexHistory = [];


    let songList = await fetchSongs(genreSelector.value);

    playSong(songList, currentSongIndex, shuffleisActive);
    indexHistory.push(currentSongIndex);


    playPauseButton.addEventListener('click', () => {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
            playPauseButton.classList.add('active'); // Add the CSS class to style it as active
        } else {
            audioPlayer.pause();
            playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
            playPauseButton.classList.remove('active'); // Add the CSS class to style it as active
        }
    });


    repeatButton.addEventListener('click', () => {
        repeatisActive = !repeatisActive; // Toggle the button state

        if (repeatisActive) {
            // Button is active
            repeatButton.classList.add('active'); // Add the CSS class to style it as active
            shuffleisActive = false;
            shuffleButton.classList.remove('active'); // Remove the CSS class to style it as not active

        } else {
            // Button is not active
            repeatButton.classList.remove('active'); // Remove the CSS class to style it as not active
        }

    });


    shuffleButton.addEventListener('click', () => {
        shuffleisActive = !shuffleisActive; // Toggle the button state

        if (shuffleisActive) {
            // Button is active
            shuffleButton.classList.add('active'); // Add the CSS class to style it as active
            repeatisActive = false;
            repeatButton.classList.remove('active'); // Remove the CSS class to style it as not active
            
        } else {
            // Button is not active
            shuffleButton.classList.remove('active'); // Remove the CSS class to style it as not active
        }

    });


    previousButton.addEventListener('click', () => {

        if (indexHistory.length > 0){
            currentSongIndex = indexHistory.pop();
        }else{currentSongIndex=0;}
        
        playSong(songList, currentSongIndex, shuffleisActive);
    });


    nextButton.addEventListener('click', () => {

        if(repeatisActive){
            playSong(songList, currentSongIndex, shuffleisActive);
        } else if (shuffleisActive){
            currentSongIndex = playSong(songList, currentSongIndex, shuffleisActive);
            indexHistory.push(currentSongIndex);
        }else {
            currentSongIndex<songList.length-1? currentSongIndex++ : currentSongIndex=0;
            indexHistory.push(currentSongIndex);
            playSong(songList, currentSongIndex, shuffleisActive);
        }
    });


    audioPlayer.addEventListener('ended', () => {


        if(repeatisActive){
            playSong(songList, currentSongIndex, shuffleisActive);
        } else if (shuffleisActive){
            currentSongIndex = playSong(songList, currentSongIndex, shuffleisActive);
            indexHistory.push(currentSongIndex);
        }else {
            currentSongIndex<songList.length-1? currentSongIndex++ : currentSongIndex=0;
            playSong(songList, currentSongIndex, shuffleisActive);
            indexHistory.push(currentSongIndex);
        }
        
    });


    volumeSlider.addEventListener('input', () => {
        audioPlayer.volume = volumeSlider.value;
    });


    audioPlayer.addEventListener('timeupdate', () => {
        const { currentTime, duration } = audioPlayer;
        progress.style.width = `${(currentTime / duration) * 100}%`;
        currentTimeDisplay.textContent = formatTime(currentTime);
        if (duration && !isNaN(duration)) {
            durationDisplay.textContent = formatTime(duration);
        }
    });


    audioPlayer.addEventListener('volumechange', () => {
        const volumeIcon = document.getElementById('volume-icon');
        if (audioPlayer.muted || audioPlayer.volume === 0) {
            volumeIcon.className = 'fas fa-volume-mute'; // Muted icon
        } else if (audioPlayer.volume < 0.5) {
            volumeIcon.className = 'fas fa-volume-down'; // Lower volume icon
        } else {
            volumeIcon.className = 'fas fa-volume-up'; // Higher volume icon
        }
    });


    progressContainer.addEventListener('click', (e) => {
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        audioPlayer.currentTime = (clickX / width) * audioPlayer.duration;
    });


    genreSelector.addEventListener('change', async() => {
        currentSongIndex = 0;
        songList = await fetchSongs(genreSelector.value);
        playSong(songList, currentSongIndex, shuffleisActive);
    });


    
    backButton.addEventListener("click", () => {
        window.location.hash = "#/";
    });

    
    reloadButton.addEventListener("click", () => {
        location.reload();
    });


    audioPlayer.addEventListener('volumechange', () => {
        const volumeIcon = document.getElementById('volume-icon');
        if (audioPlayer.muted || audioPlayer.volume === 0) {
            volumeIcon.className = 'fas fa-volume-mute'; // Muted icon
        } else if (audioPlayer.volume < 0.5) {
            volumeIcon.className = 'fas fa-volume-down'; // Lower volume icon
        } else {
            volumeIcon.className = 'fas fa-volume-up'; // Higher volume icon
        }
    });

    
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

};



// Function to fetch a random song from the Jamendo API
async function fetchSongs(genre) {

    try {

        const clientID = "9d4f449d";
        const limit = 80;
        
        let apiUrl = "";
        if(genre === "random"){
            apiUrl=`https://api.jamendo.com/v3.0/tracks/?client_id=${clientID}&limit=${limit}`;
        }else{
            apiUrl=`https://api.jamendo.com/v3.0/tracks/?client_id=${clientID}&limit=${limit}&tags=${genre}`;
        }

        const response = await fetch(apiUrl);
        const data = await response.json();

        return data.results;


    } catch (error) {
    console.error('Error:', error);
    }
    
}



function playSong(songList, currentSongIndex, shuffleisActive){

    let track;

    if(shuffleisActive){
        currentSongIndex = Math.floor(Math.random() * songList.length);
        track = songList[currentSongIndex];
    }

    track = songList[currentSongIndex];

    const artistName = document.getElementById("artist-name");
    const albumSongTitle = document.getElementById("album-song-title");
    const trackImage = document.getElementById("track-image");

    artistName.innerHTML = track.artist_name;
    albumSongTitle.innerHTML = track.album_name + " - " + track.name;
    
    trackImage.src=track.image;

    const audioPlayer = document.getElementById('player');
    audioPlayer.src = track.audio;
    // Auto-play the new song
    audioPlayer.play();

    document.getElementById('play-pause-button').innerHTML = '<i class="fas fa-pause"></i>';
    return currentSongIndex;

};







function renderSong(root) {


    root.innerHTML = `
        <div class="song-container">
            
            <div id="player-wrapper">
                <audio id="player"></audio>
                <div>
                    <label for="volume-slider"><i class="fas fa-volume-up" id="volume-icon"></i></label>
                    <input type="range" id="volume-slider" min="0" max="1" step="0.01" value="1">
                </div>
                <div>
                    <label for="genre-select">Genre:</label>
                    <select id="genre-select">
                        <option value="random">Random</option>
                        <option value="rock">Rock</option>
                        <option value="punk">Punk</option>
                        <option value="ska">Ska</option>
                        <option value="reggae">Reggae</option>
                        <option value="country">Country</option>
                        <option value="blues">Blues</option>
                        <option value="jazz">Jazz</option>
                        <option value="hiphop">HipHop/Rap</option>
                        <option value="classical">Classical</option>
                        <option value="electronic">Electronic</option>
                        <option value="techno">Techno</option>
                        <option value="trance">Trance</option>
                        <option value="disco">Disco</option>
                        <option value="ambient">Ambient</option>
                        <option value="dubstep">Dubstep</option>
                        <option value="chillout">Chillout</option>
                    </select>
                </div>
                    
                    
                <div class="song-info">
                    <div>
                        <img id="track-image" src="" alt="Track Image">
                    </div>
                    <h2 id="artist-name"></h2>
                    <h4 id="album-song-title"></h4>
                </div>
                <div class="song-buttons-container">
                    <button id="repeat-button" class="player-buttons active-buttons"><i class="fa-solid fa-repeat"></i></button>
                    <button id="previous-button" class="player-buttons"><i class="fas fa-backward"></i></button>
                    <button id="play-pause-button" class="player-buttons active-buttons"><i class="fas fa-play"></i></button>
                    <button id="next-button" class="player-buttons"><i class="fas fa-forward"></i></button>
                    <button id="random-button" class="player-buttons active-buttons"><i class="fa-solid fa-shuffle"></i></button>
                </div>

                <div id="progress-container">
                    <div id="progress"></div>
                </div>
                <div id="time-display">
                    <span id="current-time">0:00</span>
                    <span id="duration">0:00</span>
                </div>
                <div class="song-buttons-container">
                    <button id="back-button-song">Back</button>
                    <button id="reload-button-song">Reload</button>
                </div>
            </div>
        </div>`;
  
      
  }
