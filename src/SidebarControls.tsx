// src/SidebarControls.tsx
import React, { useState, useEffect } from 'react';

type Props = {
  /** Which cell is currently selected (format "r,c"), or null if none. */
  selectedCell: string | null;

  /** Upload an image dataURL into exactly one cellKey ("r,c"). */
  onUploadToCell: (cellKey: string, dataUrl: string) => void;

  /** Scale that one cell (value between 50 and 400). */
  onScaleChange: (cellKey: string, scale: number) => void;

  /** Nudge that one cell by (dx,dy) in px. */
  onNudge: (cellKey: string, dx: number, dy: number) => void;

  /** Rotate that one cell to the given angle (0–360). */
  onRotateTo: (cellKey: string, angle: number) => void;

  /** Invert that one cell’s colors. */
  onInvert: (cellKey: string) => void;

  /** Flip that one cell horizontally. */
  onFlipH: (cellKey: string) => void;

  /** Flip that one cell vertically. */
  onFlipV: (cellKey: string) => void;

  /** Remove any image + transforms from that one cell. */
  onResetImage: (cellKey: string) => void;

  /** Current per‐cell state, so the controls can display the right “current value.” */
  cellScales: Record<string, number>;
  cellOffsets: Record<string, { dx: number; dy: number }>;
  cellRotations: Record<string, number>;
  cellInverted: Record<string, boolean>;
  cellFlipH: Record<string, boolean>;
  cellFlipV: Record<string, boolean>;

  /** (Optional stubs for project/save functionality.) */
  onDownloadSnapshot: () => void;
  onNewProject: () => void;
  onSaveAs: (name: string) => void;
  onSaveExisting: () => void;
  onRename: (newName: string) => void;
  projectNames: string[];
  currentProject: string;
  setCurrentProject: (name: string) => void;
  onLoadProject: (name: string) => void;
};

const SidebarControls: React.FC<Props> = ({
  selectedCell,
  onUploadToCell,
  onScaleChange,
  onNudge,
  onRotateTo,
  onInvert,
  onFlipH,
  onFlipV,
  onResetImage,
  cellScales,
  cellOffsets,
  cellRotations,
  cellInverted,
  cellFlipH,
  cellFlipV,
  onDownloadSnapshot,
  onNewProject,
  onSaveAs,
  onSaveExisting,
  onRename,
  projectNames,
  currentProject,
  setCurrentProject,
  onLoadProject,
}) => {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedCell) {
      alert('Please select a cell first.');
      e.target.value = '';
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUploadToCell(selectedCell, reader.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // When user moves any of these sliders/buttons, we immediately call the parent handler.
  const handleScaleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedCell) return;
    onScaleChange(selectedCell, parseInt(e.target.value, 10));
  };
  const handleRotateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedCell) return;
    onRotateTo(selectedCell, parseInt(e.target.value, 10) || 0);
  };
  const handleNudgeUp = () => { if (selectedCell) onNudge(selectedCell, 0, -1); };
  const handleNudgeLeft = () => { if (selectedCell) onNudge(selectedCell, -1, 0); };
  const handleNudgeRight = () => { if (selectedCell) onNudge(selectedCell, 1, 0); };
  const handleNudgeDown = () => { if (selectedCell) onNudge(selectedCell, 0, 1); };
  const handleInvertClick = () => { if (selectedCell) onInvert(selectedCell); };
  const handleFlipHClick = () => { if (selectedCell) onFlipH(selectedCell); };
  const handleFlipVClick = () => { if (selectedCell) onFlipV(selectedCell); };
  const handleResetClick = () => { if (selectedCell) onResetImage(selectedCell); };

  // Grab current per‐cell values (or defaults) so sliders/buttons can show them:
  const currentScale = selectedCell ? cellScales[selectedCell] ?? 100 : 100;
  const currentRotation = selectedCell ? cellRotations[selectedCell] ?? 0 : 0;

  return (
    <div style={{ width: 200, padding: '10px', border: '1px solid #ddd' }}>
      <h3>Image Controls</h3>

      {/* File upload → drops into selected cell */}
      <div style={{ marginBottom: 15 }}>
        <label style={{ display: 'block', marginBottom: 5 }}>
          <strong>Upload Image</strong>
        </label>
        <input type="file" accept="image/*" onChange={handleFile} />
        <small style={{ color: '#666' }}>
          (Click a cell, then pick a file.)
        </small>
      </div>

      {/* Scale slider */}
      <div style={{ marginBottom: 15 }}>
        <label style={{ display: 'block', marginBottom: 5 }}>
          <strong>Scale:</strong> {currentScale}%
        </label>
        <input
          type="range"
          min="50"
          max="400"
          step="1"
          value={currentScale}
          onChange={handleScaleInput}
          style={{ width: '100%' }}
          disabled={!selectedCell}
        />
      </div>

      {/* Nudge buttons */}
      <div style={{ marginBottom: 15 }}>
        <strong>Nudge:</strong>
        <div style={{ display: 'flex', gap: '5px', marginTop: 5 }}>
          <button onClick={handleNudgeUp} disabled={!selectedCell}>↑</button>
          <button onClick={handleNudgeLeft} disabled={!selectedCell}>←</button>
          <button onClick={handleNudgeRight} disabled={!selectedCell}>→</button>
          <button onClick={handleNudgeDown} disabled={!selectedCell}>↓</button>
        </div>
      </div>

      {/* Rotate input */}
      <div style={{ marginBottom: 15 }}>
        <label style={{ display: 'block', marginBottom: 5 }}>
          <strong>Rotate (°):</strong>
        </label>
        <input
          type="number"
          min="0"
          max="360"
          value={currentRotation}
          onChange={handleRotateInput}
          style={{ width: '100%' }}
          disabled={!selectedCell}
        />
      </div>

      {/* Invert / Flip / Reset */}
      <div style={{ marginBottom: 15 }}>
        <button onClick={handleInvertClick} disabled={!selectedCell} style={{ marginRight: 5 }}>
          Invert Colors
        </button>
        <button onClick={handleFlipHClick} disabled={!selectedCell} style={{ marginRight: 5 }}>
          Flip H
        </button>
        <button onClick={handleFlipVClick} disabled={!selectedCell} style={{ marginBottom: 5 }}>
          Flip V
        </button>
        <button
          onClick={handleResetClick}
          disabled={!selectedCell}
          style={{ marginTop: 5, width: '100%', background: '#c33', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          Remove Image
        </button>
      </div>

      <hr />

      {/* (Optional) Project Management Stubs */}
      <div style={{ marginBottom: 15 }}>
        <button onClick={onNewProject} style={{ marginBottom: 8, width: '100%' }}>
          New Project
        </button>
        <button
          onClick={() => {
            const name = prompt('Save As…');
            if (name) onSaveAs(name);
          }}
          style={{ marginBottom: 8, width: '100%' }}
        >
          Save As…
        </button>
        <button onClick={onSaveExisting} style={{ marginBottom: 8, width: '100%' }}>
          Save Existing
        </button>
        <button
          onClick={() => {
            const newName = prompt('Rename Project…');
            if (newName) onRename(newName);
          }}
          style={{ marginBottom: 8, width: '100%' }}
        >
          Rename Project
        </button>

        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>
            <strong>Load Project</strong>
          </label>
          <select
            value={currentProject}
            onChange={e => onLoadProject(e.target.value)}
            style={{ width: '100%' }}
          >
            <option value="">— select —</option>
            {projectNames.map(name => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <button onClick={onDownloadSnapshot} style={{ width: '100%' }}>
          Download Snapshot
        </button>
      </div>
    </div>
  );
};

export default SidebarControls;
