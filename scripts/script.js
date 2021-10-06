// Declaring variables/constants
const downloadBtn = document.getElementById("download-btn");
const uploadBtn = document.getElementById("upload-btn");
const revertBtn = document.getElementById("revert-btn");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
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
    // clear previous filters/efftects
    revertBtn.click();

    // enable buttons
    downloadBtn.disabled = false;
    revertBtn.disabled = false;
    document.getElementById("pills-tabContent").style = "";
    document.getElementById("zoomBtns").style = "";

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
                ctx.drawImage(img, 0, 0, img.width, img.height);
                canvas.removeAttribute("data-caman-id");

                Caman("#canvas", img, function() {
                    this.render();
                });
            };
    }, false);

});

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
revertBtn.addEventListener("click", (e) => {
    contrast_value.value = 0; 
    vibrance_value.value = 0;
    brightnees_value.value = 0;
    saturation_value.value = 0;
    Caman("#canvas", img, function() {
      this.revert();
    });
});

// Download edited Image
downloadBtn.addEventListener("click", (e) => {
    const dImage = canvas.toDataURL();
    const link = document.createElement('a');

    link.href = dImage;
    link.download = fileName;
    link.click();
})

// <-----------------------------------------------------Debugging and Handling jobs-------------------------------------------------->

// Listen to all CamanJS instances
Caman.Event.listen("processStart", function (job) {
    console.log("Start:", job.name);
});

Caman.Event.listen("processComplete", function (job) {
    console.log("Completed:", job.name);
});

// <-----------------------------------------------------------Zoom In/Out-------------------------------------------------------->

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

// <------------------------------------------------------------Image manipulation------------------------------------------------>

const brightnees_value = document.getElementById("brightness_value");
const contrast_value = document.getElementById("contrast_value");
const saturation_value = document.getElementById("saturation_value");
const vibrance_value = document.getElementById("vibrance_value");

// Brightness Filter
function brightness(controller) {
	if (controller == "+") {
		Caman("#canvas", img, function() {
            this.brightness(5).render(function() {
                brightnees_value.value = parseInt(brightnees_value.value) + 5;
            });
        });
	}
	else if (controller == "-") {
		Caman("#canvas", img, function() {
            this.brightness(-5).render(function() {
                brightnees_value.value = parseInt(brightnees_value.value) - 5;
            });
        });
	}
}

// contrast filter
function contrast(controller) {
	if (controller == "+") {
        Caman("#canvas", img, function() {
            this.contrast(5).render(function() {
                contrast_value.value = parseInt(contrast_value.value) + 5;
            });
        });
	}
	else if (controller == "-") {
        Caman("#canvas", img, function() {
            this.contrast(-5).render(function() {
                contrast_value.value = parseInt(contrast_value.value) - 5;
            });
        });
	}
}

// saturation filter
function saturation(controller) {
	if (controller == "+") {
        Caman("#canvas", img, function() {
            this.saturation(5).render(function() {
                saturation_value.value = parseInt(saturation_value.value) + 5;
            });
        });
	}
	else if (controller == "-") {
        Caman("#canvas", img, function() {
            this.saturation(-5).render(function() {
                saturation_value.value = parseInt(saturation_value.value) - 5;
            });
        });
	}
}

// vibrance filter
function vibrance(controller) {
	if (controller == "+") {
        Caman("#canvas", img, function() {
            this.vibrance(5).render(function() {
                vibrance_value.value = parseInt(vibrance_value.value) + 5;                
            });
        });
	}
	else if (controller == "-") {
        Caman("#canvas", img, function() {
            this.vibrance(-5).render(function() {
                vibrance_value.value = parseInt(vibrance_value.value) - 5;
            });
        });
	}
}

// sepia effect
function sepia() {
    Caman("#canvas", img, function () {
        this.sepia(50).render();
    });
}

// <---------------------------------------------------------------------------------------------------------------------------------->


