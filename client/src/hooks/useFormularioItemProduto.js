import { useState } from 'react';

// `normalizarValorEntradaFormulario` vem de `../utilitarios/normalizarTextoFormulario` e padroniza o valor digitado antes de ir para o estado.
import { normalizarValorEntradaFormulario } from '../utilitarios/normalizarTextoFormulario';

// Este hook concentra o estado e as acoes do formulario de item usado em cotacoes e ordensCompra.
// A separacao evita duplicar a mesma regra de produto, quantidade, custo e total em varios modais.
export function useFormularioItemProduto({
  estadoInicialItem,
  produtos,
  obterItens,
  definirItens,
  formatarPrecoInput,
  calcularTotalItem,
  normalizarPrecoDigitado,
  converterPrecoParaNumero,
  normalizarPreco,
  normalizarQuantidade,
  normalizarValorUnitario = (valor) => valor,
  normalizarItemAoSalvar = (item) => item,
  exigirProduto = true
}) {
  // Este estado controla a visibilidade do modal principal de item.
  const [modalItemAberto, definirModalItemAberto] = useState(false);
  // Este estado controla a abertura do modal reutilizavel de busca de produto.
  const [modalBuscaProdutoAberto, definirModalBuscaProdutoAberto] = useState(false);
  // Guardamos o indice em edicao para saber se o submit deve incluir ou atualizar.
  const [indiceItemEdicao, definirIndiceItemEdicao] = useState(null);
  // O formulario inteiro fica em um unico objeto para simplificar preenchimento, reset e envio.
  const [itemFormulario, definirItemFormulario] = useState(estadoInicialItem);
  // Esta mensagem local permite validar o modal sem depender de popup global para erros simples do item.
  const [mensagemErroItem, definirMensagemErroItem] = useState('');

  // Esta funcao restaura todo o contexto interno do hook para o estado inicial do modal.
  function redefinirItemModal() {
    definirModalItemAberto(false);
    definirModalBuscaProdutoAberto(false);
    definirIndiceItemEdicao(null);
    definirItemFormulario(estadoInicialItem);
    definirMensagemErroItem('');
  }

  // Esta acao prepara o hook para incluir um novo item a partir do estado padrao.
  function abrirNovoItem() {
    definirIndiceItemEdicao(null);
    definirItemFormulario(estadoInicialItem);
    definirMensagemErroItem('');
    definirModalItemAberto(true);
  }

  // Esta acao recebe o item existente e converte seus campos para o formato esperado pelos inputs do formulario.
  function abrirEdicaoItem(item, indice) {
    definirIndiceItemEdicao(indice);
    definirItemFormulario({
      idProduto: String(item.idProduto || ''),
      descricaoProdutoSnapshot: item.descricaoProdutoSnapshot || '',
      referenciaProdutoSnapshot: item.referenciaProdutoSnapshot || '',
      unidadeProdutoSnapshot: item.unidadeProdutoSnapshot || '',
      quantidade: String(item.quantidade || '1'),
      valorUnitario: item.valorUnitario ? formatarPrecoInput(item.valorUnitario) : '',
      valorTotal: item.valorTotal ? formatarPrecoInput(item.valorTotal) : '',
      imagem: item.imagem || '',
      observacao: item.observacao || ''
    });
    definirMensagemErroItem('');
    definirModalItemAberto(true);
  }

  // Este atalho sem argumento existe para o componente fechar o modal sem precisar conhecer a regra de reset completa.
  function fecharModalItem() {
    redefinirItemModal();
  }

  // Esta acao abre apenas a busca de produto, preservando os dados ja digitados no item.
  function abrirModalBuscaProduto() {
    definirModalBuscaProdutoAberto(true);
  }

  // Esta acao fecha a busca de produto sem interferir no restante do formulario.
  function fecharModalBuscaProduto() {
    definirModalBuscaProdutoAberto(false);
  }

  // Este handler recebe qualquer alteracao de campo do formulario e recalcula dados derivados quando necessario.
  function alterarItemCampo(evento) {
    const { name, value } = evento.target;
    // A normalizacao compartilhada evita discrepancias de espacos e tipos entre inputs diferentes.
    const valorNormalizado = normalizarValorEntradaFormulario(evento);

    definirItemFormulario((estadoAtual) => {
      const proximoEstado = {
        ...estadoAtual,
        // Campos monetarios usam o valor cru digitado para aplicar mascara e normalizacao apropriadas.
        [name]: ['valorUnitario', 'valorTotal'].includes(name)
          ? normalizarPrecoDigitado(value)
          : valorNormalizado
      };

      // Quando o produto muda, preenchemos snapshots e custo padrao para congelar o contexto comercial do item.
      if (name === 'idProduto') {
        const produto = produtos.find((item) => String(item.idProduto) === String(value));
        if (produto) {
          const custoPadrao = normalizarValorUnitario(formatarPrecoInput(produto.custo));
          proximoEstado.descricaoProdutoSnapshot = produto.descricao || '';
          proximoEstado.referenciaProdutoSnapshot = produto.referencia || '';
          proximoEstado.unidadeProdutoSnapshot = produto.nomeUnidadeMedida || produto.siglaUnidadeMedida || '';
          proximoEstado.valorUnitario = custoPadrao;
          proximoEstado.valorTotal = calcularTotalItem(proximoEstado.quantidade, custoPadrao);
          proximoEstado.imagem = produto.imagem || estadoAtual.imagem || '';
        }
      }

      // Quantidade e valor unitario afetam o total, entao recalculamos imediatamente para manter a interface consistente.
      if (name === 'quantidade' || name === 'valorUnitario') {
        proximoEstado.valorTotal = calcularTotalItem(
          name === 'quantidade' ? value : proximoEstado.quantidade,
          proximoEstado.valorUnitario
        );
      }

      return proximoEstado;
    });
  }

  // Esta acao recebe o produto vindo do modal de busca e reaproveita o mesmo fluxo de alteracao do campo `idProduto`.
  function selecionarProdutoBusca(produto) {
    if (!produto) {
      return;
    }

    const valorProduto = String(produto.idProduto || '');

    alterarItemCampo({
      target: {
        name: 'idProduto',
        value: valorProduto,
        type: 'select-one',
        tagName: 'SELECT'
      }
    });
    fecharModalBuscaProduto();
  }

  // Esta funcao valida e consolida o item antes de gravar na lista externa controlada pela pagina consumidora.
  function salvarItem(evento) {
    // `preventDefault` e `stopPropagation` impedem que submits aninhados vazem para formularios maiores do modal pai.
    evento?.preventDefault?.();
    evento?.stopPropagation?.();

    // Alguns fluxos exigem produto obrigatorio, entao falhamos cedo com mensagem clara.
    if (exigirProduto && !itemFormulario.idProduto) {
      definirMensagemErroItem('Selecione o produto do item.');
      return;
    }

    const quantidade = normalizarQuantidade(itemFormulario.quantidade);
    const valorUnitario = converterPrecoParaNumero(normalizarValorUnitario(itemFormulario.valorUnitario));

    // A validacao evita persistir item incompleto ou monetariamente invalido.
    if (!quantidade || valorUnitario === null) {
      definirMensagemErroItem('Informe quantidade e valor unitario validos.');
      return;
    }

    // Recuperamos o item atual e o produto selecionado para compor snapshots e preservar dados anteriores quando necessario.
    const itensAtuais = obterItens();
    const produto = produtos.find((item) => String(item.idProduto) === String(itemFormulario.idProduto));
    const itemAtualizadoBase = {
      ...itensAtuais[indiceItemEdicao],
      idProduto: itemFormulario.idProduto ? Number(itemFormulario.idProduto) : null,
      quantidade: String(quantidade),
      valorUnitario: normalizarPreco(valorUnitario),
      valorTotal: normalizarPreco(quantidade * valorUnitario),
      imagem: itemFormulario.imagem || produto?.imagem || '',
      observacao: itemFormulario.observacao || '',
      descricaoProdutoSnapshot: itemFormulario.descricaoProdutoSnapshot || produto?.descricao || itensAtuais[indiceItemEdicao]?.descricaoProdutoSnapshot || '',
      referenciaProdutoSnapshot: itemFormulario.referenciaProdutoSnapshot || produto?.referencia || itensAtuais[indiceItemEdicao]?.referenciaProdutoSnapshot || '',
      unidadeProdutoSnapshot: itemFormulario.unidadeProdutoSnapshot || produto?.nomeUnidadeMedida || produto?.siglaUnidadeMedida || itensAtuais[indiceItemEdicao]?.unidadeProdutoSnapshot || ''
    };
    // `normalizarItemAoSalvar` permite que cada modulo acrescente sua propria regra sem duplicar o fluxo inteiro do hook.
    const itemAtualizado = normalizarItemAoSalvar(itemAtualizadoBase);

    // O setter externo recebe a lista atualizada para manter a fonte de verdade no componente pai.
    definirItens((estadoAtual) => (
      indiceItemEdicao === null
        ? [...estadoAtual, itemAtualizado]
        : estadoAtual.map((item, indice) => (indice === indiceItemEdicao ? itemAtualizado : item))
    ));

    // Ao salvar com sucesso, fechamos e limpamos o modal para o proximo uso.
    fecharModalItem();
  }

  // Esta acao remove o item pelo indice preservando a imutabilidade esperada pelo React.
  function removerItem(indice) {
    definirItens((estadoAtual) => estadoAtual.filter((_, indiceAtual) => indiceAtual !== indice));
  }

  // Esta acao isolada simplifica integracao com uploads ou seletores de imagem do item.
  function definirImagemItem(imagem) {
    definirItemFormulario((estadoAtual) => ({
      ...estadoAtual,
      imagem: imagem || ''
    }));
  }

  // O retorno expõe estados e acoes granulares para que cada tela componha o formulario do jeito que precisar.
  return {
    modalItemAberto,
    modalBuscaProdutoAberto,
    indiceItemEdicao,
    itemFormulario,
    mensagemErroItem,
    definirItemFormulario,
    definirImagemItem,
    redefinirItemModal,
    abrirNovoItem,
    abrirEdicaoItem,
    fecharModalItem,
    abrirModalBuscaProduto,
    fecharModalBuscaProduto,
    selecionarProdutoBusca,
    alterarItemCampo,
    salvarItem,
    removerItem
  };
}
