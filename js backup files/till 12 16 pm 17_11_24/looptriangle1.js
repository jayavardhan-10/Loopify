// loop feature working , for mouse
// triangles succesfully stopping 
// not stopping issue solved here
// didnt check for touch event yet










[loopTriangle1, loopTriangle2].forEach(triangle => {
    triangle.addEventListener("mousedown", startDragging);
    triangle.addEventListener("touchstart", startDragging);

    function startDragging(event) {
        event.preventDefault(); // Prevent unintended behaviors
        const isTouch = event.type === "touchstart";
        const moveEvent = isTouch ? "touchmove" : "mousemove";
        const endEvent = isTouch ? "touchend" : "mouseup";

        function onMove(e) {
            const clientX = isTouch ? e.touches[0].clientX : e.clientX;
            let percent = (clientX - document.querySelector(".seekbar").getBoundingClientRect().left) /
                document.querySelector(".seekbar").offsetWidth * 100;

            // Constrain the movement within the seekbar bounds
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
