// Declaring variables/constants
const downloadBtn = document.getElementById("download-btn");
const uploadBtn = document.getElementById("upload-btn");
const revertBtn = document.getElementById("revert-btn");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const image = document.getElementById("preview");

let img = new Image();
let fileName = "";

// Request image file when the canvas is clicked
function upload() {
    uploadBtn.click();
}

// enable buttons
function enableBtns(state) {
    if (state == true) {
        document.getElementById("zoomBtns").style = "";
        document.getElementById("pills-tabContent").style = "";
        downloadBtn.style = "";
        revertBtn.disabled = false;
    } else {
        document.getElementById("zoomBtns").style = "pointer-events: none; opacity: 0.4;";
        document.getElementById("pills-tabContent").style = "pointer-events: none; opacity: 0.4;";
        downloadBtn.style = "pointer-events: none; opacity: 0.4;";
        revertBtn.disabled = true;
    }
}

// disable all buttons onload
enableBtns(false);

// Upload File
uploadBtn.addEventListener("change", () => {
    // enable buttons
    enableBtns(true);

    // clear previous filters/efftects
    revertBtn.click();

    // Get File
    const file = uploadBtn.files[0];
    
    // Init FileReader API
    const reader = new FileReader();
  
    // Check for file
    if (file) {
      // Set file name and type
      fileName = file.name;

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
  var elments = document.getElementsByClassName(cls);
  for (let i = 0; i < elments.length; i++) {
    elments[i].hidden = state;
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

// Revert to orignal
revertBtn.addEventListener("click", (e) => {
    contrast_value.value = 0; 
    vibrance_value.value = 0;
    brightnees_value.value = 0;
    saturation_value.value = 0;
    Caman("#canvas", img, function() {
      this.revert();
    });
});

// Download Image
/*
downloadBtn.addEventListener("click", () => {
    const dImage = canvas.toDataURL();
    const link = document.createElement('a');
    
    link.onclick = "return false"
    link.href = dImage;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
})
*/
// <-----------------------------------------------------Debugging and Handling jobs-------------------------------------------------->

// Listen to all CamanJS instances
Caman.Event.listen("processStart", function (job) {
    console.log("Start:", job.name);
    enableBtns(false);
});

Caman.Event.listen("processComplete", function (job) {
    console.log("Completed:", job.name);
    enableBtns(true);
});

function enableDebugging() {
    Caman.DEBUG = true;
}

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
// <------------------------------------------------------------Image manipulation | Tools ------------------------------------------------>

function useTool() {
    let tool = document.getElementsByClassName(document.getElementById("tools").value)[0].id;
    
    if (tool == "rotate_tool") {
        console.log("rotating");
        rotateImg();
    }
}



// <------------------------------------------------------------Image manipulation | Filters ------------------------------------------------>

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

// vintage effect
function vintage() {
    Caman("#canvas", img, function () {
        this.vintage().render();
    });
}

// lomo effect
function lomo() {
    Caman("#canvas", img, function () {
        this.lomo().render();
    });
}

// greyscale effect
function greyscale() {
    Caman("#canvas", img, function () {
        this.greyscale().render();
    });
}

// clarity effect
function clarity() {
    Caman("#canvas", img, function () {
        this.clarity().render();
    });
}

// sinCity effect
function sinCity() {
    Caman("#canvas", img, function () {
        this.sinCity().render();
    });
}

// crossProcess effect
function crossProcess() {
    Caman("#canvas", img, function () {
        this.crossProcess().render();
    });
}

// pinhole effect
function pinhole() {
    Caman("#canvas", img, function () {
        this.pinhole().render();
    });
}

// nostalgia effect
function nostalgia() {
    Caman("#canvas", img, function () {
        this.nostalgia().render();
    });
}

// herMajesty effect
function herMajesty() {
    Caman("#canvas", img, function () {
        this.herMajesty().render();
    });
}

// orangePeel effect
function orangePeel() {
    Caman("#canvas", img, function () {
        this.orangePeel().render();
    });
}

// love effect
function love() {
    Caman("#canvas", img, function () {
        this.love().render();
    });
}

// grungy effect
function grungy() {
    Caman("#canvas", img, function () {
        this.grungy().render();
    });
}

// jarques effect
function jarques() {
    Caman("#canvas", img, function () {
        this.jarques().render();
    });
}

// oldBoot effect
function oldBoot() {
    Caman("#canvas", img, function () {
        this.oldBoot().render();
    });
}

// glowingSun effect
function glowingSun() {
    Caman("#canvas", img, function () {
        this.glowingSun().render();
    });
}

// hazyDays effect
function hazyDays() {
    Caman("#canvas", img, function () {
        this.hazyDays().render();
    });
}

// hemingway effect
function hemingway() {
    Caman("#canvas", img, function () {
        this.hemingway().render();
    });
}

// concentrate effect
function concentrate() {
    Caman("#canvas", img, function () {
        this.concentrate().render();
    });
}

// stackBlur effect
function stackBlur() {
    Caman("#canvas", img, function () {
        console.log("Started: stackBlur");
        this.stackBlur(15).render(function() {
            console.log("Completed: stackBlur");
        });
    });
}

// <---------------------------------------------------------------------------------------------------------------------------------->


