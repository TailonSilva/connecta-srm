import { useEffect, useMemo, useRef, useState } from 'react';
import { Botao } from '../comuns/botao';
import { MensagemErroPopup } from '../comuns/mensagemErroPopup';
import { ModalBuscaFornecedores } from '../comuns/modalBuscaFornecedores';
import { ModalBuscaContatos } from '../comuns/modalBuscaContatos';
import { ModalFornecedor as ModalFornecedor } from './fornecedores-modalFornecedor';
import { ModalCotacao } from './cotacoes-modalCotacao';
import { formatarCodigoFornecedor } from '../../utilitarios/codigoFornecedor';
import { formatarNomeContato } from '../../utilitarios/formatarNomeContato';
import { normalizarValorEntradaFormulario } from '../../utilitarios/normalizarTextoFormulario';
import { obterEtapasCotacaoParaInputManual } from '../../utilitarios/etapasCotacao';

const estadoInicialFormulario = {
  idFornecedor: '',
  idContato: '',
  idCotacao: '',
  idEtapaCotacao: '',
  idUsuario: '',
  nomeUsuario: '',
  idTipoAtendimento: '',
  assunto: '',
  descricao: '',
  data: '',
  horaInicio: '',
  horaFim: '',
  idCanalAtendimento: '',
  idOrigemAtendimento: ''
};

const ID_ETAPA_COTACAO_FECHAMENTO = 1;
const ID_ETAPA_COTACAO_FECHADO_SEM_ORDEM_COMPRA = 2;
const ID_TIPO_ORDEM_COMPRA_VENDA = 1;

export function ModalAtendimento({
  aberto,
  atendimento,
  fornecedores = [],
  contatos = [],
  usuarioLogado,
  compradores = [],
  ramosAtividade = [],
  conceitosFornecedor = [],
  tiposAtendimento = [],
  canaisAtendimento = [],
  origensAtendimento = [],
  modo = 'novo',
  permitirExcluir = false,
  idCompradorBloqueado = null,
  aoIncluirFornecedor,
  aoIncluirCotacao,
  aoAtualizarCotacao,
  aoAtualizarStatusCotacao,
  aoAbrirOrdemCompra,
  dadosCotacao,
  fornecedoresCotacao = [],
  contatosCotacao = [],
  usuariosCotacao = [],
  compradoresCotacao = [],
  metodosPagamento = [],
  prazosPagamento = [],
  etapasCotacao = [],
  cotacoes = [],
  produtos = [],
  camposCotacao = [],
  camposOrdemCompra = [],
  empresa,
  somenteConsultaPrazos = false,
  etapaCotacaoAtualizadaExternamente = null,
  classNameCamada = 'camadaModalContato camadaModalAtendimento',
  aoSalvarPrazoPagamento,
  aoInativarPrazoPagamento,
  aoFechar,
  aoSalvar,
  aoExcluir
}) {
  const [formulario, definirFormulario] = useState(estadoInicialFormulario);
  const [salvando, definirSalvando] = useState(false);
  const [mensagemErro, definirMensagemErro] = useState('');
  const [confirmandoExclusao, definirConfirmandoExclusao] = useState(false);
  const [confirmandoSaida, definirConfirmandoSaida] = useState(false);
  const [modalFornecedorAberto, definirModalFornecedorAberto] = useState(false);
  const [modalBuscaFornecedorAberto, definirModalBuscaFornecedorAberto] = useState(false);
  const [modalBuscaContatoAberto, definirModalBuscaContatoAberto] = useState(false);
  const referenciaCampoFornecedor = useRef(null);
  const referenciaCampoContato = useRef(null);
  const [contatosCriadosLocalmente, definirContatosCriadosLocalmente] = useState([]);
  const [modalCotacaoAberto, definirModalCotacaoAberto] = useState(false);
  const [modoModalCotacao, definirModoModalCotacao] = useState('novo');
  const [cotacaoSelecionado, definirCotacaoSelecionado] = useState(null);
  const [confirmandoOrdemCompraCotacao, definirConfirmandoOrdemCompraCotacao] = useState(null);
  const somenteLeitura = modo === 'consulta';
  const modoInclusao = modo === 'novo';
  const modoEdicao = modo === 'edicao';
  const listaFornecedores = Array.isArray(fornecedores) ? fornecedores : fornecedores;
  const fornecedoresAtivos = listaFornecedores.filter((fornecedor) => fornecedor.status !== 0);
  const contatosAtivos = contatos.filter((contato) => contato.status !== 0);
  const tiposAtendimentoAtivos = tiposAtendimento.filter((tipoAtendimento) => tipoAtendimento.status !== 0);
  const canaisAtivos = canaisAtendimento.filter((canal) => canal.status !== 0);
  const origensAtivas = origensAtendimento.filter((origem) => origem.status !== 0);
  const etapasCotacaoAtivas = useMemo(
    () => ordenarEtapasPorOrdem(etapasCotacao.filter((etapa) => etapa.status !== 0), 'idEtapaCotacao'),
    [etapasCotacao]
  );
  const etapasCotacaoDisponiveisEscolhaManual = useMemo(
    () => obterEtapasCotacaoParaInputManual(etapasCotacaoAtivas, formulario.idEtapaCotacao),
    [etapasCotacaoAtivas, formulario.idEtapaCotacao]
  );

  useEffect(() => {
    if (!aberto) {
      return;
    }

    definirFormulario(criarFormularioInicial(atendimento, usuarioLogado));
    definirSalvando(false);
    definirMensagemErro('');
    definirConfirmandoExclusao(false);
    definirConfirmandoSaida(false);
    definirModalFornecedorAberto(false);
    definirModalBuscaFornecedorAberto(false);
    definirModalBuscaContatoAberto(false);
    definirContatosCriadosLocalmente([]);
    definirModalCotacaoAberto(false);
    definirModoModalCotacao('novo');
    definirCotacaoSelecionado(null);
    definirConfirmandoOrdemCompraCotacao(null);
  }, [aberto, atendimento, usuarioLogado]);

  useEffect(() => {
    if (!etapaCotacaoAtualizadaExternamente?.idCotacao) {
      return;
    }

    definirFormulario((estadoAtual) => (
      String(estadoAtual.idCotacao || '') === String(etapaCotacaoAtualizadaExternamente.idCotacao)
        ? {
          ...estadoAtual,
          idEtapaCotacao: String(etapaCotacaoAtualizadaExternamente.idEtapaCotacao || '')
        }
        : estadoAtual
    ));
  }, [etapaCotacaoAtualizadaExternamente]);

  useEffect(() => {
    if (!aberto) {
      return undefined;
    }

    function tratarTecla(evento) {
      if (evento.key === 'Escape' && !salvando) {
        if (modalFornecedorAberto) {
          return;
        }

        if (modalCotacaoAberto) {
          return;
        }


        if (confirmandoOrdemCompraCotacao) {
          definirConfirmandoOrdemCompraCotacao(null);
          return;
        }

        if (modalBuscaFornecedorAberto) {
          fecharModalBuscaFornecedor();
          return;
        }

        if (modalBuscaContatoAberto) {
          fecharModalBuscaContato();
          return;
        }

        if (confirmandoSaida) {
          definirConfirmandoSaida(false);
          return;
        }

        if (confirmandoExclusao) {
          definirConfirmandoExclusao(false);
          return;
        }

        tentarFecharModal();
      }
    }

    window.addEventListener('keydown', tratarTecla);

    return () => {
      window.removeEventListener('keydown', tratarTecla);
    };
  }, [aberto, aoFechar, confirmandoExclusao, confirmandoOrdemCompraCotacao, confirmandoSaida, salvando, modalBuscaFornecedorAberto, modalBuscaContatoAberto, modalFornecedorAberto, modalCotacaoAberto]);

  if (!aberto) {
    return null;
  }

  const contatosDoFornecedor = combinarContatosDoFornecedor(
    contatosAtivos,
    contatosCriadosLocalmente,
    formulario.idFornecedor
  );
  const proximoCodigoFornecedor = obterProximoCodigoFornecedor(listaFornecedores);
  const cotacoesAbertosDoFornecedor = cotacoes.filter(
    (cotacao) => String(cotacao.idFornecedor) === String(formulario.idFornecedor)
  );
  const cotacaoSelecionadoFormulario = cotacoes.find(
    (cotacao) => String(cotacao.idCotacao) === String(formulario.idCotacao)
  );
  const contatoSelecionado = contatosDoFornecedor.find(
    (contato) => String(contato.idContato) === String(formulario.idContato)
  );
  const dadosCotacaoAtendimento = montarDadosCotacaoAPartirDoAtendimentoAtual(
    formulario,
    fornecedoresCotacao,
    compradoresCotacao,
    usuarioLogado
  );

  function alterarCampo(evento) {
    const { name, value, type, checked } = evento.target;
    const valorNormalizado = normalizarValorEntradaFormulario(evento);

    definirFormulario((estadoAtual) => {
      const proximoEstado = {
        ...estadoAtual,
        ...(name === 'idFornecedor' ? { idContato: '', idCotacao: '', idEtapaCotacao: '' } : {}),
        [name]: type === 'checkbox' ? checked : valorNormalizado
      };

      if (name === 'idCotacao') {
        const cotacao = cotacoesAbertosDoFornecedor.find((item) => String(item.idCotacao) === String(value));
        proximoEstado.idEtapaCotacao = cotacao?.idEtapaCotacao ? String(cotacao.idEtapaCotacao) : '';
      }

      if (name === 'idEtapaCotacao' && !estadoAtual.idCotacao) {
        proximoEstado.idEtapaCotacao = '';
      }

      return proximoEstado;
    });
  }

  function alterarStatusCotacao(evento) {
    const proximoValor = String(evento.target.value || '');

    if (!formulario.idCotacao) {
      return;
    }

    if (!proximoValor || String(formulario.idEtapaCotacao || '') === proximoValor) {
      definirFormulario((estadoAtual) => ({
        ...estadoAtual,
        idEtapaCotacao: proximoValor
      }));
      return;
    }

    if (precisaPerguntarGeracaoOrdemCompra(
      {
        ...cotacaoSelecionadoFormulario,
        idEtapaCotacao: formulario.idEtapaCotacao || cotacaoSelecionadoFormulario?.idEtapaCotacao
      },
      proximoValor,
      etapasCotacao
    )) {
      definirConfirmandoOrdemCompraCotacao({
        origem: 'atendimento',
        proximoIdEtapaCotacao: proximoValor,
        cotacao: cotacaoSelecionadoFormulario
      });
      return;
    }

    definirFormulario((estadoAtual) => ({
      ...estadoAtual,
      idEtapaCotacao: proximoValor
    }));
  }

  async function submeterFormulario(evento) {
    evento.preventDefault();

    if (somenteLeitura) {
      return;
    }

    const camposObrigatorios = [
      ['idFornecedor', 'Selecione o fornecedor.'],
      ['idTipoAtendimento', 'Selecione o tipo de atendimento.'],
      ['assunto', 'Informe o assunto do atendimento.'],
      ['data', 'Informe a data do atendimento.'],
      ['horaInicio', 'Informe o horario de inicio.']
    ];

    const mensagemValidacao = camposObrigatorios.find(([campo]) => !String(formulario[campo] || '').trim());

    if (mensagemValidacao) {
      definirMensagemErro(mensagemValidacao[1]);
      return;
    }

    if (formulario.horaFim && formulario.horaFim <= formulario.horaInicio) {
      definirMensagemErro('O horario de fim deve ser maior que o horario de inicio.');
      return;
    }

    await executarSalvamentoAtendimento();
  }

  async function executarSalvamentoAtendimento() {
    definirSalvando(true);
    definirMensagemErro('');

    try {
      if (formulario.idCotacao && formulario.idEtapaCotacao && aoAtualizarStatusCotacao) {
        await aoAtualizarStatusCotacao({
          idCotacao: Number(formulario.idCotacao),
          idEtapaCotacao: Number(formulario.idEtapaCotacao)
        });
      }

      await aoSalvar(formulario);
    } catch (erro) {
      definirMensagemErro(erro.message || 'Nao foi possivel salvar o atendimento.');
      definirSalvando(false);
    }
  }

  function fecharAoClicarNoFundo(evento) {
    if (evento.target === evento.currentTarget && !salvando) {
      tentarFecharModal();
    }
  }

  async function excluirRegistro() {
    if (!modoEdicao || !aoExcluir) {
      return;
    }

    definirSalvando(true);
    definirMensagemErro('');

    try {
      await aoExcluir(atendimento.idAtendimento);
    } catch (erro) {
      definirMensagemErro(erro.message || 'Nao foi possivel excluir o atendimento.');
      definirSalvando(false);
    }
  }

  function abrirConfirmacaoExclusao() {
    if (!permitirExcluir || salvando) {
      return;
    }

    definirConfirmandoExclusao(true);
  }

  function fecharConfirmacaoExclusao() {
    if (salvando) {
      return;
    }

    definirConfirmandoExclusao(false);
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

  function abrirModalNovoFornecedor() {
    if (somenteLeitura || salvando || !aoIncluirFornecedor) {
      return;
    }

    definirModalFornecedorAberto(true);
  }

  function fecharModalNovoFornecedor() {
    definirModalFornecedorAberto(false);
  }

  function abrirModalBuscaFornecedor() {
    if (somenteLeitura || salvando) {
      return;
    }

    definirModalBuscaFornecedorAberto(true);
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

  function selecionarFornecedor(fornecedor) {
    if (!fornecedor) {
      return;
    }

    definirFormulario((estadoAtual) => ({
      ...estadoAtual,
      idFornecedor: String(fornecedor.idFornecedor),
      idContato: '',
      idCotacao: '',
      idEtapaCotacao: ''
    }));
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
    try {
      const fornecedorCriado = await aoIncluirFornecedor(dadosFornecedor);

      selecionarFornecedor(fornecedorCriado);
      definirModalFornecedorAberto(false);
    } catch (erro) {
      throw erro;
    }
  }

  function abrirModalNovoCotacao() {
    if (somenteLeitura || salvando || !aoIncluirCotacao) {
      return;
    }

    definirModoModalCotacao('novo');
    definirCotacaoSelecionado(null);
    definirModalCotacaoAberto(true);
  }

  function abrirModalConsultaCotacao() {
    if (!cotacaoSelecionadoFormulario) {
      return;
    }

    definirModoModalCotacao('consulta');
    definirCotacaoSelecionado(cotacaoSelecionadoFormulario);
    definirModalCotacaoAberto(true);
  }

  function abrirModalEdicaoCotacao() {
    if (somenteLeitura || !cotacaoSelecionadoFormulario) {
      return;
    }

    definirModoModalCotacao('edicao');
    definirCotacaoSelecionado(cotacaoSelecionadoFormulario);
    definirModalCotacaoAberto(true);
  }

  function fecharModalNovoCotacao() {
    definirModalCotacaoAberto(false);
    definirModoModalCotacao('novo');
    definirCotacaoSelecionado(null);
  }

  async function salvarNovoCotacao(dadosNovoCotacao) {
    const cotacaoBase = modoModalCotacao === 'novo' ? null : cotacaoSelecionado;
    const precisaConfirmarOrdemCompra = precisaPerguntarGeracaoOrdemCompra(
      cotacaoBase,
      dadosNovoCotacao.idEtapaCotacao,
      etapasCotacao
    );

    if (precisaConfirmarOrdemCompra) {
      definirConfirmandoOrdemCompraCotacao({
        origem: 'cotacao',
        dadosCotacao: dadosNovoCotacao,
        cotacao: cotacaoBase
      });
      return;
    }

    await persistirCotacaoSemOrdemCompra(dadosNovoCotacao);
  }

  async function persistirCotacaoSemOrdemCompra(dadosNovoCotacao) {
    const cotacaoSalvo = modoModalCotacao === 'novo'
      ? await aoIncluirCotacao(dadosNovoCotacao)
      : await aoAtualizarCotacao(dadosNovoCotacao);

    if (cotacaoSalvo?.idCotacao) {
      definirFormulario((estadoAtual) => ({
        ...estadoAtual,
        idCotacao: String(cotacaoSalvo.idCotacao),
        idEtapaCotacao: cotacaoSalvo.idEtapaCotacao ? String(cotacaoSalvo.idEtapaCotacao) : ''
      }));
    }

    fecharModalNovoCotacao();
  }

  async function recusarGeracaoOrdemCompra() {
    const confirmacao = confirmandoOrdemCompraCotacao;
    definirConfirmandoOrdemCompraCotacao(null);

    if (!confirmacao) {
      return;
    }

    const etapaFechadoSemOrdemCompra = obterEtapaFechadoSemOrdemCompra(etapasCotacao);

    if (confirmacao.origem === 'atendimento') {
      if (etapaFechadoSemOrdemCompra?.idEtapaCotacao && aoAtualizarStatusCotacao) {
        await aoAtualizarStatusCotacao({
          idCotacao: Number(confirmacao.cotacao.idCotacao),
          idEtapaCotacao: Number(etapaFechadoSemOrdemCompra.idEtapaCotacao)
        });
      }

      definirFormulario((estadoAtual) => ({
        ...estadoAtual,
        idEtapaCotacao: etapaFechadoSemOrdemCompra?.idEtapaCotacao
          ? String(etapaFechadoSemOrdemCompra.idEtapaCotacao)
          : estadoAtual.idEtapaCotacao
      }));
      return;
    }

    if (confirmacao.origem === 'cotacao') {
      const dadosAjustados = {
        ...confirmacao.dadosCotacao,
        idEtapaCotacao: etapaFechadoSemOrdemCompra?.idEtapaCotacao
          ? String(etapaFechadoSemOrdemCompra.idEtapaCotacao)
          : String(confirmacao.cotacao?.idEtapaCotacao || '')
      };

      if (confirmacao.cotacao?.idCotacao || etapaFechadoSemOrdemCompra?.idEtapaCotacao) {
        await persistirCotacaoSemOrdemCompra(dadosAjustados);
      } else if (confirmacao.cotacao?.idEtapaCotacao && aoAtualizarStatusCotacao) {
        await aoAtualizarStatusCotacao({
          idCotacao: Number(confirmacao.cotacao.idCotacao),
          idEtapaCotacao: Number(confirmacao.cotacao.idEtapaCotacao)
        });
      }
    }
  }

  async function confirmarGeracaoOrdemCompra() {
    const confirmacao = confirmandoOrdemCompraCotacao;
    definirConfirmandoOrdemCompraCotacao(null);

    if (!confirmacao) {
      return;
    }

    if (confirmacao.origem === 'atendimento') {
      const cotacaoAtualizado = await aoAtualizarStatusCotacao?.({
        idCotacao: Number(confirmacao.cotacao.idCotacao),
        idEtapaCotacao: Number(confirmacao.proximoIdEtapaCotacao)
      });

      definirFormulario((estadoAtual) => ({
        ...estadoAtual,
        idEtapaCotacao: String(confirmacao.proximoIdEtapaCotacao || '')
      }));

      if (aoAbrirOrdemCompra) {
        const cotacaoBaseOrdemCompra = enriquecerCotacaoParaOrdemCompraAtendimento(
          cotacaoAtualizado || {
            ...confirmacao.cotacao,
            idEtapaCotacao: Number(confirmacao.proximoIdEtapaCotacao)
          },
          prazosPagamento,
          produtos
        );
        aoAbrirOrdemCompra(
          montarDadosIniciaisOrdemCompraAPartirDoCotacao(cotacaoBaseOrdemCompra),
          { idCotacao: cotacaoBaseOrdemCompra.idCotacao, origem: 'atendimento' }
        );
      }
      return;
    }

    const cotacaoSalvo = modoModalCotacao === 'novo'
      ? await aoIncluirCotacao(confirmacao.dadosCotacao)
      : await aoAtualizarCotacao(confirmacao.dadosCotacao);

    if (cotacaoSalvo?.idCotacao) {
      definirFormulario((estadoAtual) => ({
        ...estadoAtual,
        idCotacao: String(cotacaoSalvo.idCotacao),
        idEtapaCotacao: cotacaoSalvo.idEtapaCotacao ? String(cotacaoSalvo.idEtapaCotacao) : ''
      }));

      if (aoAbrirOrdemCompra) {
        const cotacaoBaseOrdemCompra = enriquecerCotacaoParaOrdemCompraAtendimento(cotacaoSalvo, prazosPagamento, produtos);
        aoAbrirOrdemCompra(
          montarDadosIniciaisOrdemCompraAPartirDoCotacao(cotacaoBaseOrdemCompra),
          { idCotacao: cotacaoBaseOrdemCompra.idCotacao, origem: 'cotacao' }
        );
      }
    }

    fecharModalNovoCotacao();
  }

  function inserirMarcadorDescricao(evento) {
    if (somenteLeitura) {
      return;
    }

    const prefixo = evento.key === 'F2'
      ? `${formulario.nomeUsuario || usuarioLogado?.nome || 'Usuario'}: `
      : evento.key === 'F3'
        ? `${contatoSelecionado?.nome || 'Contato'}: `
        : null;

    if (!prefixo) {
      return;
    }

    evento.preventDefault();

    const inicio = evento.currentTarget.selectionStart ?? formulario.descricao.length;
    const fim = evento.currentTarget.selectionEnd ?? formulario.descricao.length;
    const textoAtual = formulario.descricao || '';
    const antes = textoAtual.slice(0, inicio);
    const depois = textoAtual.slice(fim);
    const precisaQuebraAntes = antes.length > 0 && !antes.endsWith('\n');
    const precisaQuebraDepois = depois.length > 0 && !depois.startsWith('\n');
    const insercao = `${precisaQuebraAntes ? '\n' : ''}${prefixo}${precisaQuebraDepois ? '\n' : ''}`;
    const proximoTexto = `${antes}${insercao}${depois}`;
    const novaPosicao = (antes + insercao).length;

    definirFormulario((estadoAtual) => ({
      ...estadoAtual,
      descricao: proximoTexto
    }));

    window.requestAnimationFrame(() => {
      evento.currentTarget.focus();
      evento.currentTarget.setSelectionRange(novaPosicao, novaPosicao);
    });
  }

  return (
    <>
    <div className={classNameCamada} role="presentation" onMouseDown={fecharAoClicarNoFundo}>
      <form
        className="modalContatoFornecedor modalAtendimento"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tituloModalAtendimento"
        onMouseDown={(evento) => evento.stopPropagation()}
        onSubmit={submeterFormulario}
      >
        <div className="cabecalhoModalContato">
          <h3 id="tituloModalAtendimento">
            {somenteLeitura ? 'Consultar atendimento' : modoEdicao ? 'Editar atendimento' : 'Incluir atendimento'}
          </h3>

          <div className="acoesFormularioContatoModal">
            {modoEdicao ? (
              <Botao
                variante="secundario"
                type="button"
                icone="limpar"
                somenteIcone
                title="Excluir"
                aria-label="Excluir"
                disabled={salvando || !permitirExcluir}
                onClick={abrirConfirmacaoExclusao}
              >
                Excluir
              </Botao>
            ) : null}
            {!somenteLeitura ? (
              <Botao variante="secundario" type="button" onClick={abrirModalNovoCotacao} disabled={salvando}>
                Incluir cotacao
              </Botao>
            ) : null}
            <Botao variante="secundario" type="button" onClick={tentarFecharModal} disabled={salvando}>
              {somenteLeitura ? 'Fechar' : 'Cancelar'}
            </Botao>
            {!somenteLeitura ? (
              <Botao variante="primario" type="submit" disabled={salvando}>
                {salvando ? 'Salvando...' : 'Salvar'}
              </Botao>
            ) : null}
          </div>
        </div>

        <div className="corpoModalContato">
          <div className="layoutModalAtendimento">
            <div className="colunaPrincipalModalAtendimento">
              <div className="linhaHorariosAtendimento">
                <CampoFormulario
                  label="Data"
                  name="data"
                  type="date"
                  value={formulario.data}
                  onChange={alterarCampo}
                  disabled={somenteLeitura}
                  required
                />
                <CampoFormulario
                  label="Horario de inicio"
                  name="horaInicio"
                  type="time"
                  value={formulario.horaInicio}
                  onChange={alterarCampo}
                  disabled={somenteLeitura}
                  required
                />
                <CampoFormulario
                  label="Horario de fim"
                  name="horaFim"
                  type="time"
                  value={formulario.horaFim}
                  onChange={alterarCampo}
                  disabled={somenteLeitura}
                />
              </div>
              <CampoFormulario
                label="Assunto"
                name="assunto"
                value={formulario.assunto}
                onChange={alterarCampo}
                disabled={somenteLeitura}
                required
              />
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
              </div>
              <div className="linhaCotacaoAtendimento">
                <CampoSelect
                  label="Cotacao"
                  name="idCotacao"
                  value={formulario.idCotacao}
                  onChange={alterarCampo}
                  options={cotacoesAbertosDoFornecedor.map((cotacao) => ({
                    valor: String(cotacao.idCotacao),
                    label: montarRotuloCotacao(cotacao)
                  }))}
                  disabled={somenteLeitura || !formulario.idFornecedor}
                  acaoExtra={formulario.idCotacao ? (
                    <div className="acoesCampoSelect">
                      <Botao
                        variante="secundario"
                        type="button"
                        icone="consultar"
                        className="botaoCampoAcao"
                        somenteIcone
                        title="Consultar cotacao"
                        aria-label="Consultar cotacao"
                        onClick={abrirModalConsultaCotacao}
                      />
                      {!somenteLeitura ? (
                        <Botao
                          variante="secundario"
                          type="button"
                          icone="editar"
                          className="botaoCampoAcao"
                          somenteIcone
                          title="Editar cotacao"
                          aria-label="Editar cotacao"
                          onClick={abrirModalEdicaoCotacao}
                        />
                      ) : null}
                    </div>
                  ) : null}
                />
                <CampoSelect
                  label="Status da cotacao"
                  name="idEtapaCotacao"
                  value={formulario.idEtapaCotacao}
                  onChange={alterarStatusCotacao}
                  options={etapasCotacaoDisponiveisEscolhaManual.map((etapa) => ({
                    valor: String(etapa.idEtapaCotacao),
                    label: etapa.descricao
                  }))}
                  disabled={somenteLeitura || !formulario.idCotacao}
                />
              </div>
              <div className="linhaUsuarioCanalOrigemAtendimento">
                <CampoFormulario
                  label="Usuario do registro"
                  name="nomeUsuario"
                  value={formulario.nomeUsuario}
                  disabled
                />
                <CampoSelect
                  label="Tipo de atendimento"
                  name="idTipoAtendimento"
                  value={formulario.idTipoAtendimento}
                  onChange={alterarCampo}
                  options={tiposAtendimentoAtivos.map((tipoAtendimento) => ({
                    valor: String(tipoAtendimento.idTipoAtendimento),
                    label: tipoAtendimento.descricao
                  }))}
                  disabled={somenteLeitura}
                  required
                />
                <CampoSelect
                  label="Canal"
                  name="idCanalAtendimento"
                  value={formulario.idCanalAtendimento}
                  onChange={alterarCampo}
                  options={canaisAtivos.map((canal) => ({
                    valor: String(canal.idCanalAtendimento),
                    label: canal.descricao
                  }))}
                  disabled={somenteLeitura}
                />
                <CampoSelect
                  label="Origem"
                  name="idOrigemAtendimento"
                  value={formulario.idOrigemAtendimento}
                  onChange={alterarCampo}
                  options={origensAtivas.map((origem) => ({
                    valor: String(origem.idOrigemAtendimento),
                    label: origem.descricao
                  }))}
                  disabled={somenteLeitura}
                />
              </div>
            </div>

            <div className="colunaObservacaoModalAtendimento">
              <div className="campoFormulario campoFormularioIntegral">
                <label htmlFor="descricao">Descricao inicial</label>
                <textarea
                  id="descricao"
                  name="descricao"
                  value={formulario.descricao}
                  onChange={alterarCampo}
                  onKeyDown={inserirMarcadorDescricao}
                  disabled={somenteLeitura}
                  rows={6}
                  className="entradaFormulario entradaFormularioTextoLongo entradaObservacaoModalAtendimento"
                />
              </div>
            </div>
          </div>
        </div>

        <MensagemErroPopup mensagem={mensagemErro} titulo="Nao foi possivel salvar o atendimento." />

        {confirmandoOrdemCompraCotacao ? (
          <div className="camadaConfirmacaoModal" role="presentation" onMouseDown={recusarGeracaoOrdemCompra}>
            <div
              className="modalConfirmacaoAgenda"
              role="dialog"
              aria-modal="true"
              aria-labelledby="tituloConfirmacaoOrdemCompraAtendimento"
              onMouseDown={(evento) => evento.stopPropagation()}
            >
              <div className="cabecalhoConfirmacaoModal">
                <h4 id="tituloConfirmacaoOrdemCompraAtendimento">Criar ordem de compra</h4>
              </div>

              <div className="corpoConfirmacaoModal">
                <p>Este cotacao esta sendo fechado. Deseja gerar um ordem de compra a partir dele?</p>
              </div>

              <div className="acoesConfirmacaoModal">
                <Botao variante="secundario" type="button" onClick={recusarGeracaoOrdemCompra} disabled={salvando}>
                  Nao
                </Botao>
                <Botao variante="primario" type="button" onClick={confirmarGeracaoOrdemCompra} disabled={salvando}>
                  Sim
                </Botao>
              </div>
            </div>
          </div>
        ) : null}

        {confirmandoSaida ? (
          <div className="camadaConfirmacaoModal" role="presentation" onMouseDown={fecharConfirmacaoSaida}>
            <div
              className="modalConfirmacaoAgenda"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="tituloConfirmacaoSaidaAtendimento"
              onMouseDown={(evento) => evento.stopPropagation()}
            >
              <div className="cabecalhoConfirmacaoModal">
                <h4 id="tituloConfirmacaoSaidaAtendimento">Cancelar cadastro</h4>
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

        {confirmandoExclusao ? (
          <div className="camadaConfirmacaoModal" role="presentation" onMouseDown={fecharConfirmacaoExclusao}>
            <div
              className="modalConfirmacaoAgenda"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="tituloConfirmacaoExclusaoAtendimento"
              onMouseDown={(evento) => evento.stopPropagation()}
            >
              <div className="cabecalhoConfirmacaoModal">
                <h4 id="tituloConfirmacaoExclusaoAtendimento">Excluir atendimento</h4>
              </div>

              <div className="corpoConfirmacaoModal">
                <p>Tem certeza que deseja excluir este atendimento?</p>
              </div>

              <div className="acoesConfirmacaoModal">
                <Botao
                  variante="secundario"
                  type="button"
                  onClick={fecharConfirmacaoExclusao}
                  disabled={salvando}
                >
                  Nao
                </Botao>
                <Botao
                  variante="perigo"
                  type="button"
                  onClick={excluirRegistro}
                  disabled={salvando}
                >
                  Sim
                </Botao>
              </div>
            </div>
          </div>
        ) : null}
      </form>
    </div>

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
      placeholder="Pesquisar fornecedor no grid"
      ariaLabelPesquisa="Pesquisar fornecedor no grid"
      rotuloAcaoPrimaria="Incluir fornecedor"
      tituloAcaoPrimaria="Incluir fornecedor"
      iconeAcaoPrimaria="adicionar"
      aoAcionarPrimaria={() => {
        fecharModalBuscaFornecedor();
        abrirModalNovoFornecedor();
      }}
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

    <ModalCotacao
      aberto={modalCotacaoAberto}
      cotacao={modoModalCotacao === 'novo' ? (dadosCotacaoAtendimento || dadosCotacao) : cotacaoSelecionado}
      fornecedores={fornecedoresCotacao}
      contatos={contatosCotacao}
      usuarios={usuariosCotacao}
      compradores={compradoresCotacao}
      ramosAtividade={ramosAtividade}
      metodosPagamento={metodosPagamento}
      prazosPagamento={prazosPagamento}
      etapasCotacao={etapasCotacao}
      produtos={produtos}
      camposCotacao={camposCotacao}
      camposOrdemCompra={camposOrdemCompra}
      empresa={empresa}
      usuarioLogado={usuarioLogado}
      modo={modoModalCotacao}
      idCompradorBloqueado={idCompradorBloqueado}
      somenteConsultaPrazos={somenteConsultaPrazos}
      aoIncluirFornecedor={aoIncluirFornecedor}
      aoFechar={fecharModalNovoCotacao}
      aoSalvar={salvarNovoCotacao}
      aoSalvarPrazoPagamento={aoSalvarPrazoPagamento}
      aoInativarPrazoPagamento={aoInativarPrazoPagamento}
    />
    </>
  );
}

function CampoFormulario({ label, name, type = 'text', className = '', ...props }) {
  return (
    <div className={`campoFormulario ${className}`.trim()}>
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} className="entradaFormulario" {...props} />
    </div>
  );
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

function criarFormularioInicial(atendimento, usuarioLogado) {
  const dataPadrao = obterDataAtualFormatoInput();
  const horaPadrao = obterHoraAtualFormatoInput();

  return {
    ...estadoInicialFormulario,
    ...atendimento,
    data: atendimento?.data || dataPadrao,
    horaInicio: atendimento?.horaInicio || horaPadrao,
    horaFim: atendimento?.horaFim || '',
    idFornecedor: normalizarValorFormulario(atendimento?.idFornecedor),
    idContato: normalizarValorFormulario(atendimento?.idContato),
    idCotacao: '',
    idEtapaCotacao: '',
    idUsuario: normalizarValorFormulario(atendimento?.idUsuario || usuarioLogado?.idUsuario),
    nomeUsuario: atendimento?.nomeUsuario || usuarioLogado?.nome || '',
    idTipoAtendimento: normalizarValorFormulario(atendimento?.idTipoAtendimento),
    idCanalAtendimento: normalizarValorFormulario(atendimento?.idCanalAtendimento),
    idOrigemAtendimento: normalizarValorFormulario(atendimento?.idOrigemAtendimento)
  };
}

function normalizarValorFormulario(valor) {
  if (valor === null || valor === undefined || valor === '' || Number(valor) <= 0) {
    return '';
  }

  return String(valor);
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

function montarRotuloFornecedor(fornecedor, empresa) {
  const codigo = formatarCodigoFornecedor(fornecedor, empresa);
  const nome = fornecedor.nomeFantasia || fornecedor.razaoSocial || 'Fornecedor sem nome';
  const localizacao = [fornecedor.cidade, fornecedor.estado].filter(Boolean).join('/');

  return localizacao ? `${codigo} - ${nome} - ${localizacao}` : `${codigo} - ${nome}`;
}

function montarRotuloCotacao(cotacao) {
  const codigo = `#${String(cotacao.idCotacao || '').padStart(4, '0')}`;
  const total = Array.isArray(cotacao?.itens)
    ? cotacao.itens.reduce((acumulado, item) => {
      const valor = Number(String(item.valorTotal ?? 0).replace(/[^\d,.-]/g, '').replace(/\.(?=\d{3}(?:\D|$))/g, '').replace(',', '.'));
      return acumulado + (Number.isNaN(valor) ? 0 : valor);
    }, 0)
    : 0;
  const valorFormatado = total.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
  return `${codigo} - ${valorFormatado}`;
}

function obterDataAtualFormatoInput() {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  const dia = String(agora.getDate()).padStart(2, '0');

  return `${ano}-${mes}-${dia}`;
}

function obterHoraAtualFormatoInput() {
  const agora = new Date();
  const horas = String(agora.getHours()).padStart(2, '0');
  const minutos = String(agora.getMinutes()).padStart(2, '0');

  return `${horas}:${minutos}`;
}

function montarDadosCotacaoAPartirDoAtendimentoAtual(formulario, fornecedores, compradores, usuarioLogado) {
  const comprador = compradores.find((item) => String(item.idComprador) === String(usuarioLogado?.idComprador || ''));

  return {
    idFornecedor: formulario?.idFornecedor || '',
    idContato: formulario?.idContato || '',
    idUsuario: formulario?.idUsuario || usuarioLogado?.idUsuario || '',
    nomeUsuario: formulario?.nomeUsuario || usuarioLogado?.nome || '',
    idComprador: usuarioLogado?.idComprador || '',
    observacao: formulario?.descricao || ''
  };
}

function precisaPerguntarGeracaoOrdemCompra(cotacao, idEtapaCotacao, etapasCotacao) {
  if (!cotacao || cotacao.idOrdemCompraVinculado || !idEtapaCotacao) {
    return false;
  }

  return etapaAcabouDeFechar(cotacao.idEtapaCotacao, idEtapaCotacao, etapasCotacao);
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

function enriquecerCotacaoParaOrdemCompraAtendimento(cotacao, prazosPagamento, produtos) {
  const prazo = prazosPagamento.find((item) => String(item.idPrazoPagamento) === String(cotacao.idPrazoPagamento));

  return {
    ...cotacao,
    nomePrazoPagamento: cotacao.nomePrazoPagamento || prazo?.descricaoFormatada || prazo?.descricao || '',
    nomeMetodoPagamento: cotacao.nomeMetodoPagamento || prazo?.nomeMetodoPagamento || '',
    itens: Array.isArray(cotacao.itens) ? cotacao.itens.map((item) => {
      const produto = produtos.find((registro) => String(registro.idProduto) === String(item.idProduto));
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


