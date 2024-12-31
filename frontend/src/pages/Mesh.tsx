import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";
import * as THREE from "three";

const RotatingMesh = ({ geometry }: { geometry: THREE.BufferGeometry }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.00; // Slow rotation for better visualization
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial vertexColors={true} flatShading={true} />
    </mesh>
  );
};

const View3 = () => {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [meshFile, setMeshFile] = useState<string | null>(null);
  const location = useLocation();
  const address = location.state.address;
  const model = location.state.model;
  const loader = new PLYLoader();

  useEffect(() => {
    fetch(`http://localhost:4000/mesh/ply/${address}/${model}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        setMeshFile(url);
        loader.load(
          url,
          (geometry) => {
            geometry.computeBoundingBox();
            const boundingBox = geometry.boundingBox;
            if (boundingBox) {
              const center = new THREE.Vector3();
              boundingBox.getCenter(center);
              geometry.translate(-center.x, -center.y, -center.z);
            }

            geometry.scale(0.3, 0.3, 0.3);
            geometry.computeVertexNormals();
            setGeometry(geometry);
          },
          undefined,
          (error) => console.error("Error loading mesh:", error)
        );
      });
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Top Bar */}
      <div
        style={{
          width: "calc(100% - 20px)",
          margin: "10px auto",
          background: "rgba(255, 255, 255, 0.9)",
          padding: "10px 20px",
          borderRadius: "15px",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Address */}
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

        {/* Centered Model */}
        <div style={{ textAlign: "center" }}>
          <p style={{ margin: "0" }}>Model: {model}</p>
        </div>

        {/* Download Button */}
        {meshFile && (
          <a
            href={meshFile}
            download={`${address.replace(/ /g, "_")}_mesh.ply`}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              borderRadius: "20px",
              backgroundColor: "#d3d3d3",
              border: "none",
              cursor: "pointer",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
              textAlign: "center",
              color: "#000", // Black font
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#c0c0c0")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#d3d3d3")
            }
          >
            Download Mesh
          </a>
        )}
      </div>

      {/* Mesh Display */}
      <div style={{ flex: "1", position: "relative" }}>
        <Canvas
          camera={{
            position: [0, 100, 13],
            up: [0, 0, 1],
            fov: 50,
          }}
          style={{ width: "100%", height: "100%" }}
          shadows
        >
          <ambientLight intensity={2.5} />
          <directionalLight position={[10, 10, 10]} intensity={1} />
          {geometry && <RotatingMesh geometry={geometry} />}
          <OrbitControls
            enablePan={false}
            enableZoom={true}
            target={[0, 0, 0]}
            up={[0, 0, 1]}
          />
        </Canvas>
      </div>
    </div>
  );
};

export default View3;
