import React, { useRef, useState } from 'react';
import CanvasDraw from 'react-canvas-draw';
import axios from 'axios';
import './App.css'

function App() {
  const canvasRef = useRef(null);
  const [prediction, setPrediction] = useState('');

  const handlePredict = async () => {
    const canvas = canvasRef.current.canvasContainer.children[1];
    const dataURL = canvas.toDataURL("image/png");
    const context = canvas.getContext('2d');
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    const isCanvasEmpty = Array.from(imageData.data).every(pixel => pixel === 255);

    if (isCanvasEmpty) {
      alert('Please draw a digit on the canvas');
      return;
    }

    try {
      const response = await axios.post('https://handigit-backend-1.onrender.com/api/predict', { image: dataURL }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // alert(`Predicted Digit: ${response.data.prediction}`);
      setPrediction(`Predicted Digit: ${response.data.prediction}`);
    } catch (error) {
      console.error("There was an error predicting the digit!", error);
      setPrediction("Error predicting digit");
    }
  };

  const handleClear = () => {
    canvasRef.current.clear();
  };
  return (
    <div className="app-container">
      <h1 className="app-title">Handwritten Digit Recognition</h1>
      <div className="canvas-container">
        <CanvasDraw
          ref={canvasRef}
          brushRadius={6}
          canvasWidth={280}
          canvasHeight={280}
          lazyRadius={0}
          hideGrid={true}
          backgroundColor={"#ffffff"}
        />
      </div>
      <div className="button-container">
        <button className="predict-button" onClick={handlePredict}>Predict</button>
        <button className="clear-button" onClick={handleClear}>Clear</button>
      </div>
          {prediction && <p className="prediction-result">{prediction}</p>}
    </div>
  );
}

export default App;
