import React, { useState, useEffect, useRef } from 'react';
import GridCanvas from './GridCanvas';
import SidebarControls from './SidebarControls';
import html2canvas from 'html2canvas';

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

const App: React.FC = () => {
  // --- grid selection + state ---
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

  // --- project management state ---
  const [projectNames, setProjectNames] = useState<string[]>([]);
  const [currentProject, setCurrentProject] = useState<string>('');

  // When true, GridCanvas will hide borders/background for snapshot
  const [snapshotMode, setSnapshotMode] = useState<boolean>(false);
  const gridRef = useRef<HTMLDivElement>(null);

  // On mount, load saved project names
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        const parsed: Record<string, ProjectState> = JSON.parse(stored);
        setProjectNames(Object.keys(parsed));
      } catch {
        // ignore parse errors
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

  // “New Project” clears all state and deselects current project
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

  // “Save As…” always creates a new entry under provided name
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

  // “Save” overwrites the entry under currentProject
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

  // “Rename” moves old key → new key
  const handleRenameProject = (newName: string) => {
    const oldName = currentProject;
    if (!oldName || !newName.trim() || oldName === newName) return;
    const all = readAllProjects();
    if (!all[oldName] || all[newName]) return;
    all[newName] = all[oldName];
    delete all[oldName];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(all));
    setProjectNames(Object.keys(all));
    setCurrentProject(newName);
  };

  // “Load” replaces all grid state with stored project
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

  // Assign uploaded image to selected cells
  const handleUpload = (dataUrl: string) => {
    setCellImages((imgs) => {
      const copy = { ...imgs };
      selectedCells.forEach((id) => {
        copy[id] = dataUrl;
      });
      return copy;
    });
  };

  // Scale selected cells
  const handleScaleChange = (scale: number) => {
    setCellScales((scales) => {
      const copy = { ...scales };
      selectedCells.forEach((id) => {
        copy[id] = scale;
      });
      return copy;
    });
  };

  // Toggle overflow
  const handleToggleOverflow = (allow: boolean) => {
    setAllowOverflow(allow);
  };

  // Nudge selected cells
  const handleNudge = (dx: number, dy: number) => {
    setCellOffsets((offsets) => {
      const copy = { ...offsets };
      selectedCells.forEach((id) => {
        const prev = copy[id] || { dx: 0, dy: 0 };
        copy[id] = { dx: prev.dx + dx, dy: prev.dy + dy };
      });
      return copy;
    });
  };

  // Rotate selected cells to angle
  const handleRotateTo = (angle: number) => {
    setCellRotations((rotations) => {
      const copy = { ...rotations };
      selectedCells.forEach((id) => {
        copy[id] = ((angle % 360) + 360) % 360;
      });
      return copy;
    });
  };

  // Adjust saturation
  const handleSaturationChange = (saturation: number) => {
    setCellSaturation((sats) => {
      const copy = { ...sats };
      selectedCells.forEach((id) => {
        copy[id] = saturation;
      });
      return copy;
    });
  };

  // Adjust hue rotate
  const handleHueChange = (hue: number) => {
    setCellHue((hues) => {
      const copy = { ...hues };
      selectedCells.forEach((id) => {
        copy[id] = hue;
      });
      return copy;
    });
  };

  // Adjust opacity
  const handleOpacityChange = (opacity: number) => {
    setCellOpacity((op) => {
      const copy = { ...op };
      selectedCells.forEach((id) => {
        copy[id] = opacity;
      });
      return copy;
    });
  };

  // Adjust brightness
  const handleBrightnessChange = (brightness: number) => {
    setCellBrightness((brights) => {
      const copy = { ...brights };
      selectedCells.forEach((id) => {
        copy[id] = brightness;
      });
      return copy;
    });
  };

  // Invert selected cells
  const handleInvert = () => {
    setCellInverted((inv) => {
      const copy = { ...inv };
      selectedCells.forEach((id) => {
        copy[id] = !copy[id];
      });
      return copy;
    });
  };

  // Flip horizontal on selected cells
  const handleFlipH = () => {
    setCellFlipH((flips) => {
      const copy = { ...flips };
      selectedCells.forEach((id) => {
        copy[id] = !copy[id];
      });
      return copy;
    });
  };

  // Flip vertical on selected cells
  const handleFlipV = () => {
    setCellFlipV((flips) => {
      const copy = { ...flips };
      selectedCells.forEach((id) => {
        copy[id] = !copy[id];
      });
      return copy;
    });
  };

  // Reset (delete) images from selected cells
  const handleResetImage = () => {
    setCellImages((imgs) => {
      const copy = { ...imgs };
      selectedCells.forEach((id) => {
        delete copy[id];
      });
      return copy;
    });
  };

  // Delete key: remove images from selected cells
  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === 'Delete' || ev.key === 'Backspace') {
        setCellImages((imgs) => {
          const copy = { ...imgs };
          selectedCells.forEach((id) => {
            delete copy[id];
          });
          return copy;
        });
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedCells]);

  // … other state and handlers above …

  // --- Snapshot export (updated to use requestAnimationFrame) ---
  const handleDownloadSnapshot = () => {
    if (!gridRef.current) return;

    // 1) Turn on snapshotMode (hides cell borders & IDs)
    setSnapshotMode(true);

    // 2) Wait until next animation frame (ensuring DOM has re-rendered)
    requestAnimationFrame(async () => {
      // 3) Now capture with html2canvas
      const canvas = await html2canvas(gridRef.current!, {
        backgroundColor: null, // transparent background
        scale: 2,              // optional: higher resolution
      });

      // 4) Immediately turn snapshotMode off
      setSnapshotMode(false);

      // 5) Trigger download of the PNG
      const link = document.createElement('a');
      link.download = `${currentProject || 'grid-snapshot'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };
  return (
    <div style={{ display: 'flex', padding: 20 }}>
      {/* Wrap GridCanvas in a div with ref so html2canvas can capture it */}
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
  );
};

export default App;
