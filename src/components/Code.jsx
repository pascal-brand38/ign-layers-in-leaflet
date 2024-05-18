// Copyright (c) Pascal Brand
// MIT License

import layerUtils from '../hooks/layerUtils'

function oneLayer(url) {
  if (url) {
    return (
      <pre className='code'>
        {url}
      </pre>
    )
  }
}

function Code({ selectedLayer, displayedLayers }) {
  return (
    <>
      <h1> URLs in Leaflet</h1>
      { oneLayer(displayedLayers.baseLayer) }
      { oneLayer(displayedLayers.adminLayer) }
      { displayedLayers.selectedLayer && oneLayer(layerUtils.getUrlFromLayer(selectedLayer)) }
    </>
  );
}

export default Code
