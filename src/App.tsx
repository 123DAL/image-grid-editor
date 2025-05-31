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
  // Hue rotation (0–360) per cell
  const [cellHue, setCellHue] = useState<Record<string, number>>({});
  // Opacity (0–100) per cell
  const [cellOpacity, setCellOpacity] = useState<Record<string, number>>({});
  // Brightness percentage (0–200) per cell
  const [cellBrightness, setCellBrightness] = useState<Record<string, number>>({});
  // Whether each cell is inverted (negative)
  const [cellInverted, setCellInverted] = useState<Record<string, boolean>>({});
  // Whether each cell is flipped horizontally
  const [cellFlipH, setCellFlipH] = useState<Record<string, boolean>>({});
  // Whether each cell is flipped vertically
  const [cellFlipV, setCellFlipV] = useState<Record<string, boolean>>({});

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

  // Update hue rotation (0–360) for selected cells
  const handleHueChange = (hue: number) => {
    setCellHue(hues => {
      const copy = { ...hues };
      selectedCells.forEach(id => {
        copy[id] = hue;
      });
      return copy;
    });
  };

  // Update opacity (0–100) for selected cells
  const handleOpacityChange = (opacity: number) => {
    setCellOpacity(op => {
      const copy = { ...op };
      selectedCells.forEach(id => {
        copy[id] = opacity;
      });
      return copy;
    });
  };

  // Update brightness (0–200) for selected cells
  const handleBrightnessChange = (brightness: number) => {
    setCellBrightness(brights => {
      const copy = { ...brights };
      selectedCells.forEach(id => {
        copy[id] = brightness;
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

  // Toggle flip horizontal for selected cells
  const handleFlipH = () => {
    setCellFlipH(flips => {
      const copy = { ...flips };
      selectedCells.forEach(id => {
        const prev = copy[id] || false;
        copy[id] = !prev;
      });
      return copy;
    });
  };

  // Toggle flip vertical for selected cells
  const handleFlipV = () => {
    setCellFlipV(flips => {
      const copy = { ...flips };
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
        cellHue={cellHue}
        cellOpacity={cellOpacity}
        cellBrightness={cellBrightness}
        cellInverted={cellInverted}
        cellFlipH={cellFlipH}
        cellFlipV={cellFlipV}
      />
      <SidebarControls
        onUpload={handleUpload}
        onScaleChange={handleScaleChange}
        onToggleOverflow={handleToggleOverflow}
        onNudge={handleNudge}
        onRotateTo={handleRotateTo}
        onSaturationChange={handleSaturationChange}
        onHueChange={handleHueChange}
        onOpacityChange={handleOpacityChange}
        onBrightnessChange={handleBrightnessChange}
        onInvert={handleInvert}
        onFlipH={handleFlipH}
        onFlipV={handleFlipV}
      />
    </div>
  );
};

export default App;
