import React from 'react';

interface BorderConfig {
  zone: 'all' | 'quiet' | 'outerFinder' | 'innerFinder' | 'none';
  width: number;
  color: string;
}

interface QRMatrixGridProps {
  /** 
   *  QR version (1–10).  
   *  Data‐area size = 21 + 4*(version−1).  
   *  Quiet zone = 3 cells on each side, so total = N + 6. 
   */
  version: number;

  /**
   *  finderData maps "row,col" → dataURL string.  
   *  Any key in finderData (e.g. "3,5") will display that image.  
   *  All other cells show a gray circle placeholder.
   */
  finderData: Record<string, string>;

  /**
   *  Border settings as chosen in the sidebar.
   */
  borderConfig: BorderConfig;
}

const QRMatrixGrid: React.FC<QRMatrixGridProps> = ({
  version,
  finderData,
  borderConfig,
}) => {
  // 1) Compute N = data‐area width/height (excluding quiet zone)
  const N = 21 + 4 * (version - 1);

  // 2) Always reserve a 3-cell “quiet zone” on each side
  const quiet = 3;

  // 3) Total grid dimension
  const total = N + 2 * quiet;

  // 4) Cell size (px)
  const CELL_SIZE = 16;

  // 5) Helper: check if (r,c) is inside the quiet zone (3 cells from each edge)
  const isInQuietZone = (r: number, c: number): boolean => {
    return r < quiet || r >= quiet + N || c < quiet || c >= quiet + N;
  };

  // 6) Helper: check if (r,c) is on the outer border of any 7×7 finder box
  const isOnOuterFinderEdge = (r: number, c: number): boolean => {
    // Top-Left finder: rows [quiet..quiet+6], cols [quiet..quiet+6]
    if (
      (r === quiet || r === quiet + 6) &&
      c >= quiet &&
      c < quiet + 7
    ) return true;
    if (
      (c === quiet || c === quiet + 6) &&
      r >= quiet &&
      r < quiet + 7
    ) return true;

    // Top-Right finder: rows [quiet..quiet+6], cols [quiet+N−7..quiet+N−1]
    if (
      (r === quiet || r === quiet + 6) &&
      c >= quiet + (N - 7) &&
      c < quiet + N
    ) return true;
    if (
      (c === quiet + (N - 7) || c === quiet + N - 1) &&
      r >= quiet &&
      r < quiet + 7
    ) return true;

    // Bottom-Left finder: rows [quiet+N−7..quiet+N−1], cols [quiet..quiet+6]
    if (
      (r === quiet + (N - 7) || r === quiet + N - 1) &&
      c >= quiet &&
      c < quiet + 7
    ) return true;
    if (
      (c === quiet || c === quiet + 6) &&
      r >= quiet + (N - 7) &&
      r < quiet + N
    ) return true;

    return false;
  };

  // 7) Helper: check if (r,c) is on the inner 3×3 border of each finder
  const isOnInnerFinderEdge = (r: number, c: number): boolean => {
    // Each finder’s inner 3×3 is offset by +2 from its outer start
    // Top-Left inner 3×3: rows [quiet+2..quiet+4], cols [quiet+2..quiet+4]
    if (
      (r === quiet + 2 || r === quiet + 4) &&
      c >= quiet + 2 &&
      c <= quiet + 4
    ) return true;
    if (
      (c === quiet + 2 || c === quiet + 4) &&
      r >= quiet + 2 &&
      r <= quiet + 4
    ) return true;

    // Top-Right inner 3×3: rows [quiet+2..quiet+4], cols [quiet+N−5..quiet+N−3]
    if (
      (r === quiet + 2 || r === quiet + 4) &&
      c >= quiet + (N - 5) &&
      c <= quiet + (N - 3)
    ) return true;
    if (
      (c === quiet + (N - 5) || c === quiet + (N - 3)) &&
      r >= quiet + 2 &&
      r <= quiet + 4
    ) return true;

    // Bottom-Left inner 3×3: rows [quiet+N−5..quiet+N−3], cols [quiet+2..quiet+4]
    if (
      (r === quiet + (N - 5) || r === quiet + (N - 3)) &&
      c >= quiet + 2 &&
      c <= quiet + 4
    ) return true;
    if (
      (c === quiet + 2 || c === quiet + 4) &&
      r >= quiet + (N - 5) &&
      r <= quiet + (N - 3)
    ) return true;

    return false;
  };

  // 8) Build all cells
  const cells: React.ReactElement[] = [];
  for (let r = 0; r < total; r++) {
    for (let c = 0; c < total; c++) {
      const key = `${r},${c}`;
      const imgSrc = finderData[key];

      // 9) Determine border style
      let borderStyle = '1px solid transparent';
      const { zone, width, color } = borderConfig;

      if (zone === 'all') {
        borderStyle = `${width}px solid ${color}`;
      } else if (zone === 'quiet' && isInQuietZone(r, c)) {
        borderStyle = `${width}px solid ${color}`;
      } else if (zone === 'outerFinder' && isOnOuterFinderEdge(r, c)) {
        borderStyle = `${width}px solid ${color}`;
      } else if (zone === 'innerFinder' && isOnInnerFinderEdge(r, c)) {
        borderStyle = `${width}px solid ${color}`;
      } else if (zone === 'none') {
        borderStyle = 'none';
      }

      // 10) Base style for every cell
      const baseStyle: React.CSSProperties = {
        width: CELL_SIZE,
        height: CELL_SIZE,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        border: borderStyle,
      };

      if (imgSrc) {
        // If there's an image, render it
        cells.push(
          <div
            key={key}
            style={{
              ...baseStyle,
              overflow: 'hidden',
              backgroundColor: 'white',
            }}
          >
            <img
              src={imgSrc}
              alt={key}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        );
      } else {
        // Otherwise, show gray‐circle placeholder
        cells.push(
          <div
            key={key}
            style={{
              ...baseStyle,
              backgroundColor: '#ddd',
              borderRadius: '50%',
            }}
          />
        );
      }
    }
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${total}, ${CELL_SIZE}px)`,
        gridTemplateRows: `repeat(${total}, ${CELL_SIZE}px)`,
        gap: 1,
      }}
    >
      {cells}
    </div>
  );
};

export default QRMatrixGrid;
