document.querySelector(".loop-button").addEventListener("click",(e)=>{
    console.log("loop clicked");

    // playing song shall be paused
    if (currentSong.played) {
        currentSong.pause();
        play.src = "img/play.svg";
    }
    e.preventDefault();
    // playMusic.pause();
    document.querySelector(".seekbar").innerHTML += `
        <img src="img/triangle.svg" id="loop-triangle1"  alt="">
        <img src="img/triangle.svg" id="loop-triangle2"  alt="">
    `
})







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



























const loopButton = document.querySelector(".loop-button");
    const loopTriangle1 = document.getElementById("loop-triangle1");
    const loopTriangle2 = document.getElementById("loop-triangle2");
    let isLooping = false;
    let loopStart = 0;
    let loopEnd = currentSong.duration || 0;

    // Show triangles and allow dragging
    loopButton.addEventListener("click", () => {
        isLooping = !isLooping;

        if (isLooping) {
            // Show the triangles and set to seekbar boundaries
            loopTriangle1.style.display = "block";
            loopTriangle2.style.display = "block";
            loopStart = 0;
            loopEnd = currentSong.duration || 0;
            currentSong.pause();
            play.src = "img/play.svg";
        } else {
            // Hide triangles and reset looping
            loopTriangle1.style.display = "none";
            loopTriangle2.style.display = "none";
            loopStart = 0;
            loopEnd = currentSong.duration;
        }
    });

    function setTrianglePosition(triangle, percent) {
        triangle.style.left = `${percent}%`;
    }

    function getSeekbarPosition(event, seekbar) {
        return (event.clientX - seekbar.getBoundingClientRect().left) / seekbar.offsetWidth * 100;
    }

    // Add drag functionality to triangles
    [loopTriangle1, loopTriangle2].forEach(triangle => {
        triangle.addEventListener("mousedown", () => {
            function onMouseMove(e) {
                let percent = getSeekbarPosition(e, document.querySelector(".seekbar"));
                if (triangle === loopTriangle1) {
                    loopStart = (percent / 100) * currentSong.duration;
                    if (loopStart < loopEnd) setTrianglePosition(triangle, percent);
                } else {
                    loopEnd = (percent / 100) * currentSong.duration;
                    if (loopEnd > loopStart) setTrianglePosition(triangle, percent);
                }
            }

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", () => {
                document.removeEventListener("mousemove", onMouseMove);
            }, { once: true });
        });
    });

    // Play button logic to handle loop
    document.getElementById("play").addEventListener("click", () => {
        if (!isLooping) {
            currentSong.play();
            play.src = "img/pause.svg";
        } else {
            // Play from loop start and loop within the selected range
            currentSong.currentTime = loopStart;
            currentSong.play();
            play.src = "img/pause.svg";

            currentSong.addEventListener("timeupdate", () => {
                if (currentSong.currentTime >= loopEnd) {
                    currentSong.currentTime = loopStart;
                }
            });
        }
    });

    // Handle next button (exit loop if clicked)
    document.getElementById("next").addEventListener("click", () => {
        isLooping = false;
        loopTriangle1.style.display = "none";
        loopTriangle2.style.display = "none";
        currentSong.currentTime = 0; // Start the next song normally
    });




























    const playButton = document.getElementById("play");

    // Toggle play/pause functionality
    playButton.addEventListener("click", () => {
        if (currentSong.paused) {
            // Start playing
            currentSong.play();
            playButton.src = "img/pause.svg"; // Change icon to pause
    
            // If in loop mode, ensure looping within the set range
            if (isLooping) {
                currentSong.addEventListener("timeupdate", checkLooping);
            } else {
                // Remove loop listener if not looping
                currentSong.removeEventListener("timeupdate", checkLooping);
            }
        } else {
            // Pause if already playing
            currentSong.pause();
            playButton.src = "img/play.svg"; // Change icon to play
        }
    });
    
    // Function to check if looping is enabled and adjust playback
    function checkLooping() {
        if (isLooping && currentSong.currentTime >= loopEnd) {
            currentSong.currentTime = loopStart; // Loop back to the start point
        }
    }
    
    // Loop button logic (to set up loop points)
    document.querySelector(".loop-button").addEventListener("click", (e) => {
        e.preventDefault();
        
        // Toggle loop mode
        isLooping = !isLooping;
    
        // Update UI to indicate loop mode
        if (isLooping) {
            // Add loop indicators and pause the song to set loop points
            currentSong.pause();
            playButton.src = "img/play.svg";
            document.querySelector(".seekbar").innerHTML += `
                <img src="img/triangle.svg" id="loop-triangle1"  alt="">
                <img src="img/triangle.svg" id="loop-triangle2"  alt="">
            `;
        } else {
            // Remove loop indicators and disable looping
            document.getElementById("loop-triangle1").remove();
            document.getElementById("loop-triangle2").remove();
        }
    });