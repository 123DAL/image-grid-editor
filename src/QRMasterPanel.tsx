import React, { useEffect, useState } from 'react';
import { generateQRMatrix } from './QRUtils';
import './QRMasterPanel.css'; // Optional: for better styling

const QRMasterPanel: React.FC = () => {
  const [matrix, setMatrix] = useState<boolean[][]>([]);
  const [data, setData] = useState('iqr.art');
  const [style, setStyle] = useState<'dot' | 'circle' | 'square'>('dot');

  // Load QR matrix
  useEffect(() => {
    const qr = generateQRMatrix(2, 'M', data);
    setMatrix(qr);
  }, [data]);

  // Toggle a single cell
  const toggleCell = (row: number, col: number) => {
    const newMatrix = matrix.map((r, ri) =>
      r.map((val, ci) => (ri === row && ci === col ? !val : val))
    );
    setMatrix(newMatrix);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>QR Code Generator</h2>

      <div style={{ marginBottom: 12 }}>
        <input
          value={data}
          onChange={(e) => setData(e.target.value)}
          placeholder="Enter QR data"
          style={{ fontSize: 16, padding: 4 }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label>Select Dot Style:</label>{' '}
        <select value={style} onChange={(e) => setStyle(e.target.value as any)}>
          <option value="dot">Dot</option>
          <option value="circle">Circle</option>
          <option value="square">Square</option>
        </select>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${matrix[0]?.length || 0}, 20px)`,
          gap: 1,
        }}
      >
        {matrix.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              onClick={() => toggleCell(r, c)}
              style={{
                width: 20,
                height: 20,
                backgroundColor: cell ? 'black' : 'white',
                borderRadius:
                  style === 'circle' ? '50%' : style === 'dot' ? '40%' : '0%',
                border: '1px solid #ddd',
                cursor: 'pointer',
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default QRMasterPanel;
