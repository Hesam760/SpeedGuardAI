# SpeedGuard AI 🚘🧠

**Real-time Speed Monitoring and Traffic Sign Detection using AI**

SpeedGuard AI is a real-time, intelligent web and mobile application (PWA-supported) that monitors vehicle speed and detects road speed limit signs using AI. It captures video from the user’s device, analyzes each frame with deep learning models on the server, and compares detected speed limits with the vehicle’s current speed. If the user exceeds the speed limit, an audible alarm is triggered. Otherwise, the app confirms a "Safe State."

---

## 📱 Features

- 📷 Live video capture from camera (web/mobile)
- 🧠 Real-time detection of speed limit signs using AI
- 🏷 Classification of traffic signs (e.g., "Speed Limit 30")
- 📊 Speed comparison with user’s current speed
- 🔊 Immediate alarm if speed exceeds the detected limit
- ✅ "Safe State" indicator when within limits
- 🌍 Works as a mobile-friendly web app and PWA
- 🔁 Frame-by-frame transmission using WebSocket every 0.5 seconds

---

## 🧩 Tech Stack

### 🖥 Frontend
- **React**: For building a dynamic and responsive UI
- **PWA Support**: Enables app installation on mobile and offline capabilities
- **WebSocket**: Ensures real-time, low-latency communication with backend

### 🖧 Backend
- **Django**: Python-based web framework used to build the backend logic
- **Django Channels**: Enables WebSocket support in Django for real-time frame handling
- **REST API** (optional): For non-real-time features or logging

### 🧠 Deep Learning

#### 🔍 Localization (Detection)
- **YOLO (You Only Look Once)**: Object detection model used to locate speed limit signs in each frame with high speed and accuracy.

#### 🏷 Recognition (Classification)
- **Custom Deep Learning Architecture**: Designed and trained from scratch to classify speed limit signs (e.g., "Speed Limit 30", "50", etc.)
- **Training Dataset**: Speed limit sign dataset with labeled images
- **Frameworks**: TensorFlow + Keras (for both training and inference)

---

## ⚙️ How It Works

1. The app accesses the user’s camera and captures video in real-time.
2. Every 0.5 seconds, a frame is extracted and sent to the backend via WebSocket.
3. The YOLO model detects any speed limit signs in the frame.
4. If a sign is found, the custom recognition model classifies it (e.g., "Speed Limit 50").
5. The result is compared with the current vehicle speed.
6. If the speed exceeds the limit, an **alarm sound** is played.
7. If the speed is safe, a **"Safe State"** message is shown.

---

## 📸 Demo
![SpeedGuardAI UI](https://github.com/Hesam760/SpeedGuardAI/blob/main/Screenshots/AppUI.png)

---

## 🛡 License
This project is licensed under the [MIT License](LICENSE).

---



