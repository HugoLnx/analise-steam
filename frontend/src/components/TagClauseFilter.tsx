import { Plus, Trash2 } from 'lucide-react';
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

export function TagClauseFilter({ availableTags, clauses, onChange }: TagClauseFilterProps) {
  const addClause = () => {
    const newClause: TagClause = {
      id: Date.now().toString(),
      type: 'INCLUDE_AND',
      tags: []
    };
    onChange([...clauses, newClause]);
  };

  const removeClause = (id: string) => {
    onChange(clauses.filter(c => c.id !== id));
  };

  const updateClauseType = (id: string, type: ClauseType) => {
    onChange(clauses.map(c => c.id === id ? { ...c, type } : c));
  };

  const updateClauseTags = (id: string, tags: string[]) => {
    onChange(clauses.map(c => c.id === id ? { ...c, tags } : c));
  };

  return (
    <div className="filter-group tag-clause-container">
      <div className="clause-header">
        <label className="filter-label">Tag Clauses</label>
        <button
          onClick={addClause}
          className="btn-add-clause"
        >
          <Plus size={14} />
          Add Clause
        </button>
      </div>

      {clauses.length === 0 && (
        <div className="empty-clauses">
          No clauses added. Click + to add one.
        </div>
      )}

      <div className="clauses-list">
        {clauses.map((clause) => (
          <div
            key={clause.id}
            className="clause-card"
          >
            <div className="clause-card-content">
              <div className="clause-fields">
                {/* Clause Type Dropdown */}
                <div className="filter-group">
                  <label className="tiny-label">Clause Type</label>
                  <select
                    value={clause.type}
                    onChange={(e) => updateClauseType(clause.id, e.target.value as ClauseType)}
                    className="clause-select"
                  >
                    {Object.entries(clauseTypeLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tags Multiselect */}
                <MultiSelectDropdown
                  label="Tags"
                  options={availableTags}
                  selectedValues={clause.tags}
                  onChange={(tags) => updateClauseTags(clause.id, tags)}
                  placeholder="Select tags..."
                />
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeClause(clause.id)}
                className="btn-remove-clause"
                title="Remove clause"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
