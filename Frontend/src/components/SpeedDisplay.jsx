import React, { useContext } from "react";
import { SpeedContext } from "./speedCalcualtor";
import { BsSpeedometer2 } from "react-icons/bs";
import { TbInfoTriangleFilled } from "react-icons/tb";
import "../styles/speedDisplay.css";

const SpeedDisplay = () => {
  const speed = useContext(SpeedContext);

  return (
    <div>
      <div className="controls">
        <div className="button speed col-4 bg-white my-3">
          <BsSpeedometer2 size="2em" className="mb-2" />
          <div className="button-text" id="speed">
            Speed: {speed} km/h
          </div>
        </div>
        <div className="button alert col-4 bg-white my-3" id="alert-card">
          <TbInfoTriangleFilled size="2em" className="mb-1" />
          <div className="button-text" id="alert">
            Safe State
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeedDisplay;
