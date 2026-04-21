import { useEffect, useMemo, useState } from 'react';
import { Botao } from '../comuns/botao';
import { MensagemErroPopup } from '../comuns/mensagemErroPopup';
import { BotaoAcaoGrade } from '../comuns/botaoAcaoGrade';
import { CampoImagemPadrao } from '../comuns/campoImagemPadrao';
import { GradePadrao } from '../comuns/gradePadrao';
import { ModalFiltros } from '../comuns/modalFiltros';
import { atualizarContato, buscarCep, buscarCnpj } from '../../servicos/fornecedores';
import {
  listarAtendimentos,
  listarCanaisAtendimento,
  listarOrigensAtendimento
} from '../../servicos/atendimentos';
import { listarPrazosPagamentoConfiguracao, listarEtapasOrdemCompraConfiguracao } from '../../servicos/configuracoes';
import { listarEmpresas } from '../../servicos/empresa';
import { ModalOrdemCompra } from './ordensCompra-modalOrdemCompra';
import { listarOrdensCompra } from '../../servicos/ordensCompra';
import { listarProdutos } from '../../servicos/produtos';
import { listarUsuarios } from '../../servicos/usuarios';
import { normalizarTelefone } from '../../utilitarios/normalizarTelefone';
import { normalizarTextoCapitalizado, normalizarValorEntradaFormulario } from '../../utilitarios/normalizarTextoFormulario';
import {
  normalizarFiltrosPorPadrao,
  normalizarListaFiltroPersistido,
  useFiltrosPersistidos
} from '../../hooks/useFiltrosPersistidos';
import { ModalAtendimento } from './atendimentos-modalAtendimento';
import { ModalCadastroConfiguracao } from './configuracoes-modalCadastroConfiguracao';
import { ModalGruposEmpresa } from './configuracoes-modalGruposEmpresa';
import { ModalRamosAtividade } from './configuracoes-modalRamosAtividade';
import { ModalHistoricoAtendimentosFornecedor } from './fornecedores-modalHistoricoAtendimentosFornecedor';
import { ModalHistoricoOrdensCompraFornecedor } from './fornecedores-modalHistoricoOrdensCompraFornecedor';
import { ModalContatoFornecedor } from './fornecedores-modalContatoFornecedor';
import { ModalBuscaProdutos } from '../comuns/modalBuscaProdutos';
import { obterCodigoPrincipalFornecedor } from '../../utilitarios/codigoFornecedor';

const abasModalFornecedor = [
  { id: 'dadosGerais', label: 'Dados gerais' },
  { id: 'endereco', label: 'Endereco' },
  { id: 'observacoes', label: 'Observacoes' },
  { id: 'contatos', label: 'Contato' },
  { id: 'atendimento', label: 'Atendimento', abreModal: 'atendimentos' },
  { id: 'ordensCompra', label: 'Ordens de compra', abreModal: 'ordensCompra' }
];

const abasOrdensCompraFornecedor = [
  { id: 'ordensCompra', label: 'Ordens de Compra' },
  { id: 'itens', label: 'Itens da ordem de compra' }
];

const estadoInicialFormulario = {
  idComprador: '',
  idConceito: '1',
  idGrupoEmpresa: '',
  codigoAlternativo: '',
  idRamo: '',
  razaoSocial: '',
  nomeFantasia: '',
  tipo: '',
  cnpj: '',
  inscricaoEstadual: '',
  email: '',
  telefone: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  cep: '',
  observacao: '',
  imagem: '',
  status: true
};

const estadoInicialContato = {
  idContato: '',
  nome: '',
  cargo: '',
  email: '',
  telefone: '',
  whatsapp: '',
  status: true,
  principal: false
};

function criarFiltrosIniciaisHistorico() {
  const { dataInicio, dataFim } = obterPeriodoMesAtual();

  return {
    dataInicio,
    dataFim
  };
}

function criarFiltrosIniciaisAtendimentos() {
  return {
    ...criarFiltrosIniciaisHistorico(),
    horaInicioMin: '',
    horaFimMax: '',
    idCanalAtendimento: [],
    idUsuario: []
  };
}

function criarFiltrosIniciaisOrdensCompra() {
  const { dataInicio, dataFim } = obterPeriodoMesAtual();

  return {
    dataInclusaoInicio: dataInicio,
    dataInclusaoFim: dataFim,
    dataEntregaInicio: '',
    dataEntregaFim: '',
    codigoOrdemCompra: [],
    idProduto: '',
    idEtapaOrdemCompra: [],
    idComprador: []
  };
}

export function ModalFornecedor({
  aberto,
  fornecedor,
  empresa = null,
  usuarioLogado,
  codigoSugerido,
  contatos = [],
  contatosEditaveis = [],
  gruposEmpresa = [],
  contatosGruposEmpresa = [],
  compradores = [],
  ramosAtividade = [],
  conceitosFornecedor = [],
  somenteConsultaRamos = false,
  somenteConsultaGrupos = false,
  classNameCamada = 'camadaModal',
  idCompradorBloqueado,
  modo = 'novo',
  aoFechar,
  aoSalvarRamoAtividade,
  aoSalvarConceitoFornecedor,
  aoInativarRamoAtividade,
  aoInativarConceitoFornecedor,
  aoSalvarGrupoEmpresa,
  aoInativarGrupoEmpresa,
  aoSalvar
}) {
  const [formulario, definirFormulario] = useState(estadoInicialFormulario);
  const [contatosFormulario, definirContatosFormulario] = useState([]);
  const [formularioContato, definirFormularioContato] = useState(estadoInicialContato);
  const [modoContato, definirModoContato] = useState('novo');
  const [modalContatoAberto, definirModalContatoAberto] = useState(false);
  const [abaAtiva, definirAbaAtiva] = useState(abasModalFornecedor[0].id);
  const [salvando, definirSalvando] = useState(false);
  const [mensagemErro, definirMensagemErro] = useState('');
  const [buscandoCep, definirBuscandoCep] = useState(false);
  const [buscandoCnpj, definirBuscandoCnpj] = useState(false);
  const [atendimentosFornecedor, definirAtendimentosFornecedor] = useState([]);
  const [canaisAtendimento, definirCanaisAtendimento] = useState([]);
  const [origensAtendimento, definirOrigensAtendimento] = useState([]);
  const [carregandoAtendimentos, definirCarregandoAtendimentos] = useState(false);
  const [mensagemErroAtendimentos, definirMensagemErroAtendimentos] = useState('');
  const [modalFiltrosAtendimentosAberto, definirModalFiltrosAtendimentosAberto] = useState(false);
  const [atendimentoSelecionado, definirAtendimentoSelecionado] = useState(null);
  const [modalAtendimentoAberto, definirModalAtendimentoAberto] = useState(false);
  const [modalHistoricoAtendimentosAberto, definirModalHistoricoAtendimentosAberto] = useState(false);
  const [ordensCompraFornecedor, definirOrdensCompraFornecedor] = useState([]);
  const [usuariosHistorico, definirUsuariosHistorico] = useState([]);
  const [prazosPagamentoOrdensCompra, definirPrazosPagamentoOrdensCompra] = useState([]);
  const [etapasOrdemCompra, definirEtapasOrdemCompra] = useState([]);
  const [produtosOrdensCompra, definirProdutosOrdensCompra] = useState([]);
  const [empresaOrdensCompra, definirEmpresaOrdensCompra] = useState(null);
  const [carregandoOrdensCompra, definirCarregandoOrdensCompra] = useState(false);
  const [mensagemErroOrdensCompra, definirMensagemErroOrdensCompra] = useState('');
  const [modalFiltrosOrdensCompraAberto, definirModalFiltrosOrdensCompraAberto] = useState(false);
  const [modalBuscaProdutoOrdensCompraAberto, definirModalBuscaProdutoOrdensCompraAberto] = useState(false);
  const [ordemCompraSelecionado, definirOrdemCompraSelecionado] = useState(null);
  const [modalOrdemCompraAberto, definirModalOrdemCompraAberto] = useState(false);
  const [modalHistoricoOrdensCompraAberto, definirModalHistoricoOrdensCompraAberto] = useState(false);
  const [abaOrdensCompraAtiva, definirAbaOrdensCompraAtiva] = useState(abasOrdensCompraFornecedor[0].id);
  const [pesquisaRapidaAtendimentos, definirPesquisaRapidaAtendimentos] = useState('');
  const [pesquisaRapidaOrdensCompra, definirPesquisaRapidaOrdensCompra] = useState('');
  const [confirmandoSaida, definirConfirmandoSaida] = useState(false);
  const [modalRamosAtividadeAberto, definirModalRamosAtividadeAberto] = useState(false);
  const [modalConceitosFornecedorAberto, definirModalConceitosFornecedorAberto] = useState(false);
  const [modalGruposEmpresaAberto, definirModalGruposEmpresaAberto] = useState(false);
  const somenteLeitura = modo === 'consulta';
  const modoInclusao = !fornecedor;
  const compradorBloqueado = Boolean(idCompradorBloqueado);
  const tipoPessoaFisica = formulario.tipo === 'Pessoa fisica';
  const rotuloDocumento = tipoPessoaFisica ? 'CPF' : 'CNPJ';
  const compradoresAtivos = compradores.filter((comprador) => comprador.status !== 0);
  const conceitosAtivos = conceitosFornecedor.filter((conceito) => conceito.status !== 0);
  const gruposEmpresaAtivos = gruposEmpresa.filter((grupo) => grupo.status !== 0);
  const ramosAtivos = ramosAtividade.filter((ramo) => ramo.status !== 0);
  const contatosHerdados = useMemo(
    () => criarContatosHerdadosFormulario(contatosGruposEmpresa, gruposEmpresa, formulario.idGrupoEmpresa),
    [contatosGruposEmpresa, formulario.idGrupoEmpresa, gruposEmpresa]
  );
  const contatosExibicao = useMemo(
    () => [...contatosFormulario, ...contatosHerdados],
    [contatosFormulario, contatosHerdados]
  );
  const filtrosIniciaisAtendimentos = useMemo(
    () => criarFiltrosIniciaisAtendimentos(),
    [usuarioLogado?.idUsuario]
  );
  const filtrosIniciaisOrdensCompra = useMemo(
    () => criarFiltrosIniciaisOrdensCompra(),
    [usuarioLogado?.idUsuario]
  );
  const [filtrosAtendimentos, definirFiltrosAtendimentos] = useFiltrosPersistidos({
    chave: 'ModalFornecedor.atendimentos',
    usuario: usuarioLogado,
    filtrosPadrao: filtrosIniciaisAtendimentos,
    normalizarFiltros: normalizarFiltrosHistoricoFornecedor
  });
  const [filtrosOrdensCompra, definirFiltrosOrdensCompra] = useFiltrosPersistidos({
    chave: 'ModalFornecedor.ordensCompra',
    usuario: usuarioLogado,
    filtrosPadrao: filtrosIniciaisOrdensCompra,
    normalizarFiltros: normalizarFiltrosHistoricoFornecedor
  });

  useEffect(() => {
    if (!aberto) {
      return;
    }

    definirFormulario(criarFormularioFornecedor(fornecedor, idCompradorBloqueado));
    definirContatosFormulario(criarContatosFormulario(contatosEditaveis));
    definirFormularioContato(estadoInicialContato);
    definirModoContato('novo');
    definirModalContatoAberto(false);
    definirAbaAtiva(abasModalFornecedor[0].id);
    definirMensagemErro('');
    definirSalvando(false);
    definirBuscandoCep(false);
    definirBuscandoCnpj(false);
    definirAtendimentosFornecedor([]);
    definirOrdensCompraFornecedor([]);
    definirCanaisAtendimento([]);
    definirOrigensAtendimento([]);
    definirUsuariosHistorico([]);
    definirPrazosPagamentoOrdensCompra([]);
    definirEtapasOrdemCompra([]);
    definirProdutosOrdensCompra([]);
    definirEmpresaOrdensCompra(null);
    definirCarregandoAtendimentos(false);
    definirMensagemErroAtendimentos('');
    definirModalFiltrosAtendimentosAberto(false);
    definirCarregandoOrdensCompra(false);
    definirMensagemErroOrdensCompra('');
    definirModalFiltrosOrdensCompraAberto(false);
    definirModalBuscaProdutoOrdensCompraAberto(false);
    definirModalHistoricoAtendimentosAberto(false);
    definirAbaOrdensCompraAtiva(abasOrdensCompraFornecedor[0].id);
    definirAtendimentoSelecionado(null);
    definirModalAtendimentoAberto(false);
    definirOrdemCompraSelecionado(null);
    definirModalOrdemCompraAberto(false);
    definirModalHistoricoOrdensCompraAberto(false);
    definirPesquisaRapidaAtendimentos('');
    definirPesquisaRapidaOrdensCompra('');
    definirConfirmandoSaida(false);
    definirModalRamosAtividadeAberto(false);
    definirModalConceitosFornecedorAberto(false);
    definirModalGruposEmpresaAberto(false);
  }, [aberto, fornecedor?.idFornecedor, idCompradorBloqueado]);

  useEffect(() => {
    if (!aberto || !fornecedor?.idFornecedor) {
      return;
    }

    let cancelado = false;

    async function carregarHistoricoFornecedor() {
      definirCarregandoAtendimentos(true);
      definirMensagemErroAtendimentos('');
      definirCarregandoOrdensCompra(true);
      definirMensagemErroOrdensCompra('');

      try {
        const resultados = await Promise.allSettled([
          listarAtendimentos(),
          listarOrdensCompra(),
          listarUsuarios(),
          listarCanaisAtendimento(),
          listarOrigensAtendimento(),
          listarPrazosPagamentoConfiguracao(),
          listarEtapasOrdemCompraConfiguracao(),
          listarProdutos(),
          listarEmpresas()
        ]);

        if (cancelado) {
          return;
        }

        const [
          atendimentosResultado,
          ordensCompraResultado,
          usuariosResultado,
          canaisResultado,
          origensResultado,
          prazosResultado,
          etapasOrdemCompraResultado,
          produtosResultado,
          empresasResultado
        ] = resultados;

        const atendimentosCarregados = atendimentosResultado.status === 'fulfilled' ? atendimentosResultado.value : [];
        const ordensCompraCarregados = ordensCompraResultado.status === 'fulfilled' ? ordensCompraResultado.value : [];
        const usuariosCarregados = usuariosResultado.status === 'fulfilled' ? usuariosResultado.value : [];
        const canaisCarregados = canaisResultado.status === 'fulfilled' ? canaisResultado.value : [];
        const origensCarregadas = origensResultado.status === 'fulfilled' ? origensResultado.value : [];
        const prazosCarregados = prazosResultado.status === 'fulfilled' ? prazosResultado.value : [];
        const etapasOrdemCompraCarregadas = etapasOrdemCompraResultado.status === 'fulfilled' ? etapasOrdemCompraResultado.value : [];
        const produtosCarregados = produtosResultado.status === 'fulfilled' ? produtosResultado.value : [];
        const empresasCarregadas = empresasResultado.status === 'fulfilled' ? empresasResultado.value : [];

        definirUsuariosHistorico(usuariosCarregados);
        definirCanaisAtendimento(canaisCarregados);
        definirOrigensAtendimento(origensCarregadas);
        definirPrazosPagamentoOrdensCompra(prazosCarregados);
        definirEtapasOrdemCompra(normalizarEtapasOrdemCompraHistorico(etapasOrdemCompraCarregadas));
        definirProdutosOrdensCompra(produtosCarregados);
        definirEmpresaOrdensCompra(empresasCarregadas[0] || null);
        definirAtendimentosFornecedor(
          enriquecerAtendimentosFornecedor(
            atendimentosCarregados,
            fornecedor.idFornecedor,
            contatos,
            usuariosCarregados,
            canaisCarregados,
            origensCarregadas
          )
        );
        definirOrdensCompraFornecedor(
          enriquecerOrdensCompraFornecedor(
            ordensCompraCarregados,
            fornecedor.idFornecedor,
            usuariosCarregados,
            compradores,
            etapasOrdemCompraCarregadas
          )
        );
      } catch (erro) {
        if (!cancelado) {
          definirMensagemErroAtendimentos('Nao foi possivel carregar os atendimentos deste fornecedor.');
          definirMensagemErroOrdensCompra('Nao foi possivel carregar as ordens de compra deste fornecedor.');
        }
      } finally {
        if (!cancelado) {
          definirCarregandoAtendimentos(false);
          definirCarregandoOrdensCompra(false);
        }
      }
    }

    carregarHistoricoFornecedor();

    return () => {
      cancelado = true;
    };
  }, [aberto, fornecedor?.idFornecedor, contatos, compradores]);

  useEffect(() => {
    if (!aberto) {
      return undefined;
    }

    function tratarTecla(evento) {
      if (evento.key === 'Escape' && modalHistoricoAtendimentosAberto) {
        definirModalHistoricoAtendimentosAberto(false);
        return;
      }

      if (evento.key === 'Escape' && modalHistoricoOrdensCompraAberto) {
        definirModalHistoricoOrdensCompraAberto(false);
        return;
      }

      if (evento.key === 'Escape' && modalContatoAberto) {
        definirModalContatoAberto(false);
        definirModoContato('novo');
        return;
      }

      if (evento.key === 'Escape' && modalFiltrosAtendimentosAberto) {
        definirModalFiltrosAtendimentosAberto(false);
        return;
      }

      if (evento.key === 'Escape' && modalFiltrosOrdensCompraAberto) {
        definirModalFiltrosOrdensCompraAberto(false);
        return;
      }

      if (evento.key === 'Escape' && modalBuscaProdutoOrdensCompraAberto) {
        definirModalBuscaProdutoOrdensCompraAberto(false);
        return;
      }

      if (evento.key === 'Escape' && !salvando) {
        tentarFecharModal();
      }
    }

    window.addEventListener('keydown', tratarTecla);

    return () => {
      window.removeEventListener('keydown', tratarTecla);
    };
  }, [aberto, aoFechar, salvando, modalContatoAberto, modalFiltrosAtendimentosAberto, modalFiltrosOrdensCompraAberto, modalBuscaProdutoOrdensCompraAberto, modalHistoricoAtendimentosAberto, modalHistoricoOrdensCompraAberto]);

  async function submeterFormulario(evento) {
    evento.preventDefault();

    if (somenteLeitura) {
      return;
    }

    const camposObrigatorios = [
      ['idComprador', 'Selecione um comprador.'],
      ['idRamo', 'Selecione um ramo de atividade.'],
      ['idConceito', 'Selecione um conceito.'],
      ['razaoSocial', 'Informe a razao social.'],
      ['nomeFantasia', 'Informe o nome fantasia.'],
      ['tipo', 'Informe o tipo do fornecedor.'],
      ['cnpj', `Informe o ${rotuloDocumento}.`]
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
        contatos: contatosFormulario
      });
    } catch (erro) {
      definirMensagemErro(erro.message || 'Nao foi possivel salvar o fornecedor.');
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
        : name === 'telefone'
          ? normalizarTelefone(valorNormalizado)
          : name === 'codigoAlternativo'
            ? valorNormalizado.replace(/\D/g, '')
            : valorNormalizado
    }));
  }

  function alterarCampoContato(evento) {
    const { name, value, type, checked } = evento.target;
    const valorNormalizado = normalizarValorEntradaFormulario(evento);

    definirFormularioContato((estadoAtual) => ({
      ...estadoAtual,
      [name]: type === 'checkbox'
        ? checked
        : ['telefone', 'whatsapp'].includes(name) ? normalizarTelefone(valorNormalizado) : valorNormalizado
    }));
  }

  async function buscarDadosCep() {
    if (somenteLeitura) {
      return;
    }

    definirBuscandoCep(true);
    definirMensagemErro('');

    try {
      const dadosCep = await buscarCep(formulario.cep);

      definirFormulario((estadoAtual) => ({
        ...estadoAtual,
        cep: dadosCep.cep || estadoAtual.cep,
        logradouro: dadosCep.logradouro || estadoAtual.logradouro,
        complemento: dadosCep.complemento || estadoAtual.complemento,
        bairro: dadosCep.bairro || estadoAtual.bairro,
        cidade: dadosCep.localidade || estadoAtual.cidade,
        estado: dadosCep.uf || estadoAtual.estado
      }));
    } catch (erro) {
      definirMensagemErro(erro.message || 'Nao foi possivel consultar o CEP.');
      definirAbaAtiva('endereco');
    } finally {
      definirBuscandoCep(false);
    }
  }

  async function buscarDadosCnpj() {
    if (somenteLeitura || tipoPessoaFisica) {
      return;
    }

    definirBuscandoCnpj(true);
    definirMensagemErro('');

    try {
      const dadosCnpj = await buscarCnpj(formulario.cnpj);

      definirFormulario((estadoAtual) => ({
        ...estadoAtual,
        cnpj: formatarCnpj(dadosCnpj.cnpj || estadoAtual.cnpj),
        razaoSocial: dadosCnpj.razao_social || estadoAtual.razaoSocial,
        nomeFantasia: dadosCnpj.nome_fantasia || estadoAtual.nomeFantasia,
        email: dadosCnpj.email || estadoAtual.email,
        telefone: normalizarTelefone(dadosCnpj.ddd_telefone_1 || estadoAtual.telefone),
        cep: formatarCep(dadosCnpj.cep || estadoAtual.cep),
        logradouro: montarLogradouroCnpj(dadosCnpj) || estadoAtual.logradouro,
        numero: dadosCnpj.numero || estadoAtual.numero,
        complemento: dadosCnpj.complemento || estadoAtual.complemento,
        bairro: dadosCnpj.bairro || estadoAtual.bairro,
        cidade: normalizarTextoCapitalizado(dadosCnpj.municipio) || estadoAtual.cidade,
        estado: dadosCnpj.uf || estadoAtual.estado
      }));
    } catch (erro) {
      definirMensagemErro(erro.message || 'Nao foi possivel consultar o CNPJ.');
      definirAbaAtiva('dadosGerais');
    } finally {
      definirBuscandoCnpj(false);
    }
  }

  function iniciarNovoContato() {
    if (somenteLeitura) {
      return;
    }

    definirFormularioContato(estadoInicialContato);
    definirModoContato('novo');
    definirModalContatoAberto(true);
    definirMensagemErro('');
  }

  function editarContato(contato) {
    definirFormularioContato(criarFormularioContato(contato));
    definirModoContato('edicao');
    definirModalContatoAberto(true);
    definirMensagemErro('');
  }

  function consultarContato(contato) {
    definirFormularioContato(criarFormularioContato(contato));
    definirModoContato('consulta');
    definirModalContatoAberto(true);
    definirMensagemErro('');
  }

  async function inativarContato(idContato) {
    if (somenteLeitura) {
      return;
    }

    const contato = contatosFormulario.find((item) => item.idContato === idContato);

    if (typeof idContato === 'number') {
      await atualizarContato(idContato, {
        status: 0,
        principal: 0
      });
    }

    definirContatosFormulario((estadoAtual) =>
      estadoAtual.map((contato) => (
        contato.idContato === idContato
          ? { ...contato, status: false, principal: false }
          : contato
      ))
    );

    if (fornecedor?.idFornecedor && typeof idContato === 'number' && contato) {
      definirMensagemErro('');
    }
  }

  function salvarContatoLocal() {
    if (!formularioContato.nome.trim()) {
      definirMensagemErro('Informe o nome do contato.');
      definirAbaAtiva('contatos');
      return;
    }

    const identificadorContato = formularioContato.idContato || `novo-${Date.now()}`;

    definirContatosFormulario((estadoAtual) => {
      const listaSemContatoAtual = estadoAtual.filter(
        (contato) => contato.idContato !== identificadorContato
      );

      const contatoPreparado = {
        ...formularioContato,
        idContato: identificadorContato
      };

      return [...listaSemContatoAtual, contatoPreparado]
        .map((contato) => ({
          ...contato,
          principal: contatoPreparado.principal
            ? contato.idContato === identificadorContato
            : contato.principal
        }))
        .sort((contatoA, contatoB) => Number(contatoB.status) - Number(contatoA.status));
    });

    definirFormularioContato(estadoInicialContato);
    definirModoContato('novo');
    definirModalContatoAberto(false);
    definirMensagemErro('');
  }

  function consultarAtendimento(atendimento) {
    definirAtendimentoSelecionado(atendimento);
    definirModalAtendimentoAberto(true);
  }

  function consultarOrdemCompra(ordemCompra) {
    definirOrdemCompraSelecionado(ordemCompra);
    definirModalOrdemCompraAberto(true);
  }

  function abrirModalRamosAtividade() {
    if (somenteLeitura || typeof aoSalvarRamoAtividade !== 'function') {
      return;
    }

    definirModalRamosAtividadeAberto(true);
    definirMensagemErro('');
  }

  function fecharModalRamosAtividade() {
    definirModalRamosAtividadeAberto(false);
  }

  function abrirModalConceitosFornecedor() {
    if (somenteLeitura || typeof aoSalvarConceitoFornecedor !== 'function') {
      return;
    }

    definirModalConceitosFornecedorAberto(true);
    definirMensagemErro('');
  }

  function fecharModalConceitosFornecedor() {
    definirModalConceitosFornecedorAberto(false);
  }

  function abrirModalGruposEmpresa() {
    if (somenteLeitura || typeof aoSalvarGrupoEmpresa !== 'function') {
      return;
    }

    definirModalGruposEmpresaAberto(true);
    definirMensagemErro('');
  }

  function fecharModalGruposEmpresa() {
    definirModalGruposEmpresaAberto(false);
  }

  function selecionarGrupoEmpresa(registro) {
    definirFormulario((estadoAtual) => ({
      ...estadoAtual,
      idGrupoEmpresa: String(registro?.idGrupoEmpresa || '')
    }));
  }

  function selecionarRamo(registro) {
    definirFormulario((estadoAtual) => ({
      ...estadoAtual,
      idRamo: String(registro?.idRamo || estadoAtual.idRamo || '')
    }));
  }

  function selecionarConceitoFornecedor(registro) {
    definirFormulario((estadoAtual) => ({
      ...estadoAtual,
      idConceito: String(registro?.idConceito || estadoAtual.idConceito || '1')
    }));
  }

  function fecharModalAtendimento() {
    definirAtendimentoSelecionado(null);
    definirModalAtendimentoAberto(false);
  }

  function fecharModalOrdemCompra() {
    definirOrdemCompraSelecionado(null);
    definirModalOrdemCompraAberto(false);
  }

  function abrirModalHistoricoAtendimentos() {
    definirModalHistoricoAtendimentosAberto(true);
  }

  function fecharModalHistoricoAtendimentos() {
    definirModalHistoricoAtendimentosAberto(false);
  }

  function abrirModalHistoricoOrdensCompra() {
    definirModalHistoricoOrdensCompraAberto(true);
  }

  function fecharModalHistoricoOrdensCompra() {
    definirModalHistoricoOrdensCompraAberto(false);
  }

  function selecionarAbaFornecedor(aba) {
    if (aba.abreModal === 'atendimentos') {
      abrirModalHistoricoAtendimentos();
      return;
    }

    if (aba.abreModal === 'ordensCompra') {
      abrirModalHistoricoOrdensCompra();
      return;
    }

    definirAbaAtiva(aba.id);
  }

  const atendimentosFiltrados = useMemo(
    () => filtrarAtendimentosDigitacao(
      filtrarAtendimentosFornecedor(atendimentosFornecedor, filtrosAtendimentos),
      pesquisaRapidaAtendimentos
    ),
    [atendimentosFornecedor, filtrosAtendimentos, pesquisaRapidaAtendimentos]
  );
  const ordensCompraFiltrados = useMemo(
    () => filtrarOrdensCompraDigitacao(
      filtrarOrdensCompraFornecedor(ordensCompraFornecedor, filtrosOrdensCompra),
      pesquisaRapidaOrdensCompra
    ),
    [ordensCompraFornecedor, filtrosOrdensCompra, pesquisaRapidaOrdensCompra]
  );
  const itensOrdensCompraFiltrados = useMemo(
    () => filtrarItensOrdensCompraDigitacao(
      criarItensOrdensCompraFornecedor(ordensCompraFornecedor, filtrosOrdensCompra),
      pesquisaRapidaOrdensCompra
    ),
    [ordensCompraFornecedor, filtrosOrdensCompra, pesquisaRapidaOrdensCompra]
  );
  const filtrosAtendimentosAtivos = filtrosHistoricoEstaoAtivos(filtrosAtendimentos, filtrosIniciaisAtendimentos);
  const filtrosOrdensCompraAtivos = filtrosHistoricoEstaoAtivos(filtrosOrdensCompra, filtrosIniciaisOrdensCompra);

  if (!aberto) {
    return null;
  }

  return (
    <>
      <div className={classNameCamada} role="presentation" onMouseDown={fecharAoClicarNoFundo}>
        <form
          className="modalFornecedor modalFornecedor modalFornecedorComAbas ModalFornecedor ModalFornecedorComAbas"
          role="dialog"
          aria-modal="true"
          aria-labelledby="tituloModalFornecedor"
          onMouseDown={(evento) => evento.stopPropagation()}
          onSubmit={submeterFormulario}
        >
        <header className="cabecalhoModalFornecedor cabecalhoModalFornecedor">
          <h2 id="tituloModalFornecedor">
            {somenteLeitura ? 'Consultar fornecedor' : fornecedor ? 'Editar fornecedor' : 'Incluir fornecedor'}
          </h2>

          <div className="acoesCabecalhoModalFornecedor acoesCabecalhoModalFornecedor">
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

        <div className="abasModalFornecedor abasModalFornecedor" role="tablist" aria-label="Secoes do cadastro do fornecedor">
          {abasModalFornecedor.map((aba) => (
            <button
              key={aba.id}
              type="button"
              className={`abaModalFornecedor abaModalFornecedor ${abaAtiva === aba.id ? 'ativa' : ''}`}
              role={aba.abreModal ? undefined : 'tab'}
              aria-selected={aba.abreModal ? undefined : abaAtiva === aba.id}
              onClick={() => selecionarAbaFornecedor(aba)}
            >
              {aba.label}
            </button>
          ))}
        </div>

        <div className="corpoModalFornecedor corpoModalFornecedor">
          {abaAtiva === 'dadosGerais' ? (
            <section className="painelDadosGeraisFornecedor">
              <CampoImagemPadrao
                valor={formulario.imagem}
                alt={`Imagem de ${formulario.nomeFantasia || formulario.razaoSocial || 'fornecedor'}`}
                iniciais={obterIniciaisFornecedor(formulario)}
                codigo={obterCodigoPrincipalFornecedor({
                  idFornecedor: fornecedor?.idFornecedor || codigoSugerido || 0,
                  codigoAlternativo: formulario.codigoAlternativo
                }, empresa) || 0}
                disabled={somenteLeitura}
                onChange={(imagem) => definirFormulario((estadoAtual) => ({
                  ...estadoAtual,
                  imagem: imagem || estadoAtual.imagem
                }))}
              />

              <div className="gradeCamposModalFornecedor gradeCamposModalFornecedor">
                <CampoFormulario label="Razao social" name="razaoSocial" value={formulario.razaoSocial} onChange={alterarCampo} disabled={somenteLeitura} required />
                <CampoFormulario label="Nome fantasia" name="nomeFantasia" value={formulario.nomeFantasia} onChange={alterarCampo} disabled={somenteLeitura} required />
                <CampoFormulario label="Codigo alternativo" name="codigoAlternativo" value={formulario.codigoAlternativo} onChange={alterarCampo} disabled={somenteLeitura} inputMode="numeric" />
                <CampoFormularioComAcao
                  label={rotuloDocumento}
                  name="cnpj"
                  value={formulario.cnpj}
                  onChange={alterarCampo}
                  aoAcionar={buscarDadosCnpj}
                  carregando={buscandoCnpj}
                  somenteIcone
                  rotuloAcao={tipoPessoaFisica ? 'Documento sem busca automatica' : 'Buscar CNPJ'}
                  disabled={somenteLeitura || tipoPessoaFisica}
                  required
                />
                <CampoSelect
                  label="Tipo"
                  name="tipo"
                  value={formulario.tipo}
                  onChange={alterarCampo}
                  options={[
                    { valor: 'Pessoa fisica', label: 'Pessoa fisica' },
                    { valor: 'Pessoa juridica', label: 'Pessoa juridica' }
                  ]}
                  disabled={somenteLeitura}
                  required
                />
                <CampoFormulario label="Inscricao estadual" name="inscricaoEstadual" value={formulario.inscricaoEstadual} onChange={alterarCampo} disabled={somenteLeitura} />
                <CampoSelect label="Comprador" name="idComprador" value={formulario.idComprador} onChange={alterarCampo} options={compradoresAtivos.map((comprador) => ({ valor: String(comprador.idComprador), label: comprador.nome }))} disabled={somenteLeitura || compradorBloqueado} required />
                <CampoSelect
                  label="Grupo de empresa"
                  name="idGrupoEmpresa"
                  value={formulario.idGrupoEmpresa}
                  onChange={alterarCampo}
                  options={gruposEmpresaAtivos.map((grupo) => ({ valor: String(grupo.idGrupoEmpresa), label: grupo.descricao }))}
                  disabled={somenteLeitura}
                  acaoExtra={!somenteLeitura ? (
                    <Botao
                      variante="secundario"
                      icone="adicionar"
                      type="button"
                      className="botaoCampoAcao"
                      onClick={abrirModalGruposEmpresa}
                      somenteIcone
                      title="Abrir grupos de empresa"
                      aria-label="Abrir grupos de empresa"
                    >
                      Abrir grupos de empresa
                    </Botao>
                  ) : null}
                />
                <CampoSelect
                  label="Ramo de atividade"
                  name="idRamo"
                  value={formulario.idRamo}
                  onChange={alterarCampo}
                  options={ramosAtivos.map((ramo) => ({ valor: String(ramo.idRamo), label: ramo.descricao }))}
                  disabled={somenteLeitura}
                  required
                  acaoExtra={!somenteLeitura ? (
                    <Botao
                      variante="secundario"
                      icone="adicionar"
                      type="button"
                      className="botaoCampoAcao"
                      onClick={abrirModalRamosAtividade}
                      somenteIcone
                      title="Abrir ramos de atividade"
                      aria-label="Abrir ramos de atividade"
                    >
                      Abrir ramos de atividade
                    </Botao>
                  ) : null}
                />
                <CampoSelect
                  label="Conceito"
                  name="idConceito"
                  value={formulario.idConceito}
                  onChange={alterarCampo}
                  options={conceitosAtivos.map((conceito) => ({ valor: String(conceito.idConceito), label: conceito.descricao }))}
                  disabled={somenteLeitura}
                  required
                  acaoExtra={!somenteLeitura ? (
                    <Botao
                      variante="secundario"
                      icone="adicionar"
                      type="button"
                      className="botaoCampoAcao"
                      onClick={abrirModalConceitosFornecedor}
                      somenteIcone
                      title="Abrir conceitos de fornecedor"
                      aria-label="Abrir conceitos de fornecedor"
                    >
                      Abrir conceitos de fornecedor
                    </Botao>
                  ) : null}
                />
                <label className="campoCheckboxFormulario" htmlFor="status">
                  <input id="status" type="checkbox" name="status" checked={formulario.status} onChange={alterarCampo} disabled={somenteLeitura} />
                  <span>Fornecedor ativo</span>
                </label>
              </div>
            </section>
          ) : null}

          {abaAtiva === 'endereco' ? (
            <section className="gradeCamposModalFornecedor gradeCamposModalFornecedor">
              <CampoFormularioComAcao label="CEP" name="cep" value={formulario.cep} onChange={alterarCampo} aoAcionar={buscarDadosCep} carregando={buscandoCep} rotuloAcao="Buscar CEP" disabled={somenteLeitura} />
              <CampoFormulario label="Logradouro" name="logradouro" value={formulario.logradouro} onChange={alterarCampo} disabled={somenteLeitura} />
              <CampoFormulario label="Numero" name="numero" value={formulario.numero} onChange={alterarCampo} disabled={somenteLeitura} />
              <CampoFormulario label="Complemento" name="complemento" value={formulario.complemento} onChange={alterarCampo} disabled={somenteLeitura} />
              <CampoFormulario label="Bairro" name="bairro" value={formulario.bairro} onChange={alterarCampo} disabled={somenteLeitura} />
              <CampoFormulario label="Cidade" name="cidade" value={formulario.cidade} onChange={alterarCampo} disabled={somenteLeitura} />
              <CampoFormulario label="Estado" name="estado" value={formulario.estado} onChange={alterarCampo} disabled={somenteLeitura} maxLength={2} />
            </section>
          ) : null}

          {abaAtiva === 'observacoes' ? (
            <section className="gradeCamposModalFornecedor gradeCamposModalFornecedor">
              <div className="campoFormulario campoFormularioIntegral">
                <label htmlFor="observacao">Observacoes</label>
                <textarea id="observacao" name="observacao" value={formulario.observacao} onChange={alterarCampo} disabled={somenteLeitura} rows={8} className="entradaFormulario entradaFormularioTextoLongo" />
              </div>
            </section>
          ) : null}

          {abaAtiva === 'contatos' ? (
            <section className="painelContatosModalFornecedor painelContatosModalFornecedor">
              <div className="cabecalhoGradeContatosModal">
                <div>
                  <h3>Contatos cadastrados</h3>
                  {formulario.idGrupoEmpresa ? (
                    <p className="descricaoSecaoModalFornecedor descricaoSecaoModalFornecedor">Contatos do grupo selecionado aparecem com a etiqueta Grupo e ficam somente para consulta.</p>
                  ) : null}
                </div>
                <Botao
                  variante={somenteLeitura ? 'secundario' : 'primario'}
                  type="button"
                  onClick={iniciarNovoContato}
                  disabled={somenteLeitura}
                >
                  Adicionar
                </Botao>
              </div>

              <GradePadrao
                className="gradeContatosModal"
                classNameTabela="tabelaContatosModal"
                classNameMensagem="mensagemTabelaContatosModal"
                cabecalho={(
                  <tr>
                    <th>Nome</th>
                    <th>Contato</th>
                    <th></th>
                    <th className="cabecalhoAcoesContato">Acoes</th>
                  </tr>
                )}
                temItens={contatosExibicao.length > 0}
                mensagemVazia="Nenhum contato cadastrado."
              >
                {contatosExibicao.map((contato) => (
                  <tr key={contato.idContato || contato.idContatoGrupoEmpresa || contato.idTemporario}>
                    <td>
                      <div className="celulaContatoModal">
                        <strong>{contato.nome}</strong>
                        <span>{contato.cargo || 'Cargo nao informado'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="celulaContatoComunicacao">
                        <span>{contato.email || 'E-mail nao informado'}</span>
                        {contato.telefone || contato.whatsapp ? (
                          <a
                            href={montarLinkWhatsapp(contato.whatsapp || contato.telefone)}
                            target="_blank"
                            rel="noreferrer"
                            className="linkContatoWhatsapp"
                          >
                            {normalizarTelefone(contato.whatsapp || contato.telefone)}
                          </a>
                        ) : (
                          <span>Telefone nao informado</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="grupoEtiquetasContato">
                        <span className={`etiquetaStatus ${contato.status ? 'ativo' : 'inativo'}`}>
                          {contato.status ? 'Ativo' : 'Inativo'}
                        </span>
                        {contato.principal ? (
                          <span className="etiquetaStatus etiquetaPrincipal">Principal</span>
                        ) : null}
                        {contato.contatoVinculadoGrupo ? (
                          <span className="etiquetaStatus etiquetaGrupoContato">Grupo</span>
                        ) : null}
                      </div>
                    </td>
                    <td>
                      <div className="acoesContatoModal">
                        <BotaoAcaoGrade icone="consultar" titulo="Consultar contato" onClick={() => consultarContato(contato)} />
                        {!contato.contatoVinculadoGrupo ? (
                          <>
                            <BotaoAcaoGrade icone="editar" titulo="Editar contato" onClick={() => editarContato(contato)} disabled={somenteLeitura} />
                            <BotaoAcaoGrade icone="inativar" titulo="Inativar contato" onClick={() => inativarContato(contato.idContato)} disabled={somenteLeitura} />
                          </>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </GradePadrao>
            </section>
          ) : null}

        </div>

        <MensagemErroPopup mensagem={mensagemErro} titulo="Nao foi possivel salvar o fornecedor." />

        {confirmandoSaida ? (
          <div className="camadaConfirmacaoModal" role="presentation" onMouseDown={fecharConfirmacaoSaida}>
            <div
              className="modalConfirmacaoAgenda"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="tituloConfirmacaoSaidaFornecedor"
              onMouseDown={(evento) => evento.stopPropagation()}
            >
              <div className="cabecalhoConfirmacaoModal">
                <h4 id="tituloConfirmacaoSaidaFornecedor">Cancelar cadastro</h4>
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

      <ModalContatoFornecedor
        aberto={modalContatoAberto}
        modo={modoContato}
        formulario={formularioContato}
        aoAlterarCampo={alterarCampoContato}
        aoFechar={fecharModalContato}
        aoSalvar={salvarContatoLocal}
      />

      <ModalHistoricoAtendimentosFornecedor
        aberto={modalHistoricoAtendimentosAberto}
        fornecedor={fornecedor}
        carregando={carregandoAtendimentos}
        mensagemErro={mensagemErroAtendimentos}
        atendimentos={atendimentosFiltrados}
        filtrosAtivos={filtrosAtendimentosAtivos}
        valorPesquisa={pesquisaRapidaAtendimentos}
        onAlterarPesquisa={definirPesquisaRapidaAtendimentos}
        onFechar={fecharModalHistoricoAtendimentos}
        onAbrirFiltros={() => definirModalFiltrosAtendimentosAberto(true)}
        onConsultarAtendimento={consultarAtendimento}
      />

      <ModalHistoricoOrdensCompraFornecedor
        aberto={modalHistoricoOrdensCompraAberto}
        fornecedor={fornecedor}
        abaAtiva={abaOrdensCompraAtiva}
        onSelecionarAba={definirAbaOrdensCompraAtiva}
        carregando={carregandoOrdensCompra}
        mensagemErro={mensagemErroOrdensCompra}
        ordensCompra={ordensCompraFiltrados}
        itensOrdensCompra={itensOrdensCompraFiltrados}
        filtrosAtivos={filtrosOrdensCompraAtivos}
        valorPesquisa={pesquisaRapidaOrdensCompra}
        onAlterarPesquisa={definirPesquisaRapidaOrdensCompra}
        onFechar={fecharModalHistoricoOrdensCompra}
        onAbrirFiltros={() => definirModalFiltrosOrdensCompraAberto(true)}
        onConsultarOrdemCompra={consultarOrdemCompra}
      />

      <ModalRamosAtividade
        aberto={modalRamosAtividadeAberto}
        registros={ramosAtividade}
        somenteConsulta={somenteConsultaRamos}
        fecharAoSalvar
        aoFechar={fecharModalRamosAtividade}
        aoSalvar={aoSalvarRamoAtividade}
        aoInativar={aoInativarRamoAtividade}
        aoSelecionarRamo={selecionarRamo}
      />

      <ModalCadastroConfiguracao
        aberto={modalConceitosFornecedorAberto}
        titulo="Conceitos de fornecedor"
        rotuloIncluir="Incluir conceito"
        registros={conceitosFornecedor}
        chavePrimaria="idConceito"
        somenteConsulta={false}
        camadaSecundaria
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
            disabled: ({ registroSelecionado }) => Number(registroSelecionado?.idConceito) === 1
          }
        ]}
        aoFechar={fecharModalConceitosFornecedor}
        aoSalvar={aoSalvarConceitoFornecedor}
        aoInativar={aoInativarConceitoFornecedor}
        aoSalvarConcluido={selecionarConceitoFornecedor}
        podeInativarRegistro={(registro) => Number(registro?.idConceito) !== 1}
      />

      <ModalGruposEmpresa
        aberto={modalGruposEmpresaAberto}
        registros={gruposEmpresa}
        contatosGruposEmpresa={contatosGruposEmpresa}
        somenteConsulta={somenteConsultaGrupos}
        fecharAoSalvar
        aoFechar={fecharModalGruposEmpresa}
        aoSalvar={aoSalvarGrupoEmpresa}
        aoInativar={aoInativarGrupoEmpresa}
        aoSelecionarGrupo={selecionarGrupoEmpresa}
      />

      <ModalAtendimento
        aberto={modalAtendimentoAberto}
        atendimento={atendimentoSelecionado}
        fornecedores={fornecedor ? [fornecedor] : []}
        contatos={contatos}
        usuarioLogado={null}
        canaisAtendimento={canaisAtendimento}
        origensAtendimento={origensAtendimento}
        modo="consulta"
        classNameCamada="camadaModalContato"
        aoFechar={fecharModalAtendimento}
        aoSalvar={async () => {}}
      />

      <ModalFiltros
        aberto={modalFiltrosAtendimentosAberto}
        titulo="Filtros de atendimentos"
        filtros={filtrosAtendimentos}
        campos={[
          {
            name: 'periodoAtendimentos',
            label: 'Data e horario',
            type: 'date-filters-modal',
            placeholder: 'Selecionar periodo',
            tituloSelecao: 'Filtros de data e horario do atendimento',
            periodos: [
              {
                titulo: 'Data do atendimento',
                nomeInicio: 'dataInicio',
                nomeFim: 'dataFim',
                labelInicio: 'Inicio do periodo',
                labelFim: 'Fim do periodo',
                tipoInicio: 'date',
                tipoFim: 'date'
              },
              {
                titulo: 'Horario do atendimento',
                nomeInicio: 'horaInicioMin',
                nomeFim: 'horaFimMax',
                labelInicio: 'Inicio a partir de',
                labelFim: 'Fim ate',
                tipoInicio: 'time',
                tipoFim: 'time'
              }
            ]
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
            name: 'idUsuario',
            label: 'Usuario',
            multiple: true,
            placeholder: 'Todos os usuarios',
            options: usuariosHistorico.map((usuario) => ({
              valor: String(usuario.idUsuario),
              label: usuario.nome
            }))
          }
        ]}
        aoFechar={() => definirModalFiltrosAtendimentosAberto(false)}
        aoAplicar={(proximosFiltros) => {
          definirFiltrosAtendimentos(proximosFiltros);
          definirModalFiltrosAtendimentosAberto(false);
        }}
        aoLimpar={() => definirFiltrosAtendimentos(filtrosIniciaisAtendimentos)}
      />

      <ModalOrdemCompra
        aberto={modalOrdemCompraAberto}
        ordemCompra={ordemCompraSelecionado}
        fornecedores={fornecedor ? [fornecedor] : []}
        contatos={contatos}
        usuarios={usuariosHistorico}
        compradores={compradores}
        prazosPagamento={prazosPagamentoOrdensCompra}
        etapasOrdemCompra={etapasOrdemCompra}
        produtos={produtosOrdensCompra}
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
        titulo="Filtros de ordens de compra"
        filtros={filtrosOrdensCompra}
        campos={[
          {
            name: 'periodoOrdensCompraFornecedor',
            label: 'Datas',
            type: 'date-filters-modal',
            placeholder: 'Selecionar datas',
            tituloSelecao: 'Filtros de datas das ordens de compra',
            periodos: [
              {
                titulo: 'Data de inclusao',
                nomeInicio: 'dataInclusaoInicio',
                nomeFim: 'dataInclusaoFim',
                labelInicio: 'Inicio da inclusao',
                labelFim: 'Fim da inclusao',
                tipoInicio: 'date',
                tipoFim: 'date'
              },
              {
                titulo: 'Data de entrega',
                nomeInicio: 'dataEntregaInicio',
                nomeFim: 'dataEntregaFim',
                labelInicio: 'Inicio da entrega',
                labelFim: 'Fim da entrega',
                tipoInicio: 'date',
                tipoFim: 'date'
              }
            ]
          },
          {
            name: 'codigoOrdemCompra',
            label: 'Ordem de Compra',
            multiple: true,
            placeholder: 'Todos as ordens de compra',
            options: ordensCompraFornecedor.map((ordemCompra) => ({
              valor: String(ordemCompra.idOrdemCompra),
              label: `#${String(ordemCompra.idOrdemCompra || '').padStart(4, '0')} - ${ordemCompra.dataInclusao || '-'}`
            }))
          },
          {
            name: 'idProduto',
            label: 'Produto',
            type: 'busca-modal',
            placeholder: 'Todos os produtos',
            onClick: () => definirModalBuscaProdutoOrdensCompraAberto(true),
            obterResumo: (formularioAtual) => obterResumoProdutoHistorico(formularioAtual?.idProduto, produtosOrdensCompra)
          },
          {
            name: 'idEtapaOrdemCompra',
            label: 'Etapa',
            multiple: true,
            placeholder: 'Todas as etapas',
            options: etapasOrdemCompra.map((etapa) => ({
              valor: String(etapa.idEtapaOrdemCompra),
              label: etapa.descricao
            }))
          },
          {
            name: 'idComprador',
            label: 'Comprador',
            multiple: true,
            placeholder: 'Todos os compradores',
            options: compradores.map((comprador) => ({
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
        aoLimpar={() => definirFiltrosOrdensCompra(filtrosIniciaisOrdensCompra)}
      />

      <ModalBuscaProdutos
        aberto={modalBuscaProdutoOrdensCompraAberto}
        produtos={produtosOrdensCompra}
        aoSelecionar={(produto) => {
          definirFiltrosOrdensCompra((estadoAtual) => ({
            ...estadoAtual,
            idProduto: String(produto?.idProduto || '')
          }));
          definirModalBuscaProdutoOrdensCompraAberto(false);
        }}
        aoFechar={() => definirModalBuscaProdutoOrdensCompraAberto(false)}
      />
    </>
  );

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

  function fecharModalContato() {
    definirModalContatoAberto(false);
    definirModoContato('novo');
  }

}

function normalizarFiltrosHistoricoFornecedor(filtros, filtrosPadrao) {
  const filtrosNormalizados = normalizarFiltrosPorPadrao(filtros, filtrosPadrao);
  if ('dataInclusaoInicio' in filtrosPadrao || 'dataEntregaInicio' in filtrosPadrao) {
    const dataInclusaoInicio = filtrosNormalizados.dataInclusaoInicio || filtrosPadrao.dataInclusaoInicio;
    const dataInclusaoFim = filtrosNormalizados.dataInclusaoFim || filtrosPadrao.dataInclusaoFim;
    const dataEntregaInicio = filtrosNormalizados.dataEntregaInicio || filtrosPadrao.dataEntregaInicio;
    const dataEntregaFim = filtrosNormalizados.dataEntregaFim || filtrosPadrao.dataEntregaFim;

    return {
      ...filtrosNormalizados,
      dataInclusaoInicio: dataInclusaoInicio && dataInclusaoFim && dataInclusaoInicio > dataInclusaoFim ? dataInclusaoFim : dataInclusaoInicio,
      dataInclusaoFim: dataInclusaoInicio && dataInclusaoFim && dataInclusaoInicio > dataInclusaoFim ? dataInclusaoInicio : dataInclusaoFim,
      dataEntregaInicio: dataEntregaInicio && dataEntregaFim && dataEntregaInicio > dataEntregaFim ? dataEntregaFim : dataEntregaInicio,
      dataEntregaFim: dataEntregaInicio && dataEntregaFim && dataEntregaInicio > dataEntregaFim ? dataEntregaInicio : dataEntregaFim,
      codigoOrdemCompra: normalizarListaFiltroPersistido(filtrosNormalizados.codigoOrdemCompra),
      idEtapaOrdemCompra: normalizarListaFiltroPersistido(filtrosNormalizados.idEtapaOrdemCompra),
      idComprador: normalizarListaFiltroPersistido(filtrosNormalizados.idComprador)
    };
  }

  const dataInicio = filtrosNormalizados.dataInicio || filtrosPadrao.dataInicio;
  const dataFim = filtrosNormalizados.dataFim || filtrosPadrao.dataFim;

  if (dataInicio && dataFim && dataInicio > dataFim) {
    return {
      ...filtrosNormalizados,
      dataInicio: dataFim,
      dataFim: dataInicio,
      idCanalAtendimento: normalizarListaFiltroPersistido(filtrosNormalizados.idCanalAtendimento),
      idUsuario: normalizarListaFiltroPersistido(filtrosNormalizados.idUsuario)
    };
  }

  return {
    ...filtrosNormalizados,
    dataInicio,
    dataFim,
    idCanalAtendimento: normalizarListaFiltroPersistido(filtrosNormalizados.idCanalAtendimento),
    idUsuario: normalizarListaFiltroPersistido(filtrosNormalizados.idUsuario)
  };
}

function CampoFormulario({ label, name, type = 'text', className = '', ...props }) {
  return (
    <div className={`campoFormulario ${className}`.trim()}>
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} className="entradaFormulario" {...props} />
    </div>
  );
}

function CampoFormularioComAcao({
  label,
  name,
  aoAcionar,
  carregando,
  rotuloAcao,
  somenteIcone = false,
  disabled = false,
  ...props
}) {
  return (
    <div className="campoFormulario">
      <label htmlFor={name}>{label}</label>
      <div className="campoComAcao">
        <input id={name} name={name} type="text" className="entradaFormulario" disabled={disabled} {...props} />
        <Botao variante="secundario" icone="pesquisa" type="button" className="botaoCampoAcao" onClick={aoAcionar} disabled={carregando || disabled} somenteIcone={somenteIcone} title={rotuloAcao} aria-label={rotuloAcao}>
          {carregando ? 'Buscando...' : rotuloAcao}
        </Botao>
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

function criarFormularioFornecedor(fornecedor, idCompradorBloqueado) {
  if (!fornecedor) {
    return {
      ...estadoInicialFormulario,
      idConceito: '1',
      idComprador: idCompradorBloqueado ? String(idCompradorBloqueado) : ''
    };
  }

  return {
    idComprador: String(fornecedor.idComprador || ''),
    idConceito: String(fornecedor.idConceito || 1),
    idGrupoEmpresa: String(fornecedor.idGrupoEmpresa || ''),
    codigoAlternativo: String(fornecedor.codigoAlternativo || ''),
    idRamo: String(fornecedor.idRamo || ''),
    razaoSocial: fornecedor.razaoSocial || '',
    nomeFantasia: fornecedor.nomeFantasia || '',
    tipo: fornecedor.tipo || '',
    cnpj: fornecedor.cnpj || '',
    inscricaoEstadual: fornecedor.inscricaoEstadual || '',
    email: fornecedor.email || '',
    telefone: fornecedor.telefone || '',
    logradouro: fornecedor.logradouro || '',
    numero: fornecedor.numero || '',
    complemento: fornecedor.complemento || '',
    bairro: fornecedor.bairro || '',
    cidade: fornecedor.cidade || '',
    estado: fornecedor.estado || '',
    cep: fornecedor.cep || '',
    observacao: fornecedor.observacao || '',
    imagem: fornecedor.imagem || '',
    status: Boolean(fornecedor.status)
  };
}

function criarContatosFormulario(contatos) {
  return (contatos || []).map((contato) => ({
    idContato: contato.idContato,
    nome: contato.nome || '',
    cargo: contato.cargo || '',
    email: contato.email || '',
    telefone: contato.telefone || '',
    whatsapp: contato.whatsapp || '',
    status: Boolean(contato.status),
    principal: Boolean(contato.principal)
  }));
}

function criarContatosHerdadosFormulario(contatosGruposEmpresa, gruposEmpresa, idGrupoEmpresa) {
  if (!idGrupoEmpresa) {
    return [];
  }

  const nomeGrupo = (gruposEmpresa || []).find(
    (grupo) => String(grupo.idGrupoEmpresa) === String(idGrupoEmpresa)
  )?.descricao;

  return (contatosGruposEmpresa || [])
    .filter((contato) => String(contato.idGrupoEmpresa) === String(idGrupoEmpresa))
    .map((contato) => ({
      idContato: '',
      idContatoGrupoEmpresa: contato.idContatoGrupoEmpresa,
      nome: contato.nome || '',
      cargo: contato.cargo || nomeGrupo || '',
      email: contato.email || '',
      telefone: contato.telefone || '',
      whatsapp: contato.whatsapp || '',
      status: Boolean(contato.status),
      principal: Boolean(contato.principal),
      contatoVinculadoGrupo: true
    }));
}

function criarFormularioContato(contato) {
  if (!contato) {
    return estadoInicialContato;
  }

  return {
    idContato: contato.idContato || '',
    nome: contato.nome || '',
    cargo: contato.cargo || '',
    email: contato.email || '',
    telefone: contato.telefone || '',
    whatsapp: contato.whatsapp || '',
    status: Boolean(contato.status),
    principal: Boolean(contato.principal)
  };
}

function obterIniciaisFornecedor(fornecedor) {
  const nomeBase = fornecedor.nomeFantasia || fornecedor.razaoSocial || 'fornecedor';

  return nomeBase
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase())
    .join('');
}

function formatarCep(cep) {
  const digitos = String(cep || '').replace(/\D/g, '').slice(0, 8);

  if (digitos.length <= 5) {
    return digitos;
  }

  return `${digitos.slice(0, 5)}-${digitos.slice(5)}`;
}

function formatarCnpj(cnpj) {
  const digitos = String(cnpj || '').replace(/\D/g, '').slice(0, 14);

  return digitos
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

function montarLogradouroCnpj(dadosCnpj) {
  const partes = [
    normalizarTextoCapitalizado(dadosCnpj.descricao_tipo_de_logradouro),
    normalizarTextoCapitalizado(dadosCnpj.logradouro)
  ].filter(Boolean);

  return partes.join(' ');
}


function montarLinkWhatsapp(telefone) {
  const digitos = String(telefone || '').replace(/\D/g, '');

  if (!digitos) {
    return '#';
  }

  const telefoneComPais = digitos.startsWith('55') ? digitos : `55${digitos}`;

  return `https://wa.me/${telefoneComPais}`;
}

function enriquecerAtendimentosFornecedor(
  atendimentos,
  idFornecedor,
  contatos,
  usuarios,
  canaisAtendimento,
  origensAtendimento
) {
  const contatosPorId = new Map(
    (contatos || []).map((contato) => [contato.idContato, contato.nome])
  );
  const usuariosPorId = new Map(
    (usuarios || []).map((usuario) => [usuario.idUsuario, usuario.nome])
  );
  const canaisPorId = new Map(
    (canaisAtendimento || []).map((canal) => [canal.idCanalAtendimento, canal.descricao])
  );
  const origensPorId = new Map(
    (origensAtendimento || []).map((origem) => [origem.idOrigemAtendimento, origem.descricao])
  );

  return (atendimentos || [])
    .filter((atendimento) => String(atendimento.idFornecedor) === String(idFornecedor))
    .sort(ordenarAtendimentosMaisRecentes)
    .slice(0, 30)
    .map((atendimento) => ({
      ...atendimento,
      nomeContato: contatosPorId.get(atendimento.idContato) || '',
      nomeUsuario: usuariosPorId.get(atendimento.idUsuario) || 'Nao informado',
      nomeCanalAtendimento: canaisPorId.get(atendimento.idCanalAtendimento) || 'Nao informado',
      nomeOrigemAtendimento: origensPorId.get(atendimento.idOrigemAtendimento) || 'Nao informado'
    }));
}

function enriquecerOrdensCompraFornecedor(ordensCompra, idFornecedor, usuarios, compradores, etapasOrdemCompra) {
  const usuariosPorId = new Map(
    (usuarios || []).map((usuario) => [usuario.idUsuario, usuario.nome])
  );
  const compradoresPorId = new Map(
    (compradores || []).map((comprador) => [comprador.idComprador, comprador.nome])
  );
  const etapasNormalizadas = normalizarEtapasOrdemCompraHistorico(etapasOrdemCompra);
  const etapasPorId = new Map(
    etapasNormalizadas.map((etapa) => [etapa.idEtapaOrdemCompra, etapa])
  );

  return (ordensCompra || [])
    .filter((ordemCompra) => String(ordemCompra.idFornecedor) === String(idFornecedor))
    .sort((ordemCompraA, ordemCompraB) => {
      const dataHoraA = `${ordemCompraA.dataInclusao || ''}T00:00:00`;
      const dataHoraB = `${ordemCompraB.dataInclusao || ''}T00:00:00`;
      return new Date(dataHoraB).getTime() - new Date(dataHoraA).getTime();
    })
    .slice(0, 30)
    .map((ordemCompra) => ({
      ...ordemCompra,
      totalOrdemCompra: Array.isArray(ordemCompra.itens)
        ? ordemCompra.itens.reduce((total, item) => total + (Number(item.valorTotal) || 0), 0)
        : 0,
      nomeUsuarioSnapshot: ordemCompra.nomeUsuarioSnapshot || usuariosPorId.get(ordemCompra.idUsuario) || '',
      nomeCompradorSnapshot: ordemCompra.nomeCompradorSnapshot || compradoresPorId.get(ordemCompra.idComprador) || '',
      nomeEtapaOrdemCompraSnapshot: ordemCompra.nomeEtapaOrdemCompraSnapshot || etapasPorId.get(ordemCompra.idEtapaOrdemCompra)?.descricao || ''
    }));
}

function criarItensOrdensCompraFornecedor(ordensCompra, filtros = {}) {
  return (ordensCompra || []).flatMap((ordemCompra) => (
    Array.isArray(ordemCompra.itens) ? ordemCompra.itens
      .filter((item) => itemOrdemCompraFornecedorAtendeFiltros(item, filtros))
      .map((item, indice) => ({
      chave: `${ordemCompra.idOrdemCompra || 'ordemCompra'}-${item.idItemOrdemCompra || indice}`,
      idOrdemCompra: ordemCompra.idOrdemCompra,
      dataInclusao: ordemCompra.dataInclusao,
      dataEntrega: ordemCompra.dataEntrega,
      ordemCompra,
      referenciaProduto: item.referenciaProdutoSnapshot || '',
      descricaoProduto: item.descricaoProdutoSnapshot || 'Produto nao informado',
      valorUnitario: Number(item.valorUnitario) || 0,
      quantidade: item.quantidade || 0,
      valorTotal: Number(item.valorTotal) || 0
    })) : []
  ));
}

function filtrarAtendimentosFornecedor(atendimentos, filtros) {
  return (atendimentos || []).filter((atendimento) => {
    const data = String(atendimento.data || '');
    const horaInicio = String(atendimento.horaInicio || '');
    const horaFim = String(atendimento.horaFim || '');
    const canaisSelecionados = Array.isArray(filtros.idCanalAtendimento) ? filtros.idCanalAtendimento : [];
    const usuariosSelecionados = Array.isArray(filtros.idUsuario) ? filtros.idUsuario : [];

    return (
      (!filtros.dataInicio || data >= filtros.dataInicio)
      && (!filtros.dataFim || data <= filtros.dataFim)
      && (!filtros.horaInicioMin || (horaInicio && horaInicio >= filtros.horaInicioMin))
      && (!filtros.horaFimMax || (horaFim && horaFim <= filtros.horaFimMax))
      && (canaisSelecionados.length === 0 || canaisSelecionados.includes(String(atendimento.idCanalAtendimento)))
      && (usuariosSelecionados.length === 0 || usuariosSelecionados.includes(String(atendimento.idUsuario)))
    );
  });
}

function filtrarOrdensCompraFornecedor(ordensCompra, filtros) {
  return (ordensCompra || []).filter((ordemCompra) => {
    const dataInclusao = String(ordemCompra.dataInclusao || '');
    const dataEntrega = String(ordemCompra.dataEntrega || '');
    const ordensCompraSelecionados = Array.isArray(filtros.codigoOrdemCompra) ? filtros.codigoOrdemCompra : [];
    const etapasSelecionadas = Array.isArray(filtros.idEtapaOrdemCompra) ? filtros.idEtapaOrdemCompra : [];
    const compradoresSelecionados = Array.isArray(filtros.idComprador) ? filtros.idComprador : [];

    return (
      (!filtros.dataInclusaoInicio || dataInclusao >= filtros.dataInclusaoInicio)
      && (!filtros.dataInclusaoFim || dataInclusao <= filtros.dataInclusaoFim)
      && (!filtros.dataEntregaInicio || (dataEntrega && dataEntrega >= filtros.dataEntregaInicio))
      && (!filtros.dataEntregaFim || (dataEntrega && dataEntrega <= filtros.dataEntregaFim))
      && (ordensCompraSelecionados.length === 0 || ordensCompraSelecionados.includes(String(ordemCompra.idOrdemCompra)))
      && ordemCompraTemItemCompativelComFiltrosOrdemCompra(ordemCompra, filtros)
      && (etapasSelecionadas.length === 0 || etapasSelecionadas.includes(String(ordemCompra.idEtapaOrdemCompra)))
      && (compradoresSelecionados.length === 0 || compradoresSelecionados.includes(String(ordemCompra.idComprador)))
    );
  });
}

function itemOrdemCompraFornecedorAtendeFiltros(item, filtros) {
  if (!String(filtros.idProduto || '').trim()) {
    return true;
  }

  return String(item?.idProduto || '') === String(filtros.idProduto || '');
}

function ordemCompraTemItemCompativelComFiltrosOrdemCompra(ordemCompra, filtros) {
  const possuiFiltroItem = Boolean(String(filtros.idProduto || '').trim());

  if (!possuiFiltroItem) {
    return true;
  }

  return Array.isArray(ordemCompra?.itens) && ordemCompra.itens.some((item) => itemOrdemCompraFornecedorAtendeFiltros(item, filtros));
}

function obterResumoProdutoHistorico(idProduto, produtos) {
  if (!String(idProduto || '').trim()) {
    return 'Todos os produtos';
  }

  const produtoSelecionado = (produtos || []).find((produto) => String(produto.idProduto) === String(idProduto));

  if (!produtoSelecionado) {
    return 'Produto selecionado';
  }

  const codigo = String(produtoSelecionado.idProduto || '').padStart(4, '0');
  const referencia = produtoSelecionado.referencia || '-';
  const descricao = produtoSelecionado.descricao || '-';

  return `#${codigo} - ${referencia} - ${descricao}`;
}

function filtrarAtendimentosDigitacao(atendimentos, pesquisa) {
  const termo = normalizarTextoBuscaHistorico(pesquisa);

  if (!termo) {
    return atendimentos;
  }

  return (atendimentos || []).filter((atendimento) => [
    atendimento.data,
    atendimento.horaInicio,
    atendimento.horaFim,
    atendimento.assunto,
    atendimento.nomeContato,
    atendimento.nomeCanalAtendimento,
    atendimento.nomeUsuario
  ].some((valor) => textoIncluiBuscaHistorico(valor, termo)));
}

function filtrarOrdensCompraDigitacao(ordensCompra, pesquisa) {
  const termo = normalizarTextoBuscaHistorico(pesquisa);

  if (!termo) {
    return ordensCompra;
  }

  return (ordensCompra || []).filter((ordemCompra) => {
    const valoresOrdemCompra = [
      ordemCompra.idOrdemCompra,
      ordemCompra.dataInclusao,
      ordemCompra.dataEntrega,
      ordemCompra.nomeFornecedorSnapshot,
      ordemCompra.nomeEtapaOrdemCompraSnapshot,
      ordemCompra.nomeCompradorSnapshot,
      ordemCompra.nomePrazoPagamentoSnapshot,
      ordemCompra.totalOrdemCompra
    ];

    if (valoresOrdemCompra.some((valor) => textoIncluiBuscaHistorico(valor, termo))) {
      return true;
    }

    return Array.isArray(ordemCompra?.itens) && ordemCompra.itens.some((item) => [
      item.referenciaProdutoSnapshot,
      item.descricaoProdutoSnapshot
    ].some((valor) => textoIncluiBuscaHistorico(valor, termo)));
  });
}

function filtrarItensOrdensCompraDigitacao(itensOrdensCompra, pesquisa) {
  const termo = normalizarTextoBuscaHistorico(pesquisa);

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
    item.valorTotal
  ].some((valor) => textoIncluiBuscaHistorico(valor, termo)));
}

function normalizarTextoBuscaHistorico(valor) {
  return String(valor || '').trim().toLowerCase();
}

function textoIncluiBuscaHistorico(valor, termo) {
  return String(valor || '').toLowerCase().includes(termo);
}


function filtrosHistoricoEstaoAtivos(filtros, filtrosIniciais) {
  return JSON.stringify(filtros) !== JSON.stringify(filtrosIniciais);
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

function ordenarAtendimentosMaisRecentes(atendimentoA, atendimentoB) {
  const dataHoraA = `${atendimentoA.data || ''}T${atendimentoA.horaInicio || '00:00'}`;
  const dataHoraB = `${atendimentoB.data || ''}T${atendimentoB.horaInicio || '00:00'}`;

  return new Date(dataHoraB).getTime() - new Date(dataHoraA).getTime();
}

function formatarDataAtendimento(data) {
  if (!data) {
    return 'Nao informada';
  }

  return new Intl.DateTimeFormat('pt-BR').format(new Date(`${data}T00:00:00`));
}

function obterPeriodoMesAtual() {
  const agora = new Date();
  const inicio = new Date(agora.getFullYear(), agora.getMonth(), 1);
  const fim = new Date(agora.getFullYear(), agora.getMonth() + 1, 0);

  return {
    dataInicio: formatarDataInput(inicio),
    dataFim: formatarDataInput(fim)
  };
}

function formatarDataInput(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');

  return `${ano}-${mes}-${dia}`;
}
