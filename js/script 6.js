// disable loop function added
// library things not yet solved

// wehn loop buton turned on , you cant tap on any other library items at all 


// circling album when last song done working
// when song is done, next song playing automatically, working even after songs are over

// LOOPING FEATURE (tick marks)
// 1. if i click on loop button song pausing
// 2. triabgles working
// 3. triangles pulling in mouse , and stopping too
// 4. triangles cant go over each other
// 5. while looping on, if i tap on another song in library, looping turns off 
// 6. when looping turn on , next and prev behaving right
// 7. WHILE SONG PLAYING IN LOOP, IF LOOP BUTTON IS TURNED OFF BOUNDARIES NOT CHANGING STAYING SAME AS LOOP , TRAINGLES FADING AWAY ITS FINE
// 


console.log("lets write java script");
// keeping this current song global to assuer that only 1 plays at a time
let currentSong = new Audio();
let songs;
let currfolder;

let isLooping = false;
    let isPlaying = false;


// Define the loop button and triangles globally
const loopButton = document.querySelector(".loop-button");
const loopTriangle1 = document.getElementById("loop-triangle1");
const loopTriangle2 = document.getElementById("loop-triangle2");

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs(folder) {
    console.log("Fetching songs from folder:", folder);  // Log the folder

    currfolder = folder;
    let a = await fetch(`/${folder}/`)
    // let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/`)
    let response = await a.text();
    console.log("Response from server:", response);  // Log the response

    let div = document.createElement("div");
    // console.log(response);

    div.innerHTML = response;
    let as = div.getElementsByTagName("a")

    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];

        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
            // here what you do is 
            // you take the thing which is after the /songs thats all
        }

    }
    console.log("Songs array:", songs);  // Log the songs array

    
    

    // show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = ""
    for (const song of songs) {
        // here you basically create a list in the inenr html to look like a good list


        songUL.innerHTML = songUL.innerHTML + `
        
        
        <li>
            <img class="invert" src="music.svg" alt="">

            <div class="info">
                <div>${song.replaceAll("%20", " ")}</div>
                <div>The BJV</div>
            </div>

            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="img/play.svg" alt="">
            </div>
        </li> 
    `
    }

    // attach an event listner to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            // looping shall be stopped if it is there
            // zzzzzzzzzzzzzzzzzzzzzzzzzzzzz
            if (isLooping)
            {
                disableLoop();
            }
                    
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
            //trim to remove the sapces if any in the beginning
        })
    })


    return songs;
}

//playMusic function

const playMusic = (track, pause = false) => {
    console.log("Playing track:", track);  // Log the track name
    // zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz
    if (isLooping)
        {
            disableLoop();
        }


    currentSong.src = `/${currfolder}/` + track
    if (!pause) {
        // if the song isnt paused ,then play it
        currentSong.play()
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}





async function displayAlbums() {
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
    
    if (e.href.includes("/songs")) {
        let folder = (e.href.split("/").slice(-2)[0]);

        // get the metadata of the folder
        let a = await fetch(`/songs/${folder}/info.json`)
        let response = await a.json();
        console.log(response);
        cardContainer.innerHTML = cardContainer.innerHTML + 
        `
        <div data-folder="${folder}" class="card">
            <div class="play">

                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                    fill="none" role="img">
                    <path d="M5 20V4L19 12L5 20Z" stroke="#000000" fill="#000" stroke-width="1.5"
                        stroke-linejoin="round"></path>
                </svg>
            </div>
            
            <img src="/songs/${folder}/cover.jpg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>
        `
    }
}

    // load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            // looping shall be stopped, if it is on
            if (isLooping)
                {
                    disableLoop();
                }
            // zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz
            console.log("Fetching song");
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0]);

        })
    })

    console.log(anchors);
}




async function main() {
    

    
    // Get the list of all the songs
    await getSongs("songs/ncs")
    playMusic(songs[0], true)
    
    
    // display all the albums on the page
    displayAlbums()
    
    
    
    
    
    
    
    // listen for time update event
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        
        // to move the circle on the line when the song plays and timechanges or updates
        document.querySelector(".circle").style.left = currentSong.currentTime / currentSong.duration * 100 + "%"
        
        
    })


    // add event listener to seek bar
    document.querySelector(".seekbar").addEventListener("click", e => {
        
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        //it gives the point where we touch
        
        
        // now we need to change the song time too
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    })
    
    
    // add and event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })
    
    // add and event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-125%";
    })
    
    
    
    // Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        // console.log("setting volume to ", e.target.value);
        currentSong.volume = parseInt(e.target.value) / 100;
        if(currentSong.volume > 0)
            {
                document.querySelector(".volume>img").target.src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg");
            }
        })
        

        // Add event listner to mute the track
        document.querySelector(".volume>img").addEventListener("click", e=>{
            
            if(e.target.src.includes("volume.svg")){
                e.target.src = e.target.src.replace("volume.svg","mute.svg");
                // e.target.src = "img/mute.svg";
                currentSong.volume = 0;
                document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
            }
            else
            {
                // e.target.src = e.target.src.replace("mute.svg", "volume.svg");
                e.target.src = e.target.src.replace("mute.svg", "volume.svg");
                currentSong.volume = 0.1;
                // e.target.src = "volume.svg";
                document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
                
            }
        })
        
        
        
        
        
        
        
        
        
        
        
        
        // loop concept starts here
        // loop concept starts here
        // loop concept starts here
        // loop concept starts here
    // loop concept starts here
    // loop concept starts here
    // loop concept starts here
    // Loop concept starts here
    
    const loopButton = document.querySelector(".loop-button");
    const loopTriangle1 = document.getElementById("loop-triangle1");
    const loopTriangle2 = document.getElementById("loop-triangle2");
    const playButton = document.getElementById("play"); // Keep id consistent
    // let isLooping = false;
    // let isPlaying = false;
    let loopStart = 0;
    let loopEnd = 0;
    
    // Initialize the loop range on song load
    currentSong.addEventListener("loadedmetadata", () => {
        loopEnd = currentSong.duration;
    });
    
    // Styling and toggling the loop button
    loopButton.addEventListener("click", () => {
        isLooping = !isLooping;
        
        if (isLooping) {
            // Enable looping feature
            loopButton.style.backgroundColor = "#fffefe";
            loopButton.style.color = "#000000";
            
            currentSong.pause();
            isPlaying = false;
            
            loopTriangle1.style.display = "block";
            loopTriangle2.style.display = "block";
            loopStart = 0;
            loopEnd = currentSong.duration || 0;
            
            playButton.src = "img/play.svg";
        } else {
            disableLoop();
        }
    });
    



    
    
    // Play button logic for loop
    playButton.addEventListener("click", () => {
        if (isLooping) {
            if (!isPlaying) {
                isPlaying = true;
                currentSong.currentTime = loopStart;
                currentSong.play();
                playButton.src = "img/pause.svg";
                
                currentSong.addEventListener("timeupdate", () => {
                    if (currentSong.currentTime >= loopEnd) {
                        currentSong.currentTime = loopStart;
                    }
                });
            } else {
                isPlaying = false;
                currentSong.pause();
                playButton.src = "img/play.svg";
            }
        } else {
            if (currentSong.paused) {
                currentSong.play();
                playButton.src = "img/pause.svg";
            } else {
                currentSong.pause();
                playButton.src = "img/play.svg";
            }
        }
    });
    
    // Triangle drag functionality
    [loopTriangle1, loopTriangle2].forEach((triangle) => {
        triangle.addEventListener("mousedown", startDragging);
        triangle.addEventListener("touchstart", startDragging);
        
        function startDragging(event) {
            event.preventDefault();
            const isTouch = event.type === "touchstart";
            const moveEvent = isTouch ? "touchmove" : "mousemove";
            const endEvent = isTouch ? "touchend" : "mouseup";
            
            function onMove(e) {
                const clientX = isTouch ? e.touches[0].clientX : e.clientX;
                let percent =
                ((clientX -
                    document.querySelector(".seekbar").getBoundingClientRect().left) /
                        document.querySelector(".seekbar").offsetWidth) *
                        100;

                        percent = Math.max(0, Math.min(100, percent));
                        
                        if (triangle === loopTriangle1) {
                            loopStart = (percent / 100) * currentSong.duration;
                            if (loopStart < loopEnd) setTrianglePosition(triangle, percent);
                } else {
                    loopEnd = (percent / 100) * currentSong.duration;
                    if (loopEnd > loopStart) setTrianglePosition(triangle, percent);
                }
            }
            
            function stopDragging() {
                document.removeEventListener(moveEvent, onMove);
                document.removeEventListener(endEvent, stopDragging);
            }

            document.addEventListener(moveEvent, onMove);
            document.addEventListener(endEvent, stopDragging);
        }
    });
    
    function setTrianglePosition(triangle, percent) {
        triangle.style.left = `${percent}%`;
    }
    
    // Handle previous button click
    previous.addEventListener("click", () => {
        if (isLooping) loopButton.click();
        
        currentSong.pause();
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if (index - 1 >= 0) {
            playMusic(songs[index - 1]);
        } else {
            playMusic(songs[songs.length - 1]);
        }
    });
    
    // Handle next button click
    next.addEventListener("click", () => {
        if (isLooping) loopButton.click();

        currentSong.pause();
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1]);
        } else {
            playMusic(songs[0]);
        }
    });

    // Automatically go to the next song on end
    currentSong.addEventListener("ended", () => {
        next.click();
    });
    
    // Loop concept ends here
    
    // loop concept ends here
    // loop concept ends here
    // loop concept ends here
    // loop concept ends here
    // loop concept ends here
    
}



const disableLoop = () => {
    console.log("Disabling loop...");
    isLooping = false;
    loopButton.style.backgroundColor = "#000000";
    loopButton.style.color = "#ffffff";

    loopTriangle1.style.display = "none";
    loopTriangle2.style.display = "none";
    loopStart = 0;
    loopEnd = currentSong.duration;

    // Reset triangle positions
    loopTriangle1.style.left = "0%";
    loopTriangle2.style.left = "99.5%";
};


main();

