import json
from channels.generic.websocket import AsyncWebsocketConsumer
from PIL import Image
import io
import os
import base64
import numpy as np
from ultralytics import YOLO
import tensorflow as tf
from ultralytics import YOLO
import pytz
from datetime import datetime

YOLO_MODEL = YOLO('../best.pt')  
TF_MODEL = tf.keras.models.load_model('../classification.h5')  
CLASSES =  ['Green Light', 'Red Light', 'Speed Limit 10', 'Speed Limit 100', 'Speed Limit 110', 'Speed Limit 120', 'Speed Limit 20', 'Speed Limit 30', 'Speed Limit 40', 'Speed Limit 50', 'Speed Limit 60', 'Speed Limit 70', 'Speed Limit 80', 'Speed Limit 90', 'Stop']

IRAN_TZ = pytz.timezone('Asia/Tehran')
LOG_FILE_PATH = "./websocket_logs.json"

def save_log(log_entry):
    if os.path.exists(LOG_FILE_PATH):
        with open(LOG_FILE_PATH, 'r') as file:
            logs = json.load(file)
    else:
        logs = []

    logs.append(log_entry)
    
    with open(LOG_FILE_PATH, 'w') as file:
        json.dump(logs, file, indent=4)

class FrameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        
        headers = dict(self.scope['headers'])
        x_forwarded_for = headers.get(b'x-forwarded-for', b'').decode('utf-8')
        user_agent = headers.get(b'user-agent', b'').decode('utf-8')
        log = {
            "level" : "INFO",
            "timestamp": datetime.now(IRAN_TZ).isoformat(),
            "event": "connect",
            "client": self.scope["client"],
            "user-agent": user_agent,
            "x-forwarded-for": x_forwarded_for,
            "path": self.scope["path"]
        }
        save_log(log)
        
    async def disconnect(self, close_code):
        log = {
            "level" : "INFO",
            "timestamp": datetime.now(IRAN_TZ).isoformat(),
            "event": "disconnect",
            "client": self.scope["client"],
            "close_code": close_code
        }
        save_log(log)

    async def receive(self, text_data):
        data = json.loads(text_data)
        frame_data = data['frame']
        frame_bytes = base64.b64decode(frame_data)
        frame_image = Image.open(io.BytesIO(frame_bytes))
        
        yolo_results = YOLO_MODEL.predict(source=frame_image)[0]
        if len(yolo_results.boxes) > 0:
            x_min, y_min, x_max, y_max = map(float, yolo_results.boxes.xyxy[0])
            cropped_img = frame_image.crop((x_min, y_min, x_max, y_max))
            cropped_img = cropped_img.resize((100, 100))
            cropped_img = np.array(cropped_img).reshape((1, 100, 100, 3))
            
            class_prediction = TF_MODEL.predict(cropped_img)
            class_label = CLASSES[np.argmax(class_prediction)]
            speed = class_label.split(" ")[-1]
            
            await self.send(text_data=json.dumps({
                'x_min': str(x_min),
                'y_min': str(y_min),
                'x_max': str(x_max),
                'y_max': str(y_max),
                'class_label': class_label,
                'speed' : speed
            }))
        else:
            await self.send(text_data=json.dumps({'error': 'No Object Detected!'}))
