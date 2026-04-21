import { useEffect, useMemo, useRef, useState } from 'react';
import { Botao } from '../comuns/botao';
import { MensagemErroPopup } from '../comuns/mensagemErroPopup';
import { CampoSelecaoMultiplaModal } from '../comuns/campoSelecaoMultiplaModal';
import { ModalBuscaClientes } from '../comuns/modalBuscaClientes';
import { ModalBuscaContatos } from '../comuns/modalBuscaContatos';
import { ModalFornecedor as ModalCliente } from './fornecedores-modalFornecedor';
import { formatarCodigoCliente } from '../../utilitarios/codigoCliente';
import { formatarNomeContato } from '../../utilitarios/formatarNomeContato';
import { normalizarValorEntradaFormulario } from '../../utilitarios/normalizarTextoFormulario';
import { registroEstaAtivo } from '../../utilitarios/statusRegistro';

const estadoInicialFormulario = {
  idAgendamento: '',
  data: '',
  assunto: '',
  idTipoAgenda: '',
  horaInicio: '',
  horaFim: '',
  idFornecedor: '',
  idContato: '',
  idLocal: '',
  idsRecursos: [],
  idsUsuarios: [],
  idUsuario: '',
  idStatusVisita: ''
};

export function ModalAgendamento({
  aberto,
  dadosIniciais,
  locais = [],
  recursos = [],
  fornecedores,
  clientes = [],
  contatos = [],
  usuarios = [],
  vendedores = [],
  ramosAtividade = [],
  conceitosCliente = [],
  tiposAgenda = [],
  statusVisita = [],
  empresa = null,
  usuarioLogado,
  idVendedorBloqueado = null,
  permitirExcluir = true,
  aoIncluirCliente,
  aoFechar,
  aoSalvar,
  aoExcluir
}) {
  const [formulario, definirFormulario] = useState(estadoInicialFormulario);
  const [salvando, definirSalvando] = useState(false);
  const [mensagemErro, definirMensagemErro] = useState('');
  const [confirmandoExclusao, definirConfirmandoExclusao] = useState(false);
  const [confirmandoSaida, definirConfirmandoSaida] = useState(false);
  const [modalClienteAberto, definirModalClienteAberto] = useState(false);
  const [modalBuscaClienteAberto, definirModalBuscaClienteAberto] = useState(false);
  const [modalBuscaContatoAberto, definirModalBuscaContatoAberto] = useState(false);
  const referenciaCampoCliente = useRef(null);
  const referenciaCampoContato = useRef(null);
  const listaFornecedores = Array.isArray(fornecedores) ? fornecedores : clientes;
  const locaisAtivos = locais.filter((local) => registroEstaAtivo(local.status));
  const recursosAtivos = recursos.filter((recurso) => registroEstaAtivo(recurso.status));
  const clientesAtivos = listaFornecedores.filter((cliente) => registroEstaAtivo(cliente.status));
  const contatosAtivos = contatos.filter((contato) => registroEstaAtivo(contato.status));
  const usuariosAtivos = usuarios.filter((usuario) => registroEstaAtivo(usuario.ativo));
  const tiposAgendaAtivos = tiposAgenda.filter((tipoAgenda) => registroEstaAtivo(tipoAgenda.status));
  const statusAtivos = useMemo(
    () => statusVisita.filter((status) => registroEstaAtivo(status.status)),
    [statusVisita]
  );

  useEffect(() => {
    if (!aberto) {
      return;
    }

    definirFormulario(criarFormularioInicial(dadosIniciais, usuarioLogado, statusAtivos));
    definirSalvando(false);
    definirMensagemErro('');
    definirConfirmandoExclusao(false);
    definirConfirmandoSaida(false);
    definirModalClienteAberto(false);
    definirModalBuscaClienteAberto(false);
    definirModalBuscaContatoAberto(false);
  }, [aberto, dadosIniciais, statusAtivos, usuarioLogado]);

  useEffect(() => {
    if (!aberto) {
      return undefined;
    }

    function tratarTecla(evento) {
      if (evento.key === 'Escape' && !salvando) {
        if (modalClienteAberto) {
          definirModalClienteAberto(false);
          return;
        }

        if (modalBuscaClienteAberto) {
          definirModalBuscaClienteAberto(false);
          return;
        }

        if (modalBuscaContatoAberto) {
          definirModalBuscaContatoAberto(false);
          return;
        }

        if (confirmandoExclusao) {
          definirConfirmandoExclusao(false);
          return;
        }

        if (confirmandoSaida) {
          definirConfirmandoSaida(false);
          return;
        }

        tentarFecharModal();
      }
    }

    window.addEventListener('keydown', tratarTecla);

    return () => {
      window.removeEventListener('keydown', tratarTecla);
    };
  }, [aberto, aoFechar, confirmandoExclusao, confirmandoSaida, modalBuscaClienteAberto, modalBuscaContatoAberto, modalClienteAberto, salvando]);

  if (!aberto) {
    return null;
  }

  const modoEdicao = Boolean(formulario.idAgendamento);
  const contatosDoCliente = contatosAtivos.filter(
    (contato) => String(contato.idCliente) === String(formulario.idCliente)
  );
  const proximoCodigoCliente = obterProximoCodigoCliente(listaFornecedores);
  const recursosSelecionados = recursosAtivos.filter((recurso) => (
    formulario.idsRecursos.includes(String(recurso.idRecurso))
  ));
  const usuariosSelecionados = usuariosAtivos.filter((usuario) => (
    formulario.idsUsuarios.includes(String(usuario.idUsuario))
  ));
  const tipoAgendaSelecionado = tiposAgendaAtivos.find(
    (tipoAgenda) => String(tipoAgenda.idTipoAgenda) === String(formulario.idTipoAgenda)
  );
  const clienteObrigatorio = Boolean(tipoAgendaSelecionado?.obrigarCliente);
  const localObrigatorio = Boolean(tipoAgendaSelecionado?.obrigarLocal);
  const recursoObrigatorio = Boolean(tipoAgendaSelecionado?.obrigarRecurso);

  function alterarCampo(evento) {
    const { name, value } = evento.target;
    const valorNormalizado = normalizarValorEntradaFormulario(evento);

    definirFormulario((estadoAtual) => ({
      ...estadoAtual,
      ...(name === 'idCliente' ? { idContato: '' } : {}),
      [name]: valorNormalizado
    }));
  }

  async function submeterFormulario(evento) {
    evento.preventDefault();

    const camposObrigatorios = [
      ['data', 'Informe o dia.'],
      ['assunto', 'Informe o assunto.'],
      ['horaInicio', 'Informe o horario de inicio.'],
      ['horaFim', 'Informe o horario de fim.'],
      ['idsUsuarios', 'Selecione ao menos um usuario.'],
      ['idTipoAgenda', 'Selecione o tipo.'],
      ['idStatusVisita', 'Selecione o status da visita.']
    ];

    if (clienteObrigatorio) {
      camposObrigatorios.push(['idCliente', 'Selecione o fornecedor.']);
      camposObrigatorios.push(['idContato', 'Selecione o contato do fornecedor.']);
    }

    if (formulario.idCliente && !clienteObrigatorio) {
      camposObrigatorios.push(['idContato', 'Selecione o contato do fornecedor.']);
    }

    if (localObrigatorio) {
      camposObrigatorios.push(['idLocal', 'Selecione o local.']);
    }

    if (recursoObrigatorio) {
      camposObrigatorios.push(['idsRecursos', 'Selecione ao menos um recurso.']);
    }

    const mensagemValidacao = camposObrigatorios.find(([campo]) => {
      if (campo === 'idsRecursos' || campo === 'idsUsuarios') {
        return !Array.isArray(formulario[campo]) || formulario[campo].length === 0;
      }

      return !String(formulario[campo] || '').trim();
    });

    if (mensagemValidacao) {
      definirMensagemErro(mensagemValidacao[1]);
      return;
    }

    if (formulario.horaFim <= formulario.horaInicio) {
      definirMensagemErro('O horario de fim deve ser maior que o horario de inicio.');
      return;
    }

    definirSalvando(true);
    definirMensagemErro('');

    try {
      await aoSalvar(formulario);
    } catch (erro) {
      definirMensagemErro(erro.message || 'Nao foi possivel salvar o agendamento.');
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
      await aoExcluir(formulario.idAgendamento);
    } catch (erro) {
      definirMensagemErro(erro.message || 'Nao foi possivel excluir o agendamento.');
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
    if (!modoEdicao) {
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

  function abrirModalNovoCliente() {
    if (salvando || !aoIncluirCliente) {
      return;
    }

    definirModalClienteAberto(true);
  }

  function fecharModalNovoCliente() {
    definirModalClienteAberto(false);
  }

  function abrirModalBuscaCliente() {
    if (salvando) {
      return;
    }

    definirModalBuscaClienteAberto(true);
  }

  function fecharModalBuscaCliente() {
    definirModalBuscaClienteAberto(false);
  }

  function abrirModalBuscaContato() {
    if (salvando || !formulario.idCliente) {
      return;
    }

    definirModalBuscaContatoAberto(true);
  }

  function fecharModalBuscaContato() {
    definirModalBuscaContatoAberto(false);
  }

  function selecionarCliente(cliente) {
    if (!cliente) {
      return;
    }

    definirFormulario((estadoAtual) => ({
      ...estadoAtual,
      idFornecedor: String(cliente.idCliente),
      idContato: ''
    }));
    fecharModalBuscaCliente();
    agendarFocoCampo(referenciaCampoCliente);
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

  async function salvarNovoCliente(dadosCliente) {
    const clienteCriado = await aoIncluirCliente(dadosCliente);

    selecionarCliente(clienteCriado);
    definirModalClienteAberto(false);
  }

  return (
    <div className="camadaModalContato" role="presentation" onMouseDown={fecharAoClicarNoFundo}>
      <form
        className="modalContatoCliente modalAgendamento"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tituloModalAgendamento"
        onMouseDown={(evento) => evento.stopPropagation()}
        onSubmit={submeterFormulario}
      >
        <div className="cabecalhoModalContato">
          <h3 id="tituloModalAgendamento">{modoEdicao ? 'Editar agendamento' : 'Incluir agendamento'}</h3>

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
            <Botao
              variante="secundario"
              type="button"
              icone="fechar"
              somenteIcone
              title="Fechar"
              aria-label="Fechar"
              onClick={tentarFecharModal}
              disabled={salvando}
            >
              Fechar
            </Botao>
            <Botao
              variante="primario"
              type="submit"
              icone="confirmar"
              somenteIcone
              title={salvando ? 'Salvando' : 'Salvar'}
              aria-label={salvando ? 'Salvando' : 'Salvar'}
              disabled={salvando}
            >
              Salvar
            </Botao>
          </div>
        </div>

        <div className="corpoModalContato">
          <div className="gradeCamposModalCliente gradeCamposModalAgendamento">
            <CampoFormulario className="campoAgendamentoAssunto" label="Assunto" name="assunto" value={formulario.assunto} onChange={alterarCampo} required />
            <CampoFormulario label="Dia" name="data" type="date" value={formulario.data} onChange={alterarCampo} required />
            <CampoSelect
              label="Tipo"
              name="idTipoAgenda"
              value={formulario.idTipoAgenda}
              onChange={alterarCampo}
              options={tiposAgendaAtivos.map((tipoAgenda) => ({
                valor: String(tipoAgenda.idTipoAgenda),
                label: tipoAgenda.descricao
              }))}
              required
            />
            <CampoSelect
              label="Local"
              name="idLocal"
              value={formulario.idLocal}
              onChange={alterarCampo}
              options={locaisAtivos.map((local) => ({
                valor: String(local.idLocal),
                label: local.descricao
              }))}
              required={localObrigatorio}
            />
            <CampoFormulario label="Horario de inicio" name="horaInicio" type="time" value={formulario.horaInicio} onChange={alterarCampo} required />
            <CampoFormulario label="Horario de fim" name="horaFim" type="time" value={formulario.horaFim} onChange={alterarCampo} required />
            <CampoSelect
              className="campoAgendamentoMetade"
              label="Fornecedor"
              name="idCliente"
              data-atalho-busca-id="cliente"
              referenciaCampo={referenciaCampoCliente}
                value={formulario.idCliente}
                onChange={alterarCampo}
                options={clientesAtivos.map((cliente) => ({
                  valor: String(cliente.idCliente),
                  label: montarRotuloCliente(cliente, empresa)
                }))}
                required={clienteObrigatorio}
                acaoExtra={(
                <Botao
                  variante="secundario"
                  type="button"
                  icone="pesquisa"
                  className="botaoCampoAcao"
                  somenteIcone
                  title="Buscar fornecedor"
                  aria-label="Buscar fornecedor"
                  data-atalho-busca-id="cliente"
                  onClick={abrirModalBuscaCliente}
                  disabled={salvando}
                >
                  Buscar fornecedor
                </Botao>
              )}
            />
            <CampoSelect
              className="campoAgendamentoMetade"
              label="Contato do fornecedor"
              name="idContato"
              data-atalho-busca-id="contato"
              referenciaCampo={referenciaCampoContato}
              value={formulario.idContato}
              onChange={alterarCampo}
              options={contatosDoCliente.map((contato) => ({
                valor: String(contato.idContato),
                label: formatarNomeContato(contato)
              }))}
              disabled={!formulario.idCliente}
              required={clienteObrigatorio}
              acaoExtra={formulario.idCliente ? (
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
                  disabled={salvando}
                >
                  Buscar contato
                </Botao>
              ) : null}
            />
            <CampoSelecaoMultiplaModal
              className="campoAgendamentoTerco"
              label="Recursos"
              titulo="Selecionar recursos"
              itens={recursosAtivos.map((recurso) => ({
                valor: String(recurso.idRecurso),
                label: recurso.descricao
              }))}
              valoresSelecionados={formulario.idsRecursos}
              placeholder="Selecionar recursos"
              aoAlterar={(valores) => definirFormulario((estadoAtual) => ({
                ...estadoAtual,
                idsRecursos: valores
              }))}
            />
            <CampoSelecaoMultiplaModal
              className="campoAgendamentoMetade"
              label="Usuarios"
              titulo="Selecionar usuarios"
              itens={usuariosAtivos.map((usuario) => ({
                valor: String(usuario.idUsuario),
                label: usuario.nome
              }))}
              valoresSelecionados={formulario.idsUsuarios}
              placeholder="Selecionar usuarios"
              aoAlterar={(valores) => definirFormulario((estadoAtual) => ({
                ...estadoAtual,
                idsUsuarios: valores
              }))}
            />
            <CampoSelect
              className="campoAgendamentoTerco"
              label="Status"
              name="idStatusVisita"
              value={formulario.idStatusVisita}
              onChange={alterarCampo}
              options={statusAtivos.map((status) => ({
                valor: String(status.idStatusVisita),
                label: status.descricao
              }))}
              required
            />
          </div>
        </div>

        <MensagemErroPopup mensagem={mensagemErro} titulo="Nao foi possivel salvar o agendamento." />

        {confirmandoExclusao ? (
          <div className="camadaConfirmacaoModal" role="presentation" onMouseDown={fecharConfirmacaoExclusao}>
            <div
              className="modalConfirmacaoAgenda"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="tituloConfirmacaoExclusaoAgenda"
              onMouseDown={(evento) => evento.stopPropagation()}
            >
              <div className="cabecalhoConfirmacaoModal">
                <h4 id="tituloConfirmacaoExclusaoAgenda">Excluir agendamento</h4>
              </div>

              <div className="corpoConfirmacaoModal">
                <p>Tem certeza que deseja excluir este agendamento?</p>
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

        {confirmandoSaida ? (
          <div className="camadaConfirmacaoModal" role="presentation" onMouseDown={fecharConfirmacaoSaida}>
            <div
              className="modalConfirmacaoAgenda"
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="tituloConfirmacaoSaidaAgendamento"
              onMouseDown={(evento) => evento.stopPropagation()}
            >
              <div className="cabecalhoConfirmacaoModal">
                <h4 id="tituloConfirmacaoSaidaAgendamento">Cancelar cadastro</h4>
              </div>

              <div className="corpoConfirmacaoModal">
                <p>Se fechar agora, todas as informacoes preenchidas serao perdidas.</p>
              </div>

              <div className="acoesConfirmacaoModal">
                <Botao
                  variante="secundario"
                  type="button"
                  onClick={fecharConfirmacaoSaida}
                  disabled={salvando}
                >
                  Nao
                </Botao>
                <Botao
                  variante="perigo"
                  type="button"
                  onClick={confirmarSaida}
                  disabled={salvando}
                >
                  Sim
                </Botao>
              </div>
            </div>
          </div>
        ) : null}

        <ModalCliente
          aberto={modalClienteAberto}
          cliente={null}
          empresa={empresa}
          codigoSugerido={proximoCodigoCliente}
          contatos={[]}
          vendedores={vendedores}
          ramosAtividade={ramosAtividade}
          conceitosCliente={conceitosCliente}
          modo="novo"
          classNameCamada="camadaModal camadaModalSecundaria"
          idVendedorBloqueado={idVendedorBloqueado}
          aoFechar={fecharModalNovoCliente}
          aoSalvar={salvarNovoCliente}
        />

        <ModalBuscaClientes
          aberto={modalBuscaClienteAberto}
          empresa={empresa}
          clientes={clientesAtivos}
          placeholder="Pesquisar fornecedores"
          ariaLabelPesquisa="Pesquisar fornecedores"
          rotuloAcaoPrimaria={aoIncluirCliente ? 'Incluir fornecedor' : ''}
          tituloAcaoPrimaria={aoIncluirCliente ? 'Incluir fornecedor' : ''}
          iconeAcaoPrimaria="adicionar"
          aoAcionarPrimaria={aoIncluirCliente
            ? () => {
              fecharModalBuscaCliente();
              abrirModalNovoCliente();
            }
            : null}
          aoSelecionar={selecionarCliente}
          aoFechar={fecharModalBuscaCliente}
        />

        <ModalBuscaContatos
          aberto={modalBuscaContatoAberto}
          idCliente={formulario.idCliente}
          contatos={contatosDoCliente}
          placeholder="Pesquisar contatos do fornecedor"
          ariaLabelPesquisa="Pesquisar contatos do fornecedor"
          aoSelecionar={selecionarContato}
          aoFechar={fecharModalBuscaContato}
        />
      </form>
    </div>
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

function criarFormularioInicial(dadosIniciais, usuarioLogado, statusAtivos) {
  const idStatusVisita = normalizarValorFormularioAgendamento(dadosIniciais?.idStatusVisita)
    || obterStatusVisitaPadrao(statusAtivos);

  return {
    ...estadoInicialFormulario,
    ...dadosIniciais,
    idTipoAgenda: normalizarValorFormularioAgendamento(dadosIniciais?.idTipoAgenda),
    idFornecedor: normalizarValorFormularioAgendamento(dadosIniciais?.idCliente),
    idContato: normalizarValorFormularioAgendamento(dadosIniciais?.idContato),
    idLocal: normalizarValorFormularioAgendamento(dadosIniciais?.idLocal),
    idStatusVisita,
    idsRecursos: Array.isArray(dadosIniciais?.idsRecursos)
      ? dadosIniciais.idsRecursos.map((idRecurso) => String(idRecurso))
      : [],
    idsUsuarios: Array.isArray(dadosIniciais?.idsUsuarios)
      ? dadosIniciais.idsUsuarios.map((idUsuario) => String(idUsuario))
      : usuarioLogado?.idUsuario
        ? [String(usuarioLogado.idUsuario)]
        : [],
    idUsuario: String(dadosIniciais?.idUsuario || usuarioLogado?.idUsuario || '')
  };
}

function obterStatusVisitaPadrao(statusAtivos) {
  if (!Array.isArray(statusAtivos) || statusAtivos.length === 0) {
    return '';
  }

  const statusOrdenados = [...statusAtivos].sort((primeiro, segundo) => {
    const ordemPrimeira = obterOrdemStatus(primeiro);
    const ordemSegunda = obterOrdemStatus(segundo);

    if (ordemPrimeira !== ordemSegunda) {
      return ordemPrimeira - ordemSegunda;
    }

    return Number(primeiro?.idStatusVisita || 0) - Number(segundo?.idStatusVisita || 0);
  });

  return String(statusOrdenados[0]?.idStatusVisita || '');
}

function obterOrdemStatus(status) {
  const ordem = Number(status?.ordem);

  if (Number.isFinite(ordem) && ordem > 0) {
    return ordem;
  }

  const idStatus = Number(status?.idStatusVisita);
  if (Number.isFinite(idStatus) && idStatus > 0) {
    return idStatus;
  }

  return Number.MAX_SAFE_INTEGER;
}

function normalizarValorFormularioAgendamento(valor) {
  if (valor === null || valor === undefined || valor === '' || Number(valor) <= 0) {
    return '';
  }

  return String(valor);
}

function obterProximoCodigoCliente(clientes) {
  if (!Array.isArray(clientes) || clientes.length === 0) {
    return 1;
  }

  const maiorCodigo = clientes.reduce((maior, cliente) => {
    const codigoAtual = Number(cliente?.idCliente);
    return Number.isFinite(codigoAtual) && codigoAtual > maior ? codigoAtual : maior;
  }, 0);

  return maiorCodigo + 1;
}

function montarRotuloCliente(cliente, empresa) {
  const codigo = formatarCodigoCliente(cliente, empresa);
  const nome = cliente?.nomeFantasia || cliente?.razaoSocial || 'Fornecedor sem nome';
  const localizacao = [cliente?.cidade, cliente?.estado].filter(Boolean).join('/');

  return localizacao ? `${codigo} - ${nome} - ${localizacao}` : `${codigo} - ${nome}`;
}

