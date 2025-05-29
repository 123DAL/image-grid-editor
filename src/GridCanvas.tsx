import React from 'react';

type Props = {
  selectedCells: Set<string>;
  setSelectedCells: React.Dispatch<React.SetStateAction<Set<string>>>;
  cellImages: Record<string, string>;
  cellScales: Record<string, number>;
};

const SIZE = 80;
const ROWS = 7;
const COLS = 7;

const GridCanvas: React.FC<Props> = ({
  selectedCells,
  setSelectedCells,
  cellImages,
  cellScales,
}) => {
  const handleClick = (row: number, col: number, ev: React.MouseEvent) => {
    const id = `${row + 1}${String.fromCharCode(65 + col)}`; // e.g. "3C"
    if (ev.detail === 2) {
      // double-click: clear all
      setSelectedCells(new Set());
    } else if (ev.ctrlKey || ev.metaKey) {
      // ctrl+click: unselect
      setSelectedCells(prev => {
        const s = new Set(prev);
        s.delete(id);
        return s;
      });
    } else {
      // normal click: select
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
        display: 'grid',
        gridTemplateColumns: `repeat(${COLS}, ${SIZE}px)`,
        gridTemplateRows:    `repeat(${ROWS}, ${SIZE}px)`,
        gap: 4,
        marginRight: 20,
      }}
    >
      {Array.from({ length: ROWS }).flatMap((_, r) =>
        Array.from({ length: COLS }).map((_, c) => {
          const id = `${r + 1}${String.fromCharCode(65 + c)}`;
          const imgSrc = cellImages[id];
          const selected = selectedCells.has(id);
          // default 100% if no scale set
          const scale = ((cellScales[id] ?? 100) / 100);

          return (
            <div
              key={id}
              onClick={e => handleClick(r, c, e)}
              style={{
                width: SIZE,
                height: SIZE,
                border: selected ? '3px solid #007acc' : '1px solid #ccc',
                background: selected ? '#e6f7ff' : '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                cursor: 'pointer',
                overflow: 'hidden',
              }}
            >
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt={id}
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'center center',
                    maxWidth: '100%',
                    maxHeight: '100%',
                  }}
                />
              ) : (
                id
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default GridCanvas;
