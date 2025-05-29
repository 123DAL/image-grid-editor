import React from 'react';

type Props = {
  selectedCells: Set<string>;
  setSelectedCells: React.Dispatch<React.SetStateAction<Set<string>>>;
  cellImages: Record<string, string>;
};

const SIZE = 80;
const ROWS = 7;
const COLS = 7;

const GridCanvas: React.FC<Props> = ({ selectedCells, setSelectedCells, cellImages }) => {
  // click/ctrl-click and double-click logic all in one handler
  const handleClick = (row: number, col: number, ev: React.MouseEvent) => {
    const id = `${row+1}${String.fromCharCode(65+col)}`; // e.g. "3C"
    if (ev.detail === 2) {
      // clear all on double-click
      setSelectedCells(new Set());
    } else if (ev.ctrlKey || ev.metaKey) {
      // ctrl+click to unselect
      setSelectedCells(prev => {
        const s = new Set(prev);
        s.delete(id);
        return s;
      });
    } else {
      // normal click to select
      setSelectedCells(prev => new Set(prev).add(id));
    }
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${COLS}, ${SIZE}px)`,
        gridTemplateRows:    `repeat(${ROWS}, ${SIZE}px)`,
        gap: 4,
        marginRight: 20
      }}
    >
      {Array.from({length: ROWS}).flatMap((_, r) =>
        Array.from({length: COLS}).map((_, c) => {
          const id = `${r+1}${String.fromCharCode(65+c)}`;
          const img = cellImages[id];
          const selected = selectedCells.has(id);
          return (
            <div
              key={id}
              onClick={(e) => handleClick(r, c, e)}
              style={{
                width: SIZE, height: SIZE,
                border: selected ? '3px solid #007acc' : '1px solid #ccc',
                background: selected ? '#e6f7ff' : '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                cursor: 'pointer'
              }}
            >
              {img
                ? <img src={img} alt={id} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                : id
              }
            </div>
          );
        })
      )}
    </div>
  );
};

export default GridCanvas;

