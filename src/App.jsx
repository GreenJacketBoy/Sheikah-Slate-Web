import './App.scss';
import Map from './components/map/map'
import ControlBar from './components/control-bar/control-bar';
import { useState } from 'react';

function App() {

  const [pointsArray, setPointArray] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(undefined);

  return (
    <div className="App">
      <header className="App-header">
        <Map pointsArray={pointsArray} selectedPoint={selectedPoint}></Map>
        <ControlBar pointsArray={pointsArray} setPointsArray={setPointArray} setSelectedPoint={setSelectedPoint}></ControlBar>
      </header>
    </div>
  );
}

export default App;
