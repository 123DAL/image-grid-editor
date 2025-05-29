import React from 'react';

type Props = {
  onUpload: (dataUrl: string) => void;
};

const SidebarControls: React.FC<Props> = ({ onUpload }) => {
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
    <div style={{ width: 200 }}>
      <h3>Controls</h3>
      <label>
        Upload Image:
        <input type="file" accept="image/*" onChange={handleFile} />
      </label>
    </div>
  );
};

export default SidebarControls;

