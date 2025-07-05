import {Map as maplibreMap, Marker} from 'maplibre-gl';
import { useEffect, useRef } from 'react';

export default function Map({ pointsArray, setSelectedPoint, setClickCoordinates, markerAndIcons, selectedPoint, clickCoordinates, selectedPointMarker, setSelectedPointMarker }) {

  const map = useRef(null);
  const mapContainer = useRef(null);
  const startCoordinates = { lng: 0, lat: 0 };
  const {markerColors, iconTypes} = markerAndIcons;

  useEffect(() => {

    if (!map.current || !selectedPointMarker) {
      return;
    }
    
    if (selectedPoint) {
      selectedPointMarker.setLngLat(selectedPoint.coordinates).addTo(map.current);
      return;
    }

    if (clickCoordinates) {
      selectedPointMarker.setLngLat([clickCoordinates.lng, clickCoordinates.lat]).addTo(map.current);
      return;
    }

    selectedPointMarker.remove();

  }, [selectedPoint, clickCoordinates]);


  useEffect(() => {
    if (map.current) return; // stops map from intializing more than once
  
    map.current = new maplibreMap({
      container: mapContainer.current,
      style: 'https://openmaptiles.geo.data.gouv.fr/styles/osm-bright/style.json',
      center: [startCoordinates.lng, startCoordinates.lat],
      zoom: 1,
    });

    map.current.dragRotate.disable();
    map.current.keyboard.disable();
    map.current.touchZoomRotate.disableRotation();


    map.current.on('load', () => {

      applyMapStyle(map.current);

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
        map.current.loadImage(`/Sheikah-Slate-Web/${color}Marker.png`) 
        .then(
          (image) => map.current.addImage(`${color}_marker`, image.data)
        );
      });

      iconTypes.forEach((icon) => {
        map.current.loadImage(`/Sheikah-Slate-Web/${icon}Icon.png`) 
        .then(
          (image) => map.current.addImage(`${icon}_icon`, image.data)
        );
      });

      // adding 2 of my hand drawn pixel images to the map
      ['sheikahTower', 'shrine'].forEach((imageName) => {
        map.current.loadImage(`/Sheikah-Slate-Web/${imageName}.png`) 
          .then(
            (image) => map.current.addImage(imageName, image.data)
          );
      })
      
    })

    const selectedPointMarkerElement = document.createElement('img');
    selectedPointMarkerElement.setAttribute('key', 'selectedPointImage');
    selectedPointMarkerElement.setAttribute('src', '/Sheikah-Slate-Web/selectedPoint.png');
    selectedPointMarkerElement.setAttribute('alt', 'Circle representing the selected point');

    setSelectedPointMarker(new Marker({element: selectedPointMarkerElement}));
  
  }, [startCoordinates.lng, startCoordinates.lat, setClickCoordinates, setSelectedPoint, setSelectedPointMarker, iconTypes, markerColors]);

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


  /** @param {maplibreMap} mapCurrent */
  const applyMapStyle = (mapCurrent) => {    
    
    const newMapStyle = mapCurrent.getStyle();
    
    newMapStyle.layers = newMapStyle.layers
    .map((layer) => {
      
      if (layer.id === 'water-pattern') { // basically all water except river lines        
        return changePaint(layer, { "fill-color": "rgb(51, 66, 68)"});
      }
      if (layer.id === 'boundary-water') { // coast border
        return changePaint(layer, { "line-color": "rgb(100, 126, 150)"}, true);
      }
      if (layer.id === 'water-offset') { // coast border from zoom out
        return changePaint(layer, {"fill-color": "rgb(100, 126, 150)"}, true);
      }
      if (layer.id === 'ferry') { // removes the dashed water paths in seas nd oceans
        return changeLayout(layer, {"visibility": "none"});
      }
      if (layer.id === 'background') { // color of the land
        return changePaint(layer, { "background-color":"rgb(70, 54, 9)"});
      }
      if (layer.id === 'landcover-grass' || layer.id === 'landcover-grass-park') { // remove grass area
        return changeLayout(layer, {"visibility": "none"});
      }
      if (layer.id === 'landcover-wood') { // color of the woods
        return changePaint(layer, {"fill-color": "rgb(56, 48, 25)", "fill-opacity": 0.7, "fill-outline-color": "rgb(27, 19, 0)"}, true);
      }
      if (layer.id === 'landcover-sand') { // color of the sand
        return changePaint(layer, {"fill-color": "rgb(165, 143, 78)", "fill-opacity": 0.7, "fill-outline-color": "rgb(27, 19, 0)"}, true);
      }      
      if (layer.id.includes('landuse')) { // removes styles specific to landuse
        return changeLayout(layer, {"visibility": "none"});
      }
      if (layer.id === 'building') { // color of the building (walls from the false 3d effect)
        return changePaint(layer, {"fill-color": "rgb(27, 19, 0)"}, true);
      }
      if (layer.id === 'building-top') { // color of the top of the building (their roofs)
        return changePaint(layer, {"fill-color": "rgb(56, 48, 25)", "fill-outline-color": "rgb(27, 19, 0)"}, true);
      }
      if (layer.id.includes('highway') && layer.type === 'line') { // color of all types of highway
        return changePaint(layer, {"line-color": "rgb(149, 143, 91)"}, true);
      }
      if (layer.id === 'boundary-land-level-4') { // removes regional separators
        return changePaint(layer, {"line-color": "rgb(126, 165, 202)", "line-width": 0.2});
      }
      if (layer.id === 'boundary-land-level-2') { // color of national separators
        return changePaint(layer, {"line-color": "rgb(126, 165, 202)", }, true);
      }
      if (layer.id === 'boundary-land-disputed') { // color of disputed territory, cool feature, didn't know it existed
        return changePaint(layer, {"line-color": "rgb(70, 0, 0)", "line-width": 2, "line-dasharray": [1, 4]}, true);
      }
      if (layer.id === 'landcover-glacier') { // glaciers color
        return changePaint(layer, {"fill-color": "rgba(184, 184, 184, 0.3)"}, true);
      }
      if (layer.id === 'landcover-ice-shelf') { // ice shelf color 
        return changePaint(layer, {"fill-color": "rgb(175, 175, 175)"}, true);
      }

      // Text
      if (layer.id.includes('name') || layer.id.includes('place')) { // change all text color

        changePaint(layer, {"text-color": "rgb(214, 202, 140)", "text-halo-color": "rgb(146, 123, 65)"}, true);

        if (layer.id === 'place-country-1') { // adds sheikah towers to the country names
          changeLayout(
            layer,
            {
              'icon-image': 'sheikahTower',
              'text-variable-anchor': ['right'],
              'text-offset' : [-0.7, 0],
              'icon-size': 0.1,
              'text-font': ['Open Sans Bold Italic'],
            },
            true
          );

          changePaint(layer, {"text-color":"rgb(96, 197, 255)", "text-halo-color": "rgba(0, 0, 0, 0)"}, true);
        }
      }
      if (layer.id.includes('shield')) { // removes highway shields (they don't fit very well in my opinion)
        return changeLayout(layer, {"visibility": "none"});
      }

      return layer;
    });

    mapCurrent.setStyle(newMapStyle);    
  };

  const changePaint = (layer, newPaint, merge = false) => {

    if (merge) {
      layer.paint = Object.assign(layer.paint, newPaint);      
    }
    else {
      layer.paint = newPaint;
    }

    return layer;
  };

  const changeLayout = (layer, newLayout, merge = false) => {

    if (merge) {
      layer.layout = Object.assign(layer.layout, newLayout);      
    }
    else {
      layer.layout = newLayout;
    }

    return layer;
  };


  return (
    <div className='map-wrap'>
      <div ref={ mapContainer } className='map'></div>
    </div>
  );
}

