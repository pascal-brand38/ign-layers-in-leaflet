// Copyright (c) Pascal Brand
// MIT License

function LayersList({layers, setSelectedLayer, searchTerm}) {
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
            <div key={index}>
              <button className='button-layers-list' onClick={()=>setSelectedLayer(layer)} /* onMouseOver={()=>setHoverTrack(index)}*/>
                { layer['ows:Identifier'] }
                <div>
                { layer['ows:Title'] }
                </div>
              </button>
            </div>
          )
        }
      })
    }
    </div>
  )
}

export default LayersList
