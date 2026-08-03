"use strict";


document.addEventListener(
    "DOMContentLoaded",
    function () {

        const ticketCatalog = {

            "splash-pass": {

                id:
                    "splash-pass",

                code:
                    "SPL",

                name:
                    "Splash Pass",

                description:
                    "Festival access with official Water Splash slayer.",

                price:
                    1500000,

                admissions:
                    1,

                stock:
                    100

            },


            "wave-vip": {

                id:
                    "wave-vip",

                code:
                    "VIP",

                name:
                    "Wave VIP",

                description:
                    "Exclusive festival access with VIP privileges.",

                price:
                    3500000,

                admissions:
                    1,

                stock:
                    100

            },


            "ocean-vvip": {

                id:
                    "ocean-vvip",

                code:
                    "VVIP",

                name:
                    "Ocean VVIP",

                description:
                    "The most exclusive Water Splash experience.",

                price:
                    5500000,

                admissions:
                    1,

                stock:
                    100

            },


            "splash-squad": {

                id:
                    "splash-squad",

                code:
                    "SQUAD",

                name:
                    "Splash Squad",

                description:
                    "Five General Admission tickets in one package.",

                price:
                    12000000,

                admissions:
                    5,

                stock:
                    100

            }

        };


        const ticketButtons =
            document.querySelectorAll(
                ".ticket-buy-button"
            );


        ticketButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const ticketId =
                            button.dataset.ticketId;


                        const selectedTicket =
                            ticketCatalog[ticketId];


                        if (!selectedTicket) {

                            alert(
                                "Ticket data could not be found."
                            );

                            return;

                        }


                        if (selectedTicket.stock <= 0) {
                        
                            alert("This ticket is currently sold out.");
                        
                            return;
                        
                        }


                        localStorage.setItem(
                            "selectedTicket",
                            JSON.stringify(
                                selectedTicket
                            )
                        );


                        window.location.href =
                            "./checkout.html";

                    }
                );

            }
        );

    }
);
