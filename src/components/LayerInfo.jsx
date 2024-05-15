// Copyright (c) Pascal Brand
// MIT License

import layerUtils from '../hooks/layerUtils'

function LayerInfo({ selectedLayer }) {
  if (selectedLayer) {
    return (
      <>
      <h1> { selectedLayer['ows:Identifier']} </h1>
      <div className='layer-info-title'>
        { selectedLayer['ows:Title'] }
      </div>
      <div className='layer-info-abstract'>
        { selectedLayer['ows:Abstract'] }
      </div>
      </>
    )
  }
}

export default LayerInfo
