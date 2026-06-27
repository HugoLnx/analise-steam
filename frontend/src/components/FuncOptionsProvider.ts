// (placeholder) Centraliza possíveis fontes de opções para filtros de funcionalidades.
// Por enquanto, usa valores hardcoded mínimos para não quebrar o build.

import type { FuncOptionsByCategory } from './funcTagClauseUtils';


export function getDefaultOptionsByCategory(): FuncOptionsByCategory {
  return {
    features: [],
    multiplayer: [],
    gamepad: [],
    steamdeck: [],
    languages: [],
  };
}


