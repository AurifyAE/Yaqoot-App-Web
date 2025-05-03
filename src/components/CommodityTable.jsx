import React from "react";
import { useSpotRate } from "../context/SpotRateContext";
import "../App.css"

const CommodityTable = ({ commodities }) => {
  const { goldData, silverData } = useSpotRate();

  // Helper function to get bid and ask values based on metal type
  const getBidAskValues = (metal) => {
    if (metal === "gold" || metal === "gold kilobar" || metal === "gold ten tola") {
      return {
        bid: parseFloat(goldData.bid) || 0,
        ask: parseFloat(goldData.ask) || 0,
      };
    } else if (metal === "silver") {
      return {
        bid: parseFloat(silverData.bid) || 0,
        ask: parseFloat(silverData.ask) || 0,
      };
    }
    return { bid: 0, ask: 0 };
  };

  // Helper function to calculate purity power
  const calculatePurityPower = (purityInput) => {
    if (!purityInput || isNaN(purityInput)) return 1;
    return purityInput / Math.pow(10, purityInput.toString().length);
  };

  // Helper function to conditionally round values
  const formatValue = (value, weight) => {
    return weight === "GM" ? value.toFixed(2) : Math.round(value);
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left table-spacing">
          <thead>
            <tr>
              <th className="bg-[#35004E] text-white text-xs text-lg sm:text-xl md:text-2xl lg:text-3xl p-2 md:p-3 rounded-tl-xl px-5">Commodity</th>
              <th className="bg-[#35004E] text-white text-xs text-lg sm:text-xl md:text-2xl lg:text-3xl p-2 md:p-3">Unit</th>
              <th className="bg-[#35004E] text-white text-xs text-lg sm:text-xl md:text-2xl lg:text-3xl p-2 md:p-3 rounded-tr-xl">Price</th>
            </tr>
          </thead>
          <tbody>
            {commodities.map((commodity, index) => {
              const { bid, ask } = getBidAskValues(commodity.metal.toLowerCase());
              const {
                unit,
                weight,
                buyCharge,
                sellCharge,
                buyPremium,
                sellPremium,
                purity,
              } = commodity;

              const unitMultiplier =
                {
                  GM: 1,
                  KG: 1000,
                  TTB: 116.64,
                  TOLA: 11.664,
                  OZ: 31.1034768,
                }[weight] || 1;

              const purityValue = parseFloat(purity) || 0;
              const purityPower = calculatePurityPower(purityValue);
              const buyChargeValue = parseFloat(buyCharge) || 0;
              const sellChargeValue = parseFloat(sellCharge) || 0;
              const buyPremiumValue = parseFloat(buyPremium) || 0;
              const sellPremiumValue = parseFloat(sellPremium) || 0;

              const biddingValue = bid + buyPremiumValue;
              const askingValue = ask + sellPremiumValue;
              const biddingPrice = (biddingValue / 31.103) * 3.674;
              const askingPrice = (askingValue / 31.103) * 3.674;

              const buyPrice =
                biddingPrice * unitMultiplier * purityPower + buyChargeValue;
              const sellPrice =
                askingPrice * unitMultiplier * purityPower + sellChargeValue;

              return (
                <tr key={index} className="bg-[#3A0353] table-row-gap">
                  <td className="p-2 md:p-3 text-lg sm:text-xl md:text-2xl lg:text-3xl px-5">
                    {commodity.metal.toUpperCase()} {purity}
                  </td>
                  <td className="p-2 md:p-3 text-lg sm:text-xl md:text-2xl lg:text-3xl">
                    {unit} {weight}
                  </td>
                  <td className="p-2 md:p-3 text-lg sm:text-xl md:text-2xl lg:text-3xl">
                    {formatValue(sellPrice, weight)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CommodityTable;