/** Confia? · banco usado pelo jogo: os originais da idealizadora, as revisadas por ela, e por fim o demonstrativo. */
import { PERGUNTAS_ORIGINAIS } from './perguntas-originais.js';
import { PERGUNTAS_REVISADAS } from './perguntas-revisadas.js';
import { PERGUNTAS_DEMONSTRATIVAS } from './perguntas.js';
import { PERGUNTAS_PROPOSTAS } from './perguntas-propostas.js';
export const BANCO = [...PERGUNTAS_ORIGINAIS, ...PERGUNTAS_REVISADAS, ...PERGUNTAS_DEMONSTRATIVAS, ...PERGUNTAS_PROPOSTAS];
