import type { Course } from './types';
import { algebraRules } from './algebraRules';

export interface LogicTableSpec {
  id: string;
  title: string;
  expr: string;
  variables: string[];
}

export const logicTables: LogicTableSpec[] = [
  { id: 'not', title: 'Negación', expr: '¬P', variables: ['P'] },
  { id: 'and', title: 'Conjunción', expr: 'P∧Q', variables: ['P', 'Q'] },
  { id: 'or', title: 'Disyunción', expr: 'P∨Q', variables: ['P', 'Q'] },
  { id: 'imp', title: 'Implicación', expr: 'P→Q', variables: ['P', 'Q'] },
  { id: 'iff', title: 'Bicondicional', expr: 'P↔Q', variables: ['P', 'Q'] },
  { id: 'xor', title: 'Exclusiva', expr: 'P⊻Q', variables: ['P', 'Q'] },
];

export interface TableFamily {
  id: string;
  title: string;
}

export function tableFamilies(course: Course): TableFamily[] {
  switch (course) {
    case 'discreta':
      return logicTables.map(table => ({ id: table.id, title: table.title }));
    case 'precalculo':
      return algebraRules.map(group => ({ id: group.id, title: group.title }));
    default: {
      const never: never = course;
      return never;
    }
  }
}
