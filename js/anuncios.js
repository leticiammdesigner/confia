/**
 * Confia? · adaptador de anúncios recompensados (PRD §7.2). PREPARADO, NÃO ATIVO.
 * Sem provedor configurado o estado é sempre "indisponivel" e a interface esconde a opção.
 * Nunca simular um anúncio nem conceder recompensa sem confirmação do provedor.
 *
 * Estados: indisponivel · disponivel · carregando · exibindo · recompensa-confirmada · falha · cancelado
 */
export const ESTADOS = ['indisponivel', 'disponivel', 'carregando', 'exibindo', 'recompensa-confirmada', 'falha', 'cancelado'];

export function criarAdaptadorDeAnuncios(provedor = null) {
  return {
    estado: () => (provedor ? provedor.estado() : 'indisponivel'),
    /** Resolve true só quando o provedor confirmar a recompensa. */
    exibirRecompensado: async () => (provedor ? provedor.exibir() : false),
  };
}
