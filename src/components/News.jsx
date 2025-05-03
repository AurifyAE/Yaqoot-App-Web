import React from "react";

const NewsTicker = ({ newsItems }) => {
  return (
    <div className="flex flex-row items-center justify-center bg-[#4E0070] rounded-md h-12 sm:h-14 md:h-16 mt-4 shadow-md overflow-hidden">
      {/* Label section */}
      <div className="flex items-center justify-center bg-[#35004E] text-white font-bold text-center h-full rounded-l-xl px-4 w-24 sm:w-32 md:w-40 lg:w-64">
        <span className="text-xs sm:text-sm md:text-base lg:text-lg truncate">
          NEWS
        </span>
      </div>

      {/* News ticker section */}
      <div className="w-full overflow-hidden whitespace-nowrap relative h-full">
        <div 
          className="inline-block ticker-scroll h-full"
          style={{animation: "scrollText 40s linear infinite"}}
        >
          {newsItems.map((item, index) => (
            <span
              key={index}
              className="mr-8 sm:mr-12 md:mr-16 inline-flex items-center text-white text-sm sm:text-base md:text-lg lg:text-xl font-bold h-full"
            >
              {item.description}
            </span>
          ))}
        </div>
        
        {/* CSS animation for the ticker */}
        <style jsx>{`
          @keyframes scrollText {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          
          .ticker-scroll {
            animation: scrollText 40s linear infinite;
          }
          
          /* Pause animation on hover for better readability */
          .ticker-scroll:hover {
            animation-play-state: paused;
          }
        `}</style>
      </div>
    </div>
  );
};

export default NewsTicker;