// Declaring variables/constants
const downloadBtn = document.getElementById("download-btn");
const downloadSideBar = document.getElementById("download_sidebar");
const download_filetype = document.getElementById("download_filetype");
const download_filename = document.getElementById("download_filename");
const uploadBtn = document.getElementById("upload-btn");
const revertBtn = document.getElementById("revert-btn");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let img = new Image();
let orignalImg = "";
let fileName = "";

// Request image file when the canvas is clicked
function upload() {
    uploadBtn.click();
}

// enable buttons
function enableBtns(state, spinner) {
    if (state == true) {
        document.getElementById("zoomBtns").style = "";
        document.getElementById("pills-tabContent").style = "";
        downloadSideBar.disabled = false;
        revertBtn.disabled = false;
        showSpinner(false);
    } else {
        document.getElementById("zoomBtns").style = "pointer-events: none; opacity: 0.4;";
        document.getElementById("pills-tabContent").style = "pointer-events: none; opacity: 0.4;";
        downloadSideBar.disabled = true;
        revertBtn.disabled = true;
        if (spinner == false) return;
        showSpinner(true);
    }
}

// disable all buttons onload
enableBtns(false, false);

// Upload File
uploadBtn.addEventListener("change", () => {
    // clear previous filters/efftects
    revertBtn.click();

    // Get File
    const file = uploadBtn.files[0];
    
    // Init FileReader API
    const reader = new FileReader();
  
    // Check for file
    if (file) {
        if (['image/jpeg', 'image/gif', 'image/webp', 'image/png'].includes(file.type)) {
            // Set file name and type
            fileName = file.name;
            download_filename.value = (file.type == 'image/webp') ? fileName.substring(0, fileName.length - 5): fileName.substring(0, fileName.length - 4);
            download_filetype.value = (file.type == 'image/gif') ? 'image/png': file.type;
        }
        else {
            // Show warning modal
            dwarning("Unsupported file format");
            return;
        }
      

        // Read data as URL
        reader.readAsDataURL(file);
    }

    // Add image to canvas
    reader.addEventListener("load", () => {
            // Set image src
            img.src = reader.result;
            orignalImg = reader.result;
            
            // Add to canvas
            img.onload = function() {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.imageSmoothingEnabled = true;
                ctx.drawImage(img, 0, 0, img.width, img.height);
                canvas.removeAttribute("data-caman-id");

                Caman("#canvas", img, function() {
                    this.render(function() {
                        // enable buttons
                        enableBtns(true);
                    });
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
    // reset tools
    document.getElementById("crop_left").value = null;
    document.getElementById("crop_right").value = null;
    document.getElementById("crop_top").value = null;
    document.getElementById("crop_bottom").value = null;
    document.getElementById("rot_angle").value = null;
    document.getElementById("text_string").value = null;
    document.getElementById("text_font").value = null;
    document.getElementById("text_size").value = null;
    document.getElementById("watermark_file").value = null;
    document.getElementById("watermark_opacity").value = null;

    // reset filters
    contrast_value.value = 0; 
    vibrance_value.value = 0;
    brightnees_value.value = 0;
    saturation_value.value = 0;

    // show orignal img
    img.src = orignalImg;

    img.onload = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0)
        
        // revert effects
        Caman("#canvas", img, function() {
          this.revert();
        });
    }
});

// Download Image
downloadBtn.addEventListener("click", () => {
    const dImage = canvas.toDataURL(download_filetype.value);
    const link = document.createElement('a');
    
    link.onclick = "return false"
    link.href = dImage;
    link.download = download_filename.value;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
})

// Show spinner (loading)
function showSpinner(state) {
    if (state) {
        downloadSideBar.innerHTML = '<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>';
    }
    else {
        downloadSideBar.innerHTML = '<i class="bi bi-download"></i>';
    }
}

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

// <------------------------------------------------------------ Website | toast (notification) --------------------------------------------------->

let warning_toast = document.getElementById("warning_toast");

// display a warning toast
function dwarning(body) {
    warning_toast.children[1].innerHTML = body;

    var toast = new bootstrap.Toast(warning_toast)
    toast.show()
}

// <------------------------------------------------------------ Website | Table of contents --------------------------------------------------->

tableOfContents = document.getElementById("tableOfContents");

// Auto increase margin-top for "table of contents" to make it accessible by the user
window.onscroll = function() {
    let scrollValue = window.scrollY - document.getElementById("theight").getBoundingClientRect().top + document.body.getBoundingClientRect().top + 10;

    if (scrollValue > 0) 
    {
        tableOfContents.style = "margin-top: " + scrollValue + "px ;";
    }
    else {
        tableOfContents.style = "margin-top: " + 0 + "px ;";
    }
}


// <------------------------------------------------------------ Image manipulation | Tools ------------------------------------------------>

// Apply changes based on the selected tool
function useTool() {
    // disable buttons
    enableBtns(false);

    let tool = document.getElementsByClassName(document.getElementById("tools").value)[0].id;
    
    if (tool == "rotate_tool") {
        rotateImg();
    }
    else if (tool == "crop_tool") {
        cropImg();
    }
    else if (tool == "flip_tool") {
        flipImg();
    }
    else if (tool == "text_tool") {
        addText();
    }
    else if (tool == "watermark_tool") {
        addWaterMark();
    }
}

// Add watermark to image
function addWaterMark() {
    ctx.save();

    let watermark_file = document.getElementById("watermark_file").files[0];
    let watermark_opacity = document.getElementById("watermark_opacity").value;
    let watermark_postion = document.getElementById("watermark_postion").value;

    // Init FileReader API
    const reader = new FileReader();
    let watermark_img = new Image();

    ctx.globalAlpha = watermark_opacity/100;
  
    // validate input
    if (!watermark_file || !watermark_opacity || !watermark_postion) {
        console.log("Watermark Tool: invalid input");

        // show toast (warning notification)
        dwarning("Watermark Tool: Invalid input");
        enableBtns(true);
        return;
    }

    if (['image/jpeg', 'image/gif', 'image/webp', 'image/png'].includes(watermark_file.type)) {
        // Read data as URL
        reader.readAsDataURL(watermark_file);
    }
    else {
        // Show warning modal
        dwarning("Unsupported file format");
        return;
    }
    
    reader.addEventListener("load", () => {
        watermark_img.src = reader.result;

        let wmImg_width = img.width * 10/100;
        let wmImg_height = (img.width * 10/100 * watermark_img.height) / watermark_img.width;

        watermark_img.onload = function() {
            if (watermark_postion == "top-left") {    
                ctx.drawImage(watermark_img, 0, 0, wmImg_width , wmImg_height);
            }
            else if (watermark_postion == "top-center") {
                ctx.drawImage(watermark_img, canvas.width/2 - wmImg_width/2, 0, wmImg_width , wmImg_height);
            }
            else if (watermark_postion == "top-right") {
                ctx.drawImage(watermark_img, canvas.width - wmImg_width, 0, wmImg_width , wmImg_height);
            }
            else if (watermark_postion == "middle-left") {
                ctx.drawImage(watermark_img, 0, canvas.height/2 - wmImg_height/2, wmImg_width , wmImg_height);
            }
            else if (watermark_postion == "middle-center") {
                ctx.drawImage(watermark_img, canvas.width/2 - wmImg_width/2, canvas.height/2 - wmImg_height/2, wmImg_width , wmImg_height);
            }
            else if (watermark_postion == "middle-right") {
                ctx.drawImage(watermark_img, canvas.width - wmImg_width, canvas.height/2 - wmImg_height/2, wmImg_width , wmImg_height);
            }
            else if (watermark_postion == "bottom-left") {
                ctx.drawImage(watermark_img, 0, canvas.height - wmImg_height, wmImg_width , wmImg_height);
            }
            else if (watermark_postion == "bottom-center") {
                ctx.drawImage(watermark_img, canvas.width/2 - wmImg_width/2, canvas.height - wmImg_height, wmImg_width , wmImg_height);
            }
            else if (watermark_postion == "bottom-right") {
                ctx.drawImage(watermark_img, canvas.width - wmImg_width, canvas.height - wmImg_height, wmImg_width , wmImg_height);
            }
            
            enableBtns(true);
            ctx.restore();
        };
    }, 
    false);

}

// Add text to image
function addText() {
    let text_string = document.getElementById("text_string").value;
    let text_font = document.getElementById("text_font").value;
    let text_size = parseInt(document.getElementById("text_size").value);
    let text_color = document.getElementById("text_color").value;
    let text_postion = document.getElementById("text_postion").value;

    // validate input
    if (!text_string || !text_font || !text_size || !text_color || !text_postion) {
        console.log("Text Tool: invalid input");

        // show toast (warning notification)
        dwarning("Text Tool: Invalid input");
        enableBtns(true);
        return;
    }
    
    console.log(text_size + "px " + text_font)
    ctx.font = text_size + "px " + text_font;
    ctx.fillStyle = text_color;

    if (text_postion == "top-left") {    
        ctx.textAlign = "left";
        ctx.fillText(text_string, 10, text_size + 10);
    }
    else if (text_postion == "top-center") {
        ctx.textAlign = "center";
        ctx.fillText(text_string, canvas.width/2, text_size + 10);
    }
    else if (text_postion == "top-right") {
        ctx.textAlign = "right";
        ctx.fillText(text_string, canvas.width - 10, text_size + 10);
    }
    else if (text_postion == "middle-left") {
        ctx.textAlign = "left";
        ctx.fillText(text_string, 10, text_size + canvas.height/2);
    }
    else if (text_postion == "middle-center") {
        ctx.textAlign = "center";
        ctx.fillText(text_string, canvas.width/2, text_size + canvas.height/2);
    }
    else if (text_postion == "middle-right") {
        ctx.textAlign = "right";
        ctx.fillText(text_string, canvas.width - 10, text_size + canvas.height/2);
    }
    else if (text_postion == "bottom-left") {
        ctx.textAlign = "left";
        ctx.fillText(text_string, 10, canvas.height - 10);
    }
    else if (text_postion == "bottom-center") {
        ctx.textAlign = "center";
        ctx.fillText(text_string, canvas.width/2, canvas.height - 10);
    }
    else if (text_postion == "bottom-right") {
        ctx.textAlign = "right";
        ctx.fillText(text_string, canvas.width - 10, canvas.height - 10);
    }

    // enable buttons
    enableBtns(true);
}

// flip image
function flipImg() {
    let axis = document.getElementById("flip_axis").value;

    img.src = canvas.toDataURL();

    img.onload = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (axis == "0") { // flip on horizontal axis
            ImageTools(img, 0, 0, img.width, img.height, 0, false, true);
        }
        else { // flip on vertical axis
            ImageTools(img, 0, 0, img.width, img.height, 0, true);
        }
    }
}

// rotate Image
function rotateImg() {
    let degree = document.getElementById("rot_angle").value;

    // validate input
    if (!degree) {
        console.log("Rotate Tool: invalid input");

        // show toast (warning notification)
        dwarning("Rotate Tool: Invalid input");
        enableBtns(true);
        return;
    }

    let absDegree = Math.abs(degree);
    let angle = ((absDegree <= 90) ? absDegree : (absDegree < 180) ? 90 - absDegree % 90 : (absDegree < 270) ? absDegree % 90 : (absDegree != 360) ? 90 - absDegree % 90 : 0);

    img.src = canvas.toDataURL();

    img.onload = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.height = img.height * Math.sin((90 - Math.abs(angle)) * Math.PI / 180) + img.width * Math.sin(Math.abs(angle) * Math.PI / 180);
        canvas.width = img.width * Math.sin((90 - Math.abs(angle)) * Math.PI / 180) + img.height * Math.sin(Math.abs(angle) * Math.PI / 180);
        ImageTools(img, canvas.width / 2, canvas.height / 2, img.width, img.height, degree, false, false, true);
    };
}

// crop image
function cropImg() {
    // read input
    let left = document.getElementById("crop_left").value;
    let top = document.getElementById("crop_top").value;
    let right = document.getElementById("crop_right").value;
    let bottom = document.getElementById("crop_bottom").value;

    // validate input
    if (!left || !top || !right || !bottom) {
        console.log("Crop Tool: invalid input");

        // show toast (warning notification)
        dwarning("Crop Tool: Invalid input");
        enableBtns(true);
        return;
    }

    img.src = canvas.toDataURL();

    img.onload = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.width = right;
        canvas.height = bottom;
        ctx.drawImage(img, left, top, right, bottom, 0, 0, canvas.width, canvas.height);
        
        Caman("#canvas", img, function() {
            this.render();
        });
        
        // enable buttons
        enableBtns(true);
    }
}

// this function can crop, rotate and flip images
function ImageTools(img, x, y, width, height, deg, flip, flop, center) {
    ctx.save();
    
    if(typeof width === "undefined") width = img.width;
    if(typeof height === "undefined") height = img.height;
    if(typeof center === "undefined") center = false;
    
    // Set rotation point to center of image, instead of top/left
    if(center) {
        x -= width/2;
        y -= height/2;
    }
    
    // Set the origin to the center of the image
    ctx.translate(x + width/2, y + height/2);
    
    // Rotate the canvas around the origin
    var rad = 2 * Math.PI - deg * Math.PI / 180;    
    ctx.rotate(rad);
    
    // Flip/flop the canvas
    if(flip) flipScale = -1; else flipScale = 1;
    if(flop) flopScale = -1; else flopScale = 1;
    ctx.scale(flipScale, flopScale);
    
    // Draw the image    
    ctx.drawImage(img, -width/2, -height/2, width, height);
    
    ctx.restore();
    
    // enable buttons   
    enableBtns(true);
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


