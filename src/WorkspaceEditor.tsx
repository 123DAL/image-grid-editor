import React, { useState, useEffect } from 'react';
import { generateQRMatrix } from './QRUtils';

const WorkspaceEditor: React.FC = () => {
  // ── QR data & version state ──
  const [data, setData] = useState<string>('Hello');
  const [version, setVersion] = useState<number>(2);
  const [matrix, setMatrix] = useState<boolean[][]>([]);

  // Re‐generate the boolean matrix any time `data` or `version` changes:
  useEffect(() => {
    const m = generateQRMatrix(version, 'M', data);
    setMatrix(m);
  }, [version, data]);

  const CELL_SIZE = 20; // size (in px) of each “module” in the displayed grid

  return (
    <div style={{ display: 'flex', height: '100vh', boxSizing: 'border-box' }}>
      {/* ── LEFT: QR display ── */}
      <div
        style={{
          flex: 2,
          padding: 20,
          overflow: 'auto',
          backgroundColor: '#f9f9f9',
        }}
      >
        {matrix.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${matrix.length}, ${CELL_SIZE}px)`,
              gridTemplateRows: `repeat(${matrix.length}, ${CELL_SIZE}px)`,
              gap: 0,
            }}
          >
            {matrix.flatMap((row, r) =>
              row.map((cell, c) => (
                <div
                  key={`${r},${c}`}
                  style={{
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    backgroundColor: cell ? '#000' : '#fff',
                    // thin light border to see the grid:
                    border: '1px solid #ddd',
                    boxSizing: 'border-box',
                  }}
                />
              ))
            )}
          </div>
        ) : (
          <p>Generating…</p>
        )}
      </div>

      {/* ── RIGHT: Control panel ── */}
      <div
        style={{
          flex: 1,
          padding: 20,
          borderLeft: '1px solid #ccc',
          boxSizing: 'border-box',
          overflowY: 'auto',
          backgroundColor: '#fff',
        }}
      >
        <h3>QR Settings</h3>

        {/* Data string input */}
        <div style={{ marginBottom: 15 }}>
          <label>
            <strong>Data:</strong>
          </label>
          <input
            type="text"
            value={data}
            onChange={e => setData(e.target.value)}
            style={{ width: '100%', padding: '4px 6px', marginTop: 4 }}
          />
        </div>

        {/* Version selector */}
        <div style={{ marginBottom: 15 }}>
          <label>
            <strong>Version (1–10):</strong>
          </label>
          <select
            value={version}
            onChange={e => setVersion(parseInt(e.target.value, 10))}
            style={{ width: '100%', padding: '4px 6px', marginTop: 4 }}
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map(v => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        {/* (Later: insert your image‐mapping controls here) */}
        <div style={{ marginTop: 30 }}>
          <p>
            <em>Next steps:</em> hook up your existing image‐upload controls to draw “transparent”
            cells on top of this grid.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceEditor;
