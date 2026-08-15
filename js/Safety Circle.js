/* =========================================
   AI GUARDIAN — SAFETY CIRCLE JS
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const modal = document.getElementById("modal");
    const openModal = document.getElementById("openModal");
    const closeModal = document.getElementById("closeModal");
    const cancelModal = document.getElementById("cancelModal");

    const form = document.getElementById("contactForm");

    const searchInput = document.getElementById("searchInput");

    const filterButtons = document.querySelectorAll(".filter-btn");

    const contactsGrid = document.getElementById("contactsGrid");


    /* =========================================
       MODAL
    ========================================= */

    openModal.addEventListener("click", () => {
        modal.classList.add("show");
    });


    closeModal.addEventListener("click", () => {
        modal.classList.remove("show");
    });


    cancelModal.addEventListener("click", () => {
        modal.classList.remove("show");
    });


    modal.addEventListener("click", (event) => {

        if (event.target === modal) {
            modal.classList.remove("show");
        }

    });


    /* =========================================
       ADD CONTACT
    ========================================= */

    form.addEventListener("submit", (event) => {

        event.preventDefault();


        const name =
            document.getElementById("contactName").value.trim();

        const phone =
            document.getElementById("contactPhone").value.trim();

        const email =
            document.getElementById("contactEmail").value.trim();

        const category =
            document.getElementById("contactCategory").value;


        if (!name || !phone || !email) {
            alert("Please fill all contact details.");
            return;
        }


        const initials = getInitials(name);

        const categoryName =
            category.charAt(0).toUpperCase() + category.slice(1);


        const card = document.createElement("div");

        card.className = "contact-card";

        card.dataset.category = category;

        card.dataset.name = name;

        card.dataset.phone = phone;


        card.innerHTML = `

            <div class="card-top">

                <div class="person">

                    <div class="person-avatar">
                        ${initials}
                    </div>

                    <div>

                        <h3>${name}</h3>

                        <span>${categoryName}</span>

                    </div>

                </div>

                <span class="status">
                    Active
                </span>

            </div>


            <div class="contact-details">

                <div>
                    <i data-lucide="phone"></i>
                    ${phone}
                </div>

                <div>
                    <i data-lucide="mail"></i>
                    ${email}
                </div>

            </div>


            <div class="settings-row">

                <span>SOS & Warning Alerts</span>

                <label class="switch">

                    <input type="checkbox" checked>

                    <span class="slider"></span>

                </label>

            </div>


            <div class="settings-row">

                <span>Live GPS Sharing</span>

                <label class="switch">

                    <input type="checkbox" checked>

                    <span class="slider"></span>

                </label>

            </div>


            <div class="card-footer">

                <button class="test-alert">

                    <i data-lucide="bell"></i>

                    Test Alert

                </button>


                <div class="card-actions">

                    <button class="edit-btn">

                        <i data-lucide="pencil"></i>

                    </button>


                    <button class="delete-btn">

                        <i data-lucide="trash-2"></i>

                    </button>

                </div>

            </div>

        `;


        contactsGrid.appendChild(card);


        /* Create icons for newly added card */

        lucide.createIcons();


        /* Clear form */

        form.reset();


        /* Close modal */

        modal.classList.remove("show");


        /* Attach card functionality */

        attachCardEvents(card);

    });


    /* =========================================
       SEARCH
    ========================================= */

    searchInput.addEventListener("input", () => {

        filterContacts();

    });


    /* =========================================
       CATEGORY FILTER
    ========================================= */

    let currentFilter = "all";


    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            filterButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            currentFilter = button.dataset.filter;

            filterContacts();

        });

    });


    /* =========================================
       FILTER FUNCTION
    ========================================= */

    function filterContacts() {

        const searchText =
            searchInput.value.toLowerCase().trim();


        const cards =
            document.querySelectorAll(".contact-card");


        cards.forEach(card => {

            const name =
                card.dataset.name.toLowerCase();

            const phone =
                card.dataset.phone.toLowerCase();

            const category =
                card.dataset.category;


            const matchesSearch =
                name.includes(searchText) ||
                phone.includes(searchText);


            const matchesCategory =
                currentFilter === "all" ||
                category === currentFilter;


            if (matchesSearch && matchesCategory) {

                card.classList.remove("hidden");

            } else {

                card.classList.add("hidden");

            }

        });

    }


    /* =========================================
       CARD EVENTS
    ========================================= */

    document
        .querySelectorAll(".contact-card")
        .forEach(card => {

            attachCardEvents(card);

        });


    function attachCardEvents(card) {

        /* Test Alert */

        const testButton =
            card.querySelector(".test-alert");


        if (testButton) {

            testButton.addEventListener("click", () => {

                const name =
                    card.dataset.name;


                showNotification(
                    `Test alert sent to ${name}`
                );

            });

        }


        /* Delete */

        const deleteButton =
            card.querySelector(".delete-btn");


        if (deleteButton) {

            deleteButton.addEventListener("click", () => {

                const name =
                    card.dataset.name;


                const confirmDelete =
                    confirm(
                        `Remove ${name} from your Safety Circle?`
                    );


                if (confirmDelete) {

                    card.remove();

                }

            });

        }


        /* Edit */

        const editButton =
            card.querySelector(".edit-btn");


        if (editButton) {

            editButton.addEventListener("click", () => {

                const name =
                    card.dataset.name;


                alert(
                    `Edit contact: ${name}\n\nYou can connect this button to your edit form/backend.`
                );

            });

        }


        /* Toggle */

        const toggles =
            card.querySelectorAll(
                '.switch input'
            );


        toggles.forEach(toggle => {

            toggle.addEventListener("change", () => {

                const type =
                    toggle.closest(".settings-row")
                    .querySelector("span")
                    .textContent;


                const status =
                    toggle.checked
                        ? "enabled"
                        : "disabled";


                console.log(
                    `${type} ${status}`
                );

            });

        });

    }


    /* =========================================
       INITIALS
    ========================================= */

    function getInitials(name) {

        const words =
            name.split(" ");

        if (words.length === 1) {

            return words[0]
                .substring(0, 2)
                .toUpperCase();

        }

        return (
            words[0][0] +
            words[words.length - 1][0]
        ).toUpperCase();

    }


    /* =========================================
       SMALL NOTIFICATION
    ========================================= */

    function showNotification(message) {

        const notification =
            document.createElement("div");


        notification.textContent = message;


        notification.style.position = "fixed";

        notification.style.right = "25px";

        notification.style.bottom = "25px";

        notification.style.background = "#ff1456";

        notification.style.color = "white";

        notification.style.padding =
            "12px 18px";

        notification.style.borderRadius =
            "9px";

        notification.style.fontSize =
            "11px";

        notification.style.fontWeight =
            "600";

        notification.style.boxShadow =
            "0 8px 25px rgba(255,20,86,0.2)";

        notification.style.zIndex = "999";


        document.body.appendChild(notification);


        setTimeout(() => {

            notification.remove();

        }, 2500);

    }

});