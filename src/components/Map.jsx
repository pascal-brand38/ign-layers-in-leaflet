// Copyright (c) Pascal Brand
// MIT License

// leaflet
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, LayersControl, LayerGroup, Circle, Polyline, Marker, Popup, Tooltip, useMapEvents, useMap } from 'react-leaflet'

import layerUtils from '../hooks/layerUtils'

// TODO: not always openstreetmap!
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | Pascal Brand'

function Map({ layers, selectedLayer }) {
  // from https://stackoverflow.com/questions/64665827/react-leaflet-center-attribute-does-not-change-when-the-center-state-changes
  // to update center

  // function ChangeView({ center, zoom }) {
  //   const map = useMap();
  //   map.setView(center, zoom);
  //   return null;
  // }


  const center = [46.3428331, 2.5667412]
  const urlSelected = layerUtils.getUrlFromLayer(selectedLayer)


  const url = {
    ignSat: layerUtils.getUrlFromLayer(layerUtils.findLayer(layers, 'ORTHOIMAGERY.ORTHOPHOTOS')),
    ignMap: layerUtils.getUrlFromLayer(layerUtils.findLayer(layers, 'GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2')),
    ignAdministration: layerUtils.getUrlFromLayer(layerUtils.findLayer(layers, 'ADMINEXPRESS-COG.LATEST')),
    openstreetmap: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  }

  const baseLayerChange = event => {
    console.log('baseLayerChange event', event);
  }
  const overlayChange = event => {
    console.log('overlayChange event', event);
  }

  const consoleUrl = (layers) => {
    console.log('---------------------------------')
    Object.keys(layers).forEach(key => console.log(layers[key]._url))
    console.log('---------------------------------')
  }



  const whenReadyHandler = event => {
    // cf events at https://leafletjs.com/reference.html#map-event
    const { target } = event;
    //target.on('baselayerchange', baseLayerChange);
    // target.on('layeradd', overlayChange);
    target.on('layeradd', (event) => consoleUrl(event.target._layers));
    target.on('baselayerchange', (event) => consoleUrl(event.target._layers));
    target.on('overlayadd', (event) => consoleUrl(event.target._layers));
    target.on('overlayremove', (event) => consoleUrl(event.target._layers));

    // event.target._layers ==> all keys which are int

    // console.log('PASCAL')
    // console.log(event)
    // console.log('END PASCAL')
  }


  return (
    <MapContainer whenReady={whenReadyHandler} style={{ height: "100%", width: "100%" }} center={center} zoom={6} scrollWheelZoom={true}  >

      <LayersControl position="bottomleft">
        <LayersControl.BaseLayer checked name="Image satellite de l'IGN">
          <TileLayer
            attribution={attribution}
            url={url.ignSat}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Carte IGN">
          <TileLayer
            attribution={attribution}
            url={url.ignMap}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="OpenStreetMap">
          <TileLayer
            attribution={attribution}
            url={url.openstreetmap}
          />
        </LayersControl.BaseLayer>


        <LayersControl.Overlay checked name="Limite Administrative">
          <TileLayer
            attribution={attribution}
            url={url.ignAdministration}
          />
        </LayersControl.Overlay>
        <LayersControl.Overlay checked name="Selection">
          {(urlSelected !== undefined) &&
            <TileLayer
              attribution={attribution}
              url={urlSelected}
            />
          }
        </LayersControl.Overlay>
      </LayersControl>


    </MapContainer>
  )

}

export default Map
