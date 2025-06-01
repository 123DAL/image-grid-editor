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

  onDownloadSnapshot: () => void; // new

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
  // Local state for “Project Name” input (used for Save As, Save, Rename)
  const [projectNameInput, setProjectNameInput] = useState<string>(currentProject);

  // Whenever currentProject changes (e.g. via Load), sync it to the input
  useEffect(() => {
    setProjectNameInput(currentProject);
  }, [currentProject]);

  // Local state to track the slider’s angle (0–360)
  const [sliderAngle, setSliderAngle] = useState<number>(0);

  // Whenever sliderAngle changes, call onRotateTo
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

  // When user selects a project from dropdown
  const handleProjectSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value;
    setCurrentProject(name);
  };

  // When user clicks “Load”
  const handleLoadClick = () => {
    if (currentProject) {
      onLoadProject(currentProject);
    }
  };

  // When user clicks “Save As…”
  const handleSaveAsClick = () => {
    const nameToSave = projectNameInput.trim();
    if (nameToSave) {
      onSaveAs(nameToSave);
    }
  };

  // When user clicks “Save” (overwrite existing)
  const handleSaveExistingClick = () => {
    if (currentProject) {
      onSaveExisting();
    }
  };

  // When user clicks “Rename”
  const handleRenameClick = () => {
    const newName = projectNameInput.trim();
    if (currentProject && newName) {
      onRename(newName);
    }
  };

  return (
    <div style={{ width: 200, padding: '10px', border: '1px solid #ddd' }}>
      <h3>Controls</h3>

      <div style={{ marginBottom: 15 }}>
        <label style={{ display: 'block', marginBottom: 5 }}>
          <strong>Upload Image</strong>
        </label>
        <input type="file" accept="image/*" onChange={handleFile} />
      </div>

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

      <div style={{ marginBottom: 15 }}>
        <label>
          <input
            type="checkbox"
            onChange={e => onToggleOverflow(e.target.checked)}
            style={{ marginRight: 5 }}
          />
          <strong>Allow Overflow</strong>
        </label>
      </div>

      <div style={{ marginBottom: 15 }}>
        <strong>Nudge:</strong>
        <div style={{ marginTop: 5 }}>
          <button onClick={() => onNudge(0, -1)}>⬆️</button>{' '}
          <button onClick={() => onNudge(-1, 0)}>⬅️</button>{' '}
          <button onClick={() => onNudge(1, 0)}>➡️</button>{' '}
          <button onClick={() => onNudge(0, 1)}>⬇️</button>
        </div>
      </div>

      <div style={{ marginBottom: 15 }}>
        <label style={{ display: 'block', marginBottom: 5 }}>
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
        <div style={{ marginTop: 5, textAlign: 'center' }}>
          <span>{sliderAngle}°</span>
        </div>
      </div>

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

      <div style={{ marginBottom: 15 }}>
        <button onClick={onInvert} style={{ width: '100%' }}>
          Invert Colors
        </button>
      </div>

      <div style={{ marginBottom: 15 }}>
        <button onClick={onFlipH} style={{ width: '100%' }}>
          Flip Horizontal
        </button>
      </div>

      <div style={{ marginBottom: 15 }}>
        <button onClick={onFlipV} style={{ width: '100%' }}>
          Flip Vertical
        </button>
      </div>

      <div style={{ marginBottom: 15 }}>
        <button onClick={onResetImage} style={{ width: '100%' }}>
          Reset Image
        </button>
      </div>

      <hr />

      {/* PROJECT MANAGEMENT SECTION */}
      <div style={{ marginBottom: 10 }}>
        <button onClick={onNewProject} style={{ width: '100%', marginBottom: 5 }}>
          New Project
        </button>
        <label htmlFor="projectNameInput" style={{ display: 'block', marginBottom: 5 }}>
          <strong>Project Name:</strong>
        </label>
        <input
          id="projectNameInput"
          type="text"
          placeholder="Type or pick a name"
          value={projectNameInput}
          onChange={e => setProjectNameInput(e.target.value)}
          style={{ width: '100%', boxSizing: 'border-box' }}
        />
        {currentProject === '' ? (
          <button
            onClick={handleSaveAsClick}
            style={{ marginTop: 5, width: '100%' }}
          >
            Save As…
          </button>
        ) : (
          <button
            onClick={handleSaveExistingClick}
            style={{ marginTop: 5, width: '100%' }}
          >
            Save
          </button>
        )}
        {currentProject && (
          <button
            onClick={handleRenameClick}
            style={{ marginTop: 5, width: '100%' }}
          >
            Rename
          </button>
        )}
      </div>

      <div style={{ marginTop: 20, marginBottom: 20 }}>
        <label htmlFor="projectSelect" style={{ display: 'block', marginBottom: 5 }}>
          <strong>Load Existing Project</strong>
        </label>
        <select
          id="projectSelect"
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
        <button
          onClick={handleLoadClick}
          style={{ marginTop: 5, width: '100%' }}
        >
          Load
        </button>
      </div>

      <hr />

      <div>
        <button onClick={onDownloadSnapshot} style={{ width: '100%', background: '#28a745', color: '#fff' }}>
          Download Snapshot
        </button>
      </div>
    </div>
  );
};

export default SidebarControls;

