import { registroEstaAtivo } from '../statusRegistro';

const IDS_ETAPAS_COTACAO_OBRIGATORIAS = new Set([1, 2, 3, 4]);

export function criarResumoFunilCotacoes(etapasCotacao, cotacoes) {
  const etapasAtivasFunil = Array.isArray(etapasCotacao)
    ? [...etapasCotacao]
      .filter((etapa) => (
        registroEstaAtivo(etapa?.status)
        && registroEstaAtivo(etapa?.consideraFunilCotacoes)
        && !IDS_ETAPAS_COTACAO_OBRIGATORIAS.has(Number(etapa?.idEtapaCotacao))
      ))
      .sort((primeira, segunda) => {
        const ordemPrimeira = Number(primeira?.ordem || 0);
        const ordemSegunda = Number(segunda?.ordem || 0);
        return ordemPrimeira - ordemSegunda;
      })
    : [];

  const cotacoesPorEtapa = new Map();

  if (Array.isArray(cotacoes)) {
    cotacoes.forEach((cotacao) => {
      const idEtapa = Number(cotacao?.idEtapaCotacao || 0);

      if (!idEtapa) {
        return;
      }

      const acumulado = cotacoesPorEtapa.get(idEtapa) || {
        quantidadeCotacoes: 0,
        quantidadeItens: 0,
        valorTotal: 0
      };

      const quantidadeItensCotacao = Array.isArray(cotacao?.itens)
        ? cotacao.itens.reduce((total, item) => total + normalizarNumeroDecimal(item?.quantidade), 0)
        : 0;
      const valorTotalCotacao = Array.isArray(cotacao?.itens)
        ? cotacao.itens.reduce((total, item) => total + normalizarNumeroDecimal(item?.valorTotal), 0)
        : 0;

      cotacoesPorEtapa.set(idEtapa, {
        quantidadeCotacoes: acumulado.quantidadeCotacoes + 1,
        quantidadeItens: acumulado.quantidadeItens + quantidadeItensCotacao,
        valorTotal: acumulado.valorTotal + valorTotalCotacao
      });
    });
  }

  return etapasAtivasFunil.map((etapa) => {
    const acumulado = cotacoesPorEtapa.get(Number(etapa.idEtapaCotacao)) || {
      quantidadeCotacoes: 0,
      quantidadeItens: 0,
      valorTotal: 0
    };

    return {
      idEtapaCotacao: etapa.idEtapaCotacao,
      descricao: etapa.descricao,
      cor: etapa.cor,
      quantidadeCotacoes: acumulado.quantidadeCotacoes,
      quantidadeItens: acumulado.quantidadeItens,
      valorTotal: acumulado.valorTotal
    };
  });
}

function normalizarNumeroDecimal(valor) {
  const textoOriginal = String(valor ?? '').trim();

  if (!textoOriginal) {
    return 0;
  }

  const textoLimpo = textoOriginal
    .replace(/[^\d,.-]/g, '')
    .replace(/\.(?=\d{3}(?:\D|$))/g, '');
  const texto = textoLimpo.includes(',')
    ? textoLimpo.replace(',', '.')
    : textoLimpo;
  const numero = Number(texto);
  return Number.isNaN(numero) ? 0 : numero;
}
