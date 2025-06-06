// src/GridCanvas.tsx

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

type Props = {
  selectedCells: Set<string>;
  setSelectedCells: React.Dispatch<React.SetStateAction<Set<string>>>;
  cellImages: Record<string, string>;
  cellScales: Record<string, number>;
  allowOverflow: boolean;
  cellOffsets: Record<string, { dx: number; dy: number }>;
  cellRotations: Record<string, number>;
  cellSaturation: Record<string, number>;
  cellHue: Record<string, number>;
  cellOpacity: Record<string, number>;
  cellBrightness: Record<string, number>;
  cellInverted: Record<string, boolean>;
  cellFlipH: Record<string, boolean>;
  cellFlipV: Record<string, boolean>;
  snapshotMode: boolean;
};

// ── CONSTANTS FOR CENTERING A 25×25 QR IN A 33×33 CELL GRID ──
const CELL_SIZE = 40;       // each cell is 40px × 40px
const QUIET_CELLS = 4;      // 4-cell quiet-zone on each side
const QR_MODULES = 25;      // Version 2 QR = 25×25 modules

const GridCanvas: React.FC<Props> = ({
  selectedCells,
  setSelectedCells,
  cellImages,
  cellScales,
  allowOverflow,
  cellOffsets,
  cellRotations,
  cellSaturation,
  cellHue,
  cellOpacity,
  cellBrightness,
  cellInverted,
  cellFlipH,
  cellFlipV,
  snapshotMode,
}) => {
  // Calculate rows/columns and pixel sizes
  const ROWS = QUIET_CELLS * 2 + QR_MODULES;     // 4 + 25 + 4 = 33
  const COLS = ROWS;                             // 33
  const TOTAL_PX = COLS * CELL_SIZE;             // 33 × 40 = 1320px
  const QR_PX = QR_MODULES * CELL_SIZE;          // 25 × 40 = 1000px
  const OFFSET_PX = QUIET_CELLS * CELL_SIZE;      // 4 × 40 = 160px

  // Click / Ctrl+Click / Double-Click logic
  const handleClick = (r: number, c: number, ev: React.MouseEvent) => {
    const id = `${r + 1}${String.fromCharCode(65 + c)}`; // e.g. “3C”
    if (ev.detail === 2) {
      // Double-click → clear all selections
      setSelectedCells(new Set());
    } else if (ev.ctrlKey || ev.metaKey) {
      // Ctrl+click → unselect that cell
      setSelectedCells(prev => {
        const s = new Set(prev);
        s.delete(id);
        return s;
      });
    } else {
      // Normal click → select
      setSelectedCells(prev => {
        const s = new Set(prev);
        s.add(id);
        return s;
      });
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width:    `${TOTAL_PX}px`,  // 1320px
        height:   `${TOTAL_PX}px`,  // 1320px
      }}
    >
      {/** 1) QR Underlay: place a 25×25-module QR, each module = 40px, offset by 160px (4 cells) **/}
      <div
        style={{
          position:      'absolute',
          top:           `${OFFSET_PX}px`,  // 160px
          left:          `${OFFSET_PX}px`,  // 160px
          width:         `${QR_PX}px`,      // 1000px
          height:        `${QR_PX}px`,      // 1000px
          zIndex:        0,                 // under the grid lines
          pointerEvents: 'none',            // let clicks pass through to the overlay
        }}
      >
        <QRCodeSVG
          value="iQR.art"
          version="2"
          size={QR_PX}
          level="H"
          fgColor="#000000"
          bgColor="#ffffff"
          style={{
            width:  '100%',
            height: '100%',
          }}
        />
      </div>

      {/** 2) 33×33 “cell grid” overlay, each cell = 40px×40px **/}
      <div
        style={{
          display:             'grid',
          gridTemplateColumns: `repeat(${COLS}, ${CELL_SIZE}px)`,
          gridTemplateRows:    `repeat(${ROWS}, ${CELL_SIZE}px)`,
          gap:                 0,
          position:            'relative',
          zIndex:              1,  // on top of the QR underlay
        }}
      >
        {Array.from({ length: ROWS }).flatMap((_, r) =>
          Array.from({ length: COLS }).map((_, c) => {
            const id = `${r + 1}${String.fromCharCode(65 + c)}`;
            const img = cellImages[id];
            const scale = cellScales[id] || 100;
            const offset = cellOffsets[id] || { dx: 0, dy: 0 };
            const rotation = cellRotations[id] || 0;
            const saturation = cellSaturation[id] ?? 100;
            const hue = cellHue[id] ?? 0;
            const opacity = (cellOpacity[id] ?? 100) / 100;
            const brightness = cellBrightness[id] ?? 100;
            const inverted = cellInverted[id] ? 1 : 0;
            const flipH = cellFlipH[id] ? -1 : 1;
            const flipV = cellFlipV[id] ? -1 : 1;

            const selected = selectedCells.has(id);

            // Make default background TRANSPARENT so QR modules show through
            const bgColor = snapshotMode
              ? 'transparent'
              : selected
              ? '#e6f7ff'
              : 'transparent';

            const borderStyle = snapshotMode
              ? 'none'
              : selected
              ? '3px solid #007acc'
              : '1px solid #ccc';

            const overflowStyle = snapshotMode
              ? 'visible'
              : allowOverflow
              ? 'visible'
              : 'hidden';

            const zIndexStyle = img && allowOverflow && !snapshotMode
              ? 1
              : 'auto';

            return (
              <div
                key={id}
                onClick={e => handleClick(r, c, e)}
                style={{
                  width:          CELL_SIZE,
                  height:         CELL_SIZE,
                  border:         borderStyle,
                  background:     bgColor,
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  position:       'relative',
                  cursor:         'pointer',
                  overflow:       overflowStyle,
                  zIndex:         zIndexStyle,
                }}
              >
                {img ? (
                  <img
                    src={img}
                    alt={id}
                    style={{
                      transform: `
                        scale(${scale / 100})
                        translate(${offset.dx}px, ${offset.dy}px)
                        rotate(${rotation}deg)
                        scaleX(${flipH})
                        scaleY(${flipV})
                      `,
                      filter: `
                        saturate(${saturation}%)
                        hue-rotate(${hue}deg)
                        brightness(${brightness}%)
                        invert(${inverted})
                      `,
                      opacity:         opacity,
                      transformOrigin: 'center center',
                      maxWidth:        '100%',
                      maxHeight:       '100%',
                    }}
                  />
                ) : null}
              </div>
            );
          })
        )}
      </div>

      {/** 3) (Optional) your “right-column” controls can go here **/}
      <div style={{ position: 'absolute', top: 0, right: -300 }}>
        {/* …your existing control panel JSX (buttons, sliders, etc.)… */}
      </div>
    </div>
  );
};

export default GridCanvas;
