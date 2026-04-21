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
  listarEtapasOrdemCompraConfiguracao,
  listarCamposCotacaoConfiguracao,
  listarEtapasCotacaoConfiguracao,
  listarMetodosPagamentoConfiguracao,
  listarPrazosPagamentoConfiguracao,
  listarTiposOrdemCompraConfiguracao
} from '../servicos/configuracoes';
import { incluirOrdemCompra } from '../servicos/ordensCompra';
import {
  listarCotacoes,
  atualizarCotacao,
  excluirCotacao,
  incluirCotacao
} from '../servicos/cotacoes';
import { atualizarEmpresa, criarPayloadAtualizacaoColunasGrid, listarEmpresas } from '../servicos/empresa';
import { listarProdutos } from '../servicos/produtos';
import { listarUsuarios } from '../servicos/usuarios';
import {
  normalizarColunasGridCotacoes,
  TOTAL_COLUNAS_GRID_COTACOES
} from '../dados/colunasGridCotacoes';
import { normalizarPreco } from '../utilitarios/normalizarPreco';
import { formatarCodigoFornecedor } from '../utilitarios/codigoFornecedor';
import { obterEtapasCotacaoParaInputManual } from '../utilitarios/etapasCotacao';
import { obterValorGrid } from '../utilitarios/valorPadraoGrid';
import {
  normalizarFiltrosPorPadrao,
  normalizarListaFiltroPersistido,
  useFiltrosPersistidos
} from '../hooks/useFiltrosPersistidos';
import { ModalCotacao } from '../componentes/modulos/cotacoes-modalCotacao';
import { ModalManualCotacoes } from '../componentes/modulos/cotacoes-modalManualCotacoes';
import { ModalOrdemCompra } from '../componentes/modulos/ordensCompra-modalOrdemCompra';
import { ModalColunasGridCotacoes } from '../componentes/modulos/configuracoes-modalColunasGridCotacoes';

function criarFiltrosIniciaisCotacoes(usuarioLogado, empresa = null) {
  const compradorTravado = usuarioLogado?.tipo === 'Usuario padrao' && usuarioLogado?.idComprador;

  return {
    idFornecedor: '',
    idUsuario: [],
    idCompradorFornecedor: [],
    idComprador: compradorTravado ? [String(usuarioLogado.idComprador)] : [],
    idsEtapaCotacao: obterEtapasFiltroPadraoCotacao(empresa),
    dataInclusaoInicio: '',
    dataInclusaoFim: '',
    dataFechamentoInicio: '',
    dataFechamentoFim: ''
  };
}

  const ID_ETAPA_COTACAO_FECHAMENTO = 1;
  const ID_ETAPA_COTACAO_FECHADO_SEM_ORDEM_COMPRA = 2;
  const ID_ETAPA_COTACAO_ORDEM_COMPRA_EXCLUIDO = 3;
  const ID_ETAPA_COTACAO_RECUSADO = 4;
  const ID_TIPO_ORDEM_COMPRA_VENDA = 1;

function criarFiltrosLimposCotacoes(usuarioLogado, empresa = null) {
  const compradorTravado = usuarioLogado?.tipo === 'Usuario padrao' && usuarioLogado?.idComprador;

  return {
    idFornecedor: '',
    idUsuario: [],
    idCompradorFornecedor: [],
    idComprador: compradorTravado ? [String(usuarioLogado.idComprador)] : [],
    idsEtapaCotacao: obterEtapasFiltroPadraoCotacao(empresa),
    dataInclusaoInicio: '',
    dataInclusaoFim: '',
    dataFechamentoInicio: '',
    dataFechamentoFim: ''
  };
}

export function PaginaCotacoes({ usuarioLogado }) {
  const [pesquisa, definirPesquisa] = useState('');
  const [cotacoes, definirCotacoes] = useState([]);
  const [fornecedores, definirFornecedores] = useState([]);
  const [contatos, definirContatos] = useState([]);
  const [usuarios, definirUsuarios] = useState([]);
  const [ramosAtividade, definirRamosAtividade] = useState([]);
  const [conceitosFornecedor, definirConceitosFornecedor] = useState([]);
  const [compradores, definirCompradores] = useState([]);
  const [metodosPagamento, definirMetodosPagamento] = useState([]);
  const [prazosPagamento, definirPrazosPagamento] = useState([]);
  const [etapasCotacao, definirEtapasCotacao] = useState([]);
  const [produtos, definirProdutos] = useState([]);
  const [camposCotacao, definirCamposCotacao] = useState([]);
  const [camposOrdemCompra, definirCamposOrdemCompra] = useState([]);
  const [etapasOrdemCompra, definirEtapasOrdemCompra] = useState([]);
  const [tiposOrdemCompra, definirTiposOrdemCompra] = useState([]);
  const [empresa, definirEmpresa] = useState(null);
  const [carregandoContexto, definirCarregandoContexto] = useState(true);
  const [carregandoGrade, definirCarregandoGrade] = useState(true);
  const [mensagemErro, definirMensagemErro] = useState('');
  const [modalAberto, definirModalAberto] = useState(false);
  const [modalManualAberto, definirModalManualAberto] = useState(false);
  const [modalFiltrosAberto, definirModalFiltrosAberto] = useState(false);
  const [modalColunasGridAberto, definirModalColunasGridAberto] = useState(false);
  const [modalBuscaFornecedorFiltrosAberto, definirModalBuscaFornecedorFiltrosAberto] = useState(false);
  const [filtrosEmEdicao, definirFiltrosEmEdicao] = useState(null);
  const [cotacaoSelecionado, definirCotacaoSelecionado] = useState(null);
  const [cotacaoExclusaoPendente, definirCotacaoExclusaoPendente] = useState(null);
  const [cotacaoOrdemCompraPendente, definirCotacaoOrdemCompraPendente] = useState(null);
  const [cotacaoOrdemCompraEmCriacao, definirCotacaoOrdemCompraEmCriacao] = useState(null);
  const [dadosIniciaisOrdemCompra, definirDadosIniciaisOrdemCompra] = useState(null);
  const [modalOrdemCompraAberto, definirModalOrdemCompraAberto] = useState(false);
  const [modoModal, definirModoModal] = useState('novo');
  const usuarioSomenteComprador = usuarioLogado?.tipo === 'Usuario padrao' && usuarioLogado?.idComprador;
  const usuarioSomenteConsultaConfiguracao = usuarioLogado?.tipo === 'Usuario padrao';
  const permitirExcluir = usuarioLogado?.tipo !== 'Usuario padrao';
  const filtrosIniciais = useMemo(
    () => criarFiltrosIniciaisCotacoes(usuarioLogado, empresa),
    [usuarioLogado?.idUsuario, usuarioLogado?.idComprador, empresa?.etapasFiltroPadraoCotacao]
  );
  const [filtros, definirFiltros] = useFiltrosPersistidos({
    chave: 'paginaCotacoes',
    usuario: usuarioLogado,
    filtrosPadrao: filtrosIniciais,
    normalizarFiltros: normalizarFiltrosCotacoes
  });

  useEffect(() => {
    carregarContexto();
  }, [usuarioSomenteComprador, usuarioLogado?.idComprador]);

  useEffect(() => {
    if (carregandoContexto) {
      return;
    }

    carregarGradeCotacoes();
  }, [carregandoContexto, usuarioSomenteComprador, usuarioLogado?.idComprador, usuarioLogado?.idUsuario, pesquisa, JSON.stringify(filtros)]);

  useEffect(() => {
    if (usuarioLogado?.tipo === 'Usuario padrao') {
      return;
    }

    if (!Array.isArray(filtros.idComprador) || filtros.idComprador.length === 0) {
      return;
    }

    definirFiltros((estadoAtual) => ({
      ...estadoAtual,
      idComprador: []
    }));
  }, [usuarioLogado?.tipo]);

  useEffect(() => {
    function tratarGrupoEmpresaAtualizado() {
      carregarContexto();
      carregarGradeCotacoes();
    }

    window.addEventListener('grupo-empresa-atualizado', tratarGrupoEmpresaAtualizado);

    return () => {
      window.removeEventListener('grupo-empresa-atualizado', tratarGrupoEmpresaAtualizado);
    };
  }, [usuarioSomenteComprador, usuarioLogado?.idComprador, usuarioLogado?.idUsuario, pesquisa, JSON.stringify(filtros)]);

  useEffect(() => {
    function tratarEmpresaAtualizada() {
      carregarContexto();
      carregarGradeCotacoes();
    }

    window.addEventListener('empresa-atualizada', tratarEmpresaAtualizada);

    return () => {
      window.removeEventListener('empresa-atualizada', tratarEmpresaAtualizada);
    };
  }, [usuarioSomenteComprador, usuarioLogado?.idComprador]);

  useEffect(() => {
    function tratarAtalhosCotacoes(evento) {
      if (evento.key !== 'F1') {
        return;
      }

      evento.preventDefault();

      if (
        !modalAberto
        && !modalManualAberto
        && !modalFiltrosAberto
        && !modalOrdemCompraAberto
        && !cotacaoExclusaoPendente
        && !cotacaoOrdemCompraPendente
        && !cotacaoOrdemCompraEmCriacao
      ) {
        definirModalManualAberto(true);
      }
    }

    window.addEventListener('keydown', tratarAtalhosCotacoes);

    return () => {
      window.removeEventListener('keydown', tratarAtalhosCotacoes);
    };
  }, [
    modalAberto,
    modalManualAberto,
    modalFiltrosAberto,
    modalOrdemCompraAberto,
    cotacaoExclusaoPendente,
    cotacaoOrdemCompraEmCriacao,
    cotacaoOrdemCompraPendente
  ]);

  async function carregarContexto() {
    definirCarregandoContexto(true);
    definirMensagemErro('');

    try {
      const resultados = await Promise.allSettled([
        listarFornecedores(),
        listarContatos(),
        listarUsuarios(),
        listarRamosAtividade(),
        listarConceitosFornecedor({ incluirInativos: true }),
        listarCompradores(),
        listarMetodosPagamentoConfiguracao(),
        listarPrazosPagamentoConfiguracao(),
        listarEtapasCotacaoConfiguracao(),
        listarProdutos(),
        listarCamposCotacaoConfiguracao(),
        listarCamposOrdemCompraConfiguracao(),
        listarEtapasOrdemCompraConfiguracao(),
        listarTiposOrdemCompraConfiguracao(),
        listarEmpresas()
      ]);

      const [
        fornecedoresResultado,
        contatosResultado,
        usuariosResultado,
        ramosResultado,
        conceitosResultado,
        compradoresResultado,
        metodosResultado,
        prazosResultado,
        etapasResultado,
        produtosResultado,
        camposResultado,
        camposOrdemCompraResultado,
        etapasOrdemCompraResultado,
        tiposOrdemCompraResultado,
        empresasResultado
      ] = resultados;

      const fornecedoresCarregados = fornecedoresResultado.status === 'fulfilled' ? fornecedoresResultado.value : [];
      const contatosCarregados = contatosResultado.status === 'fulfilled' ? contatosResultado.value : [];
      const usuariosCarregados = usuariosResultado.status === 'fulfilled' ? usuariosResultado.value : [];
      const ramosCarregados = ramosResultado.status === 'fulfilled' ? ramosResultado.value : [];
      const conceitosCarregados = conceitosResultado.status === 'fulfilled' ? conceitosResultado.value : [];
      const compradoresCarregados = compradoresResultado.status === 'fulfilled' ? compradoresResultado.value : [];
      const metodosCarregados = metodosResultado.status === 'fulfilled' ? metodosResultado.value : [];
      const prazosCarregados = prazosResultado.status === 'fulfilled' ? prazosResultado.value : [];
      const etapasCarregadas = etapasResultado.status === 'fulfilled' ? etapasResultado.value : [];
      const produtosCarregados = produtosResultado.status === 'fulfilled' ? produtosResultado.value : [];
      const camposCarregados = camposResultado.status === 'fulfilled' ? camposResultado.value : [];
      const camposOrdemCompraCarregados = camposOrdemCompraResultado.status === 'fulfilled' ? camposOrdemCompraResultado.value : [];
      const etapasOrdemCompraCarregadas = etapasOrdemCompraResultado.status === 'fulfilled' ? etapasOrdemCompraResultado.value : [];
      const tiposOrdemCompraCarregados = tiposOrdemCompraResultado.status === 'fulfilled' ? tiposOrdemCompraResultado.value : [];
      const empresasCarregadas = empresasResultado.status === 'fulfilled' ? empresasResultado.value : [];

      const etapasCarregadasOrdenadas = ordenarEtapasPorOrdem(etapasCarregadas, 'idEtapaCotacao');
      const fornecedoresDisponiveis = fornecedoresCarregados;
      const idsFornecedoresDisponiveis = new Set(fornecedoresDisponiveis.map((fornecedor) => fornecedor.idFornecedor));

      definirFornecedores(fornecedoresDisponiveis);
      definirContatos(contatosCarregados.filter((contato) => idsFornecedoresDisponiveis.has(contato.idFornecedor)));
      definirUsuarios(usuariosCarregados);
      definirRamosAtividade(ramosCarregados);
      definirConceitosFornecedor(conceitosCarregados);
      definirCompradores(compradoresCarregados);
      definirMetodosPagamento(metodosCarregados);
      definirPrazosPagamento(enriquecerPrazosPagamento(prazosCarregados, metodosCarregados));
      definirEtapasCotacao(etapasCarregadasOrdenadas);
      definirProdutos(produtosCarregados.filter((produto) => produto.status !== 0));
      definirCamposCotacao(camposCarregados);
      definirCamposOrdemCompra(camposOrdemCompraCarregados);
      definirEtapasOrdemCompra(etapasOrdemCompraCarregadas);
      definirTiposOrdemCompra(tiposOrdemCompraCarregados);
      definirEmpresa(empresasCarregadas[0] || null);

      return {
        fornecedores: fornecedoresDisponiveis,
        contatos: contatosCarregados.filter((contato) => idsFornecedoresDisponiveis.has(contato.idFornecedor)),
        usuarios: usuariosCarregados,
        ramosAtividade: ramosCarregados,
        compradores: compradoresCarregados,
        metodosPagamento: metodosCarregados,
        prazosPagamento: enriquecerPrazosPagamento(prazosCarregados, metodosCarregados),
        etapasCotacao: etapasCarregadasOrdenadas,
        produtos: produtosCarregados.filter((produto) => produto.status !== 0),
        camposCotacao: camposCarregados,
        camposOrdemCompra: camposOrdemCompraCarregados,
        etapasOrdemCompra: etapasOrdemCompraCarregadas,
        tiposOrdemCompra: tiposOrdemCompraCarregados,
        empresa: empresasCarregadas[0] || null
      };
    } catch (_erro) {
      definirMensagemErro('Nao foi possivel carregar os cotacoes.');
      return null;
    } finally {
      definirCarregandoContexto(false);
    }
  }

  async function carregarGradeCotacoes(contextoAtual = null) {
    definirCarregandoGrade(true);
    definirMensagemErro('');

    try {
      const cotacoesCarregados = await listarCotacoes({
        search: pesquisa,
        ...filtros,
        ...(usuarioSomenteComprador
          ? {
            escopoIdComprador: usuarioLogado?.idComprador,
            escopoIdUsuario: usuarioLogado?.idUsuario
          }
          : {})
      });

      const contexto = contextoAtual || {
        fornecedores,
        contatos,
        usuarios,
        compradores,
        prazosPagamento,
        etapasCotacao,
        produtos
      };

      definirCotacoes(
        enriquecerCotacoes(
          cotacoesCarregados,
          contexto.fornecedores,
          contexto.contatos,
          contexto.usuarios,
          contexto.compradores,
          contexto.prazosPagamento,
          contexto.etapasCotacao,
          contexto.produtos
        )
      );
    } catch (_erro) {
      definirMensagemErro('Nao foi possivel carregar os cotacoes.');
    } finally {
      definirCarregandoGrade(false);
    }
  }

  async function recarregarPagina() {
    const contextoAtual = await carregarContexto();

    if (contextoAtual) {
      await carregarGradeCotacoes(contextoAtual);
    }
  }

  async function salvarColunasGridCotacoes(dadosColunas) {
    if (!empresa?.idEmpresa) {
      throw new Error('Cadastre a empresa antes de configurar as colunas do grid.');
    }

    await atualizarEmpresa(
      empresa.idEmpresa,
      criarPayloadAtualizacaoColunasGrid('colunasGridCotacoes', dadosColunas.colunasGridCotacoes)
    );

    const empresasAtualizadas = await listarEmpresas();
    definirEmpresa(empresasAtualizadas[0] || null);
    window.dispatchEvent(new CustomEvent('empresa-atualizada'));
    definirModalColunasGridAberto(false);
  }

  async function salvarCotacao(dadosCotacao) {
    const payload = normalizarPayloadCotacao(dadosCotacao, usuarioLogado);
    const etapaAnterior = cotacaoSelecionado?.idEtapaCotacao || null;
    const etapaAtual = dadosCotacao.idEtapaCotacao || null;
    let registroSalvo = null;

    if (cotacaoSelecionado?.idCotacao) {
      registroSalvo = await atualizarCotacao(cotacaoSelecionado.idCotacao, payload);
    } else {
      registroSalvo = await incluirCotacao(payload);
    }

    await recarregarPagina();
    fecharModal();

    if (etapaAcabouDeFechar(etapaAnterior, etapaAtual, etapasCotacao) && !registroSalvo?.idOrdemCompraVinculado) {
      const cotacaoEnriquecido = enriquecerCotacaoParaOrdemCompra(
        registroSalvo || { ...dadosCotacao, idCotacao: cotacaoSelecionado?.idCotacao },
        {
          fornecedores,
          contatos,
          usuarios,
          compradores,
          prazosPagamento,
          etapasCotacao,
          produtos
        }
      );

      const pendenciaOrdemCompra = {
        dadosOrdemCompra: montarDadosIniciaisOrdemCompraAPartirDoCotacao(cotacaoEnriquecido),
        idCotacao: cotacaoEnriquecido.idCotacao,
        idEtapaAnterior: etapaAnterior,
        idEtapaDestino: etapaAtual,
        etapaJaAtualizada: true
      };

      if (dadosCotacao.solicitarOrdemCompraAoSalvar) {
        definirCotacaoOrdemCompraEmCriacao(pendenciaOrdemCompra);
        definirDadosIniciaisOrdemCompra(pendenciaOrdemCompra.dadosOrdemCompra);
        definirModalOrdemCompraAberto(true);
        return;
      }

      definirCotacaoOrdemCompraPendente(pendenciaOrdemCompra);
    }
  }

  async function incluirFornecedorPeloCotacao(dadosFornecedor) {
    const payload = normalizarPayloadFornecedorCadastro({
      ...dadosFornecedor,
      idComprador: usuarioSomenteComprador ? String(usuarioLogado.idComprador) : dadosFornecedor.idComprador
    });

    const fornecedorSalvo = await incluirFornecedor(payload);
    await salvarContatosFornecedorCadastro(fornecedorSalvo.idFornecedor, dadosFornecedor.contatos || []);
    await recarregarPagina();

    const fornecedoresAtualizados = await listarFornecedores();
    const fornecedorCompleto = fornecedoresAtualizados.find((fornecedor) => fornecedor.idFornecedor === fornecedorSalvo.idFornecedor);

    return fornecedorCompleto || fornecedorSalvo;
  }

  async function salvarPrazoPagamento(dadosPrazo) {
    const payload = normalizarPayloadPrazoPagamento(dadosPrazo);
    const registroSalvo = dadosPrazo?.idPrazoPagamento
      ? await atualizarPrazoPagamento(dadosPrazo.idPrazoPagamento, payload)
      : await incluirPrazoPagamento(payload);

    await recarregarPagina();
    return enriquecerPrazoPagamento(registroSalvo, metodosPagamento);
  }

  async function inativarPrazoPagamento(prazo) {
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

  async function alterarEtapaRapidamente(cotacao, idEtapaCotacao) {
    const payload = normalizarPayloadCotacao(
      {
        ...cotacao,
        idEtapaCotacao,
        dataFechamento: entrouEmEtapaFechada(cotacao.idEtapaCotacao, idEtapaCotacao)
          ? obterDataAtualFormatoInput()
          : cotacao.dataFechamento
      },
      usuarioLogado
    );

    const registroAtualizado = await atualizarCotacao(cotacao.idCotacao, payload);
    await recarregarPagina();
    return registroAtualizado;
  }

  async function selecionarEtapaNoGrid(cotacao, proximoIdEtapa) {
    if (cotacao.idOrdemCompraVinculado) {
      return;
    }

    const valorEtapa = String(proximoIdEtapa || '').trim();

    if (!valorEtapa || String(cotacao.idEtapaCotacao || '') === valorEtapa) {
      return;
    }

    const etapaSelecionada = etapasCotacao.find(
      (etapa) => String(etapa.idEtapaCotacao) === valorEtapa
    );


    if (Number(valorEtapa) === ID_ETAPA_COTACAO_FECHAMENTO) {
      const cotacaoEnriquecido = enriquecerCotacaoParaOrdemCompra(
        cotacao,
        {
          fornecedores,
          contatos,
          usuarios,
          compradores,
          prazosPagamento,
          etapasCotacao,
          produtos
        }
      );

      definirCotacaoOrdemCompraPendente({
        dadosOrdemCompra: montarDadosIniciaisOrdemCompraAPartirDoCotacao(cotacaoEnriquecido),
        idCotacao: cotacao.idCotacao,
        idEtapaAnterior: cotacao.idEtapaCotacao || null,
        idEtapaDestino: Number(valorEtapa),
        etapaJaAtualizada: false
      });
      return;
    }

    const registroAtualizado = await alterarEtapaRapidamente(
      cotacao,
      Number(valorEtapa)
    );

    if (etapaAcabouDeFechar(cotacao.idEtapaCotacao, valorEtapa, etapasCotacao) && !registroAtualizado?.idOrdemCompraVinculado) {
      const cotacaoEnriquecido = enriquecerCotacaoParaOrdemCompra(
        registroAtualizado || { ...cotacao, idEtapaCotacao: Number(valorEtapa) },
        {
          fornecedores,
          contatos,
          usuarios,
          compradores,
          prazosPagamento,
          etapasCotacao,
          produtos
        }
      );

      definirCotacaoOrdemCompraPendente({
        dadosOrdemCompra: montarDadosIniciaisOrdemCompraAPartirDoCotacao(cotacaoEnriquecido),
        idCotacao: cotacao.idCotacao,
        idEtapaAnterior: cotacao.idEtapaCotacao || null,
        idEtapaDestino: Number(valorEtapa),
        etapaJaAtualizada: true
      });
    }
  }

  function abrirNovoCotacao() {
    definirCotacaoSelecionado(null);
    definirModoModal('novo');
    definirModalAberto(true);
  }

  function abrirEdicaoCotacao(cotacao) {
    if (cotacaoBloqueadoParaEdicao(cotacao, usuarioLogado)) {
      abrirConsultaCotacao(cotacao);
      return;
    }

    definirCotacaoSelecionado(cotacao);
    definirModoModal('edicao');
    definirModalAberto(true);
  }

  function abrirConsultaCotacao(cotacao) {
    definirCotacaoSelecionado(cotacao);
    definirModoModal('consulta');
    definirModalAberto(true);
  }

  function fecharModal() {
    definirModalAberto(false);
    definirCotacaoSelecionado(null);
    definirModoModal('novo');
  }

  function abrirModalFiltrosCotacoes() {
    definirFiltrosEmEdicao({
      ...filtros,
      idUsuario: Array.isArray(filtros.idUsuario) ? [...filtros.idUsuario] : [],
      idCompradorFornecedor: Array.isArray(filtros.idCompradorFornecedor) ? [...filtros.idCompradorFornecedor] : [],
      idComprador: Array.isArray(filtros.idComprador) ? [...filtros.idComprador] : [],
      idsEtapaCotacao: Array.isArray(filtros.idsEtapaCotacao) ? [...filtros.idsEtapaCotacao] : []
    });
    definirModalFiltrosAberto(true);
  }

  function fecharModalFiltrosCotacoes() {
    definirModalFiltrosAberto(false);
    definirFiltrosEmEdicao(null);
  }

  function abrirExclusaoCotacao(cotacao) {
    if (!permitirExcluir || cotacao.idOrdemCompraVinculado) {
      return;
    }

    definirCotacaoExclusaoPendente(cotacao);
  }

  function cancelarExclusaoCotacao() {
    definirCotacaoExclusaoPendente(null);
  }

  async function confirmarExclusaoCotacao() {
    if (!cotacaoExclusaoPendente) {
      return;
    }

    await excluirCotacao(cotacaoExclusaoPendente.idCotacao);
    definirCotacaoExclusaoPendente(null);
    await recarregarPagina();
  }

  async function abrirOrdemCompraAPartirDoCotacao() {
    if (!cotacaoOrdemCompraPendente) {
      return;
    }

    let pendenciaOrdemCompra = cotacaoOrdemCompraPendente;

    if (!pendenciaOrdemCompra.etapaJaAtualizada && pendenciaOrdemCompra.idCotacao && pendenciaOrdemCompra.idEtapaDestino) {
      const cotacaoAtual = cotacoes.find((item) => item.idCotacao === pendenciaOrdemCompra.idCotacao);

      if (!cotacaoAtual) {
        return;
      }

      const registroAtualizado = await alterarEtapaRapidamente(
        cotacaoAtual,
        Number(pendenciaOrdemCompra.idEtapaDestino)
      );

      const cotacaoEnriquecido = enriquecerCotacaoParaOrdemCompra(
        registroAtualizado || {
          ...cotacaoAtual,
          idEtapaCotacao: Number(pendenciaOrdemCompra.idEtapaDestino)
        },
        {
          fornecedores,
          contatos,
          usuarios,
          compradores,
          prazosPagamento,
          etapasCotacao,
          produtos
        }
      );

      pendenciaOrdemCompra = {
        ...pendenciaOrdemCompra,
        dadosOrdemCompra: montarDadosIniciaisOrdemCompraAPartirDoCotacao(cotacaoEnriquecido),
        etapaJaAtualizada: true
      };
    }

    definirCotacaoOrdemCompraEmCriacao(pendenciaOrdemCompra);
    definirDadosIniciaisOrdemCompra(pendenciaOrdemCompra.dadosOrdemCompra);
    definirModalOrdemCompraAberto(true);
    definirCotacaoOrdemCompraPendente(null);
  }

  async function cancelarCriacaoOrdemCompra() {
    const pendencia = cotacaoOrdemCompraPendente || cotacaoOrdemCompraEmCriacao;

    if (!pendencia?.idCotacao) {
      definirCotacaoOrdemCompraPendente(null);
      definirCotacaoOrdemCompraEmCriacao(null);
      return;
    }

    const cotacaoAtual = cotacoes.find((item) => item.idCotacao === pendencia.idCotacao);
    const etapaFechadoSemOrdemCompra = obterEtapaFechadoSemOrdemCompra(etapasCotacao);

    if (cotacaoAtual && etapaFechadoSemOrdemCompra?.idEtapaCotacao) {
      await alterarEtapaRapidamente(
        cotacaoAtual,
        Number(etapaFechadoSemOrdemCompra.idEtapaCotacao)
      );
    } else {
      await recarregarPagina();
    }

    definirCotacaoOrdemCompraPendente(null);
    definirCotacaoOrdemCompraEmCriacao(null);
  }

  function fecharModalOrdemCompra() {
    definirModalOrdemCompraAberto(false);
    definirDadosIniciaisOrdemCompra(null);
    if (cotacaoOrdemCompraEmCriacao) {
      cancelarCriacaoOrdemCompra();
    }
  }

  async function salvarOrdemCompra(dadosOrdemCompra) {
    await incluirOrdemCompra(normalizarPayloadOrdemCompra(dadosOrdemCompra));
    await recarregarPagina();
    definirCotacaoOrdemCompraEmCriacao(null);
    fecharModalOrdemCompra();
  }

  const carregando = carregandoContexto || carregandoGrade;
  const colunasVisiveisCotacoes = useMemo(
    () => normalizarColunasGridCotacoes(empresa?.colunasGridCotacoes),
    [empresa?.colunasGridCotacoes]
  );
  const filtrosAtivos = JSON.stringify(filtros) !== JSON.stringify(filtrosIniciais);

  return (
    <>
      <header className="cabecalhoPagina">
        <div>
          <h1>Cotacoes</h1>
          <p>Cadastre, acompanhe e organize as propostas comerciais do SRM.</p>
        </div>

        <div className="acoesCabecalhoPagina">
          <CampoPesquisa
            valor={pesquisa}
            aoAlterar={definirPesquisa}
            placeholder="Pesquisar cotacoes"
            ariaLabel="Pesquisar cotacoes"
          />
          <Botao
            variante={filtrosAtivos ? 'primario' : 'secundario'}
            icone="filtro"
            somenteIcone
            title="Filtrar"
            aria-label="Filtrar"
            onClick={abrirModalFiltrosCotacoes}
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
            title="Nova cotacao"
            aria-label="Nova cotacao"
            onClick={abrirNovoCotacao}
          />
        </div>
      </header>

      <CorpoPagina>
        <GradePadrao
          modo="layout"
          totalColunasLayout={TOTAL_COLUNAS_GRID_COTACOES}
          cabecalho={<CabecalhoGradeCotacoes colunas={colunasVisiveisCotacoes} />}
          carregando={carregando}
          mensagemErro={mensagemErro}
          temItens={cotacoes.length > 0}
          mensagemCarregando="Carreganda cotacaos..."
          mensagemVazia="Nenhum cotacao encontrado."
        >
          {cotacoes.map((cotacao) => (
            <LinhaCotacao
              key={cotacao.idCotacao}
              cotacao={cotacao}
              colunas={colunasVisiveisCotacoes}
              etapasCotacao={etapasCotacao}
              permitirExcluir={permitirExcluir}
              usuarioLogado={usuarioLogado}
              empresa={empresa}
              fornecedores={fornecedores}
              permitirEdicao={!cotacaoBloqueadoParaEdicao(cotacao, usuarioLogado)}
              permitirAlteracaoEtapa={
                !cotacaoBloqueadoParaEdicao(cotacao, usuarioLogado)
                && !cotacao.idOrdemCompraVinculado
              }
              aoAlterarEtapa={(idEtapaCotacao) => selecionarEtapaNoGrid(cotacao, idEtapaCotacao)}
              aoConsultar={() => abrirConsultaCotacao(cotacao)}
              aoEditar={() => abrirEdicaoCotacao(cotacao)}
              aoExcluir={() => abrirExclusaoCotacao(cotacao)}
            />
          ))}
        </GradePadrao>
      </CorpoPagina>

      <ModalFiltros
        aberto={modalFiltrosAberto}
        titulo="Filtros de cotacoes"
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
            name: 'idComprador',
            label: 'Comprador da cotacao',
            multiple: true,
            disabled: Boolean(usuarioSomenteComprador),
            placeholder: 'Todos os compradores',
            options: compradores.map((comprador) => ({
              valor: String(comprador.idComprador),
              label: comprador.nome
            }))
          },
          {
            name: 'idsEtapaCotacao',
            label: 'Status da cotacao',
            multiple: true,
            tituloSelecao: 'Status da cotacao',
            options: etapasCotacao.map((etapa) => ({
              valor: String(etapa.idEtapaCotacao),
              label: etapa.descricao
            }))
          },
          {
            name: 'periodosDatasCotacao',
            label: 'Datas',
            type: 'date-filters-modal',
            tituloSelecao: 'Filtros de datas da cotacao',
            placeholder: 'Selecionar datas',
            periodos: [
              {
                titulo: 'Data de inclusao',
                nomeInicio: 'dataInclusaoInicio',
                nomeFim: 'dataInclusaoFim',
                labelInicio: 'Inicio da inclusao',
                labelFim: 'Fim da inclusao'
              },
              {
                titulo: 'Data de fechamento',
                nomeInicio: 'dataFechamentoInicio',
                nomeFim: 'dataFechamentoFim',
                labelInicio: 'Inicio do fechamento',
                labelFim: 'Fim do fechamento'
              }
            ]
          }
        ]}
        aoFechar={fecharModalFiltrosCotacoes}
        aoAplicar={(proximosFiltros) => {
          definirFiltros(proximosFiltros);
          fecharModalFiltrosCotacoes();
        }}
        aoLimpar={() => {
          const filtrosLimpos = criarFiltrosLimposCotacoes(usuarioLogado, empresa);
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
            ...(estadoAtual || criarFiltrosIniciaisCotacoes(usuarioLogado, empresa)),
            idFornecedor: String(fornecedor.idFornecedor || '')
          }));
          definirModalBuscaFornecedorFiltrosAberto(false);
        }}
        aoFechar={() => definirModalBuscaFornecedorFiltrosAberto(false)}
      />

      <ModalCotacao
        aberto={modalAberto}
        cotacao={cotacaoSelecionado}
        fornecedores={fornecedores}
        contatos={contatos}
        usuarios={usuarios}
        compradores={compradores}
        ramosAtividade={ramosAtividade}
        conceitosFornecedor={conceitosFornecedor}
        metodosPagamento={metodosPagamento}
        prazosPagamento={prazosPagamento}
        etapasCotacao={etapasCotacao}
        produtos={produtos}
        camposCotacao={camposCotacao}
        camposOrdemCompra={camposOrdemCompra}
        empresa={empresa}
        usuarioLogado={usuarioLogado}
        modo={modoModal}
        idCompradorBloqueado={usuarioSomenteComprador ? usuarioLogado.idComprador : null}
        somenteConsultaPrazos={usuarioSomenteConsultaConfiguracao}
        aoIncluirFornecedor={incluirFornecedorPeloCotacao}
        aoFechar={fecharModal}
        aoSalvar={salvarCotacao}
        aoSalvarPrazoPagamento={salvarPrazoPagamento}
        aoInativarPrazoPagamento={inativarPrazoPagamento}
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
        somenteConsultaPrazos={usuarioSomenteConsultaConfiguracao}
        aoIncluirFornecedor={incluirFornecedorPeloCotacao}
        aoFechar={fecharModalOrdemCompra}
        aoSalvar={salvarOrdemCompra}
        aoSalvarPrazoPagamento={salvarPrazoPagamento}
        aoInativarPrazoPagamento={inativarPrazoPagamento}
      />

      <ModalManualCotacoes
        aberto={modalManualAberto}
        aoFechar={() => definirModalManualAberto(false)}
        cotacoes={cotacoes}
        etapasCotacao={etapasCotacao}
        prazosPagamento={prazosPagamento}
        filtros={filtros}
        empresa={empresa}
        usuarioLogado={usuarioLogado}
      />
      <ModalColunasGridCotacoes
        aberto={modalColunasGridAberto}
        empresa={empresa}
        aoFechar={() => definirModalColunasGridAberto(false)}
        aoSalvar={salvarColunasGridCotacoes}
      />

      {cotacaoExclusaoPendente ? (
        <div className="camadaConfirmacaoModal" role="presentation" onMouseDown={cancelarExclusaoCotacao}>
          <div
            className="modalConfirmacaoAgenda"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="tituloConfirmacaoExclusaoCotacao"
            onMouseDown={(evento) => evento.stopPropagation()}
          >
            <div className="cabecalhoConfirmacaoModal">
              <h4 id="tituloConfirmacaoExclusaoCotacao">Excluir cotacao</h4>
            </div>

            <div className="corpoConfirmacaoModal">
              <p>Tem certeza que deseja excluir este cotacao?</p>
            </div>

            <div className="acoesConfirmacaoModal">
              <Botao variante="secundario" type="button" onClick={cancelarExclusaoCotacao}>
                Nao
              </Botao>
              <Botao variante="perigo" type="button" onClick={confirmarExclusaoCotacao}>
                Sim
              </Botao>
            </div>
          </div>
        </div>
      ) : null}

      {cotacaoOrdemCompraPendente ? (
        <div className="camadaConfirmacaoModal" role="presentation" onMouseDown={cancelarCriacaoOrdemCompra}>
          <div
            className="modalConfirmacaoAgenda"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tituloConfirmacaoCriarOrdemCompra"
            onMouseDown={(evento) => evento.stopPropagation()}
          >
            <div className="cabecalhoConfirmacaoModal">
              <h4 id="tituloConfirmacaoCriarOrdemCompra">Criar ordem de compra</h4>
            </div>

            <div className="corpoConfirmacaoModal">
              <p>Este cotacao foi fechado. Deseja criar um ordem de compra a partir dele?</p>
            </div>

            <div className="acoesConfirmacaoModal">
              <Botao variante="secundario" type="button" onClick={cancelarCriacaoOrdemCompra}>
                Nao
              </Botao>
              <Botao variante="primario" type="button" onClick={abrirOrdemCompraAPartirDoCotacao}>
                Sim
              </Botao>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function CabecalhoGradeCotacoes({ colunas }) {
  return (
    <div className="cabecalhoLayoutGradePadrao cabecalhoGradeCotacoes">
      {colunas.map((coluna) => (
        <div key={coluna.id} className={coluna.classe} style={obterEstiloColunaLayout(coluna)}>
          {coluna.rotulo}
        </div>
      ))}
    </div>
  );
}

function LinhaCotacao({
  cotacao,
  colunas,
  etapasCotacao,
  permitirExcluir,
  usuarioLogado,
  empresa,
  fornecedores,
  permitirEdicao,
  permitirAlteracaoEtapa,
  aoAlterarEtapa,
  aoConsultar,
  aoEditar,
  aoExcluir
}) {
  return (
    <div className="linhaLayoutGradePadrao linhaCotacao">
      {colunas.map((coluna) => renderizarCelulaCotacao({
        coluna,
        cotacao,
        etapasCotacao,
        permitirExcluir,
        usuarioLogado,
        empresa,
        fornecedores,
        permitirEdicao,
        permitirAlteracaoEtapa,
        aoAlterarEtapa,
        aoConsultar,
        aoEditar,
        aoExcluir
      }))}
    </div>
  );
}

function renderizarCelulaCotacao({
  coluna,
  cotacao,
  etapasCotacao,
  permitirExcluir,
  usuarioLogado,
  empresa,
  fornecedores,
  permitirEdicao,
  permitirAlteracaoEtapa,
  aoAlterarEtapa,
  aoConsultar,
  aoEditar,
  aoExcluir
}) {
  const propriedadesCelula = {
    className: `celulaLayoutGradePadrao ${coluna.classe}`.trim(),
    style: obterEstiloColunaLayout(coluna)
  };

  if (coluna.id === 'codigo') {
    return (
      <CelulaLayoutCotacao key={coluna.id} coluna={coluna} {...propriedadesCelula}>
        <CodigoRegistro valor={cotacao.idCotacao} />
      </CelulaLayoutCotacao>
    );
  }

  if (coluna.id === 'idCotacao') {
    return (
      <CelulaLayoutCotacao key={coluna.id} coluna={coluna} {...propriedadesCelula}>
        <CodigoRegistro valor={cotacao.idCotacao} />
      </CelulaLayoutCotacao>
    );
  }

  if (coluna.id === 'fornecedor') {
    return (
      <CelulaLayoutCotacao key={coluna.id} coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(cotacao.nomeFornecedor)}</TextoGradeClamp>
      </CelulaLayoutCotacao>
    );
  }

  if (coluna.id === 'idFornecedor') {
    const fornecedor = (Array.isArray(fornecedores) ? fornecedores : []).find(
      (item) => String(item.idFornecedor) === String(cotacao.idFornecedor)
    );

    return (
      <CelulaLayoutCotacao key={coluna.id} coluna={coluna} {...propriedadesCelula}>
        {cotacao.idFornecedor
          ? <CodigoRegistro valor={formatarCodigoFornecedor(fornecedor || { idFornecedor: cotacao.idFornecedor }, empresa).replace('#', '')} />
          : '-'}
      </CelulaLayoutCotacao>
    );
  }

  if (coluna.id === 'idConceito') {
    const fornecedor = (Array.isArray(fornecedores) ? fornecedores : []).find(
      (item) => String(item.idFornecedor) === String(cotacao.idFornecedor)
    );

    return (
      <CelulaLayoutCotacao key={coluna.id} coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(fornecedor?.nomeConceito)}</TextoGradeClamp>
      </CelulaLayoutCotacao>
    );
  }

  if (coluna.id === 'contato') {
    return (
      <CelulaLayoutCotacao key={coluna.id} coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(cotacao.nomeContato)}</TextoGradeClamp>
      </CelulaLayoutCotacao>
    );
  }

  if (coluna.id === 'idContato') {
    return (
      <CelulaLayoutCotacao key={coluna.id} coluna={coluna} {...propriedadesCelula}>
        {cotacao.idContato ? <CodigoRegistro valor={cotacao.idContato} /> : '-'}
      </CelulaLayoutCotacao>
    );
  }

  if (coluna.id === 'usuario') {
    return (
      <CelulaLayoutCotacao key={coluna.id} coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(cotacao.nomeUsuario)}</TextoGradeClamp>
      </CelulaLayoutCotacao>
    );
  }

  if (coluna.id === 'idUsuario') {
    return (
      <CelulaLayoutCotacao key={coluna.id} coluna={coluna} {...propriedadesCelula}>
        {cotacao.idUsuario ? <CodigoRegistro valor={cotacao.idUsuario} /> : '-'}
      </CelulaLayoutCotacao>
    );
  }

  if (coluna.id === 'idOrdemCompraVinculado') {
    return (
      <CelulaLayoutCotacao key={coluna.id} coluna={coluna} {...propriedadesCelula}>
        {cotacao.idOrdemCompraVinculado ? (
          <CodigoRegistro valor={cotacao.idOrdemCompraVinculado} />
        ) : (
          '-'
        )}
      </CelulaLayoutCotacao>
    );
  }

  if (coluna.id === 'idComprador') {
    return (
      <CelulaLayoutCotacao key={coluna.id} coluna={coluna} {...propriedadesCelula}>
        {cotacao.idComprador ? <CodigoRegistro valor={cotacao.idComprador} /> : '-'}
      </CelulaLayoutCotacao>
    );
  }

  if (coluna.id === 'etapa') {
    const etapasDisponiveisEscolhaManual = obterEtapasCotacaoParaInputManual(
      etapasCotacao,
      cotacao.idEtapaCotacao
    );

    return (
      <CelulaLayoutCotacao key={coluna.id} coluna={coluna} {...propriedadesCelula}>
        <div className="campoEtapaGridCotacao">
          <select
            className="selectEtapaGridCotacao"
            style={criarEstiloEtapaCotacao(cotacao.corEtapaCotacao)}
            value={cotacao.idEtapaCotacao ? String(cotacao.idEtapaCotacao) : ''}
            onChange={(evento) => aoAlterarEtapa(evento.target.value)}
            aria-label={`Alterar etapa da cotacao ${cotacao.idCotacao}`}
            disabled={!permitirAlteracaoEtapa}
          >
            <option value="">Sem etapa</option>
            {etapasDisponiveisEscolhaManual.map((etapa) => (
              <option key={etapa.idEtapaCotacao} value={etapa.idEtapaCotacao}>
                {etapa.descricao}
              </option>
            ))}
          </select>
        </div>
      </CelulaLayoutCotacao>
    );
  }

  if (coluna.id === 'idEtapaCotacao') {
    return (
      <CelulaLayoutCotacao key={coluna.id} coluna={coluna} {...propriedadesCelula}>
        {cotacao.idEtapaCotacao ? <CodigoRegistro valor={cotacao.idEtapaCotacao} /> : '-'}
      </CelulaLayoutCotacao>
    );
  }

  if (coluna.id === 'comprador') {
    return (
      <CelulaLayoutCotacao key={coluna.id} coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(cotacao.nomeComprador)}</TextoGradeClamp>
      </CelulaLayoutCotacao>
    );
  }


  if (coluna.id === 'prazoPagamento') {
    return (
      <CelulaLayoutCotacao key={coluna.id} coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(cotacao.nomePrazoPagamento)}</TextoGradeClamp>
      </CelulaLayoutCotacao>
    );
  }

  if (coluna.id === 'idPrazoPagamento') {
    return (
      <CelulaLayoutCotacao key={coluna.id} coluna={coluna} {...propriedadesCelula}>
        {cotacao.idPrazoPagamento ? <CodigoRegistro valor={cotacao.idPrazoPagamento} /> : '-'}
      </CelulaLayoutCotacao>
    );
  }

  if (coluna.id === 'metodoPagamento') {
    return (
      <CelulaLayoutCotacao key={coluna.id} coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(cotacao.nomeMetodoPagamento)}</TextoGradeClamp>
      </CelulaLayoutCotacao>
    );
  }


  if (coluna.id === 'dataInclusao') {
    return (
      <CelulaLayoutCotacao key={coluna.id} coluna={coluna} {...propriedadesCelula}>
        {formatarDataGridCotacao(cotacao.dataInclusao)}
      </CelulaLayoutCotacao>
    );
  }

  if (coluna.id === 'dataValidade') {
    return (
      <CelulaLayoutCotacao key={coluna.id} coluna={coluna} {...propriedadesCelula}>
        {formatarDataGridCotacao(cotacao.dataValidade)}
      </CelulaLayoutCotacao>
    );
  }

  if (coluna.id === 'dataFechamento') {
    return (
      <CelulaLayoutCotacao key={coluna.id} coluna={coluna} {...propriedadesCelula}>
        {formatarDataGridCotacao(cotacao.dataFechamento)}
      </CelulaLayoutCotacao>
    );
  }

  if (coluna.id === 'observacao') {
    return (
      <CelulaLayoutCotacao key={coluna.id} coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(cotacao.observacao)}</TextoGradeClamp>
      </CelulaLayoutCotacao>
    );
  }

  if (coluna.id === 'total') {
    return (
      <CelulaLayoutCotacao key={coluna.id} coluna={coluna} {...propriedadesCelula}>
        {normalizarPreco(cotacao.totalCotacao)}
      </CelulaLayoutCotacao>
    );
  }

  if (coluna.id === 'acoes') {
    return (
      <CelulaLayoutCotacao key={coluna.id} coluna={coluna} {...propriedadesCelula}>
        <AcoesRegistro
          rotuloConsulta="Consultar cotacao"
          rotuloEdicao={permitirEdicao ? 'Editar cotacao' : obterRotuloBloqueioEdicaoCotacao(cotacao, usuarioLogado)}
          rotuloInativacao="Excluir cotacao"
          iconeInativacao="limpar"
          exibirInativacao={permitirExcluir && !cotacao.idOrdemCompraVinculado}
          desabilitarEdicao={!permitirEdicao}
          aoConsultar={aoConsultar}
          aoEditar={aoEditar}
          aoInativar={aoExcluir}
        />
      </CelulaLayoutCotacao>
    );
  }

  return null;
}

function CelulaLayoutCotacao({ coluna, children, ...propriedades }) {
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

function formatarDataGridCotacao(valor) {
  if (!valor) {
    return '-';
  }

  const texto = String(valor).slice(0, 10);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
    return '-';
  }

  const [ano, mes, dia] = texto.split('-');
  return `${dia}/${mes}/${ano}`;
}

function normalizarFiltrosCotacoes(filtros, filtrosPadrao) {
  const filtrosNormalizados = normalizarFiltrosPorPadrao(filtros, filtrosPadrao);
  const compradorTravado = Array.isArray(filtrosPadrao.idComprador) && filtrosPadrao.idComprador.length > 0;

  return {
    ...filtrosNormalizados,
    idUsuario: normalizarListaFiltroPersistido(filtrosNormalizados.idUsuario),
    idCompradorFornecedor: normalizarListaFiltroPersistido(filtros.idCompradorFornecedor || filtros.idCompradorFornecedor),
    idComprador: compradorTravado
      ? [...filtrosPadrao.idComprador]
      : normalizarListaFiltroPersistido(filtrosNormalizados.idComprador),
    idsEtapaCotacao: normalizarListaFiltroPersistido(filtrosNormalizados.idsEtapaCotacao),
    ...normalizarIntervaloDatasFiltros(
      filtrosNormalizados,
      filtrosPadrao,
      'dataInclusaoInicio',
      'dataInclusaoFim'
    ),
    ...normalizarIntervaloDatasFiltros(
      filtrosNormalizados,
      filtrosPadrao,
      'dataFechamentoInicio',
      'dataFechamentoFim'
    )
  };
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

function normalizarIntervaloDatasFiltros(filtros, filtrosPadrao, chaveInicio, chaveFim) {
  const dataInicio = normalizarDataFiltro(filtros?.[chaveInicio]) || normalizarDataFiltro(filtrosPadrao?.[chaveInicio]);
  const dataFim = normalizarDataFiltro(filtros?.[chaveFim]) || normalizarDataFiltro(filtrosPadrao?.[chaveFim]);

  if (dataInicio && dataFim && dataInicio > dataFim) {
    return {
      [chaveInicio]: dataFim,
      [chaveFim]: dataInicio
    };
  }

  return {
    [chaveInicio]: dataInicio,
    [chaveFim]: dataFim
  };
}

function validarPeriodoData(valorData, dataInicio, dataFim) {
  const dataNormalizada = normalizarDataFiltro(valorData);

  if (!dataInicio && !dataFim) {
    return true;
  }

  if (!dataNormalizada) {
    return false;
  }

  if (dataInicio && dataNormalizada < dataInicio) {
    return false;
  }

  if (dataFim && dataNormalizada > dataFim) {
    return false;
  }

  return true;
}

function normalizarDataFiltro(valor) {
  const texto = String(valor || '').trim();

  if (!texto) {
    return '';
  }

  return texto.slice(0, 10);
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

function enriquecerCotacoes(
  cotacoes,
  fornecedores,
  contatos,
  usuarios,
  compradores,
  prazosPagamento,
  etapasCotacao,
  produtos
) {
  const fornecedoresPorId = new Map(
    fornecedores.map((fornecedor) => [String(fornecedor.idFornecedor), fornecedor])
  );
  const contatosPorId = new Map(
    contatos.map((contato) => [String(contato.idContato), contato.nome])
  );
  const usuariosPorId = new Map(
    usuarios.map((usuario) => [String(usuario.idUsuario), usuario.nome])
  );
  const compradoresPorId = new Map(
    compradores.map((comprador) => [String(comprador.idComprador), comprador.nome])
  );
  const prazosPorId = new Map(
    prazosPagamento.map((prazo) => [String(prazo.idPrazoPagamento), prazo])
  );
  const etapasPorId = new Map(
    etapasCotacao.map((etapa) => [String(etapa.idEtapaCotacao), etapa])
  );
  const produtosPorId = new Map(
    produtos.map((produto) => [String(produto.idProduto), produto])
  );

  return cotacoes.map((cotacao) => {
    const fornecedor = fornecedoresPorId.get(String(cotacao.idFornecedor));
    const prazo = prazosPorId.get(String(cotacao.idPrazoPagamento));
    const etapa = etapasPorId.get(String(cotacao.idEtapaCotacao));
    const totalCotacao = Array.isArray(cotacao.itens)
      ? cotacao.itens.reduce((total, item) => total + (Number(item.valorTotal) || 0), 0)
      : 0;

    return {
      ...cotacao,
      itens: Array.isArray(cotacao.itens) ? cotacao.itens.map((item) => ({
        ...item,
        nomeProduto: obterValorGrid(
          item.nomeProduto || produtosPorId.get(String(item.idProduto))?.descricao
        )
      })) : [],
      nomeFornecedor: obterValorGrid(
        cotacao.nomeFornecedor || fornecedor?.nomeFantasia || fornecedor?.razaoSocial
      ),
      nomeContato: obterValorGrid(
        cotacao.nomeContato || contatosPorId.get(String(cotacao.idContato))
      ),
      idCompradorFornecedor: fornecedor?.idComprador || null,
      nomeCompradorFornecedor: obterValorGrid(
        cotacao.nomeCompradorFornecedor || compradoresPorId.get(String(fornecedor?.idComprador))
      ),
      nomeUsuario: obterValorGrid(
        cotacao.nomeUsuario || usuariosPorId.get(String(cotacao.idUsuario))
      ),
      nomeComprador: obterValorGrid(
        cotacao.nomeComprador || compradoresPorId.get(String(cotacao.idComprador))
      ),
      nomeMetodoPagamento: obterValorGrid(
        cotacao.nomeMetodoPagamento || prazo?.nomeMetodoPagamento
      ),
      nomePrazoPagamento: obterValorGrid(
        cotacao.nomePrazoPagamento || prazo?.descricaoFormatada
      ),
      nomePrazoPagamentoDias: obterValorGrid(
        cotacao.nomePrazoPagamentoDias || prazo?.descricaoDias
      ),
      nomeEtapaCotacao: obterValorGrid(
        cotacao.nomeEtapaCotacao || etapa?.descricao
      ),
      corEtapaCotacao: cotacao.corEtapaCotacao || etapa?.cor || '',
      totalCotacao
    };
  });
}

function enriquecerPrazosPagamento(prazosPagamento, metodosPagamento = []) {
  const metodosPorId = new Map(
    metodosPagamento.map((metodo) => [metodo.idMetodoPagamento, metodo.descricao])
  );

  return prazosPagamento.map((prazo) => {
    const parcelas = [prazo.prazo1, prazo.prazo2, prazo.prazo3, prazo.prazo4, prazo.prazo5, prazo.prazo6]
      .filter((valor) => valor !== null && valor !== undefined && valor !== '')
      .join(' / ');
    const descricaoFormatada = prazo.descricao || (parcelas ? `${parcelas} dias` : 'Prazo sem descricao');
    const descricaoDias = parcelas ? `${parcelas} dias` : '';

    return {
      ...prazo,
      nomeMetodoPagamento: metodosPorId.get(prazo.idMetodoPagamento) || '',
      descricaoDias,
      descricaoFormatada
    };
  });
}

function enriquecerPrazoPagamento(prazo, metodosPagamento = []) {
  if (!prazo) {
    return null;
  }

  return enriquecerPrazosPagamento([prazo], metodosPagamento)[0] || null;
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
    dataFechamento: limparTextoOpcional(dadosCotacao.dataFechamento),
    observacao: limparTextoOpcional(dadosCotacao.observacao),
    itens: dadosCotacao.itens.map((item) => ({
      idProduto: Number(item.idProduto),
      quantidade: normalizarNumeroDecimal(item.quantidade),
      valorUnitario: normalizarNumeroDecimal(item.valorUnitario),
      valorTotal: normalizarNumeroDecimal(item.valorTotal),
      imagem: limparTextoOpcional(item.imagem),
      observacao: limparTextoOpcional(item.observacao)
    })),
    camposExtras: dadosCotacao.camposExtras.map((campo) => ({
      idCampoCotacao: Number(campo.idCampoCotacao),
      valor: limparTextoOpcional(campo.valor)
    }))
  };
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

async function salvarContatosFornecedorCadastro(idFornecedor, contatos) {
  const contatosNormalizados = normalizarContatosFornecedorCadastro(contatos, idFornecedor);

  for (const contato of contatosNormalizados) {
    await incluirContato(contato);
  }
}

function normalizarPayloadFornecedorCadastro(dadosFornecedor) {
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

function normalizarContatosFornecedorCadastro(contatos, idFornecedor) {
  if (!Array.isArray(contatos)) {
    return [];
  }

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

function limparTextoOpcional(valor) {
  const texto = String(valor || '').trim();
  return texto || null;
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

function criarEstiloEtapaCotacao(cor) {
  const corBase = normalizarCorHexadecimal(cor || '#9506F4');

  return {
    background: converterHexParaRgba(corBase, 0.22),
    color: escurecerCorHexadecimal(corBase, 0.18)
  };
}

function obterEtapasFiltroPadraoCotacao(empresa) {
  if (!empresa?.etapasFiltroPadraoCotacao) {
    return [];
  }

  try {
    const lista = JSON.parse(empresa.etapasFiltroPadraoCotacao);
    return Array.isArray(lista) ? lista.map(String) : [];
  } catch (_erro) {
    return String(empresa.etapasFiltroPadraoCotacao)
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
}

function etapaAcabouDeFechar(idEtapaAnterior, idEtapaAtual, etapasCotacao) {
  const etapaAnterior = etapasCotacao.find((etapa) => String(etapa.idEtapaCotacao) === String(idEtapaAnterior || ''));
  const etapaAtual = etapasCotacao.find((etapa) => String(etapa.idEtapaCotacao) === String(idEtapaAtual || ''));

  return !etapaCotacaoEhFechamento(etapaAnterior) && etapaCotacaoEhFechamento(etapaAtual);
}

function etapaCotacaoEhFechadoPorId(idEtapaCotacao) {
  return [
    ID_ETAPA_COTACAO_FECHAMENTO,
    ID_ETAPA_COTACAO_FECHADO_SEM_ORDEM_COMPRA,
    ID_ETAPA_COTACAO_ORDEM_COMPRA_EXCLUIDO,
    ID_ETAPA_COTACAO_RECUSADO
  ].includes(Number(idEtapaCotacao));
}

function entrouEmEtapaFechada(idEtapaAnterior, idEtapaAtual) {
  return !etapaCotacaoEhFechadoPorId(idEtapaAnterior) && etapaCotacaoEhFechadoPorId(idEtapaAtual);
}

function cotacaoBloqueadoParaUsuarioPadrao(cotacao, usuarioLogado) {
  return usuarioLogado?.tipo === 'Usuario padrao' && etapaCotacaoEhFechadoPorId(cotacao?.idEtapaCotacao);
}

function cotacaoBloqueadoParaEdicao(cotacao, usuarioLogado) {
  if (Number(cotacao?.idOrdemCompraVinculado) > 0) {
    return true;
  }

  if (Number(cotacao?.idEtapaCotacao) === ID_ETAPA_COTACAO_RECUSADO) {
    return true;
  }

  return cotacaoBloqueadoParaUsuarioPadrao(cotacao, usuarioLogado);
}

function obterRotuloBloqueioEdicaoCotacao(cotacao, usuarioLogado) {
  if (Number(cotacao?.idOrdemCompraVinculado) > 0) {
    return 'Cotacao com ordem de compra vinculado: consulta apenas.';
  }

  if (Number(cotacao?.idEtapaCotacao) === ID_ETAPA_COTACAO_RECUSADO) {
    return 'Cotacao recusado: consulta apenas.';
  }

  if (cotacaoBloqueadoParaUsuarioPadrao(cotacao, usuarioLogado)) {
    return 'Cotacao fechado: usuario padrao consulta apenas.';
  }

  return 'Editar cotacao';
}

function etapaCotacaoEhFechamento(etapa) {
  return Number(etapa?.idEtapaCotacao) === ID_ETAPA_COTACAO_FECHAMENTO;
}

function obterEtapaFechadoSemOrdemCompra(etapasCotacao) {
  return etapasCotacao.find((etapa) => Number(etapa?.idEtapaCotacao) === ID_ETAPA_COTACAO_FECHADO_SEM_ORDEM_COMPRA) || null;
}

function enriquecerCotacaoParaOrdemCompra(cotacao, contexto) {
  const fornecedor = contexto.fornecedores.find((item) => String(item.idFornecedor) === String(cotacao.idFornecedor));
  const contato = contexto.contatos.find((item) => String(item.idContato) === String(cotacao.idContato));
  const usuario = contexto.usuarios.find((item) => String(item.idUsuario) === String(cotacao.idUsuario));
  const comprador = contexto.compradores.find((item) => String(item.idComprador) === String(cotacao.idComprador));
  const prazo = contexto.prazosPagamento.find((item) => String(item.idPrazoPagamento) === String(cotacao.idPrazoPagamento));
  const etapa = contexto.etapasCotacao.find((item) => String(item.idEtapaCotacao) === String(cotacao.idEtapaCotacao));

  return {
    ...cotacao,
    nomeFornecedor: cotacao.nomeFornecedor || fornecedor?.nomeFantasia || fornecedor?.razaoSocial || '',
    nomeContato: cotacao.nomeContato || contato?.nome || '',
    nomeUsuario: cotacao.nomeUsuario || usuario?.nome || '',
    nomeComprador: cotacao.nomeComprador || comprador?.nome || '',
    nomePrazoPagamento: cotacao.nomePrazoPagamento || prazo?.descricaoFormatada || prazo?.descricao || '',
    nomeMetodoPagamento: cotacao.nomeMetodoPagamento || prazo?.nomeMetodoPagamento || '',
    nomeEtapaCotacao: cotacao.nomeEtapaCotacao || etapa?.descricao || '',
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

function obterDataAtualFormatoInput() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');

  return `${ano}-${mes}-${dia}`;
}

function normalizarCorHexadecimal(cor) {
  const texto = String(cor || '').trim();
  return /^#([0-9a-fA-F]{6})$/.test(texto) ? texto : '#9506F4';
}

function escurecerCorHexadecimal(cor, intensidade = 0.2) {
  const corNormalizada = normalizarCorHexadecimal(cor).replace('#', '');
  const fator = Math.max(0, Math.min(1, 1 - intensidade));
  const vermelho = Math.round(Number.parseInt(corNormalizada.slice(0, 2), 16) * fator);
  const verde = Math.round(Number.parseInt(corNormalizada.slice(2, 4), 16) * fator);
  const azul = Math.round(Number.parseInt(corNormalizada.slice(4, 6), 16) * fator);

  return `#${[vermelho, verde, azul].map((canal) => canal.toString(16).padStart(2, '0')).join('')}`;
}

function converterHexParaRgba(cor, opacidade = 1) {
  const corNormalizada = normalizarCorHexadecimal(cor).replace('#', '');
  const vermelho = Number.parseInt(corNormalizada.slice(0, 2), 16);
  const verde = Number.parseInt(corNormalizada.slice(2, 4), 16);
  const azul = Number.parseInt(corNormalizada.slice(4, 6), 16);

  return `rgba(${vermelho}, ${verde}, ${azul}, ${opacidade})`;
}


