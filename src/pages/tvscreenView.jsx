import React, { useCallback, useEffect, useState, useRef } from "react";
import { Grid, Paper, Typography, Box, useMediaQuery } from "@mui/material";
import LimitExceededModal from "../components/LimitExceededModal";
import SpotRate from "../components/SpotRate";
import CommodityTable from "../components/CommodityTable";
import NewsTicker from "../components/News";
import YaqootLogo from "../assets/yaqootLogo2.png";
import {
  fetchSpotRates,
  fetchServerURL,
  fetchNews,
  fetchTVScreenData,
} from "../api/api";
import io from "socket.io-client";
import { useSpotRate } from "../context/SpotRateContext";

const SECRET_KEY = "aurify@123";
const DEFAULT_SYMBOLS = ["GOLD", "SILVER"];

function TvScreen() {
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [dateTime, setDateTime] = useState(new Date());
  const [serverURL, setServerURL] = useState("");
  const [news, setNews] = useState([]);
  const [marketData, setMarketData] = useState({});
  const [commodities, setCommodities] = useState([]);
  const [goldBidSpread, setGoldBidSpread] = useState("");
  const [goldAskSpread, setGoldAskSpread] = useState("");
  const [silverBidSpread, setSilverBidSpread] = useState("");
  const [silverAskSpread, setSilverAskSpread] = useState("");
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const [symbols, setSymbols] = useState(["GOLD", "SILVER"]);
  const [error, setError] = useState(null);

  const { updateMarketData } = useSpotRate();

  const adminId = import.meta.env.VITE_APP_ADMIN_ID;

  updateMarketData(
    marketData,
    goldBidSpread,
    goldAskSpread,
    silverBidSpread,
    silverAskSpread
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [spotRatesRes, serverURLRes, newsRes] = await Promise.all([
          fetchSpotRates(adminId),
          fetchServerURL(),
          fetchNews(adminId),
        ]);

        // Handle Spot Rates
        const {
          commodities,
          goldBidSpread,
          goldAskSpread,
          silverBidSpread,
          silverAskSpread,
        } = spotRatesRes.data.info;
        setCommodities(commodities);
        setGoldBidSpread(goldBidSpread);
        setGoldAskSpread(goldAskSpread);
        setSilverBidSpread(silverBidSpread);
        setSilverAskSpread(silverAskSpread);

        // Handle Server URL
        const { serverURL } = serverURLRes.data.info;
        setServerURL(serverURL);

        // Handle News
        setNews(newsRes.data.news.news);
      } catch (error) {
        // console.error("Error fetching data:", error);
        setError("An error occurred while fetching data");
      }
    };

    fetchData();

    // Fetch TV screen data (you can leave this as a separate call)
    fetchTVScreenData(adminId)
      .then((response) => {
        // console.log(response);
        if (response.status === 200) {
          // Allow TV screen view
          setShowLimitModal(false);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          setShowLimitModal(true); // Show the modal on 403 status
        } else {
          // console.error("Error:", error.message);
          alert("An unexpected error occurred.");
        }
      });
  }, [adminId]);

  // Function to connect to WebSocket after server URL is fetched
  const connectSocket = useCallback(() => {
    console.log("count");
    if (!serverURL) return;

    console.log("Connecting to WebSocket server:", serverURL);

    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    socketRef.current = io(serverURL, {
      query: { secret: SECRET_KEY },
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to WebSocket server");
      socketRef.current.emit("request-data", symbols);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
      // Attempt to reconnect
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      reconnectTimeoutRef.current = setInterval(connectSocket, 5000);
    });

    socketRef.current.on("market-data", (data) => {
      // console.log(data);

      if (data && data.symbol) {
        // Update the market data state by merging with previous data
        setMarketData((prevData) => ({
          ...prevData,
          [data.symbol]: {
            ...prevData[data.symbol], // Keep the existing data for the symbol
            ...data, // Overwrite with new data from the event
            bidChanged:
              prevData[data.symbol] && data.bid !== prevData[data.symbol].bid
                ? data.bid > prevData[data.symbol].bid
                  ? "up"
                  : "down"
                : null, // Track bid change direction
          },
        }));
      } else {
        console.warn("Received malformed market data:", data);
      }
    });

    socketRef.current.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
    });
  }, [serverURL, symbols]);

  useEffect(() => {
    if (serverURL) {
      connectSocket();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connectSocket]);

  const refreshData = useCallback(() => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit("request-data", symbols);
    } else {
      connectSocket();
    }
  }, [symbols, connectSocket]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getDayName = (date) => {
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  const getFormattedDate = (date) => {
    return date
      .toLocaleDateString("en-GB", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
      .toUpperCase();
  };

  return (
    <Box sx={{ minHeight: "100vh", color: "white", padding: "20px" }}>
      <Grid
        container
        spacing={4}
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
      >
        {/* Side: SpotRate and Logo */}
        <Grid item xs={12} md={5}>
          <Box className="flex flex-row justify-between">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img src={YaqootLogo} alt="Logo" className="w-56 h-36 max-sm:w-36 max-sm:h-20" />
            </Box>
            <Box className="flex flex-col justify-end text-right">
              <Box className="flex flex-row">
                <h2
                  className="text-[#FFFFFF] text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold"
                >
                  {getDayName(dateTime)},
                </h2>
                <h2
                  className="text-[#FFFFFF] text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold ml-2"
                >
                  {getFormattedDate(dateTime)}
                </h2>
              </Box>
              <Box>
              <h2
                className="text-[#FFFFFF] text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold"
              >
                {dateTime.toLocaleTimeString()}
              </h2>
              </Box>
            </Box>
          </Box>

          {/* SpotRate Component */}
          <SpotRate />
        </Grid>

        {/* Side: DateTime + Commodity Table */}
        <Grid item xs={12} md={7}>
          {/* Commodity Table */}
          <CommodityTable commodities={commodities} />
          
        </Grid>
      </Grid>

      {/* News Component */}
      <NewsTicker newsItems={news} />

      {/* Conditional rendering of the modal */}
      {showLimitModal && <LimitExceededModal />}
    </Box>
  );
}

export default TvScreen;
