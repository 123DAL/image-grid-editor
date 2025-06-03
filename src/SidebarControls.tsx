import React, { useState, useEffect } from 'react';

type Props = {
  onUpload: (dataUrl: string) => void;
  onScaleChange: (scale: number) => void;
  onToggleOverflow: (allow: boolean) => void;
  onNudge: (dx: number, dy: number) => void;
  onRotateTo: (angle: number) => void;
  onSaturationChange: (saturation: number) => void;
  onHueChange: (hue: number) => void;
  onOpacityChange: (opacity: number) => void;
  onBrightnessChange: (brightness: number) => void;
  onInvert: () => void;
  onFlipH: () => void;
  onFlipV: () => void;
  onResetImage: () => void;
  onDownloadSnapshot: () => void;
  onNewProject: () => void;
  onSaveAs: (name: string) => void;
  onSaveExisting: () => void;
  onRename: (newName: string) => void;
  projectNames: string[];
  currentProject: string;
  setCurrentProject: (name: string) => void;
  onLoadProject: (name: string) => void;
  onShowQR: () => void;

  // New prop for zone-border configurations:
  onBorderConfigChange: (config: {
    zone: 'all' | 'quiet' | 'outerFinder' | 'innerFinder' | 'none';
    width: number;
    color: string;
  }) => void;
};

const SidebarControls: React.FC<Props> = ({
  onUpload,
  onScaleChange,
  onToggleOverflow,
  onNudge,
  onRotateTo,
  onSaturationChange,
  onHueChange,
  onOpacityChange,
  onBrightnessChange,
  onInvert,
  onFlipH,
  onFlipV,
  onResetImage,
  onDownloadSnapshot,
  onNewProject,
  onSaveAs,
  onSaveExisting,
  onRename,
  projectNames,
  currentProject,
  setCurrentProject,
  onLoadProject,
  onShowQR,
  onBorderConfigChange, // New
}) => {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUpload(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Local state for the “Zone Border Settings” controls:
  const [selectedZone, setSelectedZone] = useState<
    'all' | 'quiet' | 'outerFinder' | 'innerFinder' | 'none'
  >('all');
  const [borderWidth, setBorderWidth] = useState<number>(1);
  const [borderColor, setBorderColor] = useState<string>('#000000');

  // Notify parent whenever zone, width, or color changes:
  useEffect(() => {
    onBorderConfigChange({
      zone: selectedZone,
      width: borderWidth,
      color: borderColor,
    });
  }, [selectedZone, borderWidth, borderColor, onBorderConfigChange]);

  return (
    <div style={{ width: 200, padding: '10px', border: '1px solid #ddd' }}>
      <h3>Controls</h3>

      {/* Image Upload */}
      <div style={{ marginBottom: 15 }}>
        <label style={{ display: 'block', marginBottom: 5 }}>
          <strong>Upload Image</strong>
        </label>
        <input type="file" accept="image/*" onChange={handleFile} />
      </div>

      {/* Scale Slider */}
      <div style={{ marginBottom: 15 }}>
        <label style={{ display: 'block', marginBottom: 5 }}>
          <strong>Scale</strong> (50%–400%)
        </label>
        <input
          type="range"
          min="50"
          max="400"
          step="1"
          defaultValue="100"
          onChange={e => onScaleChange(parseInt(e.target.value, 10))}
          style={{ width: '100%' }}
        />
      </div>

      {/* Overflow Toggle */}
      <div style={{ marginBottom: 15 }}>
        <label>
          <input
            type="checkbox"
            onChange={e => onToggleOverflow(e.target.checked)}
          />{' '}
          Allow Overflow
        </label>
      </div>

      {/* Nudge Buttons */}
      <div style={{ marginBottom: 15 }}>
        <strong>Nudge:</strong>
        <div style={{ display: 'flex', gap: '5px', marginTop: 5 }}>
          <button onClick={() => onNudge(0, -1)}>↑</button>
          <button onClick={() => onNudge(-1, 0)}>←</button>
          <button onClick={() => onNudge(1, 0)}>→</button>
          <button onClick={() => onNudge(0, 1)}>↓</button>
        </div>
      </div>

      {/* Rotate to Angle */}
      <div style={{ marginBottom: 15 }}>
        <label style={{ display: 'block', marginBottom: 5 }}>
          <strong>Rotate To (0–360°)</strong>
        </label>
        <input
          type="number"
          min="0"
          max="360"
          defaultValue="0"
          onChange={e => onRotateTo(parseInt(e.target.value, 10) || 0)}
          style={{ width: '100%' }}
        />
      </div>

      {/* Saturation Slider */}
      <div style={{ marginBottom: 15 }}>
        <label style={{ display: 'block', marginBottom: 5 }}>
          <strong>Saturation</strong> (0%–200%)
        </label>
        <input
          type="range"
          min="0"
          max="200"
          step="1"
          defaultValue="100"
          onChange={e => onSaturationChange(parseInt(e.target.value, 10))}
          style={{ width: '100%' }}
        />
      </div>

      {/* Hue Rotation Slider */}
      <div style={{ marginBottom: 15 }}>
        <label style={{ display: 'block', marginBottom: 5 }}>
          <strong>Hue Rotate</strong> (0°–360°)
        </label>
        <input
          type="range"
          min="0"
          max="360"
          step="1"
          defaultValue="0"
          onChange={e => onHueChange(parseInt(e.target.value, 10))}
          style={{ width: '100%' }}
        />
      </div>

      {/* Opacity Slider */}
      <div style={{ marginBottom: 15 }}>
        <label style={{ display: 'block', marginBottom: 5 }}>
          <strong>Opacity</strong> (0%–100%)
        </label>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          defaultValue="100"
          onChange={e => onOpacityChange(parseInt(e.target.value, 10))}
          style={{ width: '100%' }}
        />
      </div>

      {/* Brightness Slider */}
      <div style={{ marginBottom: 15 }}>
        <label style={{ display: 'block', marginBottom: 5 }}>
          <strong>Brightness</strong> (0%–200%)
        </label>
        <input
          type="range"
          min="0"
          max="200"
          step="1"
          defaultValue="100"
          onChange={e => onBrightnessChange(parseInt(e.target.value, 10))}
          style={{ width: '100%' }}
        />
      </div>

      {/* Invert / Flip / Reset */}
      <div style={{ marginBottom: 15 }}>
        <button onClick={onInvert} style={{ marginRight: 5 }}>
          Invert Colors
        </button>
        <button onClick={onFlipH} style={{ marginRight: 5 }}>
          Flip H
        </button>
        <button onClick={onFlipV} style={{ marginRight: 5 }}>
          Flip V
        </button>
        <button onClick={onResetImage} style={{ marginTop: 5, width: '100%' }}>
          Reset Image
        </button>
      </div>

      {/* Download Snapshot */}
      <div style={{ marginBottom: 15 }}>
        <button onClick={onDownloadSnapshot} style={{ width: '100%' }}>
          Download PNG
        </button>
      </div>

      {/* Project Management */}
      <div style={{ marginBottom: 15 }}>
        <button onClick={onNewProject} style={{ marginBottom: 8, width: '100%' }}>
          New Project
        </button>

        <button
          onClick={() => {
            const name = prompt('Enter a name for this project:');
            if (name !== null) onSaveAs(name);
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
            const newName = prompt('Enter new name for this project:');
            if (newName !== null) onRename(newName);
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

        <button onClick={onShowQR} style={{ width: '100%' }}>
          Generate QR Code
        </button>
      </div>

      {/* ── NEW: Zone Border Settings ── */}
      <div style={{ marginBottom: 15, borderTop: '1px solid #ccc', paddingTop: 10 }}>
        <h4>Zone Border Settings</h4>

        <div style={{ marginBottom: 8 }}>
          <label>
            <strong>Zone:</strong>
            <select
              value={selectedZone}
              onChange={e =>
                setSelectedZone(
                  e.target.value as 'all' | 'quiet' | 'outerFinder' | 'innerFinder' | 'none'
                )
              }
              style={{ marginLeft: 5, width: '100%' }}
            >
              <option value="all">All Cells</option>
              <option value="quiet">Quiet Zone</option>
              <option value="outerFinder">Outer Finder (7×7)</option>
              <option value="innerFinder">Inner Finder (3×3)</option>
              <option value="none">No Border</option>
            </select>
          </label>
        </div>

        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>
            <strong>Width:</strong> {borderWidth}px
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={borderWidth}
            onChange={e => setBorderWidth(parseInt(e.target.value, 10))}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>
            <strong>Color:</strong>
          </label>
          <input
            type="color"
            value={borderColor}
            onChange={e => setBorderColor(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>
      </div>
    </div>
  );
};

export default SidebarControls;
