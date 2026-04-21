import { useEffect, useMemo, useState } from 'react';
import { CabecalhoFornecedores } from '../componentes/modulos/fornecedores-cabecalhoFornecedores';
import { CorpoFornecedores } from '../componentes/modulos/fornecedores-corpoFornecedores';
import {
  atualizarFornecedor,
  atualizarConceitoFornecedor,
  atualizarContato,
  atualizarGrupoEmpresa,
  atualizarRamoAtividade,
  incluirConceitoFornecedor,
  incluirGrupoEmpresa,
  incluirRamoAtividade,
  incluirFornecedor,
  incluirContato,
  importarFornecedoresPlanilha,
  listarFornecedoresGrid,
  listarConceitosFornecedor,
  listarContatos,
  listarGruposEmpresa,
  listarRamosAtividade,
  listarCompradores
} from '../servicos/fornecedores';
import { atualizarEmpresa, criarPayloadAtualizacaoColunasGrid, listarEmpresas } from '../servicos/empresa';
import {
  atualizarContatoGrupoEmpresa,
  incluirContatoGrupoEmpresa,
  listarContatosGruposEmpresaConfiguracao
} from '../servicos/configuracoes';
import { normalizarTelefone } from '../utilitarios/normalizarTelefone';
import { obterPrimeiroCodigoDisponivel } from '../utilitarios/obterPrimeiroCodigoDisponivel';
import { obterValorGrid } from '../utilitarios/valorPadraoGrid';
import {
  normalizarFiltrosPorPadrao,
  normalizarListaFiltroPersistido,
  useFiltrosPersistidos
} from '../hooks/useFiltrosPersistidos';
import { ModalFiltros } from '../componentes/comuns/modalFiltros';
import { ModalFornecedor } from '../componentes/modulos/fornecedores-modalFornecedor';
import { ModalImportacaoCadastro } from '../componentes/comuns/modalImportacaoCadastro';
import { ModalManualFornecedores } from '../componentes/modulos/fornecedores-modalManualFornecedores';
import { ModalColunasGridFornecedores } from '../componentes/modulos/configuracoes-modalColunasGridFornecedores';

const filtrosIniciaisFornecedores = {
  estado: [],
  cidade: '',
  idGrupoEmpresa: '',
  idRamo: [],
  idComprador: [],
  tipo: [],
  status: []
};

export function PaginaFornecedores({ usuarioLogado }) {
  const [pesquisa, definirPesquisa] = useState('');
  const [fornecedores, definirFornecedores] = useState([]);
  const [contatos, definirContatos] = useState([]);
  const [gruposEmpresa, definirGruposEmpresa] = useState([]);
  const [contatosGruposEmpresa, definirContatosGruposEmpresa] = useState([]);
  const [empresa, definirEmpresa] = useState(null);
  const [compradores, definirCompradores] = useState([]);
  const [ramosAtividade, definirRamosAtividade] = useState([]);
  const [conceitosFornecedor, definirConceitosFornecedor] = useState([]);
  const [carregandoContexto, definirCarregandoContexto] = useState(true);
  const [carregandoGrade, definirCarregandoGrade] = useState(true);
  const [mensagemErro, definirMensagemErro] = useState('');
  const [modalAberto, definirModalAberto] = useState(false);
  const [modalManualAberto, definirModalManualAberto] = useState(false);
  const [modalFiltrosAberto, definirModalFiltrosAberto] = useState(false);
  const [modalImportacaoAberto, definirModalImportacaoAberto] = useState(false);
  const [modalColunasGridAberto, definirModalColunasGridAberto] = useState(false);
  const [resultadoImportacao, definirResultadoImportacao] = useState(null);
  const [importando, definirImportando] = useState(false);
  const [fornecedorEmEdicao, definirFornecedorEmEdicao] = useState(null);
  const [modoModalFornecedor, definirModoModalFornecedor] = useState('novo');
  const filtrosIniciais = useMemo(() => ({
    ...filtrosIniciaisFornecedores,
    idComprador: []
  }), []);
  const [filtros, definirFiltros] = useFiltrosPersistidos({
    chave: 'paginaFornecedores',
    usuario: usuarioLogado,
    filtrosPadrao: filtrosIniciais,
    normalizarFiltros: normalizarFiltrosFornecedores
  });

  useEffect(() => {
    carregarContexto();
  }, []);

  useEffect(() => {
    carregarGradeFornecedores();
  }, [pesquisa, JSON.stringify(filtros)]);

  useEffect(() => {
    function tratarGrupoEmpresaAtualizado() {
      carregarContexto();
      carregarGradeFornecedores();
    }

    window.addEventListener('grupo-empresa-atualizado', tratarGrupoEmpresaAtualizado);

    return () => {
      window.removeEventListener('grupo-empresa-atualizado', tratarGrupoEmpresaAtualizado);
    };
  }, [pesquisa, JSON.stringify(filtros)]);

  useEffect(() => {
    function tratarEmpresaAtualizada() {
      carregarContexto();
      carregarGradeFornecedores();
    }

    window.addEventListener('empresa-atualizada', tratarEmpresaAtualizada);

    return () => {
      window.removeEventListener('empresa-atualizada', tratarEmpresaAtualizada);
    };
  }, [pesquisa, JSON.stringify(filtros)]);

  useEffect(() => {
    function tratarAtalhosFornecedores(evento) {
      if (evento.key !== 'F1') {
        return;
      }

      evento.preventDefault();

      if (!modalAberto && !modalManualAberto && !modalFiltrosAberto && !modalImportacaoAberto) {
        definirModalManualAberto(true);
      }
    }

    window.addEventListener('keydown', tratarAtalhosFornecedores);

    return () => {
      window.removeEventListener('keydown', tratarAtalhosFornecedores);
    };
  }, [modalAberto, modalManualAberto, modalFiltrosAberto, modalImportacaoAberto]);

  async function carregarContexto() {
    definirCarregandoContexto(true);
    try {
      const resultados = await Promise.allSettled([
        listarContatos(),
        listarGruposEmpresa({ incluirInativos: true }),
        listarContatosGruposEmpresaConfiguracao({ incluirInativos: true }),
        listarEmpresas(),
        listarCompradores(),
        listarRamosAtividade(),
        listarConceitosFornecedor({ incluirInativos: true })
      ]);

      const [
        contatosResultado,
        gruposEmpresaResultado,
        contatosGrupoResultado,
        empresasResultado,
        compradoresResultado,
        ramosResultado,
        conceitosResultado
      ] = resultados;

      definirContatos(contatosResultado.status === 'fulfilled' ? contatosResultado.value : []);
      definirGruposEmpresa(gruposEmpresaResultado.status === 'fulfilled' ? gruposEmpresaResultado.value : []);
      definirContatosGruposEmpresa(contatosGrupoResultado.status === 'fulfilled' ? contatosGrupoResultado.value : []);
      definirEmpresa(
        empresasResultado.status === 'fulfilled'
          ? (empresasResultado.value[0] || null)
          : null
      );
      definirCompradores(compradoresResultado.status === 'fulfilled' ? compradoresResultado.value : []);
      definirRamosAtividade(ramosResultado.status === 'fulfilled' ? ramosResultado.value : []);
      definirConceitosFornecedor(conceitosResultado.status === 'fulfilled' ? conceitosResultado.value : []);
    } finally {
      definirCarregandoContexto(false);
    }
  }

  async function carregarGradeFornecedores() {
    definirCarregandoGrade(true);
    definirMensagemErro('');

    try {
      const fornecedoresCarregados = await listarFornecedoresGrid({
        pesquisa,
        filtros
      });

      definirFornecedores(
        enriquecerFornecedores(
          fornecedoresCarregados,
          contatos,
          compradores,
          gruposEmpresa,
          ramosAtividade
        )
      );
    } catch (erro) {
      definirMensagemErro(erro?.message || 'Nao foi possivel carregar os fornecedores.');
    } finally {
      definirCarregandoGrade(false);
    }
  }

  async function recarregarPagina() {
    await Promise.all([carregarContexto(), carregarGradeFornecedores()]);
  }

  async function salvarColunasGridFornecedores(dadosColunas) {
    if (!empresa?.idEmpresa) {
      throw new Error('Cadastre a empresa antes de configurar as colunas do grid.');
    }

    await atualizarEmpresa(
      empresa.idEmpresa,
      criarPayloadAtualizacaoColunasGrid('colunasGridFornecedores', dadosColunas.colunasGridFornecedores)
    );

    const empresasAtualizadas = await listarEmpresas();
    definirEmpresa(empresasAtualizadas[0] || null);
    window.dispatchEvent(new CustomEvent('empresa-atualizada'));
    definirModalColunasGridAberto(false);
  }

  async function salvarFornecedor(dadosFornecedor) {
    const payload = normalizarPayloadFornecedor({
      ...dadosFornecedor,
      idComprador: dadosFornecedor.idComprador,
      idFornecedor: fornecedorEmEdicao?.idFornecedor || proximoCodigoFornecedor
    });
    let fornecedorSalvo;

    if (fornecedorEmEdicao?.idFornecedor) {
      fornecedorSalvo = await atualizarFornecedor(fornecedorEmEdicao.idFornecedor, payload);
    } else {
      fornecedorSalvo = await incluirFornecedor(payload);
    }

    await salvarContatosFornecedor(
      fornecedorSalvo.idFornecedor,
      dadosFornecedor.contatos || []
    );

    await recarregarPagina();
    definirModalAberto(false);
    definirFornecedorEmEdicao(null);
  }

  async function importarFornecedores(linhas) {
    definirImportando(true);

    try {
      const resultado = await importarFornecedoresPlanilha({
        linhas,
        idCompradorPadrao: null
      });

      definirResultadoImportacao(resultado);
      await recarregarPagina();
    } finally {
      definirImportando(false);
    }
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

  async function salvarConceitoFornecedor(dadosConceito) {
    const payload = {
      descricao: String(dadosConceito.descricao || '').trim(),
      status: dadosConceito.status ? 1 : 0
    };

    let conceitoSalvo;

    if (dadosConceito.idConceito) {
      conceitoSalvo = await atualizarConceitoFornecedor(dadosConceito.idConceito, payload);
    } else {
      conceitoSalvo = await incluirConceitoFornecedor(payload);
    }

    const conceitosAtualizados = await listarConceitosFornecedor({ incluirInativos: true });
    definirConceitosFornecedor(conceitosAtualizados);

    return conceitoSalvo;
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

    await recarregarPagina();
    window.dispatchEvent(new CustomEvent('grupo-empresa-atualizado'));
    return grupoSalvo;
  }

  async function inativarRamoAtividadeFornecedor(registro) {
    await atualizarRamoAtividade(registro.idRamo, { status: 0 });
    const ramosAtualizados = await listarRamosAtividade();
    definirRamosAtividade(ramosAtualizados);
  }

  async function inativarConceitoFornecedorCadastro(registro) {
    await atualizarConceitoFornecedor(registro.idConceito, { status: 0 });
    const conceitosAtualizados = await listarConceitosFornecedor({ incluirInativos: true });
    definirConceitosFornecedor(conceitosAtualizados);
  }

  async function inativarGrupoEmpresaFornecedor(registro) {
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

    await recarregarPagina();
    window.dispatchEvent(new CustomEvent('grupo-empresa-atualizado'));
  }

  function abrirNovoFornecedor() {
    definirFornecedorEmEdicao(null);
    definirModoModalFornecedor('novo');
    definirModalAberto(true);
  }

  function abrirEdicaoFornecedor(fornecedor) {
    definirFornecedorEmEdicao(fornecedor);
    definirModoModalFornecedor('edicao');
    definirModalAberto(true);
  }

  function abrirConsultaFornecedor(fornecedor) {
    definirFornecedorEmEdicao(fornecedor);
    definirModoModalFornecedor('consulta');
    definirModalAberto(true);
  }

  async function inativarFornecedor(fornecedor) {
    await atualizarFornecedor(fornecedor.idFornecedor, { status: 0 });
    await recarregarPagina();
  }

  function fecharModalFornecedor() {
    definirModalAberto(false);
    definirFornecedorEmEdicao(null);
    definirModoModalFornecedor('novo');
  }

  const carregando = carregandoContexto || carregandoGrade;
  const proximoCodigoFornecedor = obterPrimeiroCodigoDisponivel(fornecedores, 'idFornecedor');
  const filtrosAtivos = Object.values(filtros).some((valor) => (
    Array.isArray(valor) ? valor.length > 0 : Boolean(valor)
  ));
  const opcoesEstado = obterOpcoesTexto(fornecedores, 'estado');
  const opcoesCidade = obterOpcoesTexto(fornecedores, 'cidade');
  const compradoresDisponiveis = compradores;
  const referenciasImportacaoFornecedores = useMemo(() => ({
    comprador: {
      opcoes: compradoresDisponiveis.map((comprador) => ({
        valor: comprador.nome || '',
        label: comprador.nome || '-'
      }))
    },
    ramoAtividade: {
      opcoes: ramosAtividade.map((ramo) => ({
        valor: ramo.descricao || '',
        label: ramo.descricao || '-'
      }))
    },
    grupoEmpresa: {
      opcoes: gruposEmpresa
        .filter((grupo) => Number(grupo.status ?? 1) !== 0)
        .map((grupo) => ({
          valor: grupo.descricao || '',
          label: grupo.descricao || '-'
        }))
    }
  }), [gruposEmpresa, ramosAtividade, compradoresDisponiveis]);

  return (
    <>
      <CabecalhoFornecedores
        pesquisa={pesquisa}
        aoAlterarPesquisa={definirPesquisa}
        aoAbrirFiltros={() => definirModalFiltrosAberto(true)}
        aoAbrirConfiguracaoGrid={() => definirModalColunasGridAberto(true)}
        aoAbrirImportacao={() => {
          definirResultadoImportacao(null);
          definirModalImportacaoAberto(true);
        }}
        aoNovoFornecedor={abrirNovoFornecedor}
        filtrosAtivos={filtrosAtivos}
        configuracaoGridBloqueada={usuarioLogado?.tipo === 'Usuario padrao' || !empresa?.idEmpresa}
      />
      <CorpoFornecedores
        empresa={empresa}
        fornecedores={fornecedores}
        carregando={carregando}
        mensagemErro={mensagemErro}
        aoEditarFornecedor={abrirEdicaoFornecedor}
        aoConsultarFornecedor={abrirConsultaFornecedor}
        aoInativarFornecedor={inativarFornecedor}
      />
      <ModalFiltros
        aberto={modalFiltrosAberto}
        titulo="Filtros de fornecedores"
        filtros={filtros}
        campos={[
          {
            name: 'estado',
            label: 'Estado',
            multiple: true,
            placeholder: 'Todos os estados',
            options: opcoesEstado
          },
          { name: 'cidade', label: 'Cidade', options: opcoesCidade },
          {
            name: 'idGrupoEmpresa',
            label: 'Grupo de empresa',
            options: gruposEmpresa.map((grupo) => ({
              valor: String(grupo.idGrupoEmpresa),
              label: grupo.descricao
            }))
          },
          {
            name: 'idRamo',
            label: 'Ramo de atividade',
            multiple: true,
            placeholder: 'Todos os ramos',
            options: ramosAtividade.map((ramo) => ({
              valor: String(ramo.idRamo),
              label: ramo.descricao
            }))
          },
          {
            name: 'idComprador',
            label: 'Comprador',
            multiple: true,
            placeholder: 'Todos os compradores',
            options: compradoresDisponiveis.map((comprador) => ({
              valor: String(comprador.idComprador),
              label: comprador.nome
            }))
          },
          {
            name: 'tipo',
            label: 'Tipo',
            multiple: true,
            placeholder: 'Todos os tipos',
            options: [
              { valor: 'Pessoa fisica', label: 'Pessoa fisica' },
              { valor: 'Pessoa juridica', label: 'Pessoa juridica' }
            ]
          },
          {
            name: 'status',
            label: 'Ativo',
            multiple: true,
            placeholder: 'Todos',
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
      <ModalFornecedor
        aberto={modalAberto}
        fornecedor={fornecedorEmEdicao}
        usuarioLogado={usuarioLogado}
        codigoSugerido={proximoCodigoFornecedor}
        contatos={obterContatosDoFornecedor(contatos, fornecedorEmEdicao?.idFornecedor)}
        contatosEditaveis={obterContatosEditaveisDoFornecedor(contatos, fornecedorEmEdicao?.idFornecedor)}
        gruposEmpresa={gruposEmpresa}
        contatosGruposEmpresa={contatosGruposEmpresa}
        compradores={compradoresDisponiveis}
        ramosAtividade={ramosAtividade}
        conceitosFornecedor={conceitosFornecedor}
        modo={modoModalFornecedor}
        empresa={empresa}
        somenteConsultaRamos={false}
        somenteConsultaGrupos={false}
        idCompradorBloqueado={null}
        aoFechar={fecharModalFornecedor}
        aoSalvarRamoAtividade={salvarRamoAtividade}
        aoSalvarConceitoFornecedor={salvarConceitoFornecedor}
        aoInativarRamoAtividade={inativarRamoAtividadeFornecedor}
        aoInativarConceitoFornecedor={inativarConceitoFornecedorCadastro}
        aoSalvarGrupoEmpresa={salvarGrupoEmpresa}
        aoInativarGrupoEmpresa={inativarGrupoEmpresaFornecedor}
        aoSalvar={salvarFornecedor}
      />
      <ModalManualFornecedores
        aberto={modalManualAberto}
        aoFechar={() => definirModalManualAberto(false)}
        fornecedores={fornecedores}
        contatos={contatos}
        gruposEmpresa={gruposEmpresa}
        compradores={compradoresDisponiveis}
        ramosAtividade={ramosAtividade}
        filtros={filtros}
        usuarioLogado={usuarioLogado}
      />
      <ModalColunasGridFornecedores
        aberto={modalColunasGridAberto}
        empresa={empresa}
        aoFechar={() => definirModalColunasGridAberto(false)}
        aoSalvar={salvarColunasGridFornecedores}
      />
      <ModalImportacaoCadastro
        aberto={modalImportacaoAberto}
        tipo="fornecedores"
        carregando={importando}
        resultado={resultadoImportacao}
        referenciasRelacionais={referenciasImportacaoFornecedores}
        onFechar={() => {
          definirModalImportacaoAberto(false);
          definirResultadoImportacao(null);
        }}
        onImportar={importarFornecedores}
      />
    </>
  );
}

function normalizarFiltrosFornecedores(filtros, filtrosPadrao) {
  const filtrosNormalizados = normalizarFiltrosPorPadrao(filtros, filtrosPadrao);

  return {
    ...filtrosNormalizados,
    estado: normalizarListaFiltroPersistido(filtrosNormalizados.estado),
    idRamo: normalizarListaFiltroPersistido(filtrosNormalizados.idRamo),
    idComprador: filtrosPadrao.idComprador?.length > 0
      ? [...filtrosPadrao.idComprador]
      : normalizarListaFiltroPersistido(filtrosNormalizados.idComprador),
    tipo: normalizarListaFiltroPersistido(filtrosNormalizados.tipo),
    status: normalizarListaFiltroPersistido(filtrosNormalizados.status)
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

async function salvarContatosFornecedor(idFornecedor, contatos) {
  const contatosNormalizados = normalizarContatos(contatos, idFornecedor);

  for (const contato of contatosNormalizados) {
    if (contato.idContato) {
      await atualizarContato(contato.idContato, contato);
    } else {
      await incluirContato(contato);
    }
  }
}

function enriquecerFornecedores(fornecedores, contatos, compradores, gruposEmpresa, ramosAtividade) {
  const contatosPrincipaisPorFornecedor = new Map();
  const compradoresPorId = new Map(
    compradores.map((comprador) => [String(comprador.idComprador), comprador.nome])
  );
  const gruposEmpresaPorId = new Map(
    (gruposEmpresa || []).map((grupo) => [String(grupo.idGrupoEmpresa), grupo.descricao])
  );
  const ramosPorId = new Map(
    (ramosAtividade || []).map((ramo) => [String(ramo.idRamo), ramo.descricao])
  );

  contatos.forEach((contato) => {
    if (contato.principal) {
      contatosPrincipaisPorFornecedor.set(String(contato.idFornecedor), contato);
    }
  });

  return fornecedores.map((fornecedor) => ({
    ...fornecedor,
    nomeGrupoEmpresa: obterValorGrid(
      fornecedor.nomeGrupoEmpresa || gruposEmpresaPorId.get(String(fornecedor.idGrupoEmpresa))
    ),
    nomeRamo: obterValorGrid(
      fornecedor.nomeRamo || ramosPorId.get(String(fornecedor.idRamo))
    ),
    nomeComprador: obterValorGrid(
      fornecedor.nomeComprador || compradoresPorId.get(String(fornecedor.idComprador))
    ),
    nomeContatoPrincipal: obterValorGrid(
      fornecedor.nomeContatoPrincipal || contatosPrincipaisPorFornecedor.get(String(fornecedor.idFornecedor))?.nome
    ),
    emailContatoPrincipal: obterValorGrid(
      fornecedor.emailContatoPrincipal || contatosPrincipaisPorFornecedor.get(String(fornecedor.idFornecedor))?.email
    )
  }));
}

function obterContatosDoFornecedor(contatos, idFornecedor) {
  if (!idFornecedor) {
    return [];
  }

  return contatos.filter((contato) => contato.idFornecedor === idFornecedor);
}

function obterContatosEditaveisDoFornecedor(contatos, idFornecedor) {
  return obterContatosDoFornecedor(contatos, idFornecedor)
    .filter((contato) => !Boolean(contato.contatoVinculadoGrupo));
}

function normalizarPayloadFornecedor(dadosFornecedor) {
  const payload = {
    idComprador: Number(dadosFornecedor.idComprador),
    idConceito: Number(dadosFornecedor.idConceito),
    idGrupoEmpresa: dadosFornecedor.idGrupoEmpresa ? Number(dadosFornecedor.idGrupoEmpresa) : null,
    idRamo: Number(dadosFornecedor.idRamo),
    razaoSocial: dadosFornecedor.razaoSocial.trim(),
    nomeFantasia: dadosFornecedor.nomeFantasia.trim(),
    tipo: dadosFornecedor.tipo.trim(),
    cnpj: dadosFornecedor.cnpj.trim(),
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
    codigoAlternativo: normalizarCodigoAlternativo(dadosFornecedor.codigoAlternativo),
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

function normalizarCodigoAlternativo(valor) {
  const digitos = String(valor ?? '').replace(/\D/g, '').trim();
  return digitos ? Number(digitos) : null;
}

function normalizarContatos(contatos, idFornecedor) {
  return contatos.map((contato) => ({
    idContato: typeof contato.idContato === 'number' ? contato.idContato : undefined,
    idFornecedor,
    nome: contato.nome.trim(),
    cargo: limparTextoOpcional(contato.cargo),
    email: limparTextoOpcional(contato.email),
    telefone: limparTextoOpcional(normalizarTelefone(contato.telefone)),
    whatsapp: limparTextoOpcional(normalizarTelefone(contato.whatsapp)),
    status: contato.status ? 1 : 0,
    principal: contato.principal ? 1 : 0
  }));
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



