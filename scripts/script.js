// Declaring variables/constants
const downloadBtn = document.getElementById("download-btn");
const uploadBtn = document.getElementById("upload-btn");
const revertBtn = document.getElementById("revert-btn");
const canvas = document.getElementById("canvas");
const canvas_ctx = canvas.getContext("2d");

let fileType
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
    fileType = file.type;
    // Init FileReader API
    const reader = new FileReader();
  
    // Check for file
    if (file) {
      // Set file name
      fileName = file.name;
      // Read data as URL
      reader.readAsDataURL(file);
    }

    // Add image to canvas
    reader.addEventListener("load", () => {
        // Set image src
        img.src = reader.result;

        // On image load add to canvas
        img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        canvas_ctx.imageSmoothingEnabled = false;
        canvas_ctx.drawImage(img, 0, 0, img.width, img.height);
        
        // Show resized image in preview element
        update_preview()
      };
    },
    false
  );
}); 

// Update the preview <img> image to the canvas
function update_preview() {
    var dataurl = canvas.toDataURL(fileType);
    document.getElementById("preview").src = dataurl;
}

// Add a bootstrap toooltip to every tag that has "tt" class
const tooltips = document.querySelectorAll('.tt')
    tooltips.forEach(t => {
        new bootstrap.Tooltip(t)
})

// A function that takes a class name and a bool "state" to hide/show tags  
function hide(state, cls) {
    var tools = document.getElementsByClassName(cls)
    for (let i = 0; i < tools.length; i++) {
        tools[i].hidden = state;
    }
}

hide(true, "tool");
hide(true, "filter");
hide(false, "crop");
hide(false, "brightness");

// Show tool requirments 
document.getElementById("tools").onchange = function(){
    hide(true, "tool");

    var elements = document.getElementsByClassName(this.value)
    for (let i = 0; i < elements.length; i++) {
        elements[i].hidden = false
    }
}

// Show filter requirments
document.getElementById("filters").onchange = function(){
    hide(true, "filter");

    var elements = document.getElementsByClassName(this.value)
    for (let i = 0; i < elements.length; i++) {
        elements[i].hidden = false
    }
}

// update brightness controls
function updateBrightnessValue() {
    
}

// Apply brightness filter on image
function brightness() {
    Caman(canvas, function () {
        this.brightness(5).render();
        update_preview()
    });
}

