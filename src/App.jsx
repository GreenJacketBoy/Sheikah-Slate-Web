import './App.scss';
import Map from './components/map/map'
import ControlBar from './components/control-bar/control-bar';
import { useState } from 'react';

function App() {

  const [pointsArray, setPointArray] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(undefined);
  const [clickCoordinates, setClickCoordinates] = useState(undefined);

  return (
    <div className="App">
      <header className="App-header">
        <Map pointsArray={pointsArray} setSelectedPoint={setSelectedPoint} setClickCoordinates={setClickCoordinates}></Map>
        <ControlBar pointsArray={pointsArray} setPointsArray={setPointArray} setSelectedPoint={setSelectedPoint} clickCoordinates={clickCoordinates} selectedPoint={selectedPoint}></ControlBar>
      </header>
    </div>
  );
}

export default App;
