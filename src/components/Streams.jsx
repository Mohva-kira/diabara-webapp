import React from "react";
import { IoHeadsetOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import CountUp from "react-countup";

const Streams = ({ streams }) => {
  // console.log('streams songs', streams)
  console.log('streams comp', streams)
  return (
    <motion.button
      whileHover={{ scale: 1.4 }}
      whileTap={{ scale: 0.9 }}
      className="  items-center justify-center gap-2 flex flex-row text-orange-500 p-1"
    >
      <IoHeadsetOutline />
      <i className="text-xs ">
        <span className="w-10 h-10">
          <CountUp
            start={0}
            end={streams ? streams?.meta?.pagination?.total : 0}
            duration={2.75}
            separator=" "
          />
        </span>
      </i>
    </motion.button>
  );
};

export default Streams;
