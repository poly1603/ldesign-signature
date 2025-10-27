/**
 * History manager for undo/redo functionality
 */

import { Stroke } from '../types';

/**
 * History Manager
 * Manages undo/redo stacks for signature strokes
 */
export class HistoryManager {
  private undoStack: Stroke[][] = [];
  private redoStack: Stroke[][] = [];
  private maxSize: number;

  constructor(maxSize: number = 50) {
    this.maxSize = maxSize;
  }

  /**
   * Save current state (for undo)
   */
  save(strokes: Stroke[]): void {
    // Deep clone strokes
    const state = strokes.map(stroke => ({
      ...stroke,
      points: [...stroke.points],
    }));

    this.undoStack.push(state);

    // Limit stack size
    if (this.undoStack.length > this.maxSize) {
      this.undoStack.shift();
    }

    // Clear redo stack when new action is performed
    this.redoStack = [];
  }

  /**
   * Undo last action
   * @returns Previous state or null if nothing to undo
   */
  undo(): Stroke[] | null {
    if (this.undoStack.length === 0) return null;

    const currentState = this.undoStack.pop()!;
    this.redoStack.push(currentState);

    // Return previous state (or empty if no more states)
    if (this.undoStack.length === 0) {
      return [];
    }

    return this.cloneStrokes(this.undoStack[this.undoStack.length - 1]);
  }

  /**
   * Redo last undone action
   * @returns Next state or null if nothing to redo
   */
  redo(): Stroke[] | null {
    if (this.redoStack.length === 0) return null;

    const nextState = this.redoStack.pop()!;
    this.undoStack.push(nextState);

    return this.cloneStrokes(nextState);
  }

  /**
   * Check if can undo
   */
  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  /**
   * Check if can redo
   */
  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  /**
   * Clear all history
   */
  clear(): void {
    this.undoStack = [];
    this.redoStack = [];
  }

  /**
   * Get current history size
   */
  getHistorySize(): number {
    return this.undoStack.length;
  }

  /**
   * Clone strokes array
   */
  private cloneStrokes(strokes: Stroke[]): Stroke[] {
    return strokes.map(stroke => ({
      ...stroke,
      points: [...stroke.points],
    }));
  }

  /**
   * Set max history size
   */
  setMaxSize(maxSize: number): void {
    this.maxSize = maxSize;

    // Trim stacks if needed
    while (this.undoStack.length > maxSize) {
      this.undoStack.shift();
    }
    while (this.redoStack.length > maxSize) {
      this.redoStack.shift();
    }
  }
}

