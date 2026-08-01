"use strict";


(function () {

    const API_URL =
        window.WATER_SPLASH_API || "";


    document.addEventListener(
        "DOMContentLoaded",
        function () {

            if (!API_URL) {

                console.error(
                    "WATER_SPLASH_API belum diisi di api-config.js"
                );

                return;

            }


            loadWaterSplashData();

        }
    );



    /* =====================================================
       AMBIL DATA GOOGLE SHEET
    ===================================================== */

    function loadWaterSplashData() {

        const callbackName =
            "__waterSplashCallback" +
            Date.now();


        const script =
            document.createElement(
                "script"
            );


        let finished =
            false;


        const timeout =
            window.setTimeout(
                function () {

                    if (finished) {

                        return;

                    }


                    finished =
                        true;


                    cleanup();


                    console.error(
                        "Google Sheet terlalu lama merespons."
                    );

                },
                15000
            );


        window[callbackName] =
            function (data) {

                if (finished) {

                    return;

                }


                finished =
                    true;


                window.clearTimeout(
                    timeout
                );


                cleanup();


                if (
                    !data ||
                    data.ok === false
                ) {

                    console.error(
                        "Water Splash API error:",
                        data
                    );

                    return;

                }


                window.WATER_SPLASH_DATA =
                    data;


                applyAllData(
                    data
                );


                console.log(
                    "Water Splash Sheet connected:",
                    data
                );

            };


        script.onerror =
            function () {

                if (finished) {

                    return;

                }


                finished =
                    true;


                window.clearTimeout(
                    timeout
                );


                cleanup();


                console.error(
                    "Website gagal mengambil data Google Sheet."
                );

            };


        script.src =
            API_URL +
            "?action=bootstrap" +
            "&callback=" +
            callbackName +
            "&time=" +
            Date.now();


        document.head.appendChild(
            script
        );


        function cleanup() {

            try {

                delete window[
                    callbackName
                ];

            } catch (error) {

                window[
                    callbackName
                ] =
                    undefined;

            }


            script.remove();

        }

    }



    /* =====================================================
       TERAPKAN SEMUA DATA
    ===================================================== */

    function applyAllData(data) {

        applyGlobalSettings(
            data.settings || {}
        );


        applyPageControl(
            data.pages || []
        );


        applyLineup(
            data.lineup || []
        );


        applyTickets(
            data.tickets || []
        );


        applyExperience(
            data.experience || null
        );

    }



    /* =====================================================
       SETTINGS GLOBAL
    ===================================================== */

    function applyGlobalSettings(settings) {

        const siteEnabled =
            toBoolean(
                settings.site_enabled,
                true
            );


        if (!siteEnabled) {

            showMaintenancePage(
                settings.maintenance_message ||
                "Water Splash is temporarily unavailable."
            );

            return;

        }


        const showLineup =
            toBoolean(
                settings.show_lineup_section,
                true
            );


        const showTicketPreview =
            toBoolean(
                settings.show_ticket_preview,
                true
            );


        const showExperiencePreview =
            toBoolean(
                settings.show_experience_preview,
                true
            );


        setVisible(
            document.getElementById(
                "lineup"
            ),
            showLineup
        );


        setVisible(
            document.getElementById(
                "tickets"
            ),
            showTicketPreview
        );


        setVisible(
            document.getElementById(
                "experience-preview"
            ),
            showExperiencePreview
        );


        document
            .querySelectorAll(
                'a[href*="#lineup"]'
            )
            .forEach(
                function (link) {

                    setVisible(
                        link,
                        showLineup
                    );

                }
            );


        const heroVideo =
            document.querySelector(
                ".hero-background-video"
            );


        const heroSource =
            heroVideo
                ? heroVideo.querySelector(
                    "source"
                )
                : null;


        if (
            heroVideo &&
            heroSource &&
            settings.home_hero_video
        ) {

            const newVideoURL =
                String(
                    settings.home_hero_video
                ).trim();


            if (
                heroSource.getAttribute(
                    "src"
                ) !== newVideoURL
            ) {

                heroSource.src =
                    newVideoURL;


                heroVideo.load();

            }

        }


        if (
            heroVideo &&
            settings.home_hero_poster
        ) {

            heroVideo.poster =
                String(
                    settings.home_hero_poster
                ).trim();

        }

    }



    /* =====================================================
       HIDE HALAMAN DAN NAVBAR
    ===================================================== */

    function applyPageControl(pages) {

        const currentPage =
            getCurrentFileName();


        const currentPageData =
            pages.find(
                function (page) {

                    return (
                        normalizeFileName(
                            page.path
                        ) ===
                        currentPage
                    );

                }
            );


        if (
            currentPageData &&
            !toBoolean(
                currentPageData.page_enabled,
                true
            )
        ) {

            const redirectPath =
                normalizeFileName(
                    currentPageData.redirect_path
                ) ||
                "index.html";


            if (
                redirectPath !==
                currentPage
            ) {

                window.location.replace(
                    redirectPath
                );

                return;

            }


            showMaintenancePage(
                currentPageData.disabled_message ||
                "This page is temporarily unavailable."
            );


            return;

        }


        document
            .querySelectorAll(
                "a[href]"
            )
            .forEach(
                function (link) {

                    const targetFile =
                        normalizeFileName(
                            link.getAttribute(
                                "href"
                            )
                        );


                    if (!targetFile) {

                        return;

                    }


                    const pageData =
                        pages.find(
                            function (page) {

                                return (
                                    normalizeFileName(
                                        page.path
                                    ) ===
                                    targetFile
                                );

                            }
                        );


                    if (!pageData) {

                        return;

                    }


                    const pageEnabled =
                        toBoolean(
                            pageData.page_enabled,
                            true
                        );


                    const navVisible =
                        toBoolean(
                            pageData.nav_visible,
                            true
                        );


                    if (!pageEnabled) {

                        link.style.display =
                            "none";

                        return;

                    }


                    if (
                        link.closest(
                            ".nav-menu"
                        ) &&
                        !navVisible
                    ) {

                        link.style.display =
                            "none";

                    }

                }
            );

    }



    /* =====================================================
       LINEUP DARI GOOGLE SHEET
    ===================================================== */

    function applyLineup(lineup) {

        const container =
            document.querySelector(
                ".lineup-grid"
            );


        if (!container) {

            return;

        }


        const visibleArtists =
            lineup
                .filter(
                    function (artist) {

                        return toBoolean(
                            artist.visible,
                            true
                        );

                    }
                )
                .sort(
                    function (
                        firstArtist,
                        secondArtist
                    ) {

                        return (
                            Number(
                                firstArtist.sort_order ||
                                0
                            ) -
                            Number(
                                secondArtist.sort_order ||
                                0
                            )
                        );

                    }
                );


        container.innerHTML =
            visibleArtists
                .map(
                    function (artist) {

                        return `

                            <article class="artist-card">

                                <div class="artist-photo">

                                    <img
                                        src="${escapeAttribute(
                                            artist.image_url
                                        )}"
                                        alt="${escapeAttribute(
                                            artist.name
                                        )}"
                                        loading="lazy"
                                    >

                                </div>

                                <h3>
                                    ${escapeHTML(
                                        artist.name
                                    )}
                                </h3>

                            </article>
                        `;

                    }
                )
                .join("");

    }



    /* =====================================================
       TIKET DARI GOOGLE SHEET
    ===================================================== */

    function applyTickets(tickets) {

        const sortedTickets =
            tickets
                .slice()
                .sort(
                    function (
                        firstTicket,
                        secondTicket
                    ) {

                        return (
                            Number(
                                firstTicket.sort_order ||
                                0
                            ) -
                            Number(
                                secondTicket.sort_order ||
                                0
                            )
                        );

                    }
                );


        sortedTickets.forEach(
            function (ticket) {

                updateFullTicketCard(
                    ticket
                );


                updatePreviewTicketCard(
                    ticket
                );

            }
        );

    }



    function updateFullTicketCard(ticket) {

        const card =
            document.querySelector(
                '[data-ticket-card="' +
                ticket.id +
                '"]'
            );


        if (!card) {

            return;

        }


        const status =
            normalizeStatus(
                ticket.status
            );


        const visible =
            toBoolean(
                ticket.visible,
                true
            ) &&
            status !== "HIDDEN";


        setVisible(
            card,
            visible
        );


        if (!visible) {

            return;

        }


        setText(
            card.querySelector(
                ".full-category"
            ),
            ticket.category
        );


        setText(
            card.querySelector(
                "h2"
            ),
            ticket.name
        );


        setText(
            card.querySelector(
                ".ticket-price"
            ),
            formatRupiah(
                ticket.price
            )
        );


        setText(
            card.querySelector(
                ".ticket-description"
            ),
            ticket.description
        );


        const peopleLabel =
            card.querySelector(
                ".people-label"
            );


        const admissions =
            Math.max(
                1,
                Number(
                    ticket.admissions ||
                    1
                )
            );


        if (peopleLabel) {

            peopleLabel.textContent =
                admissions +
                (
                    admissions > 1
                        ? " TICKETS"
                        : " TICKET"
                );

        }


        const includeList =
            card.querySelector(
                "ul"
            );


        if (
            includeList &&
            ticket.includes_pipe
        ) {

            includeList.innerHTML =
                String(
                    ticket.includes_pipe
                )
                    .split("|")
                    .map(
                        function (item) {

                            return item.trim();

                        }
                    )
                    .filter(Boolean)
                    .map(
                        function (item) {

                            return `

                                <li>
                                    ${escapeHTML(item)}
                                </li>
                            `;

                        }
                    )
                    .join("");

        }


        const badge =
            card.querySelector(
                ".status-badge"
            );


        updateStatusBadge(
            badge,
            status
        );


        const buyButton =
            card.querySelector(
                ".ticket-buy-button"
            );


        if (!buyButton) {

            return;

        }


        if (
            status ===
            "SOLD_OUT"
        ) {

            buyButton.textContent =
                "Sold Out";


            buyButton.removeAttribute(
                "href"
            );


            buyButton.setAttribute(
                "aria-disabled",
                "true"
            );


            buyButton.classList.add(
                "disabled"
            );


            buyButton.style.pointerEvents =
                "none";

        } else {

            buyButton.textContent =
                "Buy " +
                ticket.name;


            buyButton.href =
                "checkout.html?ticket=" +
                encodeURIComponent(
                    ticket.id
                );


            buyButton.removeAttribute(
                "aria-disabled"
            );


            buyButton.classList.remove(
                "disabled"
            );


            buyButton.style.pointerEvents =
                "";

        }

    }



    function updatePreviewTicketCard(ticket) {

        const previewSelectors = {

            "splash-pass":
                ".preview-general",

            "wave-vip":
                ".preview-vip",

            "ocean-vvip":
                ".preview-vvip",

            "splash-squad":
                ".preview-squad"

        };


        const selector =
            previewSelectors[
                ticket.id
            ];


        if (!selector) {

            return;

        }


        const card =
            document.querySelector(
                selector
            );


        if (!card) {

            return;

        }


        const status =
            normalizeStatus(
                ticket.status
            );


        const visible =
            toBoolean(
                ticket.visible,
                true
            ) &&
            status !== "HIDDEN";


        setVisible(
            card,
            visible
        );


        if (!visible) {

            return;

        }


        setText(
            card.querySelector(
                ".preview-category"
            ),
            ticket.category
        );


        setText(
            card.querySelector(
                "h3"
            ),
            ticket.name
        );


        setText(
            card.querySelector(
                "strong"
            ),
            formatRupiah(
                ticket.price
            )
        );


        updateStatusBadge(
            card.querySelector(
                ".status-badge"
            ),
            status
        );

    }



    function updateStatusBadge(
        badge,
        status
    ) {

        if (!badge) {

            return;

        }


        badge.classList.remove(
            "available",
            "sold-out"
        );


        if (
            status ===
            "SOLD_OUT"
        ) {

            badge.textContent =
                "SOLD OUT";


            badge.classList.add(
                "sold-out"
            );

        } else {

            badge.textContent =
                "AVAILABLE";


            badge.classList.add(
                "available"
            );

        }

    }



    /* =====================================================
       EXPERIENCE DARI GOOGLE SHEET
    ===================================================== */

    function applyExperience(experience) {

        if (
            !experience ||
            !document.getElementById(
                "experience-sections"
            )
        ) {

            return;

        }


        const sections =
            Array.isArray(
                experience.sections
            )
                ? experience.sections
                : [];


        if (
            typeof renderExperienceHero ===
            "function"
        ) {

            renderExperienceHero(
                experience.hero
            );

        }


        if (
            typeof renderExperienceSections ===
            "function"
        ) {

            renderExperienceSections(
                sections
            );

        }


        if (
            typeof createCategoryNavigation ===
            "function"
        ) {

            createCategoryNavigation(
                sections
            );

        }


        if (
            typeof initializeRevealAnimation ===
            "function"
        ) {

            initializeRevealAnimation();

        }


        if (
            typeof initializeImageFallbacks ===
            "function"
        ) {

            initializeImageFallbacks();

        }


        if (
            typeof initializeActiveCategory ===
            "function"
        ) {

            initializeActiveCategory();

        }

    }



    /* =====================================================
       MAINTENANCE PAGE
    ===================================================== */

    function showMaintenancePage(message) {

        document.body.innerHTML = `

            <main
                style="
                    min-height: 100vh;
                    padding: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #ffffff;
                    text-align: center;
                    background:
                        linear-gradient(
                            145deg,
                            #063f70,
                            #0b92dc
                        );
                "
            >

                <div>

                    <p
                        style="
                            margin-bottom: 10px;
                            font-weight: bold;
                            letter-spacing: 3px;
                        "
                    >
                        WATER SPLASH 2026
                    </p>

                    <h1
                        style="
                            margin: 0 0 18px;
                            font-size: clamp(
                                48px,
                                9vw,
                                100px
                            );
                        "
                    >
                        WATER SPLASH
                    </h1>

                    <p
                        style="
                            max-width: 500px;
                            margin: auto;
                            line-height: 1.7;
                            opacity: 0.82;
                        "
                    >
                        ${escapeHTML(message)}
                    </p>

                    <a
                        href="index.html"
                        style="
                            display: inline-block;
                            margin-top: 28px;
                            padding: 13px 24px;
                            color: #063f70;
                            font-weight: bold;
                            text-decoration: none;
                            border-radius: 999px;
                            background: #d8ff4f;
                        "
                    >
                        Back to Home
                    </a>

                </div>

            </main>
        `;

    }



    /* =====================================================
       HELPERS
    ===================================================== */

    function getCurrentFileName() {

        const fileName =
            window.location.pathname
                .split("/")
                .pop();


        return fileName ||
            "index.html";

    }



    function normalizeFileName(path) {

        if (!path) {

            return "";

        }


        let fileName =
            String(path)
                .split("?")[0]
                .split("#")[0]
                .split("/")
                .pop();


        if (!fileName) {

            fileName =
                "index.html";

        }


        return fileName;

    }



    function normalizeStatus(status) {

        return String(
            status ||
            "AVAILABLE"
        )
            .trim()
            .toUpperCase();

    }



    function setVisible(
        element,
        visible
    ) {

        if (!element) {

            return;

        }


        element.style.display =
            visible
                ? ""
                : "none";

    }



    function setText(
        element,
        value
    ) {

        if (
            !element ||
            value === undefined ||
            value === null
        ) {

            return;

        }


        element.textContent =
            String(value);

    }



    function toBoolean(
        value,
        fallback
    ) {

        if (
            typeof value ===
            "boolean"
        ) {

            return value;

        }


        const normalized =
            String(
                value ||
                ""
            )
                .trim()
                .toLowerCase();


        if (
            normalized === "true" ||
            normalized === "yes" ||
            normalized === "1"
        ) {

            return true;

        }


        if (
            normalized === "false" ||
            normalized === "no" ||
            normalized === "0"
        ) {

            return false;

        }


        return fallback;

    }



    function formatRupiah(value) {

        const number =
            Number(
                value ||
                0
            );


        return new Intl
            .NumberFormat(
                "id-ID",
                {
                    style:
                        "currency",

                    currency:
                        "IDR",

                    maximumFractionDigits:
                        0
                }
            )
            .format(
                number
            );

    }



    function escapeHTML(value) {

        return String(
            value ||
            ""
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



    function escapeAttribute(value) {

        return escapeHTML(
            value
        );

    }

})();