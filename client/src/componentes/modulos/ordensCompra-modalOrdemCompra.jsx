import { useEffect, useMemo, useRef, useState } from 'react';
import { Botao } from '../comuns/botao';
import { CodigoRegistro } from '../comuns/codigoRegistro';
import { GradePadrao } from '../comuns/gradePadrao';
import { ModalBuscaFornecedores } from '../comuns/modalBuscaFornecedores';
import { ModalBuscaContatos } from '../comuns/modalBuscaContatos';
import { MensagemErroPopup } from '../comuns/mensagemErroPopup';
import { ModalItemProduto } from '../comuns/modalItemProduto';
import { ModalPrazosPagamento } from './configuracoes-modalPrazosPagamento';
import { ModalFornecedor as ModalFornecedor } from './fornecedores-modalFornecedor';
import { formatarNomeContato } from '../../utilitarios/formatarNomeContato';
import { formatarCodigoFornecedor } from '../../utilitarios/codigoFornecedor';
import { useFormularioItemProduto } from '../../hooks/useFormularioItemProduto';
import {
  converterPrecoParaNumero,
  desformatarPreco,
  normalizarPreco,
} from '../../utilitarios/normalizarPreco';
import { normalizarValorEntradaFormulario } from '../../utilitarios/normalizarTextoFormulario';

const abasModalOrdemCompra = [
  { id: 'dadosGerais', label: 'Dados gerais' },
  { id: 'itens', label: 'Itens' },
  { id: 'outros', label: 'Outros' },
  { id: 'campos', label: 'Campos da ordem de compra' }
];

const ID_ETAPA_ORDEM_COMPRA_ENTREGUE = 5;
const ID_TIPO_ORDEM_COMPRA_VENDA = 1;

const estadoInicialFormulario = {
  idCotacao: '',
  idFornecedor: '',
  idContato: '',
  idUsuario: '',
  idComprador: '',
  idPrazoPagamento: '',
  idTipoOrdemCompra: '',
  dataInclusao: '',
  dataEntrega: '',
  nomeFornecedorSnapshot: '',
  nomeContatoSnapshot: '',
  nomeUsuarioSnapshot: '',
  nomeCompradorSnapshot: '',
  nomeMetodoPagamentoSnapshot: '',
  nomePrazoPagamentoSnapshot: '',
  nomeTipoOrdemCompraSnapshot: '',
  idEtapaOrdemCompra: '',
  nomeEtapaOrdemCompraSnapshot: '',
  observacao: '',
  itens: [],
  camposExtras: [],
  codigoCotacaoOrigem: ''
};

const estadoInicialItem = {
  idProduto: '',
  descricaoProdutoSnapshot: '',
  referenciaProdutoSnapshot: '',
  unidadeProdutoSnapshot: '',
  quantidade: '1',
  valorUnitario: '',
  valorTotal: '',
  imagem: '',
  observacao: ''
};

function normalizarEtapasOrdemCompra(etapasOrdemCompra) {
  if (!Array.isArray(etapasOrdemCompra)) {
    return [];
  }

  return etapasOrdemCompra
    .map((etapa) => ({
      ...etapa,
      idEtapaOrdemCompra: etapa.idEtapaOrdemCompra ?? etapa.idEtapa
    }))
    .sort((etapaA, etapaB) => {
      const ordemA = obterValorOrdemEtapa(etapaA?.ordem, etapaA?.idEtapaOrdemCompra);
      const ordemB = obterValorOrdemEtapa(etapaB?.ordem, etapaB?.idEtapaOrdemCompra);

      if (ordemA !== ordemB) {
        return ordemA - ordemB;
      }

      return Number(etapaA?.idEtapaOrdemCompra || 0) - Number(etapaB?.idEtapaOrdemCompra || 0);
    });
}

function obterValorOrdemEtapa(ordem, fallback) {
  const ordemNumerica = Number(ordem);

  if (Number.isFinite(ordemNumerica) && ordemNumerica > 0) {
    return ordemNumerica;
  }

  const fallbackNumerico = Number(fallback);
  if (Number.isFinite(fallbackNumerico) && fallbackNumerico > 0) {
    return fallbackNumerico;
  }

  return Number.MAX_SAFE_INTEGER;
}

export function ModalOrdemCompra({
  aberto,
  ordemCompra,
  dadosIniciais,
  fornecedores = [],
  contatos = [],
  usuarios = [],
  compradores = [],
  ramosAtividade = [],
  conceitosFornecedor = [],
  metodosPagamento = [],
  prazosPagamento = [],
  tiposOrdemCompra = [],
  etapasOrdemCompra = [],
  produtos = [],
  camposOrdemCompra = [],
  empresa,
  usuarioLogado,
  modo = 'consulta',
  idCompradorBloqueado = null,
  somenteConsultaPrazos = false,
  camadaSecundaria = false,
  aoIncluirFornecedor,
  aoFechar,
  aoSalvar,
  aoSalvarPrazoPagamento,
  aoInativarPrazoPagamento
}) {
  const [formulario, definirFormulario] = useState(estadoInicialFormulario);
  const [abaAtiva, definirAbaAtiva] = useState(abasModalOrdemCompra[0].id);
  const [salvando, definirSalvando] = useState(false);
  const [mensagemErro, definirMensagemErro] = useState('');
  const [confirmandoSaida, definirConfirmandoSaida] = useState(false);
  const [modalBuscaFornecedorAberto, definirModalBuscaFornecedorAberto] = useState(false);
  const [modalFornecedorAberto, definirModalFornecedorAberto] = useState(false);
  const [modalBuscaContatoAberto, definirModalBuscaContatoAberto] = useState(false);
  const referenciaCampoFornecedor = useRef(null);
  const referenciaCampoContato = useRef(null);
  const [contatosCriadosLocalmente, definirContatosCriadosLocalmente] = useState([]);
  const [modalPrazosPagamentoAberto, definirModalPrazosPagamentoAberto] = useState(false);
  const compradorBloqueado = Boolean(idCompradorBloqueado);
  const somenteLeitura = modo === 'consulta';
  const modoInclusao = !ordemCompra;
  const registroBase = ordemCompra || dadosIniciais || null;
  const ordemCompraOriginadoDeCotacao = Boolean(!ordemCompra && (dadosIniciais?.idCotacao || registroBase?.idCotacao));
  const listaFornecedores = Array.isArray(fornecedores) ? fornecedores : fornecedores;
  const fornecedoresAtivos = listaFornecedores.filter((fornecedor) => fornecedor.status !== 0);
  const contatosAtivos = contatos.filter((contato) => contato.status !== 0);
  const usuariosAtivos = usuarios.filter((usuario) => usuario.ativo !== 0);
  const compradoresAtivos = compradores.filter((comprador) => comprador.status !== 0);
  const prazosAtivos = prazosPagamento.filter((prazo) => prazo.status !== 0);
  const tiposOrdemCompraAtivos = tiposOrdemCompra.filter((tipoOrdemCompra) => tipoOrdemCompra.status !== 0);
  const produtosAtivos = produtos.filter((produto) => produto.status !== 0);
  const etapasOrdemCompraNormalizadas = useMemo(
    () => normalizarEtapasOrdemCompra(etapasOrdemCompra).filter((etapa) => etapa.status !== 0),
    [etapasOrdemCompra]
  );
  const chaveRegistroBase = ordemCompra?.idOrdemCompra || dadosIniciais?.idCotacao || 'novo';
  const chaveEmpresa = empresa?.diasEntregaOrdemCompra ?? '';
  const quantidadeCamposOrdemCompra = Array.isArray(camposOrdemCompra) ? camposOrdemCompra.length : 0;
  const totalOrdemCompra = useMemo(
    () => formulario.itens.reduce((total, item) => total + (converterPrecoParaNumero(item.valorTotal) || 0), 0),
    [formulario.itens]
  );
  const nomeCompradorSelecionado = useMemo(
    () => compradoresAtivos.find((item) => String(item.idComprador) === String(formulario.idComprador || ''))?.nome || formulario.nomeCompradorSnapshot || '',
    [compradoresAtivos, formulario.idComprador, formulario.nomeCompradorSnapshot]
  );
  const contatosDoFornecedor = useMemo(
    () => combinarContatosDoFornecedor(contatosAtivos, contatosCriadosLocalmente, formulario.idFornecedor),
    [contatosAtivos, contatosCriadosLocalmente, formulario.idFornecedor]
  );
  const proximoCodigoFornecedor = useMemo(
    () => obterProximoCodigoFornecedor(listaFornecedores),
    [listaFornecedores]
  );
  const {
    modalItemAberto,
    modalBuscaProdutoAberto,
    itemFormulario,
    mensagemErroItem,
    definirImagemItem,
    redefinirItemModal,
    abrirNovoItem,
    abrirEdicaoItem,
    fecharModalItem,
    abrirModalBuscaProduto,
    fecharModalBuscaProduto,
    selecionarProdutoBusca,
    alterarItemCampo,
    salvarItem
  } = useFormularioItemProduto({
    estadoInicialItem,
    produtos: produtosAtivos,
    obterItens: () => formulario.itens,
    definirItens: (atualizarItens) => definirFormulario((estadoAtual) => ({
      ...estadoAtual,
      itens: typeof atualizarItens === 'function'
        ? atualizarItens(estadoAtual.itens)
        : atualizarItens
    })),
    formatarPrecoInput,
    calcularTotalItem,
      converterPrecoParaNumero,
    normalizarPreco,
    normalizarQuantidade: (valor) => Number(String(valor ?? '').replace(',', '.')),
    normalizarValorUnitario: formatarPrecoInput,
    normalizarItemAoSalvar: (item) => ({
      ...item,
      valorTotal: calcularTotalItem(item.quantidade, item.valorUnitario)
    })
  });

  useEffect(() => {
    if (!aberto) {
      return;
    }

    definirFormulario(
      criarFormularioInicialOrdemCompra(
        registroBase,
        usuarioLogado,
        camposOrdemCompra,
        empresa,
        usuariosAtivos,
        compradoresAtivos,
        {
          novo: !ordemCompra,
          idCompradorBloqueado
        }
      )
    );
    definirAbaAtiva(abasModalOrdemCompra[0].id);
    definirSalvando(false);
    definirMensagemErro('');
    definirConfirmandoSaida(false);
    definirModalBuscaFornecedorAberto(false);
    definirModalBuscaContatoAberto(false);
    definirContatosCriadosLocalmente([]);
    definirModalPrazosPagamentoAberto(false);
    redefinirItemModal();
  }, [aberto, chaveRegistroBase, usuarioLogado?.idUsuario, quantidadeCamposOrdemCompra, chaveEmpresa]);

  useEffect(() => {
    if (!aberto) {
      return undefined;
    }

    function tratarTecla(evento) {
      if (evento.key !== 'Escape' || salvando) {
        return;
      }

      if (modalItemAberto) {
        if (modalBuscaProdutoAberto) {
          fecharModalBuscaProduto();
          return;
        }

        fecharModalItem();
        return;
      }

      if (modalBuscaFornecedorAberto) {
        fecharModalBuscaFornecedor();
        return;
      }

      if (modalFornecedorAberto) {
        fecharModalNovoFornecedor();
        return;
      }

      if (modalBuscaContatoAberto) {
        fecharModalBuscaContato();
        return;
      }

      if (modalPrazosPagamentoAberto) {
        fecharModalPrazosPagamento();
        return;
      }

      if (confirmandoSaida) {
        definirConfirmandoSaida(false);
        return;
      }

      tentarFecharModal();
    }

    window.addEventListener('keydown', tratarTecla);

    return () => {
      window.removeEventListener('keydown', tratarTecla);
    };
  }, [aberto, confirmandoSaida, modalBuscaFornecedorAberto, modalBuscaContatoAberto, modalBuscaProdutoAberto, modalFornecedorAberto, modalItemAberto, modalPrazosPagamentoAberto, salvando]);

  if (!aberto) {
    return null;
  }

  function alterarCampo(evento) {
    const { name, value } = evento.target;
    const valorNormalizado = normalizarValorEntradaFormulario(evento);

    definirFormulario((estadoAtual) => {
      const mudouParaEntregue = name === 'idEtapaOrdemCompra'
        && !etapaOrdemCompraEhEntregue(estadoAtual.idEtapaOrdemCompra)
        && etapaOrdemCompraEhEntregue(value);
      const proximoEstado = {
        ...estadoAtual,
        ...(name === 'idFornecedor' ? { idContato: '' } : {}),
        [name]: valorNormalizado,
        ...(name === 'idEtapaOrdemCompra'
          ? {
            nomeEtapaOrdemCompraSnapshot: etapasOrdemCompraNormalizadas.find((etapa) => String(etapa.idEtapaOrdemCompra) === String(value))?.descricao || '',
            ...(mudouParaEntregue ? { dataEntrega: obterDataAtualFormatoInput() } : {})
          }
          : {})
      };

      if (name === 'idFornecedor') {
        const fornecedor = fornecedoresAtivos.find((item) => String(item.idFornecedor) === String(value));
        if (fornecedor) {
          proximoEstado.nomeFornecedorSnapshot = fornecedor.nomeFantasia || fornecedor.razaoSocial || '';
        }
      }

      if (name === 'idContato') {
        const contato = contatos.find((item) => String(item.idContato) === String(value));
        proximoEstado.nomeContatoSnapshot = contato?.nome || '';
      }

      if (name === 'idUsuario') {
        const comprador = obterCompradorPadrao(
          value,
          usuariosAtivos,
          compradoresAtivos,
          idCompradorBloqueado
        );
        proximoEstado.idComprador = comprador.idComprador;
        proximoEstado.nomeCompradorSnapshot = comprador.nomeComprador;
      }

      if (name === 'idComprador' && !compradorBloqueado) {
        const comprador = compradoresAtivos.find((item) => String(item.idComprador) === String(value));
        proximoEstado.nomeCompradorSnapshot = comprador?.nome || '';
      }

      if (name === 'idPrazoPagamento') {
        const prazo = prazosAtivos.find((item) => String(item.idPrazoPagamento) === String(value));
        proximoEstado.nomePrazoPagamentoSnapshot = prazo?.descricaoFormatada || '';
        proximoEstado.nomeMetodoPagamentoSnapshot = prazo?.nomeMetodoPagamento || '';
      }

      if (name === 'idTipoOrdemCompra') {
        const tipoOrdemCompra = tiposOrdemCompraAtivos.find((item) => String(item.idTipoOrdemCompra) === String(value));
        proximoEstado.nomeTipoOrdemCompraSnapshot = tipoOrdemCompra?.descricao || '';
      }

      if (name === 'dataInclusao') {
        proximoEstado.dataEntrega = somarDiasNaData(
          value,
          Number(empresa?.diasEntregaOrdemCompra ?? 7)
        );
      }

      return proximoEstado;
    });

  }

  function alterarCampoExtra(indice, valor) {
    definirFormulario((estadoAtual) => ({
      ...estadoAtual,
      camposExtras: estadoAtual.camposExtras.map((campo, indiceCampo) => (
        indiceCampo === indice ? { ...campo, valor } : campo
      ))
    }));
  }

  function submeterFormulario(evento) {
    evento.preventDefault();
    salvarFormulario();
  }

  async function salvarFormulario(formularioParaSalvar = formulario) {
    if (somenteLeitura) {
      return;
    }

    if (!String(formularioParaSalvar.idFornecedor || '').trim()) {
      definirMensagemErro('Selecione o fornecedor do ordemCompra.');
      return;
    }

    if (!String(formularioParaSalvar.idUsuario || '').trim()) {
      definirMensagemErro('Selecione o usuario do registro.');
      return;
    }

    if (!String(formularioParaSalvar.idComprador || '').trim()) {
      definirMensagemErro('Selecione o comprador.');
      return;
    }

    if (!String(formularioParaSalvar.idTipoOrdemCompra || '').trim()) {
      definirMensagemErro('Selecione o tipo de ordemCompra.');
      return;
    }

    if (!String(formularioParaSalvar.idPrazoPagamento || '').trim()) {
      definirMensagemErro('Selecione o prazo de pagamento.');
      return;
    }

    if (formularioParaSalvar.itens.length === 0) {
      definirMensagemErro('Inclua ao menos um item no ordemCompra.');
      return;
    }

    definirSalvando(true);
    definirMensagemErro('');

    try {
      await aoSalvar(formularioParaSalvar);
    } catch (erro) {
      definirMensagemErro(erro.message || 'Nao foi possivel salvar o ordemCompra.');
      definirSalvando(false);
    }
  }

  function fecharAoClicarNoFundo(evento) {
    if (evento.target === evento.currentTarget && !salvando) {
      tentarFecharModal();
    }
  }

  function tentarFecharModal() {
    if (ordemCompraOriginadoDeCotacao) {
      aoFechar();
      return;
    }

    if (!somenteLeitura && modoInclusao) {
      definirConfirmandoSaida(true);
      return;
    }

    aoFechar();
  }

  function confirmarSaida() {
    definirConfirmandoSaida(false);
    aoFechar();
  }

  function abrirModalBuscaFornecedor() {
    if (somenteLeitura || salvando || !modoInclusao) {
      return;
    }

    definirModalBuscaFornecedorAberto(true);
  }

  function abrirModalNovoFornecedor() {
    if (somenteLeitura || salvando || !modoInclusao || !aoIncluirFornecedor) {
      return;
    }

    definirModalFornecedorAberto(true);
  }

  function fecharModalNovoFornecedor() {
    definirModalFornecedorAberto(false);
  }

  function fecharModalBuscaFornecedor() {
    definirModalBuscaFornecedorAberto(false);
  }

  function abrirModalBuscaContato() {
    if (somenteLeitura || salvando || !modoInclusao || !formulario.idFornecedor) {
      return;
    }

    definirModalBuscaContatoAberto(true);
  }

  function fecharModalBuscaContato() {
    definirModalBuscaContatoAberto(false);
  }

  function selecionarFornecedor(fornecedor) {
    if (!fornecedor) {
      return;
    }

    definirFormulario((estadoAtual) => {
      return {
        ...estadoAtual,
        idFornecedor: String(fornecedor.idFornecedor),
        idContato: '',
        nomeFornecedorSnapshot: fornecedor.nomeFantasia || fornecedor.razaoSocial || '',
        nomeContatoSnapshot: '',
      };
    });

    fecharModalBuscaFornecedor();
    agendarFocoCampo(referenciaCampoFornecedor);
  }

  function selecionarContato(contato) {
    if (!contato) {
      return;
    }

    definirFormulario((estadoAtual) => ({
      ...estadoAtual,
      idContato: String(contato.idContato),
      nomeContatoSnapshot: contato.nome || ''
    }));

    fecharModalBuscaContato();
    agendarFocoCampo(referenciaCampoContato);
  }

  function registrarContatoCriado(contato) {
    if (!contato?.idContato) {
      return;
    }

    definirContatosCriadosLocalmente((estadoAtual) => combinarContatosUnicos(estadoAtual, [contato]));
  }

  function abrirModalPrazosPagamento() {
    if (somenteLeitura || salvando || !aoSalvarPrazoPagamento) {
      return;
    }

    definirModalPrazosPagamentoAberto(true);
  }

  function fecharModalPrazosPagamento() {
    definirModalPrazosPagamentoAberto(false);
  }

  async function salvarNovoFornecedor(dadosFornecedor) {
    const fornecedorCriado = await aoIncluirFornecedor(dadosFornecedor);

    selecionarFornecedor(fornecedorCriado);
    definirModalFornecedorAberto(false);
  }

  function selecionarPrazoPagamento(prazo) {
    if (!prazo?.idPrazoPagamento) {
      return;
    }

    definirFormulario((estadoAtual) => ({
      ...estadoAtual,
      idPrazoPagamento: String(prazo.idPrazoPagamento),
      nomePrazoPagamentoSnapshot: prazo.descricaoFormatada || prazo.descricao || '',
      nomeMetodoPagamentoSnapshot: prazo.nomeMetodoPagamento || ''
    }));
  }

  return (
    <div className={`camadaModal ${camadaSecundaria ? 'camadaModalSecundaria' : ''}`} role="presentation" onMouseDown={fecharAoClicarNoFundo}>
      <form
        className="modalFornecedor modalFornecedor modalFornecedorComAbas modalCotacao modalOrdemCompra"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tituloModalOrdemCompra"
        onMouseDown={(evento) => evento.stopPropagation()}
        onSubmit={submeterFormulario}
      >
        <header className="cabecalhoModalFornecedor">
          <div className="cabecalhoModalCotacao">
            <div>
              <h2 id="tituloModalOrdemCompra">
                {somenteLeitura ? 'Consultar ordem de compra' : ordemCompra ? 'Editar ordem de compra' : 'Incluir ordem de compra'}
              </h2>
            </div>
            {ordemCompra?.idOrdemCompra ? <CodigoRegistro valor={ordemCompra.idOrdemCompra} /> : null}
          </div>

          <div className="acoesCabecalhoModalFornecedor">
            <Botao variante="secundario" type="button" onClick={tentarFecharModal} disabled={salvando}>
              {somenteLeitura ? 'Fechar' : 'Cancelar'}
            </Botao>
            {!somenteLeitura ? (
              <Botao variante="primario" type="submit" disabled={salvando}>
                {salvando ? 'Salvando...' : 'Salvar'}
              </Botao>
            ) : null}
          </div>
        </header>

        <div className="abasModalFornecedor" role="tablist" aria-label="Secoes da ordem de compra">
          {abasModalOrdemCompra.map((aba) => (
            <button
              key={aba.id}
              type="button"
              role="tab"
              className={`abaModalFornecedor abaModalFornecedor ${abaAtiva === aba.id ? 'ativa' : ''}`}
              aria-selected={abaAtiva === aba.id}
              onClick={() => definirAbaAtiva(aba.id)}
            >
              {aba.label}
            </button>
          ))}
        </div>

        <div className="corpoModalFornecedor corpoModalFornecedor corpoModalCotacaoAbas">
          {abaAtiva === 'dadosGerais' ? (
            <section className="layoutModalCotacaoAba">
              <div className="linhaCotacaoDatas">
                <CampoFormulario label="Data de inclusao" name="dataInclusao" type="date" value={formulario.dataInclusao} onChange={alterarCampo} disabled={somenteLeitura} />
                <CampoFormulario label="Data de entrega" name="dataEntrega" type="date" value={formulario.dataEntrega} onChange={alterarCampo} disabled={somenteLeitura} />
                {modoInclusao ? (
                  <CampoSelect
                    label="Usuario do registro"
                    name="idUsuario"
                    value={formulario.idUsuario}
                    onChange={alterarCampo}
                    options={usuariosAtivos.map((usuario) => ({
                      valor: String(usuario.idUsuario),
                      label: usuario.nome
                    }))}
                    disabled={somenteLeitura}
                  />
                ) : (
                  <CampoFormulario label="Usuario do registro" name="nomeUsuarioSnapshot" value={formulario.nomeUsuarioSnapshot} disabled />
                )}
              </div>

              <div className="linhaFornecedorContatoAtendimento">
                {modoInclusao ? (
                  <>
                    <CampoSelect
                      label="Fornecedor"
                      name="idFornecedor"
                      data-atalho-busca-id="fornecedor"
                      referenciaCampo={referenciaCampoFornecedor}
                      value={formulario.idFornecedor}
                      onChange={alterarCampo}
                        options={fornecedoresAtivos.map((fornecedor) => ({
                          valor: String(fornecedor.idFornecedor),
                          label: montarRotuloFornecedor(fornecedor, empresa)
                        }))}
                        disabled={somenteLeitura}
                        acaoExtra={!somenteLeitura ? (
                        <Botao
                          variante="secundario"
                          type="button"
                          icone="pesquisa"
                          className="botaoCampoAcao"
                          somenteIcone
                          title="Buscar fornecedor"
                          aria-label="Buscar fornecedor"
                          data-atalho-busca-id="fornecedor"
                          onClick={abrirModalBuscaFornecedor}
                        >
                          Buscar fornecedor
                        </Botao>
                      ) : null}
                    />
                    <CampoSelect
                      label="Contato"
                      name="idContato"
                      data-atalho-busca-id="contato"
                      referenciaCampo={referenciaCampoContato}
                      value={formulario.idContato}
                      onChange={alterarCampo}
                      options={contatosDoFornecedor.map((contato) => ({
                        valor: String(contato.idContato),
                        label: formatarNomeContato(contato)
                      }))}
                      disabled={somenteLeitura || !formulario.idFornecedor}
                      acaoExtra={!somenteLeitura && formulario.idFornecedor ? (
                        <Botao
                          variante="secundario"
                          type="button"
                          icone="pesquisa"
                          className="botaoCampoAcao"
                          somenteIcone
                          title="Buscar contato"
                          aria-label="Buscar contato"
                          data-atalho-busca-id="contato"
                          onClick={abrirModalBuscaContato}
                        >
                          Buscar contato
                        </Botao>
                      ) : null}
                    />
                  </>
                ) : (
                  <>
                    <CampoFormulario label="Fornecedor" name="nomeFornecedorSnapshot" value={formulario.nomeFornecedorSnapshot} disabled />
                    <CampoFormulario label="Contato" name="nomeContatoSnapshot" value={formulario.nomeContatoSnapshot} disabled />
                  </>
                )}
              </div>

              <div className="linhaCotacaoComercial">
                {modoInclusao ? (
                  <>
                    {compradorBloqueado ? (
                      <CampoFormulario
                        label="Comprador"
                        name="nomeCompradorBloqueado"
                        value={nomeCompradorSelecionado}
                        disabled
                      />
                    ) : (
                      <CampoSelect
                        label="Comprador"
                        name="idComprador"
                        value={formulario.idComprador}
                        onChange={alterarCampo}
                        options={compradoresAtivos.map((comprador) => ({
                          valor: String(comprador.idComprador),
                          label: comprador.nome
                        }))}
                        disabled={somenteLeitura}
                      />
                    )}
                    <CampoSelect
                      label="Prazo de pagamento"
                      name="idPrazoPagamento"
                      value={formulario.idPrazoPagamento}
                      onChange={alterarCampo}
                      options={prazosAtivos.map((prazo) => ({
                        valor: String(prazo.idPrazoPagamento),
                        label: prazo.descricaoFormatada || prazo.descricao || 'Prazo'
                      }))}
                      disabled={somenteLeitura}
                      acaoExtra={!somenteLeitura && aoSalvarPrazoPagamento ? (
                        <Botao
                          variante="secundario"
                          type="button"
                          icone="pesquisa"
                          className="botaoCampoAcao"
                          somenteIcone
                          title="Abrir prazos de pagamento"
                          aria-label="Abrir prazos de pagamento"
                          onClick={abrirModalPrazosPagamento}
                        />
                      ) : null}
                    />
                    <CampoSelect
                      label="Tipo de ordem de compra"
                      name="idTipoOrdemCompra"
                      value={formulario.idTipoOrdemCompra}
                      onChange={alterarCampo}
                      options={tiposOrdemCompraAtivos.map((tipoOrdemCompra) => ({
                        valor: String(tipoOrdemCompra.idTipoOrdemCompra),
                        label: tipoOrdemCompra.descricao
                      }))}
                      disabled={somenteLeitura}
                    />
                  </>
                ) : (
                  <>
                    <CampoFormulario label="Comprador" name="nomeCompradorSnapshot" value={formulario.nomeCompradorSnapshot} disabled />
                    <CampoFormulario label="Prazo de pagamento" name="nomePrazoPagamentoSnapshot" value={formulario.nomePrazoPagamentoSnapshot} disabled />
                    <CampoFormulario label="Tipo de ordem de compra" name="nomeTipoOrdemCompraSnapshot" value={formulario.nomeTipoOrdemCompraSnapshot} disabled />
                  </>
                )}
              </div>

              <div className="linhaCotacaoFechamento">
                <CampoSelect
                  label="Etapa da ordem de compra"
                  name="idEtapaOrdemCompra"
                  value={formulario.idEtapaOrdemCompra}
                  onChange={alterarCampo}
                  options={etapasOrdemCompraNormalizadas.map((etapa) => ({
                    valor: String(etapa.idEtapaOrdemCompra),
                    label: etapa.descricao
                  }))}
                  disabled={somenteLeitura}
                />
                <CampoFormulario label="Total" name="totalOrdemCompra" value={normalizarPreco(totalOrdemCompra)} disabled />
              </div>
            </section>
          ) : null}

          {abaAtiva === 'itens' ? (
            <section className="layoutModalCotacaoAba layoutModalCotacaoAbaItens">
              <section className="painelItensCotacao">
                <div className="cabecalhoItensCotacao">
                  <h3>Itens da ordem de compra</h3>
                  {!somenteLeitura ? (
                    <Botao variante="secundario" type="button" onClick={() => {
                      abrirNovoItem();
                    }}>
                      Adicionar item
                    </Botao>
                  ) : null}
                </div>

                <GradePadrao
                  className="gradeContatosModal gradeItensCotacaoRolavel"
                  classNameTabela="tabelaContatosModal tabelaItensCotacao"
                  classNameMensagem="mensagemTabelaContatosModal"
                  cabecalho={(
                    <tr>
                      <th>Foto</th>
                      <th>Codigo</th>
                      <th>Produto</th>
                      <th>Quantidade</th>
                      <th>Valor unitario</th>
                      <th>Total</th>
                      <th>Observacao</th>
                      <th className="cabecalhoAcoesContato">Acoes</th>
                    </tr>
                  )}
                  temItens={formulario.itens.length > 0}
                  mensagemVazia="Nenhum item informado."
                >
                  {formulario.itens.map((item, indice) => {
                    const imagemItem = item.imagem || '';
                    const apresentacaoProduto = montarApresentacaoProdutoOrdemCompra(item, empresa);

                    return (
                      <tr key={`${item.idItemOrdemCompra || indice}-${indice}`}>
                        <td>
                          {imagemItem ? (
                            <img src={imagemItem} alt={item.descricaoProdutoSnapshot || 'Item da ordem de compra'} className="miniaturaItemCotacao" />
                          ) : (
                            <div className="miniaturaItemCotacaoPlaceholder">
                              {obterIniciaisItemOrdemCompra(item)}
                            </div>
                          )}
                        </td>
                        <td><CodigoRegistro valor={item.idProduto || 0} /></td>
                        <td>
                          <div className="produtoGradeItemOrdemCompra">
                            <strong>{apresentacaoProduto.principal}</strong>
                            {apresentacaoProduto.secundario ? (
                              <span>{apresentacaoProduto.secundario}</span>
                            ) : null}
                          </div>
                        </td>
                        <td>{item.quantidade}</td>
                        <td>{normalizarPreco(item.valorUnitario)}</td>
                        <td>{normalizarPreco(item.valorTotal)}</td>
                        <td>{item.observacao || 'Sem observacao'}</td>
                        <td className="celulaAcoesUsuarios">
                          <div className="acoesContatoModal">
                            <Botao
                              variante="secundario"
                              type="button"
                              icone={somenteLeitura ? 'consultar' : 'editar'}
                              somenteIcone
                              title={somenteLeitura ? 'Consultar item' : 'Editar item'}
                              aria-label={somenteLeitura ? 'Consultar item' : 'Editar item'}
                              onClick={() => abrirEdicaoItem(item, indice)}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </GradePadrao>
              </section>
              <div className="resumoTotalItensCotacao resumoTotalItensCotacaoRodape">
                <span className="rotuloResumoTotalItensCotacao">Total dos itens</span>
                <strong className="valorResumoTotalItensCotacao">{normalizarPreco(totalOrdemCompra)}</strong>
              </div>
            </section>
          ) : null}

          {abaAtiva === 'outros' ? (
            <section className="layoutModalCotacaoAba">
              <div className="linhaCotacaoComercial">
                <CampoFormulario
                  label="Cotacao vinculado"
                  name="cotacaoOrigemOrdemCompra"
                  value={formulario.codigoCotacaoOrigem
                    ? `#${String(formulario.codigoCotacaoOrigem).padStart(4, '0')}`
                    : ''}
                  placeholder="Sem cotacao vinculado"
                  disabled
                />
              </div>

              <div className="linhaCotacaoFechamento">
              </div>
            </section>
          ) : null}

          {abaAtiva === 'campos' ? (
            <section className="layoutModalCotacaoAba layoutModalCotacaoCampos">
              <div className="campoFormulario campoFormularioIntegral">
                <label htmlFor="observacaoOrdemCompra">Observacao da ordem de compra</label>
                <textarea
                  id="observacaoOrdemCompra"
                  name="observacao"
                  className="entradaFormulario entradaFormularioTextoCurto"
                  rows={2}
                  value={formulario.observacao}
                  onChange={alterarCampo}
                  disabled={somenteLeitura}
                />
              </div>

              {formulario.camposExtras.length > 0 ? (
                <section className="painelCamposExtrasCotacao">
                  <div className="listaCamposExtrasCotacao">
                    {formulario.camposExtras.map((campo, indice) => (
                      <div key={`${campo.idCampoOrdemCompra || indice}-${indice}`} className="campoFormulario campoFormularioIntegral">
                        <label htmlFor={`campoOrdemCompra${campo.idCampoOrdemCompra || indice}`}>{campo.tituloSnapshot || campo.titulo || `Campo ${indice + 1}`}</label>
                        <textarea
                          id={`campoOrdemCompra${campo.idCampoOrdemCompra || indice}`}
                          className="entradaFormulario entradaFormularioTextoCurto"
                          rows={2}
                          value={campo.valor || ''}
                          onChange={(evento) => alterarCampoExtra(indice, evento.target.value)}
                          disabled={somenteLeitura}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              ) : null}
            </section>
          ) : null}
        </div>

        <MensagemErroPopup mensagem={mensagemErro} titulo="Nao foi possivel salvar o ordemCompra." />
      </form>

      {confirmandoSaida ? (
          <div className="camadaConfirmacaoModal" role="presentation" onMouseDown={() => definirConfirmandoSaida(false)}>
            <div
              className="modalConfirmacaoAgenda"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="tituloConfirmacaoSaidaOrdemCompra"
              onMouseDown={(evento) => evento.stopPropagation()}
            >
              <div className="cabecalhoConfirmacaoModal">
                <h4 id="tituloConfirmacaoSaidaOrdemCompra">Cancelar cadastro</h4>
              </div>
              <div className="corpoConfirmacaoModal">
                <p>Se fechar agora, todas as informacoes preenchidas serao perdidas.</p>
              </div>
              <div className="acoesConfirmacaoModal">
                <Botao variante="secundario" type="button" onClick={() => definirConfirmandoSaida(false)}>Nao</Botao>
                <Botao variante="perigo" type="button" onClick={confirmarSaida}>Sim</Botao>
              </div>
            </div>
          </div>
        ) : null}

      <ModalItemProduto
          aberto={modalItemAberto}
          titulo={somenteLeitura ? 'Consultar item da ordem de compra' : 'Editar item da ordem de compra'}
          somenteLeitura={somenteLeitura}
          itemFormulario={itemFormulario}
          produtos={produtosAtivos}
          mensagemErro={mensagemErroItem}
          modalBuscaProdutoAberto={modalBuscaProdutoAberto}
          onFechar={fecharModalItem}
          onSalvar={salvarItem}
          onAlterarCampo={alterarItemCampo}
          onAlterarImagem={definirImagemItem}
          onAbrirBuscaProduto={abrirModalBuscaProduto}
          onFecharBuscaProduto={fecharModalBuscaProduto}
          onSelecionarProduto={selecionarProdutoBusca}
          obterIniciais={obterIniciaisItemOrdemCompra}
      />

      <ModalFornecedor
          aberto={modalFornecedorAberto}
          fornecedor={null}
          empresa={empresa}
          codigoSugerido={proximoCodigoFornecedor}
          contatos={[]}
          compradores={compradores}
          ramosAtividade={ramosAtividade}
          conceitosFornecedor={conceitosFornecedor}
          modo="novo"
          classNameCamada="camadaModal camadaModalSecundaria"
          idCompradorBloqueado={idCompradorBloqueado}
          aoFechar={fecharModalNovoFornecedor}
          aoSalvar={salvarNovoFornecedor}
      />

      <ModalBuscaFornecedores
          aberto={modalBuscaFornecedorAberto}
          empresa={empresa}
          fornecedores={fornecedoresAtivos}
          rotuloAcaoPrimaria={aoIncluirFornecedor ? 'Incluir fornecedor' : ''}
          tituloAcaoPrimaria={aoIncluirFornecedor ? 'Incluir fornecedor' : ''}
          iconeAcaoPrimaria="adicionar"
          aoAcionarPrimaria={aoIncluirFornecedor
            ? () => {
              fecharModalBuscaFornecedor();
              abrirModalNovoFornecedor();
            }
            : null}
          aoSelecionar={selecionarFornecedor}
          aoFechar={fecharModalBuscaFornecedor}
      />

      <ModalBuscaContatos
          aberto={modalBuscaContatoAberto}
          idFornecedor={formulario.idFornecedor}
          contatos={contatosDoFornecedor}
          aoCriarContato={registrarContatoCriado}
          aoSelecionar={selecionarContato}
          aoFechar={fecharModalBuscaContato}
      />

      <ModalPrazosPagamento
          aberto={modalPrazosPagamentoAberto}
          prazosPagamento={prazosPagamento}
          metodosPagamento={metodosPagamento}
          somenteConsulta={somenteConsultaPrazos}
          fecharAoSalvar
          aoFechar={fecharModalPrazosPagamento}
          aoSalvar={aoSalvarPrazoPagamento}
          aoInativar={aoInativarPrazoPagamento}
          aoSelecionarPrazo={async (prazo) => {
            selecionarPrazoPagamento(prazo);
          }}
      />

    </div>
  );
}

function CampoFormulario({ label, name, type = 'text', ...props }) {
  return (
    <div className="campoFormulario">
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} className="entradaFormulario" {...props} />
    </div>
  );
}

function montarApresentacaoProdutoOrdemCompra(item, empresa) {
  const destaque = normalizarDestaqueItemCotacaoPdf(empresa?.destaqueItemCotacaoPdf);
  const referencia = String(item?.referenciaProdutoSnapshot || '').trim();
  const descricao = String(item?.descricaoProdutoSnapshot || '').trim() || 'Produto nao informado';

  if (destaque === 'referencia' && referencia) {
    return {
      principal: referencia,
      secundario: descricao
    };
  }

  return {
    principal: descricao,
    secundario: referencia || ''
  };
}

function normalizarDestaqueItemCotacaoPdf(valor) {
  return String(valor || '').trim() === 'referencia' ? 'referencia' : 'descricao';
}

function CampoFormularioComAcao({ label, name, acaoExtra = null, ...props }) {
  return (
    <div className="campoFormulario">
      <label htmlFor={name}>{label}</label>
      <div className={`campoSelectComAcao ${acaoExtra ? 'temAcao' : ''}`.trim()}>
        <input id={name} name={name} type="text" className="entradaFormulario" {...props} />
        {acaoExtra ? <div className="acoesCampoSelect">{acaoExtra}</div> : null}
      </div>
    </div>
  );
}

function CampoSelect({ label, name, options, acaoExtra = null, referenciaCampo = null, ...props }) {
  return (
    <div className="campoFormulario">
      <label htmlFor={name}>{label}</label>
      <div className={`campoSelectComAcao ${acaoExtra ? 'temAcao' : ''}`.trim()}>
        <select id={name} name={name} className="entradaFormulario" ref={referenciaCampo} {...props}>
          <option value="">Selecione</option>
          {options.map((option, indice) => (
            <option key={`${option.valor ?? option.label ?? 'opcao'}-${indice}`} value={option.valor ?? ''}>
              {option.label}
            </option>
          ))}
        </select>
        {acaoExtra ? <div className="acoesCampoSelect">{acaoExtra}</div> : null}
      </div>
    </div>
  );
}

function criarFormularioInicialOrdemCompra(
  ordemCompra,
  usuarioLogado,
  camposOrdemCompra,
  empresa,
  usuarios = [],
  compradores = [],
  { novo = !ordemCompra, idCompradorBloqueado = null } = {}
) {
  const ordemCompraOriginadoDeCotacao = Boolean(ordemCompra?.idCotacao);
  const idTipoOrdemCompraInicial = ordemCompra?.idTipoOrdemCompra
    ? String(ordemCompra.idTipoOrdemCompra)
    : ordemCompraOriginadoDeCotacao
      ? String(ID_TIPO_ORDEM_COMPRA_VENDA)
      : '';
  const nomeTipoOrdemCompraInicial = ordemCompra?.nomeTipoOrdemCompraSnapshot || (ordemCompraOriginadoDeCotacao ? 'Ordem de compra' : '');
  const compradorPadraoUsuario = obterCompradorPadrao(
    usuarioLogado?.idUsuario,
    usuarios,
    compradores,
    idCompradorBloqueado
  );

  if (!ordemCompra || novo) {
    return {
      ...estadoInicialFormulario,
      idCotacao: ordemCompra?.idCotacao ? String(ordemCompra.idCotacao) : '',
      idFornecedor: ordemCompra?.idFornecedor ? String(ordemCompra.idFornecedor) : '',
      idContato: ordemCompra?.idContato ? String(ordemCompra.idContato) : '',
      idUsuario: String(ordemCompra?.idUsuario || usuarioLogado?.idUsuario || ''),
      idComprador: ordemCompra?.idComprador ? String(ordemCompra.idComprador) : compradorPadraoUsuario.idComprador,
      idPrazoPagamento: ordemCompra?.idPrazoPagamento ? String(ordemCompra.idPrazoPagamento) : '',
      idTipoOrdemCompra: idTipoOrdemCompraInicial,
      dataInclusao: ordemCompra?.dataInclusao || obterDataAtualFormatoInput(),
      dataEntrega: ordemCompra?.dataEntrega || somarDiasNaData(
        ordemCompra?.dataInclusao || obterDataAtualFormatoInput(),
        Number(empresa?.diasEntregaOrdemCompra ?? 7)
      ),
      nomeFornecedorSnapshot: ordemCompra?.nomeFornecedorSnapshot || '',
      nomeContatoSnapshot: ordemCompra?.nomeContatoSnapshot || '',
      nomeUsuarioSnapshot: ordemCompra?.nomeUsuarioSnapshot || usuarioLogado?.nome || '',
      nomeCompradorSnapshot: ordemCompra?.nomeCompradorSnapshot || compradorPadraoUsuario.nomeComprador,
      nomeMetodoPagamentoSnapshot: ordemCompra?.nomeMetodoPagamentoSnapshot || '',
      nomePrazoPagamentoSnapshot: ordemCompra?.nomePrazoPagamentoSnapshot || '',
      nomeTipoOrdemCompraSnapshot: nomeTipoOrdemCompraInicial,
      idEtapaOrdemCompra: ordemCompra?.idEtapaOrdemCompra ? String(ordemCompra.idEtapaOrdemCompra) : '',
      nomeEtapaOrdemCompraSnapshot: ordemCompra?.nomeEtapaOrdemCompraSnapshot || '',
      observacao: ordemCompra?.observacao || '',
      codigoCotacaoOrigem: ordemCompra?.codigoCotacaoOrigem || '',
      itens: Array.isArray(ordemCompra?.itens) ? ordemCompra.itens.map((item) => ({
        idItemOrdemCompra: item.idItemOrdemCompra,
        idProduto: item.idProduto,
        descricaoProdutoSnapshot: item.descricaoProdutoSnapshot || '',
        referenciaProdutoSnapshot: item.referenciaProdutoSnapshot || '',
        unidadeProdutoSnapshot: item.unidadeProdutoSnapshot || '',
        quantidade: String(item.quantidade || ''),
        valorUnitario: item.valorUnitario ? normalizarPreco(item.valorUnitario) : '',
        valorTotal: item.valorTotal ? normalizarPreco(item.valorTotal) : '',
        imagem: item.imagem || '',
        observacao: item.observacao || ''
      })) : [],
      camposExtras: Array.isArray(ordemCompra?.camposExtras) && ordemCompra.camposExtras.length > 0
        ? ordemCompra.camposExtras.map((campo) => ({
          idCampoOrdemCompra: campo.idCampoOrdemCompra || null,
          tituloSnapshot: campo.tituloSnapshot || campo.titulo || '',
          valor: campo.valor || ''
        }))
        : Array.isArray(camposOrdemCompra)
          ? camposOrdemCompra
            .filter((campo) => campo.status !== 0)
            .map((campo) => ({
              idCampoOrdemCompra: campo.idCampoOrdemCompra,
              tituloSnapshot: campo.titulo,
              valor: campo.descricaoPadrao || ''
            }))
          : []
    };
  }

  return {
    ...estadoInicialFormulario,
    idCotacao: ordemCompra.idCotacao ? String(ordemCompra.idCotacao) : '',
    idFornecedor: ordemCompra.idFornecedor ? String(ordemCompra.idFornecedor) : '',
    idContato: ordemCompra.idContato ? String(ordemCompra.idContato) : '',
    idUsuario: ordemCompra.idUsuario ? String(ordemCompra.idUsuario) : '',
    idComprador: ordemCompra.idComprador ? String(ordemCompra.idComprador) : '',
    idPrazoPagamento: ordemCompra.idPrazoPagamento ? String(ordemCompra.idPrazoPagamento) : '',
    idTipoOrdemCompra: idTipoOrdemCompraInicial,
    dataInclusao: ordemCompra.dataInclusao || '',
    dataEntrega: ordemCompra.dataEntrega || ordemCompra.dataValidade || '',
    nomeFornecedorSnapshot: ordemCompra.nomeFornecedorSnapshot || '',
    nomeContatoSnapshot: ordemCompra.nomeContatoSnapshot || '',
    nomeUsuarioSnapshot: ordemCompra.nomeUsuarioSnapshot || '',
    nomeCompradorSnapshot: ordemCompra.nomeCompradorSnapshot || '',
    nomeMetodoPagamentoSnapshot: ordemCompra.nomeMetodoPagamentoSnapshot || '',
    nomePrazoPagamentoSnapshot: ordemCompra.nomePrazoPagamentoSnapshot || '',
    nomeTipoOrdemCompraSnapshot: nomeTipoOrdemCompraInicial,
    idEtapaOrdemCompra: ordemCompra.idEtapaOrdemCompra ? String(ordemCompra.idEtapaOrdemCompra) : '',
    nomeEtapaOrdemCompraSnapshot: ordemCompra.nomeEtapaOrdemCompraSnapshot || '',
    observacao: ordemCompra.observacao || '',
    codigoCotacaoOrigem: ordemCompra.codigoCotacaoOrigem || '',
    itens: Array.isArray(ordemCompra.itens) ? ordemCompra.itens.map((item) => ({
      idItemOrdemCompra: item.idItemOrdemCompra,
      idProduto: item.idProduto,
      descricaoProdutoSnapshot: item.descricaoProdutoSnapshot || '',
      referenciaProdutoSnapshot: item.referenciaProdutoSnapshot || '',
      unidadeProdutoSnapshot: item.unidadeProdutoSnapshot || '',
      quantidade: String(item.quantidade || ''),
      valorUnitario: item.valorUnitario ? normalizarPreco(item.valorUnitario) : '',
      valorTotal: item.valorTotal ? normalizarPreco(item.valorTotal) : '',
      imagem: item.imagem || '',
      observacao: item.observacao || ''
    })) : [],
    camposExtras: Array.isArray(ordemCompra.camposExtras) ? ordemCompra.camposExtras.map((campo) => ({
      idCampoOrdemCompra: campo.idCampoOrdemCompra || null,
      tituloSnapshot: campo.tituloSnapshot || '',
      valor: campo.valor || ''
    })) : []
  };
}

function obterCompradorPadraoPorUsuarioId(idUsuario, usuarios = [], compradores = []) {
  const usuario = usuarios.find((item) => String(item.idUsuario) === String(idUsuario || ''));
  const idComprador = usuario?.idComprador ? String(usuario.idComprador) : '';
  const comprador = compradores.find((item) => String(item.idComprador) === idComprador);

  return {
    idComprador,
    nomeComprador: comprador?.nome || '',
  };
}

function obterCompradorPadrao(idUsuario, usuarios = [], compradores = [], idCompradorBloqueado = null) {
  if (idCompradorBloqueado) {
    const comprador = compradores.find((item) => String(item.idComprador) === String(idCompradorBloqueado));

    return {
      idComprador: String(idCompradorBloqueado),
      nomeComprador: comprador?.nome || '',
      };
  }

  return obterCompradorPadraoPorUsuarioId(idUsuario, usuarios, compradores);
}

function obterDataAtualFormatoInput() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');

  return `${ano}-${mes}-${dia}`;
}

function etapaOrdemCompraEhEntregue(idEtapaOrdemCompra) {
  return Number(idEtapaOrdemCompra) === ID_ETAPA_ORDEM_COMPRA_ENTREGUE;
}

function somarDiasNaData(dataBase, dias) {
  if (!dataBase) {
    return '';
  }

  const [ano, mes, dia] = String(dataBase).split('-').map(Number);
  const diasNormalizados = Number.isFinite(Number(dias)) ? Number(dias) : 0;
  const data = new Date(ano, (mes || 1) - 1, dia || 1);

  if (Number.isNaN(data.getTime())) {
    return dataBase;
  }

  data.setDate(data.getDate() + diasNormalizados);

  const proximoAno = data.getFullYear();
  const proximoMes = String(data.getMonth() + 1).padStart(2, '0');
  const proximoDia = String(data.getDate()).padStart(2, '0');

  return `${proximoAno}-${proximoMes}-${proximoDia}`;
}

function calcularTotalItem(quantidade, valorUnitario) {
  const numeroQuantidade = Number(String(quantidade ?? '').replace(',', '.'));
  const numeroValorUnitario = converterPrecoParaNumero(valorUnitario);

  if (!numeroQuantidade || numeroValorUnitario === null) {
    return '';
  }

  return desformatarPreco(numeroQuantidade * numeroValorUnitario);
}

function formatarPrecoInput(valor) {
  const numero = converterPrecoParaNumero(valor);
  return numero === null ? '' : desformatarPreco(numero);
}

function agendarFocoCampo(referenciaCampo) {
  window.setTimeout(() => {
    referenciaCampo?.current?.focus?.({ preventScroll: true });
  }, 0);
}

function obterIniciaisItemOrdemCompra(item) {
  const descricao = item?.descricaoProdutoSnapshot || 'Item';
  const partes = String(descricao).trim().split(/\s+/).filter(Boolean);
  const iniciais = partes.slice(0, 2).map((parte) => parte[0]).join('');
  return (iniciais || 'IT').toUpperCase();
}

function combinarContatosDoFornecedor(contatosBase, contatosLocais, idFornecedor) {
  return combinarContatosUnicos(
    (Array.isArray(contatosBase) ? contatosBase : []).filter(
      (contato) => String(contato.idFornecedor) === String(idFornecedor)
    ),
    (Array.isArray(contatosLocais) ? contatosLocais : []).filter(
      (contato) => String(contato.idFornecedor) === String(idFornecedor)
    )
  );
}

function obterProximoCodigoFornecedor(fornecedores) {
  if (!Array.isArray(fornecedores) || fornecedores.length === 0) {
    return 1;
  }

  const maiorCodigo = fornecedores.reduce((maior, fornecedor) => {
    const codigoAtual = Number(fornecedor?.idFornecedor);
    return Number.isFinite(codigoAtual) && codigoAtual > maior ? codigoAtual : maior;
  }, 0);

  return maiorCodigo + 1;
}

function montarRotuloFornecedor(fornecedor, empresa) {
  const codigo = formatarCodigoFornecedor(fornecedor, empresa);
  const nome = fornecedor?.nomeFantasia || fornecedor?.razaoSocial || 'Fornecedor sem nome';
  const localizacao = [fornecedor?.cidade, fornecedor?.estado].filter(Boolean).join('/');

  return localizacao ? `${codigo} - ${nome} - ${localizacao}` : `${codigo} - ${nome}`;
}

function combinarContatosUnicos(contatosBase, contatosExtras) {
  const mapa = new Map();

  [...(Array.isArray(contatosBase) ? contatosBase : []), ...(Array.isArray(contatosExtras) ? contatosExtras : [])]
    .forEach((contato) => {
      if (!contato?.idContato) {
        return;
      }

      mapa.set(String(contato.idContato), contato);
    });

  return Array.from(mapa.values());
}

