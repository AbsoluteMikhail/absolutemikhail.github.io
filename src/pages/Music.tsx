import { useCallback, useEffect, useState } from "react";

const MUSIC_VIDEO_IDS = [
  "ApegC5BGrd4",
  "c5_mX-M7fmk",
  "1_2J3gKpbSQ",
  "QnISXAW2ZTQ",
  "PeB1aFZDpHw",
  "SM4HToR__xo",
];

const Music = () => {
  const [currentVideo, setCurrentVideo] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const changeVideo = useCallback(() => {
    setIsVisible(false);

    setTimeout(() => {
      const randomId = MUSIC_VIDEO_IDS[Math.floor(Math.random() * MUSIC_VIDEO_IDS.length)];
      const newSrc = `https://www.youtube-nocookie.com/embed/${randomId}?autoplay=1&mute=1&controls=0&rel=0&showinfo=0`;
      setCurrentVideo(newSrc);

      setTimeout(() => {
        setIsVisible(true);
      }, 500);
    }, 2000);
  }, []);

  useEffect(() => {
    changeVideo();
    const interval = setInterval(changeVideo, 60000);
    return () => clearInterval(interval);
  }, [changeVideo]);

  useEffect(() => {
    document.body.style.backgroundColor = "transparent";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-transparent flex justify-center items-center overflow-hidden">
      <div 
        className={`w-[1920px] h-[1080px] max-w-full transition-opacity duration-2000 ease-in-out ${
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
