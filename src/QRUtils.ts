// src/QRUtils.ts

export function generateQRMatrix(
  version: number,
  errorCorrectionLevel: string,
  data: string
): boolean[][] {
  const size = 7; // dummy fixed size for now
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => false)
  );
}

