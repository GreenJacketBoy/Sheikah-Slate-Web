import ActionsMenu from '../actionsMenu/actionsMenu';
import { useRef } from 'react';

export default function ControlBar({ pointsArray, setPointsArray, clickCoordinates, selectedPoint }) {

  const controlBar = useRef(null);


  return (
    <div ref={ controlBar } className='control-bar'>

      <ActionsMenu clickCoordinates={clickCoordinates} pointsArray={pointsArray} setPointsArray={setPointsArray} selectedPoint={selectedPoint} ></ActionsMenu>

    </div>
  );
}

