// Based on https://codepen.io/popmotion/pen/BdoOya

function createModal(target, columns, formated_lunch_box, random_id, item) {

    const modals = document.querySelectorAll(".modal");
    const modalCloseButtons = document.querySelectorAll(".modal-close");

    target.addEventListener("click", event => {
        toggleModal(event.currentTarget.getAttribute("data-modal-target"))
        window.scrollTo(0, 0);
    });

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
                saveMarker(formated_lunch_box, random_id, columns['item'])
                e.target.classList.add('modal-button-disabled');
                e.target.innerHTML = "Marker saved";
            }, { once: true }
            );

            document.getElementById('modal-header-1').innerHTML = columns['item'] + " | " + columns['lot'];

            modalPropertiesContainer = document.getElementById('modal-properties-list');

            i = 1
            Object.entries(columns).forEach(([key, value]) => {
                newElem = document.createElement('li');
                newElem.classList.add('list-group-item');

                newElem2 = document.createElement('b');

                if (key == "bbd") {
                    final_key = "BBD";
                } else if (key == "sscc") {
                    final_key = "SSCC";
                } else {
                    final_key = capitalizeFirstLetter(key);
                }
                newElem2.innerHTML = final_key;

                newDiv = document.createElement('div');
                newDiv.innerHTML = value;
                newDiv.classList.add('float-right');

                newElem.appendChild(newElem2);
                newElem.appendChild(newDiv);

                modalPropertiesContainer.appendChild(newElem);
            });

            setTimeout(() => {
                modal.style.display = "flex";
                modal.classList.add("modal-show");
            }, 20);
        }
    }
}