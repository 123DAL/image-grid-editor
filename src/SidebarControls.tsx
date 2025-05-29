import React from 'react';

type Props = {
  onUpload: (dataUrl: string) => void;
  onScaleChange: (scale: number) => void;
};

const SidebarControls: React.FC<Props> = ({ onUpload, onScaleChange }) => {
  // Handle file selection and convert to Data URL
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUpload(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ width: 200, padding: '10px', border: '1px solid #ddd' }}>
      <h3>Controls</h3>

      {/* Image Upload */}
      <div style={{ marginBottom: 15 }}>
        <label style={{ display: 'block', marginBottom: 5 }}>
          <strong>Upload Image</strong>
        </label>
        <input type="file" accept="image/*" onChange={handleFile} />
      </div>

      {/* Scale Slider */}
      <div style={{ marginBottom: 15 }}>
        <label style={{ display: 'block', marginBottom: 5 }}>
          <strong>Scale</strong> (50%–400%)
        </label>
        <input
          type="range"
          min="50"
          max="400"
          step="1"
          defaultValue="100"
          onChange={e => onScaleChange(parseInt(e.target.value, 10))}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
};

export default SidebarControls;
