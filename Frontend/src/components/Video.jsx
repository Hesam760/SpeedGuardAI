import React, { useRef, useEffect, useState } from "react";
import dangerSound from "../static/Danger.mp3";
import Alerts from "./Alerts";
import "../styles/video.css";

let audioInstance = new Audio(dangerSound);
export const unlockAudio = () => {
  audioInstance.play().catch(() => {
    console.log("Audio unlocked");
  });

  setTimeout(() => {
    audioInstance.pause();
    audioInstance.currentTime = 0;
  }, 1);
};

const canBeConvertedToNumber = (str) => {
  return str.trim() !== "" && !isNaN(Number(str));
};

const Video = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraConnected, setIsCameraConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const [zoom, setZoom] = useState(5);

  useEffect(() => {
    const ws = new WebSocket(
      "wss://adjusted-modest-hawk.ngrok-free.app/ws/frame/"
    );

    setSocket(ws);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.error) {
        clearCanvas();
      } else {
        drawBoundingBox(data);
        checkUserSpeed(data);
        document.getElementById("speed_limit").innerText = data.speed;
      }
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => ws.close();
  }, []);

  const sendFrame = (frameBlob) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      console.log(reader);
      const base64data = reader.result.split(",")[1];

      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ frame: base64data }));
      }
    };
    reader.readAsDataURL(frameBlob);
  };

  const captureFrame = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => sendFrame(blob), "image/jpeg");
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById("alert-card").style.background =
      "linear-gradient(135deg, #27ae60, #1e8449)";
    document.getElementById("alert").innerText = "SAFE STATE";
  };

  const drawBoundingBox = (data) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scaleX = canvas.width / video.videoWidth;
    const scaleY = canvas.height / video.videoHeight;

    ctx.strokeStyle = "green";
    ctx.lineWidth = 2;
    ctx.strokeRect(
      (data.x_min * scaleX) / 3 + 40,
      data.y_min * scaleY,
      (data.x_max - data.x_min) * scaleX,
      (data.y_max - data.y_min) * scaleY
    );

    ctx.font = "18px Arial";
    ctx.fillStyle = "red";
    ctx.fillText(
      data.class_label,
      (data.x_min * scaleX) / 3,
      data.y_min * scaleY - 10 / 3
    );
  };

  const checkUserSpeed = (data) => {
    let userSpeed = document.getElementById("speed").innerText;
    if (!canBeConvertedToNumber(data.speed)) {
      data.speed = 0;
    }
    if (
      data.speed !== undefined &&
      parseFloat(userSpeed.split(" ")[1]) > parseFloat(data.speed)
    ) {
      audioInstance.play();

      setTimeout(() => {
        stopAudio(audioInstance);
      }, 2000);

      document.getElementById("alert-card").style.background =
        "linear-gradient(135deg, #e74c3c, #c0392b)";
      document.getElementById("alert").innerText = "danger state";
    } else {
      document.getElementById("alert-card").style.background =
        "linear-gradient(135deg, #27ae60, #1e8449)";
      document.getElementById("alert").innerText = "safe state";
    }
  };

  const stopAudio = (audioInstance) => {
    if (audioInstance) {
      audioInstance.pause();
      audioInstance.currentTime = 0;
      audioInstance = null;
    }
  };

  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { exact: "environment" } },
        });
        videoRef.current.srcObject = stream;
        setIsCameraConnected(true);
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
          const capabilities = videoTrack.getCapabilities();
          if (capabilities.zoom) {
            videoTrack.applyConstraints({
              advanced: [{ zoom: zoom }],
            });
          }
        }
        setInterval(captureFrame, 500);
      } catch (err) {
        console.error("Error accessing camera: ", err);
      }
    };
    startVideo();
  });

  return (
    <>
      {isCameraConnected && (
        <Alerts
          type="success"
          msg="Camera connected successfully"
          color="green"
        />
      )}

      <div
        className="row justify-content-center align-items-center"
        style={{ position: "relative", width: "100vw", height: "80vh" }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          id="video"
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
          }}
          id="canvas"
        />

        <div
          style={{
            position: "absolute",
            bottom: "10px",
            left: "20px",
            display: "flex",
            alignItems: "center",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              backgroundColor: "white",
              border: "10px solid red",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: "bold",
              color: "black",
            }}
            id="speed_limit"
          >
            -
          </div>
        </div>
      </div>
    </>
  );
};

export default Video;
