import { motion } from "framer-motion";

export default function AnimateEmail({email} : { email: string}) {
return (
    <motion.p>
      {
        email.split('').map((char, index ) => (
            <motion.span key={index}
            initial = {{ opacity: 0, x: -20}}
            animate = {{ opacity: 1, x: 0}}
            transition={{ delay: index * 0.05, duration: 0.3}}>
                {char}
            </motion.span>
        ))
      }
      </motion.p>
      )
}
