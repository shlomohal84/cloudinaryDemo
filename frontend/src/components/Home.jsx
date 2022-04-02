import { useState, useEffect } from "react";

import Spinner from "./Spinner";
// import { Image } from "cloudinary-react";

function Home({ modified, setModified }) {
  // const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  // const [imageIds, setImageIds] = useState(null);
  const [images, setImages] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadImages = async () => {
    const res = await (await fetch("/api/images")).json();
    const images = res.map(image => image);
    setImages(images);
  };

  const handleDelete = async image => {
    try {
      setLoading(true);
      await fetch("/api/images", {
        method: "DELETE",
        body: JSON.stringify({
          data: image._id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setLoading(true);
      setImages(null);
      await loadImages();
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        loadImages();
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
        setModified(false);
      }
    };
    load();
  }, [setModified]);

  if (loading) {
    return <Spinner />;
  }
  return (
    <div>
      <h1>Home</h1>
      <section
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {images &&
          images.map((image, idx) => {
            return (
              <div key={idx}>
                <form
                  onSubmit={evt => {
                    evt.preventDefault();
                    handleDelete(image);
                  }}
                >
                  <button>X</button>
                </form>
                <img
                  key={idx}
                  src={image.images[0].url}
                  style={{ width: "300px" }}
                  alt={image.images[0].url}
                />
              </div>
            );
          })}
      </section>
    </div>
  );
}

export default Home;
