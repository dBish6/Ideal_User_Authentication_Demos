import "./loaders.css";

const OverlayLoader = () => {
  return (
    <>
      <div className="backdrop" />
      <div className="overlayLoader">
        <p>Loading</p>
      </div>
    </>
  );
};

export default OverlayLoader;
