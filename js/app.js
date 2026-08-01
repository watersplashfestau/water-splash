"use strict";


/* NAVIGATION */

const header =
    document.querySelector(".site-header");

const menuToggle =
    document.getElementById("menu-toggle");

const navMenu =
    document.getElementById("nav-menu");


window.addEventListener("scroll", function(){

    if(!header){

        return;

    }

    header.classList.toggle(
        "scrolled",
        window.scrollY > 30
    );

});


if(menuToggle && navMenu){

    menuToggle.addEventListener(
        "click",
        function(){

            navMenu.classList.toggle("active");

        }
    );

}



/* COUNTDOWN */

const countdownDate =
    new Date(
        "2026-08-15T10:00:00+08:00"
    ).getTime();


function updateCountdown(){

    const daysElement =
        document.getElementById("days");


    if(!daysElement){

        return;

    }


    const distance =
        countdownDate - Date.now();


    const safeDistance =
        Math.max(distance, 0);


    const days =
        Math.floor(
            safeDistance /
            (1000 * 60 * 60 * 24)
        );


    const hours =
        Math.floor(
            (
                safeDistance %
                (1000 * 60 * 60 * 24)
            ) /
            (1000 * 60 * 60)
        );


    const minutes =
        Math.floor(
            (
                safeDistance %
                (1000 * 60 * 60)
            ) /
            (1000 * 60)
        );


    const seconds =
        Math.floor(
            (
                safeDistance %
                (1000 * 60)
            ) /
            1000
        );


    document.getElementById("days").textContent =
        String(days).padStart(2, "0");

    document.getElementById("hours").textContent =
        String(hours).padStart(2, "0");

    document.getElementById("minutes").textContent =
        String(minutes).padStart(2, "0");

    document.getElementById("seconds").textContent =
        String(seconds).padStart(2, "0");

}


updateCountdown();

setInterval(
    updateCountdown,
    1000
);



/* BUBBLES */

const bubbleLayer =
    document.querySelector(".bubble-layer");


function createBubble(){

    if(!bubbleLayer){

        return;

    }


    const bubble =
        document.createElement("span");


    const size =
        Math.floor(
            Math.random() * 42
        ) + 14;


    const duration =
        Math.random() * 6 + 7;


    bubble.className =
        "floating-bubble";


    bubble.style.width =
        size + "px";

    bubble.style.height =
        size + "px";

    bubble.style.left =
        Math.random() * 100 + "%";

    bubble.style.animationDuration =
        duration + "s";


    bubbleLayer.appendChild(bubble);


    setTimeout(function(){

        bubble.remove();

    }, duration * 1000);

}


setInterval(
    createBubble,
    700
);



/* WATER RIPPLE */

document.addEventListener(
    "pointerdown",
    function(event){

        const ripple =
            document.createElement("span");


        ripple.className =
            "water-ripple";


        ripple.style.left =
            event.clientX + "px";

        ripple.style.top =
            event.clientY + "px";


        document.body.appendChild(ripple);


        setTimeout(function(){

            ripple.remove();

        }, 750);

    }
);