import React from "react";
import Slider from "react-slick";

/*
 *  详细请参考  https://github.com/akiran/react-slick
 *  <Slider
 *      className,
 *      adaptiveHeight,
 *      ...
 *  ></Slider>
 *
 *
 *
 */

function Sliders(props) {
  return <Slider {...props}>{props.children}</Slider>;
}

export default Sliders;
