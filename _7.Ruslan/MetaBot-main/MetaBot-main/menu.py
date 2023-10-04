from text import *
from aiogram import types


async def img_start_menu(message):
    markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
    item1 = types.KeyboardButton(color_img_text)
    item2 = types.KeyboardButton(blur_img_text)
    item3 = types.KeyboardButton(pixel_img_text)
    markup.add(item1, item2, item3)
    await message.answer("Оберіть опцію:", reply_markup=markup)


async def video_start_menu(message):
    markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
    item1 = types.KeyboardButton(color_video_text)
    item2 = types.KeyboardButton(blur_video_text)
    item3 = types.KeyboardButton(pixel_video_text)
    item4 = types.KeyboardButton(brightness_video_text)
    item5 = types.KeyboardButton(speed_video_text)
    markup.add(item1, item2, item3, item4, item5)
    await message.answer("Оберіть опцію:", reply_markup=markup)


async def video_speed_level_menu(message):
    markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
    item1 = types.KeyboardButton(speed_text_1)
    item2 = types.KeyboardButton(speed_text_2)
    item3 = types.KeyboardButton(speed_text_3)
    item4 = types.KeyboardButton(speed_text_4)
    markup.add(item1, item2, item3, item4)

