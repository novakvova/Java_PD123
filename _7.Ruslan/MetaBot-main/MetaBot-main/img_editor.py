from PIL import ImageFilter, ImageEnhance

from meta_editor import *


async def blur_cor_img(message,count):
    for i in range(count):
        image = Image.open(f"users/{message.from_user.id}/photo/{message.from_user.id}.png")
        output_image_path = f"users/{message.from_user.id}/corrected_images/{i}.png"
        radius = i
        edited_image = image.filter(ImageFilter.GaussianBlur(radius))
        edited_image.save(output_image_path)
        edited_image.close()
        await remove_exif_metadata(output_image_path)


async def color_cor_img(message,count):
    for i in range(count):
        image_path = f"users/{message.from_user.id}/photo/{message.from_user.id}.png"
        output_image_path = f"users/{message.from_user.id}/corrected_images/{i}.png"
        enhancement_factor = (i + 0.1) * 0.5
        image = Image.open(image_path)
        enhancer = ImageEnhance.Color(image)
        enhanced_image = enhancer.enhance(enhancement_factor)
        enhanced_image.save(output_image_path)
        await remove_exif_metadata(output_image_path)


async def pixelate_image(message, count):
    for i in range(count):
        image_path = f"users/{message.from_user.id}/photo/{message.from_user.id}.png"
        image_path = f"users/{message.from_user.id}/photo/{message.from_user.id}.png"
        output_image_path = f"users/{message.from_user.id}/corrected_images/{i}.png"
        pixel_size = (i+1)
        image = Image.open(image_path)
        image = image.resize((image.width // pixel_size, image.height // pixel_size),resample=Image.NEAREST)
        image = image.resize((image.width * pixel_size, image.height * pixel_size),resample=Image.NEAREST)
        image.save(output_image_path)
        await remove_exif_metadata(output_image_path)
