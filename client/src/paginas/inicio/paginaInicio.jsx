import { useEffect, useMemo, useState } from 'react';
import '../../recursos/estilos/paginaInicio.css';
import { FunilVendas } from '../../componentes/comuns/funilVendas';
import { ModalFiltros } from '../../componentes/comuns/modalFiltros';
import { CorpoPagina } from '../../componentes/layout/corpoPagina';
import { listarClientes, listarVendedores } from '../../servicos/clientes';
import { listarEtapasOrcamentoConfiguracao } from '../../servicos/configuracoes';
import { listarEmpresas } from '../../servicos/empresa';
import { listarOrcamentos } from '../../servicos/orcamentos';
import { listarPedidos } from '../../servicos/pedidos';
import { listarGruposProduto, listarMarcas, listarProdutos } from '../../servicos/produtos';
import { normalizarPreco } from '../../utilitarios/normalizarPreco';
import {
  normalizarFiltrosPorPadrao,
  normalizarListaFiltroPersistido,
  useFiltrosPersistidos
} from '../../utilitarios/useFiltrosPersistidos';
import { CabecalhoInicio } from './componentes/cabecalhoInicio';
import { IndicadorResumoInicio } from './componentes/indicadorResumoInicio';
import { ModalManualInicio } from './modalManualInicio';
import { filtrarOrcamentosPaginaInicio } from './utilitarios/filtrarOrcamentosPaginaInicio';
import { filtrarPedidosPaginaInicio } from './utilitarios/filtrarPedidosPaginaInicio';
import { criarResumoFunilVendas } from './utilitarios/criarResumoFunilVendas';

export function PaginaInicio({ usuarioLogado }) {
  const [totalClientes, definirTotalClientes] = useState(0);
  const [totalProdutos, definirTotalProdutos] = useState(0);
  const [empresa, definirEmpresa] = useState(null);
  const [orcamentos, definirOrcamentos] = useState([]);
  const [pedidos, definirPedidos] = useState([]);
  const [produtos, definirProdutos] = useState([]);
  const [gruposProduto, definirGruposProduto] = useState([]);
  const [marcas, definirMarcas] = useState([]);
  const [vendedores, definirVendedores] = useState([]);
  const [etapasOrcamento, definirEtapasOrcamento] = useState([]);
  const [carregando, definirCarregando] = useState(true);
  const [mensagemErro, definirMensagemErro] = useState('');
  const [mensagemErroFunil, definirMensagemErroFunil] = useState('');
  const [modalManualAberto, definirModalManualAberto] = useState(false);
  const [modalFiltrosAberto, definirModalFiltrosAberto] = useState(false);
  const usuarioSomenteVendedor = usuarioLogado?.tipo === 'Usuario padrao' && usuarioLogado?.idVendedor;

  const filtrosIniciais = useMemo(
    () => criarFiltrosIniciaisPaginaInicio(usuarioLogado),
    [usuarioLogado?.idVendedor, usuarioLogado?.tipo]
  );
  const [filtros, definirFiltros] = useFiltrosPersistidos({
    chave: 'paginaInicio',
    usuario: usuarioLogado,
    filtrosPadrao: filtrosIniciais,
    normalizarFiltros: (proximosFiltros, filtrosPadrao) => (
      normalizarFiltrosPaginaInicio(proximosFiltros, filtrosPadrao, usuarioLogado)
    )
  });
  const filtrosAtivos = JSON.stringify(filtros) !== JSON.stringify(filtrosIniciais);
  const orcamentosFiltrados = useMemo(
    () => filtrarOrcamentosPaginaInicio(orcamentos, filtros, produtos),
    [orcamentos, filtros, produtos]
  );
  const pedidosFiltrados = useMemo(
    () => filtrarPedidosPaginaInicio(pedidos, filtros, produtos),
    [pedidos, filtros, produtos]
  );
  const etapasFunil = useMemo(
    () => criarResumoFunilVendas(etapasOrcamento, orcamentosFiltrados),
    [etapasOrcamento, orcamentosFiltrados]
  );
  const totalVendasValor = useMemo(
    () => pedidosFiltrados.reduce((total, pedido) => total + obterValorTotalPedido(pedido), 0),
    [pedidosFiltrados]
  );
  const totalVendasQuantidade = useMemo(
    () => pedidosFiltrados.reduce((total, pedido) => total + obterQuantidadeTotalPedido(pedido), 0),
    [pedidosFiltrados]
  );

  useEffect(() => {
    let cancelado = false;

    async function carregarIndicadores() {
      definirCarregando(true);
      definirMensagemErro('');
      definirMensagemErroFunil('');

      try {
        const [clientes, produtosCarregados, gruposCarregados, marcasCarregadas, vendedoresCarregados, empresas, etapasCarregadas, orcamentosCarregados, pedidosCarregados] = await Promise.all([
          listarClientes(),
          listarProdutos(),
          listarGruposProduto(),
          listarMarcas(),
          listarVendedores(),
          listarEmpresas(),
          listarEtapasOrcamentoConfiguracao(),
          listarOrcamentos(),
          listarPedidos()
        ]);

        if (cancelado) {
          return;
        }

        definirTotalClientes(Array.isArray(clientes) ? clientes.length : 0);
        definirTotalProdutos(Array.isArray(produtosCarregados) ? produtosCarregados.length : 0);
        definirEmpresa(empresas[0] || null);
        definirProdutos(Array.isArray(produtosCarregados) ? produtosCarregados : []);
        definirGruposProduto(Array.isArray(gruposCarregados) ? gruposCarregados : []);
        definirMarcas(Array.isArray(marcasCarregadas) ? marcasCarregadas : []);
        definirVendedores(Array.isArray(vendedoresCarregados) ? vendedoresCarregados : []);
        definirEtapasOrcamento(Array.isArray(etapasCarregadas) ? etapasCarregadas : []);
        definirOrcamentos(Array.isArray(orcamentosCarregados) ? orcamentosCarregados : []);
        definirPedidos(Array.isArray(pedidosCarregados) ? pedidosCarregados : []);
      } catch (_erro) {
        if (!cancelado) {
          definirMensagemErro('Nao foi possivel carregar os indicadores da pagina inicial.');
          definirMensagemErroFunil('Nao foi possivel carregar os dados do funil de vendas.');
        }
      } finally {
        if (!cancelado) {
          definirCarregando(false);
        }
      }
    }

    carregarIndicadores();

    function tratarEmpresaAtualizada() {
      carregarIndicadores();
    }

    window.addEventListener('empresa-atualizada', tratarEmpresaAtualizada);

    return () => {
      cancelado = true;
      window.removeEventListener('empresa-atualizada', tratarEmpresaAtualizada);
    };
  }, []);

  useEffect(() => {
    function tratarAtalhosInicio(evento) {
      if (evento.key !== 'F1') {
        return;
      }

      evento.preventDefault();

      if (!modalManualAberto && !modalFiltrosAberto) {
        definirModalManualAberto(true);
      }
    }

    window.addEventListener('keydown', tratarAtalhosInicio);

    return () => {
      window.removeEventListener('keydown', tratarAtalhosInicio);
    };
  }, [modalManualAberto, modalFiltrosAberto]);

  return (
    <>
      <CabecalhoInicio
        aoAbrirFiltros={() => definirModalFiltrosAberto(true)}
        filtrosAtivos={filtrosAtivos}
      />

      <CorpoPagina>
        <div className="paginaInicioGrade">
          <IndicadorResumoInicio
            ariaLabel="Total de clientes cadastrados"
            icone="contato"
            titulo="Clientes cadastrados"
            valor={totalClientes.toLocaleString('pt-BR')}
            carregando={carregando}
            descricao={mensagemErro || 'Quantidade total de clientes registrados no sistema.'}
          />

          <IndicadorResumoInicio
            ariaLabel="Total de produtos cadastrados"
            icone="caixa"
            titulo="Produtos cadastrados"
            valor={totalProdutos.toLocaleString('pt-BR')}
            carregando={carregando}
            descricao={mensagemErro || 'Quantidade total de produtos registrados no sistema.'}
          />

          <IndicadorResumoInicio
            ariaLabel="Total de vendas em valores"
            icone="pagamento"
            titulo="Vendas em valores"
            valor={normalizarPreco(totalVendasValor)}
            carregando={carregando}
            descricao={mensagemErro || 'Valor total dos pedidos dentro do filtro aplicado.'}
          />

          <IndicadorResumoInicio
            ariaLabel="Total de vendas em quantidades"
            icone="pedido"
            titulo="Vendas em quantidades"
            valor={formatarQuantidade(totalVendasQuantidade)}
            carregando={carregando}
            descricao={mensagemErro || 'Quantidade total de itens vendidos dentro do filtro aplicado.'}
          />

          {empresa?.exibirFunilPaginaInicial ? (
            <FunilVendas
              etapas={etapasFunil}
              carregando={carregando}
              mensagemErro={mensagemErroFunil}
            />
          ) : null}
        </div>

        <ModalFiltros
          aberto={modalFiltrosAberto}
          titulo="Filtros da pagina inicial"
          filtros={filtros}
          campos={[
            {
              name: 'dataInicio',
              label: 'Data inicial',
              type: 'date',
              inputProps: {
                max: filtros.dataFim || undefined
              }
            },
            {
              name: 'dataFim',
              label: 'Data final',
              type: 'date',
              inputProps: {
                min: filtros.dataInicio || undefined
              }
            },
            {
              name: 'idVendedor',
              label: 'Vendedor',
              multiple: true,
              tituloSelecao: 'Selecionar vendedores',
              disabled: Boolean(usuarioSomenteVendedor),
              options: vendedores.map((vendedor) => ({
                valor: String(vendedor.idVendedor),
                label: vendedor.nome
              }))
            },
            {
              name: 'idProduto',
              label: 'Produto',
              multiple: true,
              tituloSelecao: 'Selecionar produtos',
              options: produtos
                .filter((produto) => produto.status !== 0)
                .map((produto) => ({
                  valor: String(produto.idProduto),
                  label: produto.descricao
                }))
            },
            {
              name: 'idGrupo',
              label: 'Grupo de produto',
              multiple: true,
              tituloSelecao: 'Selecionar grupos de produto',
              options: gruposProduto
                .filter((grupo) => grupo.status !== 0)
                .map((grupo) => ({
                  valor: String(grupo.idGrupo),
                  label: grupo.descricao
                }))
            },
            {
              name: 'idMarca',
              label: 'Marca',
              multiple: true,
              tituloSelecao: 'Selecionar marcas',
              options: marcas
                .filter((marca) => marca.status !== 0)
                .map((marca) => ({
                  valor: String(marca.idMarca),
                  label: marca.descricao
                }))
            }
          ]}
          aoFechar={() => definirModalFiltrosAberto(false)}
          aoAplicar={(proximosFiltros) => {
            definirFiltros(normalizarFiltrosPaginaInicio(proximosFiltros, filtrosIniciais, usuarioLogado));
            definirModalFiltrosAberto(false);
          }}
          aoLimpar={() => definirFiltros(filtrosIniciais)}
        />

        <ModalManualInicio
          aberto={modalManualAberto}
          aoFechar={() => definirModalManualAberto(false)}
          totalClientes={totalClientes}
          totalProdutos={totalProdutos}
          totalVendasValor={totalVendasValor}
          totalVendasQuantidade={totalVendasQuantidade}
          filtros={filtros}
          orcamentos={orcamentosFiltrados}
          pedidos={pedidosFiltrados}
          etapasFunil={etapasFunil}
          empresa={empresa}
          usuarioLogado={usuarioLogado}
        />
      </CorpoPagina>
    </>
  );
}

function criarFiltrosIniciaisPaginaInicio(usuarioLogado) {
  const idVendedor = usuarioLogado?.tipo === 'Usuario padrao' && usuarioLogado?.idVendedor
    ? [String(usuarioLogado.idVendedor)]
    : [];

  return {
    dataInicio: obterPrimeiroDiaMesAtual(),
    dataFim: obterUltimoDiaMesAtual(),
    idVendedor,
    idProduto: [],
    idGrupo: [],
    idMarca: []
  };
}

function obterPrimeiroDiaMesAtual() {
  const dataAtual = new Date();
  const ano = dataAtual.getFullYear();
  const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');

  return `${ano}-${mes}-01`;
}

function obterUltimoDiaMesAtual() {
  const dataAtual = new Date();
  const ultimoDia = new Date(dataAtual.getFullYear(), dataAtual.getMonth() + 1, 0);
  const ano = ultimoDia.getFullYear();
  const mes = String(ultimoDia.getMonth() + 1).padStart(2, '0');
  const dia = String(ultimoDia.getDate()).padStart(2, '0');

  return `${ano}-${mes}-${dia}`;
}

function normalizarFiltrosPaginaInicio(filtros, filtrosPadrao, usuarioLogado) {
  const filtrosNormalizados = normalizarFiltrosPorPadrao(filtros, filtrosPadrao);
  const dataInicio = filtrosNormalizados.dataInicio || filtrosPadrao.dataInicio;
  const dataFim = filtrosNormalizados.dataFim || filtrosPadrao.dataFim;
  const idVendedor = usuarioLogado?.tipo === 'Usuario padrao' && usuarioLogado?.idVendedor
    ? [String(usuarioLogado.idVendedor)]
    : normalizarListaFiltroPersistido(filtrosNormalizados.idVendedor);
  const idProduto = normalizarListaFiltroPersistido(filtrosNormalizados.idProduto);
  const idGrupo = normalizarListaFiltroPersistido(filtrosNormalizados.idGrupo);
  const idMarca = normalizarListaFiltroPersistido(filtrosNormalizados.idMarca);

  if (dataInicio <= dataFim) {
    return {
      dataInicio,
      dataFim,
      idVendedor,
      idProduto,
      idGrupo,
      idMarca
    };
  }

  return {
    dataInicio: dataFim,
    dataFim: dataInicio,
    idVendedor,
    idProduto,
    idGrupo,
    idMarca
  };
}

function obterValorTotalPedido(pedido) {
  const itens = Array.isArray(pedido?.itens) ? pedido.itens : [];
  return itens.reduce((total, item) => total + (Number(item?.valorTotal) || 0), 0);
}

function obterQuantidadeTotalPedido(pedido) {
  const itens = Array.isArray(pedido?.itens) ? pedido.itens : [];
  return itens.reduce((total, item) => total + (Number(item?.quantidade) || 0), 0);
}

function formatarQuantidade(valor) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: Number.isInteger(valor) ? 0 : 2,
    maximumFractionDigits: 2
  }).format(valor);
}
