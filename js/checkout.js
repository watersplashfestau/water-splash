"use strict";


const TAX_RATE =
    0.10;

const SERVICE_RATE =
    0.05;

const HANDLING_FEE =
    15000;


let quantity =
    1;

let selectedTicket =
    null;



function getTicketIdFromUrl() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    return params.get(
        "ticket"
    );

}



function findTicketFromLiveData() {

    const ticketId =
        getTicketIdFromUrl();


    if (!ticketId) {

        return null;

    }


    const liveData =
        window.WATER_SPLASH_DATA;


    const tickets =
        liveData &&
        Array.isArray(
            liveData.tickets
        )
            ? liveData.tickets
            : [];


    return (
        tickets.find(
            function (ticket) {

                return (
                    ticket.id ===
                    ticketId
                );

            }
        ) || null
    );

}



function formatRupiah(value) {

    return new Intl.NumberFormat(
        "id-ID",
        {
            style:
                "currency",

            currency:
                "IDR",

            maximumFractionDigits:
                0
        }
    ).format(value);

}



function calculateOrder() {

    const price =
        Number(
            selectedTicket.price ||
            0
        );


    const subtotal =
        price *
        quantity;


    const tax =
        Math.round(
            subtotal *
            TAX_RATE
        );


    const service =
        Math.round(
            subtotal *
            SERVICE_RATE
        );


    const total =
        subtotal +
        tax +
        service +
        HANDLING_FEE;


    return {

        subtotal,
        tax,
        service,
        total

    };

}



function updateCheckout() {

    const calculation =
        calculateOrder();


    document
        .getElementById(
            "summary-ticket-name"
        )
        .textContent =
        selectedTicket.name;


    document
        .getElementById(
            "summary-ticket-description"
        )
        .textContent =
        selectedTicket.description;


    document
        .getElementById(
            "summary-ticket-price"
        )
        .textContent =
        formatRupiah(
            Number(
                selectedTicket.price ||
                0
            )
        );


    document
        .getElementById(
            "quantity-value"
        )
        .textContent =
        quantity;


    document
        .getElementById(
            "subtotal-value"
        )
        .textContent =
        formatRupiah(
            calculation.subtotal
        );


    document
        .getElementById(
            "tax-value"
        )
        .textContent =
        formatRupiah(
            calculation.tax
        );


    document
        .getElementById(
            "service-value"
        )
        .textContent =
        formatRupiah(
            calculation.service
        );


    document
        .getElementById(
            "handling-value"
        )
        .textContent =
        formatRupiah(
            HANDLING_FEE
        );


    document
        .getElementById(
            "total-value"
        )
        .textContent =
        formatRupiah(
            calculation.total
        );

}



function generateOrderId() {

    return (
        "WS-260815-" +
        Date.now()
            .toString()
            .slice(-8)
    );

}



function setupHandlers() {

    document
        .getElementById(
            "quantity-minus"
        )
        .addEventListener(
            "click",
            function () {

                if (quantity > 1) {

                    quantity -= 1;

                    updateCheckout();

                }

            }
        );


    document
        .getElementById(
            "quantity-plus"
        )
        .addEventListener(
            "click",
            function () {

                if (quantity < 10) {

                    quantity += 1;

                    updateCheckout();

                }

            }
        );


    document
        .getElementById(
            "checkout-form"
        )
        .addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const nameInput =
                    document.getElementById(
                        "customer-name"
                    );


                const emailInput =
                    document.getElementById(
                        "customer-email"
                    );


                const phoneInput =
                    document.getElementById(
                        "customer-phone"
                    );


                const agreement =
                    document.getElementById(
                        "agreement"
                    );


                const message =
                    document.getElementById(
                        "checkout-form-message"
                    );


                const name =
                    nameInput.value.trim();


                const email =
                    emailInput.value.trim();


                const phone =
                    phoneInput.value.trim();


                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                document
                    .getElementById(
                        "name-error"
                    )
                    .textContent =
                    "";


                document
                    .getElementById(
                        "email-error"
                    )
                    .textContent =
                    "";


                message.textContent =
                    "";


                let valid =
                    true;


                if (name.length < 2) {

                    document
                        .getElementById(
                            "name-error"
                        )
                        .textContent =
                        "Please enter your full name.";

                    valid =
                        false;

                }


                if (!emailPattern.test(email)) {

                    document
                        .getElementById(
                            "email-error"
                        )
                        .textContent =
                        "Please enter a valid email.";

                    valid =
                        false;

                }


                if (!agreement.checked) {

                    message.textContent =
                        "Please confirm the roleplay agreement.";

                    valid =
                        false;

                }


                if (!valid) {

                    return;

                }


                const calculation =
                    calculateOrder();


                const paymentMethod =
                    document
                        .querySelector(
                            'input[name="payment-method"]:checked'
                        )
                        .value;


                const admissionsPerTicket =
                    Math.max(
                        1,
                        Number(
                            selectedTicket.admissions ||
                            1
                        )
                    );


                const orderData = {

                    orderId:
                        generateOrderId(),

                    name:
                        name,

                    email:
                        email,

                    phone:
                        phone ||
                        "Not provided",

                    ticket:
                        selectedTicket,

                    quantity:
                        quantity,

                    admissionCount:
                        quantity *
                        admissionsPerTicket,

                    paymentMethod:
                        paymentMethod,

                    subtotal:
                        calculation.subtotal,

                    tax:
                        calculation.tax,

                    service:
                        calculation.service,

                    handling:
                        HANDLING_FEE,

                    total:
                        calculation.total

                };


                localStorage.setItem(
                    "orderData",
                    JSON.stringify(
                        orderData
                    )
                );


                window.location.href =
                    "confirmation.html";

            }
        );

}



function initCheckout() {

    selectedTicket =
        findTicketFromLiveData();


    if (!selectedTicket) {

        window.location.replace(
            "tiket.html"
        );

        return;

    }


    setupHandlers();

    updateCheckout();

}



// Data Sheet dimuat secara async oleh sheet-control.js.
// Kalau sudah tersedia saat file ini jalan, langsung pakai.
// Kalau belum, tunggu event "waterSplashDataLoaded".
if (window.WATER_SPLASH_DATA) {

    initCheckout();

} else {

    document.addEventListener(
        "waterSplashDataLoaded",
        initCheckout,
        { once: true }
    );

}
