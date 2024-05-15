// Copyright (c) Pascal Brand
// MIT License

function Code({urls}) {
  return (
    <>
    <h1> URLs in Leaflet</h1>
    {
      urls.map((url, index) => {
        return (
          <pre className='code'>
              {url}
          </pre>
        )
      })
    }
    </>
  );
}

export default Code
