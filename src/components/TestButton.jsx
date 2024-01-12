import React, { useState, useEffect } from 'react';

const TestButton = () => {
  const [buttonColor, setButtonColor] = useState(false);
  const [style, setStyle] = useState({});

  const makeButtonGreen = () => {
    setStyle({ backgroundColor: 'green' });
  };

  console.log(0);
  useEffect(() => {
    setStyle({}); // Set initial style (empty object) or provide your initial style
    setButtonColor(true);
  }, []); // Empty dependency array means this effect runs once after the initial render

  return (
    <div>
      <button style={style} onClick={makeButtonGreen}>
        asdf
      </button>
    </div>
  );
};

export default TestButton;
