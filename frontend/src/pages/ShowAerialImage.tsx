import { useNavigate, useLocation } from "react-router-dom";
import React, { ChangeEvent, useState, useEffect } from "react";
import img1 from "../assets/img1.png";

const ShowAerialImage = () => {
  const [model, setModel] = useState<string>("Depth Anything V2");
  const [image, setImage] = useState<string>("");

  const navigate = useNavigate();
  const location = useLocation();
  const address = location.state.address;

  useEffect(() => {
    fetch(`http://localhost:4000/mesh/image/${address}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((res) => res.blob())
      .then((blob) => {
        setImage(URL.createObjectURL(blob));
      });
  }, []);

  function processStep(e: React.MouseEvent) {
    navigate("/Step3", { state: { address: address, model: model } });
  }

  return (
    <div
      style={{
        height: "100vh", // Full viewport height
        backgroundImage: `url(${img1})`,
        backgroundSize: "cover",
        backgroundPosition: "center 33%",
        margin: "0", // Remove any margin
        padding: "0", // Remove padding
      }}
    >
      {/* Top Bar */}
      <div
        style={{
          width: "calc(100% - 20px)", // Full width minus padding
          margin: "10px auto", // Gap from the navbar
          background: "rgba(255, 255, 255, 0.9)",
          padding: "10px 20px",
          borderRadius: "15px",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Address with Location Pin */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width: "20px", height: "20px", color: "#007bff" }}
          >
            <path d="M21 10c0 7.5-9 12-9 12S3 17.5 3 10a9 9 0 1 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>{address}</span>
        </div>

        {/* Model Selector */}
        <div>
          <label htmlFor="model-select" style={{ marginRight: "10px" }}>
            Model:
          </label>
          <select
            id="model-select"
            value={model}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setModel(e.target.value)
            }
            style={{
              padding: "8px",
              fontSize: "14px",
              border: "none",
              borderRadius: "10px",
              background: "#f0f0f0",
              boxShadow: "inset 0px 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <option value="Depth Anything V2">Depth Anything V2</option>
            <option value="Zoe Depth">Zoe Depth</option>
            <option value="Unet Baseline">Baseline</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          onClick={processStep}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "20px",
            backgroundColor: "#d3d3d3",
            border: "none",
            cursor: "pointer",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
          }}
        >
          Submit
        </button>
      </div>

      {/* Main Content */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "82%", // Remaining height after top bar
        }}
      >
        {image ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Outer Frame */}
            <div
              style={{
                width: "650px",
                height: "650px",
                borderRadius: "40px",
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "rgba(255, 255, 255, 0.78)",
                  borderRadius: "20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src={image}
                  alt="Satellite Image"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "cover",
                    borderRadius: "10px",
                  }}
                />
                {/* Download Icon */}
                <a
                  href={image}
                  download={`satellite_image_${address}.jpg`} // Dynamic download name
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    right: "10px",
                    width: "40px",
                    height: "40px",
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
                    textDecoration: "none",
                  }}
                  title="Download"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ width: "20px", height: "20px", color: "#007bff" }}
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading image...</p>
        )}
      </div>
    </div>
  );
};

export default ShowAerialImage;
