import {Map as maplibreMap} from 'maplibre-gl';
import { useEffect, useRef } from 'react';

export default function Map({ pointsArray, setSelectedPoint, setClickCoordinates, markerAndIcons }) {

  const map = useRef(null);
  const mapContainer = useRef(null);
  const startCoordinates = { lng: 0, lat: 0 };
  const {markerColors, iconTypes} = markerAndIcons;

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
          'icon-image': ['get', 'imageId'],
          'icon-size': 1,
        }
      });

      map.current.on('click', (event) => {

        const features = map.current.queryRenderedFeatures(event.point, { layers: ['points-layer'] });

        if (features.length > 0) {
          const featureId = features[0].properties.id;
          const newSelectedPoint = {
            id: featureId,
            coordinates: features[0].geometry.coordinates
          };

          setSelectedPoint(newSelectedPoint);
          setClickCoordinates(undefined);          
        } else {
          setSelectedPoint(undefined);
          setClickCoordinates(event.lngLat);
        }
      });

      markerColors.forEach((color) => {
        map.current.loadImage(`/${color}Marker.png`) 
        .then(
          (image) => map.current.addImage(`${color}_marker`, image.data)
        );
      });

      iconTypes.forEach((icon) => {
        map.current.loadImage(`/${icon}Icon.png`) 
        .then(
          (image) => map.current.addImage(`${icon}_icon`, image.data)
        );
      });
      
    })

  
  }, [startCoordinates.lng, startCoordinates.lat, setClickCoordinates, setSelectedPoint]);

  // useEffect for the points array
  useEffect(() => {
    
    const features = [];

    for (const p of pointsArray) {

      /** @type array */
      const idAsArray = p.id.split('_');

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
            // 'red-marker' from 'red-marker' or 'chest-icon' from 'chest-2.76-54.33-icon'
            imageId: `${idAsArray[0]}_${idAsArray[idAsArray.length - 1]}`,
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


  return (
    <div className='map-wrap'>
      <div ref={ mapContainer } className='map'></div>
    </div>
  );
}

