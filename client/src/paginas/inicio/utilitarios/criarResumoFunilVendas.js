export function criarResumoFunilVendas(etapasOrcamento, orcamentos) {
  const etapasAtivasFunil = Array.isArray(etapasOrcamento)
    ? [...etapasOrcamento]
      .filter((etapa) => Boolean(etapa?.status) && Boolean(etapa?.consideraFunilVendas))
      .sort((primeira, segunda) => {
        const ordemPrimeira = Number(primeira?.ordem || 0);
        const ordemSegunda = Number(segunda?.ordem || 0);
        return ordemPrimeira - ordemSegunda;
      })
    : [];

  const orcamentosPorEtapa = new Map();

  if (Array.isArray(orcamentos)) {
    orcamentos.forEach((orcamento) => {
      const idEtapa = Number(orcamento?.idEtapaOrcamento || 0);

      if (!idEtapa) {
        return;
      }

      const acumulado = orcamentosPorEtapa.get(idEtapa) || {
        quantidadeOrcamentos: 0,
        valorTotal: 0
      };

      const valorTotalOrcamento = Array.isArray(orcamento?.itens)
        ? orcamento.itens.reduce((total, item) => total + (Number(item?.valorTotal) || 0), 0)
        : 0;

      orcamentosPorEtapa.set(idEtapa, {
        quantidadeOrcamentos: acumulado.quantidadeOrcamentos + 1,
        valorTotal: acumulado.valorTotal + valorTotalOrcamento
      });
    });
  }

  return etapasAtivasFunil.map((etapa) => {
    const acumulado = orcamentosPorEtapa.get(Number(etapa.idEtapaOrcamento)) || {
      quantidadeOrcamentos: 0,
      valorTotal: 0
    };

    return {
      idEtapaOrcamento: etapa.idEtapaOrcamento,
      descricao: etapa.descricao,
      cor: etapa.cor,
      quantidadeOrcamentos: acumulado.quantidadeOrcamentos,
      valorTotal: acumulado.valorTotal
    };
  });
}