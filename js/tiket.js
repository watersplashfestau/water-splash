"use strict";

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const ticketButtons =
            document.querySelectorAll(
                ".ticket-buy-button"
            );


        ticketButtons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function (event) {

                        const ticketId =
                            button.dataset.ticketId;


                        const liveData =
                            window.WATER_SPLASH_DATA;


                        const tickets =
                            liveData &&
                            Array.isArray(
                                liveData.tickets
                            )
                                ? liveData.tickets
                                : [];


                        const selectedTicket =
                            tickets.find(
                                function (ticket) {

                                    return (
                                        ticket.id ===
                                        ticketId
                                    );

                                }
                            );


                        // Kalau data Sheet belum sempat dimuat
                        // (misalnya API lambat/gagal), jangan blokir
                        // pembelian, biarkan link href default jalan.
                        if (!selectedTicket) {

                            return;

                        }


                        const status =
                            String(
                                selectedTicket.status ||
                                "AVAILABLE"
                            )
                                .trim()
                                .toUpperCase();


                        const remaining =
                            selectedTicket.remaining === undefined ||
                            selectedTicket.remaining === "" ||
                            selectedTicket.remaining === null
                                ? null
                                : Number(
                                    selectedTicket.remaining
                                );


                        const isSoldOut =
                            status === "SOLD_OUT" ||
                            (
                                remaining !== null &&
                                !Number.isNaN(remaining) &&
                                remaining <= 0
                            );


                        if (isSoldOut) {

                            event.preventDefault();

                            alert(
                                "This ticket is currently sold out."
                            );

                            return;

                        }


                        // Tidak perlu redirect manual.
                        // Biarkan <a href="checkout.html?ticket=..."> jalan normal,
                        // supaya query string ?ticket= tidak hilang.

                    }
                );

            }
        );

    }
);
