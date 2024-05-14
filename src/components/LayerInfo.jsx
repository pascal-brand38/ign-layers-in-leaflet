// Copyright (c) Pascal Brand
// MIT License

import layerUtils from '../hooks/layerUtils'

function LayerInfo({ selectedLayer }) {
  if (selectedLayer) {
    return (
      <>
        <div>
          {layerUtils.getUrlFromLayer(selectedLayer)}
        </div>
        <div>
          {JSON.stringify(selectedLayer)}
        </div>
      </>
    )
  }
}

export default LayerInfo
