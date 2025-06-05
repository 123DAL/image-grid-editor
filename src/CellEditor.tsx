// src/CellEditor.tsx

import React from 'react';

interface Props {
  row: number;
  col: number;
  imageData?: string;
  onImageChange: (dataUrl: string) => void;
}

const CellEditor: React.FC<Props> = ({ imageData }) => {
  return (
    <div style={{ position: 'absolute', top: 2, left: 2 }}>
      {imageData && (
        <img
          src={imageData}
          alt=""
          style={{ width: 36, height: 36, objectFit: 'contain' }}
        />
      )}
    </div>
  );
};

export default CellEditor;

