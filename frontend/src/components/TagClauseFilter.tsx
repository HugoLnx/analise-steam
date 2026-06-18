import { Plus, Trash2, Check, X } from 'lucide-react';
import { useState, useRef } from 'react';
import { MultiSelectDropdown } from './MultiSelectDropdown';

export type ClauseType = 'INCLUDE_AND' | 'INCLUDE_OR' | 'EXCLUDE_AND' | 'EXCLUDE_OR';

export interface TagClause {
  id: string;
  type: ClauseType;
  tags: string[];
}

interface TagClauseFilterProps {
  availableTags: string[];
  clauses: TagClause[];
  onChange: (clauses: TagClause[]) => void;
}

const clauseTypeLabels: Record<ClauseType, string> = {
  INCLUDE_AND: 'Include AND',
  INCLUDE_OR: 'Include OR',
  EXCLUDE_AND: 'Exclude AND',
  EXCLUDE_OR: 'Exclude OR'
};

const clauseTypeShortLabels: Record<ClauseType, string> = {
  INCLUDE_AND: 'AND',
  INCLUDE_OR: 'OR',
  EXCLUDE_AND: 'NOT AND',
  EXCLUDE_OR: 'NOT OR'
};

export function TagClauseFilter({ availableTags, clauses, onChange }: TagClauseFilterProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const addClause = () => {
    const newClause: TagClause = {
      id: Date.now().toString(),
      type: 'INCLUDE_AND',
      tags: []
    };
    onChange([...clauses, newClause]);
    setEditingId(newClause.id);
  };

  const removeClause = (id: string) => {
    onChange(clauses.filter(c => c.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const updateClauseType = (id: string, type: ClauseType) => {
    onChange(clauses.map(c => c.id === id ? { ...c, type } : c));
  };

  const updateClauseTags = (id: string, tags: string[]) => {
    onChange(clauses.map(c => c.id === id ? { ...c, tags } : c));
  };

  return (
    <div className="filter-group tag-clause-container" ref={containerRef}>
      <div className="clause-header">
        <label className="filter-label">Tag Clauses</label>
        <button
          onClick={addClause}
          className="btn-add-clause"
        >
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
                  
                  <MultiSelectDropdown
                    label="Tags"
                    options={availableTags}
                    selectedValues={clause.tags}
                    onChange={(tags) => updateClauseTags(clause.id, tags)}
                    placeholder="Tags..."
                    hideLabel
                  />
                  
                  {/* TODO: #31 - Conectar este dropdown de Features a uma lista ou estado contendo apenas as funcionalidades dos jogos */}
                  {/* TODO: #31 - Atualizar o gerenciamento de estado para salvar de forma separada das tags genéricas */}
                  <MultiSelectDropdown
                    label="Tags"
                    options={availableTags}
                    selectedValues={clause.tags}
                    onChange={(tags) => updateClauseTags(clause.id, tags)}
                    placeholder="Features..."
                    hideLabel
                  />
                  
                  <MultiSelectDropdown
                    label="Tags"
                    options={availableTags}
                    selectedValues={clause.tags}
                    onChange={(tags) => updateClauseTags(clause.id, tags)}
                    placeholder="Multiplayer..."
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

          return (
            <div 
              key={clause.id} 
              className={`clause-summary-chip ${clause.type.startsWith('EXCLUDE') ? 'exclude' : ''}`}
              onClick={() => setEditingId(clause.id)}
            >
              <span className="clause-type-badge">{clauseTypeShortLabels[clause.type]}</span>
              <span className="clause-tags-preview">
                {clause.tags.length > 0 ? clause.tags.join(', ') : 'Empty'}
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

        {clauses.length === 0 && (
          <div className="empty-clauses-mini">
            No clauses.
          </div>
        )}
      </div>
    </div>
  );
}
