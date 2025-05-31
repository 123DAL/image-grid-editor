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
}) => {
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
    </div>
  );
};

export default SidebarControls;

