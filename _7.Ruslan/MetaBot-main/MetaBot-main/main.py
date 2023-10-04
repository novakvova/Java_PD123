import logging
from itertools import count

from aiogram import Bot, Dispatcher, types
from aiogram.utils.exceptions import FileIsTooBig
import video_editor as ve
import os

from menu import *
from text import *
from img_editor import *
from userInfo import *

API_TOKEN = '6037306867:AAE7op0UnUoe4nzZGPFLUGLPOikMpoI4ADc'

logging.basicConfig(level=logging.INFO)
bot = Bot(token=API_TOKEN)
dp = Dispatcher(bot)


@dp.message_handler(commands="start")
async def create_user_folder(message):
    os.makedirs(f"users/{message.from_user.id}", exist_ok=True)
    os.makedirs(f"users/{message.from_user.id}/photo", exist_ok=True)
    os.makedirs(f"users/{message.from_user.id}/corrected_images", exist_ok=True)
    os.makedirs(f"users/{message.from_user.id}/video", exist_ok=True)
    os.makedirs(f"users/{message.from_user.id}/corrected_video", exist_ok=True)
    os.makedirs(f"users/{message.from_user.id}/temp", exist_ok=True)
    await set_default_status(message)
    await message.answer(hello_text)


@dp.message_handler(content_types=['document', 'photo', 'video'])
async def handle_media(message: types.Message):
    if message.document:
        await upgrade_user_do(message, disagree_text)
        if message.document.mime_type.startswith('image'):
            file_data = await bot.get_file(message.document.file_id)
            file_path = file_data.file_path
            await download_img(message, file_path)
            await img_start_menu(message)
        else:
            await message.reply(error_type_text)
    elif message.photo:
        await message.reply(error_photo_type_text)
    elif message.video:
        try:
            file_data = await bot.get_file(message.video.file_id)
            file_path = file_data.file_path
            await download_video(message, file_path)
            await video_start_menu(message)
        except FileIsTooBig:
            await message.answer(error_file_is_big)


@dp.message_handler(content_types="text")
async def start_cor(message):
    await clear_markup(message)
    if message.text in [color_img_text,blur_img_text,pixel_img_text,color_video_text,brightness_video_text,blur_video_text,pixel_video_text,speed_video_text]:
        await upgrade_user_do(message, message.text)
        await upgrade_img_count_status(message, True)
    status = await get_user_do(message)
    count = 0
    if status in [color_img_text, blur_img_text, pixel_img_text] and message.text.isdigit() and await get_count_status(message):
        try:
            count = int(message.text)
            if not (1 <= count <= 20):
                raise Exception
            await upgrade_user_do(message,status)
            await upgrade_img_count_status(message,False)
            await clear_directory(f"users/{message.from_user.id}/corrected_images")
            if status == color_img_text:
                await color_cor_img(message, count)
            elif status == blur_img_text:
                await blur_cor_img(message, count)
            elif status == pixel_img_text:
                await pixelate_image(message, count)
            await upgrade_user_do(message,choose_img_text)
            await upgrade_img_count_status(message,False)
            await send_corrected_img(message)
        except:
            await message.answer(get_count_img_text)
    if status in [color_img_text, blur_img_text, pixel_img_text] and not message.text.isdigit() and await get_count_status(message):
        await message.answer(get_count_img_text)
    ###########VIDEO##############
    if status in [color_video_text, brightness_video_text, blur_video_text, pixel_video_text, speed_video_text] and await get_count_status(message):
        try:
            count = int(message.text)
            if not (1 <= count <= 5):
                raise Exception
            await upgrade_user_do(message, status)
            await upgrade_img_count_status(message, False)
            await clear_directory(f"users/{message.from_user.id}/corrected_video")
            await clear_directory(f"users/{message.from_user.id}/temp")

            send_path = f"users/{message.from_user.id}/video/{message.from_user.id}.mp4"
            temp_path = f"users/{message.from_user.id}/temp/{message.from_user.id}.mp4"
            final_path = f"users/{message.from_user.id}/corrected_video/{message.from_user.id}.mp4"
            editor = ve.VideoEditor(send_path, temp_path, final_path)
            clip = editor.open_video_moviepy()
            print(clip, type(clip))
            if status == color_video_text:
                clip = editor.color_filter(count)
            elif status == brightness_video_text:
                clip = editor.set_brightness(clip,count)
            elif status == blur_video_text:
                clip = editor.blur(clip, count)
            elif status == pixel_video_text:
                clip = editor.pixelate(count*3)
            elif status == speed_video_text:
                clip = editor.set_speed(clip, count)
            editor.save_video_moviepy(clip)

            await send_corrected_video(message)
            await set_default_status(message)
        except Exception as e:
            print(e)
            await message.answer(get_count_video_text)
        if status in [color_img_text, blur_img_text, pixel_img_text] and not message.text.isdigit() and await get_count_status(message):
            await message.answer(get_count_video_text)


async def send_corrected_img(message):
    directory_path = f"users/{message.from_user.id}/corrected_images"
    chat_id = message.chat.id
    files = os.listdir(directory_path)
    for filename in files:
        file_path = (os.path.join(directory_path, filename)).replace("\\","/")
        with open(file_path, "rb") as photo:
            await bot.send_document(chat_id, types.InputFile(photo))


async def send_corrected_video(message):
    directory_path = f"users/{message.from_user.id}/corrected_video"
    chat_id = message.chat.id
    files = os.listdir(directory_path)
    for filename in files:
        file_path = (os.path.join(directory_path, filename)).replace("\\","/")
        with open(file_path, "rb") as video:
            await bot.send_document(chat_id, types.InputFile(video))


async def clear_directory(directory_path):
    for filename in os.listdir(directory_path):
        file_path = os.path.join(directory_path, filename)
        if os.path.isfile(file_path):
            os.remove(file_path)


async def clear_markup(message):
    markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
    item1 = types.KeyboardButton("❌")
    markup.add(item1)
    await bot.send_message(chat_id=message.chat.id, text=">>", reply_markup=markup)
    # await bot.delete_message(chat_id=message.chat.id, message_id=message.message_id - 1)


async def download_img(message, file_path):
    path = f"users/{message.from_user.id}/photo/{message.from_user.id}.png"
    with open(path, "wb") as file:
        await bot.download_file(file_path, file)


async def open_img(message):
    path = f"users/{message.from_user.id}/photo/{message.from_user.id}.png"
    with open(path, "wb") as file:
        result = file.read()
    return result


async def download_video(message, file_path):
    path = f"users/{message.from_user.id}/video/{message.from_user.id}.mp4"
    with open(path, "wb") as file:
        await bot.download_file(file_path, file)


if __name__ == '__main__':
    from aiogram import executor
    executor.start_polling(dp, skip_updates=True)
