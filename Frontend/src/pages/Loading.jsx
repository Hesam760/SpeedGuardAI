import React from "react";
import { BsFillSignTurnSlightRightFill } from "react-icons/bs";
import { BsFillSignTurnSlightLeftFill } from "react-icons/bs";
import "../styles/loading.css";
import { GiStopSign } from "react-icons/gi";

const Loading = () => {

  return (
    <>
      <div className="container-fluid bg-dark" style={{ height: "100vh" }}>
        <div className="row d-flex text-center justify-content-center pt-5">
          <BsFillSignTurnSlightRightFill
            color="white"
            style={{ height: "190px", width: "190px" }}
          />
          <BsFillSignTurnSlightLeftFill
            color="white"
            style={{ height: "190px", width: "190px" }}
          />
        </div>
        <div
          className="row align-items-center d-flex text-center"
          style={{ height: "100vh" }}
        >
          <div className="col-12">
            <GiStopSign
              color="red"
              style={{ height: "200px", width: "200px" }}
            />
          </div>
          <div className="col-12" style={{ marginBottom: "300px" }}>
            <br />
            <div className="justify-content-center d-flex">
              <div class="loader"></div>
            </div>
            <p className="text-info text-center mt-3">Setup Application...</p>
          </div>
          <div className="row justify-content-center">
            <div className="col-4"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Loading;
