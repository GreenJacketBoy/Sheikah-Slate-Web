import { useEffect, useRef, useState } from 'react';

// clickCoordinates type : { lng: number, lat: number }
/**
 * 
 * @param {Object} props
 * @param {maplibreMap} props.map
 * @returns 
 */
export default function ActionsMenu({ clickCoordinates, pointsArray, setPointsArray, selectedPoint, setSelectedPoint, markerAndIcons, setClickCoordinates }) {

  const actionsMenu = useRef(null);

  const {markerColors, iconTypes} = markerAndIcons;

  /**
   * @param {string} type 'marker' or 'icon'
   * @param {string} visual the visual identifier, for example 'red' or 'sword'
   * @param {number} lng longitude
   * @param {number} lat latitude
   * @returns 
   */
  const addPointToArray = (type, visual, lng, lat) => {
    if (!type || !visual || !lng || !lat) {
      return;
    }

    let id = undefined;
    let newPointsArray = [...pointsArray]

    if (type === 'marker') {
      id = `${visual}_marker`;
    }
    else if (type === 'icon') {
      id = `${visual}_${lng}_${lat}_icon`;
    }
    else {
      throw new Error(`the only implemented types are marker and icon, not ${type}`);
    }

    if (selectedPoint) {
      // if we modify a point for the exact same point
      if (selectedPoint.id === id) {
        return;
      }
      
      if (type === 'marker') { // there can't be 2 markers with the same color
        newPointsArray = newPointsArray.filter((point) => point.id !== `${visual}_marker` && point.id !== selectedPoint.id);
      }
      else { // there can't be 2 icons with the same symbol at the same coordinates (which makes the id)
        newPointsArray = newPointsArray.filter((point) => point.id !== selectedPoint.id);
      }      
    }    

    newPointsArray.push(
      {
        id: id,
        coordinates: [lng, lat],
      }
    );

    setPointsArray(newPointsArray);
  };


  /**
   * @param {string} type 'marker' or 'icon'
   * @param {string} visual the visual identifier, for example 'red' or 'sword'
   */
  const onActionItemClicked = (type, visual) => {

    if (selectedPoint) {
      const lngLat = selectedPoint.coordinates;
      addPointToArray(type, visual, lngLat[0], lngLat[1]);
      return;  
    }

    if (clickCoordinates) {
      const {lng, lat} = clickCoordinates;
      addPointToArray(type, visual, lng, lat);
    }

    setClickCoordinates(undefined);
    setSelectedPoint(undefined);
  };


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


  return (
    <div ref={ actionsMenu } className='actionMenu'>

      <button onClick={onDeleteClicked}>Delete</button>

      <div className='markerDiv'>
      {
        markerColors.map((color, index) => (
          <img key={`icon_${index}`} src={`/${color}Marker.png`} alt={`${color} marker`} onClick={() => onActionItemClicked('marker', color)} />
        ))
      }
      </div>

      <div className='iconDiv'>
      {
        iconTypes.map((icon, index) => (
          <img key={`icon_${index}`} src={`/${icon}Icon.png`} alt={`${icon} icon`} onClick={() => onActionItemClicked('icon', icon)} />
        ))
      }
      </div>

    </div>
  );
}

