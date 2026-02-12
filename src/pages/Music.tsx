import { useEffect, useState } from "react";

const Music = () => {
  const videos = [
    "ApegC5BGrd4",
    "c5_mX-M7fmk",
    "1_2J3gKpbSQ",
    "QnISXAW2ZTQ",
    "PeB1aFZDpHw",
    "SM4HToR__xo"
  ];

  const [currentVideo, setCurrentVideo] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const changeVideo = () => {
    setIsVisible(false);

    setTimeout(() => {
      const randomId = videos[Math.floor(Math.random() * videos.length)];
      const newSrc = `https://www.youtube-nocookie.com/embed/${randomId}?autoplay=1&mute=1&controls=0&rel=0&showinfo=0`;
      setCurrentVideo(newSrc);

      setTimeout(() => {
        setIsVisible(true);
      }, 500);
    }, 2000);
  };

  useEffect(() => {
    changeVideo();
    const interval = setInterval(changeVideo, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = "transparent";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-transparent flex justify-center items-center overflow-hidden">
      <div 
        className={`w-[1920px] h-[1080px] max-w-full transition-opacity duration-[2000ms] ease-in-out ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {currentVideo && (
          <iframe
            className="w-full h-full border-none"
            src={currentVideo}
            title="YouTube video player"
            allow="autoplay; encrypted-media"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        )}
      </div>
    </div>
  );
};

export default Music;
