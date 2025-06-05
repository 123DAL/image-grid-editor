// src/QRWorkspace.tsx
import React from 'react';
import CustomQREditor from './CustomQREditor';

/**
 * QRWorkspace
 *
 * Right now this just embeds CustomQREditor.
 * Once this is rendering correctly, you can add any extra
 * multi‐cell or “workspace” controls around it.
 */
const QRWorkspace: React.FC = () => {
  return <CustomQREditor />;
};

export default QRWorkspace;

