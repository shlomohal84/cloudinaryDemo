import { useState, useRef, useEffect } from "react";
import Spinner from "./Spinner";

function Upload({ modified, setModified }) {
  const [loading, setLoading] = useState(true);
  // const [fileInputState, setFileInputState] = useState("");
  const [previewSource, setPreviewSource] = useState("");
  // const [selectedFile, setSelectedFile] = useState("");

  const hiddenInput = useRef(null);
  const handleClick = evt => {
    hiddenInput.current.click();
  };
  const handleFileInputChange = evt => {
    const file = evt.target.files[0];
    previewFile(file);
  };

  const previewFile = file => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleSubmit = async evt => {
    evt.preventDefault();
    setLoading(true);
    if (!previewSource) return;
    await uploadImage(previewSource);
    setModified(true);
  };

  const uploadImage = async base64EncodedImage => {
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: JSON.stringify({
          data: base64EncodedImage,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      setLoading(true);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    function load() {
      try {
        setLoading(true);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <Spinner />;
  return (
    <div className="Upload">
      <div className="Upload-container">
        <form onSubmit={handleSubmit}>
          <button type="button" onClick={handleClick}>
            Browse...
          </button>
          <input
            ref={hiddenInput}
            type="file"
            onChange={handleFileInputChange}
            style={{ display: "none" }}
          />
          <button>Submit</button>
        </form>
      </div>
      {previewSource && (
        <img
          src={previewSource}
          alt={previewSource}
          style={{ height: "300px", borderRadius: "50%" }}
        />
      )}
    </div>
  );
}

export default Upload;
