import { useEffect, useMemo, useRef, useState } from 'react';
import { Botao } from '../comuns/botao';
import { MensagemErroPopup } from '../comuns/mensagemErroPopup';
import { CampoImagemPadrao } from '../comuns/campoImagemPadrao';
import { CodigoRegistro } from '../comuns/codigoRegistro';
import { ModalFiltros } from '../comuns/modalFiltros';
import { GradePadrao } from '../comuns/gradePadrao';
import { BotaoAcaoGrade } from '../comuns/botaoAcaoGrade';
import { ModalBuscaFornecedores } from '../comuns/modalBuscaFornecedores';
import { ModalFornecedor } from './fornecedores-modalFornecedor';
import {
  incluirContato,
  incluirFornecedor,
  listarConceitosFornecedor,
  listarFornecedores,
  listarContatos,
  listarCompradores,
  listarGruposEmpresa,
  listarRamosAtividade
} from '../../servicos/fornecedores';
import { listarEtapasOrdemCompraConfiguracao, listarPrazosPagamentoConfiguracao } from '../../servicos/configuracoes';
import { listarEmpresas } from '../../servicos/empresa';
import { ModalOrdemCompra } from './ordensCompra-modalOrdemCompra';
import { listarOrdensCompra } from '../../servicos/ordensCompra';
import {
  atualizarProdutoFornecedor,
  excluirProdutoFornecedor,
  incluirProdutoFornecedor,
  listarProdutosFornecedores
} from '../../servicos/produtos';
import { ModalHistoricoOrdensCompraProduto } from './produtos-modalHistoricoOrdensCompraProduto';
import { ModalGruposProduto } from './configuracoes-modalGruposProduto';
import { ModalMarcas } from './configuracoes-modalMarcas';
import { ModalUnidadesMedida } from './configuracoes-modalUnidadesMedida';
import { listarUsuarios } from '../../servicos/usuarios';
import {
  desformatarPreco,
  normalizarPreco,
  normalizarPrecoDigitado
} from '../../utilitarios/normalizarPreco';
import { normalizarValorEntradaFormulario } from '../../utilitarios/normalizarTextoFormulario';
import { normalizarTelefone } from '../../utilitarios/normalizarTelefone';
import { obterPrimeiroCodigoDisponivel } from '../../utilitarios/obterPrimeiroCodigoDisponivel';

const abasModalProduto = [
  { id: 'dadosGerais', label: 'Dados gerais' },
  { id: 'fornecedoresPadrao', label: 'Fornecedores padrão' },
  { id: 'ordensCompra', label: 'Ordens de compra', abreModal: 'ordensCompra' }
];

const estadoInicialFormulario = {
  referencia: '',
  descricao: '',
  idGrupo: '',
  idMarca: '',
  idUnidade: '',
  custo: '',
  imagem: '',
  status: true
};

const estadoInicialFornecedorProduto = {
  idProdutoFornecedor: '',
  idTemporario: '',
  idFornecedor: '',
  codigoFornecedor: '',
  idUnidadeFornecedor: '',
  unidadeFornecedor: '',
  fator: '1',
  pedidoMinimo: '0',
  quantidadeMultipla: '1'
};

export function ModalProduto({
  aberto,
  produto,
  codigoSugerido,
  gruposProduto,
  marcas,
  unidadesMedida,
  modo = 'novo',
  somenteConsultaGrupos = false,
  aoSalvarGrupoProduto,
  aoInativarGrupoProduto,
  somenteConsultaMarcas = false,
  aoSalvarMarca,
  aoInativarMarca,
  somenteConsultaUnidades = false,
  aoSalvarUnidadeMedida,
  aoInativarUnidadeMedida,
  aoFechar,
  aoSalvar
}) {
  const [formulario, definirFormulario] = useState(estadoInicialFormulario);
  const [abaAtiva, definirAbaAtiva] = useState(abasModalProduto[0].id);
  const [salvando, definirSalvando] = useState(false);
  const [mensagemErro, definirMensagemErro] = useState('');
  const [confirmandoSaida, definirConfirmandoSaida] = useState(false);
  const [modalGruposProdutoAberto, definirModalGruposProdutoAberto] = useState(false);
  const [modalMarcasAberto, definirModalMarcasAberto] = useState(false);
  const [modalUnidadesAberto, definirModalUnidadesAberto] = useState(false);
  const [fornecedoresOrdensCompra, definirFornecedoresOrdensCompra] = useState([]);
  const [contatosOrdensCompra, definirContatosOrdensCompra] = useState([]);
  const [usuariosHistorico, definirUsuariosHistorico] = useState([]);
  const [compradoresHistorico, definirCompradoresHistorico] = useState([]);
  const [prazosPagamentoOrdensCompra, definirPrazosPagamentoOrdensCompra] = useState([]);
  const [etapasOrdemCompra, definirEtapasOrdemCompra] = useState([]);
  const [empresaOrdensCompra, definirEmpresaOrdensCompra] = useState(null);
  const [ordensCompraProduto, definirOrdensCompraProduto] = useState([]);
  const [fornecedoresProduto, definirFornecedoresProduto] = useState([]);
  const [formularioFornecedorProduto, definirFormularioFornecedorProduto] = useState(estadoInicialFornecedorProduto);
  const [modalFornecedorProdutoAberto, definirModalFornecedorProdutoAberto] = useState(false);
  const [modalBuscaFornecedorProdutoAberto, definirModalBuscaFornecedorProdutoAberto] = useState(false);
  const [modalCadastroFornecedorAberto, definirModalCadastroFornecedorAberto] = useState(false);
  const [fornecedoresBuscaProduto, definirFornecedoresBuscaProduto] = useState([]);
  const [compradoresFornecedorProduto, definirCompradoresFornecedorProduto] = useState([]);
  const [ramosAtividadeFornecedorProduto, definirRamosAtividadeFornecedorProduto] = useState([]);
  const [conceitosFornecedorProduto, definirConceitosFornecedorProduto] = useState([]);
  const [gruposEmpresaFornecedorProduto, definirGruposEmpresaFornecedorProduto] = useState([]);
  const [proximoCodigoFornecedorProduto, definirProximoCodigoFornecedorProduto] = useState(1);
  const [carregandoBuscaFornecedorProduto, definirCarregandoBuscaFornecedorProduto] = useState(false);
  const [salvandoFornecedorProduto, definirSalvandoFornecedorProduto] = useState(false);
  const [mensagemErroFornecedorProduto, definirMensagemErroFornecedorProduto] = useState('');
  const [carregandoOrdensCompra, definirCarregandoOrdensCompra] = useState(false);
  const [mensagemErroOrdensCompra, definirMensagemErroOrdensCompra] = useState('');
  const [modalHistoricoOrdensCompraAberto, definirModalHistoricoOrdensCompraAberto] = useState(false);
  const [modalFiltrosOrdensCompraAberto, definirModalFiltrosOrdensCompraAberto] = useState(false);
  const [ordemCompraSelecionado, definirOrdemCompraSelecionado] = useState(null);
  const [modalOrdemCompraAberto, definirModalOrdemCompraAberto] = useState(false);
  const [filtrosOrdensCompra, definirFiltrosOrdensCompra] = useState(criarFiltrosIniciaisOrdensCompraProduto());
  const [pesquisaRapidaOrdensCompra, definirPesquisaRapidaOrdensCompra] = useState('');
  const somenteLeitura = modo === 'consulta';
  const modoInclusao = !produto;
  const referenciaCampoFornecedorProduto = useRef(null);
  const gruposAtivos = gruposProduto.filter((grupo) => grupo.status !== 0);
  const marcasAtivas = marcas.filter((marca) => marca.status !== 0);
  const unidadesAtivas = unidadesMedida.filter((unidade) => unidade.status !== 0);

  useEffect(() => {
    if (!aberto) {
      return;
    }

    definirFormulario(criarFormularioProduto(produto));
    definirAbaAtiva(abasModalProduto[0].id);
    definirSalvando(false);
    definirMensagemErro('');
    definirConfirmandoSaida(false);
    definirModalGruposProdutoAberto(false);
    definirModalMarcasAberto(false);
    definirModalUnidadesAberto(false);
    definirModalHistoricoOrdensCompraAberto(false);
    definirModalFiltrosOrdensCompraAberto(false);
    definirOrdemCompraSelecionado(null);
    definirModalOrdemCompraAberto(false);
    definirFornecedoresProduto([]);
    definirFormularioFornecedorProduto(estadoInicialFornecedorProduto);
    definirModalFornecedorProdutoAberto(false);
    definirModalBuscaFornecedorProdutoAberto(false);
    definirModalCadastroFornecedorAberto(false);
    definirFornecedoresBuscaProduto([]);
    definirCompradoresFornecedorProduto([]);
    definirRamosAtividadeFornecedorProduto([]);
    definirConceitosFornecedorProduto([]);
    definirGruposEmpresaFornecedorProduto([]);
    definirProximoCodigoFornecedorProduto(1);
    definirCarregandoBuscaFornecedorProduto(false);
    definirSalvandoFornecedorProduto(false);
    definirMensagemErroFornecedorProduto('');
    definirFiltrosOrdensCompra(criarFiltrosIniciaisOrdensCompraProduto());
    definirPesquisaRapidaOrdensCompra('');
  }, [aberto, produto]);

  useEffect(() => {
    if (!aberto || !produto?.idProduto) {
      return;
    }

    let cancelado = false;

    async function carregarHistoricoProduto() {
      definirCarregandoOrdensCompra(true);
      definirMensagemErroOrdensCompra('');

      try {
        const resultados = await Promise.allSettled([
          listarOrdensCompra(),
          listarFornecedores(),
          listarContatos(),
          listarUsuarios(),
          listarCompradores(),
          listarPrazosPagamentoConfiguracao(),
          listarEtapasOrdemCompraConfiguracao(),
          listarEmpresas(),
          listarProdutosFornecedores()
        ]);

        if (cancelado) {
          return;
        }

        const [
          ordensCompraResultado,
          fornecedoresResultado,
          contatosResultado,
          usuariosResultado,
          compradoresResultado,
          prazosResultado,
          etapasResultado,
          empresasResultado,
          produtosFornecedoresResultado
        ] = resultados;

        const ordensCompraCarregados = ordensCompraResultado.status === 'fulfilled' ? ordensCompraResultado.value : [];
        const fornecedoresCarregados = fornecedoresResultado.status === 'fulfilled' ? fornecedoresResultado.value : [];
        const contatosCarregados = contatosResultado.status === 'fulfilled' ? contatosResultado.value : [];
        const usuariosCarregados = usuariosResultado.status === 'fulfilled' ? usuariosResultado.value : [];
        const compradoresCarregados = compradoresResultado.status === 'fulfilled' ? compradoresResultado.value : [];
        const prazosCarregados = prazosResultado.status === 'fulfilled' ? prazosResultado.value : [];
        const etapasCarregadas = etapasResultado.status === 'fulfilled' ? etapasResultado.value : [];
        const empresasCarregadas = empresasResultado.status === 'fulfilled' ? empresasResultado.value : [];
        const produtosFornecedoresCarregados = produtosFornecedoresResultado.status === 'fulfilled' ? produtosFornecedoresResultado.value : [];

        definirFornecedoresOrdensCompra(fornecedoresCarregados);
        definirContatosOrdensCompra(contatosCarregados);
        definirUsuariosHistorico(usuariosCarregados);
        definirCompradoresHistorico(compradoresCarregados);
        definirPrazosPagamentoOrdensCompra(prazosCarregados);
        definirEtapasOrdemCompra(normalizarEtapasOrdemCompraHistorico(etapasCarregadas));
        definirEmpresaOrdensCompra(empresasCarregadas[0] || null);
        definirFornecedoresProduto(
          produtosFornecedoresCarregados.filter((item) => String(item.idProduto) === String(produto.idProduto))
        );
        definirOrdensCompraProduto(
          enriquecerOrdensCompraProduto(
            ordensCompraCarregados,
            produto.idProduto,
            fornecedoresCarregados,
            compradoresCarregados,
            etapasCarregadas
          )
        );
      } catch (_erro) {
        if (!cancelado) {
          definirMensagemErroOrdensCompra('Nao foi possivel carregar as ordens de compra deste produto.');
        }
      } finally {
        if (!cancelado) {
          definirCarregandoOrdensCompra(false);
        }
      }
    }

    carregarHistoricoProduto();

    return () => {
      cancelado = true;
    };
  }, [aberto, produto?.idProduto]);

  useEffect(() => {
    if (!aberto) {
      return undefined;
    }

    function tratarTecla(evento) {
      if (evento.key === 'Escape' && !salvando) {
        tentarFecharModal();
      }
    }

    window.addEventListener('keydown', tratarTecla);

    return () => {
      window.removeEventListener('keydown', tratarTecla);
    };
  }, [aberto, aoFechar, salvando]);

  async function submeterFormulario(evento) {
    evento.preventDefault();

    if (somenteLeitura) {
      return;
    }

    const camposObrigatorios = [
      ['referencia', 'Informe a referencia do produto.'],
      ['descricao', 'Informe a descricao do produto.'],
      ['idGrupo', 'Selecione um grupo.'],
      ['idMarca', 'Selecione uma marca.'],
      ['idUnidade', 'Selecione uma unidade.'],
      ['custo', 'Informe o custo do produto.']
    ];

    const mensagemValidacao = camposObrigatorios.find(([campo]) => {
      const valor = formulario[campo];
      return valor === '' || valor === null || valor === undefined;
    });

    if (mensagemValidacao) {
      definirMensagemErro(mensagemValidacao[1]);
      return;
    }

    definirSalvando(true);
    definirMensagemErro('');

    try {
      await aoSalvar({
        ...formulario,
        fornecedoresPadrao: fornecedoresProduto
      });
    } catch (erro) {
      definirMensagemErro(erro.message || 'Nao foi possivel salvar o produto.');
      definirSalvando(false);
    }
  }

  function alterarCampo(evento) {
    const { name, value, type, checked } = evento.target;
    const valorNormalizado = normalizarValorEntradaFormulario(evento);

    definirFormulario((estadoAtual) => ({
      ...estadoAtual,
      [name]: type === 'checkbox'
        ? checked
        : name === 'custo' ? normalizarPrecoDigitado(value) : valorNormalizado
    }));
  }

  function tratarFocoCusto() {
    definirFormulario((estadoAtual) => ({
      ...estadoAtual,
      custo: desformatarPreco(estadoAtual.custo)
    }));
  }

  function tratarDesfoqueCusto() {
    definirFormulario((estadoAtual) => ({
      ...estadoAtual,
      custo: estadoAtual.custo ? normalizarPreco(estadoAtual.custo) : ''
    }));
  }

  function fecharAoClicarNoFundo(evento) {
    if (evento.target === evento.currentTarget && !salvando) {
      tentarFecharModal();
    }
  }

  function tentarFecharModal() {
    if (!somenteLeitura && modoInclusao) {
      definirConfirmandoSaida(true);
      return;
    }

    aoFechar();
  }

  function fecharConfirmacaoSaida() {
    if (salvando) {
      return;
    }

    definirConfirmandoSaida(false);
  }

  function confirmarSaida() {
    definirConfirmandoSaida(false);
    aoFechar();
  }

  function abrirModalGruposProduto() {
    if (somenteLeitura || typeof aoSalvarGrupoProduto !== 'function') {
      return;
    }

    definirModalGruposProdutoAberto(true);
    definirMensagemErro('');
  }

  function fecharModalGruposProduto() {
    definirModalGruposProdutoAberto(false);
  }

  function selecionarGrupo(registro) {
    definirFormulario((estadoAtual) => ({
      ...estadoAtual,
      idGrupo: String(registro?.idGrupo || estadoAtual.idGrupo || '')
    }));
  }

  function abrirModalMarcas() {
    if (somenteLeitura || typeof aoSalvarMarca !== 'function') {
      return;
    }

    definirModalMarcasAberto(true);
    definirMensagemErro('');
  }

  function fecharModalMarcas() {
    definirModalMarcasAberto(false);
  }

  function selecionarMarca(registro) {
    definirFormulario((estadoAtual) => ({
      ...estadoAtual,
      idMarca: String(registro?.idMarca || estadoAtual.idMarca || '')
    }));
  }

  function abrirModalUnidades() {
    if (somenteLeitura || typeof aoSalvarUnidadeMedida !== 'function') {
      return;
    }

    definirModalUnidadesAberto(true);
    definirMensagemErro('');
  }

  function fecharModalUnidades() {
    definirModalUnidadesAberto(false);
  }

  function selecionarUnidade(registro) {
    definirFormulario((estadoAtual) => ({
      ...estadoAtual,
      idUnidade: String(registro?.idUnidade || estadoAtual.idUnidade || '')
    }));
  }

  function abrirModalHistoricoOrdensCompra() {
    definirModalHistoricoOrdensCompraAberto(true);
  }

  function fecharModalHistoricoOrdensCompra() {
    definirModalHistoricoOrdensCompraAberto(false);
  }

  function alterarCampoFornecedorProduto(evento) {
    const { name } = evento.target;
    const valorNormalizado = normalizarValorEntradaFormulario(evento);

    definirFormularioFornecedorProduto((estadoAtual) => ({
      ...estadoAtual,
      [name]: valorNormalizado
    }));
  }

  function iniciarNovoFornecedorProduto() {
    definirFormularioFornecedorProduto(estadoInicialFornecedorProduto);
    definirMensagemErroFornecedorProduto('');
    definirModalFornecedorProdutoAberto(true);
  }

  function editarFornecedorProduto(vinculo) {
    definirFormularioFornecedorProduto({
      idProdutoFornecedor: vinculo.idProdutoFornecedor || '',
      idTemporario: vinculo.idTemporario || '',
      idFornecedor: String(vinculo.idFornecedor || ''),
      codigoFornecedor: vinculo.codigoFornecedor || '',
      idUnidadeFornecedor: String(vinculo.idUnidadeFornecedor || obterIdUnidadeFornecedorPorDescricao(vinculo.unidadeFornecedor, unidadesMedida) || ''),
      unidadeFornecedor: vinculo.unidadeFornecedor || '',
      fator: normalizarNumeroFornecedorProdutoParaFormulario(vinculo.fator, '1'),
      pedidoMinimo: normalizarNumeroFornecedorProdutoParaFormulario(vinculo.pedidoMinimo, '0'),
      quantidadeMultipla: normalizarNumeroFornecedorProdutoParaFormulario(vinculo.quantidadeMultipla, '1')
    });
    definirMensagemErroFornecedorProduto('');
    definirModalFornecedorProdutoAberto(true);
  }

  function fecharModalFornecedorProduto() {
    if (salvandoFornecedorProduto) {
      return;
    }

    definirModalFornecedorProdutoAberto(false);
    definirFormularioFornecedorProduto(estadoInicialFornecedorProduto);
    definirMensagemErroFornecedorProduto('');
  }

  async function abrirModalBuscaFornecedorProduto() {
    if (somenteLeitura || carregandoBuscaFornecedorProduto) {
      return;
    }

    definirCarregandoBuscaFornecedorProduto(true);
    definirMensagemErroFornecedorProduto('');

    try {
      const fornecedoresCarregados = await listarFornecedores();
      const fornecedoresAtivos = fornecedoresCarregados.filter((fornecedor) => fornecedor.status !== 0);
      definirFornecedoresBuscaProduto(fornecedoresAtivos);
      definirFornecedoresOrdensCompra((estadoAtual) => combinarFornecedoresUnicos(estadoAtual, fornecedoresAtivos));
      definirModalBuscaFornecedorProdutoAberto(true);
    } catch (erro) {
      definirMensagemErroFornecedorProduto(erro.message || 'Nao foi possivel carregar a busca de fornecedores.');
    } finally {
      definirCarregandoBuscaFornecedorProduto(false);
    }
  }

  async function abrirModalCadastroFornecedorProduto() {
    definirModalBuscaFornecedorProdutoAberto(false);
    definirCarregandoBuscaFornecedorProduto(true);
    definirMensagemErroFornecedorProduto('');

    try {
      const resultados = await Promise.allSettled([
        listarFornecedores(),
        listarCompradores({ incluirInativos: true }),
        listarRamosAtividade({ incluirInativos: true }),
        listarConceitosFornecedor({ incluirInativos: true }),
        listarGruposEmpresa({ incluirInativos: true }),
        listarEmpresas()
      ]);

      const [
        fornecedoresResultado,
        compradoresResultado,
        ramosResultado,
        conceitosResultado,
        gruposEmpresaResultado,
        empresasResultado
      ] = resultados;

      const fornecedoresCarregados = fornecedoresResultado.status === 'fulfilled' ? fornecedoresResultado.value : [];
      const compradoresCarregados = compradoresResultado.status === 'fulfilled' ? compradoresResultado.value : [];
      const ramosCarregados = ramosResultado.status === 'fulfilled' ? ramosResultado.value : [];
      const conceitosCarregados = conceitosResultado.status === 'fulfilled' ? conceitosResultado.value : [];
      const gruposEmpresaCarregados = gruposEmpresaResultado.status === 'fulfilled' ? gruposEmpresaResultado.value : [];
      const empresasCarregadas = empresasResultado.status === 'fulfilled' ? empresasResultado.value : [];

      definirFornecedoresBuscaProduto(fornecedoresCarregados.filter((fornecedor) => fornecedor.status !== 0));
      definirFornecedoresOrdensCompra((estadoAtual) => combinarFornecedoresUnicos(estadoAtual, fornecedoresCarregados));
      definirCompradoresFornecedorProduto(compradoresCarregados);
      definirRamosAtividadeFornecedorProduto(ramosCarregados);
      definirConceitosFornecedorProduto(conceitosCarregados);
      definirGruposEmpresaFornecedorProduto(gruposEmpresaCarregados);
      definirEmpresaOrdensCompra((estadoAtual) => estadoAtual || empresasCarregadas[0] || null);
      definirProximoCodigoFornecedorProduto(obterPrimeiroCodigoDisponivel(fornecedoresCarregados, 'idFornecedor'));
      definirModalCadastroFornecedorAberto(true);
    } catch (erro) {
      definirMensagemErroFornecedorProduto(erro.message || 'Nao foi possivel abrir o cadastro de fornecedor.');
    } finally {
      definirCarregandoBuscaFornecedorProduto(false);
    }
  }

  function fecharModalCadastroFornecedorProduto() {
    definirModalCadastroFornecedorAberto(false);
  }

  async function salvarFornecedorProdutoCadastro(dadosFornecedor) {
    const payload = normalizarPayloadFornecedorProduto({
      ...dadosFornecedor,
      idFornecedor: proximoCodigoFornecedorProduto
    });

    const fornecedorSalvo = await incluirFornecedor(payload);
    await salvarContatosFornecedorProduto(fornecedorSalvo.idFornecedor, dadosFornecedor.contatos || []);

    const fornecedoresAtualizados = await listarFornecedores();
    const fornecedoresAtivos = fornecedoresAtualizados.filter((fornecedor) => fornecedor.status !== 0);
    const fornecedorCompleto = fornecedoresAtualizados.find((fornecedor) => String(fornecedor.idFornecedor) === String(fornecedorSalvo.idFornecedor)) || fornecedorSalvo;

    definirFornecedoresBuscaProduto(fornecedoresAtivos);
    definirFornecedoresOrdensCompra((estadoAtual) => combinarFornecedoresUnicos(estadoAtual, fornecedoresAtualizados));
    selecionarFornecedorProdutoBusca(fornecedorCompleto);
    definirModalCadastroFornecedorAberto(false);
    definirModalFornecedorProdutoAberto(true);
    return fornecedorCompleto;
  }

  function selecionarFornecedorProdutoBusca(fornecedor) {
    if (!fornecedor?.idFornecedor) {
      return;
    }

    definirFornecedoresOrdensCompra((estadoAtual) => combinarFornecedoresUnicos(estadoAtual, [fornecedor]));
    definirFormularioFornecedorProduto((estadoAtual) => ({
      ...estadoAtual,
      idFornecedor: String(fornecedor.idFornecedor)
    }));
    definirModalBuscaFornecedorProdutoAberto(false);

    window.requestAnimationFrame(() => {
      referenciaCampoFornecedorProduto.current?.focus({ preventScroll: true });
    });
  }

  async function salvarFornecedorProduto() {
    if (somenteLeitura) {
      return;
    }

    const payload = {
      idProduto: produto?.idProduto ? Number(produto.idProduto) : null,
      idFornecedor: Number(formularioFornecedorProduto.idFornecedor),
      codigoFornecedor: String(formularioFornecedorProduto.codigoFornecedor || '').trim(),
      idUnidadeFornecedor: Number(formularioFornecedorProduto.idUnidadeFornecedor),
      unidadeFornecedor: obterDescricaoUnidadePorId(formularioFornecedorProduto.idUnidadeFornecedor, unidadesMedida),
      fator: normalizarNumeroFornecedorProduto(formularioFornecedorProduto.fator, 1),
      pedidoMinimo: normalizarNumeroFornecedorProduto(formularioFornecedorProduto.pedidoMinimo, 0),
      quantidadeMultipla: normalizarNumeroFornecedorProduto(formularioFornecedorProduto.quantidadeMultipla, 1)
    };

    if (!payload.idFornecedor || !payload.codigoFornecedor || !payload.idUnidadeFornecedor) {
      definirMensagemErroFornecedorProduto('Informe fornecedor, codigo do fornecedor e unidade do fornecedor.');
      return;
    }

    if (payload.fator <= 0 || payload.pedidoMinimo < 0 || payload.quantidadeMultipla <= 0) {
      definirMensagemErroFornecedorProduto('Informe fator maior que zero, pedido minimo igual ou maior que zero e quantidade multipla maior que zero.');
      return;
    }

    const fornecedorDuplicado = fornecedoresProduto.some((vinculo) => (
      String(vinculo.idFornecedor) === String(payload.idFornecedor)
      && String(vinculo.idProdutoFornecedor) !== String(formularioFornecedorProduto.idProdutoFornecedor || '')
      && String(vinculo.idTemporario || '') !== String(formularioFornecedorProduto.idTemporario || '')
    ));

    if (fornecedorDuplicado) {
      definirMensagemErroFornecedorProduto('Este fornecedor ja esta vinculado ao produto.');
      return;
    }

    definirSalvandoFornecedorProduto(true);
    definirMensagemErroFornecedorProduto('');

    try {
      if (!produto?.idProduto) {
        const registroTemporario = {
          ...payload,
          idTemporario: formularioFornecedorProduto.idTemporario || `temporario-${Date.now()}`
        };

        definirFornecedoresProduto((estadoAtual) => {
          if (formularioFornecedorProduto.idTemporario) {
            return estadoAtual.map((item) => (
              String(item.idTemporario) === String(formularioFornecedorProduto.idTemporario)
                ? registroTemporario
                : item
            ));
          }

          return [registroTemporario, ...estadoAtual];
        });
        definirFormularioFornecedorProduto(estadoInicialFornecedorProduto);
        definirModalFornecedorProdutoAberto(false);
        return;
      }

      const registro = formularioFornecedorProduto.idProdutoFornecedor
        ? await atualizarProdutoFornecedor(formularioFornecedorProduto.idProdutoFornecedor, payload)
        : await incluirProdutoFornecedor(payload);

      definirFornecedoresProduto((estadoAtual) => {
        if (formularioFornecedorProduto.idProdutoFornecedor) {
          return estadoAtual.map((item) => (
            String(item.idProdutoFornecedor) === String(formularioFornecedorProduto.idProdutoFornecedor)
              ? registro
              : item
          ));
        }

        return [registro, ...estadoAtual];
      });
      definirFormularioFornecedorProduto(estadoInicialFornecedorProduto);
      definirModalFornecedorProdutoAberto(false);
    } catch (erro) {
      definirMensagemErroFornecedorProduto(erro.message || 'Nao foi possivel salvar o fornecedor do produto.');
    } finally {
      definirSalvandoFornecedorProduto(false);
    }
  }

  async function removerFornecedorProduto(vinculo) {
    if (somenteLeitura) {
      return;
    }

    if (!vinculo?.idProdutoFornecedor) {
      definirFornecedoresProduto((estadoAtual) => estadoAtual.filter(
        (item) => String(item.idTemporario) !== String(vinculo.idTemporario)
      ));

      if (String(formularioFornecedorProduto.idTemporario) === String(vinculo.idTemporario)) {
        definirFormularioFornecedorProduto(estadoInicialFornecedorProduto);
      }
      return;
    }

    definirSalvandoFornecedorProduto(true);
    definirMensagemErroFornecedorProduto('');

    try {
      await excluirProdutoFornecedor(vinculo.idProdutoFornecedor);
      definirFornecedoresProduto((estadoAtual) => estadoAtual.filter(
        (item) => String(item.idProdutoFornecedor) !== String(vinculo.idProdutoFornecedor)
      ));

      if (String(formularioFornecedorProduto.idProdutoFornecedor) === String(vinculo.idProdutoFornecedor)) {
        definirFormularioFornecedorProduto(estadoInicialFornecedorProduto);
      }
    } catch (erro) {
      definirMensagemErroFornecedorProduto(erro.message || 'Nao foi possivel remover o fornecedor do produto.');
    } finally {
      definirSalvandoFornecedorProduto(false);
    }
  }

  function consultarOrdemCompra(ordemCompra) {
    definirOrdemCompraSelecionado(ordemCompra);
    definirModalOrdemCompraAberto(true);
  }

  function fecharModalOrdemCompra() {
    definirOrdemCompraSelecionado(null);
    definirModalOrdemCompraAberto(false);
  }

  function selecionarAbaProduto(aba) {
    if (aba.abreModal === 'ordensCompra') {
      abrirModalHistoricoOrdensCompra();
      return;
    }

    definirAbaAtiva(aba.id);
  }

  const itensOrdensCompraFiltrados = useMemo(
    () => filtrarItensOrdensCompraDigitacaoProduto(
      criarItensOrdensCompraProduto(ordensCompraProduto, produto?.idProduto, filtrosOrdensCompra),
      pesquisaRapidaOrdensCompra
    ),
    [ordensCompraProduto, produto?.idProduto, filtrosOrdensCompra, pesquisaRapidaOrdensCompra]
  );
  const produtosConsultaOrdemCompra = useMemo(
    () => (produto ? [produto] : []),
    [produto]
  );
  const filtrosOrdensCompraAtivos = filtrosHistoricoEstaoAtivos(filtrosOrdensCompra, criarFiltrosIniciaisOrdensCompraProduto());
  const fornecedoresProdutoEnriquecidos = useMemo(
    () => enriquecerFornecedoresProduto(fornecedoresProduto, fornecedoresOrdensCompra, unidadesMedida),
    [fornecedoresProduto, fornecedoresOrdensCompra, unidadesMedida]
  );

  if (!aberto) {
    return null;
  }

  return (
    <>
      <div className="camadaModal" role="presentation" onMouseDown={fecharAoClicarNoFundo}>
        <form
          className="modalFornecedor modalFornecedorComAbas"
          role="dialog"
          aria-modal="true"
          aria-labelledby="tituloModalProduto"
          onMouseDown={(evento) => evento.stopPropagation()}
          onSubmit={submeterFormulario}
        >
          <header className="cabecalhoModalFornecedor">
            <h2 id="tituloModalProduto">
              {somenteLeitura ? 'Consultar produto' : produto ? 'Editar produto' : 'Incluir produto'}
            </h2>

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

          <div className="abasModalFornecedor" role="tablist" aria-label="Secoes do cadastro do produto">
            {abasModalProduto.map((aba) => (
              <button
                key={aba.id}
                type="button"
                role={aba.abreModal ? undefined : 'tab'}
                className={`abaModalFornecedor ${abaAtiva === aba.id ? 'ativa' : ''}`}
                aria-selected={aba.abreModal ? undefined : abaAtiva === aba.id}
                onClick={() => selecionarAbaProduto(aba)}
                disabled={aba.id === 'ordensCompra' && modoInclusao}
              >
                {aba.label}
              </button>
            ))}
          </div>

          <div className="corpoModalFornecedor">
            {abaAtiva === 'dadosGerais' ? (
              <section className="painelDadosGeraisFornecedor">
                <CampoImagemPadrao
                  valor={formulario.imagem}
                  alt={`Imagem de ${formulario.descricao || formulario.referencia || 'produto'}`}
                  iniciais={obterIniciaisProduto(formulario)}
                  codigo={produto?.idProduto || codigoSugerido || 0}
                  disabled={somenteLeitura}
                  tamanhoSaidaImagem={320}
                  qualidadeSaidaImagem={0.82}
                  onChange={(imagem) => definirFormulario((estadoAtual) => ({
                    ...estadoAtual,
                    imagem: imagem || estadoAtual.imagem
                  }))}
                />

                <div className="gradeCamposModalFornecedor">
                  <CampoFormulario
                    label="Referencia"
                    name="referencia"
                    value={formulario.referencia}
                    onChange={alterarCampo}
                    disabled={somenteLeitura}
                    required
                  />
                  <CampoFormulario
                    label="Descricao"
                    name="descricao"
                    value={formulario.descricao}
                    onChange={alterarCampo}
                    disabled={somenteLeitura}
                    required
                  />
                  <CampoSelect
                    label="Grupo de Produto"
                    name="idGrupo"
                    value={formulario.idGrupo}
                    onChange={alterarCampo}
                    options={gruposAtivos.map((grupo) => ({
                      valor: String(grupo.idGrupo),
                      label: grupo.descricao
                    }))}
                    disabled={somenteLeitura}
                    required
                    acaoExtra={!somenteLeitura ? (
                      <Botao
                        variante="secundario"
                        type="button"
                        icone="pesquisa"
                        className="botaoCampoAcao"
                        onClick={abrirModalGruposProduto}
                        somenteIcone
                        title="Abrir grupos de produto"
                        aria-label="Abrir grupos de produto"
                      >
                        Abrir grupos de produto
                      </Botao>
                    ) : null}
                  />
                  <CampoSelect
                    label="Marca"
                    name="idMarca"
                    value={formulario.idMarca}
                    onChange={alterarCampo}
                    options={marcasAtivas.map((marca) => ({
                      valor: String(marca.idMarca),
                      label: marca.descricao
                    }))}
                    disabled={somenteLeitura}
                    required
                    acaoExtra={!somenteLeitura ? (
                      <Botao
                        variante="secundario"
                        type="button"
                        icone="pesquisa"
                        className="botaoCampoAcao"
                        onClick={abrirModalMarcas}
                        somenteIcone
                        title="Abrir marcas"
                        aria-label="Abrir marcas"
                      >
                        Abrir marcas
                      </Botao>
                    ) : null}
                  />
                  <CampoSelect
                    label="Unidade"
                    name="idUnidade"
                    value={formulario.idUnidade}
                    onChange={alterarCampo}
                    options={unidadesAtivas.map((unidade) => ({
                      valor: String(unidade.idUnidade),
                      label: unidade.descricao
                    }))}
                    disabled={somenteLeitura}
                    required
                    acaoExtra={!somenteLeitura ? (
                      <Botao
                        variante="secundario"
                        type="button"
                        icone="pesquisa"
                        className="botaoCampoAcao"
                        onClick={abrirModalUnidades}
                        somenteIcone
                        title="Abrir unidades"
                        aria-label="Abrir unidades"
                      >
                        Abrir unidades
                      </Botao>
                    ) : null}
                  />
                  <CampoFormulario
                    label="Custo"
                    name="custo"
                    value={formulario.custo}
                    onChange={alterarCampo}
                    onFocus={tratarFocoCusto}
                    onBlur={tratarDesfoqueCusto}
                    disabled={somenteLeitura}
                    inputMode="decimal"
                    required
                  />
                  <label className="campoCheckboxFormulario" htmlFor="statusProduto">
                    <input
                      id="statusProduto"
                      type="checkbox"
                      name="status"
                      checked={formulario.status}
                      onChange={alterarCampo}
                      disabled={somenteLeitura}
                    />
                    <span>Produto ativo</span>
                  </label>
                </div>
              </section>
            ) : null}

            {abaAtiva === 'fornecedoresPadrao' ? (
              <section className="painelContatosModalFornecedor painelContatosModalFornecedor">
                <div className="cabecalhoGradeContatosModal">
                  <div>
                    <h3>Fornecedores padrão</h3>
                    <p className="descricaoSecaoModalFornecedor descricaoSecaoModalFornecedor">
                      Cadastre os fornecedores que trabalham com este produto, usando o codigo e a unidade informados por cada fornecedor.
                    </p>
                  </div>
                  <Botao
                    variante="primario"
                    type="button"
                    icone="adicionar"
                    somenteIcone
                    title="Incluir fornecedor padrão"
                    aria-label="Incluir fornecedor padrão"
                    onClick={iniciarNovoFornecedorProduto}
                    disabled={somenteLeitura || salvandoFornecedorProduto}
                  >
                    Incluir fornecedor padrão
                  </Botao>
                </div>

                <GradePadrao
                  className="gradeContatosModal"
                  classNameTabela="tabelaContatosModal tabelaFornecedoresProdutoPadrao"
                  classNameMensagem="mensagemTabelaContatosModal"
                  cabecalho={(
                    <tr>
                      <th>Fornecedor</th>
                      <th>Codigo do fornecedor</th>
                      <th>Unidade</th>
                      <th>Fator</th>
                      <th>Pedido minimo</th>
                      <th>Qtd. multipla</th>
                      <th className="cabecalhoAcoesContato">Acoes</th>
                    </tr>
                  )}
                  temItens={fornecedoresProdutoEnriquecidos.length > 0}
                  mensagemVazia="Nenhum fornecedor vinculado a este produto."
                >
                  {fornecedoresProdutoEnriquecidos.map((vinculo) => (
                    <tr key={vinculo.idProdutoFornecedor || vinculo.idTemporario}>
                      <td>
                        <div className="celulaContatoModal">
                          <strong>{vinculo.nomeFornecedor}</strong>
                          <span>{`#${String(vinculo.idFornecedor || '').padStart(4, '0')}`}</span>
                        </div>
                      </td>
                      <td>{vinculo.codigoFornecedor}</td>
                      <td>{vinculo.unidadeFornecedor}</td>
                      <td>{formatarNumeroFornecedorProduto(vinculo.fator)}</td>
                      <td>{formatarNumeroFornecedorProduto(vinculo.pedidoMinimo)}</td>
                      <td>{formatarNumeroFornecedorProduto(vinculo.quantidadeMultipla)}</td>
                      <td>
                        <div className="acoesContatoModal">
                          <BotaoAcaoGrade
                            icone="editar"
                            titulo="Editar fornecedor do produto"
                            onClick={() => editarFornecedorProduto(vinculo)}
                            disabled={somenteLeitura || salvandoFornecedorProduto}
                          />
                          <BotaoAcaoGrade
                            icone="limpar"
                            titulo="Remover fornecedor do produto"
                            onClick={() => removerFornecedorProduto(vinculo)}
                            disabled={somenteLeitura || salvandoFornecedorProduto}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </GradePadrao>
              </section>
            ) : null}
          </div>

          <MensagemErroPopup mensagem={mensagemErro} titulo="Nao foi possivel salvar o produto." />

          {confirmandoSaida ? (
            <div className="camadaConfirmacaoModal" role="presentation" onMouseDown={fecharConfirmacaoSaida}>
              <div
                className="modalConfirmacaoAgenda"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="tituloConfirmacaoSaidaProduto"
                onMouseDown={(evento) => evento.stopPropagation()}
              >
                <div className="cabecalhoConfirmacaoModal">
                  <h4 id="tituloConfirmacaoSaidaProduto">Cancelar cadastro</h4>
                </div>

                <div className="corpoConfirmacaoModal">
                  <p>Se fechar agora, todas as informacoes preenchidas serao perdidas.</p>
                </div>

                <div className="acoesConfirmacaoModal">
                  <Botao variante="secundario" type="button" onClick={fecharConfirmacaoSaida} disabled={salvando}>
                    Nao
                  </Botao>
                  <Botao variante="perigo" type="button" onClick={confirmarSaida} disabled={salvando}>
                    Sim
                  </Botao>
                </div>
              </div>
            </div>
          ) : null}
        </form>
      </div>

      {modalFornecedorProdutoAberto ? (
        <div className="camadaModal" role="presentation" onMouseDown={fecharModalFornecedorProduto}>
          <form
            className="modalFornecedor modalFornecedorProdutoPadrao"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tituloModalFornecedorProduto"
            onMouseDown={(evento) => evento.stopPropagation()}
            onSubmit={(evento) => {
              evento.preventDefault();
              salvarFornecedorProduto();
            }}
          >
            <header className="cabecalhoModalFornecedor">
              <h2 id="tituloModalFornecedorProduto">
                {formularioFornecedorProduto.idProdutoFornecedor || formularioFornecedorProduto.idTemporario
                  ? 'Editar fornecedor padrão'
                  : 'Incluir fornecedor padrão'}
              </h2>

              <div className="acoesCabecalhoModalFornecedor">
                <Botao variante="secundario" type="button" onClick={fecharModalFornecedorProduto} disabled={salvandoFornecedorProduto}>
                  Cancelar
                </Botao>
                <Botao variante="primario" type="submit" disabled={salvandoFornecedorProduto}>
                  {salvandoFornecedorProduto ? 'Salvando...' : 'Salvar'}
                </Botao>
              </div>
            </header>

            <div className="corpoModalFornecedor">
              <section className="gradeCamposModalFornecedor gradeFornecedorProdutoPadrao">
                <CampoFormularioComAcao
                  label="Fornecedor"
                  name="nomeFornecedorProduto"
                  value={obterNomeFornecedorPorId(formularioFornecedorProduto.idFornecedor, fornecedoresOrdensCompra)}
                  referenciaCampo={referenciaCampoFornecedorProduto}
                  data-atalho-busca-id="fornecedor"
                  readOnly
                  disabled={somenteLeitura || salvandoFornecedorProduto}
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
                      onClick={abrirModalBuscaFornecedorProduto}
                      disabled={salvandoFornecedorProduto || carregandoBuscaFornecedorProduto}
                    >
                      Buscar fornecedor
                    </Botao>
                  ) : null}
                />
                <CampoFormulario
                  label="Código do fornecedor"
                  name="codigoFornecedor"
                  value={formularioFornecedorProduto.codigoFornecedor}
                  onChange={alterarCampoFornecedorProduto}
                  disabled={somenteLeitura || salvandoFornecedorProduto}
                />
                <CampoSelect
                  label="Unidade do fornecedor"
                  name="idUnidadeFornecedor"
                  value={formularioFornecedorProduto.idUnidadeFornecedor}
                  onChange={alterarCampoFornecedorProduto}
                  options={unidadesAtivas.map((unidade) => ({
                    valor: String(unidade.idUnidade),
                    label: unidade.descricao
                  }))}
                  disabled={somenteLeitura || salvandoFornecedorProduto}
                  required
                />
                <CampoFormulario
                  label="Fator"
                  name="fator"
                  type="number"
                  min="0.0001"
                  step="0.0001"
                  value={formularioFornecedorProduto.fator}
                  onChange={alterarCampoFornecedorProduto}
                  disabled={somenteLeitura || salvandoFornecedorProduto}
                  required
                />
                <CampoFormulario
                  label="Pedido minimo"
                  name="pedidoMinimo"
                  type="number"
                  min="0"
                  step="0.0001"
                  value={formularioFornecedorProduto.pedidoMinimo}
                  onChange={alterarCampoFornecedorProduto}
                  disabled={somenteLeitura || salvandoFornecedorProduto}
                  required
                />
                <CampoFormulario
                  label="Qtd. multipla"
                  name="quantidadeMultipla"
                  type="number"
                  min="0.0001"
                  step="0.0001"
                  value={formularioFornecedorProduto.quantidadeMultipla}
                  onChange={alterarCampoFornecedorProduto}
                  disabled={somenteLeitura || salvandoFornecedorProduto}
                  required
                />
              </section>
            </div>

            <MensagemErroPopup mensagem={mensagemErroFornecedorProduto} titulo="Nao foi possivel salvar o fornecedor do produto." />
          </form>
        </div>
      ) : null}

      <ModalBuscaFornecedores
        aberto={modalBuscaFornecedorProdutoAberto}
        empresa={empresaOrdensCompra}
        fornecedores={fornecedoresBuscaProduto}
        placeholder="Pesquisar fornecedor"
        ariaLabelPesquisa="Pesquisar fornecedor"
        rotuloAcaoPrimaria="Incluir fornecedor"
        tituloAcaoPrimaria="Incluir fornecedor"
        iconeAcaoPrimaria="adicionar"
        aoAcionarPrimaria={abrirModalCadastroFornecedorProduto}
        aoSelecionar={selecionarFornecedorProdutoBusca}
        aoFechar={() => definirModalBuscaFornecedorProdutoAberto(false)}
      />

      <ModalFornecedor
        aberto={modalCadastroFornecedorAberto}
        fornecedor={null}
        empresa={empresaOrdensCompra}
        codigoSugerido={proximoCodigoFornecedorProduto}
        contatos={[]}
        contatosEditaveis={[]}
        gruposEmpresa={gruposEmpresaFornecedorProduto}
        contatosGruposEmpresa={[]}
        compradores={compradoresFornecedorProduto}
        ramosAtividade={ramosAtividadeFornecedorProduto}
        conceitosFornecedor={conceitosFornecedorProduto}
        modo="novo"
        classNameCamada="camadaModal camadaModalSecundaria"
        aoFechar={fecharModalCadastroFornecedorProduto}
        aoSalvar={salvarFornecedorProdutoCadastro}
      />

      <ModalGruposProduto
        aberto={modalGruposProdutoAberto}
        registros={gruposProduto}
        somenteConsulta={somenteConsultaGrupos}
        fecharAoSalvar
        aoFechar={fecharModalGruposProduto}
        aoSalvar={aoSalvarGrupoProduto}
        aoInativar={aoInativarGrupoProduto}
        aoSelecionarGrupo={selecionarGrupo}
      />

      <ModalMarcas
        aberto={modalMarcasAberto}
        registros={marcas}
        somenteConsulta={somenteConsultaMarcas}
        fecharAoSalvar
        aoFechar={fecharModalMarcas}
        aoSalvar={aoSalvarMarca}
        aoInativar={aoInativarMarca}
        aoSelecionarMarca={selecionarMarca}
      />

      <ModalUnidadesMedida
        aberto={modalUnidadesAberto}
        registros={unidadesMedida}
        somenteConsulta={somenteConsultaUnidades}
        fecharAoSalvar
        aoFechar={fecharModalUnidades}
        aoSalvar={aoSalvarUnidadeMedida}
        aoInativar={aoInativarUnidadeMedida}
        aoSelecionarUnidade={selecionarUnidade}
      />

      <ModalHistoricoOrdensCompraProduto
        aberto={modalHistoricoOrdensCompraAberto}
        produto={produto}
        carregando={carregandoOrdensCompra}
        mensagemErro={mensagemErroOrdensCompra}
        itensOrdensCompra={itensOrdensCompraFiltrados}
        filtrosAtivos={filtrosOrdensCompraAtivos}
        valorPesquisa={pesquisaRapidaOrdensCompra}
        onAlterarPesquisa={definirPesquisaRapidaOrdensCompra}
        onFechar={fecharModalHistoricoOrdensCompra}
        onAbrirFiltros={() => definirModalFiltrosOrdensCompraAberto(true)}
        onConsultarOrdemCompra={consultarOrdemCompra}
      />

      <ModalOrdemCompra
        aberto={modalOrdemCompraAberto}
        ordemCompra={ordemCompraSelecionado}
        fornecedores={fornecedoresOrdensCompra}
        contatos={contatosOrdensCompra}
        usuarios={usuariosHistorico}
        compradores={compradoresHistorico}
        prazosPagamento={prazosPagamentoOrdensCompra}
        etapasOrdemCompra={etapasOrdemCompra}
        produtos={produtosConsultaOrdemCompra}
        camposOrdemCompra={[]}
        empresa={empresaOrdensCompra}
        usuarioLogado={null}
        modo="consulta"
        camadaSecundaria
        aoFechar={fecharModalOrdemCompra}
        aoSalvar={async () => {}}
      />

      <ModalFiltros
        aberto={modalFiltrosOrdensCompraAberto}
        titulo="Filtros de itens vendidos"
        filtros={filtrosOrdensCompra}
        campos={[
          {
            name: 'dataInclusaoInicio',
            label: 'Inclusao inicial',
            type: 'date',
            inputProps: {
              max: filtrosOrdensCompra.dataInclusaoFim || undefined
            }
          },
          {
            name: 'dataInclusaoFim',
            label: 'Inclusao final',
            type: 'date',
            inputProps: {
              min: filtrosOrdensCompra.dataInclusaoInicio || undefined
            }
          },
          {
            name: 'dataEntregaInicio',
            label: 'Entrega inicial',
            type: 'date',
            inputProps: {
              max: filtrosOrdensCompra.dataEntregaFim || undefined
            }
          },
          {
            name: 'dataEntregaFim',
            label: 'Entrega final',
            type: 'date',
            inputProps: {
              min: filtrosOrdensCompra.dataEntregaInicio || undefined
            }
          },
          {
            name: 'codigoOrdemCompra',
            label: 'Ordem de Compra',
            type: 'text',
            inputProps: {
              placeholder: 'Todos'
            }
          },
          {
            name: 'prazoPagamento',
            label: 'Prazo de pagamento',
            type: 'text',
            inputProps: {
              placeholder: 'Todos'
            }
          },
          {
            name: 'referenciaProduto',
            label: 'Referencia',
            type: 'text',
            inputProps: {
              placeholder: 'Todas'
            }
          },
          {
            name: 'descricaoProduto',
            label: 'Descricao',
            type: 'text',
            inputProps: {
              placeholder: 'Todas'
            }
          },
          {
            name: 'idEtapaOrdemCompra',
            label: 'Etapa',
            options: etapasOrdemCompra.map((etapa) => ({
              valor: String(etapa.idEtapaOrdemCompra),
              label: etapa.descricao
            }))
          },
          {
            name: 'idComprador',
            label: 'Comprador',
            options: compradoresHistorico.map((comprador) => ({
              valor: String(comprador.idComprador),
              label: comprador.nome
            }))
          }
        ]}
        aoFechar={() => definirModalFiltrosOrdensCompraAberto(false)}
        aoAplicar={(proximosFiltros) => {
          definirFiltrosOrdensCompra(proximosFiltros);
          definirModalFiltrosOrdensCompraAberto(false);
        }}
        aoLimpar={() => definirFiltrosOrdensCompra(criarFiltrosIniciaisOrdensCompraProduto())}
      />
    </>
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

function CampoFormularioComAcao({ label, name, acaoExtra = null, referenciaCampo = null, ...props }) {
  return (
    <div className="campoFormulario">
      <label htmlFor={name}>{label}</label>
      <div className={`campoSelectComAcao ${acaoExtra ? 'temAcao' : ''}`.trim()}>
        <input id={name} name={name} ref={referenciaCampo} className="entradaFormulario" {...props} />
        {acaoExtra}
      </div>
    </div>
  );
}

function CampoSelect({ label, name, options, acaoExtra = null, ...props }) {
  return (
    <div className="campoFormulario">
      <label htmlFor={name}>{label}</label>
      <div className={`campoSelectComAcao ${acaoExtra ? 'temAcao' : ''}`.trim()}>
        <select id={name} name={name} className="entradaFormulario" {...props}>
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

function criarFormularioProduto(produto) {
  if (!produto) {
    return estadoInicialFormulario;
  }

  return {
    referencia: produto.referencia || '',
    descricao: produto.descricao || '',
    idGrupo: String(produto.idGrupo || ''),
    idMarca: String(produto.idMarca || ''),
    idUnidade: String(produto.idUnidade || ''),
    custo: produto.custo ? normalizarPreco(produto.custo) : '',
    imagem: produto.imagem || '',
    status: Boolean(produto.status)
  };
}

function obterIniciaisProduto(produto) {
  const textoBase = produto.referencia || produto.descricao || 'PR';

  return textoBase.slice(0, 2).toUpperCase();
}

function enriquecerFornecedoresProduto(vinculos, fornecedores, unidadesMedida) {
  const fornecedoresPorId = new Map(
    (fornecedores || []).map((fornecedor) => [
      String(fornecedor.idFornecedor),
      fornecedor.nomeFantasia || fornecedor.razaoSocial || `Fornecedor #${fornecedor.idFornecedor}`
    ])
  );

  return (vinculos || []).map((vinculo) => ({
    ...vinculo,
    nomeFornecedor: fornecedoresPorId.get(String(vinculo.idFornecedor)) || `Fornecedor #${vinculo.idFornecedor}`,
    unidadeFornecedor: obterDescricaoUnidadePorId(vinculo.idUnidadeFornecedor, unidadesMedida) || vinculo.unidadeFornecedor || '-'
  }));
}

function obterDescricaoUnidadePorId(idUnidade, unidadesMedida) {
  if (!idUnidade) {
    return '';
  }

  const unidade = (unidadesMedida || []).find((item) => String(item.idUnidade) === String(idUnidade));
  return unidade?.descricao || '';
}

function obterIdUnidadeFornecedorPorDescricao(descricao, unidadesMedida) {
  const descricaoNormalizada = String(descricao || '').trim().toLowerCase();

  if (!descricaoNormalizada) {
    return '';
  }

  const unidade = (unidadesMedida || []).find((item) => (
    String(item.descricao || '').trim().toLowerCase() === descricaoNormalizada
  ));

  return unidade?.idUnidade || '';
}

function normalizarNumeroFornecedorProduto(valor, valorPadrao = 0) {
  const numero = Number(String(valor ?? '').replace(',', '.'));
  return Number.isFinite(numero) ? numero : valorPadrao;
}

function normalizarNumeroFornecedorProdutoParaFormulario(valor, valorPadrao = '') {
  if (valor === undefined || valor === null || valor === '') {
    return valorPadrao;
  }

  return String(valor).replace(',', '.');
}

function formatarNumeroFornecedorProduto(valor) {
  const numero = Number(String(valor ?? '').replace(',', '.'));

  if (!Number.isFinite(numero)) {
    return '-';
  }

  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4
  }).format(numero);
}

function obterNomeFornecedorPorId(idFornecedor, fornecedores) {
  if (!idFornecedor) {
    return '';
  }

  const fornecedor = (fornecedores || []).find((item) => String(item.idFornecedor) === String(idFornecedor));
  return fornecedor?.nomeFantasia || fornecedor?.razaoSocial || `Fornecedor #${idFornecedor}`;
}

function combinarFornecedoresUnicos(fornecedoresBase, fornecedoresExtras) {
  const mapa = new Map();

  [...(Array.isArray(fornecedoresBase) ? fornecedoresBase : []), ...(Array.isArray(fornecedoresExtras) ? fornecedoresExtras : [])]
    .forEach((fornecedor) => {
      if (!fornecedor?.idFornecedor) {
        return;
      }

      mapa.set(String(fornecedor.idFornecedor), fornecedor);
    });

  return Array.from(mapa.values());
}

async function salvarContatosFornecedorProduto(idFornecedor, contatos) {
  const contatosNormalizados = (contatos || []).map((contato) => ({
    idFornecedor,
    nome: String(contato.nome || '').trim(),
    cargo: limparTextoOpcional(contato.cargo),
    email: limparTextoOpcional(contato.email),
    telefone: limparTextoOpcional(normalizarTelefone(contato.telefone)),
    whatsapp: limparTextoOpcional(normalizarTelefone(contato.whatsapp)),
    status: contato.status ? 1 : 0,
    principal: contato.principal ? 1 : 0
  }));

  for (const contato of contatosNormalizados) {
    await incluirContato(contato);
  }
}

function normalizarPayloadFornecedorProduto(dadosFornecedor) {
  const payload = {
    idComprador: Number(dadosFornecedor.idComprador),
    idConceito: Number(dadosFornecedor.idConceito),
    idGrupoEmpresa: dadosFornecedor.idGrupoEmpresa ? Number(dadosFornecedor.idGrupoEmpresa) : null,
    idRamo: Number(dadosFornecedor.idRamo),
    razaoSocial: String(dadosFornecedor.razaoSocial || '').trim(),
    nomeFantasia: String(dadosFornecedor.nomeFantasia || '').trim(),
    tipo: String(dadosFornecedor.tipo || '').trim(),
    cnpj: String(dadosFornecedor.cnpj || '').trim(),
    inscricaoEstadual: limparTextoOpcional(dadosFornecedor.inscricaoEstadual),
    status: dadosFornecedor.status ? 1 : 0,
    email: limparTextoOpcional(dadosFornecedor.email),
    telefone: limparTextoOpcional(normalizarTelefone(dadosFornecedor.telefone)),
    logradouro: limparTextoOpcional(dadosFornecedor.logradouro),
    numero: limparTextoOpcional(dadosFornecedor.numero),
    complemento: limparTextoOpcional(dadosFornecedor.complemento),
    bairro: limparTextoOpcional(dadosFornecedor.bairro),
    cidade: limparTextoOpcional(dadosFornecedor.cidade),
    estado: limparTextoOpcional(dadosFornecedor.estado)?.toUpperCase(),
    cep: limparTextoOpcional(dadosFornecedor.cep),
    observacao: limparTextoOpcional(dadosFornecedor.observacao),
    codigoAlternativo: normalizarCodigoAlternativoFornecedorProduto(dadosFornecedor.codigoAlternativo),
    imagem: limparTextoOpcional(dadosFornecedor.imagem)
  };

  if (dadosFornecedor.idFornecedor) {
    payload.idFornecedor = Number(dadosFornecedor.idFornecedor);
  }

  return payload;
}

function limparTextoOpcional(valor) {
  const texto = String(valor || '').trim();
  return texto || null;
}

function normalizarCodigoAlternativoFornecedorProduto(valor) {
  const digitos = String(valor ?? '').replace(/\D/g, '').trim();
  return digitos ? Number(digitos) : null;
}

function enriquecerOrdensCompraProduto(ordensCompra, idProduto, fornecedores, compradores, etapasOrdemCompra) {
  const fornecedoresPorId = new Map((fornecedores || []).map((fornecedor) => [fornecedor.idFornecedor, fornecedor.nomeFantasia || fornecedor.razaoSocial || '']));
  const compradoresPorId = new Map((compradores || []).map((comprador) => [comprador.idComprador, comprador.nome]));
  const etapasNormalizadas = normalizarEtapasOrdemCompraHistorico(etapasOrdemCompra);
  const etapasPorId = new Map(etapasNormalizadas.map((etapa) => [etapa.idEtapaOrdemCompra, etapa]));

  return (ordensCompra || [])
    .filter((ordemCompra) => Array.isArray(ordemCompra.itens) && ordemCompra.itens.some((item) => String(item.idProduto) === String(idProduto)))
    .sort((ordemCompraA, ordemCompraB) => {
      const dataHoraA = `${ordemCompraA.dataInclusao || ''}T00:00:00`;
      const dataHoraB = `${ordemCompraB.dataInclusao || ''}T00:00:00`;
      return new Date(dataHoraB).getTime() - new Date(dataHoraA).getTime();
    })
    .map((ordemCompra) => ({
      ...ordemCompra,
      totalOrdemCompra: Array.isArray(ordemCompra.itens)
        ? ordemCompra.itens.reduce((total, item) => total + (Number(item.valorTotal) || 0), 0)
        : 0,
      nomeFornecedorSnapshot: ordemCompra.nomeFornecedorSnapshot || fornecedoresPorId.get(ordemCompra.idFornecedor) || '',
      nomeCompradorSnapshot: ordemCompra.nomeCompradorSnapshot || compradoresPorId.get(ordemCompra.idComprador) || '',
      nomeEtapaOrdemCompraSnapshot: ordemCompra.nomeEtapaOrdemCompraSnapshot || etapasPorId.get(ordemCompra.idEtapaOrdemCompra)?.descricao || ''
    }));
}

function criarItensOrdensCompraProduto(ordensCompra, idProduto, filtros) {
  return (ordensCompra || []).flatMap((ordemCompra) => (
    Array.isArray(ordemCompra.itens)
      ? ordemCompra.itens
        .filter((item) => String(item.idProduto) === String(idProduto))
        .filter((item) => itemOrdemCompraAtendeFiltrosProduto(ordemCompra, item, filtros))
        .map((item, indice) => ({
          chave: `${ordemCompra.idOrdemCompra || 'ordemCompra'}-${item.idItemOrdemCompra || indice}`,
          idOrdemCompra: ordemCompra.idOrdemCompra,
          dataInclusao: ordemCompra.dataInclusao,
          dataEntrega: ordemCompra.dataEntrega,
          nomeFornecedor: ordemCompra.nomeFornecedorSnapshot || 'Fornecedor nao informado',
          referenciaProduto: item.referenciaProdutoSnapshot || '',
          descricaoProduto: item.descricaoProdutoSnapshot || 'Produto nao informado',
          valorUnitario: Number(item.valorUnitario) || 0,
          quantidade: item.quantidade || 0,
          valorTotal: Number(item.valorTotal) || 0,
          ordemCompra
        }))
      : []
  ));
}

function criarFiltrosIniciaisOrdensCompraProduto() {
  return {
    dataInclusaoInicio: '',
    dataInclusaoFim: '',
    dataEntregaInicio: '',
    dataEntregaFim: '',
    codigoOrdemCompra: '',
    prazoPagamento: '',
    referenciaProduto: '',
    descricaoProduto: '',
    idEtapaOrdemCompra: '',
    idComprador: ''
  };
}

function itemOrdemCompraAtendeFiltrosProduto(ordemCompra, item, filtros) {
  const dataInclusao = String(ordemCompra?.dataInclusao || '');
  const dataEntrega = String(ordemCompra?.dataEntrega || '');
  const codigoOrdemCompra = String(ordemCompra?.idOrdemCompra || '');
  const prazoPagamento = String(ordemCompra?.nomePrazoPagamentoSnapshot || '').toLowerCase();
  const referencia = String(item?.referenciaProdutoSnapshot || '').toLowerCase();
  const descricao = String(item?.descricaoProdutoSnapshot || '').toLowerCase();

  return (
    (!filtros.dataInclusaoInicio || dataInclusao >= filtros.dataInclusaoInicio)
    && (!filtros.dataInclusaoFim || dataInclusao <= filtros.dataInclusaoFim)
    && (!filtros.dataEntregaInicio || (dataEntrega && dataEntrega >= filtros.dataEntregaInicio))
    && (!filtros.dataEntregaFim || (dataEntrega && dataEntrega <= filtros.dataEntregaFim))
    && (!String(filtros.codigoOrdemCompra || '').trim() || codigoOrdemCompra.includes(String(filtros.codigoOrdemCompra || '').trim()))
    && (!String(filtros.prazoPagamento || '').trim() || prazoPagamento.includes(String(filtros.prazoPagamento || '').trim().toLowerCase()))
    && (!String(filtros.referenciaProduto || '').trim() || referencia.includes(String(filtros.referenciaProduto || '').trim().toLowerCase()))
    && (!String(filtros.descricaoProduto || '').trim() || descricao.includes(String(filtros.descricaoProduto || '').trim().toLowerCase()))
    && (!filtros.idEtapaOrdemCompra || String(ordemCompra?.idEtapaOrdemCompra) === String(filtros.idEtapaOrdemCompra))
    && (!filtros.idComprador || String(ordemCompra?.idComprador) === String(filtros.idComprador))
  );
}

function filtrarItensOrdensCompraDigitacaoProduto(itensOrdensCompra, pesquisa) {
  const termo = String(pesquisa || '').trim().toLowerCase();

  if (!termo) {
    return itensOrdensCompra;
  }

  return (itensOrdensCompra || []).filter((item) => [
    item.idOrdemCompra,
    item.dataInclusao,
    item.dataEntrega,
    item.nomeFornecedor,
    item.referenciaProduto,
    item.descricaoProduto,
    item.valorUnitario,
    item.quantidade,
    item.valorTotal,
    item.ordemCompra?.nomePrazoPagamentoSnapshot,
    item.ordemCompra?.nomeEtapaOrdemCompraSnapshot,
    item.ordemCompra?.nomeCompradorSnapshot
  ].some((valor) => String(valor || '').toLowerCase().includes(termo)));
}

function filtrosHistoricoEstaoAtivos(filtros, filtrosPadrao) {
  return Object.keys(filtrosPadrao).some((chave) => String(filtros?.[chave] || '') !== String(filtrosPadrao[chave] || ''));
}

function normalizarEtapasOrdemCompraHistorico(etapasOrdemCompra) {
  if (!Array.isArray(etapasOrdemCompra)) {
    return [];
  }

  return etapasOrdemCompra
    .map((etapa) => ({
      ...etapa,
      idEtapaOrdemCompra: etapa.idEtapaOrdemCompra ?? etapa.idEtapa
    }))
    .sort((etapaA, etapaB) => {
      const ordemA = obterValorOrdemEtapaHistorico(etapaA?.ordem, etapaA?.idEtapaOrdemCompra);
      const ordemB = obterValorOrdemEtapaHistorico(etapaB?.ordem, etapaB?.idEtapaOrdemCompra);

      if (ordemA !== ordemB) {
        return ordemA - ordemB;
      }

      return Number(etapaA?.idEtapaOrdemCompra || 0) - Number(etapaB?.idEtapaOrdemCompra || 0);
    });
}

function obterValorOrdemEtapaHistorico(ordem, fallback) {
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


