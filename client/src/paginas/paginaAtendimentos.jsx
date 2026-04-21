import { useEffect, useMemo, useState } from 'react';
import '../recursos/estilos/cabecalhoPagina.css';
import { AcoesRegistro } from '../componentes/comuns/acoesRegistro';
import { Botao } from '../componentes/comuns/botao';
import { CampoPesquisa } from '../componentes/comuns/campoPesquisa';
import { CodigoRegistro } from '../componentes/comuns/codigoRegistro';
import { GradePadrao } from '../componentes/comuns/gradePadrao';
import { ModalBuscaFornecedores } from '../componentes/comuns/modalBuscaFornecedores';
import { ModalFiltros } from '../componentes/comuns/modalFiltros';
import { TextoGradeClamp } from '../componentes/comuns/textoGradeClamp';
import { CorpoPagina } from '../componentes/layout/corpoPagina';
import {
  atualizarAtendimento,
  excluirAtendimento,
  incluirAtendimento,
  listarAtendimentosGrid,
  listarCanaisAtendimento,
  listarOrigensAtendimento,
  listarTiposAtendimento
} from '../servicos/atendimentos';
import {
  incluirFornecedor,
  incluirContato,
  listarFornecedores,
  listarConceitosFornecedor,
  listarContatos,
  listarRamosAtividade,
  listarCompradores
} from '../servicos/fornecedores';
import {
  atualizarPrazoPagamento,
  incluirPrazoPagamento,
  listarCamposOrdemCompraConfiguracao,
  listarCamposCotacaoConfiguracao,
  listarEtapasOrdemCompraConfiguracao,
  listarEtapasCotacaoConfiguracao,
  listarMetodosPagamentoConfiguracao,
  listarPrazosPagamentoConfiguracao,
  listarTiposOrdemCompraConfiguracao
} from '../servicos/configuracoes';
import { atualizarEmpresa, criarPayloadAtualizacaoColunasGrid, listarEmpresas } from '../servicos/empresa';
import {
  atualizarCotacao,
  incluirCotacao,
  listarCotacoes
} from '../servicos/cotacoes';
import { incluirOrdemCompra } from '../servicos/ordensCompra';
import { listarProdutos } from '../servicos/produtos';
import { listarUsuarios } from '../servicos/usuarios';
import {
  normalizarFiltrosPorPadrao,
  normalizarListaFiltroPersistido,
  useFiltrosPersistidos
} from '../hooks/useFiltrosPersistidos';
import { ModalOrdemCompra } from '../componentes/modulos/ordensCompra-modalOrdemCompra';
import { ModalAtendimento } from '../componentes/modulos/atendimentos-modalAtendimento';
import { ModalManualAtendimento } from '../componentes/modulos/atendimentos-modalManualAtendimento';
import {
  normalizarColunasGridAtendimentos,
  TOTAL_COLUNAS_GRID_ATENDIMENTOS
} from '../dados/colunasGridAtendimentos';
import { obterValorGrid } from '../utilitarios/valorPadraoGrid';
import { ModalColunasGridAtendimentos } from '../componentes/modulos/configuracoes-modalColunasGridAtendimentos';

function criarFiltrosIniciaisAtendimentos(usuarioLogado) {
  const idUsuarioPadrao = usuarioLogado?.tipo === 'Usuario padrao' && usuarioLogado?.idUsuario
    ? [String(usuarioLogado.idUsuario)]
    : [];

  return {
    idFornecedor: '',
    idUsuario: idUsuarioPadrao,
    idCompradorFornecedor: [],
    idTipoAtendimento: [],
    idCanalAtendimento: [],
    idOrigemAtendimento: [],
    dataInicio: '',
    dataFim: '',
    horaInicioFiltro: '',
    horaFimFiltro: ''
  };
}

function criarFiltrosLimposAtendimentos() {
  return {
    idFornecedor: '',
    idUsuario: [],
    idCompradorFornecedor: [],
    idTipoAtendimento: [],
    idCanalAtendimento: [],
    idOrigemAtendimento: [],
    dataInicio: '',
    dataFim: '',
    horaInicioFiltro: '',
    horaFimFiltro: ''
  };
}

const ID_ETAPA_COTACAO_FECHAMENTO = 1;
const ID_ETAPA_COTACAO_FECHADO_SEM_ORDEM_COMPRA = 2;
const ID_ETAPA_COTACAO_ORDEM_COMPRA_EXCLUIDO = 3;
const ID_ETAPA_COTACAO_RECUSADO = 4;
const ID_TIPO_ORDEM_COMPRA_VENDA = 1;

export function PaginaAtendimentos({ usuarioLogado }) {
  const [pesquisa, definirPesquisa] = useState('');
  const [atendimentos, definirAtendimentos] = useState([]);
  const [fornecedores, definirFornecedores] = useState([]);
  const [contatos, definirContatos] = useState([]);
  const [usuarios, definirUsuarios] = useState([]);
  const [compradores, definirCompradores] = useState([]);
  const [cotacoes, definirCotacoes] = useState([]);
  const [metodosPagamento, definirMetodosPagamento] = useState([]);
  const [ramosAtividade, definirRamosAtividade] = useState([]);
  const [conceitosFornecedor, definirConceitosFornecedor] = useState([]);
  const [tiposAtendimento, definirTiposAtendimento] = useState([]);
  const [canaisAtendimento, definirCanaisAtendimento] = useState([]);
  const [origensAtendimento, definirOrigensAtendimento] = useState([]);
  const [prazosPagamento, definirPrazosPagamento] = useState([]);
  const [etapasCotacao, definirEtapasCotacao] = useState([]);
  const [etapasOrdemCompra, definirEtapasOrdemCompra] = useState([]);
  const [tiposOrdemCompra, definirTiposOrdemCompra] = useState([]);
  const [produtos, definirProdutos] = useState([]);
  const [camposCotacao, definirCamposCotacao] = useState([]);
  const [camposOrdemCompra, definirCamposOrdemCompra] = useState([]);
  const [empresa, definirEmpresa] = useState(null);
  const [carregando, definirCarregando] = useState(true);
  const [mensagemErro, definirMensagemErro] = useState('');
  const [modalAberto, definirModalAberto] = useState(false);
  const [modalManualAberto, definirModalManualAberto] = useState(false);
  const [modalFiltrosAberto, definirModalFiltrosAberto] = useState(false);
  const [modalColunasGridAberto, definirModalColunasGridAberto] = useState(false);
  const [modalBuscaFornecedorFiltrosAberto, definirModalBuscaFornecedorFiltrosAberto] = useState(false);
  const [filtrosEmEdicao, definirFiltrosEmEdicao] = useState(null);
  const [modalOrdemCompraAberto, definirModalOrdemCompraAberto] = useState(false);
  const [atendimentoSelecionado, definirAtendimentoSelecionado] = useState(null);
  const [dadosIniciaisOrdemCompra, definirDadosIniciaisOrdemCompra] = useState(null);
  const [cotacaoOrdemCompraEmCriacao, definirCotacaoOrdemCompraEmCriacao] = useState(null);
  const [etapaCotacaoAtualizadaExternamente, definirEtapaCotacaoAtualizadaExternamente] = useState(null);
  const [modoModal, definirModoModal] = useState('novo');
  const usuarioSomenteComprador = usuarioLogado?.tipo === 'Usuario padrao' && usuarioLogado?.idComprador;
  const usuarioSomenteConsultaConfiguracao = usuarioLogado?.tipo === 'Usuario padrao';
  const filtrosIniciais = useMemo(
    () => criarFiltrosIniciaisAtendimentos(usuarioLogado),
    [usuarioLogado?.idUsuario, usuarioLogado?.tipo]
  );
  const [filtros, definirFiltros] = useFiltrosPersistidos({
    chave: 'paginaAtendimentos',
    usuario: usuarioLogado,
    filtrosPadrao: filtrosIniciais,
    normalizarFiltros: normalizarFiltrosAtendimentos
  });

  useEffect(() => {
    carregarContexto();
  }, [usuarioSomenteComprador, usuarioLogado?.idComprador]);

  useEffect(() => {
    carregarGradeAtendimentos();
  }, [usuarioSomenteComprador, usuarioLogado?.idComprador, usuarioLogado?.idUsuario, pesquisa, JSON.stringify(filtros)]);

  useEffect(() => {
    function tratarEmpresaAtualizada() {
      carregarContexto();
      carregarGradeAtendimentos();
    }

    window.addEventListener('empresa-atualizada', tratarEmpresaAtualizada);

    return () => {
      window.removeEventListener('empresa-atualizada', tratarEmpresaAtualizada);
    };
  }, [usuarioSomenteComprador, usuarioLogado?.idComprador, usuarioLogado?.idUsuario, pesquisa, JSON.stringify(filtros)]);

  useEffect(() => {
    function tratarAtalhosAtendimentos(evento) {
      if (evento.key === 'F1') {
        evento.preventDefault();

        if (!modalAberto && !modalManualAberto && !modalFiltrosAberto && !modalOrdemCompraAberto) {
          definirModalManualAberto(true);
        }
      }
    }

    window.addEventListener('keydown', tratarAtalhosAtendimentos);

    return () => {
      window.removeEventListener('keydown', tratarAtalhosAtendimentos);
    };
  }, [modalAberto, modalManualAberto, modalFiltrosAberto, modalOrdemCompraAberto]);

  async function carregarContexto() {
    definirCarregando(true);
    definirMensagemErro('');

    try {
      const resultados = await Promise.allSettled([
        listarFornecedores(),
        listarContatos(),
        listarUsuarios(),
        listarCompradores(),
        listarCotacoes(),
        listarRamosAtividade(),
        listarConceitosFornecedor({ incluirInativos: true }),
        listarTiposAtendimento(),
        listarCanaisAtendimento(),
        listarOrigensAtendimento(),
        listarMetodosPagamentoConfiguracao(),
        listarPrazosPagamentoConfiguracao(),
        listarEtapasCotacaoConfiguracao(),
        listarEtapasOrdemCompraConfiguracao(),
        listarTiposOrdemCompraConfiguracao(),
        listarProdutos(),
        listarCamposCotacaoConfiguracao(),
        listarCamposOrdemCompraConfiguracao(),
        listarEmpresas()
      ]);

      const [
        fornecedoresResultado,
        contatosResultado,
        usuariosResultado,
        compradoresResultado,
        cotacoesResultado,
        ramosResultado,
        conceitosResultado,
        tiposAtendimentoResultado,
        canaisResultado,
        origensResultado,
        metodosResultado,
        prazosResultado,
        etapasCotacaoResultado,
        etapasOrdemCompraResultado,
        tiposOrdemCompraResultado,
        produtosResultado,
        camposCotacaoResultado,
        camposOrdemCompraResultado,
        empresasResultado
      ] = resultados;

      const fornecedoresCarregados = fornecedoresResultado.status === 'fulfilled' ? fornecedoresResultado.value : [];
      const contatosCarregados = contatosResultado.status === 'fulfilled' ? contatosResultado.value : [];
      const usuariosCarregados = usuariosResultado.status === 'fulfilled' ? usuariosResultado.value : [];
      const compradoresCarregados = compradoresResultado.status === 'fulfilled' ? compradoresResultado.value : [];
      const cotacoesCarregados = cotacoesResultado.status === 'fulfilled' ? cotacoesResultado.value : [];
      const ramosCarregados = ramosResultado.status === 'fulfilled' ? ramosResultado.value : [];
      const conceitosCarregados = conceitosResultado.status === 'fulfilled' ? conceitosResultado.value : [];
      const tiposAtendimentoCarregados = tiposAtendimentoResultado.status === 'fulfilled' ? tiposAtendimentoResultado.value : [];
      const canaisCarregados = canaisResultado.status === 'fulfilled' ? canaisResultado.value : [];
      const origensCarregadas = origensResultado.status === 'fulfilled' ? origensResultado.value : [];
      const metodosCarregados = metodosResultado.status === 'fulfilled' ? metodosResultado.value : [];
      const prazosCarregados = prazosResultado.status === 'fulfilled' ? prazosResultado.value : [];
      const etapasCotacaoCarregadas = etapasCotacaoResultado.status === 'fulfilled' ? etapasCotacaoResultado.value : [];
      const etapasOrdemCompraCarregadas = etapasOrdemCompraResultado.status === 'fulfilled' ? etapasOrdemCompraResultado.value : [];
      const tiposOrdemCompraCarregados = tiposOrdemCompraResultado.status === 'fulfilled' ? tiposOrdemCompraResultado.value : [];
      const produtosCarregados = produtosResultado.status === 'fulfilled' ? produtosResultado.value : [];
      const camposCotacaoCarregados = camposCotacaoResultado.status === 'fulfilled' ? camposCotacaoResultado.value : [];
      const camposOrdemCompraCarregados = camposOrdemCompraResultado.status === 'fulfilled' ? camposOrdemCompraResultado.value : [];
      const empresasCarregadas = empresasResultado.status === 'fulfilled' ? empresasResultado.value : [];

      const fornecedoresCarteira = usuarioSomenteComprador
        ? fornecedoresCarregados.filter((fornecedor) => fornecedor.idComprador === usuarioLogado.idComprador)
        : fornecedoresCarregados;
      const idsFornecedoresCarteira = new Set(fornecedoresCarteira.map((fornecedor) => fornecedor.idFornecedor));
      const contatosCarteira = contatosCarregados.filter((contato) => idsFornecedoresCarteira.has(contato.idFornecedor));
      definirFornecedores(fornecedoresCarteira);
      definirContatos(contatosCarteira);
      definirUsuarios(usuariosCarregados);
      definirCompradores(compradoresCarregados);
      definirCotacoes(
        enriquecerCotacoesAtendimento(
          cotacoesCarregados,
          fornecedoresCarregados,
          contatosCarregados,
          usuariosCarregados,
          compradoresCarregados,
          enriquecerPrazosPagamento(prazosCarregados, metodosCarregados),
          etapasCotacaoCarregadas,
          produtosCarregados
        ).filter((cotacao) => cotacaoEstaAberto(cotacao))
      );
      definirMetodosPagamento(metodosCarregados);
      definirRamosAtividade(ramosCarregados);
      definirConceitosFornecedor(conceitosCarregados);
      definirTiposAtendimento(tiposAtendimentoCarregados);
      definirCanaisAtendimento(canaisCarregados);
      definirOrigensAtendimento(origensCarregadas);
      definirPrazosPagamento(enriquecerPrazosPagamento(prazosCarregados, metodosCarregados));
      definirEtapasCotacao(etapasCotacaoCarregadas);
      definirEtapasOrdemCompra(etapasOrdemCompraCarregadas.map((etapa) => ({
        ...etapa,
        idEtapaOrdemCompra: etapa.idEtapaOrdemCompra ?? etapa.idEtapa
      })));
      definirTiposOrdemCompra(tiposOrdemCompraCarregados);
      definirProdutos(produtosCarregados.filter((produto) => produto.status !== 0));
      definirCamposCotacao(camposCotacaoCarregados);
      definirCamposOrdemCompra(camposOrdemCompraCarregados);
      definirEmpresa(empresasCarregadas[0] || null);
    } catch (_erro) {
      definirMensagemErro('Nao foi possivel carregar os atendimentos.');
    } finally {
      definirCarregando(false);
    }
  }

  async function carregarGradeAtendimentos() {
    definirCarregando(true);
    definirMensagemErro('');

    try {
      const atendimentosCarregados = await listarAtendimentosGrid({
        pesquisa,
        filtros: {
          ...filtros,
          ...(usuarioSomenteComprador
            ? {
              escopoIdComprador: usuarioLogado?.idComprador,
              escopoIdUsuario: usuarioLogado?.idUsuario
            }
            : {})
        }
      });

      definirAtendimentos(atendimentosCarregados);
    } catch (_erro) {
      definirMensagemErro('Nao foi possivel carregar os atendimentos.');
    } finally {
      definirCarregando(false);
    }
  }

  async function recarregarPagina() {
    await Promise.all([carregarContexto(), carregarGradeAtendimentos()]);
  }

  async function salvarColunasGridAtendimentos(dadosColunas) {
    if (!empresa?.idEmpresa) {
      throw new Error('Cadastre a empresa antes de configurar as colunas do grid.');
    }

    await atualizarEmpresa(
      empresa.idEmpresa,
      criarPayloadAtualizacaoColunasGrid('colunasGridAtendimentos', dadosColunas.colunasGridAtendimentos)
    );

    const empresasAtualizadas = await listarEmpresas();
    definirEmpresa(empresasAtualizadas[0] || null);
    window.dispatchEvent(new CustomEvent('empresa-atualizada'));
    definirModalColunasGridAberto(false);
  }

  async function salvarAtendimento(dadosAtendimento) {
    const estaEditando = modoModal === 'edicao' && Boolean(atendimentoSelecionado?.idAtendimento);
    const horaFimNormalizada = String(dadosAtendimento?.horaFim || '').trim() || obterHoraAtualFormatoInput();

    const payload = normalizarPayloadAtendimento({
      ...dadosAtendimento,
      horaFim: horaFimNormalizada,
      idUsuario: estaEditando ? atendimentoSelecionado.idUsuario : usuarioLogado.idUsuario
    });

    if (estaEditando) {
      await atualizarAtendimento(atendimentoSelecionado.idAtendimento, payload);
    } else {
      await incluirAtendimento(payload);
    }

    await recarregarPagina();
    fecharModal();
  }

  async function incluirFornecedorPeloAtendimento(dadosFornecedor) {
    const payload = normalizarPayloadFornecedorAtendimento({
      ...dadosFornecedor,
      idComprador: usuarioSomenteComprador ? String(usuarioLogado.idComprador) : dadosFornecedor.idComprador
    });

    const fornecedorSalvo = await incluirFornecedor(payload);
    await salvarContatosFornecedorAtendimento(fornecedorSalvo.idFornecedor, dadosFornecedor.contatos || []);
    await recarregarPagina();

    const fornecedoresAtualizados = await listarFornecedores();
    const fornecedorCompleto = fornecedoresAtualizados.find((fornecedor) => fornecedor.idFornecedor === fornecedorSalvo.idFornecedor);

    return fornecedorCompleto || fornecedorSalvo;
  }

  async function incluirCotacaoPeloAtendimento(dadosCotacao) {
    const cotacaoSalvo = await incluirCotacao(normalizarPayloadCotacao(dadosCotacao, usuarioLogado));
    await recarregarPagina();
    return cotacaoSalvo;
  }

  async function atualizarCotacaoPeloAtendimento(dadosCotacao) {
    const payload = normalizarPayloadCotacao(dadosCotacao, usuarioLogado);

    if (!dadosCotacao?.idCotacao) {
      return null;
    }

    const cotacaoSalvo = await atualizarCotacao(dadosCotacao.idCotacao, payload);
    await recarregarPagina();
    return cotacaoSalvo;
  }

  async function salvarPrazoPagamentoPeloAtendimento(dadosPrazo) {
    const payload = normalizarPayloadPrazoPagamento(dadosPrazo);
    const registroSalvo = dadosPrazo?.idPrazoPagamento
      ? await atualizarPrazoPagamento(dadosPrazo.idPrazoPagamento, payload)
      : await incluirPrazoPagamento(payload);

    await recarregarPagina();
    return enriquecerPrazoPagamento(registroSalvo, metodosPagamento);
  }

  async function inativarPrazoPagamentoPeloAtendimento(prazo) {
    if (!prazo?.idPrazoPagamento) {
      return null;
    }

    const registroAtual = prazosPagamento.find(
      (item) => String(item.idPrazoPagamento) === String(prazo.idPrazoPagamento)
    ) || prazo;

    await atualizarPrazoPagamento(
      prazo.idPrazoPagamento,
      normalizarPayloadPrazoPagamento({
        ...registroAtual,
        status: false
      })
    );

    await recarregarPagina();
    return null;
  }

  async function atualizarStatusCotacaoPeloAtendimento({ idCotacao, idEtapaCotacao }) {
    const cotacaoAtual = cotacoes.find((item) => item.idCotacao === idCotacao);

    if (!cotacaoAtual || !idEtapaCotacao || String(cotacaoAtual.idEtapaCotacao) === String(idEtapaCotacao)) {
      return cotacaoAtual || null;
    }

    const cotacaoSalvo = await atualizarCotacao(
      idCotacao,
      normalizarPayloadCotacao(
        {
          ...cotacaoAtual,
          idEtapaCotacao
        },
        usuarioLogado
      )
    );

    await recarregarPagina();
    return cotacaoSalvo;
  }

  function abrirOrdemCompraPeloAtendimento(dadosOrdemCompra, contexto = null) {
    definirCotacaoOrdemCompraEmCriacao(contexto);
    definirDadosIniciaisOrdemCompra(dadosOrdemCompra);
    definirModalOrdemCompraAberto(true);
  }

  async function fecharModalOrdemCompra() {
    if (cotacaoOrdemCompraEmCriacao?.idCotacao) {
      const etapaFechadoSemOrdemCompra = obterEtapaFechadoSemOrdemCompra(etapasCotacao);

      if (etapaFechadoSemOrdemCompra?.idEtapaCotacao) {
        await atualizarStatusCotacaoPeloAtendimento({
          idCotacao: Number(cotacaoOrdemCompraEmCriacao.idCotacao),
          idEtapaCotacao: Number(etapaFechadoSemOrdemCompra.idEtapaCotacao)
        });
        definirEtapaCotacaoAtualizadaExternamente({
          idCotacao: Number(cotacaoOrdemCompraEmCriacao.idCotacao),
          idEtapaCotacao: String(etapaFechadoSemOrdemCompra.idEtapaCotacao)
        });
      }
    }

    definirModalOrdemCompraAberto(false);
    definirDadosIniciaisOrdemCompra(null);
    definirCotacaoOrdemCompraEmCriacao(null);
  }

  async function salvarOrdemCompraPeloAtendimento(dadosOrdemCompra) {
    await incluirOrdemCompra(normalizarPayloadOrdemCompra(dadosOrdemCompra));
    await recarregarPagina();
    definirModalOrdemCompraAberto(false);
    definirDadosIniciaisOrdemCompra(null);
    definirCotacaoOrdemCompraEmCriacao(null);
    definirEtapaCotacaoAtualizadaExternamente(null);
  }

  function abrirNovoAtendimento() {
    definirAtendimentoSelecionado(null);
    definirModoModal('novo');
    definirModalAberto(true);
  }

  function abrirEdicaoAtendimento(atendimento) {
    definirAtendimentoSelecionado(atendimento);
    definirModoModal('edicao');
    definirModalAberto(true);
  }

  function abrirConsultaAtendimento(atendimento) {
    definirAtendimentoSelecionado(atendimento);
    definirModoModal('consulta');
    definirModalAberto(true);
  }

  async function excluirAtendimentoPelaGrade(atendimento) {
    const confirmado = window.confirm(`Deseja realmente excluir o atendimento "${atendimento.assunto}"?`);

    if (!confirmado) {
      return;
    }

    await excluirRegistroAtendimento(atendimento.idAtendimento);
  }

  function fecharModal() {
    definirModalAberto(false);
    definirAtendimentoSelecionado(null);
    definirModoModal('novo');
  }

  async function excluirRegistroAtendimento(idAtendimento) {
    await excluirAtendimento(idAtendimento);
    await recarregarPagina();
    fecharModal();
  }

  function abrirModalFiltrosAtendimentos() {
    definirFiltrosEmEdicao({
      ...filtros,
      idUsuario: Array.isArray(filtros.idUsuario) ? [...filtros.idUsuario] : [],
      idCompradorFornecedor: Array.isArray(filtros.idCompradorFornecedor) ? [...filtros.idCompradorFornecedor] : [],
      idTipoAtendimento: Array.isArray(filtros.idTipoAtendimento) ? [...filtros.idTipoAtendimento] : [],
      idCanalAtendimento: Array.isArray(filtros.idCanalAtendimento) ? [...filtros.idCanalAtendimento] : [],
      idOrigemAtendimento: Array.isArray(filtros.idOrigemAtendimento) ? [...filtros.idOrigemAtendimento] : []
    });
    definirModalFiltrosAberto(true);
  }

  function fecharModalFiltrosAtendimentos() {
    definirModalFiltrosAberto(false);
    definirFiltrosEmEdicao(null);
  }

  const colunasVisiveisAtendimentos = useMemo(
    () => normalizarColunasGridAtendimentos(empresa?.colunasGridAtendimentos),
    [empresa?.colunasGridAtendimentos]
  );
  const filtrosAtivos = JSON.stringify(filtros) !== JSON.stringify(filtrosIniciais);

  return (
    <>
      <header className="cabecalhoPagina">
        <div>
          <h1>Atendimentos</h1>
          <p>Registre e acompanhe os atendimentos comerciais e operacionais do SRM.</p>
        </div>

        <div className="acoesCabecalhoPagina">
          <CampoPesquisa
            valor={pesquisa}
            aoAlterar={definirPesquisa}
            placeholder="Pesquisar atendimentos"
            ariaLabel="Pesquisar atendimentos"
          />
          <Botao
            variante={filtrosAtivos ? 'primario' : 'secundario'}
            icone="filtro"
            somenteIcone
            title="Filtrar"
            aria-label="Filtrar"
            onClick={abrirModalFiltrosAtendimentos}
          />
          <Botao
            variante="secundario"
            icone="configuracoes"
            somenteIcone
            title="Configurar grid"
            aria-label="Configurar grid"
            onClick={() => definirModalColunasGridAberto(true)}
            disabled={usuarioSomenteConsultaConfiguracao || !empresa?.idEmpresa}
          />
          <Botao
            variante="primario"
            icone="adicionar"
            somenteIcone
            title="Novo atendimento"
            aria-label="Novo atendimento"
            onClick={abrirNovoAtendimento}
          />
        </div>
      </header>

      <CorpoPagina>
        <GradePadrao
          modo="layout"
          className="gradePadraoPresetAtendimentos"
          classNameTabela="layoutGradePadraoPresetAtendimentos"
          totalColunasLayout={TOTAL_COLUNAS_GRID_ATENDIMENTOS}
          cabecalho={<CabecalhoGradeAtendimentos colunas={colunasVisiveisAtendimentos} />}
          carregando={carregando}
          mensagemErro={mensagemErro}
          temItens={atendimentos.length > 0}
          mensagemCarregando="Carregando atendimentos..."
          mensagemVazia="Nenhum atendimento encontrado."
        >
          {atendimentos.map((atendimento) => (
            <LinhaAtendimento
              key={atendimento.idAtendimento}
              atendimento={atendimento}
              colunas={colunasVisiveisAtendimentos}
              permitirExcluir={usuarioLogado?.tipo === 'Administrador'}
              aoConsultar={() => abrirConsultaAtendimento(atendimento)}
              aoEditar={() => abrirEdicaoAtendimento(atendimento)}
              aoExcluir={() => excluirAtendimentoPelaGrade(atendimento)}
            />
          ))}
        </GradePadrao>
      </CorpoPagina>

      <ModalFiltros
        aberto={modalFiltrosAberto}
        titulo="Filtros de atendimentos"
        filtros={filtrosEmEdicao || filtros}
        campos={[
          {
            name: 'idFornecedor',
            label: 'Fornecedor',
            acaoExtra: (
              <Botao
                variante="secundario"
                icone="pesquisa"
                type="button"
                className="botaoCampoAcao"
                onClick={() => definirModalBuscaFornecedorFiltrosAberto(true)}
                somenteIcone
                title="Buscar fornecedor"
                aria-label="Buscar fornecedor"
              >
                Buscar fornecedor
              </Botao>
            ),
            options: fornecedores.map((fornecedor) => ({
              valor: String(fornecedor.idFornecedor),
              label: fornecedor.nomeFantasia || fornecedor.razaoSocial
            }))
          },
          {
            name: 'idUsuario',
            label: 'Usuario do registro',
            multiple: true,
            placeholder: 'Todos os usuarios',
            options: usuarios.map((usuario) => ({
              valor: String(usuario.idUsuario),
              label: usuario.nome
            }))
          },
          {
            name: 'idCompradorFornecedor',
            label: 'Fornecedores do comprador',
            multiple: true,
            placeholder: 'Todos os compradores',
            options: compradores.map((comprador) => ({
              valor: String(comprador.idComprador),
              label: comprador.nome
            }))
          },
          {
            name: 'idTipoAtendimento',
            label: 'Tipo de atendimento',
            multiple: true,
            placeholder: 'Todos os tipos',
            options: tiposAtendimento.map((tipoAtendimento) => ({
              valor: String(tipoAtendimento.idTipoAtendimento),
              label: tipoAtendimento.descricao
            }))
          },
          {
            name: 'idCanalAtendimento',
            label: 'Canal',
            multiple: true,
            placeholder: 'Todos os canais',
            options: canaisAtendimento.map((canal) => ({
              valor: String(canal.idCanalAtendimento),
              label: canal.descricao
            }))
          },
          {
            name: 'idOrigemAtendimento',
            label: 'Origem',
            multiple: true,
            placeholder: 'Todas as origens',
            options: origensAtendimento.map((origem) => ({
              valor: String(origem.idOrigemAtendimento),
              label: origem.descricao
            }))
          },
          {
            name: 'periodosDatasAtendimento',
            label: 'Datas',
            type: 'date-filters-modal',
            tituloSelecao: 'Filtros de datas do atendimento',
            placeholder: 'Selecionar datas',
            periodos: [
              {
                titulo: 'Data do atendimento',
                nomeInicio: 'dataInicio',
                nomeFim: 'dataFim',
                labelInicio: 'Inicio da data',
                labelFim: 'Fim da data'
              },
              {
                titulo: 'Horario do atendimento',
                nomeInicio: 'horaInicioFiltro',
                nomeFim: 'horaFimFiltro',
                labelInicio: 'Hora inicial',
                labelFim: 'Hora final',
                tipoInicio: 'time',
                tipoFim: 'time'
              }
            ]
          },
        ]}
        aoFechar={fecharModalFiltrosAtendimentos}
        aoAplicar={(proximosFiltros) => {
          definirFiltros(proximosFiltros);
          fecharModalFiltrosAtendimentos();
        }}
        aoLimpar={() => {
          const filtrosLimpos = criarFiltrosLimposAtendimentos();
          definirFiltrosEmEdicao(filtrosLimpos);
          return filtrosLimpos;
        }}
      />
      <ModalBuscaFornecedores
        aberto={modalBuscaFornecedorFiltrosAberto}
        empresa={empresa}
        fornecedores={fornecedores}
        placeholder="Pesquisar fornecedor no filtro"
        ariaLabelPesquisa="Pesquisar fornecedor no filtro"
        aoSelecionar={(fornecedor) => {
          definirFiltrosEmEdicao((estadoAtual) => ({
            ...(estadoAtual || criarFiltrosIniciaisAtendimentos(usuarioLogado)),
            idFornecedor: String(fornecedor.idFornecedor || '')
          }));
          definirModalBuscaFornecedorFiltrosAberto(false);
        }}
        aoFechar={() => definirModalBuscaFornecedorFiltrosAberto(false)}
      />

      <ModalManualAtendimento
        aberto={modalManualAberto}
        aoFechar={() => definirModalManualAberto(false)}
        atendimentos={atendimentos}
        tiposAtendimento={tiposAtendimento}
        canaisAtendimento={canaisAtendimento}
        origensAtendimento={origensAtendimento}
        cotacoes={cotacoes}
        filtros={filtros}
        usuarioLogado={usuarioLogado}
      />
      <ModalColunasGridAtendimentos
        aberto={modalColunasGridAberto}
        empresa={empresa}
        aoFechar={() => definirModalColunasGridAberto(false)}
        aoSalvar={salvarColunasGridAtendimentos}
      />

      <ModalAtendimento
        aberto={modalAberto}
        atendimento={atendimentoSelecionado}
        fornecedores={fornecedores}
        contatos={contatos}
        usuarioLogado={usuarioLogado}
        compradores={compradores}
        ramosAtividade={ramosAtividade}
        conceitosFornecedor={conceitosFornecedor}
        tiposAtendimento={tiposAtendimento}
        canaisAtendimento={canaisAtendimento}
        origensAtendimento={origensAtendimento}
        modo={modoModal}
        permitirExcluir={usuarioLogado?.tipo === 'Administrador'}
        idCompradorBloqueado={usuarioSomenteComprador ? usuarioLogado.idComprador : null}
        aoIncluirFornecedor={incluirFornecedorPeloAtendimento}
        aoIncluirCotacao={incluirCotacaoPeloAtendimento}
        aoAtualizarCotacao={atualizarCotacaoPeloAtendimento}
        dadosCotacao={montarDadosIniciaisCotacaoPeloAtendimento(atendimentoSelecionado, fornecedores, compradores, usuarioLogado)}
        fornecedoresCotacao={fornecedores}
        contatosCotacao={contatos}
        usuariosCotacao={usuarios}
        compradoresCotacao={compradores}
        metodosPagamento={metodosPagamento}
        prazosPagamento={prazosPagamento}
        etapasCotacao={etapasCotacao}
        cotacoes={cotacoes}
        produtos={produtos}
        camposCotacao={camposCotacao}
        camposOrdemCompra={camposOrdemCompra}
        etapasOrdemCompra={etapasOrdemCompra}
        empresa={empresa}
        somenteConsultaPrazos={usuarioSomenteConsultaConfiguracao}
        etapaCotacaoAtualizadaExternamente={etapaCotacaoAtualizadaExternamente}
        aoAtualizarStatusCotacao={atualizarStatusCotacaoPeloAtendimento}
        aoAbrirOrdemCompra={abrirOrdemCompraPeloAtendimento}
        aoSalvarPrazoPagamento={salvarPrazoPagamentoPeloAtendimento}
        aoInativarPrazoPagamento={inativarPrazoPagamentoPeloAtendimento}
        aoFechar={fecharModal}
        aoSalvar={salvarAtendimento}
        aoExcluir={excluirRegistroAtendimento}
      />

      <ModalOrdemCompra
        aberto={modalOrdemCompraAberto}
        ordemCompra={null}
        dadosIniciais={dadosIniciaisOrdemCompra}
        fornecedores={fornecedores}
        contatos={contatos}
        usuarios={usuarios}
        compradores={compradores}
        ramosAtividade={ramosAtividade}
        conceitosFornecedor={conceitosFornecedor}
        metodosPagamento={metodosPagamento}
        prazosPagamento={prazosPagamento}
        tiposOrdemCompra={tiposOrdemCompra}
        etapasOrdemCompra={etapasOrdemCompra}
        produtos={produtos}
        camposOrdemCompra={camposOrdemCompra}
        empresa={empresa}
        usuarioLogado={usuarioLogado}
        modo="novo"
        idCompradorBloqueado={usuarioSomenteComprador ? usuarioLogado.idComprador : null}
        camadaSecundaria={modalAberto}
        somenteConsultaPrazos={usuarioSomenteConsultaConfiguracao}
        aoIncluirFornecedor={incluirFornecedorPeloAtendimento}
        aoFechar={fecharModalOrdemCompra}
        aoSalvar={salvarOrdemCompraPeloAtendimento}
        aoSalvarPrazoPagamento={salvarPrazoPagamentoPeloAtendimento}
        aoInativarPrazoPagamento={inativarPrazoPagamentoPeloAtendimento}
      />
    </>
  );
}

function CabecalhoGradeAtendimentos({ colunas }) {
  return (
    <div className="cabecalhoLayoutGradePadrao cabecalhoGradeAtendimentos">
      {colunas.map((coluna) => (
        <div
          key={coluna.id}
          className={coluna.classe}
          style={obterEstiloColunaLayout(coluna)}
        >
          {coluna.rotulo}
        </div>
      ))}
    </div>
  );
}

function LinhaAtendimento({ atendimento, colunas, permitirExcluir, aoConsultar, aoEditar, aoExcluir }) {
  return (
    <div className="linhaLayoutGradePadrao linhaAtendimento">
      {colunas.map((coluna) => renderizarCelulaAtendimento({
        coluna,
        atendimento,
        permitirExcluir,
        aoConsultar,
        aoEditar,
        aoExcluir
      }))}
    </div>
  );
}

function renderizarCelulaAtendimento({ coluna, atendimento, permitirExcluir, aoConsultar, aoEditar, aoExcluir }) {
  const propriedadesCelula = {
    key: coluna.id,
    className: `celulaLayoutGradePadrao ${coluna.classe}`.trim(),
    style: obterEstiloColunaLayout(coluna)
  };

  if (coluna.id === 'data') {
    return (
      <CelulaLayoutAtendimento coluna={coluna} {...propriedadesCelula}>
        {formatarData(atendimento.data)}
      </CelulaLayoutAtendimento>
    );
  }

  if (coluna.id === 'codigo') {
    return (
      <CelulaLayoutAtendimento coluna={coluna} {...propriedadesCelula}>
        <CodigoRegistro valor={atendimento.idAtendimento || 0} />
      </CelulaLayoutAtendimento>
    );
  }

  if (coluna.id === 'agendamento') {
    return (
      <CelulaLayoutAtendimento coluna={coluna} {...propriedadesCelula}>
        {atendimento.idAgendamento ? <CodigoRegistro valor={atendimento.idAgendamento} /> : '-'}
      </CelulaLayoutAtendimento>
    );
  }

  if (coluna.id === 'horaInicio') {
    return (
      <CelulaLayoutAtendimento coluna={coluna} {...propriedadesCelula}>
        {formatarHoraAtendimento(atendimento.horaInicio)}
      </CelulaLayoutAtendimento>
    );
  }

  if (coluna.id === 'horaFim') {
    return (
      <CelulaLayoutAtendimento coluna={coluna} {...propriedadesCelula}>
        {formatarHoraAtendimento(atendimento.horaFim)}
      </CelulaLayoutAtendimento>
    );
  }

  if (coluna.id === 'fornecedor') {
    return (
      <CelulaLayoutAtendimento coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(atendimento.nomeFornecedor)}</TextoGradeClamp>
      </CelulaLayoutAtendimento>
    );
  }

  if (coluna.id === 'contato') {
    return (
      <CelulaLayoutAtendimento coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(atendimento.nomeContato)}</TextoGradeClamp>
      </CelulaLayoutAtendimento>
    );
  }

  if (coluna.id === 'assunto') {
    return (
      <CelulaLayoutAtendimento coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(atendimento.assunto)}</TextoGradeClamp>
      </CelulaLayoutAtendimento>
    );
  }

  if (coluna.id === 'descricao') {
    return (
      <CelulaLayoutAtendimento coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(atendimento.descricao)}</TextoGradeClamp>
      </CelulaLayoutAtendimento>
    );
  }

  if (coluna.id === 'canal') {
    return (
      <CelulaLayoutAtendimento coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(atendimento.nomeCanalAtendimento)}</TextoGradeClamp>
      </CelulaLayoutAtendimento>
    );
  }

  if (coluna.id === 'origem') {
    return (
      <CelulaLayoutAtendimento coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(atendimento.nomeOrigemAtendimento)}</TextoGradeClamp>
      </CelulaLayoutAtendimento>
    );
  }

  // Esta coluna usa o nome enriquecido vindo da listagem para manter a grade desacoplada da tabela auxiliar.
  if (coluna.id === 'tipoAtendimento') {
    return (
      <CelulaLayoutAtendimento coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(atendimento.nomeTipoAtendimento)}</TextoGradeClamp>
      </CelulaLayoutAtendimento>
    );
  }

  if (coluna.id === 'usuario') {
    return (
      <CelulaLayoutAtendimento coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(atendimento.nomeUsuario)}</TextoGradeClamp>
      </CelulaLayoutAtendimento>
    );
  }

  if (coluna.id === 'acoes') {
    return (
      <CelulaLayoutAtendimento coluna={coluna} {...propriedadesCelula}>
        <AcoesRegistro
          rotuloConsulta="Consultar atendimento"
          rotuloEdicao="Editar atendimento"
          rotuloInativacao="Excluir atendimento"
          iconeInativacao="limpar"
          exibirInativacao={permitirExcluir}
          aoConsultar={aoConsultar}
          aoEditar={aoEditar}
          aoInativar={aoExcluir}
        />
      </CelulaLayoutAtendimento>
    );
  }

  return null;
}

function CelulaLayoutAtendimento({ coluna, children, ...propriedades }) {
  return (
    <div {...propriedades}>
      <span className="rotuloCelulaLayoutGradePadrao">{coluna.rotulo}</span>
      {children}
    </div>
  );
}

function obterEstiloColunaLayout(coluna) {
  return {
    order: coluna.ordem,
    gridColumn: `span ${Math.max(1, Number(coluna.span || 1))}`
  };
}

function normalizarFiltrosAtendimentos(filtros, filtrosPadrao) {
  const filtrosNormalizados = normalizarFiltrosPorPadrao(filtros, filtrosPadrao);

  return {
    ...filtrosNormalizados,
    idUsuario: normalizarListaFiltroPersistido(filtrosNormalizados.idUsuario),
    idCompradorFornecedor: normalizarListaFiltroPersistido(filtros.idCompradorFornecedor || filtros.idCompradorFornecedor),
    idTipoAtendimento: normalizarListaFiltroPersistido(filtrosNormalizados.idTipoAtendimento),
    idCanalAtendimento: normalizarListaFiltroPersistido(filtrosNormalizados.idCanalAtendimento),
    idOrigemAtendimento: normalizarListaFiltroPersistido(filtrosNormalizados.idOrigemAtendimento),
    ...normalizarIntervaloAtendimento(filtrosNormalizados, filtrosPadrao, 'dataInicio', 'dataFim', normalizarDataFiltroAtendimento),
    ...normalizarIntervaloAtendimento(filtrosNormalizados, filtrosPadrao, 'horaInicioFiltro', 'horaFimFiltro', normalizarHoraFiltroAtendimento)
  };
}

function enriquecerAtendimentos(
  atendimentos,
  fornecedores,
  contatos,
  usuarios,
  compradores,
  canaisAtendimento,
  origensAtendimento
) {
  const fornecedoresPorId = new Map(
    fornecedores.map((fornecedor) => [
      fornecedor.idFornecedor,
      {
        nome: fornecedor.nomeFantasia || fornecedor.razaoSocial,
        idComprador: fornecedor.idComprador
      }
    ])
  );
  const contatosPorId = new Map(
    contatos.map((contato) => [contato.idContato, contato.nome])
  );
  const usuariosPorId = new Map(
    usuarios.map((usuario) => [usuario.idUsuario, usuario.nome])
  );
  const compradoresPorId = new Map(
    compradores.map((comprador) => [comprador.idComprador, comprador.nome])
  );
  const canaisPorId = new Map(
    canaisAtendimento.map((canal) => [canal.idCanalAtendimento, canal.descricao])
  );
  const origensPorId = new Map(
    origensAtendimento.map((origem) => [origem.idOrigemAtendimento, origem.descricao])
  );

  return atendimentos.map((atendimento) => ({
    ...atendimento,
    nomeFornecedor: obterValorGrid(fornecedoresPorId.get(atendimento.idFornecedor)?.nome),
    idCompradorFornecedor: fornecedoresPorId.get(atendimento.idFornecedor)?.idComprador || null,
    nomeContato: obterValorGrid(contatosPorId.get(atendimento.idContato)),
    nomeUsuario: obterValorGrid(usuariosPorId.get(atendimento.idUsuario)),
    nomeCompradorFornecedor: obterValorGrid(compradoresPorId.get(fornecedoresPorId.get(atendimento.idFornecedor)?.idComprador)),
    nomeCanalAtendimento: obterValorGrid(canaisPorId.get(atendimento.idCanalAtendimento)),
    nomeOrigemAtendimento: obterValorGrid(origensPorId.get(atendimento.idOrigemAtendimento))
  }));
}

function normalizarPayloadAtendimento(dadosAtendimento) {
  return {
    idFornecedor: Number(dadosAtendimento.idFornecedor),
    idContato: dadosAtendimento.idContato ? Number(dadosAtendimento.idContato) : null,
    idUsuario: Number(dadosAtendimento.idUsuario),
    idTipoAtendimento: Number(dadosAtendimento.idTipoAtendimento),
    assunto: String(dadosAtendimento.assunto || '').trim(),
    descricao: limparTextoOpcional(dadosAtendimento.descricao),
    data: dadosAtendimento.data,
    horaInicio: dadosAtendimento.horaInicio,
    horaFim: dadosAtendimento.horaFim,
    idCanalAtendimento: dadosAtendimento.idCanalAtendimento ? Number(dadosAtendimento.idCanalAtendimento) : null,
    idOrigemAtendimento: dadosAtendimento.idOrigemAtendimento ? Number(dadosAtendimento.idOrigemAtendimento) : null
  };
}

function limparTextoOpcional(valor) {
  const texto = String(valor || '').trim();
  return texto || null;
}

async function salvarContatosFornecedorAtendimento(idFornecedor, contatos) {
  const contatosNormalizados = normalizarContatosFornecedorAtendimento(contatos, idFornecedor);

  for (const contato of contatosNormalizados) {
    await incluirContato(contato);
  }
}

function normalizarPayloadFornecedorAtendimento(dadosFornecedor) {
  return {
    idComprador: Number(dadosFornecedor.idComprador),
    idConceito: Number(dadosFornecedor.idConceito),
    idRamo: Number(dadosFornecedor.idRamo),
    razaoSocial: String(dadosFornecedor.razaoSocial || '').trim(),
    nomeFantasia: String(dadosFornecedor.nomeFantasia || '').trim(),
    tipo: String(dadosFornecedor.tipo || '').trim(),
    cnpj: String(dadosFornecedor.cnpj || '').trim(),
    inscricaoEstadual: limparTextoOpcional(dadosFornecedor.inscricaoEstadual),
    status: dadosFornecedor.status ? 1 : 0,
    email: limparTextoOpcional(dadosFornecedor.email),
    telefone: limparTextoOpcional(dadosFornecedor.telefone),
    logradouro: limparTextoOpcional(dadosFornecedor.logradouro),
    numero: limparTextoOpcional(dadosFornecedor.numero),
    complemento: limparTextoOpcional(dadosFornecedor.complemento),
    bairro: limparTextoOpcional(dadosFornecedor.bairro),
    cidade: limparTextoOpcional(dadosFornecedor.cidade),
    estado: limparTextoOpcional(dadosFornecedor.estado)?.toUpperCase(),
    cep: limparTextoOpcional(dadosFornecedor.cep),
    observacao: limparTextoOpcional(dadosFornecedor.observacao),
    imagem: limparTextoOpcional(dadosFornecedor.imagem)
  };
}

function normalizarContatosFornecedorAtendimento(contatos, idFornecedor) {
  return contatos.map((contato) => ({
    idFornecedor,
    nome: String(contato.nome || '').trim(),
    cargo: limparTextoOpcional(contato.cargo),
    email: limparTextoOpcional(contato.email),
    telefone: limparTextoOpcional(contato.telefone),
    whatsapp: limparTextoOpcional(contato.whatsapp),
    status: contato.status ? 1 : 0,
    principal: contato.principal ? 1 : 0
  }));
}

function formatarData(data) {
  if (!data) {
    return '-';
  }

  const [ano, mes, dia] = String(data).split('T')[0].split('-');

  if (!ano || !mes || !dia) {
    return '-';
  }

  return `${dia}/${mes}/${ano}`;
}

function normalizarIntervaloAtendimento(filtros, filtrosPadrao, chaveInicio, chaveFim, normalizador) {
  const valorInicio = normalizador(filtros?.[chaveInicio]) || normalizador(filtrosPadrao?.[chaveInicio]);
  const valorFim = normalizador(filtros?.[chaveFim]) || normalizador(filtrosPadrao?.[chaveFim]);

  if (valorInicio && valorFim && valorInicio > valorFim) {
    return {
      [chaveInicio]: valorFim,
      [chaveFim]: valorInicio
    };
  }

  return {
    [chaveInicio]: valorInicio,
    [chaveFim]: valorFim
  };
}

function validarPeriodoAtendimento(valor, inicio, fim, normalizador) {
  const valorNormalizado = normalizador(valor);

  if (!inicio && !fim) {
    return true;
  }

  if (!valorNormalizado) {
    return false;
  }

  if (inicio && valorNormalizado < inicio) {
    return false;
  }

  if (fim && valorNormalizado > fim) {
    return false;
  }

  return true;
}

function normalizarDataFiltroAtendimento(valor) {
  const texto = String(valor || '').trim();

  if (!texto) {
    return '';
  }

  return texto.slice(0, 10);
}

function normalizarHoraFiltroAtendimento(valor) {
  const texto = String(valor || '').trim();

  if (!texto) {
    return '';
  }

  return texto.slice(0, 5);
}

function formatarHoraAtendimento(hora) {
  const texto = String(hora || '').trim();
  return texto || '-';
}

function obterHoraAtualFormatoInput() {
  const agora = new Date();
  const horas = String(agora.getHours()).padStart(2, '0');
  const minutos = String(agora.getMinutes()).padStart(2, '0');

  return `${horas}:${minutos}`;
}

function montarDadosIniciaisCotacaoPeloAtendimento(atendimento, fornecedores, compradores, usuarioLogado) {
  const comprador = compradores.find((item) => String(item.idComprador) === String(usuarioLogado?.idComprador || ''));

  return {
    idFornecedor: atendimento?.idFornecedor || '',
    idContato: atendimento?.idContato || '',
    idUsuario: atendimento?.idUsuario || usuarioLogado?.idUsuario || '',
    nomeUsuario: atendimento?.nomeUsuario || usuarioLogado?.nome || '',
    idComprador: usuarioLogado?.idComprador || '',
    observacao: atendimento?.descricao || ''
  };
}

function enriquecerCotacoesAtendimento(cotacoes, fornecedores, contatos, usuarios, compradores, prazosPagamento, etapasCotacao, produtos) {
  const fornecedoresPorId = new Map(fornecedores.map((fornecedor) => [fornecedor.idFornecedor, fornecedor]));
  const contatosPorId = new Map(contatos.map((contato) => [contato.idContato, contato.nome]));
  const usuariosPorId = new Map(usuarios.map((usuario) => [usuario.idUsuario, usuario.nome]));
  const compradoresPorId = new Map(compradores.map((comprador) => [comprador.idComprador, comprador.nome]));
  const prazosPorId = new Map(prazosPagamento.map((prazo) => [prazo.idPrazoPagamento, prazo]));
  const etapasPorId = new Map(etapasCotacao.map((etapa) => [etapa.idEtapaCotacao, etapa]));
  const produtosPorId = new Map(produtos.map((produto) => [produto.idProduto, produto]));

  return cotacoes.map((cotacao) => {
    const fornecedor = fornecedoresPorId.get(cotacao.idFornecedor);

    return {
      ...cotacao,
      nomeFornecedor: obterValorGrid(fornecedor?.nomeFantasia || fornecedor?.razaoSocial),
      nomeContato: obterValorGrid(contatosPorId.get(cotacao.idContato)),
      nomeUsuario: obterValorGrid(usuariosPorId.get(cotacao.idUsuario)),
      nomeComprador: obterValorGrid(compradoresPorId.get(cotacao.idComprador)),
      nomePrazoPagamento: obterValorGrid(prazosPorId.get(cotacao.idPrazoPagamento)?.descricaoFormatada),
      nomeEtapaCotacao: obterValorGrid(etapasPorId.get(cotacao.idEtapaCotacao)?.descricao),
      itens: Array.isArray(cotacao.itens) ? cotacao.itens.map((item) => ({
        ...item,
        nomeProduto: obterValorGrid(produtosPorId.get(item.idProduto)?.descricao || item.nomeProduto)
      })) : []
    };
  });
}

function cotacaoEstaAberto(cotacao) {
  const idEtapa = Number(cotacao?.idEtapaCotacao);

  return ![
    ID_ETAPA_COTACAO_FECHAMENTO,
    ID_ETAPA_COTACAO_FECHADO_SEM_ORDEM_COMPRA,
    ID_ETAPA_COTACAO_ORDEM_COMPRA_EXCLUIDO,
    ID_ETAPA_COTACAO_RECUSADO
  ].includes(idEtapa);
}

function etapaAcabouDeFechar(idEtapaAnterior, idEtapaAtual, etapasCotacao) {
  const etapaAnterior = etapasCotacao.find((etapa) => String(etapa.idEtapaCotacao) === String(idEtapaAnterior || ''));
  const etapaAtual = etapasCotacao.find((etapa) => String(etapa.idEtapaCotacao) === String(idEtapaAtual || ''));

  return !etapaCotacaoEhFechamento(etapaAnterior) && etapaCotacaoEhFechamento(etapaAtual);
}

function etapaCotacaoEhFechamento(etapa) {
  return Number(etapa?.idEtapaCotacao) === ID_ETAPA_COTACAO_FECHAMENTO;
}

function obterEtapaFechadoSemOrdemCompra(etapasCotacao) {
  return etapasCotacao.find((etapa) => Number(etapa?.idEtapaCotacao) === ID_ETAPA_COTACAO_FECHADO_SEM_ORDEM_COMPRA) || null;
}

function normalizarPayloadCotacao(dadosCotacao, usuarioLogado) {
  return {
    idFornecedor: Number(dadosCotacao.idFornecedor),
    idContato: dadosCotacao.idContato ? Number(dadosCotacao.idContato) : null,
    idUsuario: Number(dadosCotacao.idUsuario || usuarioLogado.idUsuario),
    idComprador: Number(dadosCotacao.idComprador),
    idPrazoPagamento: dadosCotacao.idPrazoPagamento ? Number(dadosCotacao.idPrazoPagamento) : null,
    idEtapaCotacao: dadosCotacao.idEtapaCotacao ? Number(dadosCotacao.idEtapaCotacao) : null,
    dataInclusao: limparTextoOpcional(dadosCotacao.dataInclusao),
    dataValidade: limparTextoOpcional(dadosCotacao.dataValidade),
    observacao: limparTextoOpcional(dadosCotacao.observacao),
    itens: Array.isArray(dadosCotacao.itens) ? dadosCotacao.itens.map((item) => ({
      idProduto: Number(item.idProduto),
      quantidade: normalizarNumeroDecimal(item.quantidade),
      valorUnitario: normalizarNumeroDecimal(item.valorUnitario),
      valorTotal: normalizarNumeroDecimal(item.valorTotal),
      imagem: limparTextoOpcional(item.imagem),
      observacao: limparTextoOpcional(item.observacao)
    })) : [],
    camposExtras: Array.isArray(dadosCotacao.camposExtras) ? dadosCotacao.camposExtras.map((campo) => ({
      idCampoCotacao: Number(campo.idCampoCotacao),
      valor: limparTextoOpcional(campo.valor)
    })) : []
  };
}

function normalizarPayloadPrazoPagamento(dadosPrazo) {
  const payload = {
    descricao: limparTextoOpcional(dadosPrazo.descricao),
    idMetodoPagamento: Number(dadosPrazo.idMetodoPagamento),
    status: dadosPrazo.status ? 1 : 0
  };

  ['prazo1', 'prazo2', 'prazo3', 'prazo4', 'prazo5', 'prazo6'].forEach((chave) => {
    const valor = String(dadosPrazo[chave] || '').trim();
    payload[chave] = valor ? Number(valor) : null;
  });

  return payload;
}

function enriquecerPrazosPagamento(prazosPagamento, metodosPagamento = []) {
  const metodosPorId = new Map(
    metodosPagamento.map((metodo) => [metodo.idMetodoPagamento, metodo.descricao])
  );

  return prazosPagamento.map((prazo) => {
    const parcelas = [prazo.prazo1, prazo.prazo2, prazo.prazo3, prazo.prazo4, prazo.prazo5, prazo.prazo6]
      .filter((valor) => valor !== null && valor !== undefined && valor !== '')
      .join(' / ');

    return {
      ...prazo,
      nomeMetodoPagamento: metodosPorId.get(prazo.idMetodoPagamento) || '',
      descricaoFormatada: prazo.descricao || (parcelas ? `${parcelas} dias` : 'Prazo sem descricao')
    };
  });
}

function enriquecerPrazoPagamento(prazo, metodosPagamento = []) {
  if (!prazo) {
    return null;
  }

  return enriquecerPrazosPagamento([prazo], metodosPagamento)[0] || null;
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

function normalizarPayloadOrdemCompra(dadosOrdemCompra) {
  return {
    idCotacao: dadosOrdemCompra.idCotacao ? Number(dadosOrdemCompra.idCotacao) : null,
    idFornecedor: dadosOrdemCompra.idFornecedor ? Number(dadosOrdemCompra.idFornecedor) : null,
    idContato: dadosOrdemCompra.idContato ? Number(dadosOrdemCompra.idContato) : null,
    idUsuario: dadosOrdemCompra.idUsuario ? Number(dadosOrdemCompra.idUsuario) : null,
      idComprador: dadosOrdemCompra.idComprador ? Number(dadosOrdemCompra.idComprador) : null,
      idPrazoPagamento: dadosOrdemCompra.idPrazoPagamento ? Number(dadosOrdemCompra.idPrazoPagamento) : null,
      idTipoOrdemCompra: dadosOrdemCompra.idTipoOrdemCompra ? Number(dadosOrdemCompra.idTipoOrdemCompra) : null,
      idEtapaOrdemCompra: dadosOrdemCompra.idEtapaOrdemCompra ? Number(dadosOrdemCompra.idEtapaOrdemCompra) : null,
    dataInclusao: limparTextoOpcional(dadosOrdemCompra.dataInclusao),
    dataEntrega: limparTextoOpcional(dadosOrdemCompra.dataEntrega),
    observacao: limparTextoOpcional(dadosOrdemCompra.observacao),
    codigoCotacaoOrigem: dadosOrdemCompra.codigoCotacaoOrigem ? Number(dadosOrdemCompra.codigoCotacaoOrigem) : null,
    nomeFornecedorSnapshot: limparTextoOpcional(dadosOrdemCompra.nomeFornecedorSnapshot),
    nomeContatoSnapshot: limparTextoOpcional(dadosOrdemCompra.nomeContatoSnapshot),
    nomeUsuarioSnapshot: limparTextoOpcional(dadosOrdemCompra.nomeUsuarioSnapshot),
      nomeCompradorSnapshot: limparTextoOpcional(dadosOrdemCompra.nomeCompradorSnapshot),
      nomeMetodoPagamentoSnapshot: limparTextoOpcional(dadosOrdemCompra.nomeMetodoPagamentoSnapshot),
      nomePrazoPagamentoSnapshot: limparTextoOpcional(dadosOrdemCompra.nomePrazoPagamentoSnapshot),
      nomeTipoOrdemCompraSnapshot: limparTextoOpcional(dadosOrdemCompra.nomeTipoOrdemCompraSnapshot),
      nomeEtapaOrdemCompraSnapshot: limparTextoOpcional(dadosOrdemCompra.nomeEtapaOrdemCompraSnapshot),
    itens: Array.isArray(dadosOrdemCompra.itens) ? dadosOrdemCompra.itens.map((item) => ({
      idProduto: item.idProduto ? Number(item.idProduto) : null,
      quantidade: normalizarNumeroDecimal(item.quantidade),
      valorUnitario: normalizarNumeroDecimal(item.valorUnitario),
      valorTotal: normalizarNumeroDecimal(item.valorTotal),
      imagem: limparTextoOpcional(item.imagem),
      observacao: limparTextoOpcional(item.observacao),
      referenciaProdutoSnapshot: limparTextoOpcional(item.referenciaProdutoSnapshot),
      descricaoProdutoSnapshot: limparTextoOpcional(item.descricaoProdutoSnapshot),
      unidadeProdutoSnapshot: limparTextoOpcional(item.unidadeProdutoSnapshot)
    })) : [],
    camposExtras: Array.isArray(dadosOrdemCompra.camposExtras) ? dadosOrdemCompra.camposExtras.map((campo) => ({
      idCampoOrdemCompra: campo.idCampoOrdemCompra ? Number(campo.idCampoOrdemCompra) : null,
      tituloSnapshot: limparTextoOpcional(campo.tituloSnapshot || campo.titulo),
      valor: limparTextoOpcional(campo.valor)
    })) : []
  };
}

function enriquecerCotacaoParaOrdemCompra(cotacao, contexto) {
  const fornecedor = contexto.fornecedores.find((item) => String(item.idFornecedor) === String(cotacao.idFornecedor));
  const contato = contexto.contatos.find((item) => String(item.idContato) === String(cotacao.idContato));
  const usuario = contexto.usuarios.find((item) => String(item.idUsuario) === String(cotacao.idUsuario));
  const comprador = contexto.compradores.find((item) => String(item.idComprador) === String(cotacao.idComprador));
  const prazo = contexto.prazosPagamento.find((item) => String(item.idPrazoPagamento) === String(cotacao.idPrazoPagamento));

  return {
    ...cotacao,
    nomeFornecedor: cotacao.nomeFornecedor || fornecedor?.nomeFantasia || fornecedor?.razaoSocial || '',
    nomeContato: cotacao.nomeContato || contato?.nome || '',
    nomeUsuario: cotacao.nomeUsuario || usuario?.nome || '',
    nomeComprador: cotacao.nomeComprador || comprador?.nome || '',
    nomePrazoPagamento: cotacao.nomePrazoPagamento || prazo?.descricaoFormatada || prazo?.descricao || '',
    nomeMetodoPagamento: cotacao.nomeMetodoPagamento || prazo?.nomeMetodoPagamento || '',
    itens: Array.isArray(cotacao.itens) ? cotacao.itens.map((item) => {
      const produto = contexto.produtos.find((registro) => String(registro.idProduto) === String(item.idProduto));
      return {
        ...item,
        descricaoProdutoSnapshot: item.descricaoProdutoSnapshot || produto?.descricao || item.nomeProduto || '',
        referenciaProdutoSnapshot: item.referenciaProdutoSnapshot || produto?.referencia || '',
        unidadeProdutoSnapshot: item.unidadeProdutoSnapshot || produto?.nomeUnidadeMedida || produto?.siglaUnidadeMedida || '',
        imagem: item.imagem || produto?.imagem || ''
      };
    }) : []
  };
}

function montarDadosIniciaisOrdemCompraAPartirDoCotacao(cotacao) {
  return {
    idCotacao: cotacao.idCotacao,
    codigoCotacaoOrigem: cotacao.idCotacao,
    idFornecedor: cotacao.idFornecedor,
    idContato: cotacao.idContato,
    idUsuario: cotacao.idUsuario,
    idComprador: cotacao.idComprador,
    idPrazoPagamento: cotacao.idPrazoPagamento,
    idTipoOrdemCompra: ID_TIPO_ORDEM_COMPRA_VENDA,
    dataInclusao: obterDataAtualFormatoInput(),
    nomeFornecedorSnapshot: cotacao.nomeFornecedor || '',
    nomeContatoSnapshot: cotacao.nomeContato || '',
    nomeUsuarioSnapshot: cotacao.nomeUsuario || '',
    nomeCompradorSnapshot: cotacao.nomeComprador || '',
    nomeMetodoPagamentoSnapshot: cotacao.nomeMetodoPagamento || '',
    nomePrazoPagamentoSnapshot: cotacao.nomePrazoPagamento || '',
    nomeTipoOrdemCompraSnapshot: 'Ordem de compra',
    observacao: cotacao.observacao || '',
    itens: Array.isArray(cotacao.itens) ? cotacao.itens.map((item) => ({
      idProduto: item.idProduto,
      quantidade: item.quantidade,
      valorUnitario: item.valorUnitario,
      valorTotal: item.valorTotal,
      imagem: item.imagem || '',
      observacao: item.observacao || '',
      referenciaProdutoSnapshot: item.referenciaProdutoSnapshot || '',
      descricaoProdutoSnapshot: item.descricaoProdutoSnapshot || item.nomeProduto || '',
      unidadeProdutoSnapshot: item.unidadeProdutoSnapshot || ''
    })) : []
  };
}



