import type { Course } from './types';
export const bookScope:Record<Course,{lastPage:number;printedEnd:number;label:string;explanation:string}>={
  precalculo:{lastPage:63,printedEnd:63,label:'Páginas 1–63',explanation:'Números reales, expresiones, polinomios, factorización, fracciones y ecuaciones. El método de aplicaciones de p.63 está incluido; los problemas de p.64 quedan fuera.'},
  discreta:{lastPage:152,printedEnd:150,label:'PDF 1–152 · hasta cardinalidad de conjuntos',explanation:'Desde el inicio hasta el final de los ejercicios 2.5: página impresa 150, PDF 152. Este corte corresponde al último tema de los materiales actuales: operaciones, Venn, leyes y aplicaciones de conjuntos.'},
};
