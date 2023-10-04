
from PIL import Image
import piexif


async def remove_exif_metadata(file_path):
    try:
        image = Image.open(file_path)
        exif_data = image.info.get('exif')
        if exif_data:
            exif_dict = piexif.load(file_path)
            if "Exif" in exif_dict:
                exif_dict["Exif"].pop(piexif.ExifIFD.Artist, None)
            exif_bytes = piexif.dump(exif_dict)
            image.save(file_path, format=image.format, exif=exif_bytes)
    except:...