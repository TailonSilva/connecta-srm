// Aplica foco automatico no modal ativo, priorizando confirmacao em `alertdialog` e campo editavel em `dialog`.
export function aplicarFocoNoModalAtivo() {
  const modalAtivo = encontrarModalAtivo();

  if (!modalAtivo) {
    return;
  }

  if (
    document.activeElement
    && document.activeElement !== document.body
    && modalAtivo.contains(document.activeElement)
  ) {
    return;
  }

  const alvoFoco = modalAtivo.getAttribute('role') === 'alertdialog'
    ? encontrarAcaoPrincipalConfirmacao(modalAtivo) || encontrarPrimeiroCampoModal(modalAtivo)
    : encontrarPrimeiroCampoModal(modalAtivo) || encontrarPrimeiroBotaoModal(modalAtivo);

  if (!alvoFoco) {
    return;
  }

  alvoFoco.focus({ preventScroll: true });
}

// Faz a navegacao horizontal entre abas visiveis do modal e devolve `true` quando a troca aconteceu.
export function navegarEntreAbasModal(modal, direcao) {
  const listaAbas = Array.from(modal.querySelectorAll('[role="tablist"]')).find((elemento) => {
    const abas = obterBotoesAbas(elemento);
    return abas.length > 1;
  });

  if (!listaAbas) {
    return false;
  }

  const abas = obterBotoesAbas(listaAbas);

  if (abas.length <= 1) {
    return false;
  }

  const indiceAtual = abas.findIndex((aba) => aba.getAttribute('aria-selected') === 'true');
  const indiceBase = indiceAtual >= 0 ? indiceAtual : 0;
  const proximoIndice = (indiceBase + direcao + abas.length) % abas.length;
  const proximaAba = abas[proximoIndice];

  if (!proximaAba || proximaAba === abas[indiceBase]) {
    return false;
  }

  proximaAba.click();

  window.requestAnimationFrame(() => {
    window.setTimeout(() => {
      focarPrimeiroCampoAbaAtiva(modal);
    }, 0);
  });

  return true;
}

// Resolve a melhor acao primaria para `PageDown`, priorizando salvar modal, depois incluir no modal e por ultimo incluir na pagina.
export function encontrarBotaoAcaoPrimariaPageDown() {
  const botaoSalvarModal = encontrarBotaoSalvarModalAtivo();

  if (botaoSalvarModal) {
    return botaoSalvarModal;
  }

  const modalAtivo = encontrarModalAtivo({ incluirAlertDialog: false });

  if (modalAtivo) {
    const botaoAdicionarModal = encontrarBotaoAdicionar(modalAtivo);

    if (botaoAdicionarModal) {
      return botaoAdicionarModal;
    }
  }

  const paginaAtiva = document.querySelector('main');
  return encontrarBotaoAdicionar(paginaAtiva);
}

// Encontra o botao de busca contextual do campo focado para o atalho `F8` abrir a pesquisa correta no modal ativo.
export function encontrarBotaoBuscaContextualF8() {
  const modalAtivo = encontrarModalAtivo({ incluirAlertDialog: false });

  if (!modalAtivo) {
    return null;
  }

  const elementoFocado = document.activeElement;

  if (!(elementoFocado instanceof HTMLElement) || !modalAtivo.contains(elementoFocado)) {
    return null;
  }

  const identificadorBusca = obterIdentificadorBuscaContextual(elementoFocado);

  if (!identificadorBusca) {
    return null;
  }

  const seletorBotao = `button[data-atalho-busca-id="${identificadorBusca}"]:not([disabled])`;
  const botoesBusca = Array.from(modalAtivo.querySelectorAll(seletorBotao)).filter(elementoEstaVisivel);

  return botoesBusca[botoesBusca.length - 1] || null;
}

// Retorna o ultimo modal visivel do DOM, que corresponde ao modal do topo da pilha visual.
export function encontrarModalAtivo({ incluirAlertDialog = true } = {}) {
  const seletor = incluirAlertDialog ? '[role="alertdialog"], [role="dialog"]' : '[role="dialog"]';
  const modaisAbertos = Array.from(document.querySelectorAll(seletor)).filter(elementoEstaVisivel);

  if (modaisAbertos.length === 0) {
    return null;
  }

  return modaisAbertos[modaisAbertos.length - 1];
}

// Retorna a acao principal de confirmacao do modal, assumindo o ultimo botao visivel do rodape de confirmacao.
function encontrarAcaoPrincipalConfirmacao(modal) {
  const botoesConfirmacao = Array.from(
    modal.querySelectorAll('.acoesConfirmacaoModal button:not([disabled])')
  ).filter(elementoEstaVisivel);

  if (botoesConfirmacao.length > 0) {
    return botoesConfirmacao[botoesConfirmacao.length - 1];
  }

  return null;
}

// Busca o primeiro campo realmente editavel e visivel dentro do modal.
function encontrarPrimeiroCampoModal(modal) {
  const seletorCampos = [
    'input:not([type="hidden"]):not([disabled])',
    'textarea:not([disabled])',
    'select:not([disabled])',
    '[contenteditable="true"]'
  ].join(', ');

  return Array.from(modal.querySelectorAll(seletorCampos)).find(elementoEstaVisivel) || null;
}

// Busca o primeiro botao habilitado e visivel como fallback quando nao ha campo editavel.
function encontrarPrimeiroBotaoModal(modal) {
  return Array.from(modal.querySelectorAll('button:not([disabled])')).find(elementoEstaVisivel) || null;
}

// Resolve o identificador semantico de busca a partir do campo focado ou de um container marcado para esse atalho.
function obterIdentificadorBuscaContextual(elemento) {
  const campoMarcado = elemento.closest('[data-atalho-busca-id]');

  if (!(campoMarcado instanceof HTMLElement)) {
    return '';
  }

  return String(campoMarcado.dataset.atalhoBuscaId || '').trim();
}

// Retorna os botoes de aba visiveis e habilitados de um `tablist`.
function obterBotoesAbas(listaAbas) {
  return Array.from(listaAbas.querySelectorAll('button[aria-selected]:not([disabled])')).filter(elementoEstaVisivel);
}

// Reposiciona o foco na nova aba ativa depois da navegacao por teclado.
function focarPrimeiroCampoAbaAtiva(modal) {
  const containerAbaAtiva = encontrarContainerAbaAtiva(modal);
  const alvoFoco = encontrarPrimeiroCampoModal(containerAbaAtiva) || encontrarPrimeiroBotaoModal(containerAbaAtiva);

  if (!alvoFoco) {
    return;
  }

  alvoFoco.focus({ preventScroll: true });
}

// Localiza o bloco visivel da aba ativa para que os atalhos de navegacao foquem a secao correta, e nao o cabecalho do modal.
function encontrarContainerAbaAtiva(modal) {
  const corpoAbas = Array.from(modal.querySelectorAll('.corpoModalFornecedor, .corpoModalCotacaoAbas')).find(elementoEstaVisivel);

  if (!(corpoAbas instanceof HTMLElement)) {
    return modal;
  }

  const secoesVisiveis = Array.from(corpoAbas.children).filter(elementoEstaVisivel);

  if (secoesVisiveis.length === 0) {
    return corpoAbas;
  }

  return secoesVisiveis[0];
}

// Prioriza o submit semantico do modal ativo e, se ele nao existir, procura um botao identificado como salvar.
function encontrarBotaoSalvarModalAtivo() {
  const modalAtivo = encontrarModalAtivo({ incluirAlertDialog: false });

  if (!modalAtivo) {
    return null;
  }

  const botoesPrioritarios = Array.from(
    modalAtivo.querySelectorAll('button[type="submit"]:not([disabled])')
  ).filter(elementoEstaVisivel);

  if (botoesPrioritarios.length > 0) {
    return botoesPrioritarios[botoesPrioritarios.length - 1];
  }

  const botoes = Array.from(modalAtivo.querySelectorAll('button:not([disabled])')).filter(elementoEstaVisivel);

  return botoes.find((botao) => {
    const aria = String(botao.getAttribute('aria-label') || '').trim().toLowerCase();
    const titulo = String(botao.getAttribute('title') || '').trim().toLowerCase();
    const texto = String(botao.textContent || '').trim().toLowerCase();

    return aria === 'salvar'
      || titulo === 'salvar'
      || texto === 'salvar'
      || aria === 'salvando'
      || titulo === 'salvando'
      || texto === 'salvando';
  }) || null;
}

// Procura o botao de inclusao mais relevante dentro de um container pela semantica do texto.
function encontrarBotaoAdicionar(container) {
  if (!(container instanceof HTMLElement)) {
    return null;
  }

  const botoes = Array.from(container.querySelectorAll('button:not([disabled])')).filter(elementoEstaVisivel);
  const candidatos = botoes
    .map((botao, indice) => ({
      botao,
      indice,
      pontuacao: calcularPontuacaoBotaoAdicionar(botao)
    }))
    .filter((item) => item.pontuacao > 0)
    .sort((primeiro, segundo) => {
      if (segundo.pontuacao !== primeiro.pontuacao) {
        return segundo.pontuacao - primeiro.pontuacao;
      }

      return primeiro.indice - segundo.indice;
    });

  return candidatos[0]?.botao || null;
}

// Soma a melhor pontuacao encontrada em `aria-label`, `title` e texto visivel do botao.
function calcularPontuacaoBotaoAdicionar(botao) {
  const descritores = [
    String(botao.getAttribute('aria-label') || '').trim().toLowerCase(),
    String(botao.getAttribute('title') || '').trim().toLowerCase(),
    String(botao.textContent || '').trim().toLowerCase()
  ].filter(Boolean);

  let melhorPontuacao = 0;

  descritores.forEach((descricao) => {
    melhorPontuacao = Math.max(melhorPontuacao, pontuarDescricaoAdicionar(descricao));
  });

  return melhorPontuacao;
}

// Diferencia botoes de inclusao mais fortes de descricoes apenas parecidas para melhorar a precisao do atalho.
function pontuarDescricaoAdicionar(descricao) {
  if (!descricao) {
    return 0;
  }

  if (
    descricao === 'adicionar'
    || descricao.startsWith('adicionar ')
    || descricao === 'incluir'
    || descricao.startsWith('incluir ')
    || descricao === 'novo'
    || descricao.startsWith('novo ')
  ) {
    return 100;
  }

  if (
    descricao.includes(' adicionar ')
    || descricao.includes(' incluir ')
    || descricao.includes(' novo ')
  ) {
    return 60;
  }

  return 0;
}

// Garante que apenas elementos realmente visiveis participem dos atalhos e do foco automatico.
function elementoEstaVisivel(elemento) {
  if (!(elemento instanceof HTMLElement)) {
    return false;
  }

  if (elemento.hidden || elemento.getAttribute('aria-hidden') === 'true') {
    return false;
  }

  const estilo = window.getComputedStyle(elemento);

  if (estilo.display === 'none' || estilo.visibility === 'hidden') {
    return false;
  }

  return elemento.getClientRects().length > 0;
}
