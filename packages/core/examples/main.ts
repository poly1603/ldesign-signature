import { createSignaturePad, SmoothAlgorithm } from '../src/index';

// Create signature pad instance
const canvas = document.getElementById('signature-pad') as HTMLCanvasElement;
const signaturePad = createSignaturePad({
  container: canvas,
  width: 800,
  height: 400,
  penColor: '#000000',
  minWidth: 0.5,
  maxWidth: 2.5,
  pressureSensitive: true,
  smoothAlgorithm: SmoothAlgorithm.CATMULL_ROM,
  onBegin: () => {
    console.log('Drawing started');
  },
  onChange: () => {
    updateButtons();
  },
  onEnd: () => {
    console.log('Drawing ended');
    updateButtons();
  },
});

// Get DOM elements
const undoBtn = document.getElementById('undo') as HTMLButtonElement;
const redoBtn = document.getElementById('redo') as HTMLButtonElement;
const clearBtn = document.getElementById('clear') as HTMLButtonElement;
const downloadPngBtn = document.getElementById('download-png') as HTMLButtonElement;
const downloadSvgBtn = document.getElementById('download-svg') as HTMLButtonElement;
const downloadJsonBtn = document.getElementById('download-json') as HTMLButtonElement;

const penColorInput = document.getElementById('pen-color') as HTMLInputElement;
const minWidthInput = document.getElementById('min-width') as HTMLInputElement;
const maxWidthInput = document.getElementById('max-width') as HTMLInputElement;
const smoothAlgorithmSelect = document.getElementById('smooth-algorithm') as HTMLSelectElement;
const pressureSensitiveInput = document.getElementById('pressure-sensitive') as HTMLInputElement;

const minWidthValue = document.getElementById('min-width-value') as HTMLSpanElement;
const maxWidthValue = document.getElementById('max-width-value') as HTMLSpanElement;

// Update button states
function updateButtons() {
  undoBtn.disabled = !signaturePad.canUndo();
  redoBtn.disabled = !signaturePad.canRedo();
  clearBtn.disabled = signaturePad.isEmpty();
  downloadPngBtn.disabled = signaturePad.isEmpty();
  downloadSvgBtn.disabled = signaturePad.isEmpty();
  downloadJsonBtn.disabled = signaturePad.isEmpty();
}

// Event listeners
undoBtn.addEventListener('click', () => {
  signaturePad.undo();
  updateButtons();
});

redoBtn.addEventListener('click', () => {
  signaturePad.redo();
  updateButtons();
});

clearBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear the signature?')) {
    signaturePad.clear();
    updateButtons();
  }
});

downloadPngBtn.addEventListener('click', () => {
  signaturePad.download('signature.png', 'png');
});

downloadSvgBtn.addEventListener('click', () => {
  signaturePad.download('signature.svg', 'svg');
});

downloadJsonBtn.addEventListener('click', () => {
  signaturePad.download('signature.json', 'json');
});

// Configuration changes
penColorInput.addEventListener('input', (e) => {
  const target = e.target as HTMLInputElement;
  signaturePad.updateConfig({ penColor: target.value });
});

minWidthInput.addEventListener('input', (e) => {
  const target = e.target as HTMLInputElement;
  const value = parseFloat(target.value);
  minWidthValue.textContent = value.toFixed(1);
  signaturePad.updateConfig({ minWidth: value });
});

maxWidthInput.addEventListener('input', (e) => {
  const target = e.target as HTMLInputElement;
  const value = parseFloat(target.value);
  maxWidthValue.textContent = value.toFixed(1);
  signaturePad.updateConfig({ maxWidth: value });
});

smoothAlgorithmSelect.addEventListener('change', (e) => {
  const target = e.target as HTMLSelectElement;
  signaturePad.updateConfig({ smoothAlgorithm: target.value as SmoothAlgorithm });
});

pressureSensitiveInput.addEventListener('change', (e) => {
  const target = e.target as HTMLInputElement;
  signaturePad.updateConfig({ pressureSensitive: target.checked });
});

// Initial button state
updateButtons();

// Responsive canvas
function resizeCanvas() {
  const container = canvas.parentElement;
  if (container) {
    const width = Math.min(800, container.clientWidth - 40);
    const height = Math.min(400, width / 2);
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
  }
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

console.log('Signature Core Demo loaded!');
console.log('Signature Pad instance:', signaturePad);

