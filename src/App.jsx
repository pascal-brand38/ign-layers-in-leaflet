// Copyright (c) Pascal Brand
// MIT License

import { useState, useEffect } from 'react'
import './App.css'
import Map from './components/Map'
import LayerInfo from './components/LayerInfo'
import LayersList from './components/LayersList'
import Search from './components/Search'
import Code from './components/Code'
import layerUtils from './hooks/layerUtils'
import Opacity from './components/Opacity'

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
  const [ opacity, setOpacity ] = useState(100);
  const [ searchTerm, setSearchTerm ] = useState('');
  const [ displayedLayers, setDisplayedLayers ] = useState({});

  useEffect(() => {
    layerUtils.fetchLayers(setLayers)
  }, [])


  if (layers.length === 0) {
    return <></>
  }

  return (
    <>
    <div className="main-grid">
      <div className="cell-map">
        <Map selectedLayer={selectedLayer} setDisplayedLayers={setDisplayedLayers} opacity={opacity} />
      </div>

      <div className='cell-opacity'>
        <Opacity opacity={opacity} setOpacity={setOpacity} />
      </div>

      <div className='cell-search'>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      <div className='cell-layers'>
        <LayersList layers={layers} setSelectedLayer={setSelectedLayer} searchTerm={searchTerm} />
      </div>

      <div className='cell-code'>
        <Code selectedLayer={selectedLayer} displayedLayers={displayedLayers} />
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
