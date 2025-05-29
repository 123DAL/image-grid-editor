import React, { useState } from 'react';
import GridCanvas from './GridCanvas';
import SidebarControls from './SidebarControls';

const App: React.FC = () => {
  // State for selected cell IDs
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  // State for each cell’s image Data URL
  const [cellImages, setCellImages]     = useState<Record<string, string>>({});
  // State for each cell’s scale percentage
  const [cellScales, setCellScales]     = useState<Record<string, number>>({});

  // Assign the uploaded image to each selected cell
  const handleUpload = (dataUrl: string) => {
    setCellImages(imgs => {
      const copy = { ...imgs };
      selectedCells.forEach(id => { copy[id] = dataUrl; });
      return copy;
    });
  };

  // Update the scale for each selected cell
  const handleScaleChange = (scale: number) => {
    setCellScales(scales => {
      const copy = { ...scales };
      selectedCells.forEach(id => { copy[id] = scale; });
      return copy;
    });
  };

  return (
    <div style={{ display: 'flex', padding: 20 }}>
      <GridCanvas
        selectedCells={selectedCells}
        setSelectedCells={setSelectedCells}
        cellImages={cellImages}
        cellScales={cellScales}
      />
      <SidebarControls
        onUpload={handleUpload}
        onScaleChange={handleScaleChange}
      />
    </div>
  );
};

export default App;

