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
}) => {
  // Local state for “Project Name” input
  const [projectNameInput, setProjectNameInput] = useState<string>(currentProject);

  // Sync input whenever currentProject changes
  useEffect(() => {
    setProjectNameInput(currentProject);
  }, [currentProject]);

  // Local state for rotation slider (0–360)
  const [sliderAngle, setSliderAngle] = useState<number>(0);

  // When sliderAngle changes, call onRotateTo
  useEffect(() => {
    onRotateTo(sliderAngle);
  }, [sliderAngle, onRotateTo]);

  // Handle file selection
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

  // When user picks a project from the dropdown
  const handleProjectSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value;
    setCurrentProject(name);
  };

  // “Load” click
  const handleLoadClick = () => {
    if (currentProject) {
      onLoadProject(currentProject);
    }
  };

  // “Save As…” click
  const handleSaveAsClick = () => {
    const name = projectNameInput.trim();
    if (name) {
      onSaveAs(name);
    }
  };

  // “Save” (overwrite)
  const handleSaveExistingClick = () => {
    if (currentProject) {
      onSaveExisting();
    }
  };

  // “Rename” click
  const handleRenameClick = () => {
    const newName = projectNameInput.trim();
    if (currentProject && newName) {
      onRename(newName);
    }
  };

  return (
    <div style={{ width: '100%', boxSizing: 'border-box', padding: '10px 0' }}>
      {/* 
        We use a CSS grid with two columns of equal width.
        Everything up through Brightness stays in the first column;
        everything below moves into the second column.
      */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          columnGap: '20px',
          rowGap: '15px',
        }}
      >
        {/* ───── COLUMN 1 ───── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {/* Upload Image */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              <strong>Upload Image</strong>
            </label>
            <input type="file" accept="image/*" onChange={handleFile} />
          </div>

          {/* Scale (50–400%) */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>
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

          {/* Allow Overflow */}
          <div>
            <label>
              <input
                type="checkbox"
                onChange={e => onToggleOverflow(e.target.checked)}
                style={{ marginRight: '5px' }}
              />
              <strong>Allow Overflow</strong>
            </label>
          </div>

          {/* Nudge */}
          <div>
            <strong>Nudge:</strong>
            <div style={{ marginTop: '5px' }}>
              <button onClick={() => onNudge(0, -1)}>⬆️</button>{' '}
              <button onClick={() => onNudge(-1, 0)}>⬅️</button>{' '}
              <button onClick={() => onNudge(1, 0)}>➡️</button>{' '}
              <button onClick={() => onNudge(0, 1)}>⬇️</button>
            </div>
          </div>

          {/* Rotation (0°–360°) */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              <strong>Rotation (0°–360°)</strong>
            </label>
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              value={sliderAngle}
              onChange={e => setSliderAngle(parseInt(e.target.value, 10))}
              style={{ width: '100%' }}
            />
            <div style={{ marginTop: '5px', textAlign: 'center' }}>
              <span>{sliderAngle}°</span>
            </div>
          </div>

          {/* Saturation (0%–200%) */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>
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

          {/* Hue Rotate (0°–360°) */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>
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

          {/* Opacity (0%–100%) */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>
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

          {/* Brightness (0%–200%) */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>
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
        </div>

        {/* ───── COLUMN 2 ───── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {/* Invert Colors */}
          <div>
            <button onClick={onInvert} style={{ width: '100%' }}>
              Invert Colors
            </button>
          </div>

          {/* Flip Horizontal */}
          <div>
            <button onClick={onFlipH} style={{ width: '100%' }}>
              Flip Horizontal
            </button>
          </div>

          {/* Flip Vertical */}
          <div>
            <button onClick={onFlipV} style={{ width: '100%' }}>
              Flip Vertical
            </button>
          </div>

          {/* Reset Image */}
          <div>
            <button onClick={onResetImage} style={{ width: '100%' }}>
              Reset Image
            </button>
          </div>

          <hr />

          {/* New / Save / Rename Project section */}
          <div>
            <button onClick={onNewProject} style={{ width: '100%', marginBottom: '5px' }}>
              New Project
            </button>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              <strong>Project Name:</strong>
            </label>
            <input
              type="text"
              placeholder="Type or pick a name"
              value={projectNameInput}
              onChange={e => setProjectNameInput(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box' }}
            />
            {currentProject === '' ? (
              <button onClick={handleSaveAsClick} style={{ marginTop: '5px', width: '100%' }}>
                Save As…
              </button>
            ) : (
              <button onClick={handleSaveExistingClick} style={{ marginTop: '5px', width: '100%' }}>
                Save
              </button>
            )}
            {currentProject && (
              <button onClick={handleRenameClick} style={{ marginTop: '5px', width: '100%' }}>
                Rename
              </button>
            )}
          </div>

          {/* Load Existing Project */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              <strong>Load Existing Project</strong>
            </label>
            <select
              value={currentProject}
              onChange={handleProjectSelect}
              style={{ width: '100%', boxSizing: 'border-box' }}
            >
              <option value="">-- select project --</option>
              {projectNames.map(name => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <button onClick={handleLoadClick} style={{ marginTop: '5px', width: '100%' }}>
              Load
            </button>
          </div>

          <hr />

          {/* Download Snapshot */}
          <div>
            <button onClick={onDownloadSnapshot} style={{ width: '100%', background: '#28a745', color: '#fff' }}>
              Download Snapshot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarControls;

