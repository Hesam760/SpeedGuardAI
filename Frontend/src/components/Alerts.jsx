import React from "react";
import { IoShieldCheckmarkSharp } from "react-icons/io5";

const Alerts = (props) => {
  return (
    <>
      <div
        className={`alert w-75 alert-${props.type} alert-dismissible fade show justify-content-center`}
        role="alert"
        style={{
          position: "absolute",
          top: "20px",
          left: "50%",
          borderRadius: "10px",
          transform: "translateX(-50%)",
          zIndex: "10",
        }}
      >
        <IoShieldCheckmarkSharp className="mr-1" color={props.color} size="1.5em" />
        {props.msg}
        <button
          type="button"
          className="close"
          data-dismiss="alert"
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </>
  );
};

export default Alerts;
