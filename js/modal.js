// Based on https://codepen.io/popmotion/pen/BdoOya

function createModal(target, columns, formated_lunch_box, random_id, item) {

    console.log("afafa");

    // const modalTriggerButtons = document.querySelectorAll("[data-modal-target]");
    const modals = document.querySelectorAll(".modal");
    const modalCloseButtons = document.querySelectorAll(".modal-close");

    // modalTriggerButtons.forEach(elem => {
    //     elem.addEventListener("click", event => toggleModal(event.currentTarget.getAttribute("data-modal-target")));
    // });

    target.addEventListener("click", event => toggleModal(event.currentTarget.getAttribute("data-modal-target")));

    modalCloseButtons.forEach(elem => {
        elem.addEventListener("click", event => toggleModal(event.currentTarget.closest(".modal").id));
    });
    modals.forEach(elem => {
        elem.addEventListener("click", event => {
            if (event.currentTarget === event.target) toggleModal(event.currentTarget.id);
        });
    });

    // Close Modal with "Esc"...
    document.addEventListener("keydown", event => {
        if (event.keyCode === 27 && document.querySelector(".modal.modal-show")) {
            toggleModal(document.querySelector(".modal.modal-show").id);
        }
    });

    function toggleModal(modalId) {
        const modal = document.getElementById(modalId);

        if (getComputedStyle(modal).display === "flex") { // alternatively: if(modal.classList.contains("modal-show"))
            modal.classList.add("modal-hide");
            setTimeout(() => {
                document.body.style.overflow = "initial";
                modal.classList.remove("modal-show", "modal-hide");
                modal.style.display = "none";
            }, 200);
        }
        else {
            document.body.style.overflow = "hidden";

            document.getElementById('modal-save-location').addEventListener('click', (e) => {
                saveMarker(formated_lunch_box, random_id, item)
                e.target.classList.add('modal-button-disabled');
                e.target.innerHTML = "Marker saved";
                console.log(e);
            }, { once: true }
            );

            document.getElementById('modal-header-1').innerHTML = columns[3] + " | " + columns[4];
            // 

            i = 1
            columns.forEach(elem => {
                document.getElementById('modal-data-row-' + i).innerHTML = elem;
                i++;
            });
            setTimeout(() => {
                modal.style.display = "flex";
                modal.classList.add("modal-show");
            }, 20);
        }
    }
}