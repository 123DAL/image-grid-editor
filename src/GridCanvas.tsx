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

const SIZE = 40;
const ROWS = 33;
const COLS = 33;

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
      setSelectedCells(new Set());
    } else if (ev.ctrlKey || ev.metaKey) {
      setSelectedCells(prev => {
        const s = new Set(prev);
        s.delete(id);
        return s;
      });
    } else {
      setSelectedCells(prev => new Set(prev).add(id));
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
      {/* Grid Area */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, ${SIZE}px)`,
          gridTemplateRows: `repeat(${ROWS}, ${SIZE}px)`,
          gap: 4,
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

            const borderStyle = snapshotMode
              ? 'none'
              : selected
              ? '3px solid #007acc'
              : '1px solid #ccc';

            const bgColor = snapshotMode
              ? 'transparent'
              : selected
              ? '#e6f7ff'
              : '#fff';

            const overflowStyle = snapshotMode
              ? 'visible'
              : allowOverflow
              ? 'visible'
              : 'hidden';

            const zIndexStyle =
              img && allowOverflow && !snapshotMode ? 1 : 'auto';

            return (
              <div
                key={id}
                onClick={(e) => handleClick(r, c, e)}
                style={{
                  width: SIZE,
                  height: SIZE,
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

      {/* QR Code on the Right */}
      <div style={{ marginLeft: 40 }}>
        <QRCodeSVG
          value="iQR.art"
          size={COLS * SIZE}
          level="H"
          fgColor="#000000"
          bgColor="#ffffff"
          style={{ width: COLS * SIZE, height: COLS * SIZE }}
        />
      </div>
    </div>
  );
};

export default GridCanvas;

