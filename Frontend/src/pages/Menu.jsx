import React, { useContext } from "react";
import { captureProv } from "../App";
import menuBanner from "../static/menu-banner.webp";
import { FaPlay } from "react-icons/fa";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import { unlockAudio } from "../components/Video";
import "../styles/menu.css";

const Menu = () => {
  const cap = useContext(captureProv);
  return (
    <>
      <div>
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
        <div className="container-fluid" style={{ height: "100vh" }}>
          <div
            className="row justify-content-center align-items-center"
            style={{ height: "100%" }}
          >
            <div className="col-12 fade-in">
              <h2
                className="text-center text-danger mb-5"
                style={{ fontFamily: "serif" }}
              >
                SpeedGuard AI
              </h2>
              <p className="text-center text-danger mb-5">
                <IoCheckmarkCircleSharp
                  className="mr-1 fade-in"
                  size="1.5rem"
                  color="green"
                />
                Ensure your safety by detecting and analyzing your speed in real
                time.
              </p>
              <button
                className="btn btn-success p-3 mb-4"
                style={{ borderRadius: "8px" }}
                onClick={() => {
                  cap.setCapture(true);
                  unlockAudio();
                }}
              >
                <FaPlay className="mr-2 mb-1 fade-in" />
                Start Capture
              </button>
              <br />
              <img
                src={menuBanner}
                alt="SpeedGuard AI"
                className="img-fluid mt-3 fade-in"
                style={{
                  maxWidth: "350px",
                  height: "auto",
                  borderRadius: "10px",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Menu;
