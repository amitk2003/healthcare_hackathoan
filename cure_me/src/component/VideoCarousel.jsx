import { useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const videos = [
  { id: 1, src: "/assets/videos/cancer_cells.mp4" },
  { id: 2, src: "/assets/videos/detection1.mp4" },
  { id: 3, src: "/assets/videos/detection2.mp4" },
  { id: 4, src: "/assets/videos/detection3.mp4" },
  { id: 5, src: "/assets/videos/cancer_detection.mp4" },
];

export default function VideoCarousel() {
  const carouselRef = useRef(null);
  const videoRefs = useRef([]);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -window.innerWidth * 0.9, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: window.innerWidth * 0.9, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          console.log(`Video ${video.src} isIntersecting: ${entry.isIntersecting}`);

          if (entry.isIntersecting) {
            console.log(`Playing video: ${video.src}`);
            video.play();
          } else {
            console.log(`Pausing video: ${video.src}`);
            video.pause();
          }
        });
      },
      { threshold: 0.3 } // Adjusted for better visibility detection
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      videoRefs.current.forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        video.addEventListener("loadeddata", () => {
          console.log(`Video ${index} loaded successfully`);
        });
      }
    });
  }, []);

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-black">
      {/* Left Button */}
      <button
        onClick={scrollLeft}
        className="absolute left-2 z-10 p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition sm:block"
      >
        <ChevronLeft size={32} />
      </button>

      {/* Video List */}
      <div
        ref={carouselRef}
        className="flex gap-6 overflow-x-scroll scroll-smooth scrollbar-hide w-full h-full p-4"
      >
        {videos.map((video, index) => (
          <div key={video.id} className="flex-shrink-0 w-full h-full">
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              src={video.src}
              controls
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover rounded-lg shadow-lg"
              onMouseEnter={(e) => e.target.play()}
              onMouseLeave={(e) => e.target.pause()}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
      </div>

      {/* Right Button */}
      <button
        onClick={scrollRight}
        className="absolute right-2 z-10 p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition sm:block"
      >
        <ChevronRight size={32} />
      </button>
    </div>
  );
}
