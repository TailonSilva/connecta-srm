import { CorpoPagina } from '../componentes/layout/corpoPagina';
import { Icone } from '../componentes/comuns/icone';
import { useEffect, useState } from 'react';
import '../recursos/estilos/cabecalhoPagina.css';
import {
  atualizarEtapaOrdemCompra,
  atualizarEtapaCotacao,
  atualizarContatoGrupoEmpresa,
  atualizarGrupoProduto,
  atualizarGrupoEmpresa,
  atualizarCanalAtendimento,
  atualizarCampoCotacao,
  atualizarCampoOrdemCompra,
  atualizarConceitoFornecedor,
  atualizarLocalAgenda,
  atualizarMarca,
  atualizarMetodoPagamento,
  atualizarOrigemAtendimento,
  atualizarPrazoPagamento,
  atualizarTipoAtendimento,
  atualizarTipoOrdemCompra,
  atualizarRecurso,
  atualizarRamoAtividade,
  atualizarStatusVisita,
  atualizarTipoAgenda,
  atualizarTipoRecurso,
  atualizarUnidadeMedida,
  atualizarComprador,
  incluirEtapaOrdemCompra,
  incluirEtapaCotacao,
  incluirContatoGrupoEmpresa,
  incluirGrupoProduto,
  incluirGrupoEmpresa,
  incluirCanalAtendimento,
  incluirCampoCotacao,
  incluirCampoOrdemCompra,
  incluirConceitoFornecedor,
  incluirLocalAgenda,
  incluirMarca,
  incluirMetodoPagamento,
  incluirOrigemAtendimento,
  incluirPrazoPagamento,
  incluirTipoAtendimento,
  incluirTipoOrdemCompra,
  incluirRecurso,
  incluirRamoAtividade,
  incluirStatusVisita,
  incluirTipoAgenda,
  incluirTipoRecurso,
  incluirUnidadeMedida,
  incluirComprador,
  listarEtapasOrdemCompraConfiguracao,
  listarEtapasCotacaoConfiguracao,
  listarContatosGruposEmpresaConfiguracao,
  listarGruposProdutoConfiguracao,
  listarGruposEmpresaConfiguracao,
  listarCanaisAtendimentoConfiguracao,
  listarCamposCotacaoConfiguracao,
  listarCamposOrdemCompraConfiguracao,
  listarConceitosFornecedorConfiguracao,
  listarLocaisAgendaConfiguracao,
  listarMarcasConfiguracao,
  listarMetodosPagamentoConfiguracao,
  obterConfiguracaoAtualizacaoSistema,
  listarOrigensAtendimentoConfiguracao,
  listarPrazosPagamentoConfiguracao,
  listarTiposAtendimentoConfiguracao,
  listarTiposOrdemCompraConfiguracao,
  listarRecursosConfiguracao,
  listarRamosAtividadeConfiguracao,
  listarStatusVisitaConfiguracao,
  listarTamanhosConfiguracao,
  listarTiposAgendaConfiguracao,
  listarTiposRecursoConfiguracao,
  listarUnidadesMedidaConfiguracao,
  listarCompradoresConfiguracao,
  salvarConfiguracaoAtualizacaoSistema,
  atualizarTamanho,
  incluirTamanho
} from '../servicos/configuracoes';
import { atualizarEmpresa, incluirEmpresa, listarEmpresas } from '../servicos/empresa';
import { normalizarConfiguracoesColunasGridFornecedores } from '../dados/colunasGridFornecedores';
import { normalizarConfiguracoesColunasGridCotacoes } from '../dados/colunasGridCotacoes';
import { normalizarConfiguracoesColunasGridProdutos } from '../dados/colunasGridProdutos';
import { normalizarConfiguracoesColunasGridOrdensCompra } from '../dados/colunasGridOrdensCompra';
import { atualizarUsuario, incluirUsuario, listarUsuarios } from '../servicos/usuarios';
import { normalizarConfiguracoesColunasGridAtendimentos } from '../dados/colunasGridAtendimentos';
import {
  normalizarConfiguracoesGraficosPaginaInicialCotacoes,
  normalizarConfiguracoesGraficosPaginaInicialAtendimentos,
  normalizarConfiguracoesGraficosPaginaInicialOrdensCompra,
  reordenarConfiguracoesGraficosPaginaInicialAtendimentos,
  reordenarConfiguracoesGraficosPaginaInicialCotacoes,
  reordenarConfiguracoesGraficosPaginaInicialOrdensCompra,
  reposicionarConfiguracaoGraficosPaginaInicialAtendimentos,
  reposicionarConfiguracaoGraficosPaginaInicialCotacoes,
  reposicionarConfiguracaoGraficosPaginaInicialOrdensCompra,
  TOTAL_COLUNAS_GRAFICOS_PAGINA_INICIAL
} from '../dados/graficosPaginaInicial';
import {
  normalizarConfiguracoesCardsPaginaInicial,
  reordenarConfiguracoesCardsPaginaInicial,
  reposicionarConfiguracaoCardsPaginaInicial,
  TOTAL_COLUNAS_CARDS_PAGINA_INICIAL,
  TOTAL_COLUNAS_MAXIMO_CARDS_PAGINA_INICIAL
} from '../dados/cardsPaginaInicial';
import { normalizarTelefone } from '../utilitarios/normalizarTelefone';
import { ModalAtualizacaoSistema } from '../componentes/modulos/configuracoes-modalAtualizacaoSistema';
import { ModalCadastroConfiguracao } from '../componentes/modulos/configuracoes-modalCadastroConfiguracao';
import { ModalEmpresa } from '../componentes/modulos/configuracoes-modalEmpresa';
import { ModalGraficosPaginaInicial } from '../componentes/modulos/configuracoes-modalGraficosPaginaInicial';
import { ModalGruposProduto } from '../componentes/modulos/configuracoes-modalGruposProduto';
import { ModalGruposEmpresa } from '../componentes/modulos/configuracoes-modalGruposEmpresa';
import { ModalLayoutCotacao } from '../componentes/modulos/configuracoes-modalLayoutCotacao';
import { ModalColunasGridFornecedores } from '../componentes/modulos/configuracoes-modalColunasGridFornecedores';
import { ModalColunasGridCotacoes } from '../componentes/modulos/configuracoes-modalColunasGridCotacoes';
import { ModalColunasGridProdutos } from '../componentes/modulos/configuracoes-modalColunasGridProdutos';
import { ModalColunasGridOrdensCompra } from '../componentes/modulos/configuracoes-modalColunasGridOrdensCompra';
import { ModalColunasGridAtendimentos } from '../componentes/modulos/configuracoes-modalColunasGridAtendimentos';
import { ModalSelecaoColunasGrid } from '../componentes/modulos/configuracoes-modalSelecaoColunasGrid';
import { ModalManualConfiguracoes } from '../componentes/modulos/configuracoes-modalManualConfiguracoes';
import { ModalMarcas } from '../componentes/modulos/configuracoes-modalMarcas';
import { ModalPrazosPagamento } from '../componentes/modulos/configuracoes-modalPrazosPagamento';
import { ModalRelatorioConfiguracao } from '../componentes/modulos/configuracoes-modalRelatorioConfiguracao';
import { ModalRamosAtividade } from '../componentes/modulos/configuracoes-modalRamosAtividade';
import { ModalUnidadesMedida } from '../componentes/modulos/configuracoes-modalUnidadesMedida';
import { ModalUsuarios } from '../componentes/modulos/configuracoes-modalUsuarios';

const atalhosConfiguracao = [
  {
    id: 'empresa',
    titulo: 'Empresa',
    icone: 'empresa'
  },
  {
    id: 'ramosAtividade',
    titulo: 'Ramos de atividade',
    icone: 'cadastro'
  },
  {
    id: 'conceitosFornecedor',
    titulo: 'Conceitos de fornecedor',
    icone: 'cadastro'
  },
  {
    id: 'compradores',
    titulo: 'Compradores',
    icone: 'usuarios'
  },
  {
    id: 'usuarios',
    titulo: 'Usuarios',
    icone: 'contato'
  },
  {
    id: 'gruposProduto',
    titulo: 'Grupos de produto',
    icone: 'caixa'
  },
  {
    id: 'gruposEmpresa',
    titulo: 'Grupos de empresa',
    icone: 'empresa'
  },
  {
    id: 'marcas',
    titulo: 'Marcas',
    icone: 'selo'
  },
  {
    id: 'metodosPagamento',
    titulo: 'Metodos de pagamento',
    icone: 'pagamento'
  },
  {
    id: 'prazosPagamento',
    titulo: 'Prazos de pagamento',
    icone: 'pagamento'
  },
  {
    id: 'tiposOrdemCompra',
    titulo: 'Tipos de ordem de compra',
    icone: 'ordemCompra'
  },
  {
    id: 'locaisAgenda',
    titulo: 'Locais da agenda',
    icone: 'empresa'
  },
  {
    id: 'tiposRecurso',
    titulo: 'Tipos de recurso',
    icone: 'cadastro'
  },
  {
    id: 'recursos',
    titulo: 'Recursos',
    icone: 'caixa'
  },
  {
    id: 'tiposAgenda',
    titulo: 'Tipos de agenda',
    icone: 'cotacao'
  },
  {
    id: 'colunasGridAtendimentos',
    titulo: 'Colunas do grid',
    icone: 'filtro'
  },
  {
    id: 'canaisAtendimento',
    titulo: 'Canais de atendimento',
    icone: 'mensagem'
  },
  {
    id: 'origensAtendimento',
    titulo: 'Origens de atendimento',
    icone: 'empresa'
  },
  {
    id: 'tiposAtendimento',
    titulo: 'Tipos de atendimento',
    icone: 'cadastro'
  },
  {
    id: 'statusVisita',
    titulo: 'Status da agenda',
    icone: 'cadastro'
  },
  {
    id: 'cotacoes',
    titulo: 'Campos da cotacao',
    icone: 'cotacao'
  },
  {
    id: 'ordensCompra',
    titulo: 'Campos da ordem de compra',
    icone: 'ordemCompra'
  },
  {
    id: 'layoutCotacao',
    titulo: 'Layout Cotacao',
    icone: 'cotacao'
  },
  {
    id: 'etapasOrdemCompra',
    titulo: 'Etapas da ordem de compra',
    icone: 'cotacao'
  },
  {
    id: 'etapasCotacao',
    titulo: 'Etapas da cotacao',
    icone: 'cotacao'
  },
  {
    id: 'tamanhos',
    titulo: 'Tamanhos',
    icone: 'tamanho'
  },
  {
    id: 'unidadesMedida',
    titulo: 'Unidades',
    icone: 'medida'
  },
  {
    id: 'atualizacaoSistema',
    titulo: 'Atualizacao do sistema',
    icone: 'importar'
  },
  {
    id: 'relatorioOrdensCompraFechados',
    titulo: 'Ordens de compra',
    icone: 'ordemCompra'
  },
  {
    id: 'relatorioOrdensCompraEntregues',
    titulo: 'Conversao',
    icone: 'cotacao'
  },
  {
    id: 'relatorioAtendimentos',
    titulo: 'Atendimentos',
    icone: 'atendimentos'
  }
];

const secoesConfiguracao = [
  {
    id: 'gerais',
    titulo: 'Gerais',
    atalhos: ['empresa', 'usuarios', 'compradores', 'colunasGridAtendimentos', 'atualizacaoSistema']
  },
  {
    id: 'paginaInicial',
    titulo: 'Pagina inicial',
    atalhos: []
  },
  {
    id: 'agenda',
    titulo: 'Agenda',
    atalhos: ['locaisAgenda', 'tiposRecurso', 'recursos', 'tiposAgenda', 'statusVisita']
  },
  {
    id: 'atendimentos',
    titulo: 'Atendimentos',
    atalhos: ['tiposAtendimento', 'canaisAtendimento', 'origensAtendimento']
  },
  {
    id: 'cadastros',
    titulo: 'Cadastros',
    atalhos: [
      'ramosAtividade',
      'conceitosFornecedor',
      'gruposEmpresa',
      'gruposProduto',
      'marcas',
      'tiposOrdemCompra',
      'unidadesMedida',
      'tamanhos'
    ]
  },
  {
    id: 'cotacoesOrdensCompra',
    titulo: 'Cotacoes/Ordens de Compra',
    atalhos: atalhosConfiguracao
      .map((atalho) => atalho.id)
      .filter((id) => ![
        'empresa',
        'usuarios',
        'compradores',
        'colunasGridAtendimentos',
        'locaisAgenda',
        'tiposRecurso',
        'recursos',
        'tiposAgenda',
        'statusVisita',
        'canaisAtendimento',
        'origensAtendimento',
        'ramosAtividade',
        'conceitosFornecedor',
        'gruposEmpresa',
        'gruposProduto',
        'marcas',
        'atualizacaoSistema',
        'relatorioOrdensCompraFechados',
        'relatorioOrdensCompraEntregues',
        'relatorioAtendimentos',
        'unidadesMedida',
        'tamanhos'
      ].includes(id))
  },
  {
    id: 'relatorios',
    titulo: 'Relatorios',
    atalhos: ['relatorioOrdensCompraFechados', 'relatorioOrdensCompraEntregues', 'relatorioAtendimentos']
  }
];
const IDS_STATUS_VISITA_CRITICOS = new Set([1, 2, 3, 4, 5]);
const IDS_ETAPAS_ORDEM_COMPRA_OBRIGATORIAS = new Set([5]);
const IDS_ETAPAS_COTACAO_OBRIGATORIAS = new Set([1, 2, 3, 4]);
const IDS_TIPOS_ORDEM_COMPRA_OBRIGATORIOS = new Set([1, 2]);
const IDS_CONCEITOS_FORNECEDOR_OBRIGATORIOS = new Set([1]);

function statusVisitaEhCritico(registro) {
  const idStatusVisita = Number(registro?.idStatusVisita);
  return Number.isFinite(idStatusVisita) && IDS_STATUS_VISITA_CRITICOS.has(idStatusVisita);
}

function etapaCotacaoEhObrigatoria(registro) {
  const idEtapaCotacao = Number(registro?.idEtapaCotacao);
  return Number.isFinite(idEtapaCotacao) && IDS_ETAPAS_COTACAO_OBRIGATORIAS.has(idEtapaCotacao);
}

function etapaOrdemCompraEhObrigatoria(registro) {
  const idEtapaOrdemCompra = Number(registro?.idEtapa);
  return Number.isFinite(idEtapaOrdemCompra) && IDS_ETAPAS_ORDEM_COMPRA_OBRIGATORIAS.has(idEtapaOrdemCompra);
}

function tipoOrdemCompraEhObrigatorio(registro) {
  const idTipoOrdemCompra = Number(registro?.idTipoOrdemCompra);
  return Number.isFinite(idTipoOrdemCompra) && IDS_TIPOS_ORDEM_COMPRA_OBRIGATORIOS.has(idTipoOrdemCompra);
}

function conceitoFornecedorEhObrigatorio(registro) {
  const idConceito = Number(registro?.idConceito);
  return Number.isFinite(idConceito) && IDS_CONCEITOS_FORNECEDOR_OBRIGATORIOS.has(idConceito);
}

export function PaginaConfiguracoes({ usuarioLogado }) {
  const [empresa, definirEmpresa] = useState(null);
  const [usuarios, definirUsuarios] = useState([]);
  const [gruposProduto, definirGruposProduto] = useState([]);
  const [gruposEmpresa, definirGruposEmpresa] = useState([]);
  const [contatosGruposEmpresa, definirContatosGruposEmpresa] = useState([]);
  const [marcas, definirMarcas] = useState([]);
  const [ramosAtividade, definirRamosAtividade] = useState([]);
  const [conceitosFornecedor, definirConceitosFornecedor] = useState([]);
  const [compradores, definirCompradores] = useState([]);
  const [unidadesMedida, definirUnidadesMedida] = useState([]);
  const [metodosPagamento, definirMetodosPagamento] = useState([]);
  const [prazosPagamento, definirPrazosPagamento] = useState([]);
  const [tiposOrdemCompra, definirTiposOrdemCompra] = useState([]);
  const [locaisAgenda, definirLocaisAgenda] = useState([]);
  const [tiposRecurso, definirTiposRecurso] = useState([]);
  const [recursos, definirRecursos] = useState([]);
  const [tiposAgenda, definirTiposAgenda] = useState([]);
  const [canaisAtendimento, definirCanaisAtendimento] = useState([]);
  const [origensAtendimento, definirOrigensAtendimento] = useState([]);
  const [tiposAtendimento, definirTiposAtendimento] = useState([]);
  const [statusVisita, definirStatusVisita] = useState([]);
  const [etapasOrdemCompra, definirEtapasOrdemCompra] = useState([]);
  const [etapasCotacao, definirEtapasCotacao] = useState([]);
  const [camposCotacao, definirCamposCotacao] = useState([]);
  const [camposOrdemCompra, definirCamposOrdemCompra] = useState([]);
  const [tamanhos, definirTamanhos] = useState([]);
  const [configuracaoAtualizacaoSistema, definirConfiguracaoAtualizacaoSistema] = useState(null);
  const [modalManualAberto, definirModalManualAberto] = useState(false);
  const [modalEmpresaAberto, definirModalEmpresaAberto] = useState(false);
  const [modalLayoutCotacaoAberto, definirModalLayoutCotacaoAberto] = useState(false);
  const [modalSelecaoColunasGridAberto, definirModalSelecaoColunasGridAberto] = useState(false);
  const [modalColunasGridFornecedoresAberto, definirModalColunasGridFornecedoresAberto] = useState(false);
  const [modalColunasGridCotacoesAberto, definirModalColunasGridCotacoesAberto] = useState(false);
  const [modalColunasGridProdutosAberto, definirModalColunasGridProdutosAberto] = useState(false);
  const [modalColunasGridOrdensCompraAberto, definirModalColunasGridOrdensCompraAberto] = useState(false);
  const [modalColunasGridAtendimentosAberto, definirModalColunasGridAtendimentosAberto] = useState(false);
  const [modalGraficosPaginaInicialAberto, definirModalGraficosPaginaInicialAberto] = useState(null);
  const [modalUsuariosAberto, definirModalUsuariosAberto] = useState(false);
  const [modalAtualizacaoSistemaAberto, definirModalAtualizacaoSistemaAberto] = useState(false);
  const [relatorioConfiguracaoAberto, definirRelatorioConfiguracaoAberto] = useState(null);
  const [cadastroConfiguracaoAberto, definirCadastroConfiguracaoAberto] = useState(null);
  const [modoModalEmpresa, definirModoModalEmpresa] = useState('edicao');
  const usuarioSomenteConsulta = usuarioLogado?.tipo === 'Usuario padrao';

  useEffect(() => {
    carregarEmpresa();
    carregarCadastrosConfiguracao();
    carregarConfiguracaoAtualizacaoSistema();
  }, []);

  useEffect(() => {
    carregarUsuarios();
  }, [compradores]);

  useEffect(() => {
    function tratarAtalhosConfiguracoes(evento) {
      if (evento.key !== 'F1') {
        return;
      }

      evento.preventDefault();

      if (
        !modalManualAberto
        && !modalEmpresaAberto
        && !modalLayoutCotacaoAberto
        && !modalSelecaoColunasGridAberto
        && !modalColunasGridFornecedoresAberto
        && !modalColunasGridCotacoesAberto
        && !modalColunasGridProdutosAberto
        && !modalColunasGridOrdensCompraAberto
        && !modalColunasGridAtendimentosAberto
        && !modalGraficosPaginaInicialAberto
        && !modalUsuariosAberto
        && !modalAtualizacaoSistemaAberto
        && !relatorioConfiguracaoAberto
        && !cadastroConfiguracaoAberto
      ) {
        definirModalManualAberto(true);
      }
    }

    window.addEventListener('keydown', tratarAtalhosConfiguracoes);

    return () => {
      window.removeEventListener('keydown', tratarAtalhosConfiguracoes);
    };
  }, [
    cadastroConfiguracaoAberto,
    relatorioConfiguracaoAberto,
    modalAtualizacaoSistemaAberto,
    modalSelecaoColunasGridAberto,
    modalColunasGridFornecedoresAberto,
    modalColunasGridCotacoesAberto,
    modalColunasGridProdutosAberto,
    modalColunasGridOrdensCompraAberto,
    modalColunasGridAtendimentosAberto,
    modalGraficosPaginaInicialAberto,
    modalEmpresaAberto,
    modalLayoutCotacaoAberto,
    modalManualAberto,
    modalUsuariosAberto
  ]);

  async function carregarEmpresa() {
    const empresas = await listarEmpresas({ incluirInativos: true });
    definirEmpresa(empresas[0] || null);
  }

  async function salvarEmpresa(dadosEmpresa) {
    const payload = normalizarPayloadEmpresa({
      ...(empresa || {}),
      ...dadosEmpresa
    });

    if (empresa?.idEmpresa) {
      await atualizarEmpresa(empresa.idEmpresa, payload);
    } else {
      await incluirEmpresa(payload);
    }

    await carregarEmpresa();
    window.dispatchEvent(new CustomEvent('empresa-atualizada'));
    definirModalEmpresaAberto(false);
    definirModoModalEmpresa('edicao');
  }

  async function salvarLayoutCotacao(dadosLayout) {
    if (!empresa?.idEmpresa) {
      throw new Error('Cadastre a empresa antes de configurar o layout da cotacao.');
    }

    const payload = normalizarPayloadEmpresa({
      ...empresa,
      ...dadosLayout
    });

    await atualizarEmpresa(empresa.idEmpresa, payload);
    await carregarEmpresa();
    window.dispatchEvent(new CustomEvent('empresa-atualizada'));
    definirModalLayoutCotacaoAberto(false);
  }

  async function salvarColunasGridAtendimentos(dadosColunas) {
    if (!empresa?.idEmpresa) {
      throw new Error('Cadastre a empresa antes de configurar as colunas do grid.');
    }

    const payload = normalizarPayloadEmpresa({
      ...empresa,
      ...dadosColunas
    });

    await atualizarEmpresa(empresa.idEmpresa, payload);
    await carregarEmpresa();
    window.dispatchEvent(new CustomEvent('empresa-atualizada'));
    definirModalColunasGridAtendimentosAberto(false);
  }

  async function salvarColunasGridFornecedores(dadosColunas) {
    if (!empresa?.idEmpresa) {
      throw new Error('Cadastre a empresa antes de configurar as colunas do grid.');
    }

    const payload = normalizarPayloadEmpresa({
      ...empresa,
      ...dadosColunas
    });

    await atualizarEmpresa(empresa.idEmpresa, payload);
    await carregarEmpresa();
    window.dispatchEvent(new CustomEvent('empresa-atualizada'));
    definirModalColunasGridFornecedoresAberto(false);
  }

  async function salvarColunasGridCotacoes(dadosColunas) {
    if (!empresa?.idEmpresa) {
      throw new Error('Cadastre a empresa antes de configurar as colunas do grid.');
    }

    const payload = normalizarPayloadEmpresa({
      ...empresa,
      ...dadosColunas
    });

    await atualizarEmpresa(empresa.idEmpresa, payload);
    await carregarEmpresa();
    window.dispatchEvent(new CustomEvent('empresa-atualizada'));
    definirModalColunasGridCotacoesAberto(false);
  }

  async function salvarColunasGridProdutos(dadosColunas) {
    if (!empresa?.idEmpresa) {
      throw new Error('Cadastre a empresa antes de configurar as colunas do grid.');
    }

    const payload = normalizarPayloadEmpresa({
      ...empresa,
      ...dadosColunas
    });

    await atualizarEmpresa(empresa.idEmpresa, payload);
    await carregarEmpresa();
    window.dispatchEvent(new CustomEvent('empresa-atualizada'));
    definirModalColunasGridProdutosAberto(false);
  }

  async function salvarColunasGridOrdensCompra(dadosColunas) {
    if (!empresa?.idEmpresa) {
      throw new Error('Cadastre a empresa antes de configurar as colunas do grid.');
    }

    const payload = normalizarPayloadEmpresa({
      ...empresa,
      ...dadosColunas
    });

    await atualizarEmpresa(empresa.idEmpresa, payload);
    await carregarEmpresa();
    window.dispatchEvent(new CustomEvent('empresa-atualizada'));
    definirModalColunasGridOrdensCompraAberto(false);
  }

  async function salvarGraficosPaginaInicialCotacoes(graficos) {
    if (!empresa?.idEmpresa) {
      throw new Error('Cadastre a empresa antes de configurar os graficos da pagina inicial.');
    }

    const payload = normalizarPayloadEmpresa({
      ...empresa,
      graficosPaginaInicialCotacoes: graficos
    });

    await atualizarEmpresa(empresa.idEmpresa, payload);
    await carregarEmpresa();
    window.dispatchEvent(new CustomEvent('empresa-atualizada'));
    definirModalGraficosPaginaInicialAberto(null);
  }

  async function salvarGraficosPaginaInicialOrdensCompra(graficos) {
    if (!empresa?.idEmpresa) {
      throw new Error('Cadastre a empresa antes de configurar os graficos da pagina inicial.');
    }

    const payload = normalizarPayloadEmpresa({
      ...empresa,
      graficosPaginaInicialOrdensCompra: graficos
    });

    await atualizarEmpresa(empresa.idEmpresa, payload);
    await carregarEmpresa();
    window.dispatchEvent(new CustomEvent('empresa-atualizada'));
    definirModalGraficosPaginaInicialAberto(null);
  }

  async function salvarGraficosPaginaInicialAtendimentos(graficos) {
    if (!empresa?.idEmpresa) {
      throw new Error('Cadastre a empresa antes de configurar os graficos da pagina inicial.');
    }

    const payload = normalizarPayloadEmpresa({
      ...empresa,
      graficosPaginaInicialAtendimentos: graficos
    });

    await atualizarEmpresa(empresa.idEmpresa, payload);
    await carregarEmpresa();
    window.dispatchEvent(new CustomEvent('empresa-atualizada'));
    definirModalGraficosPaginaInicialAberto(null);
  }

  async function salvarCardsPaginaInicial(cards) {
    if (!empresa?.idEmpresa) {
      throw new Error('Cadastre a empresa antes de configurar os cards da pagina inicial.');
    }

    const payload = normalizarPayloadEmpresa({
      ...empresa,
      cardsPaginaInicial: cards
    });

    await atualizarEmpresa(empresa.idEmpresa, payload);
    await carregarEmpresa();
    window.dispatchEvent(new CustomEvent('empresa-atualizada'));
    definirModalGraficosPaginaInicialAberto(null);
  }

  async function carregarUsuarios() {
    const usuariosCarregados = await listarUsuarios({ incluirInativos: true });
    const compradoresPorId = new Map(
      compradores.map((comprador) => [comprador.idComprador, comprador.nome])
    );

    definirUsuarios(
      usuariosCarregados.map((usuario) => ({
        ...usuario,
        nomeComprador: compradoresPorId.get(usuario.idComprador) || ''
      }))
    );
  }

  async function carregarConfiguracaoAtualizacaoSistema() {
    try {
      const configuracao = await obterConfiguracaoAtualizacaoSistema();
      definirConfiguracaoAtualizacaoSistema(configuracao);
    } catch (_erro) {
      definirConfiguracaoAtualizacaoSistema(null);
    }
  }

  async function carregarCadastrosConfiguracao() {
    const resultados = await Promise.allSettled([
      listarGruposProdutoConfiguracao({ incluirInativos: true }),
      listarGruposEmpresaConfiguracao({ incluirInativos: true }),
      listarContatosGruposEmpresaConfiguracao({ incluirInativos: true }),
      listarMarcasConfiguracao({ incluirInativos: true }),
      listarRamosAtividadeConfiguracao({ incluirInativos: true }),
      listarConceitosFornecedorConfiguracao({ incluirInativos: true }),
      listarCompradoresConfiguracao({ incluirInativos: true }),
      listarUnidadesMedidaConfiguracao({ incluirInativos: true }),
      listarMetodosPagamentoConfiguracao({ incluirInativos: true }),
      listarPrazosPagamentoConfiguracao({ incluirInativos: true }),
      listarTiposOrdemCompraConfiguracao({ incluirInativos: true }),
      listarLocaisAgendaConfiguracao({ incluirInativos: true }),
      listarTiposRecursoConfiguracao({ incluirInativos: true }),
      listarRecursosConfiguracao({ incluirInativos: true }),
      listarTiposAgendaConfiguracao({ incluirInativos: true }),
      listarCanaisAtendimentoConfiguracao({ incluirInativos: true }),
      listarOrigensAtendimentoConfiguracao({ incluirInativos: true }),
      listarTiposAtendimentoConfiguracao({ incluirInativos: true }),
        listarStatusVisitaConfiguracao({ incluirInativos: true }),
        listarEtapasOrdemCompraConfiguracao({ incluirInativos: true }),
        listarEtapasCotacaoConfiguracao({ incluirInativos: true }),
        listarCamposCotacaoConfiguracao({ incluirInativos: true }),
        listarCamposOrdemCompraConfiguracao({ incluirInativos: true }),
        listarTamanhosConfiguracao({ incluirInativos: true })
      ]);

    definirGruposProduto(obterResultadoLista(resultados[0]));
    definirGruposEmpresa(obterResultadoLista(resultados[1]));
    definirContatosGruposEmpresa(obterResultadoLista(resultados[2]));
    definirMarcas(obterResultadoLista(resultados[3]));
    definirRamosAtividade(obterResultadoLista(resultados[4]));
    definirConceitosFornecedor(obterResultadoLista(resultados[5]));
    definirCompradores(obterResultadoLista(resultados[6]));
    definirUnidadesMedida(obterResultadoLista(resultados[7]));
    definirMetodosPagamento(obterResultadoLista(resultados[8]));
    definirPrazosPagamento(obterResultadoLista(resultados[9]));
    definirTiposOrdemCompra(obterResultadoLista(resultados[10]));
    definirLocaisAgenda(obterResultadoLista(resultados[11]));
    definirTiposRecurso(obterResultadoLista(resultados[12]));
    definirRecursos(obterResultadoLista(resultados[13]));
    definirTiposAgenda(ordenarRegistrosPorOrdem(obterResultadoLista(resultados[14]), 'idTipoAgenda'));
    definirCanaisAtendimento(obterResultadoLista(resultados[15]));
    definirOrigensAtendimento(obterResultadoLista(resultados[16]));
    definirTiposAtendimento(obterResultadoLista(resultados[17]));
    definirStatusVisita(ordenarRegistrosPorOrdem(obterResultadoLista(resultados[18]), 'idStatusVisita'));
    definirEtapasOrdemCompra(ordenarRegistrosPorOrdem(obterResultadoLista(resultados[19]), 'idEtapa'));
    definirEtapasCotacao(ordenarRegistrosPorOrdem(obterResultadoLista(resultados[20]), 'idEtapaCotacao'));
    definirCamposCotacao(obterResultadoLista(resultados[21]));
    definirCamposOrdemCompra(obterResultadoLista(resultados[22]));
    definirTamanhos(obterResultadoLista(resultados[23]));
  }

  async function salvarUsuario(dadosUsuario) {
    if (dadosUsuario.tipo === 'Usuario padrao' && dadosUsuario.idComprador) {
      const compradorAtivo = compradores.find(
        (comprador) => String(comprador.idComprador) === String(dadosUsuario.idComprador) && comprador.status
      );

      if (!compradorAtivo) {
        throw new Error('Selecione um comprador ativo para vincular ao usuario.');
      }
    }

    const payload = normalizarPayloadUsuario(dadosUsuario);
    let usuarioSalvo = null;

    if (dadosUsuario.idUsuario) {
      usuarioSalvo = await atualizarUsuario(dadosUsuario.idUsuario, payload);
    } else {
      usuarioSalvo = await incluirUsuario(payload);
    }

    await carregarUsuarios();

    if (String(usuarioSalvo?.idUsuario || '') === String(usuarioLogado?.idUsuario || '')) {
      window.dispatchEvent(new CustomEvent('usuario-logado-atualizado', {
        detail: {
          usuario: {
            ...usuarioLogado,
            ...usuarioSalvo
          }
        }
      }));
    }
  }

  async function inativarUsuario(usuario) {
    await atualizarUsuario(usuario.idUsuario, { ativo: 0 });
    await carregarUsuarios();
  }

  async function salvarGrupoProduto(dadosGrupo) {
    const payload = {
      descricao: dadosGrupo.descricao.trim(),
      status: dadosGrupo.status ? 1 : 0
    };

    let grupoSalvo = null;

    if (dadosGrupo.idGrupo) {
      grupoSalvo = await atualizarGrupoProduto(dadosGrupo.idGrupo, payload);
    } else {
      grupoSalvo = await incluirGrupoProduto(payload);
    }

    await carregarCadastrosConfiguracao();
    return grupoSalvo;
  }

  async function salvarGrupoEmpresa(dadosGrupo) {
    const payloadGrupo = {
      descricao: String(dadosGrupo.descricao || '').trim(),
      status: dadosGrupo.status ? 1 : 0
    };

    let grupoSalvo;

    if (dadosGrupo.idGrupoEmpresa) {
      grupoSalvo = await atualizarGrupoEmpresa(dadosGrupo.idGrupoEmpresa, payloadGrupo);
    } else {
      grupoSalvo = await incluirGrupoEmpresa(payloadGrupo);
    }

    const idGrupoEmpresa = grupoSalvo?.idGrupoEmpresa || dadosGrupo.idGrupoEmpresa;

    for (const contato of normalizarContatosGrupoEmpresa(dadosGrupo.contatos, idGrupoEmpresa)) {
      if (contato.idContatoGrupoEmpresa) {
        await atualizarContatoGrupoEmpresa(contato.idContatoGrupoEmpresa, contato);
      } else {
        await incluirContatoGrupoEmpresa(contato);
      }
    }

    await carregarCadastrosConfiguracao();
    window.dispatchEvent(new CustomEvent('grupo-empresa-atualizado'));
    return grupoSalvo;
  }

  async function salvarTamanho(dadosTamanho) {
    const payload = {
      descricao: dadosTamanho.descricao.trim(),
      status: dadosTamanho.status ? 1 : 0
    };

    if (dadosTamanho.idTamanho) {
      await atualizarTamanho(dadosTamanho.idTamanho, payload);
    } else {
      await incluirTamanho(payload);
    }

    await carregarCadastrosConfiguracao();
  }

  async function inativarTamanho(registro) {
    await atualizarTamanho(registro.idTamanho, { status: 0 });
    await carregarCadastrosConfiguracao();
  }

  async function salvarMarca(dadosMarca) {
    const payload = {
      descricao: dadosMarca.descricao.trim(),
      status: dadosMarca.status ? 1 : 0
    };

    if (dadosMarca.idMarca) {
      await atualizarMarca(dadosMarca.idMarca, payload);
    } else {
      await incluirMarca(payload);
    }

    await carregarCadastrosConfiguracao();
  }

  async function salvarRamoAtividade(dadosRamo) {
    const payload = {
      descricao: dadosRamo.descricao.trim(),
      status: dadosRamo.status ? 1 : 0
    };

    if (dadosRamo.idRamo) {
      await atualizarRamoAtividade(dadosRamo.idRamo, payload);
    } else {
      await incluirRamoAtividade(payload);
    }

    await carregarCadastrosConfiguracao();
  }

  async function salvarComprador(dadosComprador) {
    const payload = {
      nome: dadosComprador.nome.trim(),
      email: dadosComprador.email.trim(),
      status: dadosComprador.status ? 1 : 0
    };

    if (dadosComprador.idComprador) {
      await atualizarComprador(dadosComprador.idComprador, payload);
    } else {
      await incluirComprador(payload);
    }

    await carregarCadastrosConfiguracao();
  }

  async function salvarUnidadeMedida(dadosUnidade) {
    const payload = {
      descricao: dadosUnidade.descricao.trim(),
      status: dadosUnidade.status ? 1 : 0
    };

    if (dadosUnidade.idUnidade) {
      await atualizarUnidadeMedida(dadosUnidade.idUnidade, payload);
    } else {
      await incluirUnidadeMedida(payload);
    }

    await carregarCadastrosConfiguracao();
  }

  async function salvarMetodoPagamento(dadosMetodo) {
    const payload = {
      descricao: dadosMetodo.descricao.trim(),
      status: dadosMetodo.status ? 1 : 0
    };

    if (dadosMetodo.idMetodoPagamento) {
      await atualizarMetodoPagamento(dadosMetodo.idMetodoPagamento, payload);
    } else {
      await incluirMetodoPagamento(payload);
    }

    await carregarCadastrosConfiguracao();
  }

  async function salvarPrazoPagamento(dadosPrazo) {
    const payload = normalizarPayloadPrazoPagamento(dadosPrazo);

    if (dadosPrazo.idPrazoPagamento) {
      await atualizarPrazoPagamento(dadosPrazo.idPrazoPagamento, payload);
    } else {
      await incluirPrazoPagamento(payload);
    }

    await carregarCadastrosConfiguracao();
  }

  async function salvarTipoOrdemCompra(dadosTipoOrdemCompra) {
    const payload = {
      descricao: dadosTipoOrdemCompra.descricao.trim(),
      status: dadosTipoOrdemCompra.status ? 1 : 0
    };

    if (dadosTipoOrdemCompra.idTipoOrdemCompra) {
      await atualizarTipoOrdemCompra(dadosTipoOrdemCompra.idTipoOrdemCompra, payload);
    } else {
      await incluirTipoOrdemCompra(payload);
    }

    await carregarCadastrosConfiguracao();
  }

  async function salvarConceitoFornecedor(dadosConceito) {
    const payload = {
      descricao: String(dadosConceito.descricao || '').trim(),
      status: dadosConceito.status ? 1 : 0
    };

    if (dadosConceito.idConceito) {
      await atualizarConceitoFornecedor(dadosConceito.idConceito, payload);
    } else {
      await incluirConceitoFornecedor(payload);
    }

    await carregarCadastrosConfiguracao();
  }

  async function salvarLocalAgenda(dadosLocal) {
    const payload = {
      descricao: dadosLocal.descricao.trim(),
      status: dadosLocal.status ? 1 : 0
    };

    if (dadosLocal.idLocal) {
      await atualizarLocalAgenda(dadosLocal.idLocal, payload);
    } else {
      await incluirLocalAgenda(payload);
    }

    await carregarCadastrosConfiguracao();
  }

  async function salvarTipoRecurso(dadosTipoRecurso) {
    const payload = {
      descricao: dadosTipoRecurso.descricao.trim(),
      status: dadosTipoRecurso.status ? 1 : 0
    };

    if (dadosTipoRecurso.idTipoRecurso) {
      await atualizarTipoRecurso(dadosTipoRecurso.idTipoRecurso, payload);
    } else {
      await incluirTipoRecurso(payload);
    }

    await carregarCadastrosConfiguracao();
  }

  async function salvarRecurso(dadosRecurso) {
    const payload = {
      descricao: dadosRecurso.descricao.trim(),
      idTipoRecurso: Number(dadosRecurso.idTipoRecurso),
      status: dadosRecurso.status ? 1 : 0
    };

    if (dadosRecurso.idRecurso) {
      await atualizarRecurso(dadosRecurso.idRecurso, payload);
    } else {
      await incluirRecurso(payload);
    }

    await carregarCadastrosConfiguracao();
  }

  async function salvarTipoAgenda(dadosTipoAgenda) {
    const payload = {
      descricao: dadosTipoAgenda.descricao.trim(),
      cor: dadosTipoAgenda.cor.trim(),
      ordem: normalizarOrdemCadastro(dadosTipoAgenda.ordem),
      obrigarFornecedor: dadosTipoAgenda.obrigarFornecedor ? 1 : 0,
      obrigarLocal: dadosTipoAgenda.obrigarLocal ? 1 : 0,
      obrigarRecurso: dadosTipoAgenda.obrigarRecurso ? 1 : 0,
      status: dadosTipoAgenda.status ? 1 : 0
    };

    if (dadosTipoAgenda.idTipoAgenda) {
      await atualizarTipoAgenda(dadosTipoAgenda.idTipoAgenda, payload);
    } else {
      await incluirTipoAgenda(payload);
    }

    await carregarCadastrosConfiguracao();
  }

  async function salvarStatusVisita(dadosStatusVisita) {
    const payload = {
      descricao: dadosStatusVisita.descricao.trim(),
      icone: limparTextoOpcional(dadosStatusVisita.icone),
      ordem: normalizarOrdemCadastro(dadosStatusVisita.ordem),
      status: dadosStatusVisita.status ? 1 : 0
    };

    if (dadosStatusVisita.idStatusVisita) {
      await atualizarStatusVisita(dadosStatusVisita.idStatusVisita, payload);
    } else {
      await incluirStatusVisita(payload);
    }

    await carregarCadastrosConfiguracao();
  }

  async function salvarCanalAtendimento(dadosCanalAtendimento) {
    const payload = {
      descricao: dadosCanalAtendimento.descricao.trim(),
      status: dadosCanalAtendimento.status ? 1 : 0
    };

    if (dadosCanalAtendimento.idCanalAtendimento) {
      await atualizarCanalAtendimento(dadosCanalAtendimento.idCanalAtendimento, payload);
    } else {
      await incluirCanalAtendimento(payload);
    }

    await carregarCadastrosConfiguracao();
  }

  async function salvarOrigemAtendimento(dadosOrigemAtendimento) {
    const payload = {
      descricao: dadosOrigemAtendimento.descricao.trim(),
      status: dadosOrigemAtendimento.status ? 1 : 0
    };

    if (dadosOrigemAtendimento.idOrigemAtendimento) {
      await atualizarOrigemAtendimento(dadosOrigemAtendimento.idOrigemAtendimento, payload);
    } else {
      await incluirOrigemAtendimento(payload);
    }

    await carregarCadastrosConfiguracao();
  }

  async function salvarTipoAtendimento(dadosTipoAtendimento) {
    const payload = {
      descricao: dadosTipoAtendimento.descricao.trim(),
      status: dadosTipoAtendimento.status ? 1 : 0
    };

    if (dadosTipoAtendimento.idTipoAtendimento) {
      await atualizarTipoAtendimento(dadosTipoAtendimento.idTipoAtendimento, payload);
    } else {
      await incluirTipoAtendimento(payload);
    }

    await carregarCadastrosConfiguracao();
  }

  async function salvarEtapaOrdemCompra(dadosEtapa) {
    const payload = {
      descricao: dadosEtapa.descricao.trim(),
      cor: dadosEtapa.cor.trim(),
      ordem: normalizarOrdemCadastro(dadosEtapa.ordem),
      status: dadosEtapa.status ? 1 : 0
    };

    if (dadosEtapa.idEtapa) {
      await atualizarEtapaOrdemCompra(dadosEtapa.idEtapa, payload);
    } else {
      await incluirEtapaOrdemCompra(payload);
    }

    await carregarCadastrosConfiguracao();
  }

  async function salvarEtapaCotacao(dadosEtapa) {
    const payload = {
      descricao: dadosEtapa.descricao.trim(),
      cor: dadosEtapa.cor.trim(),
      ordem: normalizarOrdemCadastro(dadosEtapa.ordem),
      consideraFunilCotacoes: dadosEtapa.consideraFunilCotacoes ? 1 : 0,
      status: dadosEtapa.status ? 1 : 0
    };

    if (dadosEtapa.idEtapaCotacao) {
      await atualizarEtapaCotacao(dadosEtapa.idEtapaCotacao, payload);
    } else {
      await incluirEtapaCotacao(payload);
    }

    await carregarCadastrosConfiguracao();
  }

  async function salvarCampoCotacao(dadosCampo) {
    const payload = {
      titulo: dadosCampo.titulo.trim(),
      descricaoPadrao: limparTextoOpcional(dadosCampo.descricaoPadrao),
      status: dadosCampo.status ? 1 : 0
    };

    if (dadosCampo.idCampoCotacao) {
      await atualizarCampoCotacao(dadosCampo.idCampoCotacao, payload);
    } else {
      await incluirCampoCotacao(payload);
    }

    await carregarCadastrosConfiguracao();
  }

  async function salvarCampoOrdemCompra(dadosCampo) {
    const payload = {
      titulo: dadosCampo.titulo.trim(),
      descricaoPadrao: limparTextoOpcional(dadosCampo.descricaoPadrao),
      status: dadosCampo.status ? 1 : 0
    };

    if (dadosCampo.idCampoOrdemCompra) {
      await atualizarCampoOrdemCompra(dadosCampo.idCampoOrdemCompra, payload);
    } else {
      await incluirCampoOrdemCompra(payload);
    }

    await carregarCadastrosConfiguracao();
  }

  async function inativarGrupoProduto(registro) {
    await atualizarGrupoProduto(registro.idGrupo, { status: 0 });
    await carregarCadastrosConfiguracao();
  }

  async function inativarGrupoEmpresa(registro) {
    const contatosDoGrupo = contatosGruposEmpresa.filter(
      (contato) => String(contato.idGrupoEmpresa) === String(registro.idGrupoEmpresa)
    );

    for (const contato of contatosDoGrupo) {
      await atualizarContatoGrupoEmpresa(contato.idContatoGrupoEmpresa, {
        status: 0,
        principal: 0
      });
    }

    await atualizarGrupoEmpresa(registro.idGrupoEmpresa, { status: 0 });

    await carregarCadastrosConfiguracao();
    window.dispatchEvent(new CustomEvent('grupo-empresa-atualizado'));
  }

  async function inativarMarca(registro) {
    await atualizarMarca(registro.idMarca, { status: 0 });
    await carregarCadastrosConfiguracao();
  }

  async function inativarRamoAtividade(registro) {
    await atualizarRamoAtividade(registro.idRamo, { status: 0 });
    await carregarCadastrosConfiguracao();
  }

  async function inativarConceitoFornecedor(registro) {
    await atualizarConceitoFornecedor(registro.idConceito, { status: 0 });
    await carregarCadastrosConfiguracao();
  }

  async function inativarComprador(registro) {
    await atualizarComprador(registro.idComprador, { status: 0 });
    await carregarCadastrosConfiguracao();
  }

  async function inativarUnidadeMedida(registro) {
    await atualizarUnidadeMedida(registro.idUnidade, { status: 0 });
    await carregarCadastrosConfiguracao();
  }

  async function inativarMetodoPagamento(registro) {
    await atualizarMetodoPagamento(registro.idMetodoPagamento, { status: 0 });
    await carregarCadastrosConfiguracao();
  }

  async function inativarPrazoPagamento(registro) {
    await atualizarPrazoPagamento(registro.idPrazoPagamento, { status: 0 });
    await carregarCadastrosConfiguracao();
  }

  async function inativarTipoOrdemCompra(registro) {
    await atualizarTipoOrdemCompra(registro.idTipoOrdemCompra, { status: 0 });
    await carregarCadastrosConfiguracao();
  }

  async function inativarLocalAgenda(registro) {
    await atualizarLocalAgenda(registro.idLocal, { status: 0 });
    await carregarCadastrosConfiguracao();
  }

  async function inativarTipoRecurso(registro) {
    await atualizarTipoRecurso(registro.idTipoRecurso, { status: 0 });
    await carregarCadastrosConfiguracao();
  }

  async function inativarRecurso(registro) {
    await atualizarRecurso(registro.idRecurso, { status: 0 });
    await carregarCadastrosConfiguracao();
  }

  async function inativarTipoAgenda(registro) {
    await atualizarTipoAgenda(registro.idTipoAgenda, { status: 0 });
    await carregarCadastrosConfiguracao();
  }

  async function inativarStatusVisita(registro) {
    await atualizarStatusVisita(registro.idStatusVisita, { status: 0 });
    await carregarCadastrosConfiguracao();
  }

  async function inativarCanalAtendimento(registro) {
    await atualizarCanalAtendimento(registro.idCanalAtendimento, { status: 0 });
    await carregarCadastrosConfiguracao();
  }

  async function inativarOrigemAtendimento(registro) {
    await atualizarOrigemAtendimento(registro.idOrigemAtendimento, { status: 0 });
    await carregarCadastrosConfiguracao();
  }

  async function inativarTipoAtendimento(registro) {
    await atualizarTipoAtendimento(registro.idTipoAtendimento, { status: 0 });
    await carregarCadastrosConfiguracao();
  }

  async function inativarEtapaOrdemCompra(registro) {
    await atualizarEtapaOrdemCompra(registro.idEtapa, { status: 0 });
    await carregarCadastrosConfiguracao();
  }

  async function inativarEtapaCotacao(registro) {
    await atualizarEtapaCotacao(registro.idEtapaCotacao, { status: 0 });
    await carregarCadastrosConfiguracao();
  }

  async function inativarCampoCotacao(registro) {
    await atualizarCampoCotacao(registro.idCampoCotacao, { status: 0 });
    await carregarCadastrosConfiguracao();
  }

  async function salvarAtualizacaoSistema(dadosAtualizacao) {
    const configuracaoSalva = await salvarConfiguracaoAtualizacaoSistema({
      urlRepositorio: String(dadosAtualizacao.urlRepositorio || '').trim()
    });

    definirConfiguracaoAtualizacaoSistema(configuracaoSalva);
  }

  function abrirConfiguracao(atalho) {
    if (usuarioSomenteConsulta && ['empresa', 'usuarios', 'compradores', 'layoutCotacao', 'colunasGridAtendimentos'].includes(atalho.id)) {
      return;
    }

    if (atalho.id === 'empresa') {
      definirModoModalEmpresa(usuarioSomenteConsulta ? 'consulta' : 'edicao');
      definirModalEmpresaAberto(true);
      return;
    }

    if (atalho.id === 'layoutCotacao') {
      if (!empresa?.idEmpresa) {
        return;
      }

      definirModalLayoutCotacaoAberto(true);
      return;
    }

    if (atalho.id === 'colunasGridAtendimentos') {
      if (!empresa?.idEmpresa) {
        return;
      }

      definirModalSelecaoColunasGridAberto(true);
      return;
    }

    if (atalho.id === 'usuarios') {
      definirModalUsuariosAberto(true);
      return;
    }

    if (atalho.id === 'atualizacaoSistema') {
      if (usuarioSomenteConsulta) {
        return;
      }

      definirModalAtualizacaoSistemaAberto(true);
      return;
    }

    if ([
      'relatorioOrdensCompraFechados',
      'relatorioOrdensCompraEntregues',
      'relatorioAtendimentos'
    ].includes(atalho.id)) {
      if (usuarioSomenteConsulta) {
        return;
      }

      definirRelatorioConfiguracaoAberto(atalho.id);
      return;
    }

    if ([
      'gruposProduto',
      'gruposEmpresa',
      'etapasOrdemCompra',
      'etapasCotacao',
      'marcas',
      'metodosPagamento',
      'locaisAgenda',
      'cotacoes',
      'ordensCompra',
      'prazosPagamento',
      'tiposOrdemCompra',
      'recursos',
      'ramosAtividade',
      'conceitosFornecedor',
      'canaisAtendimento',
      'origensAtendimento',
      'tiposAtendimento',
      'statusVisita',
      'tiposAgenda',
      'tiposRecurso',
      'compradores',
      'unidadesMedida',
      'tamanhos'
    ].includes(atalho.id)) {
      definirCadastroConfiguracaoAberto(atalho.id);
    }
  }

  function fecharModalEmpresa() {
    definirModalEmpresaAberto(false);
    definirModoModalEmpresa('edicao');
  }

  function fecharModalUsuarios() {
    definirModalUsuariosAberto(false);
  }

  function fecharModalLayoutCotacao() {
    definirModalLayoutCotacaoAberto(false);
  }

  function fecharModalColunasGridAtendimentos() {
    definirModalColunasGridAtendimentosAberto(false);
  }

  function fecharModalColunasGridFornecedores() {
    definirModalColunasGridFornecedoresAberto(false);
  }

  function fecharModalColunasGridCotacoes() {
    definirModalColunasGridCotacoesAberto(false);
  }

  function fecharModalColunasGridProdutos() {
    definirModalColunasGridProdutosAberto(false);
  }

  function fecharModalColunasGridOrdensCompra() {
    definirModalColunasGridOrdensCompraAberto(false);
  }

  function fecharModalSelecaoColunasGrid() {
    definirModalSelecaoColunasGridAberto(false);
  }

  function selecionarModuloColunasGrid(idModulo) {
    if (idModulo === 'fornecedores') {
      definirModalSelecaoColunasGridAberto(false);
      definirModalColunasGridFornecedoresAberto(true);
      return;
    }

    if (idModulo === 'cotacoes') {
      definirModalSelecaoColunasGridAberto(false);
      definirModalColunasGridCotacoesAberto(true);
      return;
    }

    if (idModulo === 'produtos') {
      definirModalSelecaoColunasGridAberto(false);
      definirModalColunasGridProdutosAberto(true);
      return;
    }

    if (idModulo === 'ordensCompra') {
      definirModalSelecaoColunasGridAberto(false);
      definirModalColunasGridOrdensCompraAberto(true);
      return;
    }

    if (idModulo === 'atendimentos') {
      definirModalSelecaoColunasGridAberto(false);
      definirModalColunasGridAtendimentosAberto(true);
    }
  }

  function fecharModalAtualizacaoSistema() {
    definirModalAtualizacaoSistemaAberto(false);
  }

  function fecharRelatorioConfiguracao() {
    definirRelatorioConfiguracaoAberto(null);
  }

  function fecharCadastroConfiguracao() {
    definirCadastroConfiguracaoAberto(null);
  }

  function obterAtalhosSecao(secao) {
    return secao.atalhos
      .map((idAtalho) => atalhosConfiguracao.find((item) => item.id === idAtalho))
      .filter(Boolean);
  }

  return (
    <>
      <header className="cabecalhoPagina">
        <div>
          <h1>Configuracoes</h1>
          <p>Cadastros base e parametros para manter o SRM organizado.</p>
        </div>
      </header>

      <CorpoPagina>
        <div className="secoesConfiguracao">
          {secoesConfiguracao.map((secao) => {
            const atalhosSecao = obterAtalhosSecao(secao);

            return (
              <section key={secao.id} className="secaoConfiguracao" aria-label={secao.titulo}>
                <header className="cabecalhoSecaoConfiguracao">
                  <h2>{secao.titulo}</h2>
                </header>

                {atalhosSecao.length > 0 ? (
                  <div className="gradeConfiguracoes">
                    {atalhosSecao.map((atalho) => (
                      <button
                        key={atalho.id}
                        type="button"
                        className="cartaoConfiguracao"
                        title={atalho.titulo}
                        disabled={
                          (usuarioSomenteConsulta && [
                            'empresa',
                            'usuarios',
                            'compradores',
                            'layoutCotacao',
                            'colunasGridAtendimentos',
                            'atualizacaoSistema',
                            'relatorioOrdensCompraFechados',
                            'relatorioOrdensCompraEntregues',
                            'relatorioAtendimentos'
                          ].includes(atalho.id))
                          || (['layoutCotacao', 'colunasGridAtendimentos'].includes(atalho.id) && !empresa?.idEmpresa)
                        }
                        onClick={() => abrirConfiguracao(atalho)}
                      >
                        <span className="iconeCartaoConfiguracao" aria-hidden="true">
                          <span className="circuloIconeConfiguracao">
                            <Icone nome={atalho.icone} />
                          </span>
                        </span>

                        <span className="conteudoCartaoConfiguracao">
                          <strong>{atalho.titulo}</strong>
                        </span>
                      </button>
                    ))}
                  </div>
                ) : secao.id === 'paginaInicial' ? (
                  <>
                    <div className="gradeConfiguracoes">
                      <button
                        type="button"
                        className="cartaoConfiguracao"
                        disabled={usuarioSomenteConsulta || !empresa?.idEmpresa}
                        onClick={() => definirModalGraficosPaginaInicialAberto('cards')}
                      >
                        <span className="iconeCartaoConfiguracao" aria-hidden="true">
                          <span className="circuloIconeConfiguracao">
                            <Icone nome="inicio" />
                          </span>
                        </span>
                        <span className="conteudoCartaoConfiguracao">
                          <strong>Cards resumo</strong>
                        </span>
                      </button>

                      <button
                        type="button"
                        className="cartaoConfiguracao"
                        disabled={usuarioSomenteConsulta || !empresa?.idEmpresa}
                        onClick={() => definirModalGraficosPaginaInicialAberto('cotacoes')}
                      >
                        <span className="iconeCartaoConfiguracao" aria-hidden="true">
                          <span className="circuloIconeConfiguracao">
                            <Icone nome="cotacao" />
                          </span>
                        </span>
                        <span className="conteudoCartaoConfiguracao">
                          <strong>Graficos Cotacoes</strong>
                        </span>
                      </button>

                      <button
                        type="button"
                        className="cartaoConfiguracao"
                        disabled={usuarioSomenteConsulta || !empresa?.idEmpresa}
                        onClick={() => definirModalGraficosPaginaInicialAberto('ordensCompra')}
                      >
                        <span className="iconeCartaoConfiguracao" aria-hidden="true">
                          <span className="circuloIconeConfiguracao">
                            <Icone nome="ordemCompra" />
                          </span>
                        </span>
                        <span className="conteudoCartaoConfiguracao">
                          <strong>Graficos Ordens de compra</strong>
                        </span>
                      </button>

                      <button
                        type="button"
                        className="cartaoConfiguracao"
                        disabled={usuarioSomenteConsulta || !empresa?.idEmpresa}
                        onClick={() => definirModalGraficosPaginaInicialAberto('atendimentos')}
                      >
                        <span className="iconeCartaoConfiguracao" aria-hidden="true">
                          <span className="circuloIconeConfiguracao">
                            <Icone nome="atendimentos" />
                          </span>
                        </span>
                        <span className="conteudoCartaoConfiguracao">
                          <strong>Graficos Atendimentos</strong>
                        </span>
                      </button>
                    </div>
                    {!empresa?.idEmpresa ? (
                      <p className="descricaoOpcaoEmpresaPaginaInicial">
                        Salve a empresa primeiro para liberar a configuracao da pagina inicial.
                      </p>
                    ) : null}
                  </>
                ) : (
                  <div className="secaoConfiguracaoVazia">
                    Nenhum item configurado nesta secao por enquanto.
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </CorpoPagina>

      <ModalEmpresa
        aberto={modalEmpresaAberto}
        empresa={empresa}
        etapasCotacao={etapasCotacao}
        modo={modoModalEmpresa}
        aoFechar={fecharModalEmpresa}
        aoSalvar={salvarEmpresa}
      />
      <ModalGraficosPaginaInicial
        aberto={modalGraficosPaginaInicialAberto === 'cards'}
        titulo="Cards resumo"
        empresa={empresa}
        configuracoesAtuais={empresa?.cardsPaginaInicial}
        normalizarConfiguracoes={normalizarConfiguracoesCardsPaginaInicial}
        reordenarConfiguracoes={reordenarConfiguracoesCardsPaginaInicial}
        reposicionarConfiguracao={reposicionarConfiguracaoCardsPaginaInicial}
        totalColunas={TOTAL_COLUNAS_CARDS_PAGINA_INICIAL}
        limiteTotalColunas={TOTAL_COLUNAS_MAXIMO_CARDS_PAGINA_INICIAL}
        maxLinhas={2}
        permitirOrdenacao
        somenteConsulta={usuarioSomenteConsulta}
        camadaSecundaria={modalEmpresaAberto}
        aoFechar={() => definirModalGraficosPaginaInicialAberto(null)}
        aoSalvar={salvarCardsPaginaInicial}
      />
      <ModalGraficosPaginaInicial
        aberto={modalGraficosPaginaInicialAberto === 'cotacoes'}
        titulo="Graficos Cotacoes"
        empresa={empresa}
        configuracoesAtuais={empresa?.graficosPaginaInicialCotacoes}
        normalizarConfiguracoes={normalizarConfiguracoesGraficosPaginaInicialCotacoes}
        reordenarConfiguracoes={reordenarConfiguracoesGraficosPaginaInicialCotacoes}
        reposicionarConfiguracao={reposicionarConfiguracaoGraficosPaginaInicialCotacoes}
        totalColunas={TOTAL_COLUNAS_GRAFICOS_PAGINA_INICIAL}
        somenteConsulta={usuarioSomenteConsulta}
        camadaSecundaria={modalEmpresaAberto}
        aoFechar={() => definirModalGraficosPaginaInicialAberto(null)}
        aoSalvar={salvarGraficosPaginaInicialCotacoes}
      />
      <ModalGraficosPaginaInicial
        aberto={modalGraficosPaginaInicialAberto === 'ordensCompra'}
        titulo="Graficos Ordens de compra"
        empresa={empresa}
        configuracoesAtuais={empresa?.graficosPaginaInicialOrdensCompra}
        normalizarConfiguracoes={normalizarConfiguracoesGraficosPaginaInicialOrdensCompra}
        reordenarConfiguracoes={reordenarConfiguracoesGraficosPaginaInicialOrdensCompra}
        reposicionarConfiguracao={reposicionarConfiguracaoGraficosPaginaInicialOrdensCompra}
        totalColunas={TOTAL_COLUNAS_GRAFICOS_PAGINA_INICIAL}
        somenteConsulta={usuarioSomenteConsulta}
        camadaSecundaria={modalEmpresaAberto}
        aoFechar={() => definirModalGraficosPaginaInicialAberto(null)}
        aoSalvar={salvarGraficosPaginaInicialOrdensCompra}
      />
      <ModalGraficosPaginaInicial
        aberto={modalGraficosPaginaInicialAberto === 'atendimentos'}
        titulo="Graficos Atendimentos"
        empresa={empresa}
        configuracoesAtuais={empresa?.graficosPaginaInicialAtendimentos}
        normalizarConfiguracoes={normalizarConfiguracoesGraficosPaginaInicialAtendimentos}
        reordenarConfiguracoes={reordenarConfiguracoesGraficosPaginaInicialAtendimentos}
        reposicionarConfiguracao={reposicionarConfiguracaoGraficosPaginaInicialAtendimentos}
        totalColunas={TOTAL_COLUNAS_GRAFICOS_PAGINA_INICIAL}
        somenteConsulta={usuarioSomenteConsulta}
        camadaSecundaria={modalEmpresaAberto}
        aoFechar={() => definirModalGraficosPaginaInicialAberto(null)}
        aoSalvar={salvarGraficosPaginaInicialAtendimentos}
      />
      <ModalLayoutCotacao
        aberto={modalLayoutCotacaoAberto}
        empresa={empresa}
        somenteConsulta={usuarioSomenteConsulta}
        aoFechar={fecharModalLayoutCotacao}
        aoSalvar={salvarLayoutCotacao}
      />
      <ModalSelecaoColunasGrid
        aberto={modalSelecaoColunasGridAberto}
        aoFechar={fecharModalSelecaoColunasGrid}
        aoSelecionar={selecionarModuloColunasGrid}
      />
      <ModalColunasGridFornecedores
        aberto={modalColunasGridFornecedoresAberto}
        empresa={empresa}
        somenteConsulta={usuarioSomenteConsulta}
        aoFechar={fecharModalColunasGridFornecedores}
        aoSalvar={salvarColunasGridFornecedores}
      />
      <ModalColunasGridCotacoes
        aberto={modalColunasGridCotacoesAberto}
        empresa={empresa}
        somenteConsulta={usuarioSomenteConsulta}
        aoFechar={fecharModalColunasGridCotacoes}
        aoSalvar={salvarColunasGridCotacoes}
      />
      <ModalColunasGridProdutos
        aberto={modalColunasGridProdutosAberto}
        empresa={empresa}
        somenteConsulta={usuarioSomenteConsulta}
        aoFechar={fecharModalColunasGridProdutos}
        aoSalvar={salvarColunasGridProdutos}
      />
      <ModalColunasGridOrdensCompra
        aberto={modalColunasGridOrdensCompraAberto}
        empresa={empresa}
        somenteConsulta={usuarioSomenteConsulta}
        aoFechar={fecharModalColunasGridOrdensCompra}
        aoSalvar={salvarColunasGridOrdensCompra}
      />
      <ModalColunasGridAtendimentos
        aberto={modalColunasGridAtendimentosAberto}
        empresa={empresa}
        somenteConsulta={usuarioSomenteConsulta}
        aoFechar={fecharModalColunasGridAtendimentos}
        aoSalvar={salvarColunasGridAtendimentos}
      />
      <ModalUsuarios
        aberto={modalUsuariosAberto}
        usuarios={usuarios}
        compradores={compradores}
        somenteConsulta={usuarioSomenteConsulta}
        aoFechar={fecharModalUsuarios}
        aoSalvar={salvarUsuario}
        aoInativar={inativarUsuario}
      />
      <ModalAtualizacaoSistema
        aberto={modalAtualizacaoSistemaAberto}
        configuracao={configuracaoAtualizacaoSistema}
        aoFechar={fecharModalAtualizacaoSistema}
        aoSalvar={salvarAtualizacaoSistema}
      />
      <ModalRelatorioConfiguracao
        relatorio={relatorioConfiguracaoAberto}
        usuarioLogado={usuarioLogado}
        aoFechar={fecharRelatorioConfiguracao}
      />
      <ModalManualConfiguracoes
        aberto={modalManualAberto}
        aoFechar={() => definirModalManualAberto(false)}
        totalAtalhos={atalhosConfiguracao.length}
        secoes={secoesConfiguracao}
        usuarios={usuarios}
        compradores={compradores}
        gruposEmpresa={gruposEmpresa}
        usuarioLogado={usuarioLogado}
      />
        <ModalGruposProduto
          aberto={cadastroConfiguracaoAberto === 'gruposProduto'}
          registros={gruposProduto}
          somenteConsulta={usuarioSomenteConsulta}
          aoFechar={fecharCadastroConfiguracao}
          aoSalvar={salvarGrupoProduto}
          aoInativar={inativarGrupoProduto}
        />
      <ModalGruposEmpresa
        aberto={cadastroConfiguracaoAberto === 'gruposEmpresa'}
        registros={gruposEmpresa}
        contatosGruposEmpresa={contatosGruposEmpresa}
        somenteConsulta={false}
        aoFechar={fecharCadastroConfiguracao}
        aoSalvar={salvarGrupoEmpresa}
        aoInativar={inativarGrupoEmpresa}
      />
      <ModalCadastroConfiguracao
        aberto={cadastroConfiguracaoAberto === 'tamanhos'}
        titulo="Tamanhos"
        rotuloIncluir="Incluir tamanho"
        registros={tamanhos}
        chavePrimaria="idTamanho"
        somenteConsulta={usuarioSomenteConsulta}
        colunas={[
          { key: 'descricao', label: 'Tamanho' }
        ]}
        camposFormulario={[
          { name: 'descricao', label: 'Tamanho', required: true },
          { name: 'status', label: 'Registro ativo', type: 'checkbox', defaultValue: true }
        ]}
        aoFechar={fecharCadastroConfiguracao}
        aoSalvar={salvarTamanho}
        aoInativar={inativarTamanho}
      />
      <ModalMarcas
        aberto={cadastroConfiguracaoAberto === 'marcas'}
        registros={marcas}
        somenteConsulta={usuarioSomenteConsulta}
        aoFechar={fecharCadastroConfiguracao}
        aoSalvar={salvarMarca}
        aoInativar={inativarMarca}
      />
      <ModalRamosAtividade
        aberto={cadastroConfiguracaoAberto === 'ramosAtividade'}
        registros={ramosAtividade}
        somenteConsulta={false}
        aoFechar={fecharCadastroConfiguracao}
        aoSalvar={salvarRamoAtividade}
        aoInativar={inativarRamoAtividade}
      />
      <ModalCadastroConfiguracao
        aberto={cadastroConfiguracaoAberto === 'conceitosFornecedor'}
        titulo="Conceitos de fornecedor"
        rotuloIncluir="Incluir conceito"
        registros={conceitosFornecedor}
        chavePrimaria="idConceito"
        somenteConsulta={usuarioSomenteConsulta}
        colunas={[
          { key: 'descricao', label: 'Descricao' }
        ]}
        camposFormulario={[
          { name: 'descricao', label: 'Descricao', required: true, preservarDigitacao: true },
          {
            name: 'status',
            label: 'Registro ativo',
            type: 'checkbox',
            defaultValue: true,
            disabled: ({ registroSelecionado }) => conceitoFornecedorEhObrigatorio(registroSelecionado)
          }
        ]}
        aoFechar={fecharCadastroConfiguracao}
        aoSalvar={salvarConceitoFornecedor}
        aoInativar={inativarConceitoFornecedor}
        podeInativarRegistro={(registro) => !conceitoFornecedorEhObrigatorio(registro)}
      />
      <ModalCadastroConfiguracao
        aberto={cadastroConfiguracaoAberto === 'compradores'}
        titulo="Compradores"
        rotuloIncluir="Incluir comprador"
        registros={compradores}
        chavePrimaria="idComprador"
        exibirConsulta={false}
        somenteConsulta={usuarioSomenteConsulta}
        colunas={[
          { key: 'nome', label: 'Nome' },
          { key: 'email', label: 'E-mail' }
        ]}
        camposFormulario={[
          { name: 'nome', label: 'Nome', required: true },
          { name: 'email', label: 'E-mail', type: 'email', required: true },
          { name: 'status', label: 'Registro ativo', type: 'checkbox', defaultValue: true }
        ]}
        aoFechar={fecharCadastroConfiguracao}
        aoSalvar={salvarComprador}
        aoInativar={inativarComprador}
      />
      <ModalUnidadesMedida
        aberto={cadastroConfiguracaoAberto === 'unidadesMedida'}
        registros={unidadesMedida}
        somenteConsulta={usuarioSomenteConsulta}
        aoFechar={fecharCadastroConfiguracao}
        aoSalvar={salvarUnidadeMedida}
        aoInativar={inativarUnidadeMedida}
      />
      <ModalCadastroConfiguracao
        aberto={cadastroConfiguracaoAberto === 'metodosPagamento'}
        titulo="Metodos de pagamento"
        rotuloIncluir="Incluir metodo"
        registros={metodosPagamento}
        chavePrimaria="idMetodoPagamento"
        somenteConsulta={usuarioSomenteConsulta}
        colunas={[
          { key: 'descricao', label: 'Descricao' }
        ]}
        camposFormulario={[
          { name: 'descricao', label: 'Descricao', required: true },
          { name: 'status', label: 'Registro ativo', type: 'checkbox', defaultValue: true }
        ]}
        aoFechar={fecharCadastroConfiguracao}
        aoSalvar={salvarMetodoPagamento}
        aoInativar={inativarMetodoPagamento}
      />
      <ModalPrazosPagamento
        aberto={cadastroConfiguracaoAberto === 'prazosPagamento'}
        prazosPagamento={enriquecerPrazosPagamento(prazosPagamento, metodosPagamento)}
        metodosPagamento={metodosPagamento}
        somenteConsulta={usuarioSomenteConsulta}
        aoFechar={fecharCadastroConfiguracao}
        aoSalvar={salvarPrazoPagamento}
        aoInativar={inativarPrazoPagamento}
      />
      <ModalCadastroConfiguracao
        aberto={cadastroConfiguracaoAberto === 'tiposOrdemCompra'}
        titulo="Tipos de ordem de compra"
        rotuloIncluir="Incluir tipo"
        registros={tiposOrdemCompra}
        chavePrimaria="idTipoOrdemCompra"
        somenteConsulta={usuarioSomenteConsulta}
        colunas={[
          { key: 'descricao', label: 'Descricao' }
        ]}
        camposFormulario={[
          { name: 'descricao', label: 'Descricao', required: true },
          {
            name: 'status',
            label: 'Registro ativo',
            type: 'checkbox',
            defaultValue: true,
            disabled: ({ registroSelecionado }) => tipoOrdemCompraEhObrigatorio(registroSelecionado)
          }
        ]}
        aoFechar={fecharCadastroConfiguracao}
        aoSalvar={salvarTipoOrdemCompra}
        aoInativar={inativarTipoOrdemCompra}
        podeInativarRegistro={(registro) => !tipoOrdemCompraEhObrigatorio(registro)}
      />
      <ModalCadastroConfiguracao
        aberto={cadastroConfiguracaoAberto === 'locaisAgenda'}
        titulo="Locais da agenda"
        rotuloIncluir="Incluir local"
        registros={locaisAgenda}
        chavePrimaria="idLocal"
        somenteConsulta={usuarioSomenteConsulta}
        colunas={[
          { key: 'descricao', label: 'Descricao' }
        ]}
        camposFormulario={[
          { name: 'descricao', label: 'Descricao', required: true },
          { name: 'status', label: 'Registro ativo', type: 'checkbox', defaultValue: true }
        ]}
        aoFechar={fecharCadastroConfiguracao}
        aoSalvar={salvarLocalAgenda}
        aoInativar={inativarLocalAgenda}
      />
      <ModalCadastroConfiguracao
        aberto={cadastroConfiguracaoAberto === 'tiposRecurso'}
        titulo="Tipos de recurso"
        rotuloIncluir="Incluir tipo"
        registros={tiposRecurso}
        chavePrimaria="idTipoRecurso"
        somenteConsulta={usuarioSomenteConsulta}
        colunas={[
          { key: 'descricao', label: 'Descricao' }
        ]}
        camposFormulario={[
          { name: 'descricao', label: 'Descricao', required: true },
          { name: 'status', label: 'Registro ativo', type: 'checkbox', defaultValue: true }
        ]}
        aoFechar={fecharCadastroConfiguracao}
        aoSalvar={salvarTipoRecurso}
        aoInativar={inativarTipoRecurso}
      />
      <ModalCadastroConfiguracao
        aberto={cadastroConfiguracaoAberto === 'recursos'}
        titulo="Recursos"
        rotuloIncluir="Incluir recurso"
        registros={enriquecerRecursos(recursos, tiposRecurso)}
        chavePrimaria="idRecurso"
        classeTabela="tabelaRecursosConfiguracao"
        somenteConsulta={usuarioSomenteConsulta}
        colunas={[
          { key: 'descricao', label: 'Descricao' },
          { key: 'nomeTipoRecurso', label: 'Tipo' }
        ]}
        camposFormulario={[
          { name: 'descricao', label: 'Descricao', required: true },
          {
            name: 'idTipoRecurso',
            label: 'Tipo de recurso',
            type: 'select',
            required: true,
            options: tiposRecurso.map((tipoRecurso) => ({
              valor: tipoRecurso.idTipoRecurso,
              label: tipoRecurso.descricao
            }))
          },
          { name: 'status', label: 'Registro ativo', type: 'checkbox', defaultValue: true }
        ]}
        aoFechar={fecharCadastroConfiguracao}
        aoSalvar={salvarRecurso}
        aoInativar={inativarRecurso}
      />
      <ModalCadastroConfiguracao
        aberto={cadastroConfiguracaoAberto === 'tiposAgenda'}
        titulo="Tipos de agenda"
        rotuloIncluir="Incluir tipo"
        registros={tiposAgenda}
        chavePrimaria="idTipoAgenda"
        classeTabela="tabelaEtapasOrdemCompra"
        classeFormulario="gradeFormularioTiposAgenda"
        somenteConsulta={usuarioSomenteConsulta}
        colunas={[
          { key: 'ordem', label: 'Ordem' },
          { key: 'descricao', label: 'Descricao' },
          { key: 'cor', label: 'Cor', render: renderizarCorConfiguracao },
          { key: 'obrigatorios', label: 'Obrigatorios', render: renderizarObrigatoriosTipoAgenda }
        ]}
        camposFormulario={[
          { name: 'ordem', label: 'Ordem', type: 'number', required: true, defaultValue: 1, min: 1, max: 999, step: 1, inputMode: 'numeric' },
          { name: 'descricao', label: 'Descricao', required: true },
          { name: 'cor', label: 'Cor', type: 'color', required: true, defaultValue: '#9506F4' },
          { name: 'obrigarFornecedor', label: 'Exigir fornecedor', type: 'checkbox', defaultValue: false },
          { name: 'obrigarLocal', label: 'Exigir local', type: 'checkbox', defaultValue: false },
          { name: 'obrigarRecurso', label: 'Exigir recurso', type: 'checkbox', defaultValue: false },
          { name: 'status', label: 'Registro ativo', type: 'checkbox', defaultValue: true }
        ]}
        aoFechar={fecharCadastroConfiguracao}
        aoSalvar={salvarTipoAgenda}
        aoInativar={inativarTipoAgenda}
      />
      <ModalCadastroConfiguracao
        aberto={cadastroConfiguracaoAberto === 'canaisAtendimento'}
        titulo="Canais de atendimento"
        rotuloIncluir="Incluir canal"
        registros={canaisAtendimento}
        chavePrimaria="idCanalAtendimento"
        somenteConsulta={usuarioSomenteConsulta}
        colunas={[
          { key: 'descricao', label: 'Descricao' }
        ]}
        camposFormulario={[
          { name: 'descricao', label: 'Descricao', required: true },
          { name: 'status', label: 'Registro ativo', type: 'checkbox', defaultValue: true }
        ]}
        aoFechar={fecharCadastroConfiguracao}
        aoSalvar={salvarCanalAtendimento}
        aoInativar={inativarCanalAtendimento}
      />
      <ModalCadastroConfiguracao
        aberto={cadastroConfiguracaoAberto === 'origensAtendimento'}
        titulo="Origens de atendimento"
        rotuloIncluir="Incluir origem"
        registros={origensAtendimento}
        chavePrimaria="idOrigemAtendimento"
        somenteConsulta={usuarioSomenteConsulta}
        colunas={[
          { key: 'descricao', label: 'Descricao' }
        ]}
        camposFormulario={[
          { name: 'descricao', label: 'Descricao', required: true },
          { name: 'status', label: 'Registro ativo', type: 'checkbox', defaultValue: true }
        ]}
        aoFechar={fecharCadastroConfiguracao}
        aoSalvar={salvarOrigemAtendimento}
        aoInativar={inativarOrigemAtendimento}
      />
      <ModalCadastroConfiguracao
        aberto={cadastroConfiguracaoAberto === 'tiposAtendimento'}
        titulo="Tipos de atendimento"
        rotuloIncluir="Incluir tipo"
        registros={tiposAtendimento}
        chavePrimaria="idTipoAtendimento"
        somenteConsulta={usuarioSomenteConsulta}
        colunas={[
          { key: 'descricao', label: 'Descricao' }
        ]}
        camposFormulario={[
          { name: 'descricao', label: 'Descricao', required: true },
          { name: 'status', label: 'Registro ativo', type: 'checkbox', defaultValue: true }
        ]}
        aoFechar={fecharCadastroConfiguracao}
        aoSalvar={salvarTipoAtendimento}
        aoInativar={inativarTipoAtendimento}
      />
      <ModalCadastroConfiguracao
        aberto={cadastroConfiguracaoAberto === 'statusVisita'}
        titulo="Status da visita"
        rotuloIncluir="Incluir status"
        registros={statusVisita}
        chavePrimaria="idStatusVisita"
        classeTabela="tabelaStatusVisitaConfiguracao"
        classeFormulario="gradeFormularioStatusVisita"
        somenteConsulta={usuarioSomenteConsulta}
        colunas={[
          { key: 'ordem', label: 'Ordem' },
          { key: 'icone', label: 'Icone' },
          { key: 'descricao', label: 'Descricao' }
        ]}
        camposFormulario={[
          { name: 'ordem', label: 'Ordem', type: 'number', required: true, defaultValue: 1, min: 1, max: 999, step: 1, inputMode: 'numeric' },
          { name: 'icone', label: 'Icone', required: false },
          { name: 'descricao', label: 'Descricao', required: true },
          { name: 'status', label: 'Registro ativo', type: 'checkbox', defaultValue: true }
        ]}
        aoFechar={fecharCadastroConfiguracao}
        aoSalvar={salvarStatusVisita}
        aoInativar={inativarStatusVisita}
        podeInativarRegistro={(registro) => !statusVisitaEhCritico(registro)}
      />
      <ModalCadastroConfiguracao
        aberto={cadastroConfiguracaoAberto === 'etapasOrdemCompra'}
        titulo="Etapas da ordem de compra"
        rotuloIncluir="Incluir etapa"
        registros={etapasOrdemCompra}
        chavePrimaria="idEtapa"
        classeTabela="tabelaEtapasOrdemCompra"
        classeFormulario="gradeFormularioEtapasOrdemCompraLinha"
        somenteConsulta={usuarioSomenteConsulta}
        colunas={[
          { key: 'ordem', label: 'Ordem' },
          { key: 'descricao', label: 'Descricao' },
          { key: 'cor', label: 'Cor', render: renderizarCorConfiguracao }
        ]}
        camposFormulario={[
          { name: 'ordem', label: 'Ordem', type: 'number', required: true, defaultValue: 1, min: 1, max: 999, step: 1, inputMode: 'numeric' },
          { name: 'descricao', label: 'Descricao', required: true },
          { name: 'cor', label: 'Cor', type: 'color', required: true, defaultValue: '#9506F4' },
          {
            name: 'status',
            label: 'Registro ativo',
            type: 'checkbox',
            defaultValue: true,
            disabled: ({ registroSelecionado }) => etapaOrdemCompraEhObrigatoria(registroSelecionado)
          }
        ]}
        aoFechar={fecharCadastroConfiguracao}
        aoSalvar={salvarEtapaOrdemCompra}
        aoInativar={inativarEtapaOrdemCompra}
        podeInativarRegistro={(registro) => !etapaOrdemCompraEhObrigatoria(registro)}
      />
      <ModalCadastroConfiguracao
        aberto={cadastroConfiguracaoAberto === 'etapasCotacao'}
        titulo="Etapas da cotacao"
        rotuloIncluir="Incluir etapa"
        registros={etapasCotacao}
        chavePrimaria="idEtapaCotacao"
        classeModal="modalFornecedorEtapasCotacaoAmplo"
        classeTabela="tabelaEtapasCotacaoConfiguracao"
        classeFormulario="gradeFormularioEtapasCotacaoLinha"
        classeModalFormulario="modalContatoEtapasCotacaoLinha"
        agruparCheckboxes
        classeGrupoCheckboxes="grupoCheckboxesEtapasCotacao"
        somenteConsulta={usuarioSomenteConsulta}
        colunas={[
          { key: 'ordem', label: 'Ordem' },
          { key: 'descricao', label: 'Descricao' },
          { key: 'cor', label: 'Cor', render: renderizarCorConfiguracao },
          {
            key: 'consideraFunilCotacoes',
            label: 'Funil de ordens de compra',
            render: (registro) => registro.consideraFunilCotacoes ? 'Considera' : 'Nao considera'
          }
        ]}
        camposFormulario={[
          { name: 'ordem', label: 'Ordem', type: 'number', required: true, defaultValue: 1, min: 1, max: 999, step: 1, inputMode: 'numeric' },
          { name: 'descricao', label: 'Descricao', required: true },
          { name: 'cor', label: 'Cor', type: 'color', required: true, defaultValue: '#9506F4' },
          { name: 'consideraFunilCotacoes', label: 'Considera no Funil de Cotacoes', type: 'checkbox', defaultValue: true },
          { name: 'status', label: 'Registro ativo', type: 'checkbox', defaultValue: true }
        ]}
        aoFechar={fecharCadastroConfiguracao}
        aoSalvar={salvarEtapaCotacao}
        aoInativar={inativarEtapaCotacao}
        podeInativarRegistro={(registro) => !etapaCotacaoEhObrigatoria(registro)}
      />
      <ModalCadastroConfiguracao
        aberto={cadastroConfiguracaoAberto === 'cotacoes'}
        titulo="Campos da cotacao"
        rotuloIncluir="Incluir campo"
        registros={camposCotacao}
        chavePrimaria="idCampoCotacao"
        somenteConsulta={usuarioSomenteConsulta}
        colunas={[
          { key: 'titulo', label: 'Titulo' }
        ]}
        camposFormulario={[
          { name: 'titulo', label: 'Titulo', required: true },
          { name: 'descricaoPadrao', label: 'Descricao padrao', type: 'textarea', required: false },
          { name: 'status', label: 'Registro ativo', type: 'checkbox', defaultValue: true }
        ]}
        aoFechar={fecharCadastroConfiguracao}
        aoSalvar={salvarCampoCotacao}
        aoInativar={inativarCampoCotacao}
      />
      <ModalCadastroConfiguracao
        aberto={cadastroConfiguracaoAberto === 'ordensCompra'}
        titulo="Campos da ordem de compra"
        rotuloIncluir="Incluir campo"
        registros={camposOrdemCompra}
        chavePrimaria="idCampoOrdemCompra"
        somenteConsulta={usuarioSomenteConsulta}
        colunas={[
          { key: 'titulo', label: 'Titulo' }
        ]}
        camposFormulario={[
          { name: 'titulo', label: 'Titulo', required: true },
          { name: 'descricaoPadrao', label: 'Descricao padrao', type: 'textarea', required: false },
          { name: 'status', label: 'Registro ativo', type: 'checkbox', defaultValue: true }
        ]}
        aoFechar={fecharCadastroConfiguracao}
        aoSalvar={salvarCampoOrdemCompra}
        aoInativar={async (registro) => {
          await atualizarCampoOrdemCompra(registro.idCampoOrdemCompra, { status: 0 });
          await carregarCadastrosConfiguracao();
        }}
      />
    </>
  );
}

function normalizarPayloadEmpresa(dadosEmpresa) {
  return {
    razaoSocial: dadosEmpresa.razaoSocial.trim(),
    nomeFantasia: dadosEmpresa.nomeFantasia.trim(),
    slogan: limparTextoOpcional(dadosEmpresa.slogan),
    tipo: dadosEmpresa.tipo.trim(),
    cnpj: dadosEmpresa.cnpj.trim(),
    inscricaoEstadual: limparTextoOpcional(dadosEmpresa.inscricaoEstadual),
    email: limparTextoOpcional(dadosEmpresa.email),
    telefone: limparTextoOpcional(normalizarTelefone(dadosEmpresa.telefone)),
    horaInicioManha: limparTextoOpcional(dadosEmpresa.horaInicioManha),
    horaFimManha: limparTextoOpcional(dadosEmpresa.horaFimManha),
    horaInicioTarde: limparTextoOpcional(dadosEmpresa.horaInicioTarde),
    horaFimTarde: limparTextoOpcional(dadosEmpresa.horaFimTarde),
    trabalhaSabado: dadosEmpresa.trabalhaSabado ? 1 : 0,
    horaInicioSabado: dadosEmpresa.trabalhaSabado ? limparTextoOpcional(dadosEmpresa.horaInicioSabado) : null,
    horaFimSabado: dadosEmpresa.trabalhaSabado ? limparTextoOpcional(dadosEmpresa.horaFimSabado) : null,
    exibirFunilPaginaInicial: dadosEmpresa.exibirFunilPaginaInicial ? 1 : 0,
    diasValidadeCotacao: normalizarNumeroInteiro(dadosEmpresa.diasValidadeCotacao, 7),
    diasEntregaOrdemCompra: normalizarNumeroInteiro(dadosEmpresa.diasEntregaOrdemCompra, 7),
    codigoPrincipalFornecedor: String(dadosEmpresa.codigoPrincipalFornecedor || '').trim() === 'codigoAlternativo'
      ? 'codigoAlternativo'
      : 'codigo',
    etapasFiltroPadraoCotacao: JSON.stringify(
      Array.isArray(dadosEmpresa.etapasFiltroPadraoCotacao)
        ? dadosEmpresa.etapasFiltroPadraoCotacao.map(String)
        : []
    ),
    colunasGridFornecedores: JSON.stringify(
      normalizarConfiguracoesColunasGridFornecedores(dadosEmpresa.colunasGridFornecedores).map((coluna) => ({
        id: coluna.id,
        base: coluna.base,
        rotulo: coluna.rotulo,
        visivel: coluna.obrigatoria ? true : Boolean(coluna.visivel),
        ordem: coluna.ordem,
        span: coluna.span
      }))
    ),
    colunasGridCotacoes: JSON.stringify(
      normalizarConfiguracoesColunasGridCotacoes(dadosEmpresa.colunasGridCotacoes).map((coluna) => ({
        id: coluna.id,
        base: coluna.base,
        rotulo: coluna.rotulo,
        visivel: coluna.obrigatoria ? true : Boolean(coluna.visivel),
        ordem: coluna.ordem,
        span: coluna.span
      }))
    ),
    colunasGridProdutos: JSON.stringify(
      normalizarConfiguracoesColunasGridProdutos(dadosEmpresa.colunasGridProdutos).map((coluna) => ({
        id: coluna.id,
        base: coluna.base,
        rotulo: coluna.rotulo,
        visivel: coluna.obrigatoria ? true : Boolean(coluna.visivel),
        ordem: coluna.ordem,
        span: coluna.span
      }))
    ),
    colunasGridOrdensCompra: JSON.stringify(
      normalizarConfiguracoesColunasGridOrdensCompra(dadosEmpresa.colunasGridOrdensCompra).map((coluna) => ({
        id: coluna.id,
        base: coluna.base,
        rotulo: coluna.rotulo,
        visivel: coluna.obrigatoria ? true : Boolean(coluna.visivel),
        ordem: coluna.ordem,
        span: coluna.span
      }))
    ),
    colunasGridAtendimentos: JSON.stringify(
      normalizarConfiguracoesColunasGridAtendimentos(dadosEmpresa.colunasGridAtendimentos).map((coluna) => ({
        id: coluna.id,
        base: coluna.base,
        rotulo: coluna.rotulo,
        visivel: coluna.obrigatoria ? true : Boolean(coluna.visivel),
        ordem: coluna.ordem,
        span: coluna.span
      }))
    ),
    graficosPaginaInicialCotacoes: JSON.stringify(
      normalizarConfiguracoesGraficosPaginaInicialCotacoes(dadosEmpresa.graficosPaginaInicialCotacoes).map((grafico) => ({
        id: grafico.id,
        base: grafico.base,
        rotulo: grafico.rotulo,
        visivel: Boolean(grafico.visivel),
        ordem: grafico.ordem,
        span: grafico.span
      }))
    ),
    graficosPaginaInicialOrdensCompra: JSON.stringify(
      normalizarConfiguracoesGraficosPaginaInicialOrdensCompra(dadosEmpresa.graficosPaginaInicialOrdensCompra).map((grafico) => ({
        id: grafico.id,
        base: grafico.base,
        rotulo: grafico.rotulo,
        visivel: Boolean(grafico.visivel),
        ordem: grafico.ordem,
        span: grafico.span
      }))
    ),
    graficosPaginaInicialAtendimentos: JSON.stringify(
      normalizarConfiguracoesGraficosPaginaInicialAtendimentos(dadosEmpresa.graficosPaginaInicialAtendimentos).map((grafico) => ({
        id: grafico.id,
        base: grafico.base,
        rotulo: grafico.rotulo,
        visivel: Boolean(grafico.visivel),
        ordem: grafico.ordem,
        span: grafico.span
      }))
    ),
    cardsPaginaInicial: JSON.stringify(
      normalizarConfiguracoesCardsPaginaInicial(dadosEmpresa.cardsPaginaInicial).map((card) => ({
        id: card.id,
        base: card.base,
        rotulo: card.rotulo,
        visivel: Boolean(card.visivel),
        ordem: card.ordem,
        span: card.span
      }))
    ),
    corPrimariaCotacao: limparTextoOpcional(dadosEmpresa.corPrimariaCotacao) || '#111827',
    corSecundariaCotacao: limparTextoOpcional(dadosEmpresa.corSecundariaCotacao) || '#ef4444',
    corDestaqueCotacao: limparTextoOpcional(dadosEmpresa.corDestaqueCotacao) || '#f59e0b',
    destaqueItemCotacaoPdf: String(dadosEmpresa.destaqueItemCotacaoPdf || '').trim() === 'referencia'
      ? 'referencia'
      : 'descricao',
    assuntoEmailCotacao: limparTextoOpcional(dadosEmpresa.assuntoEmailCotacao),
    corpoEmailCotacao: limparTextoOpcional(dadosEmpresa.corpoEmailCotacao),
    assinaturaEmailCotacao: limparTextoOpcional(dadosEmpresa.assinaturaEmailCotacao),
    logradouro: limparTextoOpcional(dadosEmpresa.logradouro),
    numero: limparTextoOpcional(dadosEmpresa.numero),
    complemento: limparTextoOpcional(dadosEmpresa.complemento),
    bairro: limparTextoOpcional(dadosEmpresa.bairro),
    cidade: limparTextoOpcional(dadosEmpresa.cidade),
    estado: limparTextoOpcional(dadosEmpresa.estado)?.toUpperCase(),
    cep: limparTextoOpcional(dadosEmpresa.cep),
    imagem: limparTextoOpcional(dadosEmpresa.imagem)
  };
}

function limparTextoOpcional(valor) {
  const texto = String(valor || '').trim();
  return texto || null;
}

function normalizarContatosGrupoEmpresa(contatos, idGrupoEmpresa) {
  return (contatos || []).map((contato) => ({
    idContatoGrupoEmpresa: typeof contato.idContatoGrupoEmpresa === 'number'
      ? contato.idContatoGrupoEmpresa
      : undefined,
    idGrupoEmpresa: Number(idGrupoEmpresa),
    nome: String(contato.nome || '').trim(),
    cargo: limparTextoOpcional(contato.cargo),
    email: limparTextoOpcional(contato.email),
    telefone: limparTextoOpcional(normalizarTelefone(contato.telefone)),
    whatsapp: limparTextoOpcional(normalizarTelefone(contato.whatsapp)),
    status: contato.status ? 1 : 0,
    principal: contato.principal ? 1 : 0
  }));
}

function normalizarNumeroInteiro(valor, valorPadrao = 0) {
  const numero = Number(String(valor ?? '').trim());
  return Number.isNaN(numero) ? valorPadrao : numero;
}

function normalizarOrdemCadastro(valor) {
  const numero = Number.parseInt(String(valor ?? '').trim(), 10);

  if (Number.isNaN(numero) || numero < 1) {
    return 1;
  }

  return numero;
}

function normalizarPayloadUsuario(dadosUsuario) {
  return {
    nome: dadosUsuario.nome.trim(),
    usuario: dadosUsuario.usuario.trim(),
    senha: dadosUsuario.senha,
    tipo: dadosUsuario.tipo.trim(),
    ativo: dadosUsuario.ativo ? 1 : 0,
    imagem: limparTextoOpcional(dadosUsuario.imagem),
    idComprador: dadosUsuario.tipo === 'Usuario padrao' && dadosUsuario.idComprador
      ? Number(dadosUsuario.idComprador)
      : null
  };
}

function obterResultadoLista(resultado) {
  return resultado.status === 'fulfilled' ? resultado.value : [];
}

function ordenarRegistrosPorOrdem(registros, chavePrimaria) {
  if (!Array.isArray(registros)) {
    return [];
  }

  return [...registros].sort((registroA, registroB) => {
    const ordemA = normalizarOrdemOrdenacao(registroA?.ordem, registroA?.[chavePrimaria]);
    const ordemB = normalizarOrdemOrdenacao(registroB?.ordem, registroB?.[chavePrimaria]);

    if (ordemA !== ordemB) {
      return ordemA - ordemB;
    }

    const idA = Number(registroA?.[chavePrimaria] || 0);
    const idB = Number(registroB?.[chavePrimaria] || 0);
    return idA - idB;
  });
}

function normalizarOrdemOrdenacao(ordem, fallback) {
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

function normalizarNumeroDecimal(valor) {
  const texto = String(valor ?? '').trim().replace(',', '.');

  if (!texto) {
    return 0;
  }

  const numero = Number(texto);
  return Number.isNaN(numero) ? 0 : numero;
}

function enriquecerPrazosPagamento(prazosPagamento, metodosPagamento) {
  const metodosPorId = new Map(
    metodosPagamento.map((metodo) => [metodo.idMetodoPagamento, metodo.descricao])
  );

  return prazosPagamento.map((prazo) => ({
    ...prazo,
    nomeMetodoPagamento: metodosPorId.get(prazo.idMetodoPagamento) || ''
  }));
}

function enriquecerRecursos(recursos, tiposRecurso) {
  const tiposPorId = new Map(
    tiposRecurso.map((tipoRecurso) => [tipoRecurso.idTipoRecurso, tipoRecurso.descricao])
  );

  return recursos.map((recurso) => ({
    ...recurso,
    nomeTipoRecurso: tiposPorId.get(recurso.idTipoRecurso) || ''
  }));
}

function renderizarCorConfiguracao(registro) {
  return (
    <span className="visualizacaoCorConfiguracao">
      <span
        className="amostraCorConfiguracao"
        aria-hidden="true"
        style={{ backgroundColor: registro.cor || '#FFFFFF' }}
      />
      <span>{registro.cor || 'Nao informado'}</span>
    </span>
  );
}

function renderizarObrigatoriosTipoAgenda(registro) {
  const chips = [];

  if (registro.obrigarFornecedor) {
    chips.push('Fornecedor');
  }

  if (registro.obrigarLocal) {
    chips.push('Local');
  }

  if (registro.obrigarRecurso) {
    chips.push('Recurso');
  }

  if (chips.length === 0) {
    return <span className="textoConfiguracaoVazio">Nenhum</span>;
  }

  return (
    <span className="listaChipsConfiguracao">
      {chips.map((chip) => (
        <span key={chip} className="chipConfiguracao">{chip}</span>
      ))}
    </span>
  );
}


