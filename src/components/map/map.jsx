import {Map as maplibreMap} from 'maplibre-gl';
import { useEffect, useRef } from 'react';

export default function Map({ pointsArray, selectedPoint, setClickCoordinates }) {

  const map = useRef(null);
  const mapContainer = useRef(null);
  const startCoordinates = { lng: 0, lat: 0 };

  useEffect(() => {
    if (map.current) return; // stops map from intializing more than once
  
    map.current = new maplibreMap({
      container: mapContainer.current,
      style: 'https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json',
      center: [startCoordinates.lng, startCoordinates.lat],
      zoom: 1,
    });

    map.current.on('load', () => {

      map.current.addSource('points', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });
  
  
      map.current.addLayer({ 
        id: 'points-layer',
        type: 'symbol',
        source: 'points',
        layout: {
          'icon-overlap': 'cooperative',
          'text-overlap': 'cooperative',
          'icon-image': ['get', 'id'],
          'icon-size': 1,
        }
      });

      map.current.on('click', (event) => {
        setClickCoordinates(event.lngLat);
        console.log(event.lngLat);
        
      });

      const markerColors = ['red', 'blue', 'yellow', 'green'];

      markerColors.forEach((color) => {
        map.current.loadImage(`/${color}Marker.png`) 
        .then(
          (image) => map.current.addImage(`${color}-marker`, image.data)
        );
      });

    })

  
  }, [startCoordinates.lng, startCoordinates.lat, setClickCoordinates]);

  // useEffect for the points array
  useEffect(() => {
    
    const features = [];

    for (const p of pointsArray) {

      features.push(
        {
          id: p.id,
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: p.coordinates,
          },
          properties: {
            id: p.id,
          }
        }
      );

    }

    const geoJsonSourceDiff = { // removes all features and re add all
      removeAll: true,
      add: features
    };

    const sensorsSource = map.current.getSource('points');
    if (sensorsSource)
      sensorsSource.updateData(geoJsonSourceDiff);


  }, [pointsArray])

  /**
   * @param {maplibreMap} map 
   */
  function actionOnMapClick(map) {

    // 
  }


  return (
    <div className='map-wrap'>
      <div ref={ mapContainer } className='map'></div>
    </div>
  );
}

