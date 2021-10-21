# Photo-Editor-Webapp
Final project for CS50x | Photo Editor Website

#### Video Demo: <https://youtu.be/FBE-MdQ-sbE>

#### Website link: <https://ahmedsaed.github.io/templates/index.html>

#### Description:
A photo editing website.

This project consists of 1 html file, css file, javascript file, 20 image thumbnails and some sample images for testing purpose.

The javascript file handles  all of the image manipulation and contains all of the website logic.

The CSS file has some custom designs and some bootstrap overridings.

Finally, The 20 image thumbnails for the website desgin.

#### How to use:

1- Upload Image
To upload an image click on the white canvas at the middle of the editor

Supported Formats:
-JPG
-PNG
-GIF
-WebP

2- Controls
    At the bottom of the editor section, There are 3 buttons:

-Revert
    Click this button to revert the edited image to it's orignal state

-Zoom In/Out
    Use these buttons to Zoom In/Out

-Download
    Click this button to open the download menu

3- Tools
3.1- Crop
Use this tool to crop the image

Tool requirments:
-Rectangle
    -Specify a rectangle coordinates to crop the image
    -Left: The left Column
    -Top: The top Row
    -Right: The right column
    -Bottom: The bottom Row

NOTE:
Left and Right values can't be greater than the image width
Right value must be greater than the Left value
Top and Buttom values can't be greater than the image height
Bottom value must be greater than the Top value

3.2- Rotate
Use this tool to rotate the image

Tool requirments:
-Angle
    -Specify an angle to rotate the image

Note:
To rotate the image clockwise, use a negative value
To rotate the image anticlockwise, use a positive value

3.3- Flip
Use this tool to flip the image

Tool requirments:
-Axis
    -Specify an axis to flip the image on

3.4- Text
Use this tool to add text to the image

Tool requirments:
-Text
    -A string for the text you want to add
-Font
    -Specify a font for the text
-Size
    -Specify a size for the text
-Color
    -Choose a color for the text
-Position
    -choose a position for the text

Supported Fonts:
-arial
-comic sans ms
-serif
-cursive
-monospace
-For more Fonts, visit CSS Font-Family

3.5- Watermark
Use this tool to add a watermark to the image

Tool requirments:
-Watermark File
    -An image file of the watermark

-Opacity
    -Specify a value for the opacity of the watermark

-Position
    -choose a position for the watermark


4- Filters
There are 4 filters. Which are

-Brightness
-Contrast
-Saturation
-Vibrance

Each filter has 2 buttons, A button "+" to increase it's value and another button "-" to decrease it

5- Effects
Effects are just a combination of multiple filters with specific values

Click on any effect to apply it

6- Download
To open the download menu click on the download button on the bottom right corner of the editor

After opening the menu, Specify a "File Name" And a "File Format"

NOTE:
-Use "PNG" for transparent background
-Use "JPG" for a smaller file size

Then click on the download button

#### Features:
##### Tools:
- Crop
- Rotate
- Flip
- Text
- Watermark

##### Filters:
- Brightness
- Contrast
- Saturation
- Vibrance

##### Effects:
- Blur
- Sepia
- Vintage
- Lomo
- Greyscale
- Clarity
- Sin City
- Cross Process
- Pinhole
- Nostalgia
- Her Majesty
- Grungy
- Orange Peel
- Love
- Jarques
- Old Boot
- Glowing Sun
- Hazy Days
- Hemingway
- Concentrate

##### This website supports stacking changes. So you can apply multiple effects and filters to the same image.

### Need Help?
Visit the "How To Use" section in the website for more info.