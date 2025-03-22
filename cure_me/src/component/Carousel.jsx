import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import lungs from "../assets/images/lungs.mp4";
import image1 from "../assets/images/d1.jpg"
import image2 from "../assets/images/d2.jpg"
import detection1 from "../assets/images/detection1.mp4"
import smoke from "../assets/images/smoke.mp4"
const mediaItems = [
  { type: "video", src: smoke },
  { type: "image", src: image1 },
  { type: "image", src: image2 },
  { type: "video", src: detection1 },
  { type: "video", src: lungs },
 
];

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % mediaItems.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? mediaItems.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto  rounded-lg shadow-lg  top-0 left-0">
      {/* Slide Transition */}
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.5 }}
      >
        {/* Render Image or Video */}
        {mediaItems[currentIndex].type === "image" ? (
          <img
            src={mediaItems[currentIndex].src}
            alt="carousel"
            className="w-full h-[75vh] object-cover rounded-lg"
          />
        ) : (
          <video
            src={mediaItems[currentIndex].src}
            controls
            autoPlay
            loop
            className="w-full h-[75vh] object-cover rounded-lg"
          />
        )}
      </motion.div>

      {/* Left Button */}
      <button
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600"
        onClick={prevSlide}
      >
        <ChevronLeft size={24} />
      </button>

      {/* Right Button */}
      <button
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600"
        onClick={nextSlide}
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {mediaItems.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-blue-500" : "bg-gray-300"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}
