// Misc javascript functions


document.addEventListener('DOMContentLoaded', async function () {

    document.getElementById('input-container').addEventListener('click', function (event) {
        document.getElementById('fileInput').click();
    });

    document.getElementById('fileInput').addEventListener('change', function (event) {
        // Get the selected file
        const file = event.target.files[0];

        if (file) {

            localStorage.removeItem('csvData');
            const reader = new FileReader();

            // Read the file as text
            reader.readAsText(file);

            // Define the callback for the FileReader
            reader.onload = function (e) {
                const fileContent = e.target.result;

                // Save the file content to local storage
                localStorage.setItem('csvData', fileContent);

                document.getElementById('input-background').classList.remove('blink-class');
                // console.log('File uploaded and saved in local storage.');

                // Clear the input field
                event.target.value = '';
            };
        }
    });





    // Site background
    images_path = "/images/background/"
    var img_array = [
        "url('" + images_path + "main_lager.png')",
    ];

    var random = Math.floor(Math.random() * img_array.length) + 0;
    document.getElementById("background").style.backgroundImage = img_array[random];





    // Map background
    images_path = "/images/maps/"
    var img_array = [
        // { image: images_path + "test.png", seconds_image: 1, image2: images_path + "pedro.gif" },
        { image: images_path + "lager_v1.png", seconds_image: 0, image2: "" },
    ];

    var random = Math.floor(Math.random() * img_array.length) + 0;
    document.getElementById("map").src = img_array[random].image;

    if (img_array[random].seconds_image) {
        let mapElement = document.getElementById("map-container");
        let referenceNode = document.getElementById("map-pins-saved-list");

        divElement = document.createElement("div");
        divElement.style = "height: 100%; width: 100%; position: absolute; display: flex;";

        divElement2 = document.createElement("div");
        divElement2.style = "margin: auto;";

        imgElement = document.createElement("img");
        imgElement.src = img_array[random].image2; // Optional: Set alt text for accessibility
        imgElement.style = "height: 17vh; /* width: 20vh; */";

        divElement.appendChild(divElement2);
        divElement2.appendChild(imgElement);
        mapElement.insertBefore(divElement, referenceNode);
    }





    // Darkness reader
    var darknessValue = parseFloat(localStorage.getItem('darkness')) * 100 || 0;
    var darknessInput = document.getElementById('darkness');
    const darkness_setting = document.getElementById('darkness-setting');
    var moon_phase = "2";

    function updateDarkness(value) {
        document.body.style.backgroundColor = 'rgba(0, 0, 0, ' + value / 100 + ')';

        darkness_setting.innerHTML = getMoonPhase(value)[0];
        darkness_setting.style = getMoonPhase(value)[1];
        localStorage.setItem('darkness', value / 100);
    }

    function getMoonPhase(value) {
        let moon_phase = [];
        if (value >= 0 && value <= 20) {
            moon_phase[0] = "🌕";
            moon_phase[1] = "transform: scale(1, 1);"
        } else if (value >= 21 && value <= 40) {
            moon_phase[0] = "🌖";
            moon_phase[1] = "transform: scale(1, 1);"
        } else if (value >= 41 && value <= 60) {
            moon_phase[0] = "🌗";
            moon_phase[1] = "transform: scale(1, 1);"
        } else if (value >= 61 && value <= 80) {
            moon_phase[0] = "🌒";
            moon_phase[1] = "transform: scale(-1, 1);"
        } else if (value >= 81 && value <= 100) {
            moon_phase[0] = "🌑";
            moon_phase[1] = "transform: scale(1, 1);"
        } else {
            moon_phase = "Invalid value";
        }


        return moon_phase;
    }

    // Initialize darkness value
    darknessInput.value = darknessValue;
    updateDarkness(darknessValue);

    // Add an event listener to detect changes in the input value
    darknessInput.addEventListener('input', function () {
        updateDarkness(darknessInput.value);
    });
});




function capitalizeFirstLetter(string) {
    if (string.length === 0) return string; // Return the empty string if input is empty
    return string.charAt(0).toUpperCase() + string.slice(1);
}