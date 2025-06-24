import { useEffect, useRef } from 'react';

// clickCoordinates type : { lng: number, lat: number }
/**
 * 
 * @param {Object} props
 * @param {maplibreMap} props.map
 * @returns 
 */
export default function ActionsMenu({ clickCoordinates, pointsArray, setPointsArray, selectedPoint, setSelectedPoint }) {

  const actionsMenu = useRef(null);

  const markerColors = ['red', 'blue', 'yellow', 'green'];
  const iconTypes = ['skull', 'chest', 'sword'];

  const onIconClicked = (icon) => {

    if (!selectedPoint && clickCoordinates) { // if no points are selected

      const {lng, lat} = clickCoordinates;

      const newPointsArray = [...pointsArray]
      
      newPointsArray.push(
        {
          id: `${icon}_${lng}_${lat}_icon`, // format of icons to have unique identifiers
          coordinates: [lng, lat],
        }
      );
      setPointsArray(newPointsArray);
      
      return;  
    }

    if (selectedPoint) {
      /** @type {string} selectedPoint.id */
      const pointIdAsArray = selectedPoint.id.split('_');
      if (pointIdAsArray[0] === `${icon}` && pointIdAsArray[3] === 'icon') {
        return;
      }
      
      

      const newPointsArray = [...pointsArray]
      .filter((point) => point.id !== selectedPoint.id);

      newPointsArray.push(
        {
          id: `${icon}_${selectedPoint.coordinates[0]}_${selectedPoint.coordinates[1]}_icon`,
          coordinates: selectedPoint.coordinates,
        }
      );

      setPointsArray(newPointsArray);
    }
  }

  const onMarkerClicked = (color) => {
    
    if (!selectedPoint && clickCoordinates) { // if no points are selected

      const {lng, lat} = clickCoordinates;

      const newPointsArray = [...pointsArray]
      .filter((point) => point.id !== `${color}_marker`);
      
      newPointsArray.push(
        {
          id: `${color}_marker`,
          coordinates: [lng, lat],
        }
      );
      setPointsArray(newPointsArray);
      
      return;  
    }

    if (selectedPoint) {
      if (selectedPoint.id === `${color}_marker`) {
        return;
      }

      const newPointsArray = [...pointsArray]
      .filter((point) => point.id !== `${color}_marker` && point.id !== selectedPoint.id);

      newPointsArray.push(
        {
          id: `${color}_marker`,
          coordinates: selectedPoint.coordinates,
        }
      );

      setPointsArray(newPointsArray);
    }
  }

  const onDeleteClicked = () => {
    if (!selectedPoint) {
      return;
    }

    const newPointsArray = [...pointsArray]
    .filter((point) => point.id !== selectedPoint.id);
    setPointsArray(newPointsArray);

    setSelectedPoint(undefined);
  }

  return (
    <div ref={ actionsMenu } className='actionMenu'>

      <button onClick={onDeleteClicked}>Delete</button>

      <div className='markerDiv'>
      {
        markerColors.map((color, index) => (
          <img key={`icon_${index}`} src={`/${color}Marker.png`} alt={`${color} marker`} onClick={() => onMarkerClicked(color)} />
        ))
      }
      </div>

      <div className='iconDiv'>
      {
        iconTypes.map((icon, index) => (
          <img key={`icon_${index}`} src={`/${icon}Icon.png`} alt={`${icon} icon`} onClick={() => onIconClicked(icon)} />
        ))
      }
      </div>

    </div>
  );
}

