import { useEffect, useMemo, useRef, useState } from 'react';
import { Botao } from '../comuns/botao';
import { CodigoRegistro } from '../comuns/codigoRegistro';
import { GradePadrao } from '../comuns/gradePadrao';
import { ModalBuscaFornecedores } from '../comuns/modalBuscaFornecedores';
import { ModalBuscaContatos } from '../comuns/modalBuscaContatos';
import { ModalItemProduto } from '../comuns/modalItemProduto';
import { PopupAvisos } from '../comuns/popupAvisos';
import { MensagemErroPopup } from '../comuns/mensagemErroPopup';
import { ModalPrazosPagamento } from './configuracoes-modalPrazosPagamento';
import { ModalFornecedor as ModalFornecedor } from './fornecedores-modalFornecedor';
import { formatarNomeContato } from '../../utilitarios/formatarNomeContato';
import { useFormularioItemProduto } from '../../hooks/useFormularioItemProduto';
import {
  converterPrecoParaNumero,
  desformatarPreco,
  normalizarPreco,
} from '../../utilitarios/normalizarPreco';
import { normalizarValorEntradaFormulario } from '../../utilitarios/normalizarTextoFormulario';
import { desktopTemExportacaoPdf } from '../../servicos/desktop';
import { exportarCotacaoPdf } from '../../utilitarios/cotacoes/exportarCotacaoPdf';
import { abrirEmailCotacao } from '../../utilitarios/cotacoes/abrirEmailCotacao';
import { formatarCodigoFornecedor } from '../../utilitarios/codigoFornecedor';
import { obterEtapasCotacaoParaInputManual } from '../../utilitarios/etapasCotacao';

const abasModalCotacao = [
  { id: 'dadosGerais', label: 'Dados gerais' },
  { id: 'itens', label: 'Itens' },
  { id: 'outros', label: 'Outros' },
  { id: 'campos', label: 'Campos da cotacao' }
];

const ID_ETAPA_COTACAO_FECHAMENTO = 1;
const IDS_ETAPAS_COTACAO_FECHADAS = new Set([1, 2, 3, 4]);

const estadoInicialFormulario = {
  dataInclusao: '',
  dataValidade: '',
  dataFechamento: '',
  idFornecedor: '',
  idContato: '',
  idUsuario: '',
  nomeUsuario: '',
  idComprador: '',
  idPrazoPagamento: '',
  idEtapaCotacao: '',
  idOrdemCompraVinculado: '',
  solicitarOrdemCompraAoSalvar: false,
  observacao: '',
  itens: [],
  camposExtras: []
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

export function ModalCotacao({
  aberto,
  cotacao,
  fornecedores = [],
  contatos = [],
  usuarios = [],
  compradores = [],
  ramosAtividade = [],
  conceitosFornecedor = [],
  metodosPagamento = [],
  prazosPagamento = [],
  etapasCotacao = [],
  produtos = [],
  camposCotacao = [],
  camposOrdemCompra = [],
  empresa,
  usuarioLogado,
  modo = 'novo',
  idCompradorBloqueado = null,
  somenteConsultaPrazos = false,
  aoIncluirFornecedor,
  aoFechar,
  aoSalvar,
  aoSalvarPrazoPagamento,
  aoInativarPrazoPagamento
}) {
  const [formulario, definirFormulario] = useState(estadoInicialFormulario);
  const [abaAtiva, definirAbaAtiva] = useState(abasModalCotacao[0].id);
  const [salvando, definirSalvando] = useState(false);
  const [gerandoPdf, definirGerandoPdf] = useState(false);
  const [gerandoEmail, definirGerandoEmail] = useState(false);
  const [mensagemErro, definirMensagemErro] = useState('');
  const [avisosPopup, definirAvisosPopup] = useState([]);
  const [confirmandoSaida, definirConfirmandoSaida] = useState(false);
  const [confirmandoFechamento, definirConfirmandoFechamento] = useState(false);
  const [idEtapaAnteriorFechamento, definirIdEtapaAnteriorFechamento] = useState('');
  const [idEtapaPendenteFechamento, definirIdEtapaPendenteFechamento] = useState('');
  const [modalBuscaFornecedorAberto, definirModalBuscaFornecedorAberto] = useState(false);
  const [modalFornecedorAberto, definirModalFornecedorAberto] = useState(false);
  const [modalBuscaContatoAberto, definirModalBuscaContatoAberto] = useState(false);
  const referenciaCampoFornecedor = useRef(null);
  const referenciaCampoContato = useRef(null);
  const [contatosCriadosLocalmente, definirContatosCriadosLocalmente] = useState([]);
  const [modalPrazosPagamentoAberto, definirModalPrazosPagamentoAberto] = useState(false);
  const somenteLeitura = modo === 'consulta';
  const modoInclusao = modo === 'novo';
  const modoEdicao = modo === 'edicao';
  const compradorBloqueado = Boolean(idCompradorBloqueado);
  const listaFornecedores = Array.isArray(fornecedores) ? fornecedores : fornecedores;
  const fornecedoresAtivos = listaFornecedores.filter((fornecedor) => fornecedor.status !== 0);
  const contatosAtivos = contatos.filter((contato) => contato.status !== 0);
  const usuariosAtivos = usuarios.filter((usuario) => usuario.ativo !== 0);
  const compradoresAtivos = compradores.filter((comprador) => comprador.status !== 0);
  const prazosAtivos = prazosPagamento.filter((prazo) => prazo.status !== 0);
  const etapasAtivas = useMemo(
    () => ordenarEtapasPorOrdem(etapasCotacao.filter((etapa) => etapa.status !== 0), 'idEtapaCotacao'),
    [etapasCotacao]
  );
  const etapasDisponiveisEscolhaManual = useMemo(
    () => obterEtapasCotacaoParaInputManual(etapasAtivas, formulario.idEtapaCotacao),
    [etapasAtivas, formulario.idEtapaCotacao]
  );
  const produtosAtivos = produtos.filter((produto) => produto.status !== 0);
  const exportacaoPdfDisponivel = desktopTemExportacaoPdf();
  const contatosDoFornecedor = useMemo(
    () => combinarContatosDoFornecedor(contatosAtivos, contatosCriadosLocalmente, formulario.idFornecedor),
    [contatosAtivos, contatosCriadosLocalmente, formulario.idFornecedor]
  );
  const proximoCodigoFornecedor = useMemo(
    () => obterProximoCodigoFornecedor(listaFornecedores),
    [listaFornecedores]
  );
  const etapaSelecionada = etapasAtivas.find((etapa) => String(etapa.idEtapaCotacao) === String(formulario.idEtapaCotacao));
  const etapaAtualEhFechada = etapaCotacaoEhFechadoPorId(formulario.idEtapaCotacao);
  const totalCotacao = useMemo(
    () => formulario.itens.reduce((total, item) => total + (converterPrecoParaNumero(item.valorTotal) || 0), 0),
    [formulario.itens]
  );
  const nomeCompradorSelecionado = useMemo(
    () => compradoresAtivos.find((item) => String(item.idComprador) === String(formulario.idComprador || ''))?.nome || '',
    [compradoresAtivos, formulario.idComprador]
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
    salvarItem,
    removerItem
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
    normalizarQuantidade,
    exigirProduto: true
  });

  useEffect(() => {
    if (!aberto) {
      return;
    }

    definirFormulario(
      criarFormularioInicial(
        cotacao,
        usuarioLogado,
        camposCotacao,
        empresa,
        usuariosAtivos,
        compradoresAtivos,
        idCompradorBloqueado
      )
    );
    definirAbaAtiva(abasModalCotacao[0].id);
    definirSalvando(false);
    definirGerandoPdf(false);
    definirGerandoEmail(false);
    definirMensagemErro('');
    definirAvisosPopup([]);
    definirConfirmandoSaida(false);
    definirConfirmandoFechamento(false);
    definirIdEtapaAnteriorFechamento('');
    definirIdEtapaPendenteFechamento('');
    definirModalBuscaFornecedorAberto(false);
    definirModalBuscaContatoAberto(false);
    definirContatosCriadosLocalmente([]);
    definirModalPrazosPagamentoAberto(false);
    redefinirItemModal();
  }, [aberto, cotacao, usuarioLogado, camposCotacao, empresa]);

  useEffect(() => {
    if (avisosPopup.length === 0) {
      return undefined;
    }

    const temporizadores = avisosPopup.map((aviso) => window.setTimeout(() => {
      definirAvisosPopup((estadoAtual) => estadoAtual.filter((item) => item.id !== aviso.id));
    }, 12000));

    return () => {
      temporizadores.forEach((temporizador) => window.clearTimeout(temporizador));
    };
  }, [avisosPopup]);

  useEffect(() => {
    if (!aberto) {
      return undefined;
    }

    function tratarTecla(evento) {
      if (evento.key !== 'Escape' || salvando || gerandoPdf) {
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

      if (confirmandoFechamento) {
        cancelarConfirmacaoFechamento();
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
  }, [aberto, confirmandoFechamento, confirmandoSaida, gerandoPdf, modalBuscaFornecedorAberto, modalBuscaContatoAberto, modalBuscaProdutoAberto, modalFornecedorAberto, modalItemAberto, modalPrazosPagamentoAberto, salvando]);

  if (!aberto) {
    return null;
  }

  function alterarCampo(evento) {
    const { name, value } = evento.target;
    const valorNormalizado = normalizarValorEntradaFormulario(evento);

    if (name === 'idEtapaCotacao') {
      const etapaAtual = etapasAtivas.find((item) => String(item.idEtapaCotacao) === String(formulario.idEtapaCotacao || ''));
      const proximaEtapa = etapasAtivas.find((item) => String(item.idEtapaCotacao) === String(value || ''));

      if (
        !somenteLeitura
        && !formulario.idOrdemCompraVinculado
        && !etapaCotacaoEhFechamento(etapaAtual)
        && etapaCotacaoEhFechamento(proximaEtapa)
      ) {
        definirIdEtapaAnteriorFechamento(String(formulario.idEtapaCotacao || ''));
        definirIdEtapaPendenteFechamento(String(value || ''));
        definirConfirmandoFechamento(true);
        return;
      }
    }

    definirFormulario((estadoAtual) => {
      const entrouEmEtapaFechada = name === 'idEtapaCotacao'
        && !etapaCotacaoEhFechadoPorId(estadoAtual.idEtapaCotacao)
        && etapaCotacaoEhFechadoPorId(value);
      const proximoEstado = {
        ...estadoAtual,
        ...(name === 'idFornecedor' ? { idContato: '' } : {}),
        [name]: valorNormalizado,
        ...(entrouEmEtapaFechada && !estadoAtual.dataFechamento
          ? { dataFechamento: obterDataAtualFormatoInput() }
          : {})
      };

      if (name === 'idFornecedor') {
        proximoEstado.idContato = '';
      }

      if (name === 'idUsuario') {
        const compradorPadrao = obterCompradorPadrao(
          value,
          usuariosAtivos,
          compradoresAtivos,
          idCompradorBloqueado
        );
        proximoEstado.idComprador = compradorPadrao.idComprador;
      }

      if (name === 'idComprador' && !compradorBloqueado) {
        const comprador = compradoresAtivos.find((item) => String(item.idComprador) === String(value));
      }

      if (name === 'idEtapaCotacao') {
        proximoEstado.solicitarOrdemCompraAoSalvar = false;
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

  async function submeterFormulario(evento) {
    evento.preventDefault();

    await salvarFormulario();
  }

  async function salvarFormulario(formularioAtual = formulario) {
    const etapaAtualEhFechadaAtual = etapaCotacaoEhFechadoPorId(formularioAtual.idEtapaCotacao);

    if (somenteLeitura) {
      return;
    }

    if (!String(formularioAtual.idFornecedor || '').trim()) {
      definirMensagemErro('Selecione o fornecedor da cotacao.');
      return;
    }

    if (!String(formularioAtual.idComprador || '').trim()) {
      definirMensagemErro('Selecione o comprador.');
      return;
    }

    if (formularioAtual.itens.length === 0) {
      definirMensagemErro('Inclua ao menos um item na cotacao.');
      return;
    }

    if (etapaAtualEhFechadaAtual && !String(formularioAtual.dataFechamento || '').trim()) {
      definirMensagemErro('Informe a data de fechamento para esta etapa da cotacao.');
      return;
    }


    definirSalvando(true);
    definirMensagemErro('');

    try {
      await aoSalvar(formularioAtual);
    } catch (erro) {
      definirMensagemErro(erro.message || 'Nao foi possivel salvar a cotacao.');
      definirSalvando(false);
    }
  }

  async function gerarPdfFormularioAtual() {
    if (gerandoPdf) {
      return;
    }

    if (!String(formulario.idFornecedor || '').trim()) {
      adicionarAvisoCotacao('erro', 'Nao foi possivel gerar o PDF.', 'Selecione o fornecedor antes de exportar o PDF da cotacao.');
      definirAbaAtiva('dadosGerais');
      return;
    }

    if (!Array.isArray(formulario.itens) || formulario.itens.length === 0) {
      adicionarAvisoCotacao('erro', 'Nao foi possivel gerar o PDF.', 'Inclua ao menos um item antes de exportar o PDF da cotacao.');
      definirAbaAtiva('itens');
      return;
    }

    definirGerandoPdf(true);

    try {
      const resultado = await exportarCotacaoPdf({
        formulario,
        cotacao,
        fornecedores,
        contatos,
        usuarios,
        compradores,
        prazosPagamento,
        etapasCotacao,
        produtos,
        empresa,
        camposOrdemCompra
      });

      if (resultado.cancelado) {
        return;
      }

      if (!resultado.sucesso) {
        adicionarAvisoCotacao('erro', 'Nao foi possivel gerar o PDF.', resultado.mensagem || 'Nao foi possivel exportar o PDF da cotacao.');
        return;
      }

      adicionarAvisoCotacao('sucesso', 'PDF gerado com sucesso.', '');
    } catch (erro) {
      adicionarAvisoCotacao('erro', 'Nao foi possivel gerar o PDF.', erro.message || 'Nao foi possivel exportar o PDF da cotacao.');
    } finally {
      definirGerandoPdf(false);
    }
  }

  async function gerarEmailFormularioAtual() {
    if (gerandoEmail) {
      return;
    }

    if (!String(formulario.idFornecedor || '').trim()) {
      adicionarAvisoCotacao('erro', 'Nao foi possivel gerar o e-mail.', 'Selecione o fornecedor antes de abrir o e-mail da cotacao.');
      definirAbaAtiva('dadosGerais');
      return;
    }

    if (!Array.isArray(formulario.itens) || formulario.itens.length === 0) {
      adicionarAvisoCotacao('erro', 'Nao foi possivel gerar o e-mail.', 'Inclua ao menos um item antes de abrir o e-mail da cotacao.');
      definirAbaAtiva('itens');
      return;
    }

    definirGerandoEmail(true);

    try {
      const resultado = await abrirEmailCotacao({
        formulario,
        cotacao,
        fornecedores,
        contatos,
        usuarios,
        compradores,
        empresa
      });

      if (!resultado.sucesso) {
        adicionarAvisoCotacao('erro', 'Nao foi possivel gerar o e-mail.', resultado.mensagem || 'Nao foi possivel abrir o Outlook Web com a cotacao.');
        return;
      }

      adicionarAvisoCotacao('sucesso', 'E-mail aberto com sucesso.', 'O Outlook Web foi aberto com a cotacao preenchida.');
    } catch (erro) {
      adicionarAvisoCotacao('erro', 'Nao foi possivel gerar o e-mail.', erro.message || 'Nao foi possivel abrir o Outlook Web com a cotacao.');
    } finally {
      definirGerandoEmail(false);
    }
  }

  function adicionarAvisoCotacao(tipo, titulo, mensagem) {
    const id = `cotacao-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    definirAvisosPopup((estadoAtual) => ([
      {
        id,
        icone: tipo === 'sucesso' ? 'confirmar' : 'alerta',
        titulo,
        mensagem: mensagem || undefined
      },
      ...estadoAtual
    ].slice(0, 4)));
  }

  function tentarFecharModal() {
    if (!somenteLeitura && modoInclusao) {
      definirConfirmandoSaida(true);
      return;
    }

    aoFechar();
  }

  function confirmarFechamento() {
    const proximoFormulario = {
      ...formulario,
      idEtapaCotacao: idEtapaPendenteFechamento,
      dataFechamento: formulario.dataFechamento || obterDataAtualFormatoInput(),
      solicitarOrdemCompraAoSalvar: true
    };

    definirFormulario(proximoFormulario);
    definirConfirmandoFechamento(false);
    definirIdEtapaAnteriorFechamento('');
    definirIdEtapaPendenteFechamento('');

    salvarFormulario(proximoFormulario);
  }

  function cancelarConfirmacaoFechamento() {
    definirFormulario((estadoAtual) => ({
      ...estadoAtual,
      idEtapaCotacao: idEtapaAnteriorFechamento,
      solicitarOrdemCompraAoSalvar: false
    }));
    definirConfirmandoFechamento(false);
    definirIdEtapaAnteriorFechamento('');
    definirIdEtapaPendenteFechamento('');
  }

  function confirmarSaida() {
    definirConfirmandoSaida(false);
    aoFechar();
  }

  function fecharAoClicarNoFundo(evento) {
    if (evento.target === evento.currentTarget && !salvando) {
      tentarFecharModal();
    }
  }

  function abrirModalBuscaFornecedor() {
    if (somenteLeitura || salvando) {
      return;
    }

    definirModalBuscaFornecedorAberto(true);
  }

  function abrirModalNovoFornecedor() {
    if (somenteLeitura || salvando || !aoIncluirFornecedor) {
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
    if (somenteLeitura || salvando || !formulario.idFornecedor) {
      return;
    }

    definirModalBuscaContatoAberto(true);
  }

  function fecharModalBuscaContato() {
    definirModalBuscaContatoAberto(false);
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

  function selecionarPrazoPagamento(prazo) {
    if (!prazo?.idPrazoPagamento) {
      return;
    }

    definirFormulario((estadoAtual) => ({
      ...estadoAtual,
      idPrazoPagamento: String(prazo.idPrazoPagamento)
    }));
  }

  function selecionarFornecedor(fornecedor) {
    if (!fornecedor) {
      return;
    }

    definirFormulario((estadoAtual) => {
      return {
        ...estadoAtual,
        idFornecedor: String(fornecedor.idFornecedor),
        idContato: ''
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
      idContato: String(contato.idContato)
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

  async function salvarNovoFornecedor(dadosFornecedor) {
    const fornecedorCriado = await aoIncluirFornecedor(dadosFornecedor);

    selecionarFornecedor(fornecedorCriado);
    definirModalFornecedorAberto(false);
  }

  return (
    <div className="camadaModal camadaModalSecundaria" role="presentation" onMouseDown={fecharAoClicarNoFundo}>
      <form
        className="modalFornecedor modalFornecedor modalFornecedorComAbas modalCotacao"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tituloModalCotacao"
        onMouseDown={(evento) => evento.stopPropagation()}
        onSubmit={submeterFormulario}
      >
        <header className="cabecalhoModalFornecedor">
          <div className="cabecalhoModalCotacao">
            <div>
              <h2 id="tituloModalCotacao">
                {somenteLeitura ? 'Consultar cotacao' : modoEdicao ? 'Editar cotacao' : 'Incluir cotacao'}
              </h2>
            </div>
            {cotacao?.idCotacao ? <CodigoRegistro valor={cotacao.idCotacao} /> : null}
          </div>

          <div className="acoesCabecalhoModalFornecedor">
            <Botao
              variante="secundario"
              type="button"
              onClick={gerarPdfFormularioAtual}
              disabled={salvando || gerandoPdf}
              title={exportacaoPdfDisponivel ? 'Gerar PDF da cotacao' : 'Abrir impressao para salvar como PDF no navegador'}
            >
              {gerandoPdf ? 'Gerando PDF...' : 'Gerar PDF'}
            </Botao>
            <Botao
              variante="secundario"
              type="button"
              onClick={gerarEmailFormularioAtual}
              disabled={salvando || gerandoEmail}
              title="Gerar e-mail da cotacao"
            >
              {gerandoEmail ? 'Gerando e-mail...' : 'Gerar e-mail'}
            </Botao>
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

        <div className="abasModalFornecedor" role="tablist" aria-label="Secoes da cotacao">
          {abasModalCotacao.map((aba) => (
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
                <CampoFormulario
                  label="Data de inclusao"
                  name="dataInclusao"
                  type="date"
                  value={formulario.dataInclusao}
                  onChange={alterarCampo}
                  disabled={somenteLeitura}
                  required
                />
                <CampoFormulario
                  label={etapaAtualEhFechada ? 'Data de fechamento' : 'Data de validade'}
                  name={etapaAtualEhFechada ? 'dataFechamento' : 'dataValidade'}
                  type="date"
                  value={etapaAtualEhFechada ? formulario.dataFechamento : formulario.dataValidade}
                  onChange={alterarCampo}
                  disabled={somenteLeitura}
                  required={etapaAtualEhFechada}
                />
                <CampoFormulario
                  label="Usuario do registro"
                  name="nomeUsuario"
                  value={formulario.nomeUsuario}
                  disabled
                />
              </div>

              <div className="linhaFornecedorContatoAtendimento">
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
                  required
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
                    />
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
                    />
                  ) : null}
                />
              </div>

              <div className="linhaCotacaoComercial">
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
                    required
                  />
                )}
                <CampoSelect
                  label="Prazo de pagamento"
                  name="idPrazoPagamento"
                  value={formulario.idPrazoPagamento}
                  onChange={alterarCampo}
                  options={prazosAtivos.map((prazo) => ({
                    valor: String(prazo.idPrazoPagamento),
                    label: prazo.descricaoFormatada
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
              </div>

              <div className="linhaCotacaoFechamento">
                <CampoSelect
                  label="Etapa da cotacao"
                  name="idEtapaCotacao"
                  value={formulario.idEtapaCotacao}
                  onChange={alterarCampo}
                  options={etapasDisponiveisEscolhaManual.map((etapa) => ({
                    valor: String(etapa.idEtapaCotacao),
                    label: etapa.descricao
                  }))}
                  disabled={somenteLeitura || Boolean(formulario.idOrdemCompraVinculado)}
                />
                <CampoFormulario
                  label="Total"
                  name="totalCotacao"
                  value={normalizarPreco(totalCotacao)}
                  disabled
                />
              </div>

            </section>
          ) : null}

          {abaAtiva === 'itens' ? (
            <section className="layoutModalCotacaoAba layoutModalCotacaoAbaItens">
              <section className="painelItensCotacao">
                <div className="cabecalhoItensCotacao">
                  <h3>Itens da cotacao</h3>
                  {!somenteLeitura ? (
                    <Botao variante="secundario" type="button" onClick={abrirNovoItem}>
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
                    const apresentacaoProduto = montarApresentacaoProdutoCotacao(item, empresa);

                    return (
                      <tr key={`${item.idItemCotacao || indice}-${indice}`}>
                        <td>
                          {imagemItem ? (
                            <img src={imagemItem} alt={item.descricaoProdutoSnapshot || 'Item da cotacao'} className="miniaturaItemCotacao" />
                          ) : (
                            <div className="miniaturaItemCotacaoPlaceholder">
                              {obterIniciaisItemCotacao(item)}
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
                            {!somenteLeitura ? (
                              <Botao
                                variante="secundario"
                                type="button"
                                icone="limpar"
                                somenteIcone
                                title="Remover item"
                                aria-label="Remover item"
                                onClick={() => removerItem(indice)}
                              />
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </GradePadrao>

              </section>
              <div className="resumoTotalItensCotacao resumoTotalItensCotacaoRodape">
                <span className="rotuloResumoTotalItensCotacao">Total dos itens</span>
                <strong className="valorResumoTotalItensCotacao">{normalizarPreco(totalCotacao)}</strong>
              </div>
            </section>
          ) : null}

          {abaAtiva === 'outros' ? (
            <section className="layoutModalCotacaoAba">
              <div className="linhaCotacaoComercial">
                <CampoFormulario
                  label="Ordem de Compra vinculado"
                  name="ordemCompraVinculadoCotacao"
                  value={formulario.idOrdemCompraVinculado
                    ? `#${String(formulario.idOrdemCompraVinculado).padStart(4, '0')}`
                    : ''}
                  placeholder="Sem ordem de compra vinculado"
                  disabled
                />
              </div>

            </section>
          ) : null}

          {abaAtiva === 'campos' ? (
            <section className="layoutModalCotacaoAba layoutModalCotacaoCampos">
              <div className="campoFormulario campoFormularioIntegral">
                <label htmlFor="observacaoCotacao">Observacao da cotacao</label>
                <textarea
                  id="observacaoCotacao"
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
                      <div key={campo.idCampoCotacao} className="campoFormulario campoFormularioIntegral">
                        <label htmlFor={`campoCotacao${campo.idCampoCotacao}`}>{campo.titulo}</label>
                        <textarea
                          id={`campoCotacao${campo.idCampoCotacao}`}
                          className="entradaFormulario entradaFormularioTextoCurto"
                          rows={2}
                          value={campo.valor}
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

        <MensagemErroPopup mensagem={mensagemErro} titulo="Nao foi possivel salvar a cotacao." />
      </form>

      {confirmandoSaida ? (
          <div className="camadaConfirmacaoModal" role="presentation" onMouseDown={() => definirConfirmandoSaida(false)}>
            <div
              className="modalConfirmacaoAgenda"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="tituloConfirmacaoSaidaCotacao"
              onMouseDown={(evento) => evento.stopPropagation()}
            >
              <div className="cabecalhoConfirmacaoModal">
                <h4 id="tituloConfirmacaoSaidaCotacao">Cancelar cadastro</h4>
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
          placeholder="Pesquisar fornecedores"
          ariaLabelPesquisa="Pesquisar fornecedores"
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
          placeholder="Pesquisar contatos do fornecedor"
          ariaLabelPesquisa="Pesquisar contatos do fornecedor"
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

      <PopupAvisos
          avisos={avisosPopup}
          aoFechar={(idAviso) => {
            definirAvisosPopup((estadoAtual) => estadoAtual.filter((aviso) => aviso.id !== idAviso));
          }}
      />

      <ModalItemProduto
          aberto={modalItemAberto}
          titulo={somenteLeitura ? 'Consultar item da cotacao' : 'Editar item da cotacao'}
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
          obterIniciais={obterIniciaisItemCotacao}
      />

      {confirmandoFechamento ? (
          <div className="camadaConfirmacaoModal" role="presentation" onMouseDown={cancelarConfirmacaoFechamento}>
            <div
              className="modalConfirmacaoAgenda"
              role="dialog"
              aria-modal="true"
              aria-labelledby="tituloConfirmacaoFechamentoCotacao"
              onMouseDown={(evento) => evento.stopPropagation()}
            >
              <div className="cabecalhoConfirmacaoModal">
                <h4 id="tituloConfirmacaoFechamentoCotacao">Fechar cotacao</h4>
              </div>

              <div className="corpoConfirmacaoModal">
                <p>Ao salvar com a etapa de fechamento, sera necessario gerar um ordemCompra. Deseja manter esta etapa?</p>
              </div>

              <div className="acoesConfirmacaoModal">
                <Botao variante="secundario" type="button" onClick={cancelarConfirmacaoFechamento}>
                  Nao
                </Botao>
                <Botao variante="primario" type="button" onClick={confirmarFechamento}>
                  Sim
                </Botao>
              </div>
            </div>
          </div>
        ) : null}
    </div>
  );
}

function etapaCotacaoEhFechamento(etapa) {
  return Number(etapa?.idEtapaCotacao) === ID_ETAPA_COTACAO_FECHAMENTO;
}

function etapaCotacaoEhFechadoPorId(idEtapaCotacao) {
  return IDS_ETAPAS_COTACAO_FECHADAS.has(Number(idEtapaCotacao));
}

function CampoFormulario({ label, name, type = 'text', ...props }) {
  return (
    <div className="campoFormulario">
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} className="entradaFormulario" {...props} />
    </div>
  );
}

function montarApresentacaoProdutoCotacao(item, empresa) {
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

function CampoSelect({ label, name, options, className = '', acaoExtra = null, referenciaCampo = null, ...props }) {
  return (
    <div className={`campoFormulario ${className}`.trim()}>
      <label htmlFor={name}>{label}</label>
      <div className={`campoSelectComAcao ${acaoExtra ? 'temAcao' : ''}`.trim()}>
        <select id={name} name={name} className="entradaFormulario" ref={referenciaCampo} {...props}>
          <option value="">Selecione</option>
          {options.map((option) => (
            <option key={option.valor} value={option.valor}>
              {option.label}
            </option>
          ))}
        </select>
        {acaoExtra}
      </div>
    </div>
  );
}

function agendarFocoCampo(referenciaCampo) {
  window.setTimeout(() => {
    referenciaCampo?.current?.focus?.({ preventScroll: true });
  }, 0);
}

function criarFormularioInicial(cotacao, usuarioLogado, camposCotacao, empresa, usuarios = [], compradores = [], idCompradorBloqueado = null) {
  const camposExtrasRegistro = Array.isArray(cotacao?.camposExtras) ? cotacao.camposExtras : [];
  const camposRegistroPorId = new Map(
    camposExtrasRegistro.map((campo) => [String(campo.idCampoCotacao), campo.valor || ''])
  );
  const configuracoesAtivas = camposCotacao.filter((campo) => campo.status !== 0);
  const camposMesclados = [
    ...configuracoesAtivas,
    ...camposExtrasRegistro
      .filter((campo) => !configuracoesAtivas.some((configuracao) => String(configuracao.idCampoCotacao) === String(campo.idCampoCotacao)))
      .map((campo) => ({
        idCampoCotacao: campo.idCampoCotacao,
        titulo: campo.titulo || `Campo ${campo.idCampoCotacao}`,
        descricaoPadrao: ''
      }))
  ];
  const compradorPadraoUsuario = obterCompradorPadrao(
    usuarioLogado?.idUsuario,
    usuarios,
    compradores,
    idCompradorBloqueado
  );

  if (!cotacao) {
    return {
      ...estadoInicialFormulario,
      dataInclusao: obterDataAtualFormatoInput(),
      dataValidade: somarDiasNaData(
        obterDataAtualFormatoInput(),
        Number(empresa?.diasValidadeCotacao ?? 7)
      ),
      dataFechamento: '',
      solicitarOrdemCompraAoSalvar: false,
      idUsuario: String(usuarioLogado?.idUsuario || ''),
      nomeUsuario: usuarioLogado?.nome || '',
      idComprador: compradorPadraoUsuario.idComprador,
      camposExtras: camposMesclados.map((campo) => ({
        idCampoCotacao: campo.idCampoCotacao,
        titulo: campo.titulo,
        valor: campo.descricaoPadrao || ''
      }))
    };
  }

  return {
    ...estadoInicialFormulario,
    dataInclusao: cotacao.dataInclusao || obterDataAtualFormatoInput(),
    dataValidade: cotacao.dataValidade || '',
    dataFechamento: cotacao.dataFechamento || '',
    idFornecedor: normalizarValorFormulario(cotacao.idFornecedor),
    idContato: normalizarValorFormulario(cotacao.idContato),
    idUsuario: normalizarValorFormulario(cotacao.idUsuario || usuarioLogado?.idUsuario),
    nomeUsuario: cotacao.nomeUsuario || usuarioLogado?.nome || '',
    idComprador: normalizarValorFormulario(cotacao.idComprador),
    idPrazoPagamento: normalizarValorFormulario(cotacao.idPrazoPagamento),
    idEtapaCotacao: normalizarValorFormulario(cotacao.idEtapaCotacao),
    idOrdemCompraVinculado: normalizarValorFormulario(cotacao.idOrdemCompraVinculado),
    solicitarOrdemCompraAoSalvar: false,
    observacao: cotacao.observacao || '',
    itens: Array.isArray(cotacao.itens) ? cotacao.itens.map((item) => ({
      idItemCotacao: item.idItemCotacao,
      idProduto: item.idProduto,
      descricaoProdutoSnapshot: item.descricaoProdutoSnapshot || item.nomeProduto || '',
      referenciaProdutoSnapshot: item.referenciaProdutoSnapshot || '',
      unidadeProdutoSnapshot: item.unidadeProdutoSnapshot || '',
      quantidade: String(item.quantidade || ''),
      valorUnitario: item.valorUnitario ? normalizarPreco(item.valorUnitario) : '',
      valorTotal: item.valorTotal ? normalizarPreco(item.valorTotal) : '',
      imagem: item.imagem || '',
      observacao: item.observacao || ''
    })) : [],
    camposExtras: camposMesclados.map((campo) => ({
      idCampoCotacao: campo.idCampoCotacao,
      titulo: campo.titulo,
      valor: camposRegistroPorId.has(String(campo.idCampoCotacao))
        ? camposRegistroPorId.get(String(campo.idCampoCotacao))
        : (campo.descricaoPadrao || '')
    }))
  };
}

function obterCompradorPadraoPorUsuarioId(idUsuario, usuarios = [], compradores = []) {
  const usuario = usuarios.find((item) => String(item.idUsuario) === String(idUsuario || ''));
  const idComprador = usuario?.idComprador ? String(usuario.idComprador) : '';
  const comprador = compradores.find((item) => String(item.idComprador) === idComprador);

  return {
    idComprador,
  };
}

function obterCompradorPadrao(idUsuario, usuarios = [], compradores = [], idCompradorBloqueado = null) {
  if (idCompradorBloqueado) {
    const comprador = compradores.find((item) => String(item.idComprador) === String(idCompradorBloqueado));

    return {
      idComprador: String(idCompradorBloqueado),
      };
  }

  return obterCompradorPadraoPorUsuarioId(idUsuario, usuarios, compradores);
}

function montarRotuloFornecedor(fornecedor, empresa) {
  const codigo = formatarCodigoFornecedor(fornecedor, empresa);
  const nome = fornecedor.nomeFantasia || fornecedor.razaoSocial || 'Fornecedor sem nome';
  const localizacao = [fornecedor.cidade, fornecedor.estado].filter(Boolean).join('/');

  return localizacao ? `${codigo} - ${nome} - ${localizacao}` : `${codigo} - ${nome}`;
}

function obterDataAtualFormatoInput() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');

  return `${ano}-${mes}-${dia}`;
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

function normalizarValorFormulario(valor) {
  if (valor === null || valor === undefined || valor === '' || Number(valor) <= 0) {
    return '';
  }

  return String(valor);
}

function formatarPrecoInput(valor) {
  const numero = converterPrecoParaNumero(valor);
  return numero === null ? '' : desformatarPreco(numero);
}

function ordenarEtapasPorOrdem(etapas, chaveId) {
  if (!Array.isArray(etapas)) {
    return [];
  }

  return [...etapas].sort((etapaA, etapaB) => {
    const ordemA = obterValorOrdemEtapa(etapaA?.ordem, etapaA?.[chaveId]);
    const ordemB = obterValorOrdemEtapa(etapaB?.ordem, etapaB?.[chaveId]);

    if (ordemA !== ordemB) {
      return ordemA - ordemB;
    }

    return Number(etapaA?.[chaveId] || 0) - Number(etapaB?.[chaveId] || 0);
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

function normalizarQuantidade(valor) {
  const numero = Number(String(valor ?? '').replace(',', '.'));
  return Number.isNaN(numero) ? 0 : numero;
}

function calcularTotalItem(quantidade, valorUnitario) {
  const numeroQuantidade = normalizarQuantidade(quantidade);
  const numeroValorUnitario = converterPrecoParaNumero(valorUnitario);

  if (!numeroQuantidade || numeroValorUnitario === null) {
    return '';
  }

  return desformatarPreco(numeroQuantidade * numeroValorUnitario);
}

function obterIniciaisItemCotacao(item) {
  const descricao = item?.descricaoProdutoSnapshot || item?.descricao || 'Item';
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

