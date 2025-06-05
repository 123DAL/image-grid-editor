import React, { useState, useEffect } from 'react';
import { generateQRMatrix } from './QRUtils';
import CellEditor from './CellEditor';

type GridMode = 'branding' | 'full';

const BRANDING_SIZE = 7;
const FULL_QR_VERSION = 2; // version 2 QR = 25 modules + 8 quiet zone = 33
const CELL_SIZE = 40;

const QRMasterPanel: React.FC = () => {
  const [gridMode, setGridMode] = useState<GridMode>('branding');
  const [qrMatrix, setQrMatrix] = useState<boolean[][]>([]);
  const [cellImages, setCellImages] = useState<Record<string, string>>({});

  const croppedMatrix =
  gridMode === 'branding'
    ? qrMatrix.slice(4, 11).map(row => row.slice(4, 11))
    : qrMatrix;

const gridSize = croppedMatrix.length;

  useEffect(() => {
    const matrix = generateQRMatrix(FULL_QR_VERSION as any, 'M', 'iqr.art');
    setQrMatrix(matrix);
  }, []);

  const handleToggle = () => {
    setGridMode((prev) => (prev === 'branding' ? 'full' : 'branding'));
  };

  return (
    <div style={{ padding: 20 }}>
      <button onClick={handleToggle}>
        Switch to {gridMode === 'branding' ? 'Full QR Grid' : '7x7 Branding Mode'}
      </button>

      <div
        style={{
          position: 'relative',
          marginTop: 20,
          width: gridSize * CELL_SIZE,
          height: gridSize * CELL_SIZE,
        }}
      >
        {/* QR Background */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${gridSize}, ${CELL_SIZE}px)`,
            gap: 0,
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 0,
          }}
        >
          {Array.from({ length: gridSize * gridSize }).map((_, i) => {
            const row = Math.floor(i / gridSize);
            const col = i % gridSize;
            const isDark = croppedMatrix[row]?.[col] ?? false;

            return (
              <div
                key={`bg-${row}-${col}`}
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  backgroundColor: isDark ? '#999' : '#fff',
                  border: '1px solid #ddd',
                }}
              />
            );
          })}
        </div>

        {/* Foreground Cell Layer */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${gridSize}, ${CELL_SIZE}px)`,
            gap: 0,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {Array.from({ length: gridSize * gridSize }).map((_, i) => {
            const row = Math.floor(i / gridSize);
            const col = i % gridSize;
            const cellKey = `${row},${col}`;

            return (
              <div
                key={`cell-${row}-${col}`}
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  backgroundColor: 'transparent',
                  position: 'relative',
                }}
              >
                <CellEditor
                  row={row}
                  col={col}
                  imageData={cellImages[cellKey]}
                  onImageChange={(dataUrl) =>
                    setCellImages((prev) => ({
                      ...prev,
                      [cellKey]: dataUrl,
                    }))
                  }
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QRMasterPanel;
