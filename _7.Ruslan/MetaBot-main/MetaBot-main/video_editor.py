import random

from skimage.filters import gaussian
import cv2
from moviepy.editor import VideoFileClip, vfx
import numpy as np


class VideoEditor:
    speed_min_const = 0.05
    speed_max_const = 0.1

    brightness_min_const = 0.1
    brightness_max_const = 0.3

    color_filter_min = 0.6
    color_filter_max = 1.0

    blur_min = 1
    blur_max = 3

    def __init__(self, send_path, temp_path, final_path):
        self.send_path = send_path
        self.temp_path = temp_path
        self.final_path = final_path

    def open_video_moviepy(self):
        return VideoFileClip(self.send_path)

    def save_video_moviepy(self, clip):
        print("save")
        clip.write_videofile(self.final_path)
        self.send_path = None
        self.temp_path = None
        self.final_path = None

    def edit_video_cv2(self, frame_calculate_func, *func_args):
        video_capture = cv2.VideoCapture(self.send_path)

        fps = int(video_capture.get(cv2.CAP_PROP_FPS))
        width = int(video_capture.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(video_capture.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        video_writer = cv2.VideoWriter(self.temp_path, fourcc, fps, (width, height))

        while True:
            ret, frame = video_capture.read()
            if not ret:
                break

            video_writer.write(frame_calculate_func(frame, height, width, func_args))

        video_capture.release()
        video_writer.release()

        # Add original audio to the new clip
        return VideoFileClip(self.temp_path).set_audio(VideoFileClip(self.send_path).audio)

    def get_sign(self):
        return 1 if random.random() <= 0.5 else -1

    def set_speed(self, clip, speed=None):
        if speed is None:
            speed = (1 + self.get_sign() * random.uniform(self.speed_min_const, self.speed_max_const))
        clip = clip.set_fps(clip.fps * speed)

        clip = clip.fx(vfx.speedx, speed) #?
        return clip

    def set_brightness(self, clip, brightness=None):
        if brightness is None:
            brightness = 1 + self.get_sign() * random.uniform(self.brightness_min_const, self.brightness_max_const)
        return clip.fx(vfx.colorx, brightness)

    def blur(self, clip, blur_intensity=None):
        if blur_intensity is None:
            blur_intensity = random.uniform(self.blur_min, self.blur_min)
        return clip.fl_image(lambda img: gaussian(img.astype(float), sigma=blur_intensity))

    def color_filter(self, r=None, g=None, b=None):

        if r is None:
            r = random.uniform(self.color_filter_min, self.color_filter_max)
        if g is None:
            g = random.uniform(self.color_filter_min, self.color_filter_max)
        if b is None:
            b = random.uniform(self.color_filter_min, self.color_filter_max)
        return self.edit_video_cv2(lambda frame, h, w, *args: (frame * np.array([args[0][0], args[0][1], args[0][2]])).astype(np.uint8), r, g, b)

    def pixelate(self, pixel_size=None):
        def pixelate_frame(frame, height, width, *args):
            small_frame = cv2.resize(frame, (width // pixel_size, height // pixel_size))
            pixelated_frame = cv2.resize(small_frame, (width, height), interpolation=cv2.INTER_NEAREST)
            return pixelated_frame
        if pixel_size is None:
            pixel_size = random.randint(2, 5)
        return self.edit_video_cv2(pixelate_frame)


# send_path = f"users/{741867026}/video/{741867026}.mp4"
# temp_path = f"users/{741867026}/temp/{741867026}.mp4"
# final_path = f"users/{741867026}/corrected_video/{741867026}.mp4"
# if __name__ == "__main__":
#     ve = VideoEditor(send_path, temp_path, final_path)
#     clip = ve.open_video_moviepy()
#     clip = ve.set_brightness(clip)
#     ve.save_video_moviepy(clip)
