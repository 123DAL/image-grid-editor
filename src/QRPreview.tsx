// src/QRPreview.tsx
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

type Props = {
  value: string;
  roundFinders: boolean;
};

const QRPreview: React.FC<Props> = ({ value, roundFinders }) => {
  return (
    <div style={{ padding: 20 }}>
      <QRCodeSVG
        value={value}
        size={280}
        level="H"
        fgColor="#000000"
        bgColor="#ffffff"
        style={{ borderRadius: roundFinders ? 20 : 0 }}
      />
      <div style={{ marginTop: 10 }}>
        <strong>Finders:</strong> {roundFinders ? 'Round' : 'Square'}
      </div>
    </div>
  );
};

export default QRPreview;
