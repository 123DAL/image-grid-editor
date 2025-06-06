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

const SIZE = 40;    // each cell (including its 1px borders) is exactly 40px
const ROWS = 33;
const COLS = 33;

// We want a 25×25 QR (Version 2) centered under a 33×33 grid, 
// leaving exactly 4 cells of quiet zone on each side.
// → 4 cells × 40px = 160px quiet zone on each side
const QUIET_CELLS = 4;
const VISIBLE_QR_CELLS = COLS - QUIET_CELLS * 2; // 33 - 8 = 25
const VISIBLE_QR_PX = VISIBLE_QR_CELLS * SIZE;   // 25 × 40 = 1000px
const GRID_PX = COLS * SIZE;                     // 33 × 40 = 1320px

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
  const handleClick = (row: number, col: number, ev: React.MouseEvent) => {
    const id = `${row + 1}${String.fromCharCode(65 + col)}`;
    if (ev.detail === 2) {
      // Double‐click → clear all selections
      setSelectedCells(new Set());
    } else if (ev.ctrlKey || ev.metaKey) {
      // Ctrl+click → remove just that one
      setSelectedCells(prev => {
        const copy = new Set(prev);
        copy.delete(id);
        return copy;
      });
    } else {
      // Normal click → select
      setSelectedCells(prev => new Set(prev).add(id));
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
      {/**
       * ─── LEFT COLUMN: 33×33 GRID WITH QR UNDERNEATH ───
       * We absolutely position a 1000×1000 QR underlay so that each of its 25×25 modules
       * sits exactly under a 40px cell (including that cell’s 1px border).
       */}
      <div
        style={{
          position: 'relative',
          width: `${GRID_PX}px`,   // 1320px
          height: `${GRID_PX}px`,  // 1320px
        }}
      >
        {/* ─── 1) QR Underlay (absolute, zIndex: 0) ─── */}
        <div
          style={{
            position: 'absolute',
            top: `${QUIET_CELLS * SIZE}px`,   // 4×40 = 160px down
            left: `${QUIET_CELLS * SIZE}px`,  // 4×40 = 160px right
            width: `${VISIBLE_QR_PX}px`,      // 1000px
            height: `${VISIBLE_QR_PX}px`,     // 1000px
            zIndex: 0,
            pointerEvents: 'none',
            // Optional: reduce opacity if you want a faint underlay
            // opacity: 0.2
          }}
        >
          <QRCodeSVG
            value="iQR.art"
            size={VISIBLE_QR_PX}
            level="H"
            fgColor="#000000"
            bgColor="#ffffff"
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        {/* ─── 2) 33×33 Grid Overlay (absolute, zIndex: 1) ─── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${COLS}, ${SIZE}px)`,
            gridTemplateRows:    `repeat(${ROWS}, ${SIZE}px)`,
            gap: 0,               // no extra space
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
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

              // Highlighted border if selected; otherwise thin grey
              const borderStyle = snapshotMode
                ? 'none'
                : selected
                ? '3px solid #007acc'
                : '1px solid #ccc';

              // ← Make the cell’s background TRANSPARENT (so QR modules show through).
              // If the cell is selected, we still highlight with a pale blue.
              const bgColor = snapshotMode
                ? 'transparent'
                : selected
                ? '#e6f7ff'
                : 'transparent';

              const overflowStyle = snapshotMode
                ? 'visible'
                : allowOverflow
                ? 'visible'
                : 'hidden';

              const zIndexStyle =
                img && allowOverflow && !snapshotMode ? 2 : 'auto';

              return (
                <div
                  key={id}
                  onClick={e => handleClick(r, c, e)}
                  style={{
                    width: SIZE,                 // 40px INCLUDING border
                    height: SIZE,                // 40px INCLUDING border
                    boxSizing: 'border-box',     // ← THIS ensures the 1px border is _inside_ the 40px
                    border: borderStyle,
                    background: bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    cursor: 'pointer',
                    overflow: overflowStyle,
                    zIndex: zIndexStyle,
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
                        opacity: opacity,
                        transformOrigin: 'center center',
                        maxWidth: '100%',
                        maxHeight: '100%',
                      }}
                    />
                  ) : null}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ─── RIGHT COLUMN: Your Existing Controls ─── */}
      <div style={{ marginLeft: 40 }}>
        <h3>Controls</h3>
        {/* …everything you already had (sliders, upload, buttons, etc.) */}
      </div>
    </div>
  );
};

export default GridCanvas;
