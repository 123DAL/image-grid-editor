import React, { useState } from 'react';
import GridCanvas from './GridCanvas';
import SidebarControls from './SidebarControls';

function App() {
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [cellImages, setCellImages] = useState<Record<string, string>>({});

  // assign the uploaded image to every selected cell
  const handleUpload = (dataUrl: string) => {
    setCellImages(imgs => {
      const copy = { ...imgs };
      selectedCells.forEach(id => { copy[id] = dataUrl });
      return copy;
    });
  };

  return (
    <div style={{ display: 'flex', padding: 20 }}>
      <GridCanvas
        selectedCells={selectedCells}
        setSelectedCells={setSelectedCells}
        cellImages={cellImages}
      />
      <SidebarControls onUpload={handleUpload} />
    </div>
  );
}

export default App;

