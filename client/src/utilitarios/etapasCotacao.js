const IDS_ETAPAS_COTACAO_AUTOMATICAS = new Set([2, 3]);

export function etapaCotacaoEhAutomatica(etapaOuId) {
  const idEtapaCotacao = typeof etapaOuId === 'object'
    ? etapaOuId?.idEtapaCotacao
    : etapaOuId;

  return IDS_ETAPAS_COTACAO_AUTOMATICAS.has(Number(idEtapaCotacao));
}

export function obterEtapasCotacaoParaInputManual(etapas = [], idSelecionado = null) {
  return (Array.isArray(etapas) ? etapas : []).filter((etapa) => {
    const idEtapaCotacao = String(etapa?.idEtapaCotacao || '');

    if (String(idSelecionado || '') === idEtapaCotacao) {
      return true;
    }

    return !etapaCotacaoEhAutomatica(etapa);
  });
}
