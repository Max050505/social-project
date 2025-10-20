
import AuthForm from "../Components/AuthForm/AuthForm";
import { useCurrentUser } from "../Utils/http";
import { useEffect } from "react";
import { motion, easeInOut, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { setRandomWall } from "../store/wallSlice";
import type { RootState } from "../store";
export default function AuthenticationPage() {
  const pageSwap = {
    initial: { opacity: 0, rotateY: -90 },
    animate: { opacity: 1, rotateY: 0 },
    exit: { opacity: 0, rotateY: 90 },
  };
  const dispatch = useDispatch();
  const { isLoading, } = useCurrentUser();

  const { walls, currentWallIndex } = useSelector(
    (state: RootState) => state.wall
  );
  const currentWall = walls[currentWallIndex].image;

  useEffect(() => {
    dispatch(setRandomWall());
  }, [dispatch]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        variants={pageSwap}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.8, ease: easeInOut }}
        style={{
          perspective: 1000,
          backfaceVisibility: "hidden",
          transformStyle: "preserve-3d",
          backgroundImage: `url(${currentWall})`,
          backgroundSize: "cover",
        }}
      >
        {isLoading ? <p>Завантажуєм сторінку...</p> : <AuthForm />}
      </motion.div>
    </AnimatePresence>
  );
}
