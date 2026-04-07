import { useState } from 'react';
import { normalizarValorEntradaFormulario } from './normalizarTextoFormulario';

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
  const [modalItemAberto, definirModalItemAberto] = useState(false);
  const [modalBuscaProdutoAberto, definirModalBuscaProdutoAberto] = useState(false);
  const [indiceItemEdicao, definirIndiceItemEdicao] = useState(null);
  const [itemFormulario, definirItemFormulario] = useState(estadoInicialItem);
  const [mensagemErroItem, definirMensagemErroItem] = useState('');

  function redefinirItemModal() {
    definirModalItemAberto(false);
    definirModalBuscaProdutoAberto(false);
    definirIndiceItemEdicao(null);
    definirItemFormulario(estadoInicialItem);
    definirMensagemErroItem('');
  }

  function abrirNovoItem() {
    definirIndiceItemEdicao(null);
    definirItemFormulario(estadoInicialItem);
    definirMensagemErroItem('');
    definirModalItemAberto(true);
  }

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

  function fecharModalItem() {
    redefinirItemModal();
  }

  function abrirModalBuscaProduto() {
    definirModalBuscaProdutoAberto(true);
  }

  function fecharModalBuscaProduto() {
    definirModalBuscaProdutoAberto(false);
  }

  function alterarItemCampo(evento) {
    const { name, value } = evento.target;
    const valorNormalizado = normalizarValorEntradaFormulario(evento);

    definirItemFormulario((estadoAtual) => {
      const proximoEstado = {
        ...estadoAtual,
        [name]: ['valorUnitario', 'valorTotal'].includes(name)
          ? normalizarPrecoDigitado(value)
          : valorNormalizado
      };

      if (name === 'idProduto') {
        const produto = produtos.find((item) => String(item.idProduto) === String(value));
        if (produto) {
          const precoPadrao = normalizarValorUnitario(formatarPrecoInput(produto.preco));
          proximoEstado.descricaoProdutoSnapshot = produto.descricao || '';
          proximoEstado.referenciaProdutoSnapshot = produto.referencia || '';
          proximoEstado.unidadeProdutoSnapshot = produto.nomeUnidadeMedida || produto.siglaUnidadeMedida || '';
          proximoEstado.valorUnitario = precoPadrao;
          proximoEstado.valorTotal = calcularTotalItem(proximoEstado.quantidade, precoPadrao);
          proximoEstado.imagem = produto.imagem || estadoAtual.imagem || '';
        }
      }

      if (name === 'quantidade' || name === 'valorUnitario') {
        proximoEstado.valorTotal = calcularTotalItem(
          name === 'quantidade' ? value : proximoEstado.quantidade,
          proximoEstado.valorUnitario
        );
      }

      return proximoEstado;
    });
  }

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

  function salvarItem(evento) {
    evento?.preventDefault?.();
    evento?.stopPropagation?.();

    if (exigirProduto && !itemFormulario.idProduto) {
      definirMensagemErroItem('Selecione o produto do item.');
      return;
    }

    const quantidade = normalizarQuantidade(itemFormulario.quantidade);
    const valorUnitario = converterPrecoParaNumero(normalizarValorUnitario(itemFormulario.valorUnitario));

    if (!quantidade || valorUnitario === null) {
      definirMensagemErroItem('Informe quantidade e valor unitario validos.');
      return;
    }

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
    const itemAtualizado = normalizarItemAoSalvar(itemAtualizadoBase);

    definirItens((estadoAtual) => (
      indiceItemEdicao === null
        ? [...estadoAtual, itemAtualizado]
        : estadoAtual.map((item, indice) => (indice === indiceItemEdicao ? itemAtualizado : item))
    ));

    fecharModalItem();
  }

  function removerItem(indice) {
    definirItens((estadoAtual) => estadoAtual.filter((_, indiceAtual) => indiceAtual !== indice));
  }

  function definirImagemItem(imagem) {
    definirItemFormulario((estadoAtual) => ({
      ...estadoAtual,
      imagem: imagem || ''
    }));
  }

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
