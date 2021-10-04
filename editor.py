# A script to edit images

# Resources:
# libraries:
# 1- https://pillow.readthedocs.io/en/stable/
# 2- https://numpy.org/doc/stable/
# Blogs:
# 1- https://automatetheboringstuff.com/2e/chapter19/
# 2- https://shorturl.at/azBLN

# Importing pillow, sys libraries
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
from sys import exit, argv, winver
import cv2
import numpy as np
from scipy.interpolate import UnivariateSpline


# Declaring global variables
positions = {"top-left": (0,0), "top-center": (), "top-right": (),
            "middle-left": (), "middle-center": (), "middle-right": (),
            "bottom-left": (), "bottom-center": (), "bottom-right": ()
            }


def main():
    # Display help message
    if len(argv) == 2 and argv[1] == '-h':
        print("""Usage: python editor.py <inFile> <outFile> <Command> [requirements]
inFile:  The name of the input file (An image)
outFile: The name of the output file
  |Command      |Description                            |Requirements
 1|-crop        |Crop the image                         |int: left, top, right, bottom
 2|-rotate      |Rotate the image                       |int: angle
 3|-flip        |Flip the image on the horizontal       |int: axis, where 0 means horizontal and 1 means vertical
                 or vertical axis                        
 4|-text        |Add text to the image                  |string: text, Color, Font, postion ('top-center', ...)
 5|-watermark   |Add watermark to image                 |String: watermark image, postion ('top-center, ...), Intger: opacity
 6|-color       |Adjust image color balance             |int: factor
 7|-brightness  |Adjust image brightness                |int: factor
 8|-contrast    |Adjust image contrast                  |int: factor
 9|-sharpness   |Adjust image sharpness                 |int: factor
10|-f_blur      |Add a blur filter                      |int: radius
11|-f_BAW       |Add a black and white filter           |No requirements
12|-f_sepia     |Add a sepia filter                     |No requirements
  |-info        |Display the properties of the image    |No requirements
            """)
        exit()
    elif len(argv) < 3:
        exit("Use: 'python editor.py -h' for help")

    # open the image file and copying it's data to memory
    image = Image.open(argv[1])
    if not image:
        exit("Couldn't open infile")

    # Applying Effects/Filters based on the arguments
    if argv[3] == "-crop" and len(argv) == 8:
        outfile = img_crop(image, int(argv[4]), int(argv[5]), int(argv[6]), int(argv[7]))
    elif argv[3] == "-rotate" and len(argv) == 5:
        outfile = img_rotate(image, int(argv[4]))
    elif argv[3] == "-flip" and len(argv) == 5:
        outfile = img_flip(image, int(argv[4]))
    elif argv[3] == "-text" and len(argv) == 8:
        outfile = draw_txt(image, argv[4], argv[5], argv[6], argv[7])
    elif argv[3] == "-watermark" and len(argv) == 6:
        outfile = add_watermark(image, argv[4], argv[5])
    elif argv[3] == "-f_BAW" and len(argv) == 4:
        outfile = filter_BAW(image)
    elif argv[3] == "-f_blur" and len(argv) == 5:
        outfile = filter_Blur(image, argv[4])
    elif argv[3] == "-f_sepia" and len(argv) == 4:
        outfile = filter_sepia(image)
    elif argv[3] == "-f_sketch" and len(argv) == 4:
        outfile = filter_pencil_sketch(np.array(image))
    elif argv[3] == "-f_summer" and len(argv) == 4:
        outfile = filter_summer(np.array(image)) 
    elif argv[3] == "-f_winter" and len(argv) == 4:
        outfile = filter_winter(np.array(image)) 
    elif argv[3] == "-f_cartoon" and len(argv) == 4:
        outfile = filter_cartoon(argv[1])
    elif argv[3] == "-info" and len(argv) == 4:
        print("Format:          " + image.format)
        print("Height:          " + str(image.size[1]))
        print("Width:           " + str(image.size[0]))
        return
    else:
        exit("Invaild argument")

    # saving the output
    outfile.save(argv[2])

# Crop the Image, From rowStart to rowEnd, and from columnStart to ColumnEnd
def img_crop(image, left, top, right, bottom):
    return image.crop((left, top, right, bottom))

# rotate the image <n> times
def img_rotate(image, angle):
    image = image.rotate(angle, expand=True, fillcolor=(0,0,0,0))
    return image
    
# Flip the image along <axis> 
def img_flip(image, axis):
    if axis == 0:
        image = image.transpose(Image.FLIP_TOP_BOTTOM)
    elif axis == 1:
        image = image.transpose(Image.FLIP_LEFT_RIGHT)
    else:
        exit("Invalid axis")
    return image

# draw <text> text on image with <textColor> color and <textFont> font
def draw_txt(image, text, textColor, textFont, postion):
    fontSize = 1
    draw = ImageDraw.Draw(image)
    font = ImageFont.truetype(textFont + ".ttf", fontSize)
    
    textWidth, textHeight = font.getsize(text)

    # Resize the text
    while textWidth < 0.3*image.size[0]:
        # iterate until the text size is just larger than the criteria
        fontSize += 1
        font = ImageFont.truetype(textFont + ".ttf", fontSize)
        textWidth, textHeight = font.getsize(text)

    x, y = calculate_pos(image, positions, (textWidth, textHeight))[postion]

    draw.text((x,y), text, fill=textColor, font=font)
    return image

# Add watermark to the image 
def add_watermark(image, watermarkImage, postion, opacity=1):
    watermark = Image.open(watermarkImage)
    
    if watermark.mode != 'RGBA':
        watermark = watermark.convert('RGBA')
    alpha = watermark.split()[3]
    alpha = ImageEnhance.Brightness(alpha).enhance(opacity)
    watermark.putalpha(alpha)
    
    scale = 10
    img_width = image.size[0]
    size = (int(img_width * (scale/100)), int((watermark.size[1] * img_width * (scale/100))/watermark.size[0]))
    watermark = watermark.resize(size)
    
    x, y = calculate_pos(image, positions, watermark.size)[postion]
    image.paste(watermark, (x, y), watermark)

    return image

# calculate positions relative to the given image and store them in a dictionary
def calculate_pos(image, positions, objectSize):
    width, height = image.size
    positions["top-center"] = (width//2 - objectSize[0]//2, 0)
    positions["top-right"] = (width - objectSize[0], 0)
    positions["middle-left"] = (0, height//2 - objectSize[1]//2)
    positions["middle-center"] = (width//2 - objectSize[0]//2, height//2 - objectSize[1]//2)
    positions["middle-right"] = (width - objectSize[0], height//2 - objectSize[1]//2)
    positions["bottom-left"] = (0, height - objectSize[1])
    positions["bottom-center"] = (width//2 - objectSize[0]//2, height - objectSize[1])
    positions["bottom-right"] = (width - objectSize[0], height - objectSize[1])
    return positions

# Enhance the color of <image> by <factor>
def img_enh_color(image, factor):
    return ImageEnhance.Color(image).enhance(factor)

# Enhance the Brightness of <image> by <factor>
def img_enh_brightness(image, factor):
    return ImageEnhance.Brightness(image).enhance(factor)

# Enhance the Contrast of <image> by <factor>
def img_enh_contrast(image, factor):
    return ImageEnhance.Contrast(image).enhance(factor)

# Enhance the Sharpness of <image> by <factor>
def img_enh_sharpness(image, factor):
    return ImageEnhance.Sharpness(image).enhance(factor)

# Add a black and white filter to the image
def filter_BAW(image):
    return image.convert("L")

# Apply a Blur filter
def filter_Blur(image, radius=10):
    return image.filter(ImageFilter.BoxBlur(radius))

# Add sepia filter
def filter_sepia(image):
    width, height = image.size
    pixels = image.load() # create the pixel map

    for py in range(height):
        for px in range(width):
            r, g, b = image.getpixel((px, py))

            tr = int(0.393 * r + 0.769 * g + 0.189 * b)
            tg = int(0.349 * r + 0.686 * g + 0.168 * b)
            tb = int(0.272 * r + 0.534 * g + 0.131 * b)

            if tr > 255:
                tr = 255
            if tg > 255:
                tg = 255
            if tb > 255:
                tb = 255

            pixels[px, py] = (tr,tg,tb)

    return image

#colour pencil sketch effect
def filter_pencil_sketch(image):
    #inbuilt function to create sketch effect in colour and greyscale
    sk_color = cv2.pencilSketch(image, sigma_s=60, sigma_r=0.07, shade_factor=0.1)[0]
    image = cv2.cvtColor(sk_color, cv2.COLOR_BGR2RGB)
    return  Image.fromarray(image)

# A Custom LookupTable function
def LookupTable(x, y):
  spline = UnivariateSpline(x, y)
  return spline(range(256))

# Apply a summer effect
def filter_winter(img):
    increaseLookupTable = LookupTable([0, 64, 128, 256], [0, 80, 160, 256])
    decreaseLookupTable = LookupTable([0, 64, 128, 256], [0, 50, 100, 256])
    blue_channel, green_channel,red_channel  = cv2.split(img)
    red_channel = cv2.LUT(red_channel, increaseLookupTable).astype(np.uint8)
    blue_channel = cv2.LUT(blue_channel, decreaseLookupTable).astype(np.uint8)
    sum= cv2.merge((blue_channel, green_channel, red_channel))
    return Image.fromarray(sum)

# Apply a winter effect
def filter_summer(img):
    increaseLookupTable = LookupTable([0, 64, 128, 256], [0, 80, 160, 256])
    decreaseLookupTable = LookupTable([0, 64, 128, 256], [0, 50, 100, 256])
    blue_channel, green_channel,red_channel = cv2.split(img)
    red_channel = cv2.LUT(red_channel, decreaseLookupTable).astype(np.uint8)
    blue_channel = cv2.LUT(blue_channel, increaseLookupTable).astype(np.uint8)
    win= cv2.merge((blue_channel, green_channel, red_channel))
    return Image.fromarray(win)

# cartoon effect
def filter_cartoon(imgSrc):
    img = cv2.imread(imgSrc)
    cartoon_image = cv2.stylization(img, sigma_s=150, sigma_r=0.25)
    image = cv2.cvtColor(cartoon_image, cv2.COLOR_BGR2RGB)
    return Image.fromarray(image)


main()

# TODO: add batch photo edting