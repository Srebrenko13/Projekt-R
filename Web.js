import backgroundImage from '../pages/lucrezia-carnelos-yGv-pvgRuiI-unsplash.jpg'; // Replace with the actual path to your image file


import React, { Component, useEffect, useState } from "react";
import axios from "axios";
import { request } from "http";
interface DeviceStates {
  device1: { turnOn: boolean; color: string; dimLights: boolean };
  device2: { turnOn: boolean; color: string; dimLights: boolean };
}

const Home = () => {
  const [selectedDevice, setSelectedDevice] = useState<
    keyof DeviceStates | null
  >(null);
  const [deviceStates, setDeviceStates] = useState<DeviceStates>({
    device1: { turnOn: true, color: "red", dimLights: false },
    device2: { turnOn: true, color: "red", dimLights: false },
  });
  const [selectedColor, setSelectedColor] = useState<string>("red");

  const [sliderValue, setSliderValue] = useState(50); // Default slider value

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    var value = event.target.value;
    setSliderValue(parseInt(value));
  };
  const handleDeviceSelect = (device: keyof DeviceStates) => {
    setSelectedDevice(device);
  };

  const handleTurnOnOff = async () => {
    if (selectedDevice) {
      setDeviceStates((prevStates) => ({
        ...prevStates,
        [selectedDevice]: {
          ...prevStates[selectedDevice],
          turnOn: !prevStates[selectedDevice].turnOn,
        },
      }));
    }
    const response = await axios.get("http://192.168.1.14:8000/toggleState");
    console.log(response);
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(event.target.value);
    console.log(event.target.value);
  };

  const handleDimLights = () => {
    if (selectedDevice) {
      setDeviceStates((prevStates) => ({
        ...prevStates,
        [selectedDevice]: {
          ...prevStates[selectedDevice],
          dimLights: !prevStates[selectedDevice].dimLights,
        },
      }));
    }
  };

  function handleDim() {
    console.log(sliderValue);
    var req = "http://192.168.1.14:8000/brightness?value=" + sliderValue;
    const response = axios.get(req);
  }
  function handleColor() {
    console.log(selectedColor);
    var req =
      "http://192.168.1.14:8000/colorStateHex?color=%23" +
      selectedColor.substring(1);
    axios.get(req);
  }

  function colorTemp(color: any) {
    var req = "http://192.168.1.14:8000/colorTemp?colorTemp=" + color;
    axios.get(req);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-[url('../pages/api/smarthome.jpg')]"         style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bg-white p-8 rounded shadow-md w-100 justify-center items-center">
        <h1 className="text-3xl font-bold mb-8 text-center text-black">
          Smart Home
        </h1>
        <div className="flex justify-center items-center">
          <div className="flex space-x-4 mb-5">
            <button
              className={`py-2 px-4 rounded ${
                selectedDevice === "device1"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300"
              }`}
              onClick={() => handleDeviceSelect("device1")}
            >
              Device 1
            </button>

            <button
              className={`py-2 px-4 rounded ${
                selectedDevice === "device2"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300"
              }`}
              onClick={() => handleDeviceSelect("device2")}
            >
              Device 2
            </button>
          </div>
        </div>

        {selectedDevice && (
          <div className="grid grid-cols-4 gap-4">
            <div className="flex justify-center items-center border-r pr-4">
              <button
                className="bg-slate-600 text-white py-2 px-4 rounded"
                onClick={handleTurnOnOff}
              >
                {deviceStates[selectedDevice].turnOn ? "Turn On" : "Turn Off"}
              </button>
            </div>
            <div className="col-span-1 flex flex-col space-y-2 mt-7 border-r pr-4">
              <label htmlFor="slider">Adjust Value:</label>
              <input
                type="range"
                id="slider"
                name="slider"
                min={0}
                max={254}
                value={sliderValue}
                onChange={handleSliderChange}
              />
              <button
                className="bg-slate-600 text-white py-2 px-4 rounded w-full"
                style={{
                  backgroundColor: `rgba(0, 0, 0, ${
                    sliderValue === 0 ? 0.1 : sliderValue / 254
                  })`,
                  color: "#fff",
                  fontSize: "0.75rem",
                }}
                onClick={handleDim}
              >
                DIM LIGHTS
              </button>
            </div>

            <div className="col-span-1 flex flex-col space-y-2 mt-4 border-r pr-4">
              <label htmlFor="color">Select Color:</label>
              <input
                type="color"
                id="color"
                name="color"
                value={selectedColor}
                onChange={handleColorChange}
              />
              <button
                className="py-2 px-4 rounded w-full"
                style={{ backgroundColor: selectedColor, color: "#fff" }}
                onClick={handleColor}
              >
                COLOR CHANGE
              </button>
            </div>

            <div className="col-span-1 flex flex-col space-y-2 mt-4">
              <button
                className="bg-blue-400 text-white py-2 px-4 rounded w-full"
                onClick={() => colorTemp("coolest")}
              >
                Coolest
              </button>
              <button
                className="bg-indigo-200 text-white py-2 px-4 rounded w-full"
                onClick={() => colorTemp("cool")}
              >
                Cool
              </button>
              <button
                className="bg-zinc-500 text-white py-2 px-4 rounded w-full"
                onClick={() => colorTemp("neutral")}
              >
                Neutral
              </button>
              <button
                className="bg-orange-400 text-white py-2 px-4 rounded w-full"
                onClick={() => colorTemp("warm")}
              >
                Warm
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;