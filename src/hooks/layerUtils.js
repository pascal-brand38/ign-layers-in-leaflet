// Copyright (c) Pascal Brand
// MIT License

import { XMLParser, XMLBuilder, XMLValidator} from 'fast-xml-parser'

function getUrlFromLayer(selectedLayer) {
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

function findLayer(layers, identifier) {
  const index = layers.findIndex(l => l['ows:Identifier'] === identifier)
  return layers[index]
}

// TODO: check the following
//     https://geoservices.ign.fr/bascule-vers-la-geoplateforme
//   to check for all services
async function fetchLayers(setLayers)  {
  const f = async (url) => {
    const x = await fetch(url)
    const XMLdata = await x.text()
    const parser = new XMLParser();
    const capabilities = parser.parse(XMLdata);
    return capabilities
  }

  try {
    const savedCapabilities = await f('ignCapabilities.xml')
    setLayers(savedCapabilities.Capabilities.Contents.Layer)
    const capabilities = await f('https://data.geopf.fr/wmts?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetCapabilities')
    setLayers(capabilities.Capabilities.Contents.Layer)
    // TODO: add a message when both list are not the same
    //       in order to update the code
  } catch (e) {
    console.log(`fetchLayers: error ${e}`)
  }

}


export default {
  getUrlFromLayer,
  findLayer,
  fetchLayers,
}
