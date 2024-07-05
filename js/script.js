function searchCSV(inputValue) {
    const csvData = localStorage.getItem('csvData');
    const searchResultsContainer = document.getElementById('search-results');
    searchResultsContainer.innerHTML = '';
    let count = 0;

    if (csvData) {
        const rows = csvData.split('\n');

        for (let i = 0; i < rows.length; i++) {
            if (i < 4) {
                continue;
            }
            const columns = rows[i].split(';');

            // columns[10] = Location
            if (!isValidFormat(columns[10])) {
                // console.error("Invalid location " + columns[10]);
                // console.error("Line " + columns);
                continue;
            }

            var raw_lunch_box = columns[10].substring(3).split('-')[0].replace(/^0+/, '');
            if (raw_lunch_box > 12) {
                // console.error("Unsupported location " + lunch_box);
                // console.error("Line " + columns);
                continue;
            }

            if (columns.length >= 2 && (columns[3].toLowerCase().includes(inputValue.toLowerCase()) || columns[4].toLowerCase().includes(inputValue.toLowerCase()))) {
                const random_id = Math.floor(Math.random() * 1000000);
                const resultDiv = createResultDiv(columns, random_id, count);
                searchResultsContainer.appendChild(resultDiv);

                count++;
            }
        }
        
    }
    if (count === 0) {
        const resultDiv = createNotFoundDiv(inputValue);
        searchResultsContainer.appendChild(resultDiv);
    }
}

function isValidFormat(str) {
    // Regex pattern to match the expected format
    var pattern = /H2\/\d*-\d*-\d*/;

    // Check if the string matches the pattern and is not equal to "FRYS-1"
    return pattern.test(str);
}

function createResultDiv(columns, random_id, count) {
    const [null1, null2, null3, item, lot, null6, null7, null8, null9, null10, lunch_box, null12, null13, null14, null15, null16, null17, null18, null19] = columns;

    // Split the remaining string by the '-' character
    var lunch_box_split = lunch_box.substring(3).split('-');
    const raw_lunch_box = lunch_box_split[0].replace(/^0+/, '');

    // console.log(lunch_box + "|" + lunch_box_split[0] + "|" + lunch_box_split[1] + "|" + lunch_box_split[2]);
    // console.log(columns);

    const formated_lunch_box = "L" + raw_lunch_box;
    const lunch_box_row = lunch_box_split[1].replace(/^0+/, '');
    const lunch_box_position = lunch_box_split[2].replace(/^0+/, '');

    if (null3 == "CAT"){
        logo = "/images/logo/cater_food_web2.png";
    } else {
        logo = "/images/unkown_image.jpg";
    }
    const newDiv = document.createElement('div');
    newDiv.innerHTML = `
        <img class="color-${formated_lunch_box}" src="${logo}" alt="${item}" />
        <div class="result-name">${item} | ${lot}</div>
        <div class="result-extra-info">
            <div>Reol <span class="">${raw_lunch_box}</span></div>
            <div>Række <span class="">${lunch_box_row}</span></div>
            <div>Hylde <span class="">${lunch_box_position}</span></div>
        </div>
    `;
    newDiv.classList.add('result', 'pop-in', 'modal-trigger');
    newDiv.style.animationDelay = `${count * 0.1}s`;

    // Add event listeners
    newDiv.addEventListener('mouseenter', () => hideOtherMarkers(random_id));
    newDiv.addEventListener('mouseleave', showOtherMarkers);
    newDiv.setAttribute('data-modal-target', 'modal1');
    createModal(newDiv, columns, formated_lunch_box, random_id, item);
    // newDiv.addEventListener('click', () => saveMarker(formated_lunch_box, random_id, item));
    // document.getElementById('modal-save-location').addEventListener('click', () => saveMarker(formated_lunch_box, random_id, item));

    // Add map marker
    addMarker(item, formated_lunch_box, lunch_box_row, random_id); // Pass latitude and longitude

    return newDiv;
}

function createNotFoundDiv(inputValue) {
    const newDiv = document.createElement('div');
    newDiv.innerHTML = `
        <img class="" src="images/Pedro.gif" >
        <div class="result-name">Not found: ${inputValue}</div>
        <div class="result-extra-info">
            <div>Lunchbox <span class="">n/a</span></div>
            <div>Row <span class="">n/a</span></div>
            <div>Position <span class="">n/a</span></div>
        </div>
    `;
    newDiv.classList.add('result', 'pop-in');
    newDiv.style.animationDelay = '0s'; // No delay for not found items

    return newDiv;
}


function hideOtherMarkers(random_id) {
    const mapContainer = document.getElementById('map-pins');
    const mapPins = mapContainer.querySelectorAll('.mapmarker');
    mapPins.forEach(pin => {
        if (!pin.id.includes(random_id)) {
            pin.style.display = 'none'; // Hide pin
        }
    });
}


function showOtherMarkers() {
    const mapContainer = document.getElementById('map-pins');
    const mapPins = mapContainer.querySelectorAll('.mapmarker');
    mapPins.forEach(pin => {
        pin.style.display = 'unset'; // Hide pin
    });
}

function clearMarker() {
    const mapContainer = document.getElementById('map-pins');
    const mapPins = mapContainer.querySelectorAll('div'); // Select all div elements under map-pins
    mapPins.forEach(pin => {
        // Update innerHTML for each child div
        pin.innerHTML = ''; // You can set any content you want here
    });
    // mapContainer.innerHTML = '';
}

function saveMarker(lunch_box, marker_id, marker_name) {
    var storedPinsIds = JSON.parse(localStorage.getItem('savedPinsIds')) || [];

    var originalParent = document.getElementById(lunch_box);
    if (!originalParent) {
        console.error("The original parent with ID '" + lunch_box + "' doesn't exist.");
        return;
    }

    var suffixes = ['_marker', '_pulse', '_text'];
    var originalElems = [];
    var copiedElems = [];

    suffixes.forEach(function (suffix) {
        var originalElem = document.getElementById(marker_id + suffix);
        if (originalElem) {
            originalElems.push(originalElem);
            var clonedElem = originalElem.cloneNode(true);
            if (suffix === '_marker') {
                clonedElem.classList.add('pin-saved');
            } else if (suffix === '_pulse') {
                clonedElem.classList.add('pulse-saved');
            }
            clonedElem.classList.add('pin-pointer');
            clonedElem.addEventListener('click', function () {
                removeSavedMarker(marker_id);
            });
            copiedElems.push(clonedElem);
        }
    });

    if (originalElems.length > 0) {
        var copiedParent = originalParent.cloneNode(false);
        copiedParent.id = copiedParent.id + '_saved';

        copiedElems.forEach(function (copiedElem) {
            copiedParent.appendChild(copiedElem);
        });

        var savedPinContainer = document.getElementById('map-pins-saved');
        if (savedPinContainer) {
            savedPinContainer.appendChild(copiedParent);
        } else {
            console.error("The div with ID 'map-pins-saved' doesn't exist.");
            return;
        }

        var paragraph = document.createElement('p');
        paragraph.id = marker_id + '_saved-list';
        paragraph.innerHTML = marker_name + '<span>×</span>';

        var savedListDiv = document.getElementById('map-pins-saved-list');
        if (savedListDiv) {
            savedListDiv.appendChild(paragraph);
            paragraph.addEventListener('click', function () {
                removeSavedMarker(marker_id);
            });
        } else {
            console.error("The div with ID 'map-pins-saved-list' doesn't exist.");
            return;
        }
    } else {
        console.error("The original parent or the original div doesn't exist.");
        return;
    }

    suffixes.push('_saved-list');
    suffixes.forEach(function (suffix) {
        storedPinsIds.push(marker_id + suffix);
    });

    localStorage.setItem('savedPinsIds', JSON.stringify(storedPinsIds));

    updateSavedMarkerStorage();
}

function removeSavedMarker(marker_id) {
    var suffixes = ['_marker', '_pulse', '_text', '_saved-list'];

    suffixes.forEach(function (suffix) {
        var element = document.getElementById(marker_id + suffix);
        if (element) {
            element.remove();
        }
    });

    updateSavedMarkerStorage();
}

function updateSavedMarkerStorage() {
    var savedPins = document.getElementById('map-pins-saved');
    var savedPinsList = document.getElementById('map-pins-saved-list');
    var storedPinsIds = JSON.parse(localStorage.getItem('savedPinsIds')) || [];

    if (savedPins && savedPinsList && storedPinsIds.length > 0) {
        var pinsIds = storedPinsIds.filter(function (id) {
            return document.getElementById(id);
        });

        localStorage.setItem('savedPins', savedPins.innerHTML);
        localStorage.setItem('savedPinsList', savedPinsList.innerHTML);
        localStorage.setItem('savedPinsIds', JSON.stringify(pinsIds));
    }
}

function isEven(number) {
    return number % 2 === 0;
}

// L1 = lunchbox
// Tæller fra middergang 
// 32 items per række


// række
// 1 = top
// 2 = bottom
// 3 = top begved
// 4 = bund bagved

function addMarker(name, lunch_box, position, random_id) {
    const totalItems = 44;

    const mapContainer = document.getElementById(lunch_box);
    const marker = document.createElement('div');
    const markerPulse = document.createElement('div');
    const markerText = document.createElement('div');

    // Generate unique identifiers
    const markerId = random_id + "_marker";
    const markerPulseId = random_id + "_pulse";
    const markerTextId = random_id + "_text";

    // Set unique identifiers
    marker.id = markerId;
    markerPulse.id = markerPulseId;
    markerText.id = markerTextId;

    // Calculate position inside div
    percentage = ((totalItems - position + 1) / totalItems) * 100 + "%";

    if (isEven(parseInt(lunch_box.match(/\d+/)[0]))) {
        front = "0%"
        side = "pin-even"
    } else {
        front = "100%"
        side = "pin-uneven"
    }

    marker.className = side + ' mapmarker pin ';
    // Adjust marker position based on latitude and longitude
    marker.style.left = front; // You need to calculate this based on your image dimensions
    marker.style.top = percentage; // You need to calculate this based on your image dimensions

    markerPulse.className = side + ' mapmarker pulse';
    // Adjust marker position based on latitude and longitude
    markerPulse.style.left = front; // You need to calculate this based on your image dimensions
    markerPulse.style.top = percentage; // You need to calculate this based on your image dimensions

    markerText.className = 'mapmarker text';
    // Adjust marker position based on latitude and longitude
    markerText.innerHTML = name;
    markerText.style.left = front; // You need to calculate this based on your image dimensions
    markerText.style.top = percentage; // You need to calculate this based on your image dimensions
    mapContainer.appendChild(marker);
    mapContainer.appendChild(markerPulse);
    mapContainer.appendChild(markerText);
}

function clear_input(event2) {
    const inputBox = document.getElementById('search-input-field');
    var event = new KeyboardEvent('keyup', {
        key: 'Backspace',           // Specify the key you want to simulate
        code: 'Backspace',       // Specify the code of the key (optional)
        keyCode: 83,        // Specify the key code (optional)
        which: 83,          // Specify the key code (optional)
        bubbles: true       // Allow the event to bubble up (optional)
    });
    inputBox.value = '';
    inputBox.dispatchEvent(event);
}





// Preload the CSV file
document.addEventListener('DOMContentLoaded', async function () {
    // Check for localStorage support
    if (!localStorage) {
        console.error('LocalStorage is not supported in this browser.');
        return;
    }

    if (!localStorage.getItem('csvData')) {
        document.getElementById('input-background').classList.add('blink-class');
    }

    // Restore saved pins

    // Retrieve stored divs from localStorage
    const storedPins = localStorage.getItem('savedPins');
    const storedPinsList = localStorage.getItem('savedPinsList');
    const storedPinsIds = localStorage.getItem('savedPinsIds');

    // Get references to the divs in the document
    const savedPins = document.getElementById('map-pins-saved');
    const savedPinsList = document.getElementById('map-pins-saved-list');

    // Check if both the stored divs and the corresponding divs in the document exist
    if (storedPins && storedPinsList && savedPins && savedPinsList && storedPinsIds) {
        try {
            const storedPinsIdsArray = JSON.parse(storedPinsIds);

            savedPins.innerHTML = storedPins;
            savedPinsList.innerHTML = storedPinsList;

            storedPinsIdsArray.forEach(markerId => {
                const element = document.getElementById(markerId);
                if (element) {
                    element.addEventListener('click', () => {
                        removeSavedMarker(markerId.split('_')[0]);
                    });
                } else {
                    console.error('Element with ID', markerId, 'not found.');
                }
            });
        } catch (error) {
            console.error('Error parsing storedPinsIds:', error);
        }
    } else {
        console.error('Could not find one or more of the required elements.');
    }

    // Setup search box
    const inputBox = document.getElementById('search-input-field');
    const inputBoxIcon = document.getElementById('search-input-icon');
    const searchResultsContainer = document.getElementById('search-results');

    // Event listener for input event
    inputBox.addEventListener('keyup', function (event) {
        const inputValue = event.target.value.trim(); // Trim whitespace
        clearMarker();
        if (inputValue === '' || inputValue.length < 3) {
            searchResultsContainer.innerHTML = ''; // Clear search results if input is empty
            searchResultsContainer.classList.add('overflow-hidden');
            event.target.classList.remove('filled'); // Remove 'filled' class if input is empty
            inputBoxIcon.classList.remove('filled2'); // Remove 'filled' class if input is empty

        } else {
            searchCSV(inputValue); // Search CSV for input value
            searchResultsContainer.classList.remove('overflow-hidden');
            event.target.classList.add('filled'); // Add 'filled' class if input has content
            inputBoxIcon.classList.add('filled2'); // Add 'filled' class if input has content
        }
    });

});