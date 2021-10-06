// Declaring variables/constants
const downloadBtn = document.getElementById("download-btn");
const uploadBtn = document.getElementById("upload-btn");
const revertBtn = document.getElementById("revert-btn");
const canvas = document.getElementById("canvas");
const canvas_ctx = canvas.getContext("2d");
const image = document.getElementById("preview");

let fileType;
let img = new Image();
let fileName = "";

// Request image file when the canvas is clicked
function upload() {
    uploadBtn.click();
}

// Upload File
uploadBtn.addEventListener("change", () => {
    // Get File
    const file = uploadBtn.files[0];
    
    // Init FileReader API
    const reader = new FileReader();
  
    // Check for file
    if (file) {
      // Set file name and type
      fileName = file.name;
      fileType = file.type;

      // Read data as URL
      reader.readAsDataURL(file);
    }

    // Add image to canvas
    reader.addEventListener("load", () => {
            // Set image src
            img.src = reader.result;
            
            // Add to canvas
            img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;
                canvas_ctx.imageSmoothingEnabled = false;
                canvas_ctx.drawImage(img, 0, 0, img.width, img.height);

                // Show resized image in preview element
                update_preview();
            };
    }, false);
});

// Update the preview <img> image to the canvas
function update_preview() {
    canvas.removeAttribute("data-caman-id");
    var dataurl = canvas.toDataURL();
    image.src = dataurl;
    console.log("updating");
}

// Add a bootstrap toooltip to every tag that has "tt" class
const tooltips = document.querySelectorAll(".tt");
tooltips.forEach((t) => {
  new bootstrap.Tooltip(t);
});

// A function that takes a class name and a bool "state" to hide/show tags
function hidden(state, cls) {
  var tools = document.getElementsByClassName(cls);
  for (let i = 0; i < tools.length; i++) {
    tools[i].hidden = state;
  }
}

hidden(true, "tool");
hidden(true, "filter");
hidden(false, "crop");
hidden(false, "brightness");

// Show tool requirments
document.getElementById("tools").onchange = function () {
  hidden(true, "tool");

  var elements = document.getElementsByClassName(this.value);
  for (let i = 0; i < elements.length; i++) {
    elements[i].hidden = false;
  }
};

// Show filter requirments
document.getElementById("filters").onchange = function () {
  hidden(true, "filter");

  var elements = document.getElementsByClassName(this.value);
  for (let i = 0; i < elements.length; i++) {
    elements[i].hidden = false;
  }
};

// Revert Filters
revertBtn.addEventListener("click", e => {
    Caman("#canvas", img, function() {
      this.revert(function() {
        update_preview();
      });
    });
  });

// <---------------------------------------------------------------Debugging and Handling jobs---------------------------------------------------------->

// Listen to all CamanJS instances
Caman.Event.listen("processStart", function (job) {
    console.log("Start:", job.name);
});

Caman.Event.listen("processComplete", function (job) {
    console.log("Completed:", job.name);
});

// <---------------------------------------------------------------------Zoom In/Out----------------------------------------------------------------->

let zoom = 6;
const zoomInBtn = document.getElementById("zoomInBtn");
const zoomOutBtn = document.getElementById("zoomOutBtn");
const zoomValue = document.getElementById("zoom_value");
updateZoomBtns();

function zoomIn() {
	column = document.getElementById("preview_img")

	column.classList.remove("col-" + zoom);
	zoom++;
	column.classList.add("col-" + zoom);
	updateZoomBtns();
}

function zoomOut() {
	column = document.getElementById("preview_img")

	column.classList.remove("col-" + zoom);
	zoom--;
	column.classList.add("col-" + zoom);
	updateZoomBtns();
}

function updateZoomBtns() {
	if (zoom == 12) {
		zoomInBtn.disabled = true;
	} 
	else if (zoom == 1) {
		zoomOutBtn.disabled = true;
	}
	else {
		zoomInBtn.disabled = false;
		zoomOutBtn.disabled = false;
	}

	zoomValue.value = parseInt(zoom/12 * 100) + "%";
}

// <---------------------------------------------------------------------Filters--------------------------------------------------------------------->

// Brightness
const input_value = document.getElementById("brightness_value");

function updateBrightnessValue(controller) {
	if (controller == "+") {
		input_value.value = parseInt(input_value.value) + 5;
		brightness(5);
	}
	else if (controller == "-") {
		input_value.value = parseInt(input_value.value) - 5;
		brightness(-5);
	}
}

// Apply brightness filter on image
function brightness(amount) {
    Caman("#canvas", function() {
        this.brightness(amount).render(function() {
            update_preview();
        });
    });
}