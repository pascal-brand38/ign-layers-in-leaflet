// Copyright (c) Pascal Brand
// MIT License

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


export default {
  getUrlFromLayer,
  findLayer,
}
