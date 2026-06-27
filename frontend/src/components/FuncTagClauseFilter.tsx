import { Plus, Trash2, Check, X } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { MultiSelectDropdown } from './MultiSelectDropdown';
import type { ClauseType, FuncCategory, FuncTagClause, FuncOptionsByCategory } from './funcTagClauseUtils';

interface FuncTagClauseFilterProps {
  optionsByCategory: FuncOptionsByCategory;
  clauses: FuncTagClause[];
  onChange: (clauses: FuncTagClause[]) => void;
}

const clauseTypeLabels: Record<ClauseType, string> = {
  INCLUDE_AND: 'Include AND',
  INCLUDE_OR: 'Include OR',
  EXCLUDE_AND: 'Exclude AND',
  EXCLUDE_OR: 'Exclude OR',
};

const clauseTypeShortLabels: Record<ClauseType, string> = {
  INCLUDE_AND: 'AND',
  INCLUDE_OR: 'OR',
  EXCLUDE_AND: 'NOT AND',
  EXCLUDE_OR: 'NOT OR',
};

const categoryLabels: Record<FuncCategory, string> = {
  features: 'Features',
  multiplayer: 'Multiplayer',
  gamepad: 'Gamepad',
  steamdeck: 'Steam Deck',
  languages: 'Languages',
};

export function FuncTagClauseFilter({ optionsByCategory, clauses, onChange }: FuncTagClauseFilterProps) {

  const [editingId, setEditingId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(() => Object.keys(optionsByCategory) as FuncCategory[], [optionsByCategory]);

  const addClause = () => {
    const firstCategory = categories[0] ?? 'features';
    const newClause: FuncTagClause = {
      id: Date.now().toString(),
      type: 'INCLUDE_AND',
      category: firstCategory,
      values: [],
    };
    onChange([...clauses, newClause]);
    setEditingId(newClause.id);
  };

  const removeClause = (id: string) => {
    onChange(clauses.filter((c) => c.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const updateClauseType = (id: string, type: ClauseType) => {
    onChange(clauses.map((c) => (c.id === id ? { ...c, type } : c)));
  };

  const updateClauseCategory = (id: string, category: FuncCategory) => {
    onChange(clauses.map((c) => (c.id === id ? { ...c, category, values: [] } : c)));
  };

  const updateClauseValues = (id: string, values: string[]) => {
    onChange(clauses.map((c) => (c.id === id ? { ...c, values } : c)));
  };

  return (
    <div className="filter-group tag-clause-container" ref={containerRef}>
      <div className="clause-header">
        <label className="filter-label">Function Clauses</label>
        <button onClick={addClause} className="btn-add-clause">
          <Plus size={14} />
          Add
        </button>
      </div>

      <div className="clauses-chips-container">
        {clauses.map((clause) => {
          const isEditing = editingId === clause.id;

          if (isEditing) {
            return (
              <div key={clause.id} className="clause-edit-bubble">
                <div className="clause-edit-row">
                  <select
                    value={clause.type}
                    onChange={(e) => updateClauseType(clause.id, e.target.value as ClauseType)}
                    className="clause-type-select-compact"
                  >
                    {Object.entries(clauseTypeLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={clause.category}
                    onChange={(e) => updateClauseCategory(clause.id, e.target.value as FuncCategory)}
                    className="clause-type-select-compact"
                    title="Categoria"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {categoryLabels[cat]}
                      </option>
                    ))}
                  </select>

                  <MultiSelectDropdown
                    label={categoryLabels[clause.category]}
                    options={optionsByCategory[clause.category]}
                    selectedValues={clause.values}
                    onChange={(values) => updateClauseValues(clause.id, values)}
                    placeholder="Select..."
                    hideLabel
                  />

                  <div className="clause-edit-actions">
                    <button
                      onClick={() => setEditingId(null)}
                      className="btn-done-clause"
                      title="Done"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={() => removeClause(clause.id)}
                      className="btn-remove-clause-compact"
                      title="Remove"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          const preview = clause.values.length > 0 ? clause.values.join(', ') : 'Empty';

          return (
            <div
              key={clause.id}
              className={`clause-summary-chip ${clause.type.startsWith('EXCLUDE') ? 'exclude' : ''}`}
              onClick={() => setEditingId(clause.id)}
            >
              <span className="clause-type-badge">{clauseTypeShortLabels[clause.type]}</span>
              <span className="clause-tags-preview">
                {categoryLabels[clause.category]}: {preview}
              </span>
              <button
                className="clause-chip-remove"
                onClick={(e) => {
                  e.stopPropagation();
                  removeClause(clause.id);
                }}
              >
                <X size={12} />
              </button>
            </div>
          );
        })}

        {clauses.length === 0 && <div className="empty-clauses-mini">No clauses.</div>}
      </div>


    </div>
  );
}


