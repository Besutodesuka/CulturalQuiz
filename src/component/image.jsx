// In your CenteredCircularImage.jsx
import React from 'react';

function CenteredCircularImage({ imagePath, altText = "User avatar", size = 48 }) {
  console.log("[CenteredCircularImage] Props received - imagePath:", imagePath, "altText:", altText, "size:", size);

  if (!imagePath) {
    console.log("[CenteredCircularImage] No imagePath prop provided.");
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px', border: '1px solid orange', padding: '10px' }}>
        <p>Placeholder: No imagePath provided.</p>
      </div>
    );
  }

  // Calculate a simple pixel size for inline style (approximate for debugging)
  // Tailwind's scale is roughly 1 unit = 0.25rem = 4px (if root font size is 16px)
  const pixelSize = size * 4; // e.g., size 48 -> 192px

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '300px', // Give it some space
      // border: '2px dashed green',
      padding: '20px',
      // backgroundColor: '#f0f0f0'
    }}>
      <img
        src={imagePath}
        alt={altText}
        style={{
          width: `${pixelSize}px`,
          height: `${pixelSize}px`,
          borderRadius: '50%',
          objectFit: 'cover', // This is fine
          border: `3px solid purple`,
          display: 'block' // Important for img to behave well with dimensions
        }}
        onError={(e) => {
          console.error("[CenteredCircularImage] Image failed to load:", imagePath, e);
          e.target.style.border = '3px solid red'; // Make error visible on the image placeholder
          e.target.alt = `Failed to load: ${altText}`;
        }}
      />
    </div>
  );
}

export default CenteredCircularImage;