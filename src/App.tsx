import React, { useState, useEffect, useRef } from 'react';
import GridCanvas from './GridCanvas';
import SidebarControls from './SidebarControls';
import html2canvas from 'html2canvas';
import QRCodeGenerator from './QRCodeGenerator';

type ProjectState = {
  cellImages: Record<string, string>;
  cellScales: Record<string, number>;
  cellOffsets: Record<string, { dx: number; dy: number }>;
  allowOverflow: boolean;
  cellRotations: Record<string, number>;
  cellSaturation: Record<string, number>;
  cellHue: Record<string, number>;
  cellOpacity: Record<string, number>;
  cellBrightness: Record<string, number>;
  cellInverted: Record<string, boolean>;
  cellFlipH: Record<string, boolean>;
  cellFlipV: Record<string, boolean>;
};

const LOCAL_STORAGE_KEY = 'imageGridProjects';

// These constants match the sizes used in GridCanvas:
const SIZE = 80;
const ROWS = 7;
const GAP = 4;
// Grid height = 7 rows × 80px + 6 gaps × 4px = 560 + 24 = 584px
const GRID_HEIGHT = ROWS * SIZE + (ROWS - 1) * GAP; // 584

const App: React.FC = () => {
  // ── Grid state ──
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [cellImages, setCellImages] = useState<Record<string, string>>({});
  const [cellScales, setCellScales] = useState<Record<string, number>>({});
  const [cellOffsets, setCellOffsets] = useState<Record<string, { dx: number; dy: number }>>({});
  const [allowOverflow, setAllowOverflow] = useState<boolean>(false);
  const [cellRotations, setCellRotations] = useState<Record<string, number>>({});
  const [cellSaturation, setCellSaturation] = useState<Record<string, number>>({});
  const [cellHue, setCellHue] = useState<Record<string, number>>({});
  const [cellOpacity, setCellOpacity] = useState<Record<string, number>>({});
  const [cellBrightness, setCellBrightness] = useState<Record<string, number>>({});
  const [cellInverted, setCellInverted] = useState<Record<string, boolean>>({});
  const [cellFlipH, setCellFlipH] = useState<Record<string, boolean>>({});
  const [cellFlipV, setCellFlipV] = useState<Record<string, boolean>>({});

  // ── Project management state ──
  const [projectNames, setProjectNames] = useState<string[]>([]);
  const [currentProject, setCurrentProject] = useState<string>('');

  // ── QR toggle ──
  const [showQRPage, setShowQRPage] = useState<boolean>(false);

  // Snapshot mode: hides borders/labels during PNG capture
  const [snapshotMode, setSnapshotMode] = useState<boolean>(false);
  const gridRef = useRef<HTMLDivElement>(null);

  // On mount: load saved project names from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        const parsed: Record<string, ProjectState> = JSON.parse(stored);
        setProjectNames(Object.keys(parsed));
      } catch {
        // ignore any JSON parse errors
      }
    }
  }, []);

  // Helper to read all projects from localStorage
  const readAllProjects = (): Record<string, ProjectState> => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!stored) return {};
    try {
      return JSON.parse(stored);
    } catch {
      return {};
    }
  };

  // “New Project” → clear grid state entirely
  const handleNewProject = () => {
    setCellImages({});
    setCellScales({});
    setCellOffsets({});
    setAllowOverflow(false);
    setCellRotations({});
    setCellSaturation({});
    setCellHue({});
    setCellOpacity({});
    setCellBrightness({});
    setCellInverted({});
    setCellFlipH({});
    setCellFlipV({});
    setSelectedCells(new Set());
    setCurrentProject('');
  };

  // “Save As…” → create a new named project key
  const handleSaveAs = (name: string) => {
    if (!name.trim()) return;
    const all = readAllProjects();
    all[name] = {
      cellImages,
      cellScales,
      cellOffsets,
      allowOverflow,
      cellRotations,
      cellSaturation,
      cellHue,
      cellOpacity,
      cellBrightness,
      cellInverted,
      cellFlipH,
      cellFlipV,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(all));
    setProjectNames(Object.keys(all));
    setCurrentProject(name);
  };

  // “Save” (overwrite existing project)
  const handleSaveExisting = () => {
    if (!currentProject) return;
    const all = readAllProjects();
    all[currentProject] = {
      cellImages,
      cellScales,
      cellOffsets,
      allowOverflow,
      cellRotations,
      cellSaturation,
      cellHue,
      cellOpacity,
      cellBrightness,
      cellInverted,
      cellFlipH,
      cellFlipV,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(all));
    setProjectNames(Object.keys(all));
  };

  // “Rename” → change the key of the current project to a new name
  const handleRenameProject = (newName: string) => {
    const oldName = currentProject;
    if (!oldName || !newName.trim() || oldName === newName) return;
    const all = readAllProjects();
    if (!all[oldName] || all[newName]) return; // cannot overwrite an existing key
    all[newName] = all[oldName];
    delete all[oldName];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(all));
    setProjectNames(Object.keys(all));
    setCurrentProject(newName);
  };

  // “Load” → restore grid state from a saved project
  const handleLoadProject = (name: string) => {
    const all = readAllProjects();
    const proj = all[name];
    if (!proj) return;
    setCellImages({ ...proj.cellImages });
    setCellScales({ ...proj.cellScales });
    setCellOffsets({ ...proj.cellOffsets });
    setAllowOverflow(proj.allowOverflow);
    setCellRotations({ ...proj.cellRotations });
    setCellSaturation({ ...proj.cellSaturation });
    setCellHue({ ...proj.cellHue });
    setCellOpacity({ ...proj.cellOpacity });
    setCellBrightness({ ...proj.cellBrightness });
    setCellInverted({ ...proj.cellInverted });
    setCellFlipH({ ...proj.cellFlipH });
    setCellFlipV({ ...proj.cellFlipV });
    setSelectedCells(new Set());
    setCurrentProject(name);
  };

  // Assign an uploaded image to every selected cell
  const handleUpload = (dataUrl: string) => {
    setCellImages(imgs => {
      const copy = { ...imgs };
      selectedCells.forEach(id => {
        copy[id] = dataUrl;
      });
      return copy;
    });
  };

  // Update scale (50–400%) for each selected cell
  const handleScaleChange = (scale: number) => {
    setCellScales(scales => {
      const copy = { ...scales };
      selectedCells.forEach(id => {
        copy[id] = scale;
      });
      return copy;
    });
  };

  // Toggle whether overflow is allowed (visible) or clipped
  const handleToggleOverflow = (allow: boolean) => {
    setAllowOverflow(allow);
  };

  // Nudge (dx, dy) for every selected cell
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

  // Rotate every selected cell to a specific angle (0–360)
  const handleRotateTo = (angle: number) => {
    setCellRotations(rotations => {
      const copy = { ...rotations };
      selectedCells.forEach(id => {
        copy[id] = ((angle % 360) + 360) % 360;
      });
      return copy;
    });
  };

  // Adjust saturation (0%–200%) for selected cells
  const handleSaturationChange = (saturation: number) => {
    setCellSaturation(sats => {
      const copy = { ...sats };
      selectedCells.forEach(id => {
        copy[id] = saturation;
      });
      return copy;
    });
  };

  // Adjust hue rotation (0°–360°) for selected cells
  const handleHueChange = (hue: number) => {
    setCellHue(hues => {
      const copy = { ...hues };
      selectedCells.forEach(id => {
        copy[id] = hue;
      });
      return copy;
    });
  };

  // Adjust opacity (0%–100%) for selected cells
  const handleOpacityChange = (opacity: number) => {
    setCellOpacity(op => {
      const copy = { ...op };
      selectedCells.forEach(id => {
        copy[id] = opacity;
      });
      return copy;
    });
  };

  // Adjust brightness (0%–200%) for selected cells
  const handleBrightnessChange = (brightness: number) => {
    setCellBrightness(brights => {
      const copy = { ...brights };
      selectedCells.forEach(id => {
        copy[id] = brightness;
      });
      return copy;
    });
  };

  // Invert colors (negative) for each selected cell
  const handleInvert = () => {
    setCellInverted(inv => {
      const copy = { ...inv };
      selectedCells.forEach(id => {
        copy[id] = !copy[id];
      });
      return copy;
    });
  };

  // Flip horizontally each selected cell
  const handleFlipH = () => {
    setCellFlipH(flips => {
      const copy = { ...flips };
      selectedCells.forEach(id => {
        copy[id] = !copy[id];
      });
      return copy;
    });
  };

  // Flip vertically each selected cell
  const handleFlipV = () => {
    setCellFlipV(flips => {
      const copy = { ...flips };
      selectedCells.forEach(id => {
        copy[id] = !copy[id];
      });
      return copy;
    });
  };

  // Reset (delete) the image from every selected cell
  const handleResetImage = () => {
    setCellImages(imgs => {
      const copy = { ...imgs };
      selectedCells.forEach(id => {
        delete copy[id];
      });
      return copy;
    });
  };

  // Listen for Delete/Backspace to remove images from selected cells
  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === 'Delete' || ev.key === 'Backspace') {
        setCellImages(imgs => {
          const copy = { ...imgs };
          selectedCells.forEach(id => {
            delete copy[id];
          });
          return copy;
        });
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedCells]);

  // ── Snapshot export: hide grid labels, render to canvas, then restore ──
  const handleDownloadSnapshot = () => {
    if (!gridRef.current) return;

    // 1) Enable snapshotMode (hides borders/labels)
    setSnapshotMode(true);

    // 2) Wait one frame so React can update the DOM
    requestAnimationFrame(async () => {
      const canvas = await html2canvas(gridRef.current!, {
        backgroundColor: null,
        scale: 2,
      });

      // 3) Turn snapshotMode OFF again
      setSnapshotMode(false);

      // 4) Trigger a PNG download
      const link = document.createElement('a');
      link.download = `${currentProject || 'grid-snapshot'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };

  return (
    <div style={{ padding: 20, boxSizing: 'border-box' }}>
      {/* ── TOGGLE BUTTON ── */}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => setShowQRPage(prev => !prev)}
          style={{ padding: '8px 12px', fontSize: '1rem' }}
        >
          {showQRPage ? '← Back to Branding' : 'Generate QR Code'}
        </button>
      </div>

      {showQRPage ? (
        // ── QR Generator mode ──
        <QRCodeGenerator />
      ) : (
        // ── Branding/Grid mode ──
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          {/* Left column: 7×7 grid, fixed height */}
          <div style={{ flexShrink: 0, height: `${GRID_HEIGHT}px` }}>
            <div ref={gridRef}>
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
                snapshotMode={snapshotMode}
              />
            </div>
          </div>

          {/* Right column: Sidebar, same height, scroll if needed */}
          <div
            style={{
              flex: 1,
              height: `${GRID_HEIGHT}px`,
              overflowY: 'auto',
              marginLeft: 20,
              boxSizing: 'border-box',
            }}
          >
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
              onResetImage={handleResetImage}
              onDownloadSnapshot={handleDownloadSnapshot}

              onNewProject={handleNewProject}
              onSaveAs={handleSaveAs}
              onSaveExisting={handleSaveExisting}
              onRename={handleRenameProject}
              projectNames={projectNames}
              currentProject={currentProject}
              setCurrentProject={setCurrentProject}
              onLoadProject={handleLoadProject}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
