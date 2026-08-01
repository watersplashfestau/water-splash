"use strict";


/* =========================================================
   GOOGLE SHEET CONFIGURATION

   Nanti saat Google Sheet sudah dibuat,
   URL Apps Script ditempel di sini.

   Contoh:
   const EXPERIENCE_SHEET_API =
       "https://script.google.com/macros/s/XXXXX/exec";

   Untuk sekarang kosong, jadi website memakai data bawaan.
========================================================= */

const EXPERIENCE_SHEET_API =
    "";



/* =========================================================
   DATA SEMENTARA

   Foto dan tulisan ini nanti bisa diganti
   melalui Google Sheet tanpa mengubah HTML.

   Kosongkan image jika belum punya foto.
   Website akan menampilkan gradient placeholder.
========================================================= */

const DEFAULT_EXPERIENCE_DATA = {

    hero: {

        eyebrow:
            "WATER SPLASH 2026",

        title:
            "WATER SPLASH",

        title_second:
            "EXPERIENCE",

        description:
            "More than a festival. A full day of music, water, food, and summer energy.",

        image:
            "assets/Hero.jpg"

    },


    sections: [

        {

            id:
                "splash-activities",

            eyebrow:
                "PLAY. SPLASH. REPEAT.",

            title:
                "SPLASH ACTIVITIES",

            description:
                "Jump into interactive water games, festival challenges, brand pop-ups, and refreshing activities throughout the venue.",

            theme:
                "light",

            layout:
                "normal",

            visible:
                true,

            order:
                1,

            images: [

                {
                    url:
                        "",

                    alt:
                        "Water Battle Zone",

                    label:
                        "Water Battle Zone"
                },

                {
                    url:
                        "",

                    alt:
                        "Festival Games",

                    label:
                        "Festival Games"
                },

                {
                    url:
                        "",

                    alt:
                        "Water Gun Station",

                    label:
                        "Water Gun Station"
                }

            ],

            items: [

                "Water Battle Zone",

                "Water Gun Station",

                "Festival Games",

                "Brand Pop-Up",

                "Merchandise Booth"

            ]

        },


        {

            id:
                "art-chill-lounge",

            eyebrow:
                "REST AND RECHARGE",

            title:
                "ART & CHILL LOUNGE",

            description:
                "Capture colorful festival moments and take a refreshing break inside our summer-inspired lounge areas.",

            theme:
                "aqua",

            layout:
                "reverse",

            visible:
                true,

            order:
                2,

            images: [

                {
                    url:
                        "",

                    alt:
                        "Interactive Art Installation",

                    label:
                        "Interactive Art"
                },

                {
                    url:
                        "",

                    alt:
                        "Summer Chill Lounge",

                    label:
                        "Summer Chill Lounge"
                },

                {
                    url:
                        "",

                    alt:
                        "Festival Photo Spot",

                    label:
                        "Photo Spot"
                }

            ],

            items: [

                "Interactive Art",

                "Festival Photo Spot",

                "Summer Lounge",

                "Charging Area",

                "Rest Zone"

            ]

        },


        {

            id:
                "food-drinks",

            eyebrow:
                "FESTIVAL FUEL",

            title:
                "FOOD & DRINKS",

            description:
                "Refuel your festival day with refreshing drinks, local favorites, international dishes, halal selections, and plant-based options.",

            theme:
                "light",

            layout:
                "normal",

            visible:
                true,

            order:
                3,

            images: [

                {
                    url:
                        "",

                    alt:
                        "Festival Food",

                    label:
                        "Festival Food"
                },

                {
                    url:
                        "",

                    alt:
                        "Refreshing Drinks",

                    label:
                        "Refreshing Drinks"
                },

                {
                    url:
                        "",

                    alt:
                        "Food Market",

                    label:
                        "Food Market"
                }

            ],

            items: [

                "Local Favorites",

                "International Dishes",

                "Halal Options",

                "Plant-Based Menus",

                "Refreshing Drinks"

            ]

        },


        {

            id:
                "ocean-vvip-lounge",

            eyebrow:
                "PREMIUM FESTIVAL EXPERIENCE",

            title:
                "OCEAN VVIP LOUNGE",

            description:
                "A private festival space featuring comfortable seating, exclusive refreshments, premium viewing access, and personalized service.",

            theme:
                "navy",

            layout:
                "reverse",

            visible:
                true,

            order:
                4,

            images: [

                {
                    url:
                        "",

                    alt:
                        "Ocean VVIP Lounge",

                    label:
                        "Ocean VVIP Lounge"
                },

                {
                    url:
                        "",

                    alt:
                        "Premium Viewing Area",

                    label:
                        "Premium Viewing"
                },

                {
                    url:
                        "",

                    alt:
                        "VVIP Refreshment Area",

                    label:
                        "Private Refreshments"
                }

            ],

            items: [

                "Private Lounge",

                "Premium Viewing",

                "Comfortable Seating",

                "Exclusive Refreshments",

                "Personalized Service"

            ]

        },


        {

            id:
                "festival-facilities",

            eyebrow:
                "EVERYTHING YOU NEED",

            title:
                "FESTIVAL FACILITIES",

            description:
                "Stay comfortable throughout the festival with essential facilities located across the venue.",

            theme:
                "lime",

            layout:
                "normal",

            visible:
                true,

            order:
                5,

            images: [

                {
                    url:
                        "",

                    alt:
                        "Festival Locker",

                    label:
                        "Locker"
                },

                {
                    url:
                        "",

                    alt:
                        "Changing Room",

                    label:
                        "Changing Room"
                },

                {
                    url:
                        "",

                    alt:
                        "Water Refill Station",

                    label:
                        "Water Refill Station"
                }

            ],

            items: [

                "Locker",

                "Changing Room",

                "Water Refill Station",

                "Medical Station",

                "Information Booth",

                "Restroom",

                "Prayer Room"

            ]

        }

    ]

};



document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeExperiencePage();

    }
);



/* =========================================================
   INITIALIZE PAGE
========================================================= */

async function initializeExperiencePage() {

    const experienceData =
        await loadExperienceData();


    renderExperienceHero(
        experienceData.hero
    );


    renderExperienceSections(
        experienceData.sections
    );


    createCategoryNavigation(
        experienceData.sections
    );


    initializeRevealAnimation();


    initializeImageFallbacks();


    initializeActiveCategory();

}



/* =========================================================
   LOAD DATA

   Jika API Google Sheet masih kosong,
   gunakan data bawaan.
========================================================= */

async function loadExperienceData() {

    if (
        !EXPERIENCE_SHEET_API ||
        EXPERIENCE_SHEET_API.trim() === ""
    ) {

        return DEFAULT_EXPERIENCE_DATA;

    }


    try {

        const response =
            await fetch(
                EXPERIENCE_SHEET_API +
                "?action=getExperience",
                {
                    method:
                        "GET",

                    cache:
                        "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Experience API returned " +
                response.status
            );

        }


        const sheetData =
            await response.json();


        if (
            !sheetData ||
            !Array.isArray(
                sheetData.sections
            )
        ) {

            throw new Error(
                "Invalid experience data"
            );

        }


        return {

            hero:
                sheetData.hero ||
                DEFAULT_EXPERIENCE_DATA.hero,

            sections:
                sheetData.sections

        };

    } catch (error) {

        console.warn(
            "Google Sheet experience data could not be loaded:",
            error
        );


        return DEFAULT_EXPERIENCE_DATA;

    }

}



/* =========================================================
   HERO
========================================================= */

function renderExperienceHero(
    heroData
) {

    if (!heroData) {

        return;

    }


    setTextContent(
        "experience-eyebrow",
        heroData.eyebrow
    );


    const heroTitle =
        document.getElementById(
            "experience-hero-title"
        );


    if (heroTitle) {

        heroTitle.innerHTML = `

            ${escapeHTML(
                heroData.title ||
                "WATER SPLASH"
            )}

            <span>
                ${escapeHTML(
                    heroData.title_second ||
                    "EXPERIENCE"
                )}
            </span>
        `;

    }


    setTextContent(
        "experience-hero-description",
        heroData.description
    );


    const heroSection =
        document.querySelector(
            ".ws-exp-hero"
        );


    if (
        heroSection &&
        heroData.image
    ) {

        heroSection.style.setProperty(
            "--experience-hero-image",
            `url("${heroData.image}")`
        );

    }

}



/* =========================================================
   RENDER SECTIONS
========================================================= */

function renderExperienceSections(
    sections
) {

    const sectionContainer =
        document.getElementById(
            "experience-sections"
        );


    if (!sectionContainer) {

        return;

    }


    const visibleSections =
        sections
            .filter(
                function (section) {

                    return normalizeBoolean(
                        section.visible,
                        true
                    );

                }
            )
            .sort(
                function (
                    firstSection,
                    secondSection
                ) {

                    return (
                        Number(
                            firstSection.order ||
                            0
                        ) -
                        Number(
                            secondSection.order ||
                            0
                        )
                    );

                }
            );


    sectionContainer.innerHTML =
        visibleSections
            .map(
                function (
                    section,
                    index
                ) {

                    return createExperienceSection(
                        section,
                        index
                    );

                }
            )
            .join("");

}



/* =========================================================
   CREATE SECTION HTML
========================================================= */

function createExperienceSection(
    section,
    index
) {

    const sectionId =
        createSafeId(
            section.id ||
            section.title ||
            "experience-" +
            index
        );


    const themeClass =
        getThemeClass(
            section.theme
        );


    const layoutClass =

        section.layout ===
        "reverse"

            ? "ws-exp-section-reverse"

            : "";


    const images =
        normalizeImages(
            section.images,
            section.title
        );


    const items =
        normalizeItems(
            section.items
        );


    return `

        <section
            class="
                ws-exp-section
                ${themeClass}
                ${layoutClass}
                ws-exp-reveal
            "
            id="${sectionId}"
            data-experience-category="${sectionId}"
        >

            <div class="ws-exp-section-inner">


                <div class="ws-exp-section-copy">

                    <p class="ws-exp-section-eyebrow">
                        ${escapeHTML(
                            section.eyebrow ||
                            "WATER SPLASH EXPERIENCE"
                        )}
                    </p>


                    <h2>
                        ${formatTitle(
                            section.title ||
                            "EXPERIENCE"
                        )}
                    </h2>


                    <p class="ws-exp-section-description">
                        ${escapeHTML(
                            section.description ||
                            ""
                        )}
                    </p>


                    ${
                        createItemsHTML(
                            items
                        )
                    }

                </div>



                <div class="ws-exp-gallery">

                    ${
                        images
                            .map(
                                function (
                                    image,
                                    imageIndex
                                ) {

                                    return createImageHTML(
                                        image,
                                        imageIndex
                                    );

                                }
                            )
                            .join("")
                    }

                </div>

            </div>

        </section>
    `;

}



/* =========================================================
   EXPERIENCE IMAGES
========================================================= */

function normalizeImages(
    images,
    title
) {

    const normalizedImages =
        Array.isArray(images)
            ? images.slice(0, 3)
            : [];


    while (
        normalizedImages.length < 3
    ) {

        normalizedImages.push({

            url:
                "",

            alt:
                title ||
                "Water Splash Experience",

            label:
                title ||
                "Water Splash Experience"

        });

    }


    return normalizedImages;

}



function createImageHTML(
    image,
    imageIndex
) {

    const imageClass =
        "ws-exp-gallery-image-" +
        (
            imageIndex + 1
        );


    const imageURL =
        String(
            image.url ||
            ""
        )
            .trim();


    const imageContent =

        imageURL

            ? `

                <img
                    src="${escapeAttribute(imageURL)}"
                    alt="${escapeAttribute(
                        image.alt ||
                        image.label ||
                        "Water Splash Experience"
                    )}"
                    loading="lazy"
                >
            `

            : "";


    return `

        <figure
            class="
                ws-exp-gallery-image
                ${imageClass}
                ${imageURL ? "" : "ws-exp-image-placeholder"}
            "
        >

            ${imageContent}


            <div class="ws-exp-image-overlay"></div>


            <figcaption>

                ${escapeHTML(
                    image.label ||
                    image.alt ||
                    "Water Splash Experience"
                )}

            </figcaption>

        </figure>
    `;

}



/* =========================================================
   EXPERIENCE ITEMS
========================================================= */

function normalizeItems(
    items
) {

    if (
        Array.isArray(items)
    ) {

        return items.filter(Boolean);

    }


    if (
        typeof items ===
        "string"
    ) {

        return items
            .split("|")
            .map(
                function (item) {

                    return item.trim();

                }
            )
            .filter(Boolean);

    }


    return [];

}



function createItemsHTML(
    items
) {

    if (
        !items.length
    ) {

        return "";

    }


    return `

        <div class="ws-exp-item-list">

            ${
                items
                    .map(
                        function (item) {

                            return `

                                <span>
                                    ${escapeHTML(item)}
                                </span>
                            `;

                        }
                    )
                    .join("")
            }

        </div>
    `;

}



/* =========================================================
   CATEGORY NAVIGATION
========================================================= */

function createCategoryNavigation(
    sections
) {

    const categoryContainer =
        document.getElementById(
            "experience-category-nav"
        );


    if (!categoryContainer) {

        return;

    }


    const visibleSections =
        sections
            .filter(
                function (section) {

                    return normalizeBoolean(
                        section.visible,
                        true
                    );

                }
            )
            .sort(
                function (
                    firstSection,
                    secondSection
                ) {

                    return (
                        Number(
                            firstSection.order ||
                            0
                        ) -
                        Number(
                            secondSection.order ||
                            0
                        )
                    );

                }
            );


    categoryContainer.innerHTML =
        visibleSections
            .map(
                function (
                    section,
                    index
                ) {

                    const sectionId =
                        createSafeId(
                            section.id ||
                            section.title ||
                            "experience-" +
                            index
                        );


                    return `

                        <a
                            href="#${sectionId}"
                            class="ws-exp-category-link"
                            data-target="${sectionId}"
                        >

                            ${escapeHTML(
                                createShortTitle(
                                    section.title
                                )
                            )}

                        </a>
                    `;

                }
            )
            .join("");

}



/* =========================================================
   ACTIVE CATEGORY WHILE SCROLLING
========================================================= */

function initializeActiveCategory() {

    const sections =
        document.querySelectorAll(
            "[data-experience-category]"
        );


    const categoryLinks =
        document.querySelectorAll(
            ".ws-exp-category-link"
        );


    if (
        !sections.length ||
        !categoryLinks.length
    ) {

        return;

    }


    const observer =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(
                    function (entry) {

                        if (
                            !entry.isIntersecting
                        ) {

                            return;

                        }


                        const sectionId =
                            entry.target.id;


                        categoryLinks.forEach(
                            function (link) {

                                link.classList.toggle(
                                    "active",
                                    link.dataset.target ===
                                    sectionId
                                );

                            }
                        );

                    }
                );

            },
            {
                rootMargin:
                    "-35% 0px -50% 0px",

                threshold:
                    0
            }
        );


    sections.forEach(
        function (section) {

            observer.observe(
                section
            );

        }
    );

}



/* =========================================================
   REVEAL ANIMATION
========================================================= */

function initializeRevealAnimation() {

    const revealElements =
        document.querySelectorAll(
            ".ws-exp-reveal"
        );


    if (!revealElements.length) {

        return;

    }


    const revealObserver =
        new IntersectionObserver(
            function (
                entries,
                observer
            ) {

                entries.forEach(
                    function (entry) {

                        if (
                            !entry.isIntersecting
                        ) {

                            return;

                        }


                        entry.target.classList.add(
                            "ws-exp-visible"
                        );


                        observer.unobserve(
                            entry.target
                        );

                    }
                );

            },
            {
                threshold:
                    0.14
            }
        );


    revealElements.forEach(
        function (element) {

            revealObserver.observe(
                element
            );

        }
    );

}



/* =========================================================
   IMAGE FALLBACK
========================================================= */

function initializeImageFallbacks() {

    const images =
        document.querySelectorAll(
            ".ws-exp-gallery-image img"
        );


    images.forEach(
        function (image) {

            image.addEventListener(
                "error",
                function () {

                    const figure =
                        image.closest(
                            ".ws-exp-gallery-image"
                        );


                    if (figure) {

                        figure.classList.add(
                            "ws-exp-image-placeholder"
                        );

                    }


                    image.remove();

                },
                {
                    once:
                        true
                }
            );

        }
    );

}



/* =========================================================
   HELPERS
========================================================= */

function getThemeClass(
    theme
) {

    const themes = {

        light:
            "ws-exp-theme-light",

        aqua:
            "ws-exp-theme-aqua",

        navy:
            "ws-exp-theme-navy",

        lime:
            "ws-exp-theme-lime"

    };


    return (
        themes[theme] ||
        themes.light
    );

}



function formatTitle(
    title
) {

    const words =
        String(
            title ||
            ""
        )
            .trim()
            .split(/\s+/);


    if (
        words.length < 2
    ) {

        return escapeHTML(
            title
        );

    }


    const middleIndex =
        Math.ceil(
            words.length / 2
        );


    const firstLine =
        words
            .slice(
                0,
                middleIndex
            )
            .join(" ");


    const secondLine =
        words
            .slice(
                middleIndex
            )
            .join(" ");


    return `

        ${escapeHTML(firstLine)}

        <span>
            ${escapeHTML(secondLine)}
        </span>
    `;

}



function createShortTitle(
    title
) {

    const normalizedTitle =
        String(
            title ||
            "Experience"
        );


    if (
        normalizedTitle.length <=
        18
    ) {

        return normalizedTitle;

    }


    return (
        normalizedTitle
            .split(" ")
            .slice(0, 2)
            .join(" ")
    );

}



function createSafeId(
    value
) {

    return String(
        value ||
        "experience"
    )
        .toLowerCase()
        .trim()
        .replace(
            /[^a-z0-9]+/g,
            "-"
        )
        .replace(
            /^-+|-+$/g,
            ""
        );

}



function normalizeBoolean(
    value,
    fallback
) {

    if (
        typeof value ===
        "boolean"
    ) {

        return value;

    }


    if (
        typeof value ===
        "string"
    ) {

        const normalizedValue =
            value
                .trim()
                .toLowerCase();


        if (
            normalizedValue ===
            "true" ||
            normalizedValue ===
            "yes" ||
            normalizedValue ===
            "1"
        ) {

            return true;

        }


        if (
            normalizedValue ===
            "false" ||
            normalizedValue ===
            "no" ||
            normalizedValue ===
            "0"
        ) {

            return false;

        }

    }


    return fallback;

}



function setTextContent(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );


    if (
        element &&
        value
    ) {

        element.textContent =
            value;

    }

}



function escapeHTML(
    value
) {

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



function escapeAttribute(
    value
) {

    return escapeHTML(
        value
    );

}