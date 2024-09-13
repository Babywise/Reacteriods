import React, { useEffect, useState } from "react";

export const imagesList = [
  "/derp.png",
  "/derpina.png",
  "/doge.png",
  "/grumpycat.png",
  "/pepe.png",
  "/trollface.png",
  "/mockpatrick.png",
  "/mockspongebob.png",
  "/monsterpikachu.png",
  "/tom.png",
  "/evilkermit.png",
  "/thisisfine.png",
  "/idiotsandwich.png",
  "/doodlebob.png",
  "/galaxybrain.png",
];

export default function ImagePicker({
  onSelectImage,
  defaultSelectedImage,
  onToggleMemeMode,
  defaultMemeMode,
}) {
  const [selectedImage, setSelectedImage] = useState(defaultSelectedImage);
  const [memeMode, setMemeMode] = useState(defaultMemeMode);

  useEffect(() => {
    if (defaultSelectedImage) {
      setSelectedImage(defaultSelectedImage);
    }
  }, [defaultSelectedImage]);

  const handleSelectImage = (image) => {
    setSelectedImage(image);
    onSelectImage(image);
  };

  const handleResetSelection = () => {
    setSelectedImage(null);
    onSelectImage(null);
  };

  const handleMemeModeChange = (e) => {
    setMemeMode(e.target.checked);
    onToggleMemeMode(e.target.checked);
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="mb-4">Select an Image</h2>
      <div className="flex justify-center items-center space-x-4">
        {/* Reset Button */}
        <button
          onClick={handleResetSelection}
          className="text-white hover:bg-white hover:text-black border-4 border-white py-2 px-4 mb-4 rounded w-24 h-23 flex items-center justify-center"
        >
          Reset
        </button>
        {/* Image Grid */}
        <div className="grid grid-cols-5 gap-4">
          {imagesList.map((image, index) => (
            <div
              key={index}
              className="cursor-pointer"
              onClick={() => handleSelectImage(image)}
            >
              <img
                src={image}
                alt={`Image ${index}`}
                width="100"
                className={
                  selectedImage === image ? "border-4 border-transparent" : ""
                }
              />
            </div>
          ))}
        </div>
        {/* Meme Mode Checkbox */}
        <label className="mt-4 text-white">Meme Mode</label>
        <input
          type="checkbox"
          checked={memeMode}
          onChange={handleMemeModeChange}
          className="ml-2"
        />
      </div>
    </div>
  );
}
