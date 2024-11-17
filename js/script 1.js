    console.log("lets write java scripr");
// keeping this current song global to assuer that only 1 plays at a time
let currentSong = new Audio();
let songs;
let currfolder;

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
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
            //trim to remove the sapces if any in the beginning
        })
    })


    return songs;
}

//playMusic function

const playMusic = (track, pause = false) => {
    console.log("Playing track:", track);  // Log the track name

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



    const loopButton = document.querySelector(".loop-button");
    const loopTriangle1 = document.getElementById("loop-triangle1");
    const loopTriangle2 = document.getElementById("loop-triangle2");
    let isLooping = false;
    let loopStart = 0;
    let isPlaying = false;
    let loopEnd = currentSong.duration || 0;

    

    // Show triangles and allow dragging
    loopButton.addEventListener("click", () => {
        // isLooping = !isLooping; //looping becomes true now

        // styling loop button
        loopButton.style.padding = "5px 10px";
        loopButton.style.border = "none";
        loopButton.style.borderRadius = "3px";
        loopButton.style.fontWeight = "bold";
        loopButton.style.backgroundColor = "#fffefe";
        loopButton.style.color = "#000000";
        loopButton.style.transition = "all 0.2s";



        if(isLooping == false)
        {


            // enable looping feature
            isLooping = true;
            
            currentSong.pause();
            isPlaying = false;
            
            // Show the triangles and set to seekbar boundaries
            loopTriangle1.style.display = "block";
            loopTriangle2.style.display = "block";
            loopStart = 0;
            loopEnd = currentSong.duration || 0;
            
                
            
            const loopButton = document.querySelector(".loop-button");
            const playButton = document.querySelector("#play");
            if (playButton.id === "play") {
                playButton.id = "play1";  // Change the id to 'play1'
            }

            const play1 = document.getElementById("play1");

            // song stopped so the iamge also is of stop
            play1.src = "img/play.svg"
            
            // Play button logic to handle loop
            play1.addEventListener("click", () => {
                if (isLooping == true) {
                    
                    // looping enabled
                    //song is not played yet , now you will play
                    if(isPlaying == false)
                        {
                            isPlaying = true;
                            // Play from loop start and loop within the selected range
                            currentSong.currentTime = loopStart;
                            currentSong.play();
                            play1.src = "img/pause.svg";
                            
                            currentSong.addEventListener("timeupdate", () => {
                                if (currentSong.currentTime >= loopEnd) {
                                    currentSong.currentTime = loopStart;
                                }
                            });
                        }
                        else if(isPlaying == true)
                            {
                                isPlaying = false;
                                currentSong.pause();
                                play1.src = "img/play.svg";
                            }
                        }
                    });
            
        } //if(isLooping == false) //ENDED HERE
        
        // is islooping is enabled, now disable it
        else if(isLooping == true) {



            loopButton.style.padding = "5px 10px";
            loopButton.style.border = "none";
            loopButton.style.borderRadius = "3px";
            loopButton.style.fontWeight = "normal";
            loopButton.style.backgroundColor = "#000000";
            loopButton.style.color = "#ffffff";
            loopButton.style.transition = "all 0.2s";

            if(isPlaying==true || isPlaying==false)
            {

                isLooping = false;
                currentSong.pause();
                isPlaying = false;
    
                // Hide triangles and reset looping
                loopTriangle1.style.display = "none";
                loopTriangle2.style.display = "none";
                loopStart = 0;
                loopEnd = currentSong.duration;
    
                // REVERT THE DEFAULT POSITIONS OF THE TRIANGLE
                loopTriangle1.style.left = "0%" ;
                loopTriangle2.style.left = "99.5%" ;
    
    
                //change the pause button to the normal id play....
                const playButton = document.querySelector("#play1");
                playButton.id = "play";  // REVERT THE CHANGE BUTTON TO 'play'
    
    
                // playbutton play pause functionality
                // attach an event listner to play & pause
            }
        }
    });

    // playbutton play pause functionality
    // attach an event listner to play & pause
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "img/pause.svg";
        }
        else {
            currentSong.pause();
            play.src = "img/play.svg";
        }
    })
            
    function setTrianglePosition(triangle, percent) {
        triangle.style.left = `${percent}%`;
    }

    function getSeekbarPosition(event, seekbar) {
        return (event.clientX - seekbar.getBoundingClientRect().left) / seekbar.offsetWidth * 100;
    }

    // // Add drag functionality to triangles
    // [loopTriangle1, loopTriangle2].forEach(triangle => {
    //     triangle.addEventListener("mousedown", () => {
    //         function onMouseMove(e) {
    //             let percent = getSeekbarPosition(e, document.querySelector(".seekbar"));
    //             if (triangle === loopTriangle1) {
    //                 loopStart = (percent / 100) * currentSong.duration;
    //                 if (loopStart < loopEnd) setTrianglePosition(triangle, percent);
    //             } else {
    //                 loopEnd = (percent / 100) * currentSong.duration;
    //                 if (loopEnd > loopStart) setTrianglePosition(triangle, percent);
    //             }
    //         }

    //         document.addEventListener("mousemove", onMouseMove);
    //         document.addEventListener("mouseup", () => {
    //             document.removeEventListener("mousemove", onMouseMove);
    //         }, { once: true });
    //     });
    // });


    [loopTriangle1, loopTriangle2].forEach(triangle => {
        function onMove(e) {
            const clientX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
            let percent = (clientX - document.querySelector(".seekbar").getBoundingClientRect().left) / document.querySelector(".seekbar").offsetWidth * 100;
            
            if (triangle === loopTriangle1) {
                loopStart = (percent / 100) * currentSong.duration;
                if (loopStart < loopEnd) setTrianglePosition(triangle, percent);
            } else {
                loopEnd = (percent / 100) * currentSong.duration;
                if (loopEnd > loopStart) setTrianglePosition(triangle, percent);
            }
        }
    
        triangle.addEventListener("mousedown", () => {
            document.addEventListener("mousemove", onMove);z
            document.addEventListener("mouseup", () => {
                document.removeEventListener("mousemove", onMove);
            }, { once: true });
        });
    
        triangle.addEventListener("touchstart", () => {
            document.addEventListener("touchmove", onMove);
            document.addEventListener("touchend", () => {
                document.removeEventListener("touchmove", onMove);
            }, { once: true });
        });
    });

    

    

    



    // add event listeners for previous LOOP LOGIC ALSO KEPT HERE
    previous.addEventListener("click", () => {

        if(isLooping == true)
        {
            loopButton.click();
            // isLooping = false;
            // loopTriangle1.style.display = "none";
            // loopTriangle2.style.display = "none";
            // currentSong.currentTime = 0; // Start the prev song normally
        }

        currentSong.pause();
        console.log("previous clicked");
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if (index - 1 >= 0) {

            // to play the previouz song when tapped
            playMusic(songs[index - 1]);
        }
        else{
            // If it's the first song, loop back to the last song
            playMusic(songs[songs.length -1 ]);
        }
    })

    // add event listeners for next
    next.addEventListener("click", () => {

        if(isLooping == true)
        {
            loopButton.click();
            // isLooping = false;
            // loopTriangle1.style.display = "none";
            // loopTriangle2.style.display = "none";
            // currentSong.currentTime = 0; // Start the next song normally
        }
        currentSong.pause();
        console.log("next clicked");


        // knowing the index of the present song
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])

        if (index + 1 < songs.length) {

            // to play the next song when tapped
            playMusic(songs[index + 1]);
        }

        else{
            // If it's the last song, loop back to the first song
            playMusic(songs[0]);
        }
    })

    currentSong.addEventListener("ended", () => {
        console.log("Song ended, moving to next song...");
        
        // Simulate the next button click
        next.click();
    });










    







    
    // loop concept ends here
    // loop concept ends here
    // loop concept ends here
    // loop concept ends here
    // loop concept ends here



// loop concept ends here
// loop concept ends here
// loop concept ends here
// loop concept ends here
// loop concept ends here

}





main();

