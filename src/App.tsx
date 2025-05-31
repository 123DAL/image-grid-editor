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
  // State for each cell’s x/y offset (nudge)
  const [cellOffsets, setCellOffsets]   = useState<Record<string, { dx: number; dy: number }>>({});
  // Whether images may overflow their cell borders
  const [allowOverflow, setAllowOverflow] = useState<boolean>(false);
  // Rotation angle (0–359) per cell
  const [cellRotations, setCellRotations] = useState<Record<string, number>>({});
  // Saturation percentage (0–200) per cell
  const [cellSaturation, setCellSaturation] = useState<Record<string, number>>({});
  // State for whether each cell is inverted (negative)
  const [cellInverted, setCellInverted] = useState<Record<string, boolean>>({});

  // Assign the uploaded image to each selected cell
  const handleUpload = (dataUrl: string) => {
    setCellImages(imgs => {
      const copy = { ...imgs };
      selectedCells.forEach(id => {
        copy[id] = dataUrl;
      });
      return copy;
    });
  };

  // Update the scale for each selected cell
  const handleScaleChange = (scale: number) => {
    setCellScales(scales => {
      const copy = { ...scales };
      selectedCells.forEach(id => {
        copy[id] = scale;
      });
      return copy;
    });
  };

  // Toggle whether images can overflow
  const handleToggleOverflow = (allow: boolean) => {
    setAllowOverflow(allow);
  };

  // Nudge selected cells by dx, dy
  const handleNudge = (dx: number, dy: number) => {
    setCellOffsets(offsets => {
      const copy = { ...offsets };
      selectedCells.forEach(id => {
        const prev = copy[id] || { dx: 0, dy: 0 };
        copy[id] = { dx: prev.dx + dx, dy: prev.dy + dy };
      });
      return copy;
    });
  };

  // Rotate selected cells to an exact angle (0–360)
  const handleRotateTo = (angle: number) => {
    setCellRotations(rotations => {
      const copy = { ...rotations };
      selectedCells.forEach(id => {
        copy[id] = ((angle % 360) + 360) % 360;
      });
      return copy;
    });
  };

  // Update saturation (0–200) for selected cells
  const handleSaturationChange = (saturation: number) => {
    setCellSaturation(sats => {
      const copy = { ...sats };
      selectedCells.forEach(id => {
        copy[id] = saturation;
      });
      return copy;
    });
  };

  // Toggle inversion (negative) for selected cells
  const handleInvert = () => {
    setCellInverted(inv => {
      const copy = { ...inv };
      selectedCells.forEach(id => {
        const prev = copy[id] || false;
        copy[id] = !prev;
      });
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
        allowOverflow={allowOverflow}
        cellOffsets={cellOffsets}
        cellRotations={cellRotations}
        cellSaturation={cellSaturation}
        cellInverted={cellInverted}
      />
      <SidebarControls
        onUpload={handleUpload}
        onScaleChange={handleScaleChange}
        onToggleOverflow={handleToggleOverflow}
        onNudge={handleNudge}
        onRotateTo={handleRotateTo}
        onSaturationChange={handleSaturationChange}
        onInvert={handleInvert}
      />
    </div>
  );
};

export default App;
