import React, { useState, useEffect, useRef } from 'react';
import GridCanvas from './GridCanvas';
import SidebarControls from './SidebarControls';
import QRCodeGenerator from './QRCodeGenerator';
import QRMatrixGrid from './QRMatrixGrid';
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

// Branding‐grid constants (match GridCanvas)
const SIZE = 80;
const ROWS = 7;
const GAP = 4;
const GRID_HEIGHT = ROWS * SIZE + (ROWS - 1) * GAP; // 584

const App: React.FC = () => {
  // ── Branding‐grid state ──
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

  // ── Project‐management state ──
  const [projectNames, setProjectNames] = useState<string[]>([]);
  const [currentProject, setCurrentProject] = useState<string>('');

  // ── iQR toggle + version + finder‐map ──
  const [showQRPage, setShowQRPage] = useState<boolean>(false);
  const [qrVersion, setQrVersion] = useState<number>(2); // default to 2
  const [finderMap, setFinderMap] = useState<Record<string, string>>({});

  // ── Which finder‐regions to map when “Map to iQR” is clicked ──
  const [mapL, setMapL] = useState<boolean>(false);
  const [mapR, setMapR] = useState<boolean>(false);
  const [mapBL, setMapBL] = useState<boolean>(false);

  // ── Snapshot mode ──
  const [snapshotMode, setSnapshotMode] = useState<boolean>(false);
  const gridRef = useRef<HTMLDivElement>(null);

  // On mount: load saved project names
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

  // Helper to read all projects:
  const readAllProjects = (): Record<string, ProjectState> => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!stored) return {};
    try {
      return JSON.parse(stored);
    } catch {
      return {};
    }
  };

  // ── Project handlers (unchanged) ──
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

  // ── Branding‐grid controls (unchanged) ──
  const handleUpload = (dataUrl: string) => {
    setCellImages(imgs => {
      const copy = { ...imgs };
      selectedCells.forEach(id => {
        copy[id] = dataUrl;
      });
      return copy;
    });
  };

  const handleScaleChange = (scale: number) => {
    setCellScales(scales => {
      const copy = { ...scales };
      selectedCells.forEach(id => {
        copy[id] = scale;
      });
      return copy;
    });
  };

  const handleToggleOverflow = (allow: boolean) => {
    setAllowOverflow(allow);
  };

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

  const handleRotateTo = (angle: number) => {
    setCellRotations(rotations => {
      const copy = { ...rotations };
      selectedCells.forEach(id => {
        copy[id] = ((angle % 360) + 360) % 360;
      });
      return copy;
    });
  };

  const handleSaturationChange = (saturation: number) => {
    setCellSaturation(sats => {
      const copy = { ...sats };
      selectedCells.forEach(id => {
        copy[id] = saturation;
      });
      return copy;
    });
  };

  const handleHueChange = (hue: number) => {
    setCellHue(hues => {
      const copy = { ...hues };
      selectedCells.forEach(id => {
        copy[id] = hue;
      });
      return copy;
    });
  };

  const handleOpacityChange = (opacity: number) => {
    setCellOpacity(op => {
      const copy = { ...op };
      selectedCells.forEach(id => {
        copy[id] = opacity;
      });
      return copy;
    });
  };

  const handleBrightnessChange = (brightness: number) => {
    setCellBrightness(brights => {
      const copy = { ...brights };
      selectedCells.forEach(id => {
        copy[id] = brightness;
      });
      return copy;
    });
  };

  const handleInvert = () => {
    setCellInverted(inv => {
      const copy = { ...inv };
      selectedCells.forEach(id => {
        copy[id] = !copy[id];
      });
      return copy;
    });
  };

  const handleFlipH = () => {
    setCellFlipH(flips => {
      const copy = { ...flips };
      selectedCells.forEach(id => {
        copy[id] = !copy[id];
      });
      return copy;
    });
  };

  const handleFlipV = () => {
    setCellFlipV(flips => {
      const copy = { ...flips };
      selectedCells.forEach(id => {
        copy[id] = !copy[id];
      });
      return copy;
    });
  };

  const handleResetImage = () => {
    setCellImages(imgs => {
      const copy = { ...imgs };
      selectedCells.forEach(id => {
        delete copy[id];
      });
      return copy;
    });
  };

  // Delete key listener only for branding‐grid
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

  // ── Snapshot export ──
  const handleDownloadSnapshot = () => {
    if (!gridRef.current) return;
    setSnapshotMode(true);
    requestAnimationFrame(async () => {
      const canvas = await html2canvas(gridRef.current!, {
        backgroundColor: null,
        scale: 2,
      });
      setSnapshotMode(false);
      const link = document.createElement('a');
      link.download = `${currentProject || 'grid-snapshot'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };

  // ── Helper: produce a dataURL of a single branding‐cell with all transforms applied ──
  const renderCellTransformed = async (brandingId: string): Promise<string | undefined> => {
    const dataUrl = cellImages[brandingId];
    if (!dataUrl) return undefined;

    return new Promise<string>(resolve => {
      const img = new Image();
      img.onload = () => {
        // Create an offscreen canvas for exactly one cell’s final appearance:
        const canvas = document.createElement('canvas');
        canvas.width = SIZE;
        canvas.height = SIZE;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(dataUrl);

        // 1) Apply CSS‐filter equivalents in canvas2D:
        //    brightness(X%), saturate(X%), hue-rotate(Xdeg), invert
        const sat = cellSaturation[brandingId] ?? 100;
        const hue = cellHue[brandingId] ?? 0;
        const bright = cellBrightness[brandingId] ?? 100;
        const opac = (cellOpacity[brandingId] ?? 100) / 100;
        const inv = cellInverted[brandingId] ? 1 : 0;
        ctx.filter = `
          brightness(${bright}%)
          saturate(${sat}%)
          hue-rotate(${hue}deg)
          invert(${inv})
        `.trim();

        // 2) Compute rotation, flips, scale, and offset
        const angleDeg = cellRotations[brandingId] ?? 0;
        const angleRad = (angleDeg * Math.PI) / 180;
        const scalePct = (cellScales[brandingId] ?? 100) / 100;
        const flipH = cellFlipH[brandingId] ? -1 : 1;
        const flipV = cellFlipV[brandingId] ? -1 : 1;
        const offset = cellOffsets[brandingId] || { dx: 0, dy: 0 };

        // Draw procedure:
        //  - Clear canvas
        ctx.clearRect(0, 0, SIZE, SIZE);
        //  - Save state
        ctx.save();
        //  - Move to center of cell
        ctx.translate(SIZE / 2 + offset.dx, SIZE / 2 + offset.dy);
        //  - Apply rotation
        ctx.rotate(angleRad);
        //  - Apply scale & flips
        ctx.scale(scalePct * flipH, scalePct * flipV);
        //  - Draw image centered (img natural size unknown, so fit into cell)
        //    We’ll draw the image so that its center aligns with canvas center,
        //    and scale it down if necessary to fit within cell bounds.
        const imgRatio = img.width / img.height;
        let drawW = SIZE;
        let drawH = SIZE;
        if (imgRatio > 1) {
          // wide image
          drawW = SIZE;
          drawH = SIZE / imgRatio;
        } else {
          // tall or square
          drawH = SIZE;
          drawW = SIZE * imgRatio;
        }
        ctx.globalAlpha = opac;
        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
        //  - Restore state
        ctx.restore();

        // 3) Return dataURL
        resolve(canvas.toDataURL());
      };
      img.src = dataUrl;
    });
  };

  // ── “Map to iQR” handler (async) ──
  const handleMapToIQR = async () => {
    // Always force version 2 when mapping:
    const version = 2;
    setQrVersion(version);
    const N = 21 + 4 * (version - 1); // 25

    // Build a new finderMap:
    const newFinder: Record<string, string> = {};

    // Iterate all 7×7 branding cells, transform each, then place into requested finders
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < ROWS; c++) {
        const brandingId = `${r + 1}${String.fromCharCode(65 + c)}`; // e.g. “3C”
        if (!cellImages[brandingId]) continue; // skip empty cells

        // Produce the transformed dataURL for this entire cell
        // (including scale/rotate/flip/invert/etc.)
        // eslint-disable-next-line no-await-in-loop
        const finalDataUrl = await renderCellTransformed(brandingId);
        if (!finalDataUrl) continue;

        // If “L” checkbox was checked, place into top-left finder:
        if (mapL) {
          const key = `${r},${c}`; // top-left region at (r, c)
          newFinder[key] = finalDataUrl;
        }
        // If “R” checked, place into top-right finder:
        if (mapR) {
          const key = `${r},${(N - 7) + c}`;
          newFinder[key] = finalDataUrl;
        }
        // If “BL” checked, place into bottom-left finder:
        if (mapBL) {
          const key = `${(N - 7) + r},${c}`;
          newFinder[key] = finalDataUrl;
        }
      }
    }

    // Update the finderMap state and show iQR page:
    setFinderMap(newFinder);
    setShowQRPage(true);
  };

  return (
    <div style={{ padding: 20, boxSizing: 'border-box' }}>
      {/* ── TOGGLE ── */}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => setShowQRPage(prev => !prev)}
          style={{ padding: '8px 12px', fontSize: '1rem' }}
        >
          {showQRPage ? '← Back to Branding' : 'Generate QR Code'}
        </button>
      </div>

      {showQRPage ? (
        // ── iQR view ──
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          {/* LEFT: QRMatrixGrid */}
          <div style={{ flexBasis: '60%', marginRight: 20 }}>
            <QRMatrixGrid version={qrVersion} finderData={finderMap} />

            <div style={{ marginTop: 12 }}>
              <label htmlFor="qr-version" style={{ marginRight: 8 }}>
                <strong>Grid Version:</strong>
              </label>
              <select
                id="qr-version"
                value={qrVersion}
                onChange={e => {
                  const v = parseInt(e.target.value, 10);
                  setQrVersion(v);
                  // If we already mapped something at version=2, we may want to re‐position those
                  // finder‐cells into the new offsets for version=v. For simplicity, we’ll clear them:
                  setFinderMap({});
                }}
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map(v => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* RIGHT: QR controls */}
          <div style={{ flexBasis: '40%' }}>
            <QRCodeGenerator />
          </div>
        </div>
      ) : (
        // ── Branding view ──
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          {/* LEFT: 7×7 branding grid */}
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

            {/* “Save Branding” + checkboxes + “Map to iQR” */}
            <div style={{ marginTop: 12 }}>
              <button
                onClick={() => {
                  const name = prompt('Enter a name for this branding design:');
                  if (name !== null) handleSaveAs(name);
                }}
                style={{ marginBottom: 8, width: '100%' }}
              >
                Save Branding
              </button>

              <div style={{ display: 'flex', gap: '8px', marginBottom: 8 }}>
                <label>
                  <input
                    type="checkbox"
                    checked={mapL}
                    onChange={e => setMapL(e.target.checked)}
                  />{' '}
                  L
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={mapR}
                    onChange={e => setMapR(e.target.checked)}
                  />{' '}
                  R
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={mapBL}
                    onChange={e => setMapBL(e.target.checked)}
                  />{' '}
                  BL
                </label>
              </div>

              <button
                onClick={handleMapToIQR}
                style={{ width: '100%', marginBottom: 8 }}
                disabled={!mapL && !mapR && !mapBL}
              >
                Map to iQR
              </button>
            </div>
          </div>

          {/* RIGHT: Sidebar controls (scrollable) */}
          <div
            style={{
              flex: 1,
              marginLeft: 20,
              maxHeight: `${GRID_HEIGHT}px`,
              overflowY: 'auto',
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
