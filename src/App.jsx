import './App.scss';
import Map from './components/map/map'
import ControlBar from './components/control-bar/control-bar';
import { useState } from 'react';

function App() {

  const [pointsArray, setPointArray] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(undefined);
  const [clickCoordinates, setClickCoordinates] = useState(undefined);
  const [selectedPointMarker, setSelectedPointMarker] = useState(undefined);
  const [displayedMenus, setDisplayedMenus] = useState([]);

  const markerAndIcons = {
    markerColors: ['red', 'blue', 'yellow', 'green'],
    iconTypes: ['skull', 'chest', 'sword'],
  };

  return (
    <div className="App">
      <header className="App-header">
        <Map pointsArray={pointsArray} setSelectedPoint={setSelectedPoint} setClickCoordinates={setClickCoordinates} markerAndIcons={markerAndIcons} selectedPoint={selectedPoint} clickCoordinates={clickCoordinates} selectedPointMarker={selectedPointMarker} setSelectedPointMarker={setSelectedPointMarker} ></Map>
        <ControlBar pointsArray={pointsArray} setPointsArray={setPointArray} clickCoordinates={clickCoordinates} selectedPoint={selectedPoint} setSelectedPoint={setSelectedPoint} markerAndIcons={markerAndIcons} setClickCoordinates={setClickCoordinates} displayedMenus={displayedMenus} setDisplayedMenus={setDisplayedMenus} ></ControlBar>
      </header>
    </div>
  );
}

export default App;
