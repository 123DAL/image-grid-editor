// src/CustomQREditor.tsx
import React, { useState, useEffect } from 'react';
import { generateQRMatrix } from './QRUtils';

type CellImages = Record<string, string>;

/**
 * CustomQREditor
 *
 * Renders:
 *  • A QR grid on the left (black/white modules based on “Hello,” version 2 by default).
 *  • A sidebar on the right with:
 *      – A text‐input (“Data”) that regenerates the QR matrix on change.
 *      – A version‐selector (1–10) that regenerates on change.
 *      – A file input (“Upload Image”) that drops an image into whichever cell is currently selected.
 *
 * Workflow:
 * 1. Click any QR “cell.” That cell gets a colored outline (to show it’s selected).
 * 2. In the sidebar, click “Choose File…” and pick an image.
 * 3. As soon as the FileReader finishes, we store `cellImages["r,c"] = dataURL`.
 * 4. The main grid re‐renders: any cell with an entry in `cellImages` shows that image
 *    instead of a plain black/white square.  
 *
 * (Later on you can add scale, rotate, etc. controls exactly as you did in the 7×7 branding grid.)
 */

const CustomQREditor: React.FC = () => {
  // ── 1) Sidebar state: dataString (default “Hello”) and version (default 2)
  const [dataString, setDataString] = useState<string>('Hello');
  const [version, setVersion] = useState<number>(2);

  // ── 2) Which cell is currently selected? Stored as "r,c" (e.g. "5,3")
  const [selectedCell, setSelectedCell] = useState<string | null>(null);

  // ── 3) Map from "r,c" → dataURL string (the uploaded image for that module)
  const [cellImages, setCellImages] = useState<CellImages>({});

  // ── 4) Recompute the boolean matrix whenever dataString or version changes
  const [qrMatrix, setQrMatrix] = useState<boolean[][]>([]);
  useEffect(() => {
    const mat = generateQRMatrix(version, 'M', dataString);
    setQrMatrix(mat);
    setSelectedCell(null);             // clear selection when QR regenerates
    setCellImages({});                 // optional: clear any placed images
  }, [dataString, version]);

  // ── 5) Handler: “when user picks a file, drop it into the selected cell”
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedCell) {
      alert('Please click a cell in the QR grid first.');
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCellImages(prev => ({
          ...prev,
          [selectedCell]: reader.result as string,
        }));
      }
    };
    reader.readAsDataURL(file);
    // Reset the input so you can re‐upload the same file if you like:
    e.target.value = '';
  };

  // ── 6) Helpers for CSS
  const CELL_SIZE = 20;    // px per module (tweak as desired)
  const matrixSize = qrMatrix.length;
  const totalGridPx = matrixSize * CELL_SIZE + (matrixSize - 1) * 1; // plus 1px gap

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
          rowArr.map((isBlack, c) => {
            const key = `${r},${c}`;
            const isSelected = selectedCell === key;
            const imgSrc = cellImages[key];

            // If there’s an image for this cell, render that <img>; otherwise, render
            // a black/white div (like the matrix).
            if (imgSrc) {
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
                  }}
                >
                  <img
                    src={imgSrc}
                    alt={key}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </div>
              );
            } else {
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
            }
          })
        )}
      </div>

      {/* ── RIGHT PANEL: Sidebar Controls ── */}
      <div
        style={{
          width: 300,
          padding: 20,
          borderLeft: '1px solid #ddd',
          boxSizing: 'border-box',
        }}
      >
        <h2>QR Settings</h2>

        {/* 1) Data string input */}
        <div style={{ marginBottom: 15 }}>
          <label>
            <strong>Data:</strong>
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

        {/* 3) Upload‐to‐selected‐cell control */}
        <div style={{ marginBottom: 25 }}>
          <label>
            <strong>Upload Image to Cell:</strong>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'block', marginTop: 6 }}
            />
          </label>
          <small style={{ color: '#666' }}>
            (Click any cell on the QR to select. Then pick a file.)
          </small>
        </div>

        {/* 4) Current selection indicator */}
        <div style={{ marginBottom: 25 }}>
          <strong>Selected Cell:</strong>{' '}
          <span style={{ color: selectedCell ? '#000' : '#999' }}>
            {selectedCell || 'None'}
          </span>
        </div>

        {/* 5) (Optional) Clear an image from the selected cell */}
        {selectedCell && cellImages[selectedCell] && (
          <button
            onClick={() => {
              setCellImages(prev => {
                const copy = { ...prev };
                delete copy[selectedCell];
                return copy;
              });
            }}
            style={{
              background: '#c33',
              color: 'white',
              padding: '8px 12px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Remove Image from {selectedCell}
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomQREditor;
