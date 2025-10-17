import style from "./welcome.module.scss";
import { photos } from "./bgPhoth";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setStartPageState } from "../../store/startPageSlice";
export default function Welcome() {
  const [showPhotos, setShowPhotos] = useState(true);
  const [showText, setShowText] = useState(false);
  const dispatch = useDispatch();

  const containerWidth = 800;
  const containerHeight = 600;

  useEffect(() => {
    dispatch(setStartPageState(true));
    const totalFallTime = photos.length * 0.2 * 1000 + 2500;
    setTimeout(() => {
      setShowPhotos(false);
      setShowText(true);  
      dispatch(setStartPageState(false)); 
    }, totalFallTime);
  }, []);

  return (
    <div className={style.container}>
      <div className={style.photos}>
        <AnimatePresence>
          {showPhotos &&
            photos.map((photo, index) => {
              const maxOffsetX = containerWidth - 100;
              const maxOffsetY = containerHeight - 100;
              const x = Math.random() * maxOffsetX - maxOffsetX / 2;
              const y = Math.random() * maxOffsetY - maxOffsetY / 2;
              const rotate = Math.random() * 30 - 15;

              return (
                <motion.img
                  key={index}
                  src={photo.image}
                  className={style.photo}
                  style={{ position: "absolute" }}
                  initial={{ y: -300, x: 0, scale: 0.8, rotate, opacity: 0 }}
                  animate={{ y, x, scale: 1, rotate, opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{
                    delay: index * 0.2,
                    type: "spring",
                    stiffness: 100,
                    damping: 12,
                  }}
                />
              );
            })}
        </AnimatePresence>
      </div>

      {showText && (
        <svg viewBox="0 0 800 100" className={style.textOverlay}>
          <text x="250" y="70" className={style.sandText}>
            {"Welcome".split("").map((letter, i) => (
              <tspan
                key={i}
                className={style.letter}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {letter}
              </tspan>
            ))}
          </text>
        </svg>
      )}
    </div>
  );
}