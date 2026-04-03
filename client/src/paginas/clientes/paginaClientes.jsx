import { useEffect, useMemo, useState } from 'react';
import { CabecalhoClientes } from './cabecalhoClientes';
import { CorpoClientes } from './corpoClientes';
import {
  atualizarCliente,
  atualizarContato,
  atualizarRamoAtividade,
  incluirRamoAtividade,
  incluirCliente,
  incluirContato,
  listarClientes,
  listarContatos,
  listarRamosAtividade,
  listarVendedores
} from '../../servicos/clientes';
import { filtrarClientes } from '../../utilitarios/filtrarClientes';
import { normalizarTelefone } from '../../utilitarios/normalizarTelefone';
import { obterPrimeiroCodigoDisponivel } from '../../utilitarios/obterPrimeiroCodigoDisponivel';
import { normalizarFiltrosPorPadrao, useFiltrosPersistidos } from '../../utilitarios/useFiltrosPersistidos';
import { ModalFiltros } from '../../componentes/comuns/modalFiltros';
import { ModalCliente } from './modalCliente';
import { ModalManualClientes } from './modalManualClientes';

const filtrosIniciaisClientes = {
  estado: '',
  cidade: '',
  idRamo: '',
  idVendedor: '',
  tipo: '',
  status: ''
};

export function PaginaClientes({ usuarioLogado }) {
  const [pesquisa, definirPesquisa] = useState('');
  const [clientes, definirClientes] = useState([]);
  const [contatos, definirContatos] = useState([]);
  const [vendedores, definirVendedores] = useState([]);
  const [ramosAtividade, definirRamosAtividade] = useState([]);
  const [carregando, definirCarregando] = useState(true);
  const [mensagemErro, definirMensagemErro] = useState('');
  const [modalAberto, definirModalAberto] = useState(false);
  const [modalManualAberto, definirModalManualAberto] = useState(false);
  const [modalFiltrosAberto, definirModalFiltrosAberto] = useState(false);
  const [clienteEmEdicao, definirClienteEmEdicao] = useState(null);
  const [modoModalCliente, definirModoModalCliente] = useState('novo');
  const usuarioSomenteVendedor = usuarioLogado?.tipo === 'Usuario padrao' && usuarioLogado?.idVendedor;
  const usuarioSomenteConsultaConfiguracao = usuarioLogado?.tipo === 'Usuario padrao';
  const filtrosIniciais = useMemo(() => ({
    ...filtrosIniciaisClientes,
    idVendedor: usuarioSomenteVendedor ? String(usuarioLogado.idVendedor) : ''
  }), [usuarioSomenteVendedor, usuarioLogado?.idVendedor]);
  const [filtros, definirFiltros] = useFiltrosPersistidos({
    chave: 'paginaClientes',
    usuario: usuarioLogado,
    filtrosPadrao: filtrosIniciais,
    normalizarFiltros: normalizarFiltrosClientes
  });

  useEffect(() => {
    carregarDados();
  }, [usuarioSomenteVendedor, usuarioLogado?.idVendedor]);

  useEffect(() => {
    function tratarAtalhosClientes(evento) {
      if (evento.key !== 'F1') {
        return;
      }

      evento.preventDefault();

      if (!modalAberto && !modalManualAberto && !modalFiltrosAberto) {
        definirModalManualAberto(true);
      }
    }

    window.addEventListener('keydown', tratarAtalhosClientes);

    return () => {
      window.removeEventListener('keydown', tratarAtalhosClientes);
    };
  }, [modalAberto, modalManualAberto, modalFiltrosAberto]);

  async function carregarDados() {
    definirCarregando(true);
    definirMensagemErro('');

    try {
      const [
        clientesCarregados,
        contatosCarregados,
        vendedoresCarregados,
        ramosCarregados
      ] = await Promise.all([
        listarClientes(),
        listarContatos(),
        listarVendedores(),
        listarRamosAtividade()
      ]);

      const clientesVisiveis = usuarioSomenteVendedor
        ? clientesCarregados.filter((cliente) => cliente.idVendedor === usuarioLogado.idVendedor)
        : clientesCarregados;

      definirClientes(
        enriquecerClientes(clientesVisiveis, contatosCarregados, vendedoresCarregados)
      );
      definirContatos(contatosCarregados);
      definirVendedores(vendedoresCarregados);
      definirRamosAtividade(ramosCarregados);
    } catch (erro) {
      definirMensagemErro('Nao foi possivel carregar os clientes.');
    } finally {
      definirCarregando(false);
    }
  }

  async function salvarCliente(dadosCliente) {
    const payload = normalizarPayloadCliente({
      ...dadosCliente,
      idVendedor: usuarioSomenteVendedor ? String(usuarioLogado.idVendedor) : dadosCliente.idVendedor,
      idCliente: clienteEmEdicao?.idCliente || proximoCodigoCliente
    });
    let clienteSalvo;

    if (clienteEmEdicao?.idCliente) {
      clienteSalvo = await atualizarCliente(clienteEmEdicao.idCliente, payload);
    } else {
      clienteSalvo = await incluirCliente(payload);
    }

    await salvarContatosCliente(
      clienteSalvo.idCliente,
      dadosCliente.contatos || []
    );

    await carregarDados();
    definirModalAberto(false);
    definirClienteEmEdicao(null);
  }

  async function salvarRamoAtividade(dadosRamo) {
    const payload = {
      descricao: String(dadosRamo.descricao || '').trim(),
      status: dadosRamo.status ? 1 : 0
    };

    let ramoSalvo;

    if (dadosRamo.idRamo) {
      ramoSalvo = await atualizarRamoAtividade(dadosRamo.idRamo, payload);
    } else {
      ramoSalvo = await incluirRamoAtividade(payload);
    }

    const ramosAtualizados = await listarRamosAtividade();
    definirRamosAtividade(ramosAtualizados);

    return ramoSalvo;
  }

  async function inativarRamoAtividadeCliente(registro) {
    await atualizarRamoAtividade(registro.idRamo, { status: 0 });
    const ramosAtualizados = await listarRamosAtividade();
    definirRamosAtividade(ramosAtualizados);
  }

  function abrirNovoCliente() {
    definirClienteEmEdicao(null);
    definirModoModalCliente('novo');
    definirModalAberto(true);
  }

  function abrirEdicaoCliente(cliente) {
    definirClienteEmEdicao(cliente);
    definirModoModalCliente('edicao');
    definirModalAberto(true);
  }

  function abrirConsultaCliente(cliente) {
    definirClienteEmEdicao(cliente);
    definirModoModalCliente('consulta');
    definirModalAberto(true);
  }

  async function inativarCliente(cliente) {
    await atualizarCliente(cliente.idCliente, { status: 0 });
    await carregarDados();
  }

  function fecharModalCliente() {
    definirModalAberto(false);
    definirClienteEmEdicao(null);
    definirModoModalCliente('novo');
  }

  const clientesFiltrados = filtrarClientes(clientes, pesquisa, filtros);
  const proximoCodigoCliente = obterPrimeiroCodigoDisponivel(clientes, 'idCliente');
  const filtrosAtivos = Object.values(filtros).some(Boolean);
  const opcoesEstado = obterOpcoesTexto(clientes, 'estado');
  const opcoesCidade = obterOpcoesTexto(clientes, 'cidade');
  const vendedoresDisponiveis = usuarioSomenteVendedor
    ? vendedores.filter((vendedor) => vendedor.idVendedor === usuarioLogado.idVendedor)
    : vendedores;

  return (
    <>
      <CabecalhoClientes
        pesquisa={pesquisa}
        aoAlterarPesquisa={definirPesquisa}
        aoAbrirFiltros={() => definirModalFiltrosAberto(true)}
        aoNovoCliente={abrirNovoCliente}
        filtrosAtivos={filtrosAtivos}
      />
      <CorpoClientes
        clientes={clientesFiltrados}
        carregando={carregando}
        mensagemErro={mensagemErro}
        aoEditarCliente={abrirEdicaoCliente}
        aoConsultarCliente={abrirConsultaCliente}
        aoInativarCliente={inativarCliente}
      />
      <ModalFiltros
        aberto={modalFiltrosAberto}
        titulo="Filtros de clientes"
        filtros={filtros}
        campos={[
          { name: 'estado', label: 'Estado', options: opcoesEstado },
          { name: 'cidade', label: 'Cidade', options: opcoesCidade },
          {
            name: 'idRamo',
            label: 'Ramo de atividade',
            options: ramosAtividade.map((ramo) => ({
              valor: String(ramo.idRamo),
              label: ramo.descricao
            }))
          },
          {
            name: 'idVendedor',
            label: 'Vendedor',
            disabled: Boolean(usuarioSomenteVendedor),
            options: vendedoresDisponiveis.map((vendedor) => ({
              valor: String(vendedor.idVendedor),
              label: vendedor.nome
            }))
          },
          {
            name: 'tipo',
            label: 'Tipo',
            options: [
              { valor: 'Pessoa fisica', label: 'Pessoa fisica' },
              { valor: 'Pessoa juridica', label: 'Pessoa juridica' }
            ]
          },
          {
            name: 'status',
            label: 'Ativo',
            options: [
              { valor: '1', label: 'Ativo' },
              { valor: '0', label: 'Inativo' }
            ]
          }
        ]}
        aoFechar={() => definirModalFiltrosAberto(false)}
        aoAplicar={(proximosFiltros) => {
          definirFiltros(proximosFiltros);
          definirModalFiltrosAberto(false);
        }}
        aoLimpar={() => definirFiltros(filtrosIniciais)}
      />
      <ModalCliente
        aberto={modalAberto}
        cliente={clienteEmEdicao}
        usuarioLogado={usuarioLogado}
        codigoSugerido={proximoCodigoCliente}
        contatos={obterContatosDoCliente(contatos, clienteEmEdicao?.idCliente)}
        vendedores={vendedoresDisponiveis}
        ramosAtividade={ramosAtividade}
        modo={modoModalCliente}
        somenteConsultaRamos={usuarioSomenteConsultaConfiguracao}
        idVendedorBloqueado={usuarioSomenteVendedor ? usuarioLogado.idVendedor : null}
        aoFechar={fecharModalCliente}
        aoSalvarRamoAtividade={salvarRamoAtividade}
        aoInativarRamoAtividade={inativarRamoAtividadeCliente}
        aoSalvar={salvarCliente}
      />
      <ModalManualClientes
        aberto={modalManualAberto}
        aoFechar={() => definirModalManualAberto(false)}
        clientes={clientesFiltrados}
        contatos={contatos}
        vendedores={vendedoresDisponiveis}
        ramosAtividade={ramosAtividade}
        filtros={filtros}
        usuarioLogado={usuarioLogado}
      />
    </>
  );
}

function normalizarFiltrosClientes(filtros, filtrosPadrao) {
  const filtrosNormalizados = normalizarFiltrosPorPadrao(filtros, filtrosPadrao);

  return {
    ...filtrosNormalizados,
    idVendedor: filtrosPadrao.idVendedor || filtrosNormalizados.idVendedor
  };
}

function obterOpcoesTexto(registros, campo) {
  return [...new Set(
    registros
      .map((registro) => String(registro[campo] || '').trim())
      .filter(Boolean)
  )]
    .sort((valorA, valorB) => valorA.localeCompare(valorB))
    .map((valor) => ({
      valor,
      label: valor
    }));
}

async function salvarContatosCliente(idCliente, contatos) {
  const contatosNormalizados = normalizarContatos(contatos, idCliente);

  for (const contato of contatosNormalizados) {
    if (contato.idContato) {
      await atualizarContato(contato.idContato, contato);
    } else {
      await incluirContato(contato);
    }
  }
}

function enriquecerClientes(clientes, contatos, vendedores) {
  const contatosPrincipaisPorCliente = new Map();
  const vendedoresPorId = new Map(
    vendedores.map((vendedor) => [vendedor.idVendedor, vendedor.nome])
  );

  contatos.forEach((contato) => {
    if (contato.principal) {
      contatosPrincipaisPorCliente.set(contato.idCliente, contato);
    }
  });

  return clientes.map((cliente) => ({
    ...cliente,
    nomeVendedor: vendedoresPorId.get(cliente.idVendedor) || 'Nao informado',
    nomeContatoPrincipal:
      contatosPrincipaisPorCliente.get(cliente.idCliente)?.nome || 'Nao informado',
    emailContatoPrincipal:
      contatosPrincipaisPorCliente.get(cliente.idCliente)?.email || 'E-mail nao informado'
  }));
}

function obterContatosDoCliente(contatos, idCliente) {
  if (!idCliente) {
    return [];
  }

  return contatos.filter((contato) => contato.idCliente === idCliente);
}

function normalizarPayloadCliente(dadosCliente) {
  const payload = {
    idVendedor: Number(dadosCliente.idVendedor),
    idRamo: Number(dadosCliente.idRamo),
    razaoSocial: dadosCliente.razaoSocial.trim(),
    nomeFantasia: dadosCliente.nomeFantasia.trim(),
    tipo: dadosCliente.tipo.trim(),
    cnpj: dadosCliente.cnpj.trim(),
    inscricaoEstadual: limparTextoOpcional(dadosCliente.inscricaoEstadual),
    status: dadosCliente.status ? 1 : 0,
    email: limparTextoOpcional(dadosCliente.email),
    telefone: limparTextoOpcional(normalizarTelefone(dadosCliente.telefone)),
    logradouro: limparTextoOpcional(dadosCliente.logradouro),
    numero: limparTextoOpcional(dadosCliente.numero),
    complemento: limparTextoOpcional(dadosCliente.complemento),
    bairro: limparTextoOpcional(dadosCliente.bairro),
    cidade: limparTextoOpcional(dadosCliente.cidade),
    estado: limparTextoOpcional(dadosCliente.estado)?.toUpperCase(),
    cep: limparTextoOpcional(dadosCliente.cep),
    observacao: limparTextoOpcional(dadosCliente.observacao),
    imagem: limparTextoOpcional(dadosCliente.imagem)
  };

  if (dadosCliente.idCliente) {
    payload.idCliente = Number(dadosCliente.idCliente);
  }

  return payload;
}

function limparTextoOpcional(valor) {
  const texto = String(valor || '').trim();
  return texto || null;
}

function normalizarContatos(contatos, idCliente) {
  return contatos.map((contato) => ({
    idContato: typeof contato.idContato === 'number' ? contato.idContato : undefined,
    idCliente,
    nome: contato.nome.trim(),
    cargo: limparTextoOpcional(contato.cargo),
    email: limparTextoOpcional(contato.email),
    telefone: limparTextoOpcional(normalizarTelefone(contato.telefone)),
    whatsapp: limparTextoOpcional(normalizarTelefone(contato.whatsapp)),
    status: contato.status ? 1 : 0,
    principal: contato.principal ? 1 : 0
  }));
}
