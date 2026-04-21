import { useEffect, useMemo, useState } from 'react';
import '../recursos/estilos/paginaInicio.css';
import { CorpoPagina } from '../componentes/layout/corpoPagina';
import { listarAgendamentos } from '../servicos/agenda';
import { listarAtendimentosGrid } from '../servicos/atendimentos';
import { listarFornecedores, listarConceitosFornecedor, listarCompradores } from '../servicos/fornecedores';
import {
  listarCanaisAtendimentoConfiguracao,
  listarEtapasCotacaoConfiguracao,
  listarEtapasOrdemCompraConfiguracao,
  listarOrigensAtendimentoConfiguracao,
  listarTiposAtendimentoConfiguracao
} from '../servicos/configuracoes';
import { listarEmpresas } from '../servicos/empresa';
import { listarCotacoes } from '../servicos/cotacoes';
import { listarOrdensCompra } from '../servicos/ordensCompra';
import { listarGruposProduto, listarMarcas, listarProdutos } from '../servicos/produtos';
import { listarUsuarios } from '../servicos/usuarios';
import { formatarCodigoFornecedor } from '../utilitarios/codigoFornecedor';
import { normalizarPreco } from '../utilitarios/normalizarPreco';
import { registroEstaAtivo } from '../utilitarios/statusRegistro';
import { normalizarConfiguracoesCardsPaginaInicial } from '../dados/cardsPaginaInicial';
import { CabecalhoInicio } from '../componentes/modulos/inicio-cabecalhoInicio';
import { IndicadorConfiguravelInicio } from '../componentes/modulos/inicio-indicadorConfiguravelInicio';
import { IndicadorResumoInicio } from '../componentes/modulos/inicio-indicadorResumoInicio';
import { SecaoFunilCotacoesInicio } from '../componentes/modulos/inicio-secaoFunilCotacoesInicio';
import { SecaoCotacoesGrupoProdutosInicio } from '../componentes/modulos/inicio-secaoCotacoesGrupoProdutosInicio';
import { SecaoCotacoesMarcaInicio } from '../componentes/modulos/inicio-secaoCotacoesMarcaInicio';
import { SecaoCotacoesProdutosInicio } from '../componentes/modulos/inicio-secaoCotacoesProdutosInicio';
import { SecaoRankingInicio } from '../componentes/modulos/inicio-secaoRankingInicio';
import { SecaoOrdensCompraGrupoProdutosInicio } from '../componentes/modulos/inicio-secaoOrdensCompraGrupoProdutosInicio';
import { SecaoOrdensCompraMarcaInicio } from '../componentes/modulos/inicio-secaoOrdensCompraMarcaInicio';
import { SecaoOrdensCompraFornecedoresInicio } from '../componentes/modulos/inicio-secaoOrdensCompraFornecedoresInicio';
import { SecaoOrdensCompraConceitosFornecedorInicio } from '../componentes/modulos/inicio-secaoOrdensCompraConceitosFornecedorInicio';
import { SecaoOrdensCompraProdutosInicio } from '../componentes/modulos/inicio-secaoOrdensCompraProdutosInicio';
import { SecaoOrdensCompraUfInicio } from '../componentes/modulos/inicio-secaoOrdensCompraUfInicio';
import { SecaoAtendimentosCanalInicio } from '../componentes/modulos/inicio-secaoAtendimentosCanalInicio';
import { SecaoAtendimentosOrigemInicio } from '../componentes/modulos/inicio-secaoAtendimentosOrigemInicio';
import { SecaoAtendimentosFornecedoresInicio } from '../componentes/modulos/inicio-secaoAtendimentosFornecedoresInicio';
import { SecaoAtendimentosUsuariosInicio } from '../componentes/modulos/inicio-secaoAtendimentosUsuariosInicio';
import { SecaoAtendimentosTipoInicio } from '../componentes/modulos/inicio-secaoAtendimentosTipoInicio';
import { SecaoConfiguravelInicio } from '../componentes/modulos/inicio-secaoConfiguravelInicio';
import { ModalManualInicio } from '../componentes/modulos/inicio-modalManualInicio';
import { criarResumoFunilCotacoes } from '../utilitarios/inicio/criarResumoFunilCotacoes';

const ID_ETAPA_COTACAO_FECHADO = 1;
const IDS_ETAPAS_COTACAO_FECHADAS = new Set([1, 2, 3, 4]);
const ID_ETAPA_ORDEM_COMPRA_ENTREGUE = 5;

export function PaginaInicio({ usuarioLogado }) {
  const [carregando, definirCarregando] = useState(true);
  const [mensagemErro, definirMensagemErro] = useState('');
  const [painelBruto, definirPainelBruto] = useState(null);
  const [abaAtiva, definirAbaAtiva] = useState('cotacoes');
  const [modalManualAberto, definirModalManualAberto] = useState(false);

  useEffect(() => {
    carregarPainel();
  }, [usuarioLogado?.idUsuario, usuarioLogado?.idComprador, usuarioLogado?.tipo]);

  useEffect(() => {
    function tratarEmpresaAtualizada() {
      carregarPainel();
    }

    window.addEventListener('empresa-atualizada', tratarEmpresaAtualizada);

    return () => {
      window.removeEventListener('empresa-atualizada', tratarEmpresaAtualizada);
    };
  }, [usuarioLogado?.idUsuario, usuarioLogado?.idComprador, usuarioLogado?.tipo]);

  useEffect(() => {
    function tratarAtalhoManual(evento) {
      if (evento.key !== 'F1') {
        return;
      }

      evento.preventDefault();
      if (!modalManualAberto) {
        definirModalManualAberto(true);
      }
    }

    window.addEventListener('keydown', tratarAtalhoManual);

    return () => {
      window.removeEventListener('keydown', tratarAtalhoManual);
    };
  }, [modalManualAberto]);

  const painel = useMemo(
    () => montarPainel(painelBruto, usuarioLogado),
    [painelBruto, usuarioLogado]
  );
  const secoesCotacoesConfiguradas = useMemo(
    () => montarSecoesCotacoes(painel),
    [painel]
  );
  const indicadoresConfigurados = useMemo(
    () => montarIndicadoresConfigurados(painel),
    [painel]
  );
  const secoesOrdensCompraConfiguradas = useMemo(
    () => montarSecoesOrdensCompra(painel),
    [painel]
  );
  const secoesAtendimentosConfiguradas = useMemo(
    () => montarSecoesAtendimentos(painel),
    [painel]
  );

  async function carregarPainel() {
    definirCarregando(true);
    definirMensagemErro('');

    try {
      const recorteUsuarioPadrao = usuarioLogado?.tipo === 'Usuario padrao' && usuarioLogado?.idComprador
        ? {
          escopoIdComprador: usuarioLogado.idComprador,
          escopoIdUsuario: usuarioLogado.idUsuario
        }
        : {};
      const hoje = new Date();
      const dataInicioAgenda = dataInput(hoje);
      const dataFimAgenda = dataInput(new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 7));
      const resultados = await Promise.allSettled([
        listarFornecedores(),
        listarConceitosFornecedor({ incluirInativos: true }),
        listarCompradores(),
        listarAtendimentosGrid({
          filtros: recorteUsuarioPadrao
        }),
        listarAgendamentos({
          dataInicio: dataInicioAgenda,
          dataFim: dataFimAgenda,
          ...recorteUsuarioPadrao
        }),
        listarCotacoes(recorteUsuarioPadrao),
        listarOrdensCompra(recorteUsuarioPadrao),
        listarProdutos(),
        listarGruposProduto(),
        listarMarcas(),
        listarEtapasCotacaoConfiguracao(),
        listarEtapasOrdemCompraConfiguracao(),
        listarCanaisAtendimentoConfiguracao(),
        listarOrigensAtendimentoConfiguracao(),
        listarTiposAtendimentoConfiguracao(),
        listarUsuarios({ incluirInativos: true }),
        listarEmpresas()
      ]);

      const [
        fornecedoresResultado,
        conceitosFornecedorResultado,
        compradoresResultado,
        atendimentosResultado,
        agendamentosResultado,
        cotacoesResultado,
        ordensCompraResultado,
        produtosResultado,
        gruposProdutoResultado,
        marcasResultado,
        etapasCotacaoResultado,
        etapasOrdemCompraResultado,
        canaisAtendimentoResultado,
        origensAtendimentoResultado,
        tiposAtendimentoResultado,
        usuariosResultado,
        empresasResultado
      ] = resultados;

      const fornecedores = fornecedoresResultado.status === 'fulfilled' ? fornecedoresResultado.value : [];
      const conceitosFornecedor = conceitosFornecedorResultado.status === 'fulfilled' ? conceitosFornecedorResultado.value : [];
      const compradores = compradoresResultado.status === 'fulfilled' ? compradoresResultado.value : [];
      const atendimentos = atendimentosResultado.status === 'fulfilled' ? atendimentosResultado.value : [];
      const agendamentos = agendamentosResultado.status === 'fulfilled' ? agendamentosResultado.value : [];
      const cotacoes = cotacoesResultado.status === 'fulfilled' ? cotacoesResultado.value : [];
      const ordensCompra = ordensCompraResultado.status === 'fulfilled' ? ordensCompraResultado.value : [];
      const produtos = produtosResultado.status === 'fulfilled' ? produtosResultado.value : [];
      const gruposProduto = gruposProdutoResultado.status === 'fulfilled' ? gruposProdutoResultado.value : [];
      const marcas = marcasResultado.status === 'fulfilled' ? marcasResultado.value : [];
      const etapasCotacao = etapasCotacaoResultado.status === 'fulfilled' ? etapasCotacaoResultado.value : [];
      const etapasOrdemCompra = etapasOrdemCompraResultado.status === 'fulfilled' ? etapasOrdemCompraResultado.value : [];
      const canaisAtendimento = canaisAtendimentoResultado.status === 'fulfilled' ? canaisAtendimentoResultado.value : [];
      const origensAtendimento = origensAtendimentoResultado.status === 'fulfilled' ? origensAtendimentoResultado.value : [];
      const tiposAtendimento = tiposAtendimentoResultado.status === 'fulfilled' ? tiposAtendimentoResultado.value : [];
      const usuarios = usuariosResultado.status === 'fulfilled' ? usuariosResultado.value : [];
      const empresas = empresasResultado.status === 'fulfilled' ? empresasResultado.value : [];

      definirPainelBruto({
        fornecedores,
        conceitosFornecedor,
        compradores,
        atendimentos,
        agendamentos,
        cotacoes,
        ordensCompra,
        produtos,
        gruposProduto,
        marcas,
        etapasCotacao,
        etapasOrdemCompra,
        canaisAtendimento,
        origensAtendimento,
        tiposAtendimento,
        usuarios,
        empresa: empresas[0] || null
      });
    } catch (_erro) {
      definirMensagemErro('Nao foi possivel carregar a dashboard inicial.');
    } finally {
      definirCarregando(false);
    }
  }

  return (
    <>
      <CabecalhoInicio
        descricao={painel.descricao}
        resumo={painel.resumo}
        abas={[
          { id: 'cotacoes', rotulo: 'Cotacoes' },
          { id: 'ordensCompra', rotulo: 'Ordens de compra' },
          { id: 'atendimentos', rotulo: 'Atendimentos' }
        ]}
        abaAtiva={abaAtiva}
        aoSelecionarAba={definirAbaAtiva}
      />

      <CorpoPagina>
        {mensagemErro ? (
          <section className="paginaInicioPainel">
            <div className="paginaInicioPainelCabecalho">
              <div>
                <h3>Painel indisponivel</h3>
                <p>{mensagemErro}</p>
              </div>
            </div>
          </section>
        ) : (
          <div className="paginaInicioLayout">
            <div className="paginaInicioGradeIndicadores">
              {indicadoresConfigurados.map((indicador) => (
                <IndicadorConfiguravelInicio key={indicador.id} colunas={indicador.span}>
                  <IndicadorResumoInicio
                    ariaLabel={indicador.titulo}
                    carregando={carregando}
                    {...indicador}
                  />
                </IndicadorConfiguravelInicio>
              ))}
            </div>

            <div className="paginaInicioSecoes">
              {abaAtiva === 'cotacoes' ? (
                secoesCotacoesConfiguradas.map((secao) => (
                  <SecaoConfiguravelInicio key={secao.id} colunas={secao.span}>
                    {secao.renderizar()}
                  </SecaoConfiguravelInicio>
                ))
              ) : abaAtiva === 'ordensCompra' ? (
                secoesOrdensCompraConfiguradas.map((secao) => (
                  <SecaoConfiguravelInicio key={secao.id} colunas={secao.span}>
                    {secao.renderizar()}
                  </SecaoConfiguravelInicio>
                ))
              ) : (
                secoesAtendimentosConfiguradas.map((secao) => (
                  <SecaoConfiguravelInicio key={secao.id} colunas={secao.span}>
                    {secao.renderizar()}
                  </SecaoConfiguravelInicio>
                ))
              )}

            </div>
          </div>
        )}
      </CorpoPagina>

      <ModalManualInicio
        aberto={modalManualAberto}
        aoFechar={() => definirModalManualAberto(false)}
        usuarioLogado={usuarioLogado}
      />
    </>
  );
}

function montarPainel(dados, usuarioLogado) {
  const base = criarPainelBase(usuarioLogado);

  if (!dados) {
    return base;
  }

  const fornecedoresVisiveis = filtrarFornecedoresVisiveis(dados.fornecedores, usuarioLogado);
  const idsFornecedores = new Set(fornecedoresVisiveis.map((fornecedor) => String(fornecedor.idFornecedor)));
  const fornecedoresPorId = new Map(fornecedoresVisiveis.map((fornecedor) => [
    String(fornecedor.idFornecedor),
    fornecedor.nomeFantasia || fornecedor.razaoSocial || '-'
  ]));
  const compradoresPorId = new Map((dados.compradores || []).map((comprador) => [String(comprador.idComprador), comprador.nome]));
  const fornecedoresAtivos = fornecedoresVisiveis.filter((item) => registroEstaAtivo(item.status));
  const produtosAtivos = (dados.produtos || []).filter((item) => registroEstaAtivo(item.status));
  const cotacoes = filtrarCotacoesVisiveis(dados.cotacoes, idsFornecedores, usuarioLogado);
  const ordensCompra = filtrarOrdensCompraVisiveis(dados.ordensCompra, idsFornecedores, usuarioLogado);
  const atendimentos = filtrarAtendimentosVisiveis(dados.atendimentos, idsFornecedores, usuarioLogado);
  const agendamentos = filtrarAgendamentosVisiveis(dados.agendamentos, idsFornecedores, usuarioLogado);
  const inicioMes = dataInput(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const fimMes = dataInput(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0));
  const hoje = dataInput(new Date());
  const cotacoesAbertos = cotacoes.filter((item) => !cotacaoEhFechado(item));
  const cotacoesMes = cotacoes.filter((item) => dataNoPeriodo(item.dataInclusao, inicioMes, fimMes));
  const cotacoesFechadosMes = cotacoes.filter((item) => (
    Number(item.idEtapaCotacao) === ID_ETAPA_COTACAO_FECHADO
    && dataNoPeriodo(item.dataFechamento, inicioMes, fimMes)
  ));
  const cotacoesFechadosMesConversao = usuarioLogado?.tipo === 'Usuario padrao'
    ? cotacoesFechadosMes.filter((item) => String(item.idUsuario) === String(usuarioLogado?.idUsuario || ''))
    : cotacoesFechadosMes;
  const ordensCompraMes = ordensCompra.filter((item) => dataNoPeriodo(item.dataInclusao, inicioMes, fimMes));
  const positivacaoMes = new Set(
    ordensCompraMes
      .map((item) => Number(item?.idFornecedor))
      .filter((idFornecedor) => Number.isFinite(idFornecedor) && idFornecedor > 0)
  ).size;
  const idsFornecedoresAtivos = new Set(
    fornecedoresAtivos
      .map((fornecedor) => Number(fornecedor?.idFornecedor))
      .filter((idFornecedor) => Number.isFinite(idFornecedor) && idFornecedor > 0)
  );
  const positivacaoCarteiraMes = new Set(
    ordensCompraMes
      .map((item) => Number(item?.idFornecedor))
      .filter((idFornecedor) => idsFornecedoresAtivos.has(idFornecedor))
  ).size;
  const percentualPositivacaoCarteiraMes = fornecedoresAtivos.length > 0
    ? (positivacaoCarteiraMes / fornecedoresAtivos.length) * 100
    : 0;
  const ordensCompraEntregaMes = ordensCompra.filter((item) => dataNoPeriodo(item.dataEntrega, inicioMes, fimMes));
  const atendimentosMes = atendimentos.filter((item) => dataNoPeriodo(item.data, inicioMes, fimMes));
  // A home de atendimentos precisa usar a mesma base para cards e graficos e evitar leituras diferentes por perfil.
  const atendimentosMesHome = usuarioLogado?.tipo === 'Usuario padrao'
    ? atendimentosMes.filter((item) => String(item.idUsuario) === String(usuarioLogado?.idUsuario || ''))
    : atendimentosMes;
  // O card de prospeccao depende do cadastro dinamico de tipos, entao buscamos o ID pelo texto normalizado.
  const idTipoAtendimentoProspeccao = encontrarIdTipoAtendimentoProspeccao(dados.tiposAtendimento);
  const atendimentosProspeccaoMes = atendimentosMesHome.filter((item) => (
    idTipoAtendimentoProspeccao != null
    && Number(item.idTipoAtendimento) === Number(idTipoAtendimentoProspeccao)
  ));
  const valorAberto = somarTotais(cotacoesAbertos);
  const faturamentoMes = somarTotais(ordensCompraEntregaMes);
  const mediaDiasConversaoMes = calcularMediaDiasConversao(cotacoesFechadosMesConversao);
  const quantidadeVendidaMesBruta = somarQuantidadeItensBruta(ordensCompraMes);
  const ticketMedio = ordensCompraEntregaMes.length ? faturamentoMes / ordensCompraEntregaMes.length : 0;
  const convertidosMes = cotacoesMes.filter((item) => Boolean(item.idOrdemCompraVinculado)).length;
  const taxaConversaoMes = cotacoesMes.length ? (convertidosMes / cotacoesMes.length) * 100 : 0;
  const cotacoesVencidos = cotacoesAbertos.filter((item) => dataAnterior(item.dataValidade, hoje)).length;
  const cotacoesVencendo = cotacoesAbertos.filter((item) => dataNosProximosDias(item.dataValidade, 7)).length;
  const ordensCompraEntregaProxima = ordensCompra.filter((item) => ordemCompraPendente(item) && dataNosProximosDias(item.dataEntrega, 7)).length;
  const fornecedoresSemAtendimento = contarFornecedoresSemAtendimento(fornecedoresVisiveis, atendimentos, 30);
  const agenda = agendamentos
    .filter((item) => criarDataHoraAgendamento(item))
    .filter((item) => dataNosProximosDias(criarDataHoraAgendamento(item), 7))
    .sort((a, b) => criarDataHoraAgendamento(a) - criarDataHoraAgendamento(b))
    .slice(0, 5)
    .map((item) => ({
      id: item.idAgendamento,
      assunto: item.assunto || 'Compromisso agendado',
      dataHora: formatarAgendamento(item),
      detalhe: fornecedoresPorId.get(String(item.idFornecedor)) || 'Sem fornecedor vinculado',
      ajuda: {
        conceito: 'Compromisso futuro dentro do recorte visivel da agenda.',
        calculo: 'Entram apenas registros agendados entre hoje e os proximos 7 dias.',
        observacao: 'Para usuario padrao, o recorte considera o proprio usuario e sua carteira.'
      }
    }));
  const funil = montarFunil(criarResumoFunilCotacoes(dados.etapasCotacao, cotacoesAbertos));
  const cotacoesPorGrupo = montarResumoPorRelacionamento(
    cotacoesAbertos,
    dados.produtos,
    dados.gruposProduto,
    'idGrupo',
    'idGrupo',
    'descricao',
    'Sem grupo',
    {
      chaveRegistroId: 'idCotacao',
      sufixoQuantidadeRegistros: 'orc.'
    }
  );
  const cotacoesPorMarca = montarResumoPorRelacionamento(
    cotacoesAbertos,
    dados.produtos,
    dados.marcas,
    'idMarca',
    'idMarca',
    'descricao',
    'Sem marca',
    {
      chaveRegistroId: 'idCotacao',
      sufixoQuantidadeRegistros: 'orc.'
    }
  );
  const cotacoesPorProduto = montarResumoPorRelacionamento(
    cotacoesAbertos,
    dados.produtos,
    dados.produtos,
    'idProduto',
    'idProduto',
    'descricao',
    'Sem produto',
    {
      chaveRegistroId: 'idCotacao',
      sufixoQuantidadeRegistros: 'orc.'
    }
  );
  const ordensCompraPorGrupo = montarResumoPorRelacionamento(
    ordensCompraMes,
    dados.produtos,
    dados.gruposProduto,
    'idGrupo',
    'idGrupo',
    'descricao',
    'Sem grupo'
  );
  const ordensCompraPorMarca = montarResumoPorRelacionamento(
    ordensCompraMes,
    dados.produtos,
    dados.marcas,
    'idMarca',
    'idMarca',
    'descricao',
    'Sem marca'
  );
  const ordensCompraPorProduto = montarResumoPorRelacionamento(
    ordensCompraMes,
    dados.produtos,
    dados.produtos,
    'idProduto',
    'idProduto',
    'descricao',
    'Sem produto'
  );
  const ordensCompraPorUf = montarResumoPorUf(ordensCompraMes, fornecedoresVisiveis);
  const ordensCompraPorFornecedor = montarResumoPorFornecedor(ordensCompraMes, fornecedoresVisiveis, dados.empresa);
  const ordensCompraPorConceitoFornecedor = montarResumoPorConceitoFornecedor(
    ordensCompraMes,
    fornecedoresVisiveis,
    dados.conceitosFornecedor
  );
  const atendimentosPorCanal = montarResumoAtendimentosPorRelacionamento(
    atendimentosMesHome,
    dados.canaisAtendimento,
    'idCanalAtendimento',
    'idCanalAtendimento',
    'descricao',
    'Sem canal'
  );
  const atendimentosPorOrigem = montarResumoAtendimentosPorRelacionamento(
    atendimentosMesHome,
    dados.origensAtendimento,
    'idOrigemAtendimento',
    'idOrigemAtendimento',
    'descricao',
    'Sem origem'
  );
  const atendimentosPorFornecedor = montarResumoAtendimentosPorFornecedor(
    atendimentosMesHome,
    fornecedoresVisiveis,
    dados.empresa
  );
  const atendimentosPorTipo = montarResumoAtendimentosPorRelacionamento(
    atendimentosMesHome,
    dados.tiposAtendimento,
    'idTipoAtendimento',
    'idTipoAtendimento',
    'descricao',
    'Sem tipo'
  );
  const atendimentosPorUsuario = montarResumoAtendimentosPorUsuario(
    atendimentosMesHome,
    dados.usuarios
  );

  return {
    ...base,
    empresa: dados.empresa || null,
    resumo: usuarioLogado?.tipo === 'Usuario padrao'
      ? `${fornecedoresVisiveis.length} fornecedores na sua carteira`
      : `${fornecedoresVisiveis.length} fornecedores no acompanhamento`,
    indicadores: [
      {
        id: 'cotacoesAbertos',
        icone: 'cotacao',
        titulo: 'Cotacoes em aberto',
        valor: String(cotacoesAbertos.length),
        descricao: 'Negociacoes ainda ativas no funil.',
        destaque: normalizarPreco(valorAberto),
        ajuda: {
          composicao: 'Quantidade de cotacoes em aberto e valor total desses cotacoes.',
          periodo: 'Posicao atual da carteira visivel na data de hoje.'
        }
      },
      {
        id: 'ordensCompraMes',
        icone: 'ordemCompra',
        titulo: 'Ordens de Compra no mes',
        valor: String(ordensCompraMes.length),
        descricao: 'Ordens de Compra gerados no mes atual.',
        destaque: normalizarPreco(faturamentoMes),
        ajuda: {
          composicao: 'Quantidade de ordens de compra e valor liquido dos itens.',
          periodo: 'Mes corrente pela data de inclusao do ordemCompra.'
        }
      },
      {
        id: 'mediaDiasConversaoMes',
        icone: 'agenda',
        titulo: 'Media de dias para conversao',
        valor: formatarNumeroInteiro(mediaDiasConversaoMes),
        valorComplemento: 'dias',
        descricao: 'Tempo medio para fechar no mes atual.',
        ajuda: {
          composicao: `${cotacoesFechadosMesConversao.length} cotacoes na etapa Fechado, medindo da inclusao ate o fechamento.`,
          periodo: 'Mes corrente pela data de fechamento da cotacao.'
        }
      },
      {
        id: 'atendimentosMes',
        icone: 'atendimentos',
        titulo: 'Atendimentos no mes',
        valor: String(atendimentosMesHome.length),
        descricao: 'Quantidade total de atendimentos no mes atual.',
        ajuda: {
          composicao: 'Soma de todos os atendimentos registrados no mes corrente.',
          periodo: 'Mes corrente pela data do atendimento.'
        }
      },
      {
        id: 'atendimentosProspeccaoMes',
        icone: 'atendimentos',
        titulo: 'Prospeccao no mes',
        valor: String(atendimentosProspeccaoMes.length),
        descricao: 'Atendimentos de prospeccao registrados no mes atual.',
        ajuda: {
          composicao: idTipoAtendimentoProspeccao == null
            ? 'Conta atendimentos do tipo Prospeccao quando esse tipo estiver cadastrado.'
            : 'Soma dos atendimentos do tipo Prospeccao registrados no mes corrente.',
          periodo: 'Mes corrente pela data do atendimento.'
        }
      },
      {
        id: 'quantidadeVendidaMes',
        icone: 'caixa',
        titulo: 'Quantidade vendida no mes',
        valor: String(quantidadeVendidaMesBruta),
        descricao: 'Quantidade bruta de itens vendidos no mes atual.',
        ajuda: {
          composicao: 'Soma da quantidade de itens das ordens de compra do mes corrente.',
          periodo: 'Mes corrente pela data de inclusao do ordemCompra.'
        }
      },
      {
        id: 'positivacaoMes',
        icone: 'fornecedores',
        titulo: 'Positivacao no mes',
        valor: String(positivacaoMes),
        descricao: 'Fornecedores unicos que geraram ordem de compra no mes.',
        ajuda: {
          composicao: 'Quantidade de fornecedores diferentes com pelo menos um ordemCompra.',
          periodo: 'Mes corrente pela data de inclusao do ordemCompra.'
        }
      },
      {
        id: 'percentualPositivacaoCarteiraMes',
        icone: 'selo',
        titulo: '% Positivacao da carteira',
        valor: formatarPercentualTaxa(percentualPositivacaoCarteiraMes),
        descricao: 'Percentual da carteira ativa que comprou no mes.',
        ajuda: {
          composicao: `${positivacaoCarteiraMes} fornecedores que compraram / ${fornecedoresAtivos.length} fornecedores ativos da carteira.`,
          periodo: 'Mes corrente pela data de inclusao do ordemCompra.'
        }
      },
      {
        id: 'catalogo',
        icone: 'atendimentos',
        titulo: 'Catalogo',
        valor: String(produtosAtivos.length),
        descricao: 'Produtos ativos para comercializacao.',
        destaque: `${dados.gruposProduto?.length || 0} grupos cadastrados`,
        ajuda: {
          composicao: 'Quantidade de produtos ativos.',
          periodo: 'Base cadastral atual (sem recorte mensal).'
        }
      },
      {
        id: 'carteira',
        icone: 'selo',
        titulo: 'Carteira',
        valor: String(fornecedoresAtivos.length),
        descricao: 'Fornecedores ativos em acompanhamento.',
        destaque: `${fornecedoresVisiveis.length} visiveis`,
        ajuda: {
          composicao: 'Quantidade de fornecedores ativos no escopo visivel.',
          periodo: 'Base cadastral atual (sem recorte mensal).'
        }
      }
    ],
    metricas: [
      {
        rotulo: 'Valor em negociacao',
        valor: normalizarPreco(valorAberto),
        ajuda: {
          conceito: 'Volume financeiro estimado das oportunidades em aberto.',
          calculo: 'Soma dos valores totais dos itens das cotacoes abertos.',
          observacao: 'Nao representa ordemCompra fechada; mostra potencial em negociacao.'
        }
      },
      {
        rotulo: 'Faturamento do mes',
        valor: normalizarPreco(faturamentoMes),
        ajuda: {
          conceito: 'Valor movimentado pelos ordensCompra com entrega prevista no mes atual.',
          calculo: 'Soma dos itens de todos as ordens de compra visiveis cuja data de entrega cai dentro do mes atual.',
          observacao: 'Leitura rapida da receita prevista para entrega no mes atual.'
        }
      },
      {
        rotulo: 'Ticket medio',
        valor: normalizarPreco(ticketMedio),
        ajuda: {
          conceito: 'Valor medio por ordemCompra com entrega prevista no mes atual.',
          calculo: `${normalizarPreco(faturamentoMes)} dividido por ${ordensCompraEntregaMes.length || 0} ordens de compra com data de entrega no mes atual.`,
          observacao: 'Ajuda a entender se o resultado do mes atual vem de volume ou de valor medio.'
        }
      }
    ],
    faixas: [
      {
        rotulo: 'Fornecedores acompanhados',
        valor: String(fornecedoresVisiveis.length),
        ajuda: {
          conceito: 'Base de fornecedores usada na dashboard.',
          calculo: usuarioLogado?.tipo === 'Usuario padrao'
            ? 'Fornecedores da carteira do comprador do usuario logado.'
            : 'Todos os fornecedores visiveis na operacao.',
          observacao: 'Esse total define o universo de acompanhamento da home.'
        }
      },
      {
        rotulo: 'Ordens de Compra a entregar',
        valor: String(ordensCompraEntregaProxima),
        ajuda: {
          conceito: 'OrdensCompra ainda nao entregues com entrega prevista em ate 7 dias.',
          calculo: 'Conta ordens de compra pendentes cuja data de entrega cai entre hoje e os proximos 7 dias.',
          observacao: 'Bom indicador para alinhamento comercial e operacional.'
        }
      },
      {
        rotulo: 'Cotacoes vencidos',
        valor: String(cotacoesVencidos),
        ajuda: {
          conceito: 'Cotacoes abertos com validade anterior a hoje.',
          calculo: 'Conta negociacoes abertas cuja data de validade ja expirou.',
          observacao: 'Normalmente pedem renovacao, retorno ou encerramento.'
        }
      },
      {
        rotulo: 'Sem atendimento recente',
        valor: String(fornecedoresSemAtendimento),
        ajuda: {
          conceito: 'Fornecedores sem atendimento registrado nos ultimos 30 dias.',
          calculo: 'Compara a ultima data de atendimento de cada fornecedor com a data atual.',
          observacao: 'Ajuda a priorizar reativacao da carteira.'
        }
      }
    ],
    exibirFunil: dados.empresa?.exibirFunilPaginaInicial !== 0,
    funil,
    cotacoesPorGrupo,
    cotacoesPorMarca,
    cotacoesPorProduto,
    ordensCompraPorGrupo,
    ordensCompraPorMarca,
    ordensCompraPorUf,
    ordensCompraPorFornecedor,
    ordensCompraPorConceitoFornecedor,
    ordensCompraPorProduto,
    atendimentosPorCanal,
    atendimentosPorOrigem,
    atendimentosPorFornecedor,
    atendimentosPorTipo,
    atendimentosPorUsuario,
    alertas: montarAlertas(cotacoesVencidos, cotacoesVencendo, ordensCompraEntregaProxima, fornecedoresSemAtendimento),
    tituloRanking: usuarioLogado?.tipo === 'Usuario padrao' ? 'Fornecedores em destaque' : 'Compradores em destaque',
    descricaoRanking: usuarioLogado?.tipo === 'Usuario padrao'
      ? 'Quem mais comprou no mes pela data de entrada da ordem de compra dentro da sua carteira.'
      : 'Quem mais movimentou ordens de compra pela data de entrada no mes atual.',
    ranking: usuarioLogado?.tipo === 'Usuario padrao'
      ? montarRankingFornecedores(ordensCompraMes, fornecedoresPorId)
      : montarRankingCompradores(ordensCompraMes, compradoresPorId),
    agenda
  };
}

function montarSecoesCotacoes(painel) {
  const configuracoes = Array.isArray(painel?.empresa?.graficosPaginaInicialCotacoes)
    ? painel.empresa.graficosPaginaInicialCotacoes
    : [];
  const definicoes = new Map([
    ['funilCotacoes', {
      renderizar: (configuracao) => <SecaoFunilCotacoesInicio itens={painel.funil} titulo={configuracao.rotulo} />
    }],
    ['cotacoesGrupoProdutos', {
      renderizar: (configuracao) => <SecaoCotacoesGrupoProdutosInicio itens={painel.cotacoesPorGrupo} titulo={configuracao.rotulo} />
    }],
    ['cotacoesMarca', {
      renderizar: (configuracao) => <SecaoCotacoesMarcaInicio itens={painel.cotacoesPorMarca} titulo={configuracao.rotulo} />
    }],
    ['cotacoesProdutos', {
      renderizar: (configuracao) => <SecaoCotacoesProdutosInicio itens={painel.cotacoesPorProduto} titulo={configuracao.rotulo} />
    }]
  ]);

  return configuracoes
    .filter((item) => item?.visivel !== false)
    .sort((itemA, itemB) => Number(itemA?.ordem || 0) - Number(itemB?.ordem || 0))
    .map((item) => ({
      id: item.id,
      span: item.span,
      renderizar: () => definicoes.get(item.id)?.renderizar(item)
    }))
    .filter((item) => typeof item.renderizar === 'function');
}

function montarIndicadoresConfigurados(painel) {
  const configuracoes = Array.isArray(painel?.empresa?.cardsPaginaInicial)
    ? painel.empresa.cardsPaginaInicial
    : normalizarConfiguracoesCardsPaginaInicial();
  const indicadoresPorId = new Map(
    (painel?.indicadores || []).map((indicador) => [indicador.id, indicador])
  );

  return configuracoes
    .filter((item) => item?.visivel !== false)
    .map((item) => {
      const indicador = indicadoresPorId.get(item.id);

      if (!indicador) {
        return null;
      }

      return {
        ...indicador,
        titulo: item.rotulo || indicador.titulo,
        span: item.span || 2
      };
    })
    .filter(Boolean);
}

function montarSecoesOrdensCompra(painel) {
  const configuracoes = Array.isArray(painel?.empresa?.graficosPaginaInicialOrdensCompra)
    ? painel.empresa.graficosPaginaInicialOrdensCompra
    : [];
  const definicoes = new Map([
    ['ordensCompraGrupoProdutos', {
      renderizar: (configuracao) => <SecaoOrdensCompraGrupoProdutosInicio itens={painel.ordensCompraPorGrupo} titulo={configuracao.rotulo} />
    }],
    ['ordensCompraMarca', {
      renderizar: (configuracao) => <SecaoOrdensCompraMarcaInicio itens={painel.ordensCompraPorMarca} titulo={configuracao.rotulo} />
    }],
    ['ordensCompraUf', {
      renderizar: (configuracao) => <SecaoOrdensCompraUfInicio itens={painel.ordensCompraPorUf} titulo={configuracao.rotulo} />
    }],
    ['ordensCompraFornecedores', {
      renderizar: (configuracao) => <SecaoOrdensCompraFornecedoresInicio itens={painel.ordensCompraPorFornecedor} titulo={configuracao.rotulo} />
    }],
    ['ordensCompraConceitosFornecedor', {
      renderizar: (configuracao) => <SecaoOrdensCompraConceitosFornecedorInicio itens={painel.ordensCompraPorConceitoFornecedor} titulo={configuracao.rotulo} />
    }],
    ['ordensCompraProdutos', {
      renderizar: (configuracao) => <SecaoOrdensCompraProdutosInicio itens={painel.ordensCompraPorProduto} titulo={configuracao.rotulo} />
    }],
    ['rankingOrdensCompra', {
      renderizar: (configuracao) => (
        <SecaoRankingInicio
          titulo={configuracao.rotulo}
          descricao={painel.descricaoRanking}
          itens={painel.ranking}
        />
      )
    }]
  ]);

  return configuracoes
    .filter((item) => item?.visivel !== false)
    .sort((itemA, itemB) => Number(itemA?.ordem || 0) - Number(itemB?.ordem || 0))
    .map((item) => ({
      id: item.id,
      span: item.span,
      renderizar: () => definicoes.get(item.id)?.renderizar(item)
    }))
    .filter((item) => typeof item.renderizar === 'function');
}

function montarSecoesAtendimentos(painel) {
  const configuracoes = Array.isArray(painel?.empresa?.graficosPaginaInicialAtendimentos)
    ? painel.empresa.graficosPaginaInicialAtendimentos
    : [];
  const definicoes = new Map([
    ['atendimentosCanal', {
      renderizar: (configuracao) => <SecaoAtendimentosCanalInicio itens={painel.atendimentosPorCanal} titulo={configuracao.rotulo} />
    }],
    ['atendimentosOrigem', {
      renderizar: (configuracao) => <SecaoAtendimentosOrigemInicio itens={painel.atendimentosPorOrigem} titulo={configuracao.rotulo} />
    }],
    ['atendimentosFornecedor', {
      renderizar: (configuracao) => <SecaoAtendimentosFornecedoresInicio itens={painel.atendimentosPorFornecedor} titulo={configuracao.rotulo} />
    }],
    ['atendimentosTipo', {
      renderizar: (configuracao) => <SecaoAtendimentosTipoInicio itens={painel.atendimentosPorTipo} titulo={configuracao.rotulo} />
    }],
    ['atendimentosUsuario', {
      renderizar: (configuracao) => <SecaoAtendimentosUsuariosInicio itens={painel.atendimentosPorUsuario} titulo={configuracao.rotulo} />
    }]
  ]);

  return configuracoes
    .filter((item) => item?.visivel !== false)
    .sort((itemA, itemB) => Number(itemA?.ordem || 0) - Number(itemB?.ordem || 0))
    .map((item) => ({
      id: item.id,
      span: item.span,
      renderizar: () => definicoes.get(item.id)?.renderizar(item)
    }))
    .filter((item) => typeof item.renderizar === 'function');
}

function criarPainelBase(usuarioLogado) {
  return {
    descricao: usuarioLogado?.tipo === 'Usuario padrao'
      ? 'Acompanhe somente sua carteira, seus cotacoes e suas ordens de compra.'
      : 'Acompanhe o desempenho comercial de cotacoes e ordens de compra da operacao.',
    resumo: '',
    tag: usuarioLogado?.tipo === 'Usuario padrao' ? 'Minha carteira' : 'Visao geral',
    titulo: usuarioLogado?.tipo === 'Usuario padrao'
      ? 'Painel comercial da sua carteira'
      : 'Dashboard comercial de cotacoes e ordens de compra',
    subtitulo: usuarioLogado?.tipo === 'Usuario padrao'
      ? 'Os dados exibidos aqui consideram somente seus fornecedores e seus registros.'
      : 'Leitura consolidada do funil, das ordens de compra e das proximas acoes comerciais.',
    indicadores: [
      {
        id: 'cotacoesAbertos',
        icone: 'cotacao',
        titulo: 'Cotacoes em aberto',
        valor: '0',
        descricao: '',
        ajuda: {
          composicao: 'Quantidade e valor das cotacoes em aberto.',
          periodo: 'Carteira visivel atual na data de hoje.'
        }
      },
      {
        id: 'ordensCompraMes',
        icone: 'ordemCompra',
        titulo: 'Ordens de Compra no mes',
        valor: '0',
        descricao: '',
        ajuda: {
          composicao: 'Quantidade de ordens de compra e valor liquido dos itens.',
          periodo: 'Mes corrente pela data de inclusao do ordemCompra.'
        }
      },
      {
        id: 'mediaDiasConversaoMes',
        icone: 'agenda',
        titulo: 'Media de dias para conversao',
        valor: formatarNumeroInteiro(0),
        valorComplemento: 'dias',
        descricao: '',
        ajuda: {
          composicao: 'Media entre a data de inclusao e a data de fechamento das cotacoes na etapa Fechado.',
          periodo: 'Mes corrente pela data de fechamento da cotacao.'
        }
      },
      {
        id: 'atendimentosMes',
        icone: 'atendimentos',
        titulo: 'Atendimentos no mes',
        valor: '0',
        descricao: '',
        ajuda: {
          composicao: 'Soma de todos os atendimentos registrados no mes corrente.',
          periodo: 'Mes corrente pela data do atendimento.'
        }
      },
      {
        id: 'atendimentosProspeccaoMes',
        icone: 'atendimentos',
        titulo: 'Prospeccao no mes',
        valor: '0',
        descricao: '',
        ajuda: {
          composicao: 'Soma dos atendimentos classificados com o tipo Prospeccao.',
          periodo: 'Mes corrente pela data do atendimento.'
        }
      },
      {
        id: 'quantidadeVendidaMes',
        icone: 'caixa',
        titulo: 'Quantidade vendida no mes',
        valor: '0',
        descricao: '',
        ajuda: {
          composicao: 'Soma da quantidade de itens das ordens de compra do mes corrente.',
          periodo: 'Mes corrente pela data de inclusao do ordemCompra.'
        }
      },
      {
        id: 'positivacaoMes',
        icone: 'fornecedores',
        titulo: 'Positivacao no mes',
        valor: '0',
        descricao: '',
        ajuda: {
          composicao: 'Quantidade de fornecedores diferentes com pelo menos um ordemCompra.',
          periodo: 'Mes corrente pela data de inclusao do ordemCompra.'
        }
      },
      {
        id: 'percentualPositivacaoCarteiraMes',
        icone: 'selo',
        titulo: '% Positivacao da carteira',
        valor: formatarPercentualTaxa(0),
        descricao: '',
        ajuda: {
          composicao: 'Fornecedores da carteira ativa que compraram / total de fornecedores ativos da carteira.',
          periodo: 'Mes corrente pela data de inclusao do ordemCompra.'
        }
      },
      {
        id: 'catalogo',
        icone: 'atendimentos',
        titulo: 'Catalogo',
        valor: '0',
        descricao: '',
        ajuda: {
          composicao: 'Quantidade de produtos ativos.',
          periodo: 'Base cadastral atual.'
        }
      },
      {
        id: 'carteira',
        icone: 'selo',
        titulo: 'Carteira',
        valor: '0',
        descricao: '',
        ajuda: {
          composicao: 'Quantidade de fornecedores ativos no escopo da home.',
          periodo: 'Base cadastral atual.'
        }
      }
    ],
    metricas: [],
    faixas: [],
    empresa: null,
    exibirFunil: true,
    funil: [],
    cotacoesPorGrupo: [],
    cotacoesPorMarca: [],
    cotacoesPorProduto: [],
    ordensCompraPorGrupo: [],
    ordensCompraPorMarca: [],
    ordensCompraPorUf: [],
    ordensCompraPorFornecedor: [],
    ordensCompraPorConceitoFornecedor: [],
    ordensCompraPorProduto: [],
    atendimentosPorCanal: [],
    atendimentosPorOrigem: [],
    atendimentosPorFornecedor: [],
    atendimentosPorTipo: [],
    atendimentosPorUsuario: [],
    alertas: [],
    tituloRanking: 'Ranking',
    descricaoRanking: '',
    ranking: [],
    agenda: []
  };
}

function filtrarFornecedoresVisiveis(fornecedores, usuarioLogado) {
  const listaFornecedores = Array.isArray(fornecedores) ? fornecedores : [];

  if (usuarioLogado?.tipo !== 'Usuario padrao' || !usuarioLogado?.idComprador) {
    return listaFornecedores;
  }

  return listaFornecedores.filter((fornecedor) => String(fornecedor.idComprador) === String(usuarioLogado.idComprador));
}

function filtrarCotacoesVisiveis(cotacoes, idsFornecedores, usuarioLogado) {
  if (usuarioLogado?.tipo !== 'Usuario padrao' || !usuarioLogado?.idComprador) {
    return Array.isArray(cotacoes) ? cotacoes : [];
  }

  return (cotacoes || []).filter(
    (item) => String(item.idComprador) === String(usuarioLogado.idComprador)
  );
}

function filtrarOrdensCompraVisiveis(ordensCompra, idsFornecedores, usuarioLogado) {
  if (usuarioLogado?.tipo !== 'Usuario padrao' || !usuarioLogado?.idComprador) {
    return Array.isArray(ordensCompra) ? ordensCompra : [];
  }

  return (ordensCompra || []).filter(
    (item) => String(item.idComprador) === String(usuarioLogado.idComprador)
  );
}

function filtrarAtendimentosVisiveis(atendimentos, idsFornecedores, usuarioLogado) {
  if (usuarioLogado?.tipo !== 'Usuario padrao' || !usuarioLogado?.idUsuario) {
    return Array.isArray(atendimentos) ? atendimentos : [];
  }

  // Para usuario padrao, a home de atendimentos deve consolidar apenas os registros do proprio usuario.
  return (atendimentos || []).filter((item) => String(item.idUsuario) === String(usuarioLogado.idUsuario));
}

// O tipo Prospeccao nasce dinamico no cadastro, entao a identificacao precisa ser resiliente a acentos e caixa.
function encontrarIdTipoAtendimentoProspeccao(tiposAtendimento) {
  return (tiposAtendimento || []).find((tipoAtendimento) => (
    normalizarTextoComparacao(tipoAtendimento?.descricao) === 'prospeccao'
  ))?.idTipoAtendimento ?? null;
}

// Esta normalizacao curta permite comparar textos operacionais sem depender de acentos digitados pelo usuario.
function normalizarTextoComparacao(valor) {
  return String(valor || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
}

function filtrarAgendamentosVisiveis(agendamentos, idsFornecedores, usuarioLogado) {
  if (usuarioLogado?.tipo !== 'Usuario padrao') {
    return Array.isArray(agendamentos) ? agendamentos : [];
  }

  return (agendamentos || []).filter((item) => {
    if (idsFornecedores.has(String(item.idFornecedor))) {
      return true;
    }

    const idsUsuarios = Array.isArray(item.idsUsuarios) ? item.idsUsuarios.map(String) : [];
    return idsUsuarios.length > 0
      ? idsUsuarios.includes(String(usuarioLogado.idUsuario))
      : String(item.idUsuario) === String(usuarioLogado.idUsuario);
  });
}

function montarFunil(funil) {
  const totalQuantidadeItens = (funil || []).reduce((acumulado, item) => acumulado + (Number(item.quantidadeItens) || 0), 0);
  const totalValor = (funil || []).reduce((acumulado, item) => acumulado + (Number(item.valorTotal) || 0), 0);
  return (funil || []).map((item) => ({
    idEtapaCotacao: item.idEtapaCotacao,
    descricao: item.descricao,
    quantidadeCotacoes: `${item.quantidadeCotacoes} orc.`,
    quantidadeItens: Number(item.quantidadeItens || 0),
    valor: normalizarPreco(item.valorTotal),
    cor: item.cor,
    percentualProdutos: calcularPercentualParteDoTotal(Number(item.quantidadeItens || 0), totalQuantidadeItens),
    percentualValor: calcularPercentualParteDoTotal(Number(item.valorTotal || 0), totalValor),
    ajuda: {
      composicao: `${item.quantidadeCotacoes} cotacoes, ${Number(item.quantidadeItens || 0)} itens e ${normalizarPreco(item.valorTotal)} nessa etapa.`,
      periodo: 'Posicao atual do funil de cotacoes em aberto.'
    }
  }));
}

function calcularPercentualParteDoTotal(valor, total) {
  const valorNumerico = Number(valor) || 0;
  const totalNumerico = Number(total) || 0;

  if (valorNumerico <= 0 || totalNumerico <= 0) {
    return 0;
  }

  return Math.max(8, Math.round((valorNumerico / totalNumerico) * 100));
}

function montarAlertas(vencidos, vencendo, entrega, semAtendimento) {
  const maior = Math.max(vencidos, vencendo, entrega, semAtendimento, 1);
  return [
    {
      rotulo: 'Cotacoes vencidos',
      valor: String(vencidos),
      descricao: 'Validade expirada em negociacoes abertas.',
      percentual: Math.round((vencidos / maior) * 100),
      ajuda: {
        conceito: 'Negociacoes abertas cuja validade ja terminou.',
        calculo: 'Conta cotacoes abertos com data de validade anterior a data de hoje.',
        observacao: 'Mostra risco de perda por falta de retorno.'
      }
    },
    {
      rotulo: 'Vencendo em 7 dias',
      valor: String(vencendo),
      descricao: 'Negociacoes que precisam de retorno rapido.',
      percentual: Math.round((vencendo / maior) * 100),
      ajuda: {
        conceito: 'Cotacoes abertos que vencem em ate 7 dias.',
        calculo: 'Conta validade entre a data de hoje e os proximos 7 dias.',
        observacao: 'Ajuda a priorizar follow-up antes do vencimento.'
      }
    },
    {
      rotulo: 'Ordens de Compra com entrega proxima',
      valor: String(entrega),
      descricao: 'Ordens de Compra previstos para os proximos 7 dias.',
      percentual: Math.round((entrega / maior) * 100),
      ajuda: {
        conceito: 'OrdensCompra pendentes com entrega prevista em ate 7 dias.',
        calculo: 'Conta ordens de compra nao entregues cuja data de entrega cai entre hoje e os proximos 7 dias.',
        observacao: 'Bom indicador para antecipar alinhamentos.'
      }
    },
    {
      rotulo: 'Fornecedores sem atendimento',
      valor: String(semAtendimento),
      descricao: 'Sem interacao registrada nos ultimos 30 dias.',
      percentual: Math.round((semAtendimento / maior) * 100),
      ajuda: {
        conceito: 'Fornecedores sem registro recente de atendimento.',
        calculo: 'Ultimo atendimento do fornecedor ha mais de 30 dias, contando a partir de hoje, ou inexistente.',
        observacao: 'Ajuda a identificar carteira esfriando.'
      }
    }
  ];
}

function montarResumoPorRelacionamento(
  registros,
  produtos,
  relacionamentos,
  chaveProduto,
  chaveRelacionamento,
  chaveDescricao,
  descricaoFallback,
  opcoes = {}
) {
  const {
    chaveRegistroId = 'idOrdemCompra',
    sufixoQuantidadeRegistros = 'ped.'
  } = opcoes;
  const produtosPorId = new Map((produtos || []).map((produto) => [
    String(produto.idProduto),
    produto
  ]));
  const relacionamentosPorId = new Map((relacionamentos || []).map((registro) => [
    String(registro[chaveRelacionamento]),
    registro
  ]));
  const resumoPorRelacionamento = new Map();

  (registros || []).forEach((registro) => {
    (registro?.itens || []).forEach((item) => {
      const produto = produtosPorId.get(String(item.idProduto || ''));
      const idRelacionamento = String(produto?.[chaveProduto] || 'sem-relacionamento');
      const relacionamento = relacionamentosPorId.get(idRelacionamento);
      const atual = resumoPorRelacionamento.get(idRelacionamento) || {
        id: idRelacionamento,
        descricao: relacionamento?.[chaveDescricao] || descricaoFallback,
        quantidadeItens: 0,
        valorTotal: 0,
        ordensCompra: new Set()
      };

      atual.quantidadeItens += Number(item.quantidade) || 0;
      atual.valorTotal += Number(item.valorTotal) || 0;
      atual.ordensCompra.add(String(registro[chaveRegistroId]));
      resumoPorRelacionamento.set(idRelacionamento, atual);
    });
  });

  const lista = [...resumoPorRelacionamento.values()]
    .map((item) => ({
      ...item,
      quantidadeOrdensCompra: `${item.ordensCompra.size} ${sufixoQuantidadeRegistros}`,
      ordensCompra: undefined
    }))
    .filter((item) => item.quantidadeItens !== 0 || item.valorTotal !== 0)
    .sort((a, b) => b.valorTotal - a.valorTotal);
  const totalQuantidade = lista.reduce(
    (acumulado, item) => acumulado + Math.max(Number(item.quantidadeItens) || 0, 0),
    0
  );
  const totalValor = lista.reduce(
    (acumulado, item) => acumulado + Math.max(Number(item.valorTotal) || 0, 0),
    0
  );

  return lista.map((item) => ({
    ...item,
    valor: normalizarPreco(item.valorTotal),
    percentualQuantidade: calcularPercentualParteDoTotal(Number(item.quantidadeItens || 0), totalQuantidade),
    percentualValor: calcularPercentualParteDoTotal(Number(item.valorTotal || 0), totalValor),
    ajuda: {
      composicao: `${item.quantidadeOrdensCompra}, ${item.quantidadeItens} itens e ${normalizarPreco(item.valorTotal)} para ${item.descricao}.`,
      periodo: 'Mes corrente pela data de entrada do ordemCompra.'
    }
  }));
}

function montarResumoPorUf(ordensCompra, fornecedores) {
  const fornecedoresPorId = new Map((fornecedores || []).map((fornecedor) => [
    String(fornecedor.idFornecedor),
    fornecedor
  ]));
  const resumoPorUf = new Map();

  (ordensCompra || []).forEach((ordemCompra) => {
    const fornecedor = fornecedoresPorId.get(String(ordemCompra?.idFornecedor || ''));
    const ufNormalizada = String(fornecedor?.estado || '').trim().toUpperCase();
    const uf = ufNormalizada || 'Sem UF';
    const atual = resumoPorUf.get(uf) || {
      id: uf,
      descricao: uf,
      quantidadeItens: 0,
      valorTotal: 0,
      ordensCompra: new Set()
    };

    (ordemCompra?.itens || []).forEach((item) => {
      atual.quantidadeItens += Number(item.quantidade) || 0;
      atual.valorTotal += Number(item.valorTotal) || 0;
    });

    atual.ordensCompra.add(String(ordemCompra.idOrdemCompra || ''));
    resumoPorUf.set(uf, atual);
  });

  const lista = [...resumoPorUf.values()]
    .map((item) => ({
      ...item,
      quantidadeOrdensCompra: `${item.ordensCompra.size} ped.`,
      ordensCompra: undefined
    }))
    .filter((item) => item.quantidadeItens !== 0 || item.valorTotal !== 0)
    .sort((a, b) => b.valorTotal - a.valorTotal);

  const totalQuantidade = lista.reduce(
    (acumulado, item) => acumulado + Math.max(Number(item.quantidadeItens) || 0, 0),
    0
  );
  const totalValor = lista.reduce(
    (acumulado, item) => acumulado + Math.max(Number(item.valorTotal) || 0, 0),
    0
  );

  return lista.map((item) => ({
    ...item,
    valor: normalizarPreco(item.valorTotal),
    percentualQuantidade: calcularPercentualParteDoTotal(Number(item.quantidadeItens || 0), totalQuantidade),
    percentualValor: calcularPercentualParteDoTotal(Number(item.valorTotal || 0), totalValor),
    ajuda: {
      composicao: `${item.quantidadeOrdensCompra}, ${item.quantidadeItens} itens e ${normalizarPreco(item.valorTotal)} na UF ${item.descricao}.`,
      periodo: 'Mes corrente pela data de entrada do ordemCompra.'
    }
  }));
}

function montarResumoPorFornecedor(ordensCompra, fornecedores, empresa) {
  const fornecedoresPorId = new Map((fornecedores || []).map((fornecedor) => [
    String(fornecedor.idFornecedor),
    fornecedor
  ]));
  const resumoPorFornecedor = new Map();

  (ordensCompra || []).forEach((ordemCompra) => {
    const idFornecedor = String(ordemCompra?.idFornecedor || '');
    const fornecedor = fornecedoresPorId.get(idFornecedor);
    const nomeFantasiaFornecedor = fornecedor?.nomeFantasia || fornecedor?.razaoSocial || 'Fornecedor sem nome';
    const codigoFornecedor = formatarCodigoFornecedor(fornecedor || { idFornecedor: ordemCompra?.idFornecedor }, empresa);
    const descricaoFornecedor = `${codigoFornecedor} - ${nomeFantasiaFornecedor}`;
    const atual = resumoPorFornecedor.get(idFornecedor) || {
      id: idFornecedor || 'sem-fornecedor',
      descricao: descricaoFornecedor,
      quantidadeItens: 0,
      valorTotal: 0,
      ordensCompra: new Set()
    };

    (ordemCompra?.itens || []).forEach((item) => {
      atual.quantidadeItens += Number(item.quantidade) || 0;
      atual.valorTotal += Number(item.valorTotal) || 0;
    });

    atual.ordensCompra.add(String(ordemCompra.idOrdemCompra || ''));
    resumoPorFornecedor.set(idFornecedor, atual);
  });

  const lista = [...resumoPorFornecedor.values()]
    .map((item) => ({
      ...item,
      quantidadeOrdensCompra: `${item.ordensCompra.size} ped.`,
      ordensCompra: undefined
    }))
    .filter((item) => item.quantidadeItens !== 0 || item.valorTotal !== 0)
    .sort((a, b) => b.valorTotal - a.valorTotal);

  const totalQuantidade = lista.reduce(
    (acumulado, item) => acumulado + Math.max(Number(item.quantidadeItens) || 0, 0),
    0
  );
  const totalValor = lista.reduce(
    (acumulado, item) => acumulado + Math.max(Number(item.valorTotal) || 0, 0),
    0
  );

  return lista.map((item) => ({
    ...item,
    valor: normalizarPreco(item.valorTotal),
    percentualQuantidade: calcularPercentualParteDoTotal(Number(item.quantidadeItens || 0), totalQuantidade),
    percentualValor: calcularPercentualParteDoTotal(Number(item.valorTotal || 0), totalValor),
    ajuda: {
      composicao: `${item.quantidadeOrdensCompra}, ${item.quantidadeItens} itens e ${normalizarPreco(item.valorTotal)} para ${item.descricao}.`,
      periodo: 'Mes corrente pela data de entrada do ordemCompra.'
    }
  }));
}

// O conceito precisa ser resolvido a partir do fornecedor porque o ordemCompra nao guarda esse snapshot hoje.
function montarResumoPorConceitoFornecedor(ordensCompra, fornecedores, conceitosFornecedor) {
  const fornecedoresPorId = new Map((fornecedores || []).map((fornecedor) => [
    String(fornecedor.idFornecedor),
    fornecedor
  ]));
  const conceitosPorId = new Map((conceitosFornecedor || []).map((conceito) => [
    String(conceito.idConceito),
    conceito
  ]));
  const resumoPorConceito = new Map();

  (ordensCompra || []).forEach((ordemCompra) => {
    const fornecedor = fornecedoresPorId.get(String(ordemCompra?.idFornecedor || ''));
    const idConceito = String(fornecedor?.idConceito || 1);
    const conceito = conceitosPorId.get(idConceito);
    const descricaoConceito = conceito?.descricao || 'Sem Conceito';
    const resumoAtual = resumoPorConceito.get(idConceito) || {
      id: idConceito,
      descricao: descricaoConceito,
      quantidadeItens: 0,
      valorTotal: 0,
      ordensCompra: new Set()
    };

    (ordemCompra?.itens || []).forEach((item) => {
      resumoAtual.quantidadeItens += Number(item.quantidade) || 0;
      resumoAtual.valorTotal += Number(item.valorTotal) || 0;
    });

    resumoAtual.ordensCompra.add(String(ordemCompra.idOrdemCompra || ''));
    resumoPorConceito.set(idConceito, resumoAtual);
  });

  const lista = [...resumoPorConceito.values()]
    .map((item) => ({
      ...item,
      quantidadeOrdensCompra: `${item.ordensCompra.size} ped.`,
      ordensCompra: undefined
    }))
    .filter((item) => item.quantidadeItens !== 0 || item.valorTotal !== 0)
    .sort((itemA, itemB) => itemB.valorTotal - itemA.valorTotal);
  const totalQuantidade = lista.reduce(
    (acumulado, item) => acumulado + Math.max(Number(item.quantidadeItens) || 0, 0),
    0
  );
  const totalValor = lista.reduce(
    (acumulado, item) => acumulado + Math.max(Number(item.valorTotal) || 0, 0),
    0
  );

  return lista.map((item) => ({
    ...item,
    valor: normalizarPreco(item.valorTotal),
    percentualQuantidade: calcularPercentualParteDoTotal(Number(item.quantidadeItens || 0), totalQuantidade),
    percentualValor: calcularPercentualParteDoTotal(Number(item.valorTotal || 0), totalValor),
    ajuda: {
      composicao: `${item.quantidadeOrdensCompra}, ${item.quantidadeItens} itens e ${normalizarPreco(item.valorTotal)} no conceito ${item.descricao}.`,
      periodo: 'Mes corrente pela data de entrada do ordemCompra.'
    }
  }));
}

function montarResumoAtendimentosPorRelacionamento(
  atendimentos,
  relacionamentos,
  chaveAtendimento,
  chaveRelacionamento,
  chaveDescricao,
  descricaoFallback
) {
  const relacionamentoPorId = new Map((relacionamentos || []).map((registro) => [
    String(registro?.[chaveRelacionamento]),
    registro
  ]));
  const resumoPorRelacionamento = new Map();

  (atendimentos || []).forEach((atendimento) => {
    const idRelacionamento = String(atendimento?.[chaveAtendimento] || 'sem-relacionamento');
    const relacionamento = relacionamentoPorId.get(idRelacionamento);
    const resumoAtual = resumoPorRelacionamento.get(idRelacionamento) || {
      id: idRelacionamento,
      descricao: relacionamento?.[chaveDescricao] || descricaoFallback,
      quantidadeAtendimentos: 0,
      quantidadeFornecedoresSet: new Set()
    };

    resumoAtual.quantidadeAtendimentos += 1;
    if (atendimento?.idFornecedor) {
      resumoAtual.quantidadeFornecedoresSet.add(String(atendimento.idFornecedor));
    }
    resumoPorRelacionamento.set(idRelacionamento, resumoAtual);
  });

  const lista = [...resumoPorRelacionamento.values()]
    .map((item) => ({
      ...item,
      quantidadeFornecedores: item.quantidadeFornecedoresSet.size,
      quantidadeFornecedoresSet: undefined
    }))
    .sort((itemA, itemB) => itemB.quantidadeAtendimentos - itemA.quantidadeAtendimentos);
  const totalAtendimentos = lista.reduce((total, item) => total + Number(item.quantidadeAtendimentos || 0), 0);
  const totalFornecedores = lista.reduce((total, item) => total + Number(item.quantidadeFornecedores || 0), 0);

  return lista.map((item) => ({
    ...item,
    percentualAtendimentos: calcularPercentualParteDoTotal(item.quantidadeAtendimentos, totalAtendimentos),
    percentualFornecedores: calcularPercentualParteDoTotal(item.quantidadeFornecedores, totalFornecedores),
    ajuda: {
      composicao: `${item.quantidadeAtendimentos} atendimentos e ${item.quantidadeFornecedores} fornecedores para ${item.descricao}.`,
      periodo: 'Mes corrente pela data do atendimento.'
    }
  }));
}

function montarResumoAtendimentosPorFornecedor(atendimentos, fornecedores, empresa) {
  const fornecedoresPorId = new Map((fornecedores || []).map((fornecedor) => [
    String(fornecedor.idFornecedor),
    fornecedor
  ]));
  const resumoPorFornecedor = new Map();

  (atendimentos || []).forEach((atendimento) => {
    const idFornecedor = String(atendimento?.idFornecedor || '');
    const fornecedor = fornecedoresPorId.get(idFornecedor);
    const descricaoFornecedor = fornecedor
      ? `${formatarCodigoFornecedor(fornecedor, empresa)} - ${fornecedor.nomeFantasia || fornecedor.razaoSocial || 'Fornecedor sem nome'}`
      : 'Fornecedor sem nome';
    const resumoAtual = resumoPorFornecedor.get(idFornecedor) || {
      id: idFornecedor || 'sem-fornecedor',
      descricao: descricaoFornecedor,
      quantidadeAtendimentos: 0,
      usuariosSet: new Set()
    };

    resumoAtual.quantidadeAtendimentos += 1;
    if (atendimento?.idUsuario) {
      resumoAtual.usuariosSet.add(String(atendimento.idUsuario));
    }
    resumoPorFornecedor.set(idFornecedor, resumoAtual);
  });

  const lista = [...resumoPorFornecedor.values()]
    .map((item) => ({
      ...item,
      quantidadeUsuarios: item.usuariosSet.size,
      usuariosSet: undefined
    }))
    .sort((itemA, itemB) => itemB.quantidadeAtendimentos - itemA.quantidadeAtendimentos);
  const totalAtendimentos = lista.reduce((total, item) => total + Number(item.quantidadeAtendimentos || 0), 0);
  const totalUsuarios = lista.reduce((total, item) => total + Number(item.quantidadeUsuarios || 0), 0);

  return lista.map((item) => ({
    ...item,
    percentualAtendimentos: calcularPercentualParteDoTotal(item.quantidadeAtendimentos, totalAtendimentos),
    percentualUsuarios: calcularPercentualParteDoTotal(item.quantidadeUsuarios, totalUsuarios),
    ajuda: {
      composicao: `${item.quantidadeAtendimentos} atendimentos e ${item.quantidadeUsuarios} usuarios no fornecedor ${item.descricao}.`,
      periodo: 'Mes corrente pela data do atendimento.'
    }
  }));
}

function montarResumoAtendimentosPorUsuario(atendimentos, usuarios) {
  const usuariosPorId = new Map((usuarios || []).map((usuario) => [
    String(usuario.idUsuario),
    usuario
  ]));
  const resumoPorUsuario = new Map();

  (atendimentos || []).forEach((atendimento) => {
    const idUsuario = String(atendimento?.idUsuario || '');
    const usuario = usuariosPorId.get(idUsuario);
    const descricaoUsuario = usuario?.nome || 'Usuario sem nome';
    const resumoAtual = resumoPorUsuario.get(idUsuario) || {
      id: idUsuario || 'sem-usuario',
      descricao: descricaoUsuario,
      quantidadeAtendimentos: 0,
      fornecedoresSet: new Set()
    };

    resumoAtual.quantidadeAtendimentos += 1;
    if (atendimento?.idFornecedor) {
      resumoAtual.fornecedoresSet.add(String(atendimento.idFornecedor));
    }
    resumoPorUsuario.set(idUsuario, resumoAtual);
  });

  const lista = [...resumoPorUsuario.values()]
    .map((item) => ({
      ...item,
      quantidadeFornecedores: item.fornecedoresSet.size,
      fornecedoresSet: undefined
    }))
    .sort((itemA, itemB) => itemB.quantidadeAtendimentos - itemA.quantidadeAtendimentos);
  const totalAtendimentos = lista.reduce((total, item) => total + Number(item.quantidadeAtendimentos || 0), 0);
  const totalFornecedores = lista.reduce((total, item) => total + Number(item.quantidadeFornecedores || 0), 0);

  return lista.map((item) => ({
    ...item,
    percentualAtendimentos: calcularPercentualParteDoTotal(item.quantidadeAtendimentos, totalAtendimentos),
    percentualFornecedores: calcularPercentualParteDoTotal(item.quantidadeFornecedores, totalFornecedores),
    ajuda: {
      composicao: `${item.quantidadeAtendimentos} atendimentos e ${item.quantidadeFornecedores} fornecedores para ${item.descricao}.`,
      periodo: 'Mes corrente pela data do atendimento.'
    }
  }));
}

function montarRankingCompradores(ordensCompra, compradoresPorId) {
  return montarRanking(
    ordensCompra,
    (item) => String(item.idComprador || ''),
    (chave) => compradoresPorId.get(chave) || 'Sem comprador'
  );
}

function montarRankingFornecedores(ordensCompra, fornecedoresPorId) {
  return montarRanking(
    ordensCompra,
    (item) => String(item.idFornecedor || ''),
    (chave) => fornecedoresPorId.get(chave) || 'Fornecedor sem nome'
  );
}

function montarRanking(ordensCompra, obterChave, obterNome) {
  const mapa = new Map();

  (ordensCompra || []).forEach((ordemCompra) => {
    const chave = obterChave(ordemCompra);
    const atual = mapa.get(chave) || { nome: obterNome(chave), total: 0, quantidade: 0 };
    atual.total += totalRegistro(ordemCompra);
    atual.quantidade += 1;
    mapa.set(chave, atual);
  });

  const lista = [...mapa.values()].sort((a, b) => b.total - a.total);
  const maior = Math.max(...lista.map((item) => item.total), 0);

  return lista.map((item) => ({
    rotulo: item.nome,
    descricao: `${item.quantidade} ordens de compra`,
    valor: normalizarPreco(item.total),
    percentual: maior > 0 ? Math.max(12, Math.round((item.total / maior) * 100)) : 0,
    ajuda: {
      composicao: `${item.quantidade} ordens de compra somando ${normalizarPreco(item.total)}.`,
      periodo: 'Mes corrente pela data de entrada do ordemCompra.'
    }
  }));
}

function contarFornecedoresSemAtendimento(fornecedores, atendimentos, diasLimite) {
  const ultimos = new Map();

  (atendimentos || []).forEach((item) => {
    const chave = String(item.idFornecedor || '');
    const data = normalizarData(item.data);
    if (!data || (!chave)) {
      return;
    }
    if (!ultimos.get(chave) || data > ultimos.get(chave)) {
      ultimos.set(chave, data);
    }
  });

  return (fornecedores || []).filter((fornecedor) => {
    const ultimaData = ultimos.get(String(fornecedor.idFornecedor));
    return !ultimaData || diferencaDias(ultimaData, dataInput(new Date())) > diasLimite;
  }).length;
}

function somarTotais(registros) {
  return (registros || []).reduce((total, item) => total + totalRegistro(item), 0);
}

function somarQuantidadeItensBruta(registros) {
  return (registros || []).reduce((total, registro) => {
    const quantidadeRegistro = Array.isArray(registro?.itens)
      ? registro.itens.reduce((acumulado, item) => acumulado + Math.abs(Number(item?.quantidade) || 0), 0)
      : 0;

    return total + quantidadeRegistro;
  }, 0);
}

function calcularMediaDiasConversao(registros) {
  const diferencas = (registros || [])
    .map((registro) => diferencaDias(registro?.dataInclusao, registro?.dataFechamento))
    .filter((valor) => Number.isFinite(valor) && valor >= 0);

  if (diferencas.length === 0) {
    return 0;
  }

  const total = diferencas.reduce((acumulado, valor) => acumulado + valor, 0);
  return total / diferencas.length;
}

function totalRegistro(registro) {
  return Array.isArray(registro?.itens)
    ? registro.itens.reduce((total, item) => total + (Number(item?.valorTotal) || 0), 0)
    : 0;
}

function cotacaoEhFechado(cotacao) {
  return IDS_ETAPAS_COTACAO_FECHADAS.has(Number(cotacao?.idEtapaCotacao));
}

function ordemCompraPendente(ordemCompra) {
  return Number(ordemCompra?.idEtapaOrdemCompra) !== ID_ETAPA_ORDEM_COMPRA_ENTREGUE;
}

function dataNoPeriodo(valor, inicio, fim) {
  const data = normalizarData(valor);
  return Boolean(data && data >= inicio && data <= fim);
}

function dataAnterior(valor, referencia) {
  const data = normalizarData(valor);
  return Boolean(data && data < referencia);
}

function dataNosProximosDias(valor, diasMaximos) {
  const data = valor instanceof Date ? valor : criarData(valor);
  if (!(data instanceof Date) || Number.isNaN(data.getTime())) {
    return false;
  }

  const hoje = new Date();
  const base = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  const alvo = new Date(data.getFullYear(), data.getMonth(), data.getDate());
  const dias = Math.round((alvo.getTime() - base.getTime()) / 86400000);
  return dias >= 0 && dias <= diasMaximos;
}

function criarDataHoraAgendamento(agendamento) {
  if (!agendamento?.data || !agendamento?.horaInicio) {
    return null;
  }

  const data = new Date(`${normalizarData(agendamento.data)}T${String(agendamento.horaInicio).slice(0, 5)}:00`);
  return Number.isNaN(data.getTime()) ? null : data;
}

function formatarAgendamento(agendamento) {
  const dataHora = criarDataHoraAgendamento(agendamento);
  if (!dataHora) {
    return '-';
  }

  return `${formatarData(dataHora)} ${String(agendamento.horaInicio || '').slice(0, 5)}${agendamento.horaFim ? ` - ${String(agendamento.horaFim).slice(0, 5)}` : ''}`;
}

function formatarData(valor) {
  const data = valor instanceof Date ? valor : criarData(valor);
  return data ? new Intl.DateTimeFormat('pt-BR').format(data) : '-';
}

function normalizarData(valor) {
  const texto = String(valor || '').trim();
  const correspondencia = texto.match(/^(\d{4}-\d{2}-\d{2})/);
  return correspondencia ? correspondencia[1] : '';
}

function criarData(valor) {
  const dataNormalizada = normalizarData(valor);
  if (!dataNormalizada) {
    return null;
  }

  const data = new Date(`${dataNormalizada}T00:00:00`);
  return Number.isNaN(data.getTime()) ? null : data;
}

function diferencaDias(inicio, fim) {
  const dataInicio = criarData(inicio);
  const dataFim = criarData(fim);
  if (!dataInicio || !dataFim) {
    return 0;
  }

  return Math.round((dataFim.getTime() - dataInicio.getTime()) / 86400000);
}

function dataInput(data) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const dia = String(data.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

function formatarPercentualTaxa(valor) {
  const numero = Number(valor);
  const percentual = Number.isFinite(numero) ? numero : 0;
  return `${percentual.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
}

function formatarNumeroInteiro(valor) {
  const numero = Number(valor);
  const inteiro = Number.isFinite(numero) ? Math.round(numero) : 0;
  return inteiro.toLocaleString('pt-BR');
}


