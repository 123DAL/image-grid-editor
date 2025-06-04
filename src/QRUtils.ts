// src/QRUtils.ts

import qrcodeFactory from 'qrcode-generator';

type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export function generateQRMatrix(
  version: number,
  errorCorrection: ErrorCorrectionLevel,
  dataString: string
): boolean[][] {
  const qr: any = (qrcodeFactory as any)(version, errorCorrection);
  qr.addData(dataString);
  qr.make();

  const matrixSize = qr.getModuleCount();
  const result: boolean[][] = [];
  for (let r = 0; r < matrixSize; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < matrixSize; c++) {
      row.push(qr.isDark(r, c));
    }
    result.push(row);
  }
  return result;
}

