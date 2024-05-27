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
  // displayedLayers.Selection is hard-coded in Code.jsx
  return (
    <>
      <h1> URLs in Leaflet</h1>
      { oneLayer(displayedLayers.baseLayer) }
      { oneLayer(displayedLayers.adminLayer) }
      { displayedLayers.selectedLayer && oneLayer(layerUtils.getUrlFromLayer(selectedLayer)) }

      {/* <a href="https://www.compteurdevisite.com" title="compteur visiteur">
        <img src="https://counter4.optistats.ovh/private/compteurdevisite.php?c=fym19ezrhntbb2efbfdq8sekmhrfn84c" border="0" title="compteur visiteur" alt="compteur visiteur"/>
        </a> */}

      <div id="sfcfym19ezrhntbb2efbfdq8sekmhrfn84c"></div>

      <script
        src="https://counter4.optistats.ovh/private/counter.js?c=fym19ezrhntbb2efbfdq8sekmhrfn84c&down=async" async></script>
      <br/>
      <a href="https://www.compteurdevisite.com">compteur visiteur</a>
      <noscript><a href="https://www.compteurdevisite.com"
          title="compteur visiteur">
            <img
            src="https://counter4.optistats.ovh/private/compteurdevisite.php?c=fym19ezrhntbb2efbfdq8sekmhrfn84c" border="0"
            title="compteur visiteur" alt="compteur visiteur"/></a></noscript>
    </>
  );
}

export default Code
