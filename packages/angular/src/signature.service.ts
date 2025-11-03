import { Injectable } from '@angular/core'
import type { SignatureInstance } from '@ldesign/signature-core'
import { createSignaturePad } from '@ldesign/signature-core'
import { BehaviorSubject, Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class SignatureService {
  private instances = new Map<string, SignatureInstance>()
  private states = new Map<string, BehaviorSubject<SignatureState>>()

  createSignature(id: string, canvas: HTMLCanvasElement, config?: any): SignatureInstance {
    if (this.instances.has(id)) {
      throw new Error(`Signature with id "${id}" already exists`)
    }

    const instance = createSignaturePad(canvas, config)
    this.instances.set(id, instance)

    const state$ = new BehaviorSubject<SignatureState>({
      isEmpty: true,
      canUndo: false,
      canRedo: false,
    })
    this.states.set(id, state$)

    return instance
  }

  getInstance(id: string): SignatureInstance | undefined {
    return this.instances.get(id)
  }

  getState$(id: string): Observable<SignatureState> | undefined {
    return this.states.get(id)?.asObservable()
  }

  updateState(id: string, instance: SignatureInstance): void {
    const state$ = this.states.get(id)
    if (state$ && instance) {
      state$.next({
        isEmpty: instance.isEmpty(),
        canUndo: instance.canUndo(),
        canRedo: instance.canRedo(),
      })
    }
  }

  destroySignature(id: string): void {
    const instance = this.instances.get(id)
    if (instance) {
      instance.destroy()
      this.instances.delete(id)
    }

    const state$ = this.states.get(id)
    if (state$) {
      state$.complete()
      this.states.delete(id)
    }
  }

  destroyAll(): void {
    this.instances.forEach(instance => instance.destroy())
    this.instances.clear()

    this.states.forEach(state$ => state$.complete())
    this.states.clear()
  }
}

export interface SignatureState {
  isEmpty: boolean
  canUndo: boolean
  canRedo: boolean
}
