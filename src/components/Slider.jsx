import React from 'react';
import MostPopular from './Movies/MostPopular';
import '../components/slider.css';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

const Slider = (props) => {
  const slides = [1, 2, 3, 4, 5, 6, 7, 8];

  const slideLeft = () => {
    var slider = document.getElementById('slider');
    slider.scrollLeft = slider.scrollLeft - 500;
  };

  const slideRight = () => {
    var slider = document.getElementById('slider');
    slider.scrollLeft = slider.scrollLeft + 500;
  };

  return (
    <div className="main-slider-container">
      <MdChevronLeft
        size={40}
        className="slider-icon left"
        onClick={slideLeft}
      />
      <div className="slider" id="slider">
        {slides.map((slide, index) => {
          return <div className="slider-card"></div>;
        })}
      </div>
      <MdChevronRight
        size={40}
        className="slider-icon right"
        onClick={slideRight}
      />
    </div>
  );
};

export default Slider;
