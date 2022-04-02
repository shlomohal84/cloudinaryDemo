import React from "react";

function Spinner() {
  return (
    <div
      style={{ width: "10em", height: "10em", borderWidth: "1em" }}
      className="Spinner spinner-border text-primary position-absolute top-50 start-50"
      role="status"
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  );
}

export default Spinner;
