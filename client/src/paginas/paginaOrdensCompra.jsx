import { useEffect, useMemo, useState } from 'react';
import '../recursos/estilos/cabecalhoPagina.css';
import { AcoesRegistro } from '../componentes/comuns/acoesRegistro';
import { Botao } from '../componentes/comuns/botao';
import { CampoPesquisa } from '../componentes/comuns/campoPesquisa';
import { CodigoRegistro } from '../componentes/comuns/codigoRegistro';
import { GradePadrao } from '../componentes/comuns/gradePadrao';
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
  listarMetodosPagamentoConfiguracao,
  listarPrazosPagamentoConfiguracao,
  listarTiposOrdemCompraConfiguracao
} from '../servicos/configuracoes';
import { atualizarEmpresa, criarPayloadAtualizacaoColunasGrid, listarEmpresas } from '../servicos/empresa';
import { atualizarOrdemCompra, excluirOrdemCompra, incluirOrdemCompra, listarOrdensCompra } from '../servicos/ordensCompra';
import { listarProdutos } from '../servicos/produtos';
import { listarUsuarios } from '../servicos/usuarios';
import { normalizarPreco } from '../utilitarios/normalizarPreco';
import { formatarCodigoFornecedor } from '../utilitarios/codigoFornecedor';
import { obterValorGrid } from '../utilitarios/valorPadraoGrid';
import {
  normalizarColunasGridOrdensCompra,
  TOTAL_COLUNAS_GRID_ORDENS_COMPRA
} from '../dados/colunasGridOrdensCompra';
import {
  normalizarFiltrosPorPadrao,
  normalizarListaFiltroPersistido,
  useFiltrosPersistidos
} from '../hooks/useFiltrosPersistidos';
import { ModalOrdemCompra } from '../componentes/modulos/ordensCompra-modalOrdemCompra';
import { ModalManualOrdensCompra } from '../componentes/modulos/ordensCompra-modalManualOrdensCompra';
import { ModalColunasGridOrdensCompra } from '../componentes/modulos/configuracoes-modalColunasGridOrdensCompra';

const ID_ETAPA_ORDEM_COMPRA_ENTREGUE = 5;

function criarFiltrosIniciaisOrdensCompra(usuarioLogado) {
  const compradorTravado = usuarioLogado?.tipo === 'Usuario padrao' && usuarioLogado?.idComprador;

  return {
    idFornecedor: '',
    idUsuario: '',
    idComprador: compradorTravado ? [String(usuarioLogado.idComprador)] : [],
    idEtapaOrdemCompra: [],
    dataInclusaoInicio: '',
    dataInclusaoFim: '',
    dataEntregaInicio: '',
    dataEntregaFim: ''
  };
}

function normalizarEtapasOrdemCompra(etapasOrdemCompra) {
  if (!Array.isArray(etapasOrdemCompra)) {
    return [];
  }

  return etapasOrdemCompra.map((etapa) => ({
    ...etapa,
    idEtapaOrdemCompra: etapa.idEtapaOrdemCompra ?? etapa.idEtapa
  }));
}

function normalizarFiltrosOrdensCompra(filtros, filtrosPadrao) {
  const filtrosNormalizados = normalizarFiltrosPorPadrao(filtros, filtrosPadrao);
  const periodoInclusao = normalizarIntervaloDatasFiltros(
    filtrosNormalizados,
    filtrosPadrao,
    'dataInclusaoInicio',
    'dataInclusaoFim'
  );
  const periodoEntrega = normalizarIntervaloDatasFiltros(
    filtrosNormalizados,
    filtrosPadrao,
    'dataEntregaInicio',
    'dataEntregaFim'
  );

  return {
    ...filtrosNormalizados,
    ...periodoInclusao,
    ...periodoEntrega,
    idComprador: Array.isArray(filtros?.idComprador)
      ? normalizarListaFiltroPersistido(filtros.idComprador)
      : normalizarListaFiltroPersistido(
        filtros?.idComprador
          ? [filtros.idComprador]
          : []
      ),
    idEtapaOrdemCompra: Array.isArray(filtros?.idEtapaOrdemCompra)
      ? normalizarListaFiltroPersistido(filtros.idEtapaOrdemCompra)
      : normalizarListaFiltroPersistido(
        filtros?.idEtapaOrdemCompra
          ? [filtros.idEtapaOrdemCompra]
          : []
      )
  };
}

export function PaginaOrdensCompra({ usuarioLogado }) {
  const [pesquisa, definirPesquisa] = useState('');
  const filtrosIniciais = useMemo(
    () => criarFiltrosIniciaisOrdensCompra(usuarioLogado),
    [usuarioLogado?.idComprador]
  );
  const [filtros, definirFiltros] = useFiltrosPersistidos({
    chave: 'paginaOrdensCompra',
    usuario: usuarioLogado,
    filtrosPadrao: filtrosIniciais,
    normalizarFiltros: normalizarFiltrosOrdensCompra
  });
  const [ordensCompra, definirOrdensCompra] = useState([]);
  const [fornecedores, definirFornecedores] = useState([]);
  const [contatos, definirContatos] = useState([]);
  const [usuarios, definirUsuarios] = useState([]);
  const [ramosAtividade, definirRamosAtividade] = useState([]);
  const [conceitosFornecedor, definirConceitosFornecedor] = useState([]);
  const [compradores, definirCompradores] = useState([]);
  const [metodosPagamento, definirMetodosPagamento] = useState([]);
  const [prazosPagamento, definirPrazosPagamento] = useState([]);
  const [tiposOrdemCompra, definirTiposOrdemCompra] = useState([]);
  const [produtos, definirProdutos] = useState([]);
  const [camposOrdemCompra, definirCamposOrdemCompra] = useState([]);
  const [etapasOrdemCompra, definirEtapasOrdemCompra] = useState([]);
  const [empresa, definirEmpresa] = useState(null);
  const [carregandoContexto, definirCarregandoContexto] = useState(true);
  const [carregandoGrade, definirCarregandoGrade] = useState(true);
  const [mensagemErro, definirMensagemErro] = useState('');
  const [ordemCompraSelecionado, definirOrdemCompraSelecionado] = useState(null);
  const [modoModal, definirModoModal] = useState('consulta');
  const [modalAberto, definirModalAberto] = useState(false);
  const [modalManualAberto, definirModalManualAberto] = useState(false);
  const [modalFiltrosAberto, definirModalFiltrosAberto] = useState(false);
  const [modalColunasGridAberto, definirModalColunasGridAberto] = useState(false);
  const [ordemCompraExclusaoPendente, definirOrdemCompraExclusaoPendente] = useState(null);
  const usuarioSomenteComprador = usuarioLogado?.tipo === 'Usuario padrao' && usuarioLogado?.idComprador;
  const usuarioSomenteConsultaConfiguracao = usuarioLogado?.tipo === 'Usuario padrao';
  const permitirExcluir = usuarioLogado?.tipo !== 'Usuario padrao';

  useEffect(() => {
    carregarContexto();
  }, []);

  useEffect(() => {
    if (carregandoContexto) {
      return;
    }

    carregarGradeOrdensCompra();
  }, [carregandoContexto, pesquisa, JSON.stringify(filtros)]);

  useEffect(() => {
    function tratarGrupoEmpresaAtualizado() {
      carregarContexto();
      carregarGradeOrdensCompra();
    }

    window.addEventListener('grupo-empresa-atualizado', tratarGrupoEmpresaAtualizado);

    return () => {
      window.removeEventListener('grupo-empresa-atualizado', tratarGrupoEmpresaAtualizado);
    };
  }, [pesquisa, JSON.stringify(filtros)]);

  useEffect(() => {
    function tratarEmpresaAtualizada() {
      carregarContexto();
      carregarGradeOrdensCompra();
    }

    window.addEventListener('empresa-atualizada', tratarEmpresaAtualizada);

    return () => {
      window.removeEventListener('empresa-atualizada', tratarEmpresaAtualizada);
    };
  }, [pesquisa, JSON.stringify(filtros)]);

  useEffect(() => {
    function tratarAtalhosOrdensCompra(evento) {
      if (evento.key !== 'F1') {
        return;
      }

      evento.preventDefault();

      if (!modalAberto && !modalManualAberto && !modalFiltrosAberto && !ordemCompraExclusaoPendente) {
        definirModalManualAberto(true);
      }
    }

    window.addEventListener('keydown', tratarAtalhosOrdensCompra);

    return () => {
      window.removeEventListener('keydown', tratarAtalhosOrdensCompra);
    };
  }, [modalAberto, modalManualAberto, modalFiltrosAberto, ordemCompraExclusaoPendente]);

  async function carregarContexto() {
    definirCarregandoContexto(true);
    definirMensagemErro('');

    try {
      const resultados = await Promise.allSettled([
        listarEtapasOrdemCompraConfiguracao(),
        listarFornecedores(),
        listarContatos(),
        listarUsuarios(),
        listarRamosAtividade(),
        listarConceitosFornecedor({ incluirInativos: true }),
        listarCompradores(),
        listarMetodosPagamentoConfiguracao(),
        listarPrazosPagamentoConfiguracao(),
        listarTiposOrdemCompraConfiguracao(),
        listarProdutos(),
        listarCamposOrdemCompraConfiguracao(),
        listarEmpresas()
      ]);

      const [
        etapasResultado,
        fornecedoresResultado,
        contatosResultado,
        usuariosResultado,
        ramosResultado,
        conceitosResultado,
        compradoresResultado,
        metodosResultado,
        prazosResultado,
        tiposOrdemCompraResultado,
        produtosResultado,
        camposResultado,
        empresasResultado
      ] = resultados;

      const etapasCarregadas = etapasResultado.status === 'fulfilled' ? etapasResultado.value : [];
      const fornecedoresCarregados = fornecedoresResultado.status === 'fulfilled' ? fornecedoresResultado.value : [];
      const contatosCarregados = contatosResultado.status === 'fulfilled' ? contatosResultado.value : [];
      const usuariosCarregados = usuariosResultado.status === 'fulfilled' ? usuariosResultado.value : [];
      const ramosCarregados = ramosResultado.status === 'fulfilled' ? ramosResultado.value : [];
      const conceitosCarregados = conceitosResultado.status === 'fulfilled' ? conceitosResultado.value : [];
      const compradoresCarregados = compradoresResultado.status === 'fulfilled' ? compradoresResultado.value : [];
      const metodosCarregados = metodosResultado.status === 'fulfilled' ? metodosResultado.value : [];
      const prazosCarregados = prazosResultado.status === 'fulfilled' ? prazosResultado.value : [];
      const tiposOrdemCompraCarregados = tiposOrdemCompraResultado.status === 'fulfilled' ? tiposOrdemCompraResultado.value : [];
      const produtosCarregados = produtosResultado.status === 'fulfilled' ? produtosResultado.value : [];
      const camposCarregados = camposResultado.status === 'fulfilled' ? camposResultado.value : [];
      const empresasCarregadas = empresasResultado.status === 'fulfilled' ? empresasResultado.value : [];

      const etapasNormalizadas = normalizarEtapasOrdemCompra(etapasCarregadas);

      definirEtapasOrdemCompra(etapasNormalizadas);
      definirFornecedores(fornecedoresCarregados);
      definirContatos(contatosCarregados);
      definirUsuarios(usuariosCarregados);
      definirRamosAtividade(ramosCarregados);
      definirConceitosFornecedor(conceitosCarregados);
      definirCompradores(compradoresCarregados);
      definirMetodosPagamento(metodosCarregados);
      definirPrazosPagamento(enriquecerPrazosPagamento(prazosCarregados, metodosCarregados));
      definirTiposOrdemCompra(tiposOrdemCompraCarregados);
      definirProdutos(produtosCarregados);
      definirCamposOrdemCompra(camposCarregados);
      definirEmpresa(empresasCarregadas[0] || null);

      return {
        etapasOrdemCompra: etapasNormalizadas,
        fornecedores: fornecedoresCarregados,
        contatos: contatosCarregados,
        usuarios: usuariosCarregados,
        ramosAtividade: ramosCarregados,
        compradores: compradoresCarregados,
        metodosPagamento: metodosCarregados,
        prazosPagamento: prazosCarregados,
        tiposOrdemCompra: tiposOrdemCompraCarregados,
        produtos: produtosCarregados,
        camposOrdemCompra: camposCarregados,
        empresa: empresasCarregadas[0] || null
      };
    } catch (_erro) {
      definirMensagemErro('Nao foi possivel carregar as ordens de compra.');
      return null;
    } finally {
      definirCarregandoContexto(false);
    }
  }

  async function carregarGradeOrdensCompra(contextoAtual = null) {
    if (!contextoAtual && carregandoContexto) {
      return;
    }

    definirCarregandoGrade(true);
    definirMensagemErro('');

    try {
      const ordensCompraCarregados = await listarOrdensCompra({
        search: pesquisa,
        ...filtros,
        ...(usuarioSomenteComprador
          ? {
            escopoIdComprador: usuarioLogado?.idComprador
          }
          : {})
      });

      definirOrdensCompra(enriquecerOrdensCompra(
        ordensCompraCarregados,
        contextoAtual?.etapasOrdemCompra || etapasOrdemCompra
      ));
    } catch (_erro) {
      definirMensagemErro('Nao foi possivel carregar as ordens de compra.');
    } finally {
      definirCarregandoGrade(false);
    }
  }

  async function recarregarPagina() {
    const contextoAtualizado = await carregarContexto();
    await carregarGradeOrdensCompra(contextoAtualizado);
  }

  async function salvarColunasGridOrdensCompra(dadosColunas) {
    if (!empresa?.idEmpresa) {
      throw new Error('Cadastre a empresa antes de configurar as colunas do grid.');
    }

    await atualizarEmpresa(
      empresa.idEmpresa,
      criarPayloadAtualizacaoColunasGrid('colunasGridOrdensCompra', dadosColunas.colunasGridOrdensCompra)
    );

    const empresasAtualizadas = await listarEmpresas();
    definirEmpresa(empresasAtualizadas[0] || null);
    window.dispatchEvent(new CustomEvent('empresa-atualizada'));
    definirModalColunasGridAberto(false);
  }

  function abrirNovoOrdemCompra() {
    definirOrdemCompraSelecionado(null);
    definirModoModal('novo');
    definirModalAberto(true);
  }

  function abrirConsultaOrdemCompra(ordemCompra) {
    definirOrdemCompraSelecionado(ordemCompra);
    definirModoModal('consulta');
    definirModalAberto(true);
  }

  function abrirEdicaoOrdemCompra(ordemCompra) {
    if (ordemCompraBloqueadoParaUsuarioPadrao(ordemCompra, usuarioLogado)) {
      abrirConsultaOrdemCompra(ordemCompra);
      return;
    }

    definirOrdemCompraSelecionado(ordemCompra);
    definirModoModal('edicao');
    definirModalAberto(true);
  }

  function fecharModal() {
    definirOrdemCompraSelecionado(null);
    definirModoModal('consulta');
    definirModalAberto(false);
  }

  async function salvarOrdemCompra(dadosOrdemCompra) {
    const payload = normalizarPayloadOrdemCompra(dadosOrdemCompra);

    if (ordemCompraSelecionado?.idOrdemCompra) {
      await atualizarOrdemCompra(ordemCompraSelecionado.idOrdemCompra, payload);
    } else {
      await incluirOrdemCompra(payload);
    }

    await recarregarPagina();
    fecharModal();
  }

  async function incluirFornecedorPeloOrdemCompra(dadosFornecedor) {
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

  function abrirExclusaoOrdemCompra(ordemCompra) {
    if (!permitirExcluir) {
      return;
    }

    definirOrdemCompraExclusaoPendente(ordemCompra);
  }

  function cancelarExclusaoOrdemCompra() {
    definirOrdemCompraExclusaoPendente(null);
  }

  async function confirmarExclusaoOrdemCompra() {
    if (!ordemCompraExclusaoPendente) {
      return;
    }

    await excluirOrdemCompra(ordemCompraExclusaoPendente.idOrdemCompra);
    definirOrdemCompraExclusaoPendente(null);
    await recarregarPagina();
  }

  async function alterarEtapaRapidamente(ordemCompra, proximoIdEtapaOrdemCompra) {
    const valorEtapa = String(proximoIdEtapaOrdemCompra || '').trim();

    if (!ordemCompra?.idOrdemCompra || String(ordemCompra.idEtapaOrdemCompra || '') === valorEtapa) {
      return;
    }

    const etapaSelecionada = etapasOrdemCompra.find(
      (etapa) => String(etapa.idEtapaOrdemCompra) === valorEtapa
    );
    const payload = normalizarPayloadOrdemCompra({
      ...ordemCompra,
      idEtapaOrdemCompra: valorEtapa,
      nomeEtapaOrdemCompraSnapshot: etapaSelecionada?.descricao || '',
      dataEntrega: entrouNaEtapaEntregue(ordemCompra.idEtapaOrdemCompra, valorEtapa)
        ? obterDataAtualFormatoInput()
        : ordemCompra.dataEntrega
    });

    await atualizarOrdemCompra(ordemCompra.idOrdemCompra, payload);
    await recarregarPagina();
  }

  const carregando = carregandoContexto || carregandoGrade;
  const colunasVisiveisOrdensCompra = useMemo(
    () => normalizarColunasGridOrdensCompra(empresa?.colunasGridOrdensCompra),
    [empresa?.colunasGridOrdensCompra]
  );
  const filtrosAtivos = JSON.stringify(filtros) !== JSON.stringify(filtrosIniciais);

  return (
    <>
      <header className="cabecalhoPagina">
        <div>
          <h1>Ordens de Compra</h1>
          <p>Acompanhe as ordens de compra gerados a partir das propostas comerciais do SRM.</p>
        </div>

        <div className="acoesCabecalhoPagina">
          <CampoPesquisa
            valor={pesquisa}
            aoAlterar={definirPesquisa}
            placeholder="Pesquisar ordens de compra"
            ariaLabel="Pesquisar ordens de compra"
          />
          <Botao
            variante={filtrosAtivos ? 'primario' : 'secundario'}
            icone="filtro"
            somenteIcone
            title="Filtrar"
            aria-label="Filtrar"
            onClick={() => definirModalFiltrosAberto(true)}
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
            title="Nova ordem de compra"
            aria-label="Nova ordem de compra"
            onClick={abrirNovoOrdemCompra}
          />
        </div>
      </header>

      <CorpoPagina>
        <GradePadrao
          modo="layout"
          totalColunasLayout={TOTAL_COLUNAS_GRID_ORDENS_COMPRA}
          cabecalho={<CabecalhoGradeOrdensCompra colunas={colunasVisiveisOrdensCompra} />}
          carregando={carregando}
          mensagemErro={mensagemErro}
          temItens={ordensCompra.length > 0}
          mensagemCarregando="Carregando ordens de compra..."
          mensagemVazia="Nenhum ordem de compra encontrado."
        >
          {ordensCompra.map((ordemCompra) => (
            <LinhaOrdemCompra
              key={ordemCompra.idOrdemCompra}
              ordemCompra={ordemCompra}
              colunas={colunasVisiveisOrdensCompra}
              etapasOrdemCompra={etapasOrdemCompra}
              empresa={empresa}
              fornecedores={fornecedores}
              permitirExcluir={permitirExcluir}
              permitirEdicao={!ordemCompraBloqueadoParaUsuarioPadrao(ordemCompra, usuarioLogado)}
              permitirAlteracaoEtapa={!ordemCompraBloqueadoParaUsuarioPadrao(ordemCompra, usuarioLogado)}
              aoAlterarEtapa={(idEtapaOrdemCompra) => alterarEtapaRapidamente(ordemCompra, idEtapaOrdemCompra)}
              aoConsultar={() => abrirConsultaOrdemCompra(ordemCompra)}
              aoEditar={() => abrirEdicaoOrdemCompra(ordemCompra)}
              aoExcluir={() => abrirExclusaoOrdemCompra(ordemCompra)}
            />
          ))}
        </GradePadrao>
      </CorpoPagina>

      <ModalFiltros
        aberto={modalFiltrosAberto}
        titulo="Filtros de ordens de compra"
        filtros={filtros}
        campos={[
          {
            name: 'idFornecedor',
            label: 'Fornecedor',
            options: fornecedores.map((fornecedor) => ({
              valor: String(fornecedor.idFornecedor),
              label: fornecedor.nomeFantasia || fornecedor.razaoSocial
            }))
          },
          {
            name: 'idUsuario',
            label: 'Usuario do registro',
            options: usuarios.map((usuario) => ({
              valor: String(usuario.idUsuario),
              label: usuario.nome
            }))
          },
          {
            name: 'idComprador',
            label: 'Comprador',
            multiple: true,
            placeholder: 'Todos os compradores',
            disabled: Boolean(usuarioSomenteComprador),
            options: compradores.map((comprador) => ({
              valor: String(comprador.idComprador),
              label: comprador.nome
            }))
          },
          {
            name: 'idEtapaOrdemCompra',
            label: 'Etapa',
            multiple: true,
            tituloSelecao: 'Selecionar etapas',
            options: etapasOrdemCompra.map((etapa) => ({
              valor: String(etapa.idEtapaOrdemCompra),
              label: etapa.descricao
            }))
          },
          {
            name: 'periodosDatasOrdemCompra',
            label: 'Datas',
            type: 'date-filters-modal',
            tituloSelecao: 'Filtros de datas da ordem de compra',
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
                titulo: 'Data de entrega',
                nomeInicio: 'dataEntregaInicio',
                nomeFim: 'dataEntregaFim',
                labelInicio: 'Inicio da entrega',
                labelFim: 'Fim da entrega'
              }
            ]
          }
        ]}
        aoFechar={() => definirModalFiltrosAberto(false)}
        aoAplicar={(proximosFiltros) => {
          definirFiltros(proximosFiltros);
          definirModalFiltrosAberto(false);
        }}
        aoLimpar={() => definirFiltros(criarFiltrosIniciaisOrdensCompra(usuarioLogado))}
      />

      <ModalOrdemCompra
        aberto={modalAberto}
        ordemCompra={ordemCompraSelecionado}
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
        modo={modoModal}
        idCompradorBloqueado={usuarioSomenteComprador ? usuarioLogado.idComprador : null}
        somenteConsultaPrazos={usuarioSomenteConsultaConfiguracao}
        aoIncluirFornecedor={incluirFornecedorPeloOrdemCompra}
        aoFechar={fecharModal}
        aoSalvar={salvarOrdemCompra}
        aoSalvarPrazoPagamento={salvarPrazoPagamento}
        aoInativarPrazoPagamento={inativarPrazoPagamento}
      />

      <ModalManualOrdensCompra
        aberto={modalManualAberto}
        aoFechar={() => definirModalManualAberto(false)}
        ordensCompra={ordensCompra}
        etapasOrdemCompra={etapasOrdemCompra}
        prazosPagamento={prazosPagamento}
        filtros={filtros}
        usuarioLogado={usuarioLogado}
      />
      <ModalColunasGridOrdensCompra
        aberto={modalColunasGridAberto}
        empresa={empresa}
        aoFechar={() => definirModalColunasGridAberto(false)}
        aoSalvar={salvarColunasGridOrdensCompra}
      />

      {ordemCompraExclusaoPendente ? (
        <div className="camadaConfirmacaoModal" role="presentation" onMouseDown={cancelarExclusaoOrdemCompra}>
          <div
            className="modalConfirmacaoAgenda"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="tituloConfirmacaoExclusaoOrdemCompra"
            onMouseDown={(evento) => evento.stopPropagation()}
          >
            <div className="cabecalhoConfirmacaoModal">
              <h4 id="tituloConfirmacaoExclusaoOrdemCompra">Excluir ordem de compra</h4>
            </div>

            <div className="corpoConfirmacaoModal">
              <p>Tem certeza que deseja excluir este ordem de compra?</p>
            </div>

            <div className="acoesConfirmacaoModal">
              <Botao variante="secundario" type="button" onClick={cancelarExclusaoOrdemCompra}>
                Nao
              </Botao>
              <Botao variante="perigo" type="button" onClick={confirmarExclusaoOrdemCompra}>
                Sim
              </Botao>
            </div>
          </div>
        </div>
      ) : null}

    </>
  );
}

function CabecalhoGradeOrdensCompra({ colunas }) {
  return (
    <div className="cabecalhoLayoutGradePadrao cabecalhoGradeOrdensCompra">
      {colunas.map((coluna) => (
        <div key={coluna.id} className={coluna.classe} style={obterEstiloColunaLayout(coluna)}>
          {coluna.rotulo}
        </div>
      ))}
    </div>
  );
}

function LinhaOrdemCompra({
  ordemCompra,
  colunas,
  etapasOrdemCompra,
  empresa,
  fornecedores,
  permitirExcluir,
  permitirEdicao,
  permitirAlteracaoEtapa,
  aoAlterarEtapa,
  aoConsultar,
  aoEditar,
  aoExcluir
}) {
  return (
    <div className="linhaLayoutGradePadrao linhaOrdemCompra">
      {colunas.map((coluna) => renderizarCelulaOrdemCompra({
        coluna,
        ordemCompra,
        etapasOrdemCompra,
        empresa,
        fornecedores,
        permitirExcluir,
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

function renderizarCelulaOrdemCompra({
  coluna,
  ordemCompra,
  etapasOrdemCompra,
  empresa,
  fornecedores,
  permitirExcluir,
  permitirEdicao,
  permitirAlteracaoEtapa,
  aoAlterarEtapa,
  aoConsultar,
  aoEditar,
  aoExcluir
}) {
  const propriedadesCelula = {
    key: coluna.id,
    className: `celulaLayoutGradePadrao ${coluna.classe}`.trim(),
    style: obterEstiloColunaLayout(coluna)
  };

  if (coluna.id === 'codigo' || coluna.id === 'idOrdemCompra') {
    return (
      <CelulaLayoutOrdemCompra coluna={coluna} {...propriedadesCelula}>
        <CodigoRegistro valor={ordemCompra.idOrdemCompra} />
      </CelulaLayoutOrdemCompra>
    );
  }

  if (coluna.id === 'idCotacao') {
    return (
      <CelulaLayoutOrdemCompra coluna={coluna} {...propriedadesCelula}>
        {ordemCompra.idCotacao ? <CodigoRegistro valor={ordemCompra.idCotacao} /> : '-'}
      </CelulaLayoutOrdemCompra>
    );
  }

  if (coluna.id === 'codigoCotacaoOrigem') {
    return (
      <CelulaLayoutOrdemCompra coluna={coluna} {...propriedadesCelula}>
        {ordemCompra.codigoCotacaoOrigem ? <CodigoRegistro valor={ordemCompra.codigoCotacaoOrigem} /> : '-'}
      </CelulaLayoutOrdemCompra>
    );
  }

  if (coluna.id === 'fornecedor') {
    return (
      <CelulaLayoutOrdemCompra coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(ordemCompra.nomeFornecedorSnapshot)}</TextoGradeClamp>
      </CelulaLayoutOrdemCompra>
    );
  }

  if (coluna.id === 'idFornecedor') {
    const fornecedor = (Array.isArray(fornecedores) ? fornecedores : []).find(
      (item) => String(item.idFornecedor) === String(ordemCompra.idFornecedor)
    );

    return (
      <CelulaLayoutOrdemCompra coluna={coluna} {...propriedadesCelula}>
        {ordemCompra.idFornecedor
          ? <CodigoRegistro valor={formatarCodigoFornecedor(fornecedor || { idFornecedor: ordemCompra.idFornecedor }, empresa).replace('#', '')} />
          : '-'}
      </CelulaLayoutOrdemCompra>
    );
  }

  if (coluna.id === 'idConceito') {
    const fornecedor = (Array.isArray(fornecedores) ? fornecedores : []).find(
      (item) => String(item.idFornecedor) === String(ordemCompra.idFornecedor)
    );

    return (
      <CelulaLayoutOrdemCompra coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(fornecedor?.nomeConceito)}</TextoGradeClamp>
      </CelulaLayoutOrdemCompra>
    );
  }

  if (coluna.id === 'contato') {
    return (
      <CelulaLayoutOrdemCompra coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(ordemCompra.nomeContatoSnapshot)}</TextoGradeClamp>
      </CelulaLayoutOrdemCompra>
    );
  }

  if (coluna.id === 'idContato') {
    return (
      <CelulaLayoutOrdemCompra coluna={coluna} {...propriedadesCelula}>
        {ordemCompra.idContato ? <CodigoRegistro valor={ordemCompra.idContato} /> : '-'}
      </CelulaLayoutOrdemCompra>
    );
  }

  if (coluna.id === 'usuario') {
    return (
      <CelulaLayoutOrdemCompra coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(ordemCompra.nomeUsuarioSnapshot)}</TextoGradeClamp>
      </CelulaLayoutOrdemCompra>
    );
  }

  if (coluna.id === 'idUsuario') {
    return (
      <CelulaLayoutOrdemCompra coluna={coluna} {...propriedadesCelula}>
        {ordemCompra.idUsuario ? <CodigoRegistro valor={ordemCompra.idUsuario} /> : '-'}
      </CelulaLayoutOrdemCompra>
    );
  }

  if (coluna.id === 'comprador') {
    return (
      <CelulaLayoutOrdemCompra coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(ordemCompra.nomeCompradorSnapshot)}</TextoGradeClamp>
      </CelulaLayoutOrdemCompra>
    );
  }

  if (coluna.id === 'idComprador') {
    return (
      <CelulaLayoutOrdemCompra coluna={coluna} {...propriedadesCelula}>
        {ordemCompra.idComprador ? <CodigoRegistro valor={ordemCompra.idComprador} /> : '-'}
      </CelulaLayoutOrdemCompra>
    );
  }

  if (coluna.id === 'etapa') {
    return (
      <CelulaLayoutOrdemCompra coluna={coluna} {...propriedadesCelula}>
        <div className="campoEtapaGridCotacao">
          <select
            className="selectEtapaGridCotacao"
            style={criarEstiloEtapaOrdemCompra(ordemCompra.corEtapaOrdemCompra)}
            value={ordemCompra.idEtapaOrdemCompra ? String(ordemCompra.idEtapaOrdemCompra) : ''}
            onChange={(evento) => aoAlterarEtapa(evento.target.value)}
            aria-label={`Alterar etapa da ordem de compra ${ordemCompra.idOrdemCompra}`}
            disabled={!permitirAlteracaoEtapa}
            title={!permitirAlteracaoEtapa ? 'Ordem de Compra entregue: usuario padrao consulta apenas.' : 'Alterar etapa da ordem de compra'}
          >
            <option value="">Sem etapa</option>
            {etapasOrdemCompra.map((etapa) => (
              <option key={etapa.idEtapaOrdemCompra} value={etapa.idEtapaOrdemCompra}>
                {etapa.descricao}
              </option>
            ))}
          </select>
        </div>
      </CelulaLayoutOrdemCompra>
    );
  }

  if (coluna.id === 'idEtapaOrdemCompra') {
    return (
      <CelulaLayoutOrdemCompra coluna={coluna} {...propriedadesCelula}>
        {ordemCompra.idEtapaOrdemCompra ? <CodigoRegistro valor={ordemCompra.idEtapaOrdemCompra} /> : '-'}
      </CelulaLayoutOrdemCompra>
    );
  }


  if (coluna.id === 'prazoPagamento') {
    return (
      <CelulaLayoutOrdemCompra coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(ordemCompra.nomePrazoPagamentoSnapshot)}</TextoGradeClamp>
      </CelulaLayoutOrdemCompra>
    );
  }

  if (coluna.id === 'idPrazoPagamento') {
    return (
      <CelulaLayoutOrdemCompra coluna={coluna} {...propriedadesCelula}>
        {ordemCompra.idPrazoPagamento ? <CodigoRegistro valor={ordemCompra.idPrazoPagamento} /> : '-'}
      </CelulaLayoutOrdemCompra>
    );
  }

  if (coluna.id === 'metodoPagamento') {
    return (
      <CelulaLayoutOrdemCompra coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(ordemCompra.nomeMetodoPagamentoSnapshot)}</TextoGradeClamp>
      </CelulaLayoutOrdemCompra>
    );
  }

  if (coluna.id === 'dataInclusao') {
    return (
      <CelulaLayoutOrdemCompra coluna={coluna} {...propriedadesCelula}>
        {formatarDataGridOrdemCompra(ordemCompra.dataInclusao)}
      </CelulaLayoutOrdemCompra>
    );
  }

  if (coluna.id === 'dataEntrega') {
    return (
      <CelulaLayoutOrdemCompra coluna={coluna} {...propriedadesCelula}>
        {formatarDataGridOrdemCompra(ordemCompra.dataEntrega)}
      </CelulaLayoutOrdemCompra>
    );
  }

  if (coluna.id === 'dataValidade') {
    return (
      <CelulaLayoutOrdemCompra coluna={coluna} {...propriedadesCelula}>
        {formatarDataGridOrdemCompra(ordemCompra.dataValidade)}
      </CelulaLayoutOrdemCompra>
    );
  }

  if (coluna.id === 'observacao') {
    return (
      <CelulaLayoutOrdemCompra coluna={coluna} {...propriedadesCelula}>
        <TextoGradeClamp>{obterValorGrid(ordemCompra.observacao)}</TextoGradeClamp>
      </CelulaLayoutOrdemCompra>
    );
  }

  if (coluna.id === 'total') {
    return (
      <CelulaLayoutOrdemCompra coluna={coluna} {...propriedadesCelula}>
        {normalizarPreco(ordemCompra.totalOrdemCompra)}
      </CelulaLayoutOrdemCompra>
    );
  }

  if (coluna.id === 'acoes') {
    return (
      <CelulaLayoutOrdemCompra coluna={coluna} {...propriedadesCelula}>
        <AcoesRegistro
          rotuloConsulta="Consultar ordem de compra"
          rotuloEdicao={permitirEdicao ? 'Editar ordem de compra' : 'Ordem de Compra entregue: usuario padrao consulta apenas.'}
          rotuloInativacao="Excluir ordem de compra"
          iconeInativacao="limpar"
          exibirInativacao={permitirExcluir}
          desabilitarEdicao={!permitirEdicao}
          aoConsultar={aoConsultar}
          aoEditar={aoEditar}
          aoInativar={aoExcluir}
        />
      </CelulaLayoutOrdemCompra>
    );
  }

  return null;
}

function CelulaLayoutOrdemCompra({ coluna, children, ...propriedades }) {
  return (
    <div {...propriedades}>
      <span className="rotuloCelulaLayoutGradePadrao">{coluna.rotulo}</span>
      {children}
    </div>
  );
}

function enriquecerOrdensCompra(ordensCompra, etapasOrdemCompra) {
  const etapasPorId = new Map(
    etapasOrdemCompra.map((etapa) => [etapa.idEtapaOrdemCompra, etapa])
  );

  return ordensCompra.map((ordemCompra) => ({
    ...ordemCompra,
    totalOrdemCompra: Array.isArray(ordemCompra.itens)
      ? ordemCompra.itens.reduce((total, item) => total + (Number(item.valorTotal) || 0), 0)
      : 0,
    nomeEtapaOrdemCompraSnapshot:
      ordemCompra.nomeEtapaOrdemCompraSnapshot
      || etapasPorId.get(ordemCompra.idEtapaOrdemCompra)?.descricao
      || '',
    corEtapaOrdemCompra: etapasPorId.get(ordemCompra.idEtapaOrdemCompra)?.cor || ''
  }));
}

function obterEstiloColunaLayout(coluna) {
  return {
    order: coluna.ordem,
    gridColumn: `span ${Math.max(1, Number(coluna.span || 1))}`
  };
}

function formatarDataGridOrdemCompra(valor) {
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

function ordemCompraBloqueadoParaUsuarioPadrao(ordemCompra, usuarioLogado) {
  return usuarioLogado?.tipo === 'Usuario padrao' && etapaOrdemCompraEhEntregue(ordemCompra?.idEtapaOrdemCompra);
}

function entrouNaEtapaEntregue(idEtapaAnterior, idEtapaAtual) {
  return !etapaOrdemCompraEhEntregue(idEtapaAnterior) && etapaOrdemCompraEhEntregue(idEtapaAtual);
}

function etapaOrdemCompraEhEntregue(idEtapaOrdemCompra) {
  return Number(idEtapaOrdemCompra) === ID_ETAPA_ORDEM_COMPRA_ENTREGUE;
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
    dataValidade: limparTextoOpcional(dadosOrdemCompra.dataValidade),
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

function obterDataAtualFormatoInput() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');

  return `${ano}-${mes}-${dia}`;
}

function enriquecerPrazosPagamento(prazosPagamento, metodosPagamento = []) {
  const metodosPorId = new Map(
    metodosPagamento.map((metodo) => [metodo.idMetodoPagamento, metodo.descricao])
  );

  return prazosPagamento.map((prazo) => {
    const parcelas = [prazo.prazo1, prazo.prazo2, prazo.prazo3, prazo.prazo4, prazo.prazo5, prazo.prazo6]
      .filter((valor) => valor !== null && valor !== undefined && valor !== '')
      .join(' / ');

    return {
      ...prazo,
      nomeMetodoPagamento: metodosPorId.get(prazo.idMetodoPagamento) || '',
      descricaoFormatada: prazo.descricao || (parcelas ? `${parcelas} dias` : 'Prazo sem descricao')
    };
  });
}

function enriquecerPrazoPagamento(prazo, metodosPagamento = []) {
  if (!prazo) {
    return null;
  }

  return enriquecerPrazosPagamento([prazo], metodosPagamento)[0] || null;
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

function criarEstiloEtapaOrdemCompra(cor) {
  const corBase = normalizarCorHexadecimal(cor || '#9506F4');

  return {
    background: converterHexParaRgba(corBase, 0.22),
    color: escurecerCorHexadecimal(corBase, 0.18)
  };
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


