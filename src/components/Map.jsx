// Copyright (c) Pascal Brand
// MIT License

// leaflet
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, LayersControl, LayerGroup, Circle, Polyline, Marker, Popup, Tooltip, useMapEvents, useMap } from 'react-leaflet'

import layerUtils from '../hooks/layerUtils'

// TODO: not always openstreetmap!
const attributionIGN = '&copy; <a href="https://www.ign.fr/">Institut géographique national</a>'
const attributionOpenstreetmap = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
const attributionPB = '<a href="https://www.github.com/pascal-brand38">Pascal Brand</a>'
const attribution = attributionIGN + ' | ' + attributionOpenstreetmap + ' | ' + attributionPB

function Map({ layers, selectedLayer, setDisplayedLayers }) {
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

  const updateDisplayedLayers = (name, url) => setDisplayedLayers(prev => {
    let result = { ...prev }
    result[name] = url
    return result
  })

  return (
    <MapContainer style={{ height: "100%", width: "100%" }} center={center} zoom={6} scrollWheelZoom={true} attributionControl:true >

      <LayersControl position="bottomleft">
        <LayersControl.BaseLayer checked name="Image satellite de l'IGN">
          <TileLayer
            attribution={attribution}
            url={url.ignSat}
            eventHandlers={{add: (e)=>updateDisplayedLayers('baseLayer', e.target._url),}}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Carte IGN">
          <TileLayer
            attribution={attribution}
            url={url.ignMap}
            eventHandlers={{add: (e)=>updateDisplayedLayers('baseLayer', e.target._url),}}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="OpenStreetMap">
          <TileLayer
            attribution={attribution}
            url={url.openstreetmap}
            eventHandlers={{add: (e)=>updateDisplayedLayers('baseLayer', e.target._url),}}
            />
        </LayersControl.BaseLayer>


        <LayersControl.Overlay checked name="Limite Administrative">
          <TileLayer
            attribution={attribution}
            url={url.ignAdministration}
            eventHandlers={
              {
                add: (e)=>updateDisplayedLayers('adminLayer', e.target._url),
                remove: (e)=>updateDisplayedLayers('adminLayer', undefined),
              }
            }
        />
        </LayersControl.Overlay>
        <LayersControl.Overlay checked name="Selection">
          {(urlSelected !== undefined) &&
            <TileLayer
              attribution={attribution}
              url={urlSelected}
              eventHandlers={
                {
                  add: (e)=>updateDisplayedLayers('selectedLayer', e.target._url),
                  remove: (e)=>updateDisplayedLayers('selectedLayer', undefined),
                }
              }
            />
          }
        </LayersControl.Overlay>
      </LayersControl>

    </MapContainer>
  )

}

export default Map
