import "./loaders.css";

const OverlayLoader = () => {
  return (
    <>
      <div className="backdrop" />
      <div className="loaderWrapper">
        <div className="overlayLoader">
          <p>Loading</p>
        </div>
      </div>
    </>
  );
};

export default OverlayLoader;
