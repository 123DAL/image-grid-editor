// src/WorkspaceEditor.tsx
import React, { useState, useEffect } from 'react';
import { generateQRMatrix } from './QRUtils';
import SidebarControls from './SidebarControls';

type CellImages = Record<string, string>;

const WorkspaceEditor: React.FC = () => {
  // ── 1) QR “data” and version state ──
  const [dataString, setDataString] = useState<string>('Hello');
  const [version, setVersion] = useState<number>(2);

  // ── 2) Which single cell ("r,c") is selected? ──
  const [selectedCell, setSelectedCell] = useState<string | null>(null);

  // ── 3) Per‐cell image & transform state ──
  const [cellImages, setCellImages] = useState<CellImages>({});
  const [cellScales, setCellScales] = useState<Record<string, number>>({});
  const [cellOffsets, setCellOffsets] = useState<Record<string, { dx: number; dy: number }>>({});
  const [cellRotations, setCellRotations] = useState<Record<string, number>>({});
  const [cellInverted, setCellInverted] = useState<Record<string, boolean>>({});
  const [cellFlipH, setCellFlipH] = useState<Record<string, boolean>>({});
  const [cellFlipV, setCellFlipV] = useState<Record<string, boolean>>({});

  // ── 4) Compute the boolean QR matrix whenever dataString or version changes ──
  const [qrMatrix, setQrMatrix] = useState<boolean[][]>([]);
  useEffect(() => {
    const mat = generateQRMatrix(version, 'M', dataString);
    setQrMatrix(mat);

    // Clear any previous cell selection & images/transforms
    setSelectedCell(null);
    setCellImages({});
    setCellScales({});
    setCellOffsets({});
    setCellRotations({});
    setCellInverted({});
    setCellFlipH({});
    setCellFlipV({});
  }, [dataString, version]);

  // ── 5) Handlers that mutate per‐cell state ──

  // Upload a new image into cellKey
  const onUploadToCell = (cellKey: string, dataUrl: string) => {
    setCellImages(prev => ({ ...prev, [cellKey]: dataUrl }));
    // Initialize default transforms if missing:
    setCellScales(s => ({ ...s, [cellKey]: 100 }));
    setCellOffsets(o => ({ ...o, [cellKey]: { dx: 0, dy: 0 } }));
    setCellRotations(r => ({ ...r, [cellKey]: 0 }));
    setCellInverted(i => ({ ...i, [cellKey]: false }));
    setCellFlipH(fh => ({ ...fh, [cellKey]: false }));
    setCellFlipV(fv => ({ ...fv, [cellKey]: false }));
  };

  // Scale a single cell
  const onScaleChange = (cellKey: string, scale: number) => {
    setCellScales(prev => ({ ...prev, [cellKey]: scale }));
  };

  // Nudge a single cell
  const onNudge = (cellKey: string, dx: number, dy: number) => {
    setCellOffsets(prev => {
      const old = prev[cellKey] || { dx: 0, dy: 0 };
      return { ...prev, [cellKey]: { dx: old.dx + dx, dy: old.dy + dy } };
    });
  };

  // Rotate a single cell
  const onRotateTo = (cellKey: string, angle: number) => {
    setCellRotations(prev => ({ ...prev, [cellKey]: ((angle % 360) + 360) % 360 }));
  };

  // Invert a single cell
  const onInvert = (cellKey: string) => {
    setCellInverted(prev => ({ ...prev, [cellKey]: !prev[cellKey] }));
  };

  // FlipH a single cell
  const onFlipH = (cellKey: string) => {
    setCellFlipH(prev => ({ ...prev, [cellKey]: !prev[cellKey] }));
  };

  // FlipV a single cell
  const onFlipV = (cellKey: string) => {
    setCellFlipV(prev => ({ ...prev, [cellKey]: !prev[cellKey] }));
  };

  // Remove image + transforms from a single cell
  const onResetImage = (cellKey: string) => {
    setCellImages(prev => {
      const copy = { ...prev };
      delete copy[cellKey];
      return copy;
    });
    setCellScales(prev => { const c = { ...prev }; delete c[cellKey]; return c; });
    setCellOffsets(prev => { const c = { ...prev }; delete c[cellKey]; return c; });
    setCellRotations(prev => { const c = { ...prev }; delete c[cellKey]; return c; });
    setCellInverted(prev => { const c = { ...prev }; delete c[cellKey]; return c; });
    setCellFlipH(prev => { const c = { ...prev }; delete c[cellKey]; return c; });
    setCellFlipV(prev => { const c = { ...prev }; delete c[cellKey]; return c; });
  };

  // (Stub these for now—wire them up if you need project/save behavior later)
  const onDownloadSnapshot = () => {};
  const onNewProject = () => {};
  const onSaveAs = (name: string) => {};
  const onSaveExisting = () => {};
  const onRename = (newName: string) => {};
  const onLoadProject = (name: string) => {};
  const projectNames: string[] = [];
  const currentProject = '';
  const setCurrentProject = (_: string) => {};

  // ── 6) Render the QR grid; each cell is either a black/white square or an <img> if uploaded. ──

  const CELL_SIZE = 24;
  const matrixSize = qrMatrix.length;
  const totalGridPx = matrixSize * CELL_SIZE + (matrixSize - 1) * 1; // plus 1px gaps

  const renderCellContent = (r: number, c: number) => {
    const key = `${r},${c}`;
    const isSelected = selectedCell === key;
    const imgSrc = cellImages[key];
    const isBlack = qrMatrix[r]?.[c] ?? false;

    if (imgSrc) {
      // Build CSS transform from per‐cell state
      const scale = (cellScales[key] ?? 100) / 100;
      const rotateDeg = cellRotations[key] ?? 0;
      const offset = cellOffsets[key] ?? { dx: 0, dy: 0 };
      const flipH = cellFlipH[key] ? -1 : 1;
      const flipV = cellFlipV[key] ? -1 : 1;
      const invertFilter = cellInverted[key] ? 'invert(1)' : 'invert(0)';

      return (
        <div
          key={key}
          onClick={() => setSelectedCell(key)}
          style={{
            width: CELL_SIZE,
            height: CELL_SIZE,
            boxSizing: 'border-box',
            border: isSelected ? '2px solid #00ccff' : '1px solid #222',
            overflow: 'hidden',
            backgroundColor: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={imgSrc}
            alt={key}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `
                translate(${offset.dx}px, ${offset.dy}px)
                rotate(${rotateDeg}deg)
                scale(${scale * flipH}, ${scale * flipV})
              `,
              filter: invertFilter,
            }}
          />
        </div>
      );
    }

    // Otherwise draw plain QR‐code module
    return (
      <div
        key={key}
        onClick={() => setSelectedCell(key)}
        style={{
          width: CELL_SIZE,
          height: CELL_SIZE,
          backgroundColor: isBlack ? '#000' : '#fff',
          boxSizing: 'border-box',
          border: isSelected ? '2px solid #00ccff' : '1px solid #444',
          cursor: 'pointer',
        }}
      />
    );
  };

  return (
    <div style={{ display: 'flex', height: '100vh', boxSizing: 'border-box' }}>
      {/* ── LEFT PANEL: QR Grid ── */}
      <div
        style={{
          position: 'relative',
          width: totalGridPx,
          height: totalGridPx,
          display: 'grid',
          gridTemplateColumns: `repeat(${matrixSize}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${matrixSize}, ${CELL_SIZE}px)`,
          gap: 1,
          backgroundColor: '#888',
          margin: 20,
        }}
      >
        {qrMatrix.map((rowArr, r) =>
          rowArr.map((_, c) => renderCellContent(r, c))
        )}
      </div>

      {/* ── RIGHT PANEL: SidebarControls ── */}
      <div
        style={{
          width: 300,
          padding: 20,
          borderLeft: '1px solid #ddd',
          boxSizing: 'border-box',
          overflowY: 'auto',
        }}
      >
        <h2>QR & Image Controls</h2>

        {/* 1) Data string input */}
        <div style={{ marginBottom: 15 }}>
          <label>
            <strong>Data to encode:</strong>
            <input
              type="text"
              value={dataString}
              onChange={e => setDataString(e.target.value)}
              style={{
                width: '100%',
                padding: '4px 6px',
                marginTop: 4,
                boxSizing: 'border-box',
              }}
            />
          </label>
        </div>

        {/* 2) Version selector */}
        <div style={{ marginBottom: 25 }}>
          <label>
            <strong>Version (1–10):</strong>
            <select
              value={version}
              onChange={e => setVersion(parseInt(e.target.value, 10))}
              style={{
                width: '100%',
                padding: '4px 6px',
                marginTop: 4,
                boxSizing: 'border-box',
              }}
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map(v => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* 3) Pass through to your SidebarControls */}
        <SidebarControls
          selectedCell={selectedCell}
          onUploadToCell={onUploadToCell}
          onScaleChange={onScaleChange}
          onNudge={onNudge}
          onRotateTo={onRotateTo}
          onInvert={onInvert}
          onFlipH={onFlipH}
          onFlipV={onFlipV}
          onResetImage={onResetImage}
          cellScales={cellScales}
          cellOffsets={cellOffsets}
          cellRotations={cellRotations}
          cellInverted={cellInverted}
          cellFlipH={cellFlipH}
          cellFlipV={cellFlipV}
          onDownloadSnapshot={onDownloadSnapshot}
          onNewProject={onNewProject}
          onSaveAs={onSaveAs}
          onSaveExisting={onSaveExisting}
          onRename={onRename}
          projectNames={projectNames}
          currentProject={currentProject}
          setCurrentProject={setCurrentProject}
          onLoadProject={onLoadProject}
        />
      </div>
    </div>
  );
};

export default WorkspaceEditor;

