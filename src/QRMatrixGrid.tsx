import React from 'react';

interface QRMatrixGridProps {
  /** 
   *  QR version (1–10).  
   *  Actual “data area size” = 21 + 4*(version−1).  
   *  We’ll add a 3-cell quiet zone on every side, so total = N + 6. 
   */
  version: number;

  /**
   *  finderData maps "row,col" → dataURL string.  
   *  Any key in finderData (e.g. "3,5") will display that image.  
   *  All other cells show a gray circle placeholder.
   */
  finderData: Record<string, string>;
}

const QRMatrixGrid: React.FC<QRMatrixGridProps> = ({ version, finderData }) => {
  // 1) Compute N = data-area width/height (ignoring quiet zone)
  const N = 21 + 4 * (version - 1);

  // 2) We always reserve a 3-cell “quiet zone” on each edge
  const quiet = 3;

  // 3) Total grid dimension
  const total = N + 2 * quiet;

  // 4) Cell‐size (in px). Adjust as you see fit—or make this a prop if you like.
  const CELL_SIZE = 16;

  // 5) Helper: check if (r,c) is inside one of the three 7×7 finder boxes
  const isInFinder = (r: number, c: number): boolean => {
    // Top‐Left finder runs from [quiet..quiet+6]×[quiet..quiet+6]
    const inTL = r >= quiet && r < quiet + 7 && c >= quiet && c < quiet + 7;
    // Top‐Right finder runs from [quiet..quiet+6]×[quiet+N−7..quiet+N−1]
    const inTR = r >= quiet && r < quiet + 7 && c >= quiet + (N - 7) && c < quiet + N;
    // Bottom‐Left finder runs from [quiet+N−7..quiet+N−1]×[quiet..quiet+6]
    const inBL = r >= quiet + (N - 7) && r < quiet + N && c >= quiet && c < quiet + 7;
    return inTL || inTR || inBL;
  };

  // 6) Helper: check if (r,c) is on the outer border of a finder (to draw a thin red line)
  const isOnFinderEdge = (r: number, c: number): boolean => {
    // We only draw the red outline along the perimeter of each 7×7 finder.
    //   TL perimeter: rows = quiet or quiet+6, cols ∈ [quiet..quiet+6]
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

    //   TR perimeter: rows = quiet or quiet+6, cols ∈ [quiet + N−7..quiet + N−1]
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

    //   BL perimeter: rows = quiet + (N−7) or quiet + (N−1), cols ∈ [quiet..quiet+6]
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

  // 7) Render all rows/columns
  const cells = [];
  for (let r = 0; r < total; r++) {
    for (let c = 0; c < total; c++) {
      const key = `${r},${c}`;
      const imgSrc = finderData[key];

      // Base style for every cell
      const baseStyle: React.CSSProperties = {
        width: CELL_SIZE,
        height: CELL_SIZE,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
      };

      // If the cell has an image in finderData, render that <img>
      if (imgSrc) {
        cells.push(
          <div
            key={key}
            style={{
              ...baseStyle,
              overflow: 'hidden',
              backgroundColor: 'white',
              border: isOnFinderEdge(r, c)
                ? '1px solid red'
                : '1px solid transparent',
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
        // Otherwise, gray‐circle placeholder
        cells.push(
          <div
            key={key}
            style={{
              ...baseStyle,
              backgroundColor: '#ddd',
              borderRadius: '50%',
              border: isOnFinderEdge(r, c)
                ? '1px solid red'
                : '1px solid transparent',
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
