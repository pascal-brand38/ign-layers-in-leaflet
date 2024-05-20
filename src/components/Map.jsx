// Copyright (c) Pascal Brand
// MIT License

// leaflet
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, LayersControl, LayerGroup, Circle, Polyline, Marker, Popup, Tooltip, useMapEvents, useMap } from 'react-leaflet'

import layerUtils from '../hooks/layerUtils'

// https://leaflet-extras.github.io/leaflet-providers/preview/

function AddBaseLayers({setDisplayedLayers}) {
  const updateDisplayedLayers = (name, url) => setDisplayedLayers(prev => {
    let result = { ...prev }
    result[name] = url
    return result
  })
  const baseLayers = [
    {
      url: "https://data.geopf.fr/wmts?&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE=normal&TILEMATRIXSET=PM&FORMAT=image/jpeg&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}",
      name: "IGN satellite",
      attribution: '&copy; <a href="https://www.ign.fr/">IGN</a>',
      checked: true,
    },
    {
      url: "https://data.geopf.fr/wmts?&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE=normal&TILEMATRIXSET=PM&FORMAT=image/png&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}",
      name: "IGN Carte",
      attribution: '&copy; <a href="https://www.ign.fr/">IGN</a>',
    },
    {
      // Capabilities: https://data.geopf.fr/private/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetCapabilities&apikey=ign_scan_ws
      url: "https://data.geopf.fr/private/wmts?&LAYER=GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN25TOUR&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE=normal&TILEMATRIXSET=PM&FORMAT=image/jpeg&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&apikey=ign_scan_ws",
      name: 'IGN SCAN 25',
      attribution: 'Map data &copy; Google',
    },
    {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      name: 'OpenStreetMap',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    },
    {
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      name: 'openTopoMap',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    },
    {
      url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
      name: 'Google satellite',
      attribution: 'Map data &copy; Google',
    },
    {
      url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
      name: 'Google Maps',
      attribution: 'Map data &copy; Google',
    },
  ]

  return baseLayers.map((layer, index) =>
    <LayersControl.BaseLayer checked={layer.checked===true} key={index} name={layer.name}>
      <TileLayer
        attribution={layer.attribution}
        url={layer.url}
        eventHandlers={{add: (e) => updateDisplayedLayers('baseLayer', e.target._url),}}
      />
    </LayersControl.BaseLayer>
  )
}

function AddOverlayLayers({selectedLayer, setDisplayedLayers}) {
  const updateDisplayedLayers = (name, url) => setDisplayedLayers(prev => {
    let result = { ...prev }
    result[name] = url
    return result
  })
  const overlayLayers = [
    {
      url: "https://data.geopf.fr/wmts?&LAYER=ADMINEXPRESS-COG.LATEST&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE=normal&TILEMATRIXSET=PM&FORMAT=image/png&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}",
      name: "Administration",
      attribution: '&copy; <a href="https://www.ign.fr/">IGN</a>',
      layerName: 'adminLayer',    // used in Code.jsx
      checked: true,
    },
    {
      url: layerUtils.getUrlFromLayer(selectedLayer),
      name: "Selection",    // Selection is hard-coded in Code.jsx
      layerName: 'selectedLayer',    // used in Code.jsx
      checked: true,
    },
  ]

  return overlayLayers.map((layer, index) => {
    if (layer.url !== undefined) {
      return (
        <LayersControl.Overlay key={index}  checked name={layer.name}>
          <TileLayer
            attribution={layer.attribution}
            url={layer.url}
            eventHandlers={
              {
                add: (e) => updateDisplayedLayers(layer.layerName, e.target._url),
                remove: (e) => updateDisplayedLayers(layer.layerName, undefined),
              }
            }
          />
        </LayersControl.Overlay>
      )
    }
  })
}


function Map({ layers, selectedLayer, setDisplayedLayers }) {
  // from https://stackoverflow.com/questions/64665827/react-leaflet-center-attribute-does-not-change-when-the-center-state-changes
  // to update center

  // function ChangeView({ center, zoom }) {
  //   const map = useMap();
  //   map.setView(center, zoom);
  //   return null;
  // }


  const center = [46.3428331, 2.5667412]

  // many maps at
  // https://github.com/NelsonMinar/multimap/blob/master/basemaps.js

  return (
    <MapContainer style={{ height: "100%", width: "100%" }} center={center} zoom={6} scrollWheelZoom={true} >

      <LayersControl position="bottomleft">
        <AddBaseLayers setDisplayedLayers={setDisplayedLayers}/>
        <AddOverlayLayers selectedLayer={selectedLayer} setDisplayedLayers={setDisplayedLayers}/>
      </LayersControl>

    </MapContainer>
  )

}

export default Map
