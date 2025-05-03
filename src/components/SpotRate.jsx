// SpotRate.jsx
import React from "react";
import { useSpotRate } from "../context/SpotRateContext";
import goldBar from "../assets/goldBar.png";
import silverBar from "../assets/silverBar.png";

const SpotRate = () => {
  const { goldData, silverData } = useSpotRate();

  const getBackgroundColor = (change) => {
    if (change === "up") {
      return "green"; // Green color for increase
    } else if (change === "down") {
      return "red"; // Red color for decrease
    }
    return "white"; // White color for no change
  };

  const getColor = (change) => {
    if (change === "up") {
      return "white"; // Green color for increase
    } else if (change === "down") {
      return "white"; // Red color for decrease
    }
    return "white"; // White color for no change
  };

  const renderSpotSection = (metal, data) => (
    <div className="rounded-lg flex flex-row justify-between items-center text-center py-2 px-2 w-full">
      <div
        className="font-poppins flex flex-row items-center justify-between text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-white w-full"
        style={{
          borderTopRightRadius: "25px",
          borderTopLeftRadius: "25px",
          padding: "5px 30px",
        }}
      >
        <div>
          <h2>{metal === "gold" ? "Gold" : "Silver"}</h2>
          <h2>Oz</h2>
        </div>
        <div className="border-2 border-[#9060AB] rounded-xl">
          <div
            className="flex justify-center p-1.5 rounded-lg text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold my-2 md:my-4 w-[100px] sm:w-[100px] md:w-[150px] lg:w-[160px]"
            style={{
              color: getColor(data.bidChanged),
              backgroundColor: "",
            }}
          >
            {data.bid}
          </div>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white font-bold bg-[#9060AB] rounded-b-lg">
            LOW {data.low}
          </p>
        </div>
        <div className="border-2 border-[#9060AB] rounded-xl">
          <div
            className="flex justify-center p-1.5 rounded-lg text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold my-2 md:my-4 w-[100px] sm:w-[100px] md:w-[150px] lg:w-[160px]"
            style={{
              color: getColor(data.bidChanged),
              backgroundColor: "",
            }}
          >
            {data.ask}
          </div>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white font-bold bg-[#9060AB] rounded-b-lg">
            HIGH {data.high}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto rounded-lg text-left mt-5 max-w-full rounded-3xl text-white">
      <div className="flex flex-row justify-between bg-[#35004E] py-2 px-6 rounded-t-xl  w-full">
        <h2 className="text-lg sm:text-lg md:text-2xl lg:text-3xl font-bold text-white uppercase w-24">
          Spot Rate
        </h2>
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white uppercase w-24">
          $ BID
        </h2>
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white uppercase w-24">
          $ ASK
        </h2>
      </div>
      <div className="flex flex-col gap-1  bg-[#4E0070] rounded-b-xl">
        {renderSpotSection("gold", goldData)}
        {renderSpotSection("silver", silverData)}
      </div>
    </div>
  );
};

export default SpotRate;
