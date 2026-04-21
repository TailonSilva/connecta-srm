import { useEffect, useMemo, useState } from 'react';
import { listarAtendimentos, listarCanaisAtendimento, listarOrigensAtendimento, listarTiposAtendimento } from '../../servicos/atendimentos';
import { Botao } from '../comuns/botao';
import { ModalFiltros } from '../comuns/modalFiltros';
import { ModalBuscaFornecedores } from '../comuns/modalBuscaFornecedores';
import { ModalRelatorioGrade } from '../comuns/modalRelatorioGrade';
import { PopupAvisos } from '../comuns/popupAvisos';
import { TabelaHistoricoAtendimentos } from '../comuns/tabelaHistoricoAtendimentos';
import { TabelaHistoricoCotacoes } from '../comuns/tabelaHistoricoCotacoes';
import { TabelaHistoricoOrdensCompra } from '../comuns/tabelaHistoricoOrdensCompra';
import { listarFornecedores, listarContatos, listarGruposEmpresa, listarCompradores } from '../../servicos/fornecedores';
import { listarEtapasCotacaoConfiguracao, listarEtapasOrdemCompraConfiguracao, listarTiposOrdemCompraConfiguracao } from '../../servicos/configuracoes';
import { desktopTemExportacaoPdf } from '../../servicos/desktop';
import { listarCotacoes } from '../../servicos/cotacoes';
import { listarOrdensCompra } from '../../servicos/ordensCompra';
import { listarGruposProduto, listarMarcas, listarProdutos } from '../../servicos/produtos';
import { listarUsuarios } from '../../servicos/usuarios';
import { normalizarPreco } from '../../utilitarios/normalizarPreco';
import { exportarRelatorioAtendimentosPdf } from '../../utilitarios/configuracoes/exportarRelatorioAtendimentosPdf';
import { exportarRelatorioConversaoPdf } from '../../utilitarios/configuracoes/exportarRelatorioConversaoPdf';
import { exportarRelatorioOrdensCompraFechadasPdf } from '../../utilitarios/configuracoes/exportarRelatorioOrdensCompraFechadasPdf';

const relatoriosConfiguracao = {
  relatorioOrdensCompraFechados: {
    titulo: 'Ordens de compra',
    subtitulo: 'Leitura baseada nas datas de inclusao e entrega das ordens de compra.',
    tituloFiltro: 'Filtrar ordens de compra',
    ariaFiltro: 'Filtrar ordens de compra'
  },
  relatorioOrdensCompraEntregues: {
    titulo: 'Conversao',
    subtitulo: 'Leitura consolidada das cotacoes para acompanhar geracao, fechamento e conversao.',
    tituloFiltro: 'Filtrar conversao',
    ariaFiltro: 'Filtrar conversao'
  },
  relatorioAtendimentos: {
    titulo: 'Atendimentos',
    subtitulo: 'Leitura consolidada dos atendimentos comerciais com foco em fornecedor, canal e origem.',
    tituloFiltro: 'Filtrar atendimentos',
    ariaFiltro: 'Filtrar atendimentos'
  }
};

export function ModalRelatorioConfiguracao({ relatorio, usuarioLogado, aoFechar }) {
  const configuracao = relatoriosConfiguracao[relatorio] || null;
  const aberto = Boolean(configuracao);
  const exportacaoPdfDisponivel = desktopTemExportacaoPdf();
  const filtrosPadraoOrdensCompraFechados = useMemo(() => obterFiltrosPadraoOrdensCompraFechados(), [aberto, relatorio, usuarioLogado?.idUsuario]);
  const filtrosPadraoConversao = useMemo(() => obterFiltrosPadraoConversao(), [aberto, relatorio, usuarioLogado?.idUsuario]);
  const filtrosPadraoAtendimentos = useMemo(() => obterFiltrosPadraoAtendimentos(), [aberto, relatorio, usuarioLogado?.idUsuario]);
  const [modalFiltrosAberto, definirModalFiltrosAberto] = useState(false);
  const [modalBuscaFornecedorAberto, definirModalBuscaFornecedorAberto] = useState(false);
  const [carregandoOrdensCompra, definirCarregandoOrdensCompra] = useState(false);
  const [mensagemErroOrdensCompra, definirMensagemErroOrdensCompra] = useState('');
  const [ordensCompra, definirOrdensCompra] = useState([]);
  const [fornecedores, definirFornecedores] = useState([]);
  const [compradores, definirCompradores] = useState([]);
  const [gruposEmpresaRelatorio, definirGruposEmpresaRelatorio] = useState([]);
  const [gruposProdutoRelatorio, definirGruposProdutoRelatorio] = useState([]);
  const [marcasRelatorio, definirMarcasRelatorio] = useState([]);
  const [etapasOrdemCompra, definirEtapasOrdemCompra] = useState([]);
  const [tiposOrdemCompraRelatorio, definirTiposOrdemCompraRelatorio] = useState([]);
  const [avisosPopup, definirAvisosPopup] = useState([]);
  const [gerandoPdf, definirGerandoPdf] = useState(false);
  const [filtrosOrdensCompraFechados, definirFiltrosOrdensCompraFechados] = useState(() => obterFiltrosPadraoOrdensCompraFechados());
  const [rascunhoFiltrosOrdensCompraFechados, definirRascunhoFiltrosOrdensCompraFechados] = useState(() => obterFiltrosPadraoOrdensCompraFechados());
  const [carregandoConversao, definirCarregandoConversao] = useState(false);
  const [mensagemErroConversao, definirMensagemErroConversao] = useState('');
  const [cotacoesConversao, definirCotacoesConversao] = useState([]);
  const [usuariosConversao, definirUsuariosConversao] = useState([]);
  const [etapasCotacaoConversao, definirEtapasCotacaoConversao] = useState([]);
  const [modalFiltrosConversaoAberto, definirModalFiltrosConversaoAberto] = useState(false);
  const [modalBuscaFornecedorConversaoAberto, definirModalBuscaFornecedorConversaoAberto] = useState(false);
  const [gerandoPdfConversao, definirGerandoPdfConversao] = useState(false);
  const [filtrosConversao, definirFiltrosConversao] = useState(() => obterFiltrosPadraoConversao());
  const [rascunhoFiltrosConversao, definirRascunhoFiltrosConversao] = useState(() => obterFiltrosPadraoConversao());
  const [carregandoAtendimentosRelatorio, definirCarregandoAtendimentosRelatorio] = useState(false);
  const [mensagemErroAtendimentosRelatorio, definirMensagemErroAtendimentosRelatorio] = useState('');
  const [atendimentosRelatorio, definirAtendimentosRelatorio] = useState([]);
  const [usuariosRelatorio, definirUsuariosRelatorio] = useState([]);
  const [tiposAtendimentoRelatorio, definirTiposAtendimentoRelatorio] = useState([]);
  const [canaisAtendimentoRelatorio, definirCanaisAtendimentoRelatorio] = useState([]);
  const [origensAtendimentoRelatorio, definirOrigensAtendimentoRelatorio] = useState([]);
  const [modalFiltrosAtendimentosAberto, definirModalFiltrosAtendimentosAberto] = useState(false);
  const [modalBuscaFornecedorAtendimentosAberto, definirModalBuscaFornecedorAtendimentosAberto] = useState(false);
  const [gerandoPdfAtendimentos, definirGerandoPdfAtendimentos] = useState(false);
  const [filtrosAtendimentosRelatorio, definirFiltrosAtendimentosRelatorio] = useState(() => obterFiltrosPadraoAtendimentos());
  const [rascunhoFiltrosAtendimentosRelatorio, definirRascunhoFiltrosAtendimentosRelatorio] = useState(() => obterFiltrosPadraoAtendimentos());

  useEffect(() => {
    if (!aberto || relatorio !== 'relatorioOrdensCompraFechados') {
      if (!aberto) {
        definirModalFiltrosAberto(false);
        definirModalBuscaFornecedorAberto(false);
        definirMensagemErroOrdensCompra('');
        definirGruposEmpresaRelatorio([]);
        definirGruposProdutoRelatorio([]);
        definirMarcasRelatorio([]);
        definirAvisosPopup([]);
      }
      return undefined;
    }

    let cancelado = false;

    async function carregarOrdensCompraFechados() {
      definirCarregandoOrdensCompra(true);
      definirMensagemErroOrdensCompra('');

      try {
        const resultados = await Promise.allSettled([
          listarOrdensCompra(),
          listarFornecedores(),
          listarCompradores(),
          listarEtapasOrdemCompraConfiguracao(),
          listarTiposOrdemCompraConfiguracao(),
          listarGruposEmpresa(),
          listarGruposProduto(),
          listarMarcas(),
          listarProdutos()
        ]);

        const [
          ordensCompraResultado,
          fornecedoresResultado,
          compradoresResultado,
          etapasResultado,
          tiposOrdemCompraResultado,
          gruposEmpresaResultado,
          gruposProdutoResultado,
          marcasResultado,
          produtosResultado
        ] = resultados;

        if (cancelado) {
          return;
        }

        const ordensCompraCarregados = ordensCompraResultado.status === 'fulfilled' ? ordensCompraResultado.value : [];
        const fornecedoresCarregados = fornecedoresResultado.status === 'fulfilled' ? fornecedoresResultado.value : [];
        const compradoresCarregados = compradoresResultado.status === 'fulfilled' ? compradoresResultado.value : [];
        const etapasCarregadas = etapasResultado.status === 'fulfilled' ? etapasResultado.value : [];
        const tiposOrdemCompraCarregados = tiposOrdemCompraResultado.status === 'fulfilled' ? tiposOrdemCompraResultado.value : [];
        const gruposEmpresaCarregados = gruposEmpresaResultado.status === 'fulfilled' ? gruposEmpresaResultado.value : [];
        const gruposProdutoCarregados = gruposProdutoResultado.status === 'fulfilled' ? gruposProdutoResultado.value : [];
        const marcasCarregadas = marcasResultado.status === 'fulfilled' ? marcasResultado.value : [];
        const produtosCarregados = produtosResultado.status === 'fulfilled' ? produtosResultado.value : [];

        const fornecedoresAtivos = filtrarRegistrosAtivosLocais(fornecedoresCarregados);
        const gruposEmpresaAtivos = filtrarRegistrosAtivosLocais(gruposEmpresaCarregados, 'status');
        const gruposProdutoAtivos = filtrarRegistrosAtivosLocais(gruposProdutoCarregados, 'status');
        const marcasAtivas = filtrarRegistrosAtivosLocais(marcasCarregadas, 'status');

        definirOrdensCompra(enriquecerOrdensCompraRelatorio(
          ordensCompraCarregados,
          fornecedoresAtivos,
          produtosCarregados,
          gruposEmpresaAtivos,
          gruposProdutoAtivos,
          marcasAtivas
        ));
        definirFornecedores(fornecedoresAtivos);
        definirCompradores(filtrarRegistrosAtivosLocais(compradoresCarregados));
        definirGruposEmpresaRelatorio(gruposEmpresaAtivos);
        definirGruposProdutoRelatorio(gruposProdutoAtivos);
        definirMarcasRelatorio(marcasAtivas);
        definirEtapasOrdemCompra(normalizarEtapasOrdemCompra(filtrarRegistrosAtivosLocais(etapasCarregadas, 'status')));
        definirTiposOrdemCompraRelatorio(filtrarRegistrosAtivosLocais(tiposOrdemCompraCarregados, 'status'));
      } catch (_erro) {
        if (!cancelado) {
          definirMensagemErroOrdensCompra('Nao foi possivel carregar as ordens de compra do relatorio.');
          definirOrdensCompra([]);
          definirFornecedores([]);
          definirCompradores([]);
          definirGruposEmpresaRelatorio([]);
          definirGruposProdutoRelatorio([]);
          definirMarcasRelatorio([]);
          definirEtapasOrdemCompra([]);
          definirTiposOrdemCompraRelatorio([]);
        }
      } finally {
        if (!cancelado) {
          definirCarregandoOrdensCompra(false);
        }
      }
    }

    carregarOrdensCompraFechados();

    return () => {
      cancelado = true;
    };
  }, [aberto, relatorio]);

  useEffect(() => {
    if (!aberto || relatorio !== 'relatorioOrdensCompraEntregues') {
      if (!aberto) {
        definirMensagemErroConversao('');
        definirCotacoesConversao([]);
        definirUsuariosConversao([]);
        definirEtapasCotacaoConversao([]);
        definirGruposEmpresaRelatorio([]);
        definirGruposProdutoRelatorio([]);
        definirMarcasRelatorio([]);
        definirModalFiltrosConversaoAberto(false);
        definirModalBuscaFornecedorConversaoAberto(false);
      }
      return undefined;
    }

    let cancelado = false;

    async function carregarRelatorioConversao() {
      definirCarregandoConversao(true);
      definirMensagemErroConversao('');

      try {
        const resultados = await Promise.allSettled([
          listarCotacoes(),
          listarFornecedores(),
          listarContatos(),
          listarUsuarios(),
          listarCompradores(),
          listarEtapasCotacaoConfiguracao(),
          listarGruposEmpresa(),
          listarGruposProduto(),
          listarMarcas(),
          listarProdutos()
        ]);

        if (cancelado) {
          return;
        }

        const [
          cotacoesResultado,
          fornecedoresResultado,
          contatosResultado,
          usuariosResultado,
          compradoresResultado,
          etapasResultado,
          gruposEmpresaResultado,
          gruposProdutoResultado,
          marcasResultado,
          produtosResultado
        ] = resultados;

        const cotacoesCarregados = cotacoesResultado.status === 'fulfilled' ? cotacoesResultado.value : [];
        const fornecedoresCarregados = fornecedoresResultado.status === 'fulfilled' ? fornecedoresResultado.value : [];
        const contatosCarregados = contatosResultado.status === 'fulfilled' ? contatosResultado.value : [];
        const usuariosCarregados = usuariosResultado.status === 'fulfilled' ? usuariosResultado.value : [];
        const compradoresCarregados = compradoresResultado.status === 'fulfilled' ? compradoresResultado.value : [];
        const etapasCarregadas = etapasResultado.status === 'fulfilled' ? etapasResultado.value : [];
        const gruposEmpresaCarregados = gruposEmpresaResultado.status === 'fulfilled' ? gruposEmpresaResultado.value : [];
        const gruposProdutoCarregados = gruposProdutoResultado.status === 'fulfilled' ? gruposProdutoResultado.value : [];
        const marcasCarregadas = marcasResultado.status === 'fulfilled' ? marcasResultado.value : [];
        const produtosCarregados = produtosResultado.status === 'fulfilled' ? produtosResultado.value : [];

        const fornecedoresAtivos = filtrarRegistrosAtivosLocais(fornecedoresCarregados);
        const contatosAtivos = filtrarRegistrosAtivosLocais(contatosCarregados);
        const usuariosAtivos = filtrarRegistrosAtivosLocais(usuariosCarregados, 'status');
        const compradoresAtivos = filtrarRegistrosAtivosLocais(compradoresCarregados);
        const gruposEmpresaAtivos = filtrarRegistrosAtivosLocais(gruposEmpresaCarregados, 'status');
        const gruposProdutoAtivos = filtrarRegistrosAtivosLocais(gruposProdutoCarregados, 'status');
        const marcasAtivas = filtrarRegistrosAtivosLocais(marcasCarregadas, 'status');
        const etapasAtivas = normalizarEtapasCotacaoConversao(filtrarRegistrosAtivosLocais(etapasCarregadas, 'status'));

        definirFornecedores(fornecedoresAtivos);
        definirCompradores(compradoresAtivos);
        definirGruposEmpresaRelatorio(gruposEmpresaAtivos);
        definirGruposProdutoRelatorio(gruposProdutoAtivos);
        definirMarcasRelatorio(marcasAtivas);
        definirUsuariosConversao(usuariosAtivos);
        definirEtapasCotacaoConversao(ordenarEtapasPorOrdem(etapasAtivas, 'idEtapaCotacao'));
        definirCotacoesConversao(
          enriquecerCotacoesConversao(
            cotacoesCarregados,
            fornecedoresAtivos,
            contatosAtivos,
            usuariosAtivos,
            compradoresAtivos,
            etapasAtivas,
            produtosCarregados,
            gruposEmpresaAtivos,
            gruposProdutoAtivos,
            marcasAtivas
          )
        );
      } catch (_erro) {
        if (!cancelado) {
          definirMensagemErroConversao('Nao foi possivel carregar os cotacoes do relatorio.');
          definirCotacoesConversao([]);
          definirGruposEmpresaRelatorio([]);
          definirGruposProdutoRelatorio([]);
          definirMarcasRelatorio([]);
        }
      } finally {
        if (!cancelado) {
          definirCarregandoConversao(false);
        }
      }
    }

    carregarRelatorioConversao();

    return () => {
      cancelado = true;
    };
  }, [aberto, relatorio]);

  useEffect(() => {
    if (!aberto || relatorio !== 'relatorioAtendimentos') {
      if (!aberto) {
        definirMensagemErroAtendimentosRelatorio('');
        definirAtendimentosRelatorio([]);
        definirUsuariosRelatorio([]);
        definirCanaisAtendimentoRelatorio([]);
        definirOrigensAtendimentoRelatorio([]);
        definirGruposEmpresaRelatorio([]);
        definirModalFiltrosAtendimentosAberto(false);
        definirModalBuscaFornecedorAtendimentosAberto(false);
      }
      return undefined;
    }

    let cancelado = false;

    async function carregarAtendimentosRelatorio() {
      definirCarregandoAtendimentosRelatorio(true);
      definirMensagemErroAtendimentosRelatorio('');

      try {
        const resultados = await Promise.allSettled([
          listarAtendimentos(),
          listarFornecedores(),
          listarContatos(),
          listarUsuarios(),
          listarTiposAtendimento(),
          listarCanaisAtendimento(),
          listarOrigensAtendimento(),
          listarGruposEmpresa()
        ]);

        if (cancelado) {
          return;
        }

        const [
          atendimentosResultado,
          fornecedoresResultado,
          contatosResultado,
          usuariosResultado,
          tiposAtendimentoResultado,
          canaisResultado,
          origensResultado,
          gruposEmpresaResultado
        ] = resultados;

        const atendimentosCarregados = atendimentosResultado.status === 'fulfilled' ? atendimentosResultado.value : [];
        const fornecedoresCarregados = fornecedoresResultado.status === 'fulfilled' ? fornecedoresResultado.value : [];
        const contatosCarregados = contatosResultado.status === 'fulfilled' ? contatosResultado.value : [];
        const usuariosCarregados = usuariosResultado.status === 'fulfilled' ? usuariosResultado.value : [];
        const tiposAtendimentoCarregados = tiposAtendimentoResultado.status === 'fulfilled' ? tiposAtendimentoResultado.value : [];
        const canaisCarregados = canaisResultado.status === 'fulfilled' ? canaisResultado.value : [];
        const origensCarregadas = origensResultado.status === 'fulfilled' ? origensResultado.value : [];
        const gruposEmpresaCarregados = gruposEmpresaResultado.status === 'fulfilled' ? gruposEmpresaResultado.value : [];

        const fornecedoresAtivos = filtrarRegistrosAtivosLocais(fornecedoresCarregados);
        const contatosAtivos = filtrarRegistrosAtivosLocais(contatosCarregados);
        const usuariosAtivos = filtrarRegistrosAtivosLocais(usuariosCarregados, 'status');
        const tiposAtendimentoAtivos = filtrarRegistrosAtivosLocais(tiposAtendimentoCarregados, 'status');
        const canaisAtivos = filtrarRegistrosAtivosLocais(canaisCarregados, 'status');
        const origensAtivas = filtrarRegistrosAtivosLocais(origensCarregadas, 'status');
        const gruposEmpresaAtivos = filtrarRegistrosAtivosLocais(gruposEmpresaCarregados, 'status');

        definirFornecedores(fornecedoresAtivos);
        definirGruposEmpresaRelatorio(gruposEmpresaAtivos);
        definirUsuariosRelatorio(usuariosAtivos);
        definirTiposAtendimentoRelatorio(tiposAtendimentoAtivos);
        definirCanaisAtendimentoRelatorio(canaisAtivos);
        definirOrigensAtendimentoRelatorio(origensAtivas);
        definirAtendimentosRelatorio(
          enriquecerAtendimentosRelatorio(
            atendimentosCarregados,
            fornecedoresAtivos,
            contatosAtivos,
            usuariosAtivos,
            tiposAtendimentoAtivos,
            canaisAtivos,
            origensAtivas,
            gruposEmpresaAtivos
          )
        );
      } catch (_erro) {
        if (!cancelado) {
          definirMensagemErroAtendimentosRelatorio('Nao foi possivel carregar os atendimentos do relatorio.');
          definirAtendimentosRelatorio([]);
          definirGruposEmpresaRelatorio([]);
        }
      } finally {
        if (!cancelado) {
          definirCarregandoAtendimentosRelatorio(false);
        }
      }
    }

    carregarAtendimentosRelatorio();

    return () => {
      cancelado = true;
    };
  }, [aberto, relatorio]);

  useEffect(() => {
    if (!aberto) {
      return undefined;
    }

    function tratarTecla(evento) {
      if (evento.key === 'Escape') {
        aoFechar();
      }
    }

    window.addEventListener('keydown', tratarTecla);

    return () => {
      window.removeEventListener('keydown', tratarTecla);
    };
  }, [aberto, aoFechar]);

  useEffect(() => {
    if (!aberto) {
      return;
    }

    definirFiltrosOrdensCompraFechados(filtrosPadraoOrdensCompraFechados);
    definirRascunhoFiltrosOrdensCompraFechados(filtrosPadraoOrdensCompraFechados);
  }, [aberto, filtrosPadraoOrdensCompraFechados, relatorio, usuarioLogado?.idUsuario]);

  useEffect(() => {
    if (!aberto) {
      return;
    }

    definirFiltrosConversao(filtrosPadraoConversao);
    definirRascunhoFiltrosConversao(filtrosPadraoConversao);
  }, [aberto, filtrosPadraoConversao, relatorio, usuarioLogado?.idUsuario]);

  useEffect(() => {
    if (!aberto) {
      return;
    }

    definirFiltrosAtendimentosRelatorio(filtrosPadraoAtendimentos);
    definirRascunhoFiltrosAtendimentosRelatorio(filtrosPadraoAtendimentos);
  }, [aberto, filtrosPadraoAtendimentos, relatorio, usuarioLogado?.idUsuario]);

  useEffect(() => {
    if (avisosPopup.length === 0) {
      return undefined;
    }

    const temporizadores = avisosPopup.map((aviso) => window.setTimeout(() => {
      definirAvisosPopup((estadoAtual) => estadoAtual.filter((item) => item.id !== aviso.id));
    }, 4200));

    return () => {
      temporizadores.forEach((temporizador) => window.clearTimeout(temporizador));
    };
  }, [avisosPopup]);

  const ordensCompraFechadosFiltrados = useMemo(
    () => filtrarOrdensCompraFechados(ordensCompra, filtrosOrdensCompraFechados),
    [ordensCompra, filtrosOrdensCompraFechados]
  );

  const cardsOrdensCompraFechados = useMemo(
    () => montarCardsOrdensCompraFechados(ordensCompraFechadosFiltrados),
    [ordensCompraFechadosFiltrados]
  );

  const filtrosOrdensCompraFechadosAtivos = useMemo(
    () => possuiFiltrosAtivos(filtrosOrdensCompraFechados),
    [filtrosOrdensCompraFechados]
  );

  const chipsOrdensCompraFechados = useMemo(
      () => montarChipsFiltrosOrdensCompraFechados(filtrosOrdensCompraFechados, {
        fornecedores,
        compradores,
        etapasOrdemCompra,
        gruposEmpresa: gruposEmpresaRelatorio,
        gruposProduto: gruposProdutoRelatorio,
        marcas: marcasRelatorio,
        tiposOrdemCompra: tiposOrdemCompraRelatorio
      }),
    [fornecedores, etapasOrdemCompra, filtrosOrdensCompraFechados, gruposEmpresaRelatorio, gruposProdutoRelatorio, marcasRelatorio, tiposOrdemCompraRelatorio, compradores]
  );

  const quantidadeTotalOrdensCompraFechados = useMemo(
    () => ordensCompraFechadosFiltrados.reduce((total, ordemCompra) => total + (Number(ordemCompra.quantidadeTotalOrdemCompra) || 0), 0),
    [ordensCompraFechadosFiltrados]
  );

  const cotacoesConversaoFiltrados = useMemo(
    () => filtrarCotacoesConversao(cotacoesConversao, filtrosConversao),
    [cotacoesConversao, filtrosConversao]
  );

  const cardsConversao = useMemo(
    () => montarCardsConversao(cotacoesConversaoFiltrados),
    [cotacoesConversaoFiltrados]
  );

  const filtrosConversaoAtivos = useMemo(
    () => possuiFiltrosConversaoAtivos(filtrosConversao),
    [filtrosConversao]
  );

  const chipsConversao = useMemo(
    () => montarChipsFiltrosConversao(filtrosConversao, {
      fornecedores,
      usuarios: usuariosConversao,
      compradores,
      etapasCotacao: etapasCotacaoConversao,
      gruposEmpresa: gruposEmpresaRelatorio,
      gruposProduto: gruposProdutoRelatorio,
      marcas: marcasRelatorio
    }),
    [fornecedores, etapasCotacaoConversao, filtrosConversao, gruposEmpresaRelatorio, gruposProdutoRelatorio, marcasRelatorio, usuariosConversao, compradores]
  );

  const atendimentosRelatorioFiltrados = useMemo(
    () => filtrarAtendimentosRelatorio(atendimentosRelatorio, filtrosAtendimentosRelatorio),
    [atendimentosRelatorio, filtrosAtendimentosRelatorio]
  );

  const cardsAtendimentosRelatorio = useMemo(
    () => montarCardsRelatorioAtendimentos(atendimentosRelatorioFiltrados),
    [atendimentosRelatorioFiltrados]
  );

  const filtrosAtendimentosRelatorioAtivos = useMemo(
    () => possuiFiltrosAtendimentosAtivos(filtrosAtendimentosRelatorio),
    [filtrosAtendimentosRelatorio]
  );

  const chipsAtendimentosRelatorio = useMemo(
    () => montarChipsFiltrosAtendimentosRelatorio(filtrosAtendimentosRelatorio, {
      fornecedores,
      usuarios: usuariosRelatorio,
      tiposAtendimento: tiposAtendimentoRelatorio,
      canaisAtendimento: canaisAtendimentoRelatorio,
      origensAtendimento: origensAtendimentoRelatorio,
      gruposEmpresa: gruposEmpresaRelatorio
    }),
    [canaisAtendimentoRelatorio, fornecedores, filtrosAtendimentosRelatorio, gruposEmpresaRelatorio, origensAtendimentoRelatorio, tiposAtendimentoRelatorio, usuariosRelatorio]
  );

  async function gerarPdfRelatorioOrdensCompraFechados() {
    if (gerandoPdf) {
      return;
    }

    if (ordensCompraFechadosFiltrados.length === 0) {
      adicionarAvisoPdf('erro', 'Nao foi possivel gerar o PDF.', 'Nao ha ordens de compra no recorte atual para exportar o relatorio.');
      return;
    }

    definirGerandoPdf(true);

    try {
      const resultado = await exportarRelatorioOrdensCompraFechadasPdf({
        ordensCompra: ordensCompraFechadosFiltrados,
        filtros: filtrosOrdensCompraFechados,
        chips: chipsOrdensCompraFechados,
        fornecedores,
        compradores,
        etapasOrdemCompra,
        cards: cardsOrdensCompraFechados,
        usuarioLogado,
        quantidadeTotal: quantidadeTotalOrdensCompraFechados
      });

      if (resultado.cancelado) {
        return;
      }

      if (!resultado.sucesso) {
        adicionarAvisoPdf('erro', 'Nao foi possivel gerar o PDF.', resultado.mensagem || 'Nao foi possivel exportar o PDF do relatorio.');
        return;
      }

      adicionarAvisoPdf('sucesso', 'PDF gerado com sucesso.', 'O relatorio foi enviado para exportacao.');
    } catch (erro) {
      adicionarAvisoPdf('erro', 'Nao foi possivel gerar o PDF.', erro.message || 'Nao foi possivel exportar o PDF do relatorio.');
    } finally {
      definirGerandoPdf(false);
    }
  }

  async function gerarPdfRelatorioAtendimentos() {
    if (gerandoPdfAtendimentos) {
      return;
    }

    if (atendimentosRelatorioFiltrados.length === 0) {
      adicionarAvisoPdf('erro', 'Nao foi possivel gerar o PDF.', 'Nao ha atendimentos no recorte atual para exportar o relatorio.');
      return;
    }

    definirGerandoPdfAtendimentos(true);

    try {
      const resultado = await exportarRelatorioAtendimentosPdf({
        atendimentos: atendimentosRelatorioFiltrados,
        chips: chipsAtendimentosRelatorio,
        cards: cardsAtendimentosRelatorio,
        usuarioLogado
      });

      if (resultado.cancelado) {
        return;
      }

      if (!resultado.sucesso) {
        adicionarAvisoPdf('erro', 'Nao foi possivel gerar o PDF.', resultado.mensagem || 'Nao foi possivel exportar o PDF do relatorio.');
        return;
      }

      adicionarAvisoPdf('sucesso', 'PDF gerado com sucesso.', 'O relatorio foi enviado para exportacao.');
    } catch (erro) {
      adicionarAvisoPdf('erro', 'Nao foi possivel gerar o PDF.', erro.message || 'Nao foi possivel exportar o PDF do relatorio.');
    } finally {
      definirGerandoPdfAtendimentos(false);
    }
  }

  async function gerarPdfRelatorioConversao() {
    if (gerandoPdfConversao) {
      return;
    }

    if (cotacoesConversaoFiltrados.length === 0) {
      adicionarAvisoPdf('erro', 'Nao foi possivel gerar o PDF.', 'Nao ha cotacoes no recorte atual para exportar o relatorio.');
      return;
    }

    definirGerandoPdfConversao(true);

    try {
      const resultado = await exportarRelatorioConversaoPdf({
        cotacoes: cotacoesConversaoFiltrados,
        chips: chipsConversao,
        cards: cardsConversao,
        usuarioLogado
      });

      if (resultado.cancelado) {
        return;
      }

      if (!resultado.sucesso) {
        adicionarAvisoPdf('erro', 'Nao foi possivel gerar o PDF.', resultado.mensagem || 'Nao foi possivel exportar o PDF do relatorio.');
        return;
      }

      adicionarAvisoPdf('sucesso', 'PDF gerado com sucesso.', 'O relatorio foi enviado para exportacao.');
    } catch (erro) {
      adicionarAvisoPdf('erro', 'Nao foi possivel gerar o PDF.', erro.message || 'Nao foi possivel exportar o PDF do relatorio.');
    } finally {
      definirGerandoPdfConversao(false);
    }
  }

  function adicionarAvisoPdf(tipo, titulo, mensagem) {
    const id = `pdf-relatorio-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

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

  if (!aberto) {
    return null;
  }

  if (relatorio === 'relatorioOrdensCompraFechados') {
    return (
      <>
        <ModalRelatorioGrade
          aberto={aberto}
          titulo={configuracao.titulo}
          subtitulo={configuracao.subtitulo}
          chips={chipsOrdensCompraFechados}
          filtrosAtivos={filtrosOrdensCompraFechadosAtivos}
          tituloFiltro={configuracao.tituloFiltro}
          ariaFiltro={configuracao.ariaFiltro}
          onAbrirFiltros={() => {
            definirRascunhoFiltrosOrdensCompraFechados(filtrosOrdensCompraFechados);
            definirModalFiltrosAberto(true);
          }}
          acaoPdf={{
            title: gerandoPdf
              ? 'Gerando PDF do relatorio'
              : exportacaoPdfDisponivel
                ? 'Gerar PDF do relatorio'
                : 'Abrir impressao para salvar como PDF',
            ariaLabel: gerandoPdf
              ? 'Gerando PDF do relatorio'
              : 'Gerar PDF do relatorio',
            disabled: gerandoPdf || carregandoOrdensCompra,
            onClick: gerarPdfRelatorioOrdensCompraFechados
          }}
          onFechar={aoFechar}
          cards={cardsOrdensCompraFechados}
        >
          <section className="modalRelatorioGradePainelTabela painelContatosModalFornecedor painelOrdensCompraFornecedor modalHistoricoOrdensCompraFornecedorPainel">
            <TabelaHistoricoOrdensCompra
              carregando={carregandoOrdensCompra}
              mensagemErro={mensagemErroOrdensCompra}
              ordensCompra={ordensCompraFechadosFiltrados}
              contextoSalvo
              mensagemSemContexto="O relatorio ficara disponivel apos carregar os ordensCompra."
              mensagemVazia="Nenhum ordem de compra encontrado para o periodo informado."
              exibirFornecedor
              exibirTipoOrdemCompra
              exibirAcoes={false}
            />
          </section>
        </ModalRelatorioGrade>

        <ModalFiltros
          aberto={modalFiltrosAberto}
          titulo="Filtros de ordens de compra"
          filtros={rascunhoFiltrosOrdensCompraFechados}
          campos={[
            {
              name: 'idFornecedor',
              label: 'Fornecedor',
              placeholder: 'Todos os fornecedores',
              options: fornecedores.map((fornecedor) => ({
                valor: String(fornecedor.idFornecedor),
                label: fornecedor.nomeFantasia || fornecedor.razaoSocial || `Fornecedor #${fornecedor.idFornecedor}`
              })),
              acaoExtra: (
                <Botao
                  variante="secundario"
                  type="button"
                  icone="pesquisa"
                  className="botaoCampoAcao"
                  somenteIcone
                  title="Buscar fornecedor"
                  aria-label="Buscar fornecedor"
                  onClick={() => definirModalBuscaFornecedorAberto(true)}
                >
                  Buscar fornecedor
                </Botao>
              )
            },
            {
              name: 'idsCompradores',
              label: 'Comprador',
              multiple: true,
              tituloSelecao: 'Selecionar compradores',
              placeholder: 'Todos os compradores',
              options: compradores.map((comprador) => ({
                valor: String(comprador.idComprador),
                label: comprador.nome || `Comprador #${comprador.idComprador}`
              }))
            },
            {
              name: 'idsGruposEmpresa',
              label: 'Grupo de empresa',
              multiple: true,
              tituloSelecao: 'Selecionar grupos de empresa',
              placeholder: 'Todos os grupos',
              options: gruposEmpresaRelatorio.map((grupo) => ({
                valor: String(grupo.idGrupoEmpresa),
                label: grupo.descricao || `Grupo #${grupo.idGrupoEmpresa}`
              }))
            },
            {
              name: 'idsGruposProduto',
              label: 'Grupo de produto',
              multiple: true,
              tituloSelecao: 'Selecionar grupos de produto',
              placeholder: 'Todos os grupos',
              options: gruposProdutoRelatorio.map((grupo) => ({
                valor: String(grupo.idGrupo),
                label: grupo.descricao || `Grupo #${grupo.idGrupo}`
              }))
            },
            {
              name: 'idsMarcas',
              label: 'Marca',
              multiple: true,
              tituloSelecao: 'Selecionar marcas',
              placeholder: 'Todas as marcas',
              options: marcasRelatorio.map((marca) => ({
                valor: String(marca.idMarca),
                label: marca.descricao || `Marca #${marca.idMarca}`
              }))
            },
              {
                name: 'idsEtapasOrdemCompra',
                label: 'Etapa',
                multiple: true,
                tituloSelecao: 'Selecionar etapas da ordem de compra',
                placeholder: 'Todas as etapas',
                options: etapasOrdemCompra.map((etapa) => ({
                  valor: String(etapa.idEtapaOrdemCompra),
                  label: etapa.descricao || `Etapa #${etapa.idEtapaOrdemCompra}`
                }))
              },
              {
                name: 'idsTiposOrdemCompra',
                label: 'Tipo de ordemCompra',
                multiple: true,
                tituloSelecao: 'Selecionar tipos de ordemCompra',
                placeholder: 'Todos os tipos',
                options: tiposOrdemCompraRelatorio.map((tipoOrdemCompra) => ({
                  valor: String(tipoOrdemCompra.idTipoOrdemCompra),
                  label: tipoOrdemCompra.descricao || `Tipo #${tipoOrdemCompra.idTipoOrdemCompra}`
                }))
              },
              {
                name: 'periodoInclusaoOrdensCompraFechados',
              label: 'Datas',
              type: 'date-filters-modal',
              tituloSelecao: 'Filtro por datas de ordens de compra',
              placeholder: 'Selecionar periodo',
              periodos: [
                {
                  titulo: 'Data de inclusao',
                  nomeInicio: 'dataInclusaoInicio',
                  nomeFim: 'dataInclusaoFim',
                  labelInicio: 'Inicio da inclusao',
                  labelFim: 'Fim da inclusao'
                },
                {
                  titulo: 'Data de entrega',
                  nomeInicio: 'dataEntregaInicio',
                  nomeFim: 'dataEntregaFim',
                  labelInicio: 'Inicio da entrega',
                  labelFim: 'Fim da entrega'
                }
              ]
            }
          ]}
          aoFechar={() => {
            definirModalFiltrosAberto(false);
            definirModalBuscaFornecedorAberto(false);
            definirRascunhoFiltrosOrdensCompraFechados(filtrosOrdensCompraFechados);
          }}
          aoAplicar={(proximosFiltros) => {
            const filtrosNormalizados = normalizarFiltrosOrdensCompraFechados(proximosFiltros);
            definirFiltrosOrdensCompraFechados(filtrosNormalizados);
            definirRascunhoFiltrosOrdensCompraFechados(filtrosNormalizados);
            definirModalFiltrosAberto(false);
            definirModalBuscaFornecedorAberto(false);
          }}
          aoLimpar={() => {
            definirFiltrosOrdensCompraFechados(filtrosPadraoOrdensCompraFechados);
            definirRascunhoFiltrosOrdensCompraFechados(filtrosPadraoOrdensCompraFechados);
          }}
        />

        <ModalBuscaFornecedores
          aberto={modalBuscaFornecedorAberto}
          fornecedores={fornecedores}
          aoSelecionar={(fornecedor) => {
            definirRascunhoFiltrosOrdensCompraFechados((estadoAtual) => ({
              ...estadoAtual,
              idFornecedor: String(fornecedor.idFornecedor || '')
            }));
            definirModalBuscaFornecedorAberto(false);
          }}
          aoFechar={() => definirModalBuscaFornecedorAberto(false)}
        />

        <PopupAvisos
          avisos={avisosPopup}
          aoFechar={(idAviso) => {
            definirAvisosPopup((estadoAtual) => estadoAtual.filter((aviso) => aviso.id !== idAviso));
          }}
        />
      </>
    );
  }

  if (relatorio === 'relatorioAtendimentos') {
    return (
      <>
        <ModalRelatorioGrade
          aberto={aberto}
          titulo={configuracao.titulo}
          subtitulo={configuracao.subtitulo}
          chips={chipsAtendimentosRelatorio}
          filtrosAtivos={filtrosAtendimentosRelatorioAtivos}
          tituloFiltro={configuracao.tituloFiltro}
          ariaFiltro={configuracao.ariaFiltro}
          onAbrirFiltros={() => {
            definirRascunhoFiltrosAtendimentosRelatorio(filtrosAtendimentosRelatorio);
            definirModalFiltrosAtendimentosAberto(true);
          }}
          acaoPdf={{
            title: gerandoPdfAtendimentos
              ? 'Gerando PDF do relatorio'
              : exportacaoPdfDisponivel
                ? 'Gerar PDF do relatorio'
                : 'Abrir impressao para salvar como PDF',
            ariaLabel: gerandoPdfAtendimentos
              ? 'Gerando PDF do relatorio'
              : 'Gerar PDF do relatorio',
            disabled: gerandoPdfAtendimentos || carregandoAtendimentosRelatorio,
            onClick: gerarPdfRelatorioAtendimentos
          }}
          onFechar={aoFechar}
          cards={cardsAtendimentosRelatorio}
        >
          <section className="modalRelatorioGradePainelTabela painelContatosModalFornecedor modalHistoricoAtendimentosFornecedorPainel">
            <TabelaHistoricoAtendimentos
              carregando={carregandoAtendimentosRelatorio}
              mensagemErro={mensagemErroAtendimentosRelatorio}
              atendimentos={atendimentosRelatorioFiltrados}
              contextoSalvo
              mensagemSemContexto="O relatorio ficara disponivel apos carregar os atendimentos."
              mensagemVazia="Nenhum atendimento encontrado para o relatorio."
              exibirFornecedor
              exibirAcoes={false}
            />
          </section>
        </ModalRelatorioGrade>

        <ModalFiltros
          aberto={modalFiltrosAtendimentosAberto}
          titulo="Filtros de atendimentos"
          filtros={rascunhoFiltrosAtendimentosRelatorio}
          campos={[
            {
              name: 'idFornecedor',
              label: 'Fornecedor',
              placeholder: 'Todos os fornecedores',
              options: fornecedores.map((fornecedor) => ({
                valor: String(fornecedor.idFornecedor),
                label: fornecedor.nomeFantasia || fornecedor.razaoSocial || `Fornecedor #${fornecedor.idFornecedor}`
              })),
              acaoExtra: (
                <Botao
                  variante="secundario"
                  type="button"
                  icone="pesquisa"
                  className="botaoCampoAcao"
                  somenteIcone
                  title="Buscar fornecedor"
                  aria-label="Buscar fornecedor"
                  onClick={() => definirModalBuscaFornecedorAtendimentosAberto(true)}
                >
                  Buscar fornecedor
                </Botao>
              )
            },
            {
              name: 'idsUsuarios',
              label: 'Usuario do registro',
              multiple: true,
              tituloSelecao: 'Selecionar usuarios',
              placeholder: 'Todos os usuarios',
              options: usuariosRelatorio.map((usuario) => ({
                valor: String(usuario.idUsuario),
                label: usuario.nome || `Usuario #${usuario.idUsuario}`
              }))
            },
            {
              name: 'idsGruposEmpresa',
              label: 'Grupo de empresa',
              multiple: true,
              tituloSelecao: 'Selecionar grupos de empresa',
              placeholder: 'Todos os grupos',
              options: gruposEmpresaRelatorio.map((grupo) => ({
                valor: String(grupo.idGrupoEmpresa),
                label: grupo.descricao || `Grupo #${grupo.idGrupoEmpresa}`
              }))
            },
            {
              name: 'idsTiposAtendimento',
              label: 'Tipo de atendimento',
              multiple: true,
              tituloSelecao: 'Selecionar tipos de atendimento',
              placeholder: 'Todos os tipos',
              options: tiposAtendimentoRelatorio.map((tipoAtendimento) => ({
                valor: String(tipoAtendimento.idTipoAtendimento),
                label: tipoAtendimento.descricao || `Tipo #${tipoAtendimento.idTipoAtendimento}`
              }))
            },
            {
              name: 'idsCanaisAtendimento',
              label: 'Canal',
              multiple: true,
              tituloSelecao: 'Selecionar canais',
              placeholder: 'Todos os canais',
              options: canaisAtendimentoRelatorio.map((canal) => ({
                valor: String(canal.idCanalAtendimento),
                label: canal.descricao || `Canal #${canal.idCanalAtendimento}`
              }))
            },
            {
              name: 'idsOrigensAtendimento',
              label: 'Origem',
              multiple: true,
              tituloSelecao: 'Selecionar origens',
              placeholder: 'Todas as origens',
              options: origensAtendimentoRelatorio.map((origem) => ({
                valor: String(origem.idOrigemAtendimento),
                label: origem.descricao || `Origem #${origem.idOrigemAtendimento}`
              }))
            },
            {
              name: 'periodoAtendimentosRelatorio',
              label: 'Data',
              type: 'date-filters-modal',
              tituloSelecao: 'Filtro por data de atendimento',
              placeholder: 'Selecionar periodo',
              periodos: [
                {
                  titulo: 'Data do atendimento',
                  nomeInicio: 'dataInicio',
                  nomeFim: 'dataFim',
                  labelInicio: 'Inicio do periodo',
                  labelFim: 'Fim do periodo'
                }
              ]
            }
          ]}
          aoFechar={() => {
            definirModalFiltrosAtendimentosAberto(false);
            definirModalBuscaFornecedorAtendimentosAberto(false);
            definirRascunhoFiltrosAtendimentosRelatorio(filtrosAtendimentosRelatorio);
          }}
          aoAplicar={(proximosFiltros) => {
            const filtrosNormalizados = normalizarFiltrosAtendimentosRelatorio(proximosFiltros);
            definirFiltrosAtendimentosRelatorio(filtrosNormalizados);
            definirRascunhoFiltrosAtendimentosRelatorio(filtrosNormalizados);
            definirModalFiltrosAtendimentosAberto(false);
            definirModalBuscaFornecedorAtendimentosAberto(false);
          }}
          aoLimpar={() => {
            definirFiltrosAtendimentosRelatorio(filtrosPadraoAtendimentos);
            definirRascunhoFiltrosAtendimentosRelatorio(filtrosPadraoAtendimentos);
          }}
        />

        <ModalBuscaFornecedores
          aberto={modalBuscaFornecedorAtendimentosAberto}
          fornecedores={fornecedores}
          aoSelecionar={(fornecedor) => {
            definirRascunhoFiltrosAtendimentosRelatorio((estadoAtual) => ({
              ...estadoAtual,
              idFornecedor: String(fornecedor.idFornecedor || '')
            }));
            definirModalBuscaFornecedorAtendimentosAberto(false);
          }}
          aoFechar={() => definirModalBuscaFornecedorAtendimentosAberto(false)}
        />

        <PopupAvisos
          avisos={avisosPopup}
          aoFechar={(idAviso) => {
            definirAvisosPopup((estadoAtual) => estadoAtual.filter((aviso) => aviso.id !== idAviso));
          }}
        />
      </>
    );
  }

  if (relatorio === 'relatorioOrdensCompraEntregues') {
    return (
      <>
        <ModalRelatorioGrade
          aberto={aberto}
          titulo={configuracao.titulo}
          subtitulo={configuracao.subtitulo}
          chips={chipsConversao}
          filtrosAtivos={filtrosConversaoAtivos}
          tituloFiltro={configuracao.tituloFiltro}
          ariaFiltro={configuracao.ariaFiltro}
          onAbrirFiltros={() => {
            definirRascunhoFiltrosConversao(filtrosConversao);
            definirModalFiltrosConversaoAberto(true);
          }}
          acaoPdf={{
            title: gerandoPdfConversao
              ? 'Gerando PDF do relatorio'
              : exportacaoPdfDisponivel
                ? 'Gerar PDF do relatorio'
                : 'Abrir impressao para salvar como PDF',
            ariaLabel: gerandoPdfConversao
              ? 'Gerando PDF do relatorio'
              : 'Gerar PDF do relatorio',
            disabled: gerandoPdfConversao || carregandoConversao,
            onClick: gerarPdfRelatorioConversao
          }}
          onFechar={aoFechar}
          cards={cardsConversao}
        >
          <section className="modalRelatorioGradePainelTabela painelContatosModalFornecedor">
            <TabelaHistoricoCotacoes
              carregando={carregandoConversao}
              mensagemErro={mensagemErroConversao}
              cotacoes={cotacoesConversaoFiltrados}
              contextoSalvo
              mensagemSemContexto="O relatorio ficara disponivel apos carregar os cotacoes."
              mensagemVazia="Nenhum cotacao encontrado para o periodo informado."
            />
          </section>
        </ModalRelatorioGrade>

        <ModalFiltros
          aberto={modalFiltrosConversaoAberto}
          titulo="Filtros de conversao"
          filtros={rascunhoFiltrosConversao}
          campos={[
            {
              name: 'idFornecedor',
              label: 'Fornecedor',
              placeholder: 'Todos os fornecedores',
              options: fornecedores.map((fornecedor) => ({
                valor: String(fornecedor.idFornecedor),
                label: fornecedor.nomeFantasia || fornecedor.razaoSocial || `Fornecedor #${fornecedor.idFornecedor}`
              })),
              acaoExtra: (
                <Botao
                  variante="secundario"
                  type="button"
                  icone="pesquisa"
                  className="botaoCampoAcao"
                  somenteIcone
                  title="Buscar fornecedor"
                  aria-label="Buscar fornecedor"
                  onClick={() => definirModalBuscaFornecedorConversaoAberto(true)}
                >
                  Buscar fornecedor
                </Botao>
              )
            },
            {
              name: 'idUsuario',
              label: 'Usuario do registro',
              multiple: true,
              placeholder: 'Todos os usuarios',
              options: usuariosConversao.map((usuario) => ({
                valor: String(usuario.idUsuario),
                label: usuario.nome || `Usuario #${usuario.idUsuario}`
              }))
            },
            {
              name: 'idCompradorFornecedor',
              label: 'Fornecedores do comprador',
              multiple: true,
              placeholder: 'Todos os compradores',
              options: compradores.map((comprador) => ({
                valor: String(comprador.idComprador),
                label: comprador.nome || `Comprador #${comprador.idComprador}`
              }))
            },
            {
              name: 'idComprador',
              label: 'Comprador da cotacao',
              multiple: true,
              placeholder: 'Todos os compradores',
              options: compradores.map((comprador) => ({
                valor: String(comprador.idComprador),
                label: comprador.nome || `Comprador #${comprador.idComprador}`
              }))
            },
            {
              name: 'idsGruposEmpresa',
              label: 'Grupo de empresa',
              multiple: true,
              tituloSelecao: 'Selecionar grupos de empresa',
              placeholder: 'Todos os grupos',
              options: gruposEmpresaRelatorio.map((grupo) => ({
                valor: String(grupo.idGrupoEmpresa),
                label: grupo.descricao || `Grupo #${grupo.idGrupoEmpresa}`
              }))
            },
            {
              name: 'idsGruposProduto',
              label: 'Grupo de produto',
              multiple: true,
              tituloSelecao: 'Selecionar grupos de produto',
              placeholder: 'Todos os grupos',
              options: gruposProdutoRelatorio.map((grupo) => ({
                valor: String(grupo.idGrupo),
                label: grupo.descricao || `Grupo #${grupo.idGrupo}`
              }))
            },
            {
              name: 'idsMarcas',
              label: 'Marca',
              multiple: true,
              tituloSelecao: 'Selecionar marcas',
              placeholder: 'Todas as marcas',
              options: marcasRelatorio.map((marca) => ({
                valor: String(marca.idMarca),
                label: marca.descricao || `Marca #${marca.idMarca}`
              }))
            },
            {
              name: 'idsEtapaCotacao',
              label: 'Etapa',
              multiple: true,
              tituloSelecao: 'Selecionar etapas da cotacao',
              placeholder: 'Todas as etapas',
              options: etapasCotacaoConversao.map((etapa) => ({
                valor: String(etapa.idEtapaCotacao),
                label: etapa.descricao || `Etapa #${etapa.idEtapaCotacao}`
              }))
            },
            {
              name: 'periodosDatasConversao',
              label: 'Datas',
              type: 'date-filters-modal',
              tituloSelecao: 'Filtros de datas da conversao',
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
          aoFechar={() => {
            definirModalFiltrosConversaoAberto(false);
            definirModalBuscaFornecedorConversaoAberto(false);
            definirRascunhoFiltrosConversao(filtrosConversao);
          }}
          aoAplicar={(proximosFiltros) => {
            const filtrosNormalizados = normalizarFiltrosConversao(proximosFiltros);
            definirFiltrosConversao(filtrosNormalizados);
            definirRascunhoFiltrosConversao(filtrosNormalizados);
            definirModalFiltrosConversaoAberto(false);
            definirModalBuscaFornecedorConversaoAberto(false);
          }}
          aoLimpar={() => {
            definirFiltrosConversao(filtrosPadraoConversao);
            definirRascunhoFiltrosConversao(filtrosPadraoConversao);
          }}
        />

        <ModalBuscaFornecedores
          aberto={modalBuscaFornecedorConversaoAberto}
          fornecedores={fornecedores}
          aoSelecionar={(fornecedor) => {
            definirRascunhoFiltrosConversao((estadoAtual) => ({
              ...estadoAtual,
              idFornecedor: String(fornecedor.idFornecedor || '')
            }));
            definirModalBuscaFornecedorConversaoAberto(false);
          }}
          aoFechar={() => definirModalBuscaFornecedorConversaoAberto(false)}
        />

        <PopupAvisos
          avisos={avisosPopup}
          aoFechar={(idAviso) => {
            definirAvisosPopup((estadoAtual) => estadoAtual.filter((aviso) => aviso.id !== idAviso));
          }}
        />
      </>
    );
  }

  return (
    <ModalRelatorioGrade
      aberto={aberto}
      titulo={configuracao.titulo}
      subtitulo={configuracao.subtitulo}
      onFechar={aoFechar}
      cards={montarCardsPlaceholder(configuracao.titulo)}
    >
      <section className="modalRelatorioGradePainelVazio">
        <h3>Estrutura padronizada criada</h3>
        <p>
          Este relatorio ja usa o mesmo padrao visual da area de relatorios: modal amplo, cards de resumo no topo e espaco preparado para grade e filtros.
        </p>
      </section>
    </ModalRelatorioGrade>
  );
}

function enriquecerOrdensCompraRelatorio(ordensCompra, fornecedores = [], produtos = [], gruposEmpresa = [], gruposProduto = [], marcas = []) {
  const fornecedoresPorId = new Map(
    (fornecedores || []).map((fornecedor) => [
      fornecedor.idFornecedor,
      {
        idGrupoEmpresa: fornecedor.idGrupoEmpresa,
        nomeGrupoEmpresa: obterNomeGrupoEmpresaPorId(gruposEmpresa, fornecedor.idGrupoEmpresa)
      }
    ])
  );
  const produtosPorId = new Map(
    (produtos || []).map((produto) => [
      produto.idProduto,
      {
        idGrupo: produto.idGrupo,
        nomeGrupoProduto: obterNomeGrupoProdutoPorId(gruposProduto, produto.idGrupo),
        idMarca: produto.idMarca,
        nomeMarca: obterNomeMarcaPorId(marcas, produto.idMarca)
      }
    ])
  );

  return [...(ordensCompra || [])]
    .map((ordemCompra) => ({
      ...ordemCompra,
      idGrupoEmpresa: fornecedoresPorId.get(ordemCompra.idFornecedor)?.idGrupoEmpresa || null,
      nomeGrupoEmpresa: fornecedoresPorId.get(ordemCompra.idFornecedor)?.nomeGrupoEmpresa || 'Sem grupo',
      idsGruposProduto: Array.from(new Set(
        (Array.isArray(ordemCompra.itens) ? ordemCompra.itens : [])
          .map((item) => produtosPorId.get(item.idProduto)?.idGrupo)
          .filter((valor) => valor !== null && valor !== undefined && valor !== '')
          .map(String)
      )),
      idsMarcas: Array.from(new Set(
        (Array.isArray(ordemCompra.itens) ? ordemCompra.itens : [])
          .map((item) => produtosPorId.get(item.idProduto)?.idMarca)
          .filter((valor) => valor !== null && valor !== undefined && valor !== '')
          .map(String)
      )),
      totalOrdemCompra: Array.isArray(ordemCompra.itens)
        ? ordemCompra.itens.reduce((total, item) => total + (Number(item.valorTotal) || 0), 0)
        : 0,
      quantidadeTotalOrdemCompra: Array.isArray(ordemCompra.itens)
        ? ordemCompra.itens.reduce((total, item) => total + (Number(item.quantidade) || 0), 0)
        : 0
    }))
    .sort((ordemCompraA, ordemCompraB) => {
      const dataA = normalizarDataFiltro(ordemCompraA.dataInclusao);
      const dataB = normalizarDataFiltro(ordemCompraB.dataInclusao);

      if (dataA !== dataB) {
        return dataB.localeCompare(dataA);
      }

      return Number(ordemCompraB.idOrdemCompra || 0) - Number(ordemCompraA.idOrdemCompra || 0);
    });
}

function filtrarOrdensCompraFechados(ordensCompra, filtros) {
  return (ordensCompra || []).filter((ordemCompra) => {
    if (!validarPeriodoData(ordemCompra.dataInclusao, filtros.dataInclusaoInicio, filtros.dataInclusaoFim)) {
      return false;
    }

    if (!validarPeriodoData(ordemCompra.dataEntrega, filtros.dataEntregaInicio, filtros.dataEntregaFim)) {
      return false;
    }

    if (filtros.idFornecedor && String(ordemCompra.idFornecedor || '') !== String(filtros.idFornecedor)) {
      return false;
    }

    if (
      Array.isArray(filtros.idsCompradores)
      && filtros.idsCompradores.length > 0
      && !filtros.idsCompradores.map(String).includes(String(ordemCompra.idComprador || ''))
    ) {
      return false;
    }

    if (
      Array.isArray(filtros.idsGruposEmpresa)
      && filtros.idsGruposEmpresa.length > 0
      && !filtros.idsGruposEmpresa.map(String).includes(String(ordemCompra.idGrupoEmpresa || ''))
    ) {
      return false;
    }

    if (
      Array.isArray(filtros.idsGruposProduto)
      && filtros.idsGruposProduto.length > 0
      && !filtros.idsGruposProduto.some((idGrupo) => (ordemCompra.idsGruposProduto || []).includes(String(idGrupo)))
    ) {
      return false;
    }

    if (
      Array.isArray(filtros.idsMarcas)
      && filtros.idsMarcas.length > 0
      && !filtros.idsMarcas.some((idMarca) => (ordemCompra.idsMarcas || []).includes(String(idMarca)))
    ) {
      return false;
    }

    if (
      Array.isArray(filtros.idsEtapasOrdemCompra)
      && filtros.idsEtapasOrdemCompra.length > 0
      && !filtros.idsEtapasOrdemCompra.map(String).includes(String(ordemCompra.idEtapaOrdemCompra || ''))
    ) {
      return false;
    }

    if (
      Array.isArray(filtros.idsTiposOrdemCompra)
      && filtros.idsTiposOrdemCompra.length > 0
      && !filtros.idsTiposOrdemCompra.map(String).includes(String(ordemCompra.idTipoOrdemCompra || ''))
    ) {
      return false;
    }

    return true;
  });
}

function montarCardsOrdensCompraFechados(ordensCompra) {
  const totalOrdensCompra = ordensCompra.length;
  const valorTotal = ordensCompra.reduce((total, ordemCompra) => total + (Number(ordemCompra.totalOrdemCompra) || 0), 0);
  const quantidadeTotal = ordensCompra.reduce((total, ordemCompra) => total + (Number(ordemCompra.quantidadeTotalOrdemCompra) || 0), 0);
  const positivacao = new Set(
    ordensCompra
      .map((ordemCompra) => String(ordemCompra.idFornecedor || '').trim())
      .filter(Boolean)
  ).size;

  return [
    {
      titulo: 'Ordens de Compra no recorte',
      valor: String(totalOrdensCompra)
    },
    {
      titulo: 'Valor total',
      valor: normalizarPreco(valorTotal)
    },
    {
      titulo: 'Quantidade',
      valor: formatarQuantidadeResumo(quantidadeTotal)
    },
    {
      titulo: 'Positivacao',
      valor: String(positivacao)
    }
  ];
}

function montarCardsPlaceholder(titulo) {
  return [
    {
      titulo: 'Status da estrutura',
      valor: 'Inicial',
      descricao: `Base compartilhada de ${titulo.toLowerCase()} criada no padrao da area.`
    },
    {
      titulo: 'Cards de topo',
      valor: 'Prontos',
      descricao: 'O modal ja aceita indicadores executivos no mesmo layout dos demais relatorios.'
    },
    {
      titulo: 'Grade principal',
      valor: 'Reservada',
      descricao: 'O corpo do modal ja esta preparado para receber a grade operacional do relatorio.'
    },
    {
      titulo: 'Filtro de cabecalho',
      valor: 'Expansivel',
      descricao: 'A mesma base pode receber filtros no cabecalho sempre que o fluxo for evoluido.'
    }
  ];
}

function normalizarFiltrosOrdensCompraFechados(filtros = {}) {
  const idFornecedor = normalizarIdentificadorFiltro(filtros.idFornecedor);
  const idsCompradores = normalizarListaIdentificadoresFiltro(filtros.idsCompradores);
  const idsGruposEmpresa = normalizarListaIdentificadoresFiltro(filtros.idsGruposEmpresa);
  const idsGruposProduto = normalizarListaIdentificadoresFiltro(filtros.idsGruposProduto);
  const idsMarcas = normalizarListaIdentificadoresFiltro(filtros.idsMarcas);
  const idsEtapasOrdemCompra = normalizarListaIdentificadoresFiltro(filtros.idsEtapasOrdemCompra);
  const idsTiposOrdemCompra = normalizarListaIdentificadoresFiltro(filtros.idsTiposOrdemCompra);
  const dataInclusaoInicio = normalizarDataFiltro(filtros.dataInclusaoInicio);
  const dataInclusaoFim = normalizarDataFiltro(filtros.dataInclusaoFim);
  const dataEntregaInicio = normalizarDataFiltro(filtros.dataEntregaInicio);
  const dataEntregaFim = normalizarDataFiltro(filtros.dataEntregaFim);
  const periodoInclusao = ordenarPeriodo(dataInclusaoInicio, dataInclusaoFim);
  const periodoEntrega = ordenarPeriodo(dataEntregaInicio, dataEntregaFim);

  return {
    idFornecedor,
    idsCompradores,
    idsGruposEmpresa,
    idsGruposProduto,
    idsMarcas,
    idsEtapasOrdemCompra,
    idsTiposOrdemCompra,
    dataInclusaoInicio: periodoInclusao.dataInicio,
    dataInclusaoFim: periodoInclusao.dataFim,
    dataEntregaInicio: periodoEntrega.dataInicio,
    dataEntregaFim: periodoEntrega.dataFim
  };
}

function normalizarIdentificadorFiltro(valor) {
  return String(valor || '').trim();
}

function normalizarListaIdentificadoresFiltro(valores) {
  return Array.from(new Set(
    (Array.isArray(valores) ? valores : [])
      .map((valor) => String(valor || '').trim())
      .filter(Boolean)
  ));
}

function possuiFiltrosAtivos(filtros = {}) {
  return Boolean(
    filtros.idFornecedor
    || (Array.isArray(filtros.idsCompradores) && filtros.idsCompradores.length > 0)
    || (Array.isArray(filtros.idsGruposEmpresa) && filtros.idsGruposEmpresa.length > 0)
    || (Array.isArray(filtros.idsGruposProduto) && filtros.idsGruposProduto.length > 0)
    || (Array.isArray(filtros.idsMarcas) && filtros.idsMarcas.length > 0)
    || (Array.isArray(filtros.idsEtapasOrdemCompra) && filtros.idsEtapasOrdemCompra.length > 0)
    || (Array.isArray(filtros.idsTiposOrdemCompra) && filtros.idsTiposOrdemCompra.length > 0)
    || filtros.dataInclusaoInicio
    || filtros.dataInclusaoFim
    || filtros.dataEntregaInicio
    || filtros.dataEntregaFim
  );
}

function montarChipsFiltrosOrdensCompraFechados(filtros, {
  fornecedores,
  compradores,
  etapasOrdemCompra,
  gruposEmpresa,
  gruposProduto,
  marcas,
  tiposOrdemCompra
}) {
  const chips = [];

  if (filtros.idFornecedor) {
    const fornecedor = fornecedores.find((item) => String(item.idFornecedor) === String(filtros.idFornecedor));
    chips.push({
      id: 'fornecedor',
      rotulo: `Fornecedor: ${fornecedor?.nomeFantasia || fornecedor?.razaoSocial || `#${filtros.idFornecedor}`}`
    });
  }

  if (Array.isArray(filtros.idsCompradores) && filtros.idsCompradores.length > 0) {
    filtros.idsCompradores.forEach((idComprador) => {
      const comprador = compradores.find((item) => String(item.idComprador) === String(idComprador));
      chips.push({
        id: `comprador-${idComprador}`,
        rotulo: `Comprador: ${comprador?.nome || `#${idComprador}`}`
      });
    });
  }

  if (Array.isArray(filtros.idsEtapasOrdemCompra) && filtros.idsEtapasOrdemCompra.length > 0) {
    filtros.idsEtapasOrdemCompra.forEach((idEtapaOrdemCompra) => {
      const etapa = etapasOrdemCompra.find((item) => String(item.idEtapaOrdemCompra) === String(idEtapaOrdemCompra));
      chips.push({
        id: `etapa-${idEtapaOrdemCompra}`,
        rotulo: `Etapa: ${etapa?.descricao || `#${idEtapaOrdemCompra}`}`
      });
    });
  }

  if (filtros.dataInclusaoInicio || filtros.dataInclusaoFim) {
    chips.push({
      id: 'periodo-inclusao',
      rotulo: `Inclusao: ${montarResumoPeriodoIndividual(filtros.dataInclusaoInicio, filtros.dataInclusaoFim)}`
    });
  }

  if (filtros.dataEntregaInicio || filtros.dataEntregaFim) {
    chips.push({
      id: 'periodo-entrega',
      rotulo: `Entrega: ${montarResumoPeriodoIndividual(filtros.dataEntregaInicio, filtros.dataEntregaFim)}`
    });
  }

  return chips;
}

function formatarQuantidadeResumo(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
}

function filtrarRegistrosAtivosLocais(registros, campoAtivo = 'ativo') {
  return (Array.isArray(registros) ? registros : []).filter((registro) => {
    if (Object.prototype.hasOwnProperty.call(registro || {}, campoAtivo)) {
      return Boolean(registro[campoAtivo]);
    }

    if (Object.prototype.hasOwnProperty.call(registro || {}, 'ativo')) {
      return Boolean(registro.ativo);
    }

    if (Object.prototype.hasOwnProperty.call(registro || {}, 'status')) {
      return Boolean(registro.status);
    }

    return true;
  });
}

function normalizarEtapasOrdemCompra(registros) {
  return (Array.isArray(registros) ? registros : []).map((registro) => ({
    ...registro,
    idEtapaOrdemCompra: registro?.idEtapaOrdemCompra ?? registro?.idEtapa ?? null
  }));
}

function obterFiltrosPadraoOrdensCompraFechados() {
  const hoje = new Date();
  const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

  return {
    idFornecedor: '',
    idsCompradores: [],
    idsGruposEmpresa: [],
    idsGruposProduto: [],
    idsMarcas: [],
    idsEtapasOrdemCompra: [],
    idsTiposOrdemCompra: [],
    dataInclusaoInicio: formatarDataInput(inicioMes),
    dataInclusaoFim: formatarDataInput(fimMes),
    dataEntregaInicio: '',
    dataEntregaFim: ''
  };
}

function ordenarPeriodo(dataInicio, dataFim) {
  if (dataInicio && dataFim && dataInicio > dataFim) {
    return {
      dataInicio: dataFim,
      dataFim: dataInicio
    };
  }

  return {
    dataInicio,
    dataFim
  };
}

function formatarDataInput(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');

  return `${ano}-${mes}-${dia}`;
}

function montarResumoPeriodoIndividual(dataInicio, dataFim) {
  if (dataInicio && dataFim) {
    return `${formatarDataResumo(dataInicio)} ate ${formatarDataResumo(dataFim)}`;
  }

  if (dataInicio) {
    return `A partir de ${formatarDataResumo(dataInicio)}`;
  }

  return `Ate ${formatarDataResumo(dataFim)}`;
}

function formatarDataResumo(valor) {
  if (!valor) {
    return '';
  }

  return new Intl.DateTimeFormat('pt-BR').format(new Date(`${valor}T00:00:00`));
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

  const dataNormalizada = texto.slice(0, 10);
  return /^\d{4}-\d{2}-\d{2}$/.test(dataNormalizada) ? dataNormalizada : '';
}

function montarCardsRelatorioAtendimentos(atendimentos) {
  const totalAtendimentos = Array.isArray(atendimentos) ? atendimentos.length : 0;
  const totalFornecedores = new Set(
    (Array.isArray(atendimentos) ? atendimentos : [])
      .map((atendimento) => String(atendimento.idFornecedor || '').trim())
      .filter(Boolean)
  ).size;
  const resumoCanal = obterResumoPercentualCategoria(atendimentos, 'nomeCanalAtendimento');
  const resumoOrigem = obterResumoPercentualCategoria(atendimentos, 'nomeOrigemAtendimento');

  return [
    {
      titulo: 'Total de atendimentos',
      valor: String(totalAtendimentos)
    },
    {
      titulo: 'Fornecedores atendidos',
      valor: String(totalFornecedores)
    },
    {
      titulo: 'Canal lider',
      valor: resumoCanal.valorExibicao
    },
    {
      titulo: 'Origem lider',
      valor: resumoOrigem.valorExibicao
    }
  ];
}

function obterResumoPercentualCategoria(registros, campo) {
  const lista = Array.isArray(registros) ? registros : [];

  if (lista.length === 0) {
    return {
      valorExibicao: '0%'
    };
  }

  const contagens = new Map();

  lista.forEach((registro) => {
    const chave = String(registro?.[campo] || 'Nao informado').trim() || 'Nao informado';
    contagens.set(chave, (contagens.get(chave) || 0) + 1);
  });

  const [nomeCategoria, quantidade] = [...contagens.entries()]
    .sort((itemA, itemB) => {
      if (itemB[1] !== itemA[1]) {
        return itemB[1] - itemA[1];
      }

      return itemA[0].localeCompare(itemB[0]);
    })[0];

  const percentual = (quantidade / lista.length) * 100;

  return {
    valorExibicao: `${formatarPercentualResumo(percentual)} ${nomeCategoria}`
  };
}

function formatarPercentualResumo(valor) {
  return `${Number(valor || 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1
  })}%`;
}

function enriquecerAtendimentosRelatorio(
  atendimentos,
  fornecedores,
  contatos,
  usuarios,
  tiposAtendimento,
  canaisAtendimento,
  origensAtendimento,
  gruposEmpresa = []
) {
  const fornecedoresPorId = new Map(
    (fornecedores || []).map((fornecedor) => [
      fornecedor.idFornecedor,
      {
        nome: fornecedor.nomeFantasia || fornecedor.razaoSocial || `Fornecedor #${fornecedor.idFornecedor}`,
        idGrupoEmpresa: fornecedor.idGrupoEmpresa,
        nomeGrupoEmpresa: obterNomeGrupoEmpresaPorId(gruposEmpresa, fornecedor.idGrupoEmpresa)
      }
    ])
  );
  const contatosPorId = new Map(
    (contatos || []).map((contato) => [contato.idContato, contato.nome])
  );
  const usuariosPorId = new Map(
    (usuarios || []).map((usuario) => [usuario.idUsuario, usuario.nome])
  );
  const tiposAtendimentoPorId = new Map(
    (tiposAtendimento || []).map((tipoAtendimento) => [tipoAtendimento.idTipoAtendimento, tipoAtendimento.descricao])
  );
  const canaisPorId = new Map(
    (canaisAtendimento || []).map((canal) => [canal.idCanalAtendimento, canal.descricao])
  );
  const origensPorId = new Map(
    (origensAtendimento || []).map((origem) => [origem.idOrigemAtendimento, origem.descricao])
  );

  return [...(atendimentos || [])]
    .map((atendimento) => ({
      ...atendimento,
      nomeFornecedor: fornecedoresPorId.get(atendimento.idFornecedor)?.nome || atendimento.nomeFornecedorSnapshot || 'Nao informado',
      idGrupoEmpresa: fornecedoresPorId.get(atendimento.idFornecedor)?.idGrupoEmpresa || null,
      nomeGrupoEmpresa: fornecedoresPorId.get(atendimento.idFornecedor)?.nomeGrupoEmpresa || 'Sem grupo',
      nomeContato: contatosPorId.get(atendimento.idContato) || atendimento.nomeContatoSnapshot || '',
      nomeUsuario: usuariosPorId.get(atendimento.idUsuario) || 'Nao informado',
      nomeTipoAtendimento: tiposAtendimentoPorId.get(atendimento.idTipoAtendimento) || 'Nao informado',
      nomeCanalAtendimento: canaisPorId.get(atendimento.idCanalAtendimento) || 'Nao informado',
      nomeOrigemAtendimento: origensPorId.get(atendimento.idOrigemAtendimento) || 'Nao informado'
    }))
    .sort(ordenarAtendimentosMaisRecentes);
}

function ordenarAtendimentosMaisRecentes(atendimentoA, atendimentoB) {
  const dataHoraA = `${atendimentoA.data || ''}T${atendimentoA.horaInicio || '00:00'}`;
  const dataHoraB = `${atendimentoB.data || ''}T${atendimentoB.horaInicio || '00:00'}`;

  return new Date(dataHoraB).getTime() - new Date(dataHoraA).getTime();
}

function normalizarFiltrosAtendimentosRelatorio(filtros = {}) {
  const idFornecedor = normalizarIdentificadorFiltro(filtros.idFornecedor);
  const idsUsuarios = normalizarListaIdentificadoresFiltro(filtros.idsUsuarios);
  const idsGruposEmpresa = normalizarListaIdentificadoresFiltro(filtros.idsGruposEmpresa);
  const idsTiposAtendimento = normalizarListaIdentificadoresFiltro(filtros.idsTiposAtendimento);
  const idsCanaisAtendimento = normalizarListaIdentificadoresFiltro(filtros.idsCanaisAtendimento);
  const idsOrigensAtendimento = normalizarListaIdentificadoresFiltro(filtros.idsOrigensAtendimento);
  const dataInicio = normalizarDataFiltro(filtros.dataInicio);
  const dataFim = normalizarDataFiltro(filtros.dataFim);
  const periodo = ordenarPeriodo(dataInicio, dataFim);

  return {
    idFornecedor,
    idsUsuarios,
    idsGruposEmpresa,
    idsTiposAtendimento,
    idsCanaisAtendimento,
    idsOrigensAtendimento,
    dataInicio: periodo.dataInicio,
    dataFim: periodo.dataFim
  };
}

function possuiFiltrosAtendimentosAtivos(filtros = {}) {
  return Boolean(
    filtros.idFornecedor
    || (Array.isArray(filtros.idsUsuarios) && filtros.idsUsuarios.length > 0)
    || (Array.isArray(filtros.idsGruposEmpresa) && filtros.idsGruposEmpresa.length > 0)
    || (Array.isArray(filtros.idsTiposAtendimento) && filtros.idsTiposAtendimento.length > 0)
    || (Array.isArray(filtros.idsCanaisAtendimento) && filtros.idsCanaisAtendimento.length > 0)
    || (Array.isArray(filtros.idsOrigensAtendimento) && filtros.idsOrigensAtendimento.length > 0)
    || filtros.dataInicio
    || filtros.dataFim
  );
}

function montarChipsFiltrosAtendimentosRelatorio(filtros, {
  fornecedores,
  usuarios,
  tiposAtendimento,
  canaisAtendimento,
  origensAtendimento,
  gruposEmpresa
}) {
  const chips = [];

  if (filtros.idFornecedor) {
    const fornecedor = fornecedores.find((item) => String(item.idFornecedor) === String(filtros.idFornecedor));
    chips.push({
      id: 'fornecedor',
      rotulo: `Fornecedor: ${fornecedor?.nomeFantasia || fornecedor?.razaoSocial || `#${filtros.idFornecedor}`}`
    });
  }

  if (Array.isArray(filtros.idsUsuarios) && filtros.idsUsuarios.length > 0) {
    filtros.idsUsuarios.forEach((idUsuario) => {
      const usuario = usuarios.find((item) => String(item.idUsuario) === String(idUsuario));
      chips.push({
        id: `usuario-${idUsuario}`,
        rotulo: `Usuario: ${usuario?.nome || `#${idUsuario}`}`
      });
    });
  }

  if (Array.isArray(filtros.idsGruposEmpresa) && filtros.idsGruposEmpresa.length > 0) {
    filtros.idsGruposEmpresa.forEach((idGrupoEmpresa) => {
      const grupo = gruposEmpresa.find((item) => String(item.idGrupoEmpresa) === String(idGrupoEmpresa));
      chips.push({
        id: `grupo-empresa-${idGrupoEmpresa}`,
        rotulo: `Grupo de empresa: ${grupo?.descricao || `#${idGrupoEmpresa}`}`
      });
    });
  }

  if (Array.isArray(filtros.idsCanaisAtendimento) && filtros.idsCanaisAtendimento.length > 0) {
    filtros.idsCanaisAtendimento.forEach((idCanalAtendimento) => {
      const canal = canaisAtendimento.find((item) => String(item.idCanalAtendimento) === String(idCanalAtendimento));
      chips.push({
        id: `canal-${idCanalAtendimento}`,
        rotulo: `Canal: ${canal?.descricao || `#${idCanalAtendimento}`}`
      });
    });
  }

  if (Array.isArray(filtros.idsTiposAtendimento) && filtros.idsTiposAtendimento.length > 0) {
    filtros.idsTiposAtendimento.forEach((idTipoAtendimento) => {
      const tipoAtendimento = tiposAtendimento.find((item) => String(item.idTipoAtendimento) === String(idTipoAtendimento));
      chips.push({
        id: `tipo-atendimento-${idTipoAtendimento}`,
        rotulo: `Tipo: ${tipoAtendimento?.descricao || `#${idTipoAtendimento}`}`
      });
    });
  }

  if (Array.isArray(filtros.idsOrigensAtendimento) && filtros.idsOrigensAtendimento.length > 0) {
    filtros.idsOrigensAtendimento.forEach((idOrigemAtendimento) => {
      const origem = origensAtendimento.find((item) => String(item.idOrigemAtendimento) === String(idOrigemAtendimento));
      chips.push({
        id: `origem-${idOrigemAtendimento}`,
        rotulo: `Origem: ${origem?.descricao || `#${idOrigemAtendimento}`}`
      });
    });
  }

  if (filtros.dataInicio || filtros.dataFim) {
    chips.push({
      id: 'periodo-data',
      rotulo: `Data: ${montarResumoPeriodoIndividual(filtros.dataInicio, filtros.dataFim)}`
    });
  }

  return chips;
}

function obterFiltrosPadraoAtendimentos() {
  const hoje = new Date();
  const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

  return {
    idFornecedor: '',
    idsUsuarios: [],
    idsGruposEmpresa: [],
    idsTiposAtendimento: [],
    idsCanaisAtendimento: [],
    idsOrigensAtendimento: [],
    dataInicio: formatarDataInput(inicioMes),
    dataFim: formatarDataInput(fimMes)
  };
}

function filtrarAtendimentosRelatorio(atendimentos, filtros) {
  return (atendimentos || []).filter((atendimento) => (
    validarPeriodoData(atendimento.data, filtros.dataInicio, filtros.dataFim)
    && (!filtros.idFornecedor || String(atendimento.idFornecedor || '') === String(filtros.idFornecedor))
    && (
      !Array.isArray(filtros.idsUsuarios)
      || filtros.idsUsuarios.length === 0
      || filtros.idsUsuarios.map(String).includes(String(atendimento.idUsuario || ''))
    )
    && (
      !Array.isArray(filtros.idsGruposEmpresa)
      || filtros.idsGruposEmpresa.length === 0
      || filtros.idsGruposEmpresa.map(String).includes(String(atendimento.idGrupoEmpresa || ''))
    )
    && (
      !Array.isArray(filtros.idsTiposAtendimento)
      || filtros.idsTiposAtendimento.length === 0
      || filtros.idsTiposAtendimento.map(String).includes(String(atendimento.idTipoAtendimento || ''))
    )
    && (
      !Array.isArray(filtros.idsCanaisAtendimento)
      || filtros.idsCanaisAtendimento.length === 0
      || filtros.idsCanaisAtendimento.map(String).includes(String(atendimento.idCanalAtendimento || ''))
    )
    && (
      !Array.isArray(filtros.idsOrigensAtendimento)
      || filtros.idsOrigensAtendimento.length === 0
      || filtros.idsOrigensAtendimento.map(String).includes(String(atendimento.idOrigemAtendimento || ''))
    )
  ));
}

function montarCardsConversao(cotacoes) {
  const totalGerados = Array.isArray(cotacoes) ? cotacoes.length : 0;
  const totalFechados = (Array.isArray(cotacoes) ? cotacoes : []).filter((cotacao) => etapaCotacaoEhFechadoPorId(cotacao.idEtapaCotacao)).length;
  const totalCancelados = (Array.isArray(cotacoes) ? cotacoes : []).filter((cotacao) => etapaCotacaoEhRecusadoPorId(cotacao.idEtapaCotacao)).length;
  const totalEmAberto = Math.max(0, totalGerados - totalFechados);
  const conversao = totalGerados > 0 ? (totalFechados / totalGerados) * 100 : 0;
  const perda = totalGerados > 0 ? (totalCancelados / totalGerados) * 100 : 0;

  return [
    {
      titulo: 'Cotacoes gerados',
      valor: String(totalGerados)
    },
    {
      titulo: 'Cotacoes fechados',
      valor: String(totalFechados)
    },
    {
      titulo: 'Conversao',
      valor: formatarPercentualResumo(conversao)
    },
    {
      titulo: 'Cotacoes cancelados',
      valor: String(totalCancelados)
    },
    {
      titulo: '% Perca',
      valor: formatarPercentualResumo(perda)
    },
    {
      titulo: 'Cotacoes em aberto',
      valor: String(totalEmAberto)
    }
  ];
}

function normalizarFiltrosConversao(filtros = {}) {
  const idFornecedor = normalizarIdentificadorFiltro(filtros.idFornecedor);
  const idUsuario = normalizarListaIdentificadoresFiltro(filtros.idUsuario);
  const idCompradorFornecedor = normalizarListaIdentificadoresFiltro(filtros.idCompradorFornecedor);
  const idComprador = normalizarListaIdentificadoresFiltro(filtros.idComprador);
  const idsGruposEmpresa = normalizarListaIdentificadoresFiltro(filtros.idsGruposEmpresa);
  const idsGruposProduto = normalizarListaIdentificadoresFiltro(filtros.idsGruposProduto);
  const idsMarcas = normalizarListaIdentificadoresFiltro(filtros.idsMarcas);
  const idsEtapaCotacao = normalizarListaIdentificadoresFiltro(filtros.idsEtapaCotacao);
  const dataInclusaoInicio = normalizarDataFiltro(filtros.dataInclusaoInicio);
  const dataInclusaoFim = normalizarDataFiltro(filtros.dataInclusaoFim);
  const dataFechamentoInicio = normalizarDataFiltro(filtros.dataFechamentoInicio);
  const dataFechamentoFim = normalizarDataFiltro(filtros.dataFechamentoFim);
  const periodoInclusao = ordenarPeriodo(dataInclusaoInicio, dataInclusaoFim);
  const periodoFechamento = ordenarPeriodo(dataFechamentoInicio, dataFechamentoFim);

  return {
    idFornecedor,
    idUsuario,
    idCompradorFornecedor,
    idComprador,
    idsGruposEmpresa,
    idsGruposProduto,
    idsMarcas,
    idsEtapaCotacao,
    dataInclusaoInicio: periodoInclusao.dataInicio,
    dataInclusaoFim: periodoInclusao.dataFim,
    dataFechamentoInicio: periodoFechamento.dataInicio,
    dataFechamentoFim: periodoFechamento.dataFim
  };
}

function possuiFiltrosConversaoAtivos(filtros = {}) {
  return Boolean(
    filtros.idFornecedor
    || (Array.isArray(filtros.idUsuario) && filtros.idUsuario.length > 0)
    || (Array.isArray(filtros.idCompradorFornecedor) && filtros.idCompradorFornecedor.length > 0)
    || (Array.isArray(filtros.idComprador) && filtros.idComprador.length > 0)
    || (Array.isArray(filtros.idsGruposEmpresa) && filtros.idsGruposEmpresa.length > 0)
    || (Array.isArray(filtros.idsGruposProduto) && filtros.idsGruposProduto.length > 0)
    || (Array.isArray(filtros.idsMarcas) && filtros.idsMarcas.length > 0)
    || (Array.isArray(filtros.idsEtapaCotacao) && filtros.idsEtapaCotacao.length > 0)
    || filtros.dataInclusaoInicio
    || filtros.dataInclusaoFim
    || filtros.dataFechamentoInicio
    || filtros.dataFechamentoFim
  );
}

function montarChipsFiltrosConversao(filtros, {
  fornecedores,
  usuarios,
  compradores,
  etapasCotacao,
  gruposEmpresa,
  gruposProduto,
  marcas
}) {
  const chips = [];

  if (filtros.idFornecedor) {
    const fornecedor = fornecedores.find((item) => String(item.idFornecedor) === String(filtros.idFornecedor));
    chips.push({
      id: 'fornecedor',
      rotulo: `Fornecedor: ${fornecedor?.nomeFantasia || fornecedor?.razaoSocial || `#${filtros.idFornecedor}`}`
    });
  }

  if (Array.isArray(filtros.idUsuario) && filtros.idUsuario.length > 0) {
    filtros.idUsuario.forEach((idUsuario) => {
      const usuario = usuarios.find((item) => String(item.idUsuario) === String(idUsuario));
      chips.push({
        id: `usuario-${idUsuario}`,
        rotulo: `Usuario: ${usuario?.nome || `#${idUsuario}`}`
      });
    });
  }

  if (Array.isArray(filtros.idsGruposEmpresa) && filtros.idsGruposEmpresa.length > 0) {
    filtros.idsGruposEmpresa.forEach((idGrupoEmpresa) => {
      const grupo = gruposEmpresa.find((item) => String(item.idGrupoEmpresa) === String(idGrupoEmpresa));
      chips.push({
        id: `grupo-empresa-${idGrupoEmpresa}`,
        rotulo: `Grupo de empresa: ${grupo?.descricao || `#${idGrupoEmpresa}`}`
      });
    });
  }

  if (Array.isArray(filtros.idsGruposProduto) && filtros.idsGruposProduto.length > 0) {
    filtros.idsGruposProduto.forEach((idGrupoProduto) => {
      const grupo = gruposProduto.find((item) => String(item.idGrupo) === String(idGrupoProduto));
      chips.push({
        id: `grupo-produto-${idGrupoProduto}`,
        rotulo: `Grupo de produto: ${grupo?.descricao || `#${idGrupoProduto}`}`
      });
    });
  }

  if (Array.isArray(filtros.idsMarcas) && filtros.idsMarcas.length > 0) {
    filtros.idsMarcas.forEach((idMarca) => {
      const marca = marcas.find((item) => String(item.idMarca) === String(idMarca));
      chips.push({
        id: `marca-${idMarca}`,
        rotulo: `Marca: ${marca?.descricao || `#${idMarca}`}`
      });
    });
  }

  if (Array.isArray(filtros.idCompradorFornecedor) && filtros.idCompradorFornecedor.length > 0) {
    filtros.idCompradorFornecedor.forEach((idCompradorFornecedor) => {
      const comprador = compradores.find((item) => String(item.idComprador) === String(idCompradorFornecedor));
      chips.push({
        id: `comprador-fornecedor-${idCompradorFornecedor}`,
        rotulo: `Comprador do fornecedor: ${comprador?.nome || `#${idCompradorFornecedor}`}`
      });
    });
  }

  if (Array.isArray(filtros.idComprador) && filtros.idComprador.length > 0) {
    filtros.idComprador.forEach((idComprador) => {
      const comprador = compradores.find((item) => String(item.idComprador) === String(idComprador));
      chips.push({
        id: `comprador-cotacao-${idComprador}`,
        rotulo: `Comprador da cotacao: ${comprador?.nome || `#${idComprador}`}`
      });
    });
  }

  if (Array.isArray(filtros.idsEtapaCotacao) && filtros.idsEtapaCotacao.length > 0) {
    filtros.idsEtapaCotacao.forEach((idEtapaCotacao) => {
      const etapa = etapasCotacao.find((item) => String(item.idEtapaCotacao) === String(idEtapaCotacao));
      chips.push({
        id: `etapa-${idEtapaCotacao}`,
        rotulo: `Etapa: ${etapa?.descricao || `#${idEtapaCotacao}`}`
      });
    });
  }

  if (filtros.dataInclusaoInicio || filtros.dataInclusaoFim) {
    chips.push({
      id: 'periodo-inclusao',
      rotulo: `Inclusao: ${montarResumoPeriodoIndividual(filtros.dataInclusaoInicio, filtros.dataInclusaoFim)}`
    });
  }

  if (filtros.dataFechamentoInicio || filtros.dataFechamentoFim) {
    chips.push({
      id: 'periodo-fechamento',
      rotulo: `Fechamento: ${montarResumoPeriodoIndividual(filtros.dataFechamentoInicio, filtros.dataFechamentoFim)}`
    });
  }

  return chips;
}

function obterFiltrosPadraoConversao() {
  const hoje = new Date();
  const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

  return {
    idFornecedor: '',
    idUsuario: [],
    idCompradorFornecedor: [],
    idComprador: [],
    idsGruposEmpresa: [],
    idsGruposProduto: [],
    idsMarcas: [],
    idsEtapaCotacao: [],
    dataInclusaoInicio: formatarDataInput(inicioMes),
    dataInclusaoFim: formatarDataInput(fimMes),
    dataFechamentoInicio: '',
    dataFechamentoFim: ''
  };
}

function filtrarCotacoesConversao(cotacoes, filtros) {
  return (cotacoes || []).filter((cotacao) => (
    (!filtros.idFornecedor || String(cotacao.idFornecedor || '') === String(filtros.idFornecedor))
    && (
      !Array.isArray(filtros.idUsuario)
      || filtros.idUsuario.length === 0
      || filtros.idUsuario.map(String).includes(String(cotacao.idUsuario || ''))
    )
    && (
      !Array.isArray(filtros.idCompradorFornecedor)
      || filtros.idCompradorFornecedor.length === 0
      || filtros.idCompradorFornecedor.map(String).includes(String(cotacao.idCompradorFornecedor || ''))
    )
    && (
      !Array.isArray(filtros.idComprador)
      || filtros.idComprador.length === 0
      || filtros.idComprador.map(String).includes(String(cotacao.idComprador || ''))
    )
    && (
      !Array.isArray(filtros.idsGruposEmpresa)
      || filtros.idsGruposEmpresa.length === 0
      || filtros.idsGruposEmpresa.map(String).includes(String(cotacao.idGrupoEmpresa || ''))
    )
    && (
      !Array.isArray(filtros.idsGruposProduto)
      || filtros.idsGruposProduto.length === 0
      || filtros.idsGruposProduto.some((idGrupo) => (cotacao.idsGruposProduto || []).includes(String(idGrupo)))
    )
    && (
      !Array.isArray(filtros.idsMarcas)
      || filtros.idsMarcas.length === 0
      || filtros.idsMarcas.some((idMarca) => (cotacao.idsMarcas || []).includes(String(idMarca)))
    )
    && (
      !Array.isArray(filtros.idsEtapaCotacao)
      || filtros.idsEtapaCotacao.length === 0
      || filtros.idsEtapaCotacao.includes(String(cotacao.idEtapaCotacao || ''))
    )
    && validarPeriodoData(cotacao.dataInclusao, filtros.dataInclusaoInicio, filtros.dataInclusaoFim)
    && validarPeriodoData(cotacao.dataFechamento, filtros.dataFechamentoInicio, filtros.dataFechamentoFim)
  ));
}

function enriquecerCotacoesConversao(
  cotacoes,
  fornecedores,
  contatos,
  usuarios,
  compradores,
  etapasCotacao,
  produtos = [],
  gruposEmpresa = [],
  gruposProduto = [],
  marcas = []
) {
  const fornecedoresPorId = new Map(
    (fornecedores || []).map((fornecedor) => [
      fornecedor.idFornecedor,
      {
        nome: fornecedor.nomeFantasia || fornecedor.razaoSocial || `Fornecedor #${fornecedor.idFornecedor}`,
        idComprador: fornecedor.idComprador,
        idGrupoEmpresa: fornecedor.idGrupoEmpresa,
        nomeGrupoEmpresa: obterNomeGrupoEmpresaPorId(gruposEmpresa, fornecedor.idGrupoEmpresa)
      }
    ])
  );
  const contatosPorId = new Map(
    (contatos || []).map((contato) => [contato.idContato, contato.nome])
  );
  const usuariosPorId = new Map(
    (usuarios || []).map((usuario) => [usuario.idUsuario, usuario.nome])
  );
  const compradoresPorId = new Map(
    (compradores || []).map((comprador) => [comprador.idComprador, comprador.nome])
  );
  const etapasPorId = new Map(
    (etapasCotacao || []).map((etapa) => [etapa.idEtapaCotacao, etapa])
  );
  const produtosPorId = new Map(
    (produtos || []).map((produto) => [
      produto.idProduto,
      {
        idGrupo: produto.idGrupo,
        nomeGrupoProduto: obterNomeGrupoProdutoPorId(gruposProduto, produto.idGrupo),
        idMarca: produto.idMarca,
        nomeMarca: obterNomeMarcaPorId(marcas, produto.idMarca)
      }
    ])
  );

  return [...(cotacoes || [])]
    .map((cotacao) => {
      const fornecedor = fornecedoresPorId.get(cotacao.idFornecedor);
      const idEtapaCotacaoNormalizado = normalizarIdEtapaCotacaoConversao(cotacao.idEtapaCotacao, etapasCotacao);
      const totalCotacao = Array.isArray(cotacao.itens)
        ? cotacao.itens.reduce((total, item) => total + (Number(item.valorTotal) || 0), 0)
        : 0;

      return {
        ...cotacao,
        idEtapaCotacao: idEtapaCotacaoNormalizado,
        nomeFornecedor: fornecedor?.nome || 'Nao informado',
        idGrupoEmpresa: fornecedor?.idGrupoEmpresa || null,
        nomeGrupoEmpresa: fornecedor?.nomeGrupoEmpresa || 'Sem grupo',
        nomeContato: contatosPorId.get(cotacao.idContato) || '',
        idCompradorFornecedor: fornecedor?.idComprador || null,
        nomeUsuario: usuariosPorId.get(cotacao.idUsuario) || 'Nao informado',
        nomeComprador: compradoresPorId.get(cotacao.idComprador) || 'Nao informado',
        idsGruposProduto: Array.from(new Set(
          (Array.isArray(cotacao.itens) ? cotacao.itens : [])
            .map((item) => produtosPorId.get(item.idProduto)?.idGrupo)
            .filter((valor) => valor !== null && valor !== undefined && valor !== '')
            .map(String)
        )),
        idsMarcas: Array.from(new Set(
          (Array.isArray(cotacao.itens) ? cotacao.itens : [])
            .map((item) => produtosPorId.get(item.idProduto)?.idMarca)
            .filter((valor) => valor !== null && valor !== undefined && valor !== '')
            .map(String)
        )),
        nomeEtapaCotacao: etapasPorId.get(idEtapaCotacaoNormalizado)?.descricao || '',
        corEtapaCotacao: etapasPorId.get(idEtapaCotacaoNormalizado)?.cor || '',
        totalCotacao
      };
    })
    .sort((cotacaoA, cotacaoB) => {
      const dataA = normalizarDataFiltro(cotacaoA.dataInclusao);
      const dataB = normalizarDataFiltro(cotacaoB.dataInclusao);

      if (dataA !== dataB) {
        return dataB.localeCompare(dataA);
      }

      return Number(cotacaoB.idCotacao || 0) - Number(cotacaoA.idCotacao || 0);
    });
}

function obterNomeGrupoEmpresaPorId(gruposEmpresa, idGrupoEmpresa) {
  const grupo = (gruposEmpresa || []).find((item) => String(item.idGrupoEmpresa) === String(idGrupoEmpresa || ''));
  return grupo?.descricao || 'Sem grupo';
}

function obterNomeGrupoProdutoPorId(gruposProduto, idGrupo) {
  const grupo = (gruposProduto || []).find((item) => String(item.idGrupo) === String(idGrupo || ''));
  return grupo?.descricao || 'Sem grupo';
}

function obterNomeMarcaPorId(marcas, idMarca) {
  const marca = (marcas || []).find((item) => String(item.idMarca) === String(idMarca || ''));
  return marca?.descricao || 'Sem marca';
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

function etapaCotacaoEhFechadoPorId(idEtapaCotacao) {
  return [1, 2, 3, 4].includes(Number(idEtapaCotacao));
}

function etapaCotacaoEhRecusadoPorId(idEtapaCotacao) {
  return Number(idEtapaCotacao) === 4;
}

function normalizarEtapasCotacaoConversao(etapas) {
  if (!Array.isArray(etapas)) {
    return [];
  }

  const etapasNormalizadas = [];
  let recusadoInserido = false;

  etapas.forEach((etapa) => {
    if (etapaCotacaoEhRecusado(etapa)) {
      if (!recusadoInserido) {
        etapasNormalizadas.push({
          ...etapa,
          idEtapaCotacao: 4,
          descricao: 'Recusado',
          cor: etapa.cor || '#E5E7EB',
          consideraFunilCotacoes: 0,
          ordem: 4,
          status: 1
        });
        recusadoInserido = true;
      }

      return;
    }

    etapasNormalizadas.push(etapa);
  });

  return etapasNormalizadas;
}

function normalizarIdEtapaCotacaoConversao(idEtapaCotacao, etapasCotacao) {
  const etapa = (etapasCotacao || []).find((item) => String(item.idEtapaCotacao) === String(idEtapaCotacao || ''));

  return etapaCotacaoEhRecusado(etapa || { idEtapaCotacao }) ? 4 : Number(idEtapaCotacao || 0);
}

function etapaCotacaoEhRecusado(etapa) {
  const descricao = String(etapa?.descricao || '').trim().toLowerCase();

  return Number(etapa?.idEtapaCotacao) === 4 || descricao === 'recusado';
}


