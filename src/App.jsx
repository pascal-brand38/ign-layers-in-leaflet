import { useState, useRef, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { MapContainer, TileLayer, Polyline, Marker, Popup, Tooltip, useMapEvents, useMap } from 'react-leaflet'
// import 'leaflet/dist/leaflet.css';
//import fs from 'fs'
import "leaflet/dist/leaflet.css";
import { XMLParser, XMLBuilder, XMLValidator} from 'fast-xml-parser'

const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | Pascal Brand'

async function fetchCapabilities()  {
  const x = await fetch('https://wxs.ign.fr/cartes/geoportail/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetCapabilities')
  const XMLdata = await x.text()
  const parser = new XMLParser();
  let jObj = parser.parse(XMLdata);

  console.log(jObj)

  return jObj
}

function LayerList({layers, setSelectedLayer, /* setHoverTrack */}) {
  return (
    <div>
    {
      layers.map((layer, index) => {
        return (
          <div>
            <button key={index} onClick={()=>setSelectedLayer(layer)} /* onMouseOver={()=>setHoverTrack(index)}*/>
              { layer['ows:Identifier'] }
            </button>
          </div>
        )
      })
    }
    </div>
  )
}

function layerOf(layers, identifier) {
  const index = layers.findIndex(l => l['ows:Identifier']===identifier)
  return layers[index]
}

function App() {
  // from https://stackoverflow.com/questions/64665827/react-leaflet-center-attribute-does-not-change-when-the-center-state-changes
  // to update center

  // function ChangeView({ center, zoom }) {
  //   const map = useMap();
  //   map.setView(center, zoom);
  //   return null;
  // }

  const [ layers, setLayers ] = useState([])    // all the layers. Loaded in useEffect
  const [ selectedLayer, setSelectedLayer ] = useState(undefined)

  useEffect(() => {
    const asyncFunc = async () => {
      const capabilities = await fetchCapabilities()
      setLayers(capabilities.Capabilities.Contents.Layer)
      setSelectedLayer(layerOf(capabilities.Capabilities.Contents.Layer, 'ORTHOIMAGERY.ORTHOPHOTOS'))
    }

    asyncFunc();
  }, [])


  if (layers.length === 0) {
    return <></>
  }

  const center = [ 46.3428331, 2.5667412 ]
  const urlMap = "https://data.geopf.fr/wmts?" +
    "&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0" +
    "&STYLE=" + selectedLayer.Style['ows:Identifier'] +
    "&TILEMATRIXSET=" + selectedLayer.TileMatrixSetLink.TileMatrixSet +
    "&FORMAT=" + selectedLayer.Format +
    "&LAYER=" + selectedLayer['ows:Identifier'] +
    "&TILEMATRIX={z}" +
    "&TILEROW={y}" +
    "&TILECOL={x}"

  const url = {
    // https://geoservices.ign.fr/documentation/services/services-deprecies/affichage-wmts/leaflet-et-wmts
    // https://data.geopf.fr/private/wms-r?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetCapabilities&apikey=ign_scan_ws
    // https://wxs.ign.fr/cartes/geoportail/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetCapabilities
    ignPlan: "https://data.geopf.fr/wmts?" +
      "&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0" +
      "&STYLE=normal" +
      "&TILEMATRIXSET=PM" +
      "&FORMAT=image/png" +
      "&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2" +
      "&TILEMATRIX={z}" +
      "&TILEROW={y}" +
      "&TILECOL={x}",

    ignSat: "https://data.geopf.fr/wmts?" +
      "&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0" +
      "&STYLE=normal" +
      "&TILEMATRIXSET=PM" +
      "&FORMAT=image/jpeg" +
      "&LAYER=ORTHOIMAGERY.ORTHOPHOTOS" +
      "&TILEMATRIX={z}" +
      "&TILEROW={y}" +
      "&TILECOL={x}",

    openstreetmap: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  }
  return (
    <>
    <div className="main-grid">
      <MapContainer style={{height: "100vh", width: "100%"}} center={center}  zoom={6} scrollWheelZoom={true}  >
        {/* <ChangeView center={center} zoom={9} /> */}
        <TileLayer
          attribution={attribution}
          url={urlMap}

          // url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
          // subdomains={['mt1','mt2','mt3']}

        />

      </MapContainer>

      <div className="layer-list">
        <LayerList layers={layers} setSelectedLayer={setSelectedLayer}/>

      </div>
    </div>
    </>
  )

}

export default App
