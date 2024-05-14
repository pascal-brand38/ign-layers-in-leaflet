// Copyright (c) Pascal Brand
// MIT License

import { useState, useRef, useEffect } from 'react'
import './App.css'
import { XMLParser, XMLBuilder, XMLValidator} from 'fast-xml-parser'
import Map from './components/Map'
import LayerInfo from './components/LayerInfo'
import LayersList from './components/LayersList'
import Search from './components/Search'
import Code from './components/Code'

// TODO: check the following
//     https://geoservices.ign.fr/bascule-vers-la-geoplateforme
//   to check for all services
async function fetchCapabilities()  {
  const x = await fetch('https://data.geopf.fr/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetCapabilities')
  const XMLdata = await x.text()
  const parser = new XMLParser();
  let jObj = parser.parse(XMLdata);

  console.log(jObj)

  return jObj
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

  return (
    <>
    <div className="main-grid">
      <div className="cell-map">
        <Map layers={layers} selectedLayer={selectedLayer} />
      </div>

      <div className='cell-search'>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      <div className='cell-layers'>
        <LayersList layers={layers} setSelectedLayer={setSelectedLayer} searchTerm={searchTerm} />
      </div>

      <div className='cell-code'>
        <Code />
      </div>

      <div className='cell-layer-description'>
        <LayerInfo selectedLayer={selectedLayer} />
      </div>

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
