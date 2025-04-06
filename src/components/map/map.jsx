import {Map as maplibreMap} from 'maplibre-gl';
import { useEffect, useRef } from 'react';

export default function Map() {

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
  
  }, [startCoordinates.lng, startCoordinates.lat]);

  return (
    <div className='map-wrap'>
      <div ref={ mapContainer } className='map'></div>
    </div>
  );
}

