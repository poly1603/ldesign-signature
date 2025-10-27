// Import the web component
import '../src/index';

// Get the signature pad element
const signaturePad = document.getElementById('signature-pad') as any;

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
  if (signaturePad) {
    undoBtn.disabled = !signaturePad.canUndo();
    redoBtn.disabled = !signaturePad.canRedo();
    clearBtn.disabled = signaturePad.isEmpty();
    downloadPngBtn.disabled = signaturePad.isEmpty();
    downloadSvgBtn.disabled = signaturePad.isEmpty();
    downloadJsonBtn.disabled = signaturePad.isEmpty();
  }
}

// Event listeners for signature pad
signaturePad.addEventListener('begin', () => {
  console.log('Drawing started');
});

signaturePad.addEventListener('change', () => {
  updateButtons();
});

signaturePad.addEventListener('end', () => {
  console.log('Drawing ended');
  updateButtons();
});

// Button event listeners
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
  signaturePad.penColor = target.value;
});

minWidthInput.addEventListener('input', (e) => {
  const target = e.target as HTMLInputElement;
  const value = parseFloat(target.value);
  minWidthValue.textContent = value.toFixed(1);
  signaturePad.minWidth = value;
});

maxWidthInput.addEventListener('input', (e) => {
  const target = e.target as HTMLInputElement;
  const value = parseFloat(target.value);
  maxWidthValue.textContent = value.toFixed(1);
  signaturePad.maxWidth = value;
});

smoothAlgorithmSelect.addEventListener('change', (e) => {
  const target = e.target as HTMLSelectElement;
  signaturePad.smoothAlgorithm = target.value;
});

pressureSensitiveInput.addEventListener('change', (e) => {
  const target = e.target as HTMLInputElement;
  signaturePad.pressureSensitive = target.checked;
});

// Initial button state
updateButtons();

console.log('Signature Lit Demo loaded!');
console.log('Signature Pad element:', signaturePad);

