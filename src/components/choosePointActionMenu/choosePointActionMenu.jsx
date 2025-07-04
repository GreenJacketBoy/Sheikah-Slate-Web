import { useRef } from 'react';

// clickCoordinates type : { lng: number, lat: number }
/**
 * 
 * @param {Object} props
 * @param {maplibreMap} props.map
 * @returns 
 */
export default function ChoosePointActionMenu({ pointsArray, setPointsArray, selectedPoint, setSelectedPoint, setClickCoordinates, displayedMenus, setDisplayedMenus }) {

  const choosePointActionMenu = useRef(null);

  const onDeleteClicked = () => {
    if (!selectedPoint) {
      return;
    }

    const newPointsArray = [...pointsArray]
    .filter((point) => point.id !== selectedPoint.id);
    setPointsArray(newPointsArray);

    setClickCoordinates(undefined);
    setSelectedPoint(undefined);
  }

  const onEditClicked = () => {
    if (!selectedPoint) {
      return;
    }

    const newDisplayedMenus = [...displayedMenus, 'choosePoint']
    .filter((menu) => menu !== 'chooseActionPoint');

    setDisplayedMenus(newDisplayedMenus);
  }

  const onCancelClicked = () => {
    setSelectedPoint(undefined);
    setClickCoordinates(undefined);
  }


  return (
    <div ref={ choosePointActionMenu } className='choose-point-action-menu'>

      <button className='action-bar-button' onClick={onEditClicked}>Edit</button>

      <button className='action-bar-button' onClick={onDeleteClicked}>Delete</button>

      <button className='action-bar-button' onClick={onCancelClicked}>Cancel</button>

    </div>
  );
}

