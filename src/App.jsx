import { useState, useRef, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { MapContainer, TileLayer, LayersControl, LayerGroup, Circle, Polyline, Marker, Popup, Tooltip, useMapEvents, useMap } from 'react-leaflet'
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

function LayerList({layers, setSelectedLayer, searchTerm}) {
  const term = searchTerm
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")     // remove accent that may be confused
    .toLowerCase()

  const inSearch = (layer, term) =>
    layer['ows:Title'].replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(term)
    || layer['ows:Abstract'].replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(term)
    || layer['ows:Identifier'].replace(/[\u0300-\u036f]/g, "").toLowerCase().includes(term)


  return (
    <div>
    {
      layers.map((layer, index) => {
        if (inSearch(layer, term)) {
          return (
            <div>
              <button key={index} onClick={()=>setSelectedLayer(layer)} /* onMouseOver={()=>setHoverTrack(index)}*/>
                { layer['ows:Identifier'] }
              </button>
            </div>
          )
        }
      })
    }
    </div>
  )
}

function LayerInfo({selectedLayer}) {
  if (selectedLayer) {
    return (
      <>
        <div>
          {getUrl(selectedLayer)}
        </div>
        <div>
          { JSON.stringify(selectedLayer) }
        </div>
      </>
    )
  }
}

function getUrl(selectedLayer) {
  if (selectedLayer === undefined) {
    return undefined
  }
  return "https://data.geopf.fr/wmts?" +
    "&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0" +
    "&STYLE=" + selectedLayer.Style['ows:Identifier'] +
    "&TILEMATRIXSET=" + selectedLayer.TileMatrixSetLink.TileMatrixSet +
    "&FORMAT=" + selectedLayer.Format +
    "&LAYER=" + selectedLayer['ows:Identifier'] +
    "&TILEMATRIX={z}" +
    "&TILEROW={y}" +
    "&TILECOL={x}"
}

function layerOf(layers, identifier) {
  const index = layers.findIndex(l => l['ows:Identifier']===identifier)
  return layers[index]
}

function SearchBar({searchTerm, setSearchTerm}) {
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  }


  return (
      <input type="text" value={searchTerm} onChange={handleChange} />
  );
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
  const [ searchTerm, setSearchTerm ] = useState('');

  useEffect(() => {
    const asyncFunc = async () => {
      const capabilities = await fetchCapabilities()
      setLayers(capabilities.Capabilities.Contents.Layer)
      // setSelectedLayer(layerOf(capabilities.Capabilities.Contents.Layer, 'ORTHOIMAGERY.ORTHOPHOTOS'))
    }

    asyncFunc();
  }, [])


  if (layers.length === 0) {
    return <></>
  }

  const center = [ 46.3428331, 2.5667412 ]
  const urlMap = getUrl(selectedLayer)


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

    ignAdministration: "https://data.geopf.fr/wmts?" +
      "&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0" +
      "&STYLE=normal" +
      "&TILEMATRIXSET=PM" +
      "&FORMAT=image/png" +
      "&LAYER=ADMINEXPRESS-COG.LATEST" +
      "&TILEMATRIX={z}" +
      "&TILEROW={y}" +
      "&TILECOL={x}",

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
    target.on('layeradd', (event) => consoleUrl( event.target._layers));
    target.on('baselayerchange', (event) => consoleUrl( event.target._layers));
    target.on('overlayadd', (event) => consoleUrl( event.target._layers));
    target.on('overlayremove', (event) => consoleUrl( event.target._layers));

    // event.target._layers ==> all keys which are int

    // console.log('PASCAL')
    // console.log(event)
    // console.log('END PASCAL')
  }


  return (
    <>
    <div className="main-grid">
      <div className="cell-map">
        <MapContainer whenReady={whenReadyHandler} style={{height: "100%", width: "100%"}} center={center}  zoom={6} scrollWheelZoom={true}  >

        <LayersControl position="bottomleft">
          <LayersControl.BaseLayer checked name="Image satellite">
            <TileLayer
                  attribution={attribution}
                  url={url.ignSat}
              />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Carte Ign">
            <TileLayer
                attribution={attribution}
                url={url.ignPlan}
            />
          </LayersControl.BaseLayer>


          <LayersControl.Overlay checked name="Limite Administrative">
            <TileLayer
                attribution={attribution}
                url={url.ignAdministration}
            />
          </LayersControl.Overlay>
          <LayersControl.Overlay checked name="Selection">
            { (urlMap !== undefined) &&
                <TileLayer
                    attribution={attribution}
                    url={urlMap}
                />
            }
          </LayersControl.Overlay>
        </LayersControl>


        </MapContainer>
      </div>

      <div className='cell-search'>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      <div className='cell-layers'>
        <LayerList layers={layers} setSelectedLayer={setSelectedLayer} searchTerm={searchTerm} />
      </div>

      <div className='cell-code'>
      className='cell-code'
      </div>

      <div className='cell-layer-description'>
        <LayerInfo selectedLayer={selectedLayer} />
      </div>

      {/* <div>
        <div className="layer-list">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <LayerList layers={layers} setSelectedLayer={setSelectedLayer} searchTerm={searchTerm} />
        </div>
        <div className="layer-list">
          <LayerInfo selectedLayer={selectedLayer} />
        </div>
      </div>
 */}
    </div>
    </>
  )

}

export default App


// TODOS
//
// - show legends, as for example
//   https://www.geoportail.gouv.fr/depot/layers/LANDUSE.AGRICULTURE2014/legendes/LANDUSE.AGRICULTURE2014-legend.png
// - search box with better shape
// - print information in better format
