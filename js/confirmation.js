"use strict";


document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "Water Splash confirmation connected"
        );


        initializeConfirmationPage();

    }
);



/* =========================================================
   INITIALIZE CONFIRMATION PAGE
========================================================= */

function initializeConfirmationPage() {

    try {

        const rawOrder =
            readSavedOrder();


        if (!rawOrder) {

            showConfirmationError(
                "Data pesanan tidak ditemukan. Silakan pilih tiket dan lakukan checkout kembali."
            );

            return;

        }


        const order =
            normalizeOrderData(
                rawOrder
            );


        order.ticketIds =
            prepareTicketIds(
                rawOrder.ticketIds,
                order
            );


        saveNormalizedOrder(
            rawOrder,
            order
        );


        renderOrderSummary(
            order
        );


        renderTicketList(
            order
        );


        connectActionButtons(
            order
        );

    } catch (error) {

        console.error(
            "Confirmation page error:",
            error
        );


        showConfirmationError(
            "Terjadi kesalahan saat membuat e-ticket: " +
            error.message
        );

    }

}



/* =========================================================
   READ SAVED ORDER
========================================================= */

function readSavedOrder() {

    const possibleKeys = [

        "orderData",

        "waterSplashOrder",

        "checkoutData",

        "confirmedOrder"

    ];


    for (
        let index = 0;
        index < possibleKeys.length;
        index++
    ) {

        const storageKey =
            possibleKeys[index];


        const storedValue =
            localStorage.getItem(
                storageKey
            );


        if (!storedValue) {

            continue;

        }


        try {

            const parsedValue =
                JSON.parse(
                    storedValue
                );


            if (
                parsedValue &&
                typeof parsedValue ===
                "object"
            ) {

                return parsedValue;

            }

        } catch (error) {

            console.warn(
                "Data localStorage tidak bisa dibaca:",
                storageKey
            );

        }

    }


    /*
        Fallback jika checkout sebelumnya
        memakai nama localStorage yang berbeda.
    */

    for (
        let index = 0;
        index < localStorage.length;
        index++
    ) {

        const storageKey =
            localStorage.key(
                index
            );


        const storedValue =
            localStorage.getItem(
                storageKey
            );


        if (!storedValue) {

            continue;

        }


        try {

            const parsedValue =
                JSON.parse(
                    storedValue
                );


            if (
                parsedValue &&
                typeof parsedValue ===
                "object" &&
                (
                    parsedValue.ticket ||
                    parsedValue.selectedTicket ||
                    parsedValue.orderId ||
                    parsedValue.customer ||
                    parsedValue.email ||
                    parsedValue.total
                )
            ) {

                return parsedValue;

            }

        } catch (error) {

            /*
                Abaikan isi localStorage
                yang bukan format JSON.
            */

        }

    }


    return null;

}



/* =========================================================
   NORMALIZE ORDER DATA
========================================================= */

function normalizeOrderData(
    rawOrder
) {

    const rawTicket =
        rawOrder.ticket ||
        rawOrder.selectedTicket ||
        {};


    const ticket =
        normalizeTicketData(
            rawTicket
        );


    const quantity =
        getValidNumber(
            rawOrder.quantity ||
            rawOrder.units ||
            rawTicket.units ||
            1,
            1
        );


    const admissionsPerPackage =
        getValidNumber(
            rawTicket.admissions ||
            rawTicket.admissionsPerUnit ||
            getDefaultAdmissions(
                ticket.id
            ),
            getDefaultAdmissions(
                ticket.id
            )
        );


    let totalTickets =
        getValidNumber(
            rawOrder.admissionCount ||
            rawOrder.totalTickets ||
            rawTicket.admissionCount,
            0
        );


    if (
        totalTickets < 1
    ) {

        totalTickets =
            quantity *
            admissionsPerPackage;

    }


    /*
        Mencegah data yang rusak
        membuat tiket terlalu banyak.
    */

    totalTickets =
        Math.min(
            Math.max(
                Math.floor(
                    totalTickets
                ),
                1
            ),
            50
        );


    const ticketPrice =
        getValidNumber(
            rawTicket.price,
            0
        );


    let totalPayment =
        getValidNumber(
            rawOrder.total ||
            rawOrder.totalPayment ||
            rawOrder.grandTotal ||
            (
                rawOrder.fees &&
                rawOrder.fees.grandTotal
            ),
            0
        );


    if (
        totalPayment < 1 &&
        ticketPrice > 0
    ) {

        totalPayment =
            ticketPrice *
            quantity;

    }


    const customerName =
        rawOrder.name ||
        rawOrder.fullName ||
        (
            rawOrder.customer &&
            rawOrder.customer.name
        ) ||
        "Water Splash Guest";


    const customerEmail =
        rawOrder.email ||
        rawOrder.customerEmail ||
        (
            rawOrder.customer &&
            rawOrder.customer.email
        ) ||
        "Email not provided";


    const orderId =
        rawOrder.orderId ||
        rawOrder.id ||
        generateOrderId();


    return {

        orderId:
            String(
                orderId
            ),

        name:
            String(
                customerName
            ),

        email:
            String(
                customerEmail
            ),

        quantity:
            quantity,

        totalTickets:
            totalTickets,

        total:
            totalPayment,

        ticket:
            ticket,

        ticketIds:
            []

    };

}



/* =========================================================
   NORMALIZE TICKET DATA
========================================================= */

function normalizeTicketData(
    rawTicket
) {

    let ticketName =
        "Splash Pass";


    let ticketId =
        "splash-pass";


    if (
        typeof rawTicket ===
        "string"
    ) {

        ticketName =
            rawTicket;


        ticketId =
            getTicketIdFromName(
                rawTicket
            );

    } else if (
        rawTicket &&
        typeof rawTicket ===
        "object"
    ) {

        ticketName =
            rawTicket.name ||
            rawTicket.title ||
            rawTicket.ticketName ||
            "Splash Pass";


        ticketId =
            rawTicket.id ||
            rawTicket.ticketId ||
            getTicketIdFromName(
                ticketName
            );

    }


    ticketId =
        normalizeTicketId(
            ticketId,
            ticketName
        );


    return {

        id:
            ticketId,

        name:
            ticketName,

        code:
            getTicketCode(
                ticketId
            )

    };

}



function normalizeTicketId(
    ticketId,
    ticketName
) {

    const validTicketIds = [

        "splash-pass",

        "wave-vip",

        "ocean-vvip",

        "splash-squad"

    ];


    const normalizedId =
        String(
            ticketId || ""
        )
            .toLowerCase()
            .trim();


    if (
        validTicketIds.includes(
            normalizedId
        )
    ) {

        return normalizedId;

    }


    return getTicketIdFromName(
        ticketName
    );

}



function getTicketIdFromName(
    ticketName
) {

    const normalizedName =
        String(
            ticketName || ""
        )
            .toLowerCase()
            .trim();


    if (
        normalizedName.includes(
            "ocean"
        ) ||
        normalizedName.includes(
            "vvip"
        )
    ) {

        return "ocean-vvip";

    }


    if (
        normalizedName.includes(
            "wave"
        ) ||
        normalizedName.includes(
            "vip"
        )
    ) {

        return "wave-vip";

    }


    if (
        normalizedName.includes(
            "squad"
        )
    ) {

        return "splash-squad";

    }


    return "splash-pass";

}



function getDefaultAdmissions(
    ticketId
) {

    if (
        ticketId ===
        "splash-squad"
    ) {

        return 5;

    }


    return 1;

}



function getTicketCode(
    ticketId
) {

    const ticketCodes = {

        "splash-pass":
            "SPL",

        "wave-vip":
            "VIP",

        "ocean-vvip":
            "VVIP",

        "splash-squad":
            "SQUAD"

    };


    return (
        ticketCodes[ticketId] ||
        "WS"
    );

}



/* =========================================================
   TICKET DISPLAY INFORMATION
========================================================= */

function getTicketDisplayName(
    ticketId
) {

    const ticketNames = {

        "splash-pass":
            "SPLASH PASS",

        "wave-vip":
            "WAVE VIP",

        "ocean-vvip":
            "OCEAN VVIP",

        "splash-squad":
            "SPLASH SQUAD"

    };


    return (
        ticketNames[ticketId] ||
        "WATER SPLASH"
    );

}



function getTicketAccess(
    ticketId
) {

    const ticketAccessList = {

        "splash-pass":
            "GENERAL SPLASH ZONE",

        "wave-vip":
            "VIP WAVE ZONE",

        "ocean-vvip":
            "OCEAN VVIP LOUNGE",

        "splash-squad":
            "GENERAL SPLASH ZONE"

    };


    return (
        ticketAccessList[ticketId] ||
        "FESTIVAL ACCESS"
    );

}



function getTicketTheme(
    ticketId
) {

    const ticketThemes = {

        "splash-pass":
            "ticket-theme-splash",

        "wave-vip":
            "ticket-theme-vip",

        "ocean-vvip":
            "ticket-theme-vvip",

        "splash-squad":
            "ticket-theme-squad"

    };


    return (
        ticketThemes[ticketId] ||
        "ticket-theme-splash"
    );

}



/* =========================================================
   ORDER AND TICKET ID
========================================================= */

function generateOrderId() {

    return (
        "WS-260815-" +
        Date.now()
            .toString()
            .slice(-8)
    );

}



function prepareTicketIds(
    savedTicketIds,
    order
) {

    if (
        Array.isArray(
            savedTicketIds
        ) &&
        savedTicketIds.length ===
        order.totalTickets
    ) {

        return savedTicketIds.map(
            function (
                ticketId
            ) {

                return String(
                    ticketId
                );

            }
        );

    }


    return Array.from(
        {
            length:
                order.totalTickets
        },
        function (
            unusedValue,
            index
        ) {

            return generateTicketId(
                order.ticket.code,
                index
            );

        }
    );

}



function generateTicketId(
    ticketCode,
    index
) {

    const randomNumber =
        Math.floor(
            Math.random() *
            900000 +
            100000
        );


    const sequence =
        String(
            index + 1
        )
            .padStart(
                2,
                "0"
            );


    return (
        "WS26-" +
        ticketCode +
        "-" +
        randomNumber +
        "-" +
        sequence
    );

}



/* =========================================================
   SAVE NORMALIZED ORDER
========================================================= */

function saveNormalizedOrder(
    rawOrder,
    order
) {

    const previousTicketData =

        rawOrder.ticket &&
        typeof rawOrder.ticket ===
        "object"

            ? rawOrder.ticket

            : {};


    const updatedOrder = {

        ...rawOrder,

        orderId:
            order.orderId,

        name:
            order.name,

        email:
            order.email,

        quantity:
            order.quantity,

        admissionCount:
            order.totalTickets,

        totalTickets:
            order.totalTickets,

        total:
            order.total,

        ticketIds:
            order.ticketIds,

        ticket: {

            ...previousTicketData,

            id:
                order.ticket.id,

            code:
                order.ticket.code,

            name:
                order.ticket.name,

            admissions:
                getDefaultAdmissions(
                    order.ticket.id
                )

        }

    };


    localStorage.setItem(
        "orderData",
        JSON.stringify(
            updatedOrder
        )
    );

}



/* =========================================================
   RENDER ORDER SUMMARY
========================================================= */

function renderOrderSummary(
    order
) {

    setElementText(
        "order-id",
        order.orderId
    );


    setElementText(
        "order-name",
        order.name
    );


    setElementText(
        "order-ticket",
        getTicketDisplayName(
            order.ticket.id
        )
    );


    setElementText(
        "order-total-tickets",
        order.totalTickets +
        (
            order.totalTickets > 1
                ? " Tickets"
                : " Ticket"
        )
    );


    setElementText(
        "order-total-payment",
        formatRupiah(
            order.total
        )
    );


    /*
        Menampilkan alamat email
        di bagian email confirmation.
    */

    setElementText(
        "confirmation-email",
        order.email ||
        "Email not provided"
    );

}



/* =========================================================
   RENDER TICKET LIST
========================================================= */

function renderTicketList(
    order
) {

    const ticketList =
        document.getElementById(
            "ticket-list"
        );


    if (!ticketList) {

        throw new Error(
            "Elemen ticket-list tidak ditemukan."
        );

    }


    const ticketName =
        getTicketDisplayName(
            order.ticket.id
        );


    const ticketAccess =
        getTicketAccess(
            order.ticket.id
        );


    const ticketTheme =
        getTicketTheme(
            order.ticket.id
        );


    ticketList.innerHTML =
        order.ticketIds
            .map(
                function (
                    ticketId,
                    index
                ) {

                    return createTicketHTML(
                        ticketName,
                        ticketAccess,
                        ticketTheme,
                        ticketId,
                        index
                    );

                }
            )
            .join("");


    order.ticketIds.forEach(
        function (
            ticketId,
            index
        ) {

            renderQRCode(
                order,
                ticketId,
                index
            );

        }
    );

}



/* =========================================================
   CREATE TICKET HTML
========================================================= */

function createTicketHTML(
    ticketName,
    ticketAccess,
    ticketTheme,
    ticketId,
    index
) {

    const sequence =
        String(
            index + 1
        )
            .padStart(
                2,
                "0"
            );


    return `
        <article
            class="festival-ticket ${ticketTheme}"
        >

            <div class="festival-ticket-main">

                <div class="festival-ticket-brand">

                    <img
                        src="assets/WaterSplashLogo.png"
                        alt="Water Splash Logo"
                        class="festival-ticket-logo"
                        onerror="
                            this.style.display='none';
                            this.nextElementSibling.style.display='block';
                        "
                    >


                    <div
                        class="festival-text-logo"
                        style="display:none;"
                    >

                        <strong>
                            WATER
                        </strong>

                        <strong>
                            SPLASH
                        </strong>

                    </div>


                    <span class="festival-ticket-subtitle">
                        SUMMER WATER FESTIVAL
                    </span>

                </div>


                <div class="festival-ticket-content">

                    <p class="festival-ticket-kicker">
                        WATER SPLASH 2026
                    </p>


                    <h2 class="festival-ticket-title">
                        ${escapeHTML(ticketName)}
                    </h2>


                    <div class="festival-ticket-information">

                        <div class="festival-information-item">

                            <span>
                                DATE
                            </span>

                            <strong>
                                15 AUGUST 2026
                            </strong>

                        </div>


                        <div class="festival-information-item">

                            <span>
                                VENUE
                            </span>

                            <strong>
                                GWK CULTURAL PARK, BALI
                            </strong>

                        </div>


                        <div class="festival-information-item">

                            <span>
                                ACCESS
                            </span>

                            <strong>
                                ${escapeHTML(ticketAccess)}
                            </strong>

                        </div>


                        <div class="festival-information-item">

                            <span>
                                TICKET NO.
                            </span>

                            <strong>
                                ${escapeHTML(ticketId)}
                            </strong>

                        </div>

                    </div>

                </div>

            </div>


            <div class="festival-ticket-stub">

                <div class="festival-code-card">

                    <div
                        class="festival-qr-code"
                        id="ticket-qr-${index}"
                    >

                        <span>
                            QR
                        </span>

                    </div>


                    <strong class="festival-scan-label">
                        SCAN CODE
                    </strong>


                    <small class="festival-ticket-code">
                        ${escapeHTML(ticketId)}
                    </small>


                    <span class="festival-ticket-sequence">
                        ${sequence}
                    </span>

                </div>

            </div>

        </article>
    `;

}



/* =========================================================
   GENERATE QR CODE
========================================================= */

function renderQRCode(
    order,
    ticketId,
    index
) {

    const qrContainer =
        document.getElementById(
            "ticket-qr-" +
            index
        );


    if (!qrContainer) {

        return;

    }


    qrContainer.innerHTML =
        "";


    /*
        Tiket tetap muncul meskipun
        library QR gagal dimuat.
    */

    if (
        typeof window.QRCode ===
        "undefined"
    ) {

        showQRFallback(
            qrContainer
        );

        return;

    }


    /*
        Data QR dibuat pendek supaya
        tidak mengalami code length overflow.
    */

    const qrContent = [

        "WS26",

        ticketId,

        order.orderId

    ].join("|");


    try {

        new window.QRCode(
            qrContainer,
            {
                text:
                    qrContent,

                width:
                    118,

                height:
                    118,

                colorDark:
                    "#063f70",

                colorLight:
                    "#ffffff",

                correctLevel:
                    window.QRCode
                        .CorrectLevel
                        .M
            }
        );

    } catch (error) {

        console.error(
            "QR Code generation error:",
            error
        );


        showQRFallback(
            qrContainer
        );

    }

}



function showQRFallback(
    qrContainer
) {

    qrContainer.innerHTML = `
        <div class="festival-qr-fallback">
            QR
        </div>
    `;

}



/* =========================================================
   ACTION BUTTONS
========================================================= */

function connectActionButtons(
    order
) {

    const downloadButton =
        document.getElementById(
            "download-ticket"
        );


    const printButton =
        document.getElementById(
            "print-ticket"
        );


    if (downloadButton) {

        downloadButton.addEventListener(
            "click",
            function () {

                downloadTicketAsPNG(
                    order
                );

            }
        );

    }


    if (printButton) {

        printButton.addEventListener(
            "click",
            function () {

                window.print();

            }
        );

    }

}



/* =========================================================
   DOWNLOAD E-TICKET AS PNG
========================================================= */

async function downloadTicketAsPNG(
    order
) {

    const ticketList =
        document.getElementById(
            "ticket-list"
        );


    const downloadButton =
        document.getElementById(
            "download-ticket"
        );


    if (!ticketList) {

        alert(
            "E-ticket tidak ditemukan."
        );

        return;

    }


    if (
        typeof window.html2canvas ===
        "undefined"
    ) {

        alert(
            "Fitur download belum berhasil dimuat. Silakan refresh halaman."
        );

        return;

    }


    try {

        if (downloadButton) {

            downloadButton.disabled =
                true;


            downloadButton.textContent =
                "Preparing Ticket...";

        }


        if (
            document.fonts &&
            document.fonts.ready
        ) {

            await document.fonts.ready;

        }


        await waitForImages(
            ticketList
        );


        const canvas =
            await window.html2canvas(
                ticketList,
                {
                    scale:
                        2,

                    backgroundColor:
                        "#f5fcff",

                    useCORS:
                        true,

                    allowTaint:
                        false,

                    logging:
                        false,

                    scrollX:
                        0,

                    scrollY:
                        -window.scrollY,

                    windowWidth:
                        document.documentElement
                            .scrollWidth
                }
            );


        const imageURL =
            canvas.toDataURL(
                "image/png",
                1
            );


        const downloadLink =
            document.createElement(
                "a"
            );


        downloadLink.href =
            imageURL;


        downloadLink.download =
            createDownloadFileName(
                order
            );


        document.body.appendChild(
            downloadLink
        );


        downloadLink.click();


        document.body.removeChild(
            downloadLink
        );

    } catch (error) {

        console.error(
            "Download e-ticket error:",
            error
        );


        alert(
            "E-ticket belum berhasil diunduh. Gunakan tombol Print / Save as PDF."
        );

    } finally {

        if (downloadButton) {

            downloadButton.disabled =
                false;


            downloadButton.textContent =
                "Download E-Ticket";

        }

    }

}



function waitForImages(
    container
) {

    const images =
        Array.from(
            container.querySelectorAll(
                "img"
            )
        );


    const imagePromises =
        images.map(
            function (
                image
            ) {

                if (
                    image.complete
                ) {

                    return Promise.resolve();

                }


                return new Promise(
                    function (
                        resolve
                    ) {

                        image.addEventListener(
                            "load",
                            resolve,
                            {
                                once:
                                    true
                            }
                        );


                        image.addEventListener(
                            "error",
                            resolve,
                            {
                                once:
                                    true
                            }
                        );

                    }
                );

            }
        );


    return Promise.all(
        imagePromises
    );

}



function createDownloadFileName(
    order
) {

    const ticketName =
        getTicketDisplayName(
            order.ticket.id
        )
            .toLowerCase()
            .replace(
                /\s+/g,
                "-"
            );


    const cleanOrderId =
        String(
            order.orderId
        )
            .toLowerCase()
            .replace(
                /[^a-z0-9-]/g,
                ""
            );


    return (
        "water-splash-" +
        ticketName +
        "-" +
        cleanOrderId +
        ".png"
    );

}



/* =========================================================
   UTILITIES
========================================================= */

function setElementText(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );


    if (element) {

        element.textContent =

            value !== undefined &&
            value !== null &&
            String(value).trim() !== ""

                ? String(value)

                : "-";

    }

}



function getValidNumber(
    value,
    fallback
) {

    const number =
        Number(
            value
        );


    if (
        !Number.isFinite(
            number
        )
    ) {

        return fallback;

    }


    return number;

}



function formatRupiah(
    value
) {

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
    ).format(
        getValidNumber(
            value,
            0
        )
    );

}



function escapeHTML(
    value
) {

    return String(
        value
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}



/* =========================================================
   ERROR DISPLAY
========================================================= */

function showConfirmationError(
    message
) {

    const errorBox =
        document.getElementById(
            "confirmation-error"
        );


    const errorMessage =
        document.getElementById(
            "confirmation-error-message"
        );


    const orderSummary =
        document.getElementById(
            "order-summary"
        );


    const ticketArea =
        document.getElementById(
            "ticket-area"
        );


    const actions =
        document.getElementById(
            "confirmation-actions"
        );


    if (errorMessage) {

        errorMessage.textContent =
            message;

    }


    if (errorBox) {

        errorBox.hidden =
            false;

    }


    if (orderSummary) {

        orderSummary.hidden =
            true;

    }


    if (ticketArea) {

        ticketArea.hidden =
            true;

    }


    if (actions) {

        actions.hidden =
            true;

    }

}