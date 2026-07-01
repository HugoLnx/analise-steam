export type FuncCategory =
  | 'features'
  | 'multiplayer'
  | 'gamepad'
  | 'steamdeck'
  | 'languages';

export type ClauseType = 'INCLUDE_AND' | 'INCLUDE_OR' | 'EXCLUDE_AND' | 'EXCLUDE_OR';

export interface FuncTagClause {
  id: string;
  type: ClauseType;
  category: FuncCategory;
  values: string[];
}

export type FuncOptionsByCategory = Record<FuncCategory, string[]>;

export function buildTagToken(category: FuncCategory, value: string) {
  return `${category}:${value}`;
}

export function funcClauseToFilterTags(clause: FuncTagClause) {
  if (!clause.values.length) return '';
  return `${clause.type} ${clause.values.map((v) => buildTagToken(clause.category, v)).join(',')}`;
}


