import qrcode from 'qrcode-generator';

/**
* Generate a full QR matrix (including quiet zone) from a given version, level, and string.
* @returns boolean[][] where true = dark, false = light
*/
export function generateQRMatrix(
  version: number,
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H',
  data: string
): boolean[][] {
  const qr = qrcode(version as any , errorCorrectionLevel);
  qr.addData(data);
  qr.make();

  const size = qr.getModuleCount(); // e.g., 25 for version 2
  const baseMatrix: boolean[][] = [];

  for (let row = 0; row < size; row++) {
    const rowData: boolean[] = [];
    for (let col = 0; col < size; col++) {
      rowData.push(qr.isDark(row, col));
    }
    baseMatrix.push(rowData);
  }

  // Add quiet zone (4 rows/columns of false)
  const quiet = 4;
  const fullSize = size + quiet * 2;

  const fullMatrix: boolean[][] = Array.from({ length: fullSize }, (_, r) =>
    Array.from({ length: fullSize }, (_, c) => {
      if (
        r >= quiet &&
        r < quiet + size &&
        c >= quiet &&
        c < quiet + size
      ) {
        return baseMatrix[r - quiet][c - quiet];
      } else {
        return false; // quiet zone (white)
      }
    })
  );

  return fullMatrix;
}
