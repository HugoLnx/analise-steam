// (placeholder) Centraliza possíveis fontes de opções para filtros de funcionalidades.
// Por enquanto, usa valores hardcoded mínimos para não quebrar o build.

import type { FuncOptionsByCategory } from './funcTagClauseUtils';


export async function fetchOptionsByCategory(): Promise<FuncOptionsByCategory> {
  // Load options from backend so dropdowns are populated.
  // We fallback to empty arrays to avoid breaking the UI.
  try {
    const resp = await fetch('http://localhost:8000/api/func_options/');
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return (await resp.json()) as FuncOptionsByCategory;
  } catch (e) {
    console.error('Error fetching func options', e);
    return {
      features: [],
      multiplayer: [],
      gamepad: [],
      steamdeck: [],
      languages: [],
    };
  }
}





