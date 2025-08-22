  import RegistrationForm from "../Components/RegistrationForm/RegistrationForm";
  import { easeInOut, motion } from "framer-motion";
  import { useEffect } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import {setRandomWall} from '../store/wallSlice'
  import { RootState } from "../store";
  export default function RegistrationPage() {
    const dispatch = useDispatch();
    const {walls, currentWallIndex} =useSelector(((state:RootState) => state.wall))
    useEffect(()=> {dispatch(setRandomWall())}, [dispatch]);
    const currentWall = walls[currentWallIndex].image;
    const pageSwap = {
      initial: { opacity: 0, rotateY: 90 },
      animate: { opacity: 1, rotateY: 0 },
      exit: { opacity: 0, rotateY: -90 },
    };
    return (
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
          backgroundSize: 'cover',
        }}
      >
        <RegistrationForm />
      </motion.div>
    );
  }
