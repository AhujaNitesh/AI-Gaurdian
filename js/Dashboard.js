/* =========================================================
   AI GUARDIAN
   Women's Safety Dashboard
   Backend-Friendly JavaScript
   ========================================================= */


/* =========================================================
   APPLICATION STATE
   ========================================================= */

const appState = {

    user: {
        name: "Aanya Verma",
        email: "aanya.verma@email.com"
    },

    safety: {
        status: "safe",
        score: 100,
        environmentalRisk: "Low Risk",
        aiCompanion: "Active Watch",
        locationBroadcast: "Encrypted"
    },

    journeys: {
        total: 47
    },

    contacts: 3,

    guardianNetwork: false,

    activeJourney: false

};


/* =========================================================
   API CONFIGURATION
   =========================================================

   When your backend is ready, change:

   API_BASE_URL = "http://localhost:5000/api"

   Example endpoints:

   GET  /api/dashboard
   POST /api/journeys
   POST /api/sos
   GET  /api/notifications
   GET  /api/contacts
   POST /api/routes/calculate

   ========================================================= */

const API_BASE_URL = "";


/* =========================================================
   GENERIC API HELPER
   ========================================================= */

async function apiRequest(endpoint, options = {}) {

    const url = `${API_BASE_URL}${endpoint}`;

    try {

        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                ...(options.headers || {})
            },
            ...options
        });

        if (!response.ok) {
            throw new Error(
                `API Error: ${response.status}`
            );
        }

        return await response.json();

    } catch (error) {

        console.warn(
            "Backend unavailable:",
            error.message
        );

        return null;
    }
}


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const sidebar =
    document.getElementById("sidebar");

const menuButton =
    document.getElementById("menuButton");

const navItems =
    document.querySelectorAll(".nav-item");

const dashboardSection =
    document.getElementById("dashboardSection");

const pageSections =
    document.querySelectorAll(".page-section");

const toast =
    document.getElementById("toast");

const toastTitle =
    document.getElementById("toastTitle");

const toastMessage =
    document.getElementById("toastMessage");

const sosModal =
    document.getElementById("sosModal");


/* =========================================================
   SIDEBAR MOBILE
   ========================================================= */

menuButton?.addEventListener("click", () => {

    sidebar.classList.toggle("open");

});


/* =========================================================
   PAGE NAVIGATION
   ========================================================= */

function showSection(sectionName) {

    dashboardSection.classList.add("hidden");

    pageSections.forEach(section => {
        section.classList.add("hidden");
    });


    if (sectionName === "dashboard") {

        dashboardSection.classList.remove("hidden");

    } else {

        const section =
            document.getElementById(
                `${sectionName}Section`
            );

        if (section) {
            section.classList.remove("hidden");
        }
    }


    navItems.forEach(item => {

        item.classList.toggle(
            "active",
            item.dataset.section === sectionName
        );

    });


    sidebar.classList.remove("open");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


navItems.forEach(item => {

    item.addEventListener("click", () => {

        const section =
            item.dataset.section;

        showSection(section);

    });

});


/* =========================================================
   VIEW ALL BUTTONS
   ========================================================= */

document.querySelectorAll("[data-section]").forEach(button => {

    if (
        !button.classList.contains("nav-item")
    ) {

        button.addEventListener("click", () => {

            showSection(
                button.dataset.section
            );

        });

    }

});


/* =========================================================
   TOAST
   ========================================================= */

let toastTimer;

function showToast(
    title,
    message
) {

    toastTitle.textContent = title;

    toastMessage.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 3500);

}


/* =========================================================
   SOS
   ========================================================= */

function openSOS() {

    sosModal.classList.add("show");

}


function closeSOS() {

    sosModal.classList.remove("show");

}


document
    .getElementById("topSOS")
    ?.addEventListener(
        "click",
        openSOS
    );


document
    .getElementById("heroSOS")
    ?.addEventListener(
        "click",
        openSOS
    );


document
    .getElementById("sidebarSOS")
    ?.addEventListener(
        "click",
        openSOS
    );


document
    .getElementById("closeSOS")
    ?.addEventListener(
        "click",
        closeSOS
    );


document
    .getElementById("cancelSOS")
    ?.addEventListener(
        "click",
        closeSOS
    );


sosModal?.addEventListener(
    "click",
    event => {

        if (
            event.target === sosModal
        ) {
            closeSOS();
        }

    }
);


/* =========================================================
   SEND SOS
   ========================================================= */

document
    .getElementById("confirmSOS")
    ?.addEventListener(
        "click",
        async () => {

            const button =
                document.getElementById(
                    "confirmSOS"
                );

            button.disabled = true;

            button.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Sending...
            `;


            /*
                BACKEND REQUEST

                Example:

                const result = await apiRequest(
                    "/api/sos",
                    {
                        method: "POST",
                        body: JSON.stringify({
                            userId: "USER_ID",
                            latitude: location.latitude,
                            longitude: location.longitude
                        })
                    }
                );
            */


            await new Promise(
                resolve =>
                    setTimeout(resolve, 1200)
            );


            closeSOS();


            button.disabled = false;

            button.innerHTML = `
                <i class="fa-solid fa-phone"></i>
                Send SOS
            `;


            showToast(
                "SOS Alert Sent",
                "Your trusted contacts have been alerted."
            );

        }
    );


/* =========================================================
   START SAFE JOURNEY
   ========================================================= */

function startSafeJourney() {

    appState.activeJourney = true;

    appState.journeys.total++;

    document.getElementById(
        "journeyCount"
    ).textContent =
        appState.journeys.total;


    showToast(
        "Safe Journey Started",
        "AI Guardian is now monitoring your journey."
    );


    /*
        BACKEND EXAMPLE:

        await apiRequest(
            "/api/journeys",
            {
                method: "POST",
                body: JSON.stringify({
                    status: "active",
                    userId: "USER_ID"
                })
            }
        );
    */

}


document
    .getElementById("startJourney")
    ?.addEventListener(
        "click",
        () => {

            startSafeJourney();

        }
    );


/* =========================================================
   LIVE JOURNEY
   ========================================================= */

document
    .getElementById("liveStart")
    ?.addEventListener(
        "click",
        () => {

            appState.activeJourney = true;

            showToast(
                "Live Journey Active",
                "Your location and safety parameters are being monitored."
            );

        }
    );


/* =========================================================
   QUICK ACTION CARDS
   ========================================================= */

document
    .querySelectorAll(".action-card")
    .forEach(card => {

        card.addEventListener(
            "click",
            event => {

                /*
                    Prevent the card click from
                    duplicating a button action.
                */

                if (
                    event.target.closest("button")
                ) {
                    return;
                }


                const action =
                    card.dataset.action;


                if (action === "route") {

                    showSection("route");

                }

                else if (action === "sos") {

                    openSOS();

                }

                else if (action === "circle") {

                    showSection("circle");

                }

                else if (action === "map") {

                    showSection("map");

                }

            }
        );

    });


/* =========================================================
   QUICK ACTION BUTTONS
   ========================================================= */

document
    .querySelectorAll(".card-link")
    .forEach(button => {

        button.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                const text =
                    button.textContent
                        .trim()
                        .toLowerCase();


                if (
                    text.includes("route")
                ) {

                    showSection("route");

                }

                else if (
                    text.includes("sos")
                ) {

                    openSOS();

                }

                else if (
                    text.includes("circle")
                ) {

                    showSection("circle");

                }

                else if (
                    text.includes("map")
                ) {

                    showSection("map");

                }

            }
        );

    });


/* =========================================================
   SAFE ROUTE CALCULATOR
   ========================================================= */

document
    .getElementById("calculateRoute")
    ?.addEventListener(
        "click",
        async () => {

            const start =
                document.getElementById(
                    "startLocation"
                ).value.trim();

            const destination =
                document.getElementById(
                    "destination"
                ).value.trim();

            const result =
                document.getElementById(
                    "routeResult"
                );


            if (!start || !destination) {

                showToast(
                    "Missing Information",
                    "Please enter both starting location and destination."
                );

                return;
            }


            const button =
                document.getElementById(
                    "calculateRoute"
                );


            button.disabled = true;

            button.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Analyzing Routes...
            `;


            /*
                BACKEND API

                When backend is available:

                const data = await apiRequest(
                    "/api/routes/calculate",
                    {
                        method: "POST",
                        body: JSON.stringify({
                            start,
                            destination
                        })
                    }
                );

                Then use:

                data.routes
            */


            await new Promise(
                resolve =>
                    setTimeout(resolve, 1000)
            );


            result.innerHTML = `

                <div class="route-result-card">

                    <strong>
                        <i class="fa-solid fa-shield-halved"></i>
                        AI Safe Route Found
                    </strong>

                    <p>
                        Recommended route from
                        <b>${escapeHTML(start)}</b>
                        to
                        <b>${escapeHTML(destination)}</b>.
                    </p>

                    <p>
                        Safety Score:
                        <b style="color:#19b86b">
                            96/100
                        </b>
                        &nbsp; • &nbsp;
                        Estimated Time:
                        <b>24 min</b>
                    </p>

                </div>
            `;


            button.disabled = false;

            button.innerHTML = `
                <i class="fa-solid fa-wand-magic-sparkles"></i>
                Calculate Safe Routes
            `;


            showToast(
                "Route Calculated",
                "AI Guardian found a high-safety route."
            );

        }
    );


/* =========================================================
   PRESET DESTINATIONS
   ========================================================= */

document
    .querySelectorAll(".preset-row button")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const destination =
                    document.getElementById(
                        "destination"
                    );

                destination.value =
                    button.textContent.trim();


                showToast(
                    "Destination Selected",
                    `${button.textContent.trim()} selected as destination.`
                );

            }
        );

    });


/* =========================================================
   GUARDIAN NETWORK
   ========================================================= */

const networkToggle =
    document.getElementById(
        "networkToggle"
    );


networkToggle?.addEventListener(
    "change",
    async () => {

        appState.guardianNetwork =
            networkToggle.checked;


        if (
            networkToggle.checked
        ) {

            showToast(
                "Guardian Network Enabled",
                "Anonymous safety signals can now be shared."
            );

        } else {

            showToast(
                "Guardian Network Disabled",
                "Network sharing has been turned off."
            );

        }


        /*
            BACKEND:

            await apiRequest(
                "/api/settings/network",
                {
                    method: "PUT",
                    body: JSON.stringify({
                        enabled:
                            networkToggle.checked
                    })
                }
            );
        */

    }
);


/* =========================================================
   SYSTEM STATUS OVERRIDE
   ========================================================= */

const statusButtons =
    document.querySelectorAll(
        ".status-btn"
    );


statusButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const status =
                button.dataset.status;

            appState.safety.status =
                status;


            statusButtons.forEach(btn => {

                btn.classList.remove(
                    "active"
                );

            });

            button.classList.add(
                "active"
            );


            updateSafetyStatus(
                status
            );

        }
    );

});


function updateSafetyStatus(status) {

    const badge =
        document.querySelector(
            ".status-badge"
        );

    if (!badge) return;


    const statusMap = {

        safe: {
            text: "SAFE",
            color: "green"
        },

        monitoring: {
            text: "MONITORING",
            color: "orange"
        },

        alert: {
            text: "ALERT",
            color: "red"
        }

    };


    const current =
        statusMap[status];


    badge.innerHTML = `
        <span></span>
        ${current.text}
    `;


    if (status === "safe") {

        badge.style.background =
            "#ecfaf3";

        badge.style.color =
            "#14935a";

        badge.style.borderColor =
            "#ccefdc";

    }

    else if (
        status === "monitoring"
    ) {

        badge.style.background =
            "#fff7e9";

        badge.style.color =
            "#b77a12";

        badge.style.borderColor =
            "#f3dfb7";

    }

    else {

        badge.style.background =
            "#fff0f3";

        badge.style.color =
            "#df214b";

        badge.style.borderColor =
            "#f3c5cf";

    }


    showToast(
        "Safety Status Updated",
        `System status changed to ${current.text}.`
    );

}


/* =========================================================
   NOTIFICATION BUTTON
   ========================================================= */

document
    .getElementById("notificationButton")
    ?.addEventListener(
        "click",
        () => {

            showSection(
                "notifications"
            );

        }
    );


/* =========================================================
   PROFILE
   ========================================================= */

document
    .querySelector(".profile-button")
    ?.addEventListener(
        "click",
        () => {

            showToast(
                "Account",
                "Account settings are available in Settings."
            );

        }
    );


document
    .querySelector(".profile-card")
    ?.addEventListener(
        "click",
        () => {

            showSection("settings");

        }
    );


/* =========================================================
   KEYBOARD SHORTCUT
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        /*
            Pressing Escape closes modal
        */

        if (
            event.key === "Escape"
        ) {

            closeSOS();

        }

    }
);


/* =========================================================
   HTML ESCAPE
   ========================================================= */

function escapeHTML(value) {

    return value
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
   LOAD DASHBOARD DATA
   =========================================================

   This function is intentionally separated from UI logic.

   When your backend is ready, you can simply return
   actual database/API data here.

   ========================================================= */

async function loadDashboardData() {

    /*
        Example backend:

        const data = await apiRequest(
            "/api/dashboard"
        );

        if (!data) return;

        document.getElementById(
            "journeyCount"
        ).textContent =
            data.totalJourneys;

        document.getElementById(
            "profileName"
        ).textContent =
            data.user.name;
    */


    console.log(
        "AI Guardian dashboard initialized."
    );

}


/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadDashboardData();

    }
);