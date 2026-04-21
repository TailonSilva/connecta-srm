import { useEffect, useMemo, useState } from 'react';
import { Botao } from '../comuns/botao';
import { MensagemErroPopup } from '../comuns/mensagemErroPopup';
import { BotaoAcaoGrade } from '../comuns/botaoAcaoGrade';
import { GradePadrao } from '../comuns/gradePadrao';
import { normalizarTelefone } from '../../utilitarios/normalizarTelefone';
import { normalizarValorEntradaFormulario } from '../../utilitarios/normalizarTextoFormulario';
import { ModalContatoFornecedor as ModalContatoCliente } from './fornecedores-modalContatoFornecedor';
import { ModalCadastroConfiguracao } from './configuracoes-modalCadastroConfiguracao';

const estadoInicialGrupoEmpresa = {
  descricao: '',
  status: true
};

const estadoInicialContatoGrupo = {
  idContatoGrupoEmpresa: '',
  nome: '',
  cargo: '',
  email: '',
  telefone: '',
  whatsapp: '',
  status: true,
  principal: false
};

const filtrosIniciais = {
  status: ''
};

export function ModalGruposEmpresa({
  aberto,
  registros = [],
  contatosGruposEmpresa = [],
  somenteConsulta = false,
  fecharAoSalvar = false,
  aoFechar,
  aoSalvar,
  aoInativar,
  aoSelecionarGrupo
}) {
  const [modalContatoAberto, definirModalContatoAberto] = useState(false);
  const [modoFormulario, definirModoFormulario] = useState('novo');
  const [modoContato, definirModoContato] = useState('novo');
  const [grupoSelecionado, definirGrupoSelecionado] = useState(null);
  const [formularioContato, definirFormularioContato] = useState(estadoInicialContatoGrupo);
  const [contatosFormulario, definirContatosFormulario] = useState([]);
  const [mensagemErroContato, definirMensagemErroContato] = useState('');

  useEffect(() => {
    if (!aberto) {
      return;
    }

    definirModalContatoAberto(false);
    definirModoFormulario('novo');
    definirModoContato('novo');
    definirGrupoSelecionado(null);
    definirFormularioContato(estadoInicialContatoGrupo);
    definirContatosFormulario([]);
    definirMensagemErroContato('');
  }, [aberto]);

  useEffect(() => {
    if (!aberto) {
      return undefined;
    }

    function tratarTecla(evento) {
      if (evento.key === 'Escape' && modalContatoAberto) {
        fecharModalContato();
      }
    }

    window.addEventListener('keydown', tratarTecla);
    return () => window.removeEventListener('keydown', tratarTecla);
  }, [aberto, modalContatoAberto]);

  if (!aberto) {
    return null;
  }

  function prepararNovoFormulario() {
    definirGrupoSelecionado(null);
    definirContatosFormulario([]);
    definirModoFormulario('novo');
    definirMensagemErroContato('');
  }

  function prepararEdicaoFormulario(registro) {
    definirGrupoSelecionado(registro);
    definirContatosFormulario(criarContatosFormularioGrupo(contatosGruposEmpresa, registro.idGrupoEmpresa));
    definirModoFormulario('edicao');
    definirMensagemErroContato('');
  }

  function prepararConsultaFormulario(registro) {
    definirGrupoSelecionado(registro);
    definirContatosFormulario(criarContatosFormularioGrupo(contatosGruposEmpresa, registro.idGrupoEmpresa));
    definirModoFormulario('consulta');
    definirMensagemErroContato('');
  }

  function limparFormulario() {
    definirModoFormulario('novo');
    definirGrupoSelecionado(null);
    definirContatosFormulario([]);
    definirMensagemErroContato('');
    fecharModalContato();
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

  function iniciarNovoContato() {
    if (modoFormulario === 'consulta') {
      return;
    }

    definirFormularioContato(estadoInicialContatoGrupo);
    definirModoContato('novo');
    definirModalContatoAberto(true);
    definirMensagemErroContato('');
  }

  function editarContato(contato) {
    if (modoFormulario === 'consulta') {
      return;
    }

    definirFormularioContato(criarFormularioContato(contato));
    definirModoContato('edicao');
    definirModalContatoAberto(true);
    definirMensagemErroContato('');
  }

  function consultarContato(contato) {
    definirFormularioContato(criarFormularioContato(contato));
    definirModoContato('consulta');
    definirModalContatoAberto(true);
    definirMensagemErroContato('');
  }

  function salvarContato() {
    if (!String(formularioContato.nome || '').trim()) {
      definirMensagemErroContato('Informe o nome do contato do grupo de empresa.');
      return;
    }

    const identificador = formularioContato.idContatoGrupoEmpresa || `novo-${Date.now()}`;

    definirContatosFormulario((estadoAtual) => {
      const listaSemContato = estadoAtual.filter(
        (contato) => String(contato.idContatoGrupoEmpresa || contato.idTemporario) !== String(identificador)
      );

      const contatoPreparado = {
        ...formularioContato,
        idContatoGrupoEmpresa: typeof formularioContato.idContatoGrupoEmpresa === 'number'
          ? formularioContato.idContatoGrupoEmpresa
          : '',
        idTemporario: typeof formularioContato.idContatoGrupoEmpresa === 'number' ? '' : identificador
      };

      return [...listaSemContato, contatoPreparado]
        .map((contato) => ({
          ...contato,
          principal: contatoPreparado.principal
            ? identificarContatoGrupo(contato) === identificarContatoGrupo(contatoPreparado)
            : contato.principal
        }))
        .sort((contatoA, contatoB) => Number(contatoB.status) - Number(contatoA.status));
    });

    fecharModalContato();
    definirMensagemErroContato('');
  }

  function inativarContato(contato) {
    if (modoFormulario === 'consulta') {
      return;
    }

    const identificador = identificarContatoGrupo(contato);

    definirContatosFormulario((estadoAtual) => estadoAtual.map((item) => (
      identificarContatoGrupo(item) === identificador
        ? { ...item, status: false, principal: false }
        : item
    )));
  }

  function fecharModalContato() {
    definirModalContatoAberto(false);
    definirModoContato('novo');
    definirFormularioContato(estadoInicialContatoGrupo);
  }

  async function tratarSalvarConcluido(registroSalvo) {
    if (typeof aoSelecionarGrupo === 'function' && registroSalvo?.idGrupoEmpresa) {
      await aoSelecionarGrupo(registroSalvo);
    }

    if (fecharAoSalvar) {
      aoFechar();
    }
  }

  return (
    <>
      <ModalCadastroConfiguracao
        aberto={aberto}
        titulo="Grupos de empresa"
        rotuloIncluir="Incluir grupo"
        registros={registros}
        chavePrimaria="idGrupoEmpresa"
        somenteConsulta={somenteConsulta}
        classeModalFormulario="modalContatoCadastroConfiguracao"
        colunas={[
          { key: 'descricao', label: 'Descricao' },
          {
            key: 'contatoPrincipal',
            label: 'Contato principal',
            render: (registro) => {
              const contatoPrincipal = obterContatoPrincipalGrupo(contatosGruposEmpresa, registro.idGrupoEmpresa);

              return (
                <div className="celulaContatoModal">
                  <strong>{contatoPrincipal?.nome || 'Nao informado'}</strong>
                  <span>{contatoPrincipal?.email || contatoPrincipal?.telefone || 'Sem contato principal'}</span>
                </div>
              );
            }
          }
        ]}
        camposFormulario={[
          { name: 'descricao', label: 'Descricao', required: true },
          { name: 'status', label: 'Grupo ativo', type: 'checkbox', defaultValue: true }
        ]}
        aoFechar={aoFechar}
        aoSalvar={aoSalvar}
        aoSalvarConcluido={tratarSalvarConcluido}
        aoInativar={aoInativar}
        aoAbrirNovoFormulario={prepararNovoFormulario}
        aoAbrirEdicaoFormulario={prepararEdicaoFormulario}
        aoAbrirConsultaFormulario={prepararConsultaFormulario}
        aoFecharFormulario={limparFormulario}
        transformarPayloadSalvar={({ payloadBase }) => ({
          ...payloadBase,
          contatos: contatosFormulario
        })}
        renderFormularioExtra={({ modoFormulario: modoAtual }) => (
          <>
            <section className="painelContatosModalCliente painelContatosConfiguracao painelContatosGrupoEmpresaFormulario">
              <div className="cabecalhoGradeContatosModal">
                <div>
                  <h3>Contatos do grupo</h3>
                </div>
                <Botao variante={modoAtual === 'consulta' ? 'secundario' : 'primario'} type="button" onClick={iniciarNovoContato} disabled={modoAtual === 'consulta'}>
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
                temItens={contatosFormulario.length > 0}
                mensagemVazia="Nenhum contato cadastrado."
              >
                {contatosFormulario.map((contato) => (
                  <tr key={identificarContatoGrupo(contato)}>
                    <td>
                      <div className="celulaContatoModal">
                        <strong>{contato.nome}</strong>
                        <span>{contato.cargo || 'Cargo nao informado'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="celulaContatoComunicacao">
                        <span>{contato.email || 'E-mail nao informado'}</span>
                        <span>{normalizarTelefone(contato.whatsapp || contato.telefone) || 'Telefone nao informado'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="grupoEtiquetasContato">
                        <span className={`etiquetaStatus ${contato.status ? 'ativo' : 'inativo'}`}>
                          {contato.status ? 'Ativo' : 'Inativo'}
                        </span>
                        {contato.principal ? <span className="etiquetaStatus etiquetaPrincipal">Principal</span> : null}
                      </div>
                    </td>
                    <td>
                      <div className="acoesContatoModal">
                        <BotaoAcaoGrade icone="consultar" titulo="Consultar contato" onClick={() => consultarContato(contato)} />
                        <BotaoAcaoGrade icone="editar" titulo="Editar contato" onClick={() => editarContato(contato)} disabled={modoAtual === 'consulta'} />
                        <BotaoAcaoGrade icone="inativar" titulo="Inativar contato" onClick={() => inativarContato(contato)} disabled={modoAtual === 'consulta'} />
                      </div>
                    </td>
                  </tr>
                ))}
              </GradePadrao>
            </section>

            <MensagemErroPopup mensagem={mensagemErroContato} titulo="Nao foi possivel salvar o contato do grupo." />
          </>
        )}
      />

      <ModalContatoCliente
        aberto={modalContatoAberto}
        modo={modoContato}
        formulario={formularioContato}
        aoAlterarCampo={alterarCampoContato}
        aoFechar={fecharModalContato}
        aoSalvar={salvarContato}
      />

    </>
  );
}

function criarContatosFormularioGrupo(contatosGruposEmpresa, idGrupoEmpresa) {
  return (contatosGruposEmpresa || [])
    .filter((contato) => String(contato.idGrupoEmpresa) === String(idGrupoEmpresa))
    .map((contato) => ({
      idContatoGrupoEmpresa: contato.idContatoGrupoEmpresa,
      nome: contato.nome || '',
      cargo: contato.cargo || '',
      email: contato.email || '',
      telefone: contato.telefone || '',
      whatsapp: contato.whatsapp || '',
      status: Boolean(contato.status),
      principal: Boolean(contato.principal),
      idTemporario: ''
    }));
}

function criarFormularioContato(contato) {
  if (!contato) {
    return estadoInicialContatoGrupo;
  }

  return {
    idContatoGrupoEmpresa: contato.idContatoGrupoEmpresa || '',
    nome: contato.nome || '',
    cargo: contato.cargo || '',
    email: contato.email || '',
    telefone: contato.telefone || '',
    whatsapp: contato.whatsapp || '',
    status: Boolean(contato.status),
    principal: Boolean(contato.principal)
  };
}

function obterContatoPrincipalGrupo(contatosGruposEmpresa, idGrupoEmpresa) {
  const contatosGrupo = (contatosGruposEmpresa || []).filter(
    (contato) => String(contato.idGrupoEmpresa) === String(idGrupoEmpresa) && Boolean(contato.status)
  );

  return contatosGrupo.find((contato) => contato.principal) || contatosGrupo[0] || null;
}

function identificarContatoGrupo(contato) {
  return String(contato.idContatoGrupoEmpresa || contato.idTemporario || '');
}

