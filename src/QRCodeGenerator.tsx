import React, { useEffect, useRef, useState } from 'react';
import QRCodeStyling from 'qr-code-styling';

// We create a single QRCodeStyling instance and update it whenever inputs change:
const qrCode = new QRCodeStyling({
  width: 256,
  height: 256,
  margin: 0,
  data: '',
  qrOptions: {
    typeNumber: 1,           // version 1 by default
    mode: 'Byte',
    errorCorrectionLevel: 'M',
  },
  dotsOptions: {
    color: '#000000',
    type: 'square',
  },
  cornersSquareOptions: {
    color: '#000000',
    type: 'square',
  },
  cornersDotOptions: {
    color: '#000000',
    type: 'dot',
  },
  backgroundOptions: {
    color: '#ffffff',
  },
});

const QRCodeGenerator: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [version, setVersion] = useState<number>(1);
  const [moduleStyle, setModuleStyle] = useState<string>('square');
  const [finderStyle, setFinderStyle] = useState<string>('square');
  const ref = useRef<HTMLDivElement>(null);

  // On any change, update the QR code config and re-render inside our container
  useEffect(() => {
    qrCode.update({
      data: inputValue,
      // Cast version to any so TS doesn’t complain
      qrOptions: { typeNumber: version as any },
      dotsOptions: { type: moduleStyle as any },
      cornersSquareOptions: { type: finderStyle as any },
    });

    if (ref.current) {
      ref.current.innerHTML = '';
      qrCode.append(ref.current);
    }
  }, [inputValue, version, moduleStyle, finderStyle]);

  const downloadPNG = async () => {
    await qrCode.download({ name: 'qr-code', extension: 'png' });
  };

  const downloadSVG = () => {
    qrCode.download({ name: 'qr-code', extension: 'svg' });
  };

  return (
    <div style={{ padding: 20, maxWidth: 360, margin: '0 auto' }}>
      <h2>QR Code Generator</h2>

      {/* Text/URL input */}
      <div style={{ marginBottom: 12 }}>
        <label htmlFor="qr-input" style={{ display: 'block', marginBottom: '4px' }}>
          <strong>Enter text or URL:</strong>
        </label>
        <input
          id="qr-input"
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="https://example.com"
          style={{ width: '100%', padding: 6, fontSize: '1rem', boxSizing: 'border-box' }}
        />
      </div>

      {/* Version selector (1–10) */}
      <div style={{ marginBottom: 12 }}>
        <label htmlFor="version-select" style={{ display: 'block', marginBottom: '4px' }}>
          <strong>Version (1–10):</strong>
        </label>
        <select
          id="version-select"
          value={version}
          onChange={e => setVersion(parseInt(e.target.value, 10))}
          style={{ width: '100%', padding: 6, fontSize: '1rem', boxSizing: 'border-box' }}
        >
          {Array.from({ length: 10 }, (_, i) => i + 1).map(v => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>

      {/* Module style: square or dots */}
      <div style={{ marginBottom: 12 }}>
        <label htmlFor="module-style" style={{ display: 'block', marginBottom: '4px' }}>
          <strong>Module style:</strong>
        </label>
        <select
          id="module-style"
          value={moduleStyle}
          onChange={e => setModuleStyle(e.target.value)}
          style={{ width: '100%', padding: 6, fontSize: '1rem', boxSizing: 'border-box' }}
        >
          <option value="square">Square</option>
          <option value="dots">Dots</option>
          <option value="rounded">Rounded</option>
          <option value="extra-rounded">Extra Rounded</option>
          <option value="classy">Classy</option>
          <option value="classy-rounded">Classy Rounded</option>
        </select>
      </div>

      {/* Finder style: square or dot */}
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="finder-style" style={{ display: 'block', marginBottom: '4px' }}>
          <strong>Finder style:</strong>
        </label>
        <select
          id="finder-style"
          value={finderStyle}
          onChange={e => setFinderStyle(e.target.value)}
          style={{ width: '100%', padding: 6, fontSize: '1rem', boxSizing: 'border-box' }}
        >
          <option value="square">Square</option>
          <option value="dot">Dot</option>
          <option value="rounded">Rounded</option>
          <option value="extra-rounded">Extra Rounded</option>
        </select>
      </div>

      {/* QR preview container */}
      <div
        ref={ref}
        style={{
          padding: 10,
          background: '#ffffff',
          display: 'inline-block',
          border: '1px solid #ccc',
          marginBottom: 16,
        }}
      />

      {/* Download buttons */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={downloadPNG}
          disabled={inputValue.trim() === ''}
          style={{
            flex: 1,
            padding: '8px 0',
            fontSize: '1rem',
            cursor: inputValue.trim() === '' ? 'not-allowed' : 'pointer',
          }}
        >
          Download PNG
        </button>
        <button
          onClick={downloadSVG}
          disabled={inputValue.trim() === ''}
          style={{
            flex: 1,
            padding: '8px 0',
            fontSize: '1rem',
            cursor: inputValue.trim() === '' ? 'not-allowed' : 'pointer',
          }}
        >
          Download SVG
        </button>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
