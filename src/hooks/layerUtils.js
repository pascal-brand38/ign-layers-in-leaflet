// Copyright (c) Pascal Brand
// MIT License

import { XMLParser, XMLBuilder, XMLValidator} from 'fast-xml-parser'

function getUrlFromLayer(selectedLayer) {
  if (selectedLayer === undefined) {
    return undefined
  }
console.log(selectedLayer)
  const style = selectedLayer.Style['ows:Identifier'] || selectedLayer.Style[0]['ows:Identifier']
  //console.log(style)
  return "https://data.geopf.fr/wmts?" +
    "&LAYER=" + selectedLayer['ows:Identifier'] +
    "&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0" +
    "&STYLE=" + style +
    "&TILEMATRIXSET=" + selectedLayer.TileMatrixSetLink.TileMatrixSet +
    "&FORMAT=" + selectedLayer.Format +
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

// TODO: check https://geoservices.ign.fr/services-web-issus-des-scans-ign
//   and https://geoservices.ign.fr/recherche?search=Scan25
//     for SCAN25 (include track path (?))
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
