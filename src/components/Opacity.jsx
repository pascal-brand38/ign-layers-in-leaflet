// Copyright (c) Pascal Brand
// MIT License

function Opacity({opacity, setOpacity}) {
  const handleChange = (event) => {
    setOpacity(event.target.value);
  }

  return (
    <div className="opacity-bar">
      <input type="range" min={0} max={100} value={opacity} onChange={handleChange} />
    </div>
  );
}

export default Opacity
