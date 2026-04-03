import { useEffect, useState } from 'react';
import { CabecalhoProdutos } from './cabecalhoProdutos';
import { CorpoProdutos } from './corpoProdutos';
import {
  atualizarProduto,
  incluirProduto,
  listarGruposProduto,
  listarMarcas,
  listarProdutos,
  listarUnidadesMedida
} from '../../servicos/produtos';
import {
  atualizarGrupoProduto,
  atualizarMarca,
  atualizarUnidadeMedida,
  incluirGrupoProduto,
  incluirMarca,
  incluirUnidadeMedida
} from '../../servicos/configuracoes';
import { filtrarProdutos } from '../../utilitarios/filtrarProdutos';
import { converterPrecoParaNumero } from '../../utilitarios/normalizarPreco';
import { obterPrimeiroCodigoDisponivel } from '../../utilitarios/obterPrimeiroCodigoDisponivel';
import { normalizarFiltrosPorPadrao, useFiltrosPersistidos } from '../../utilitarios/useFiltrosPersistidos';
import { ModalFiltros } from '../../componentes/comuns/modalFiltros';
import { ModalProduto } from './modalProduto';
import { ModalManualProdutos } from './modalManualProdutos';

const filtrosIniciaisProdutos = {
  idGrupo: '',
  idMarca: '',
  idUnidade: '',
  status: ''
};

export function PaginaProdutos({ usuarioLogado }) {
  const [pesquisa, definirPesquisa] = useState('');
  const [filtros, definirFiltros] = useFiltrosPersistidos({
    chave: 'paginaProdutos',
    usuario: usuarioLogado,
    filtrosPadrao: filtrosIniciaisProdutos,
    normalizarFiltros: normalizarFiltrosProdutos
  });
  const [produtos, definirProdutos] = useState([]);
  const [gruposProduto, definirGruposProduto] = useState([]);
  const [marcas, definirMarcas] = useState([]);
  const [unidadesMedida, definirUnidadesMedida] = useState([]);
  const [carregando, definirCarregando] = useState(true);
  const [mensagemErro, definirMensagemErro] = useState('');
  const [modalAberto, definirModalAberto] = useState(false);
  const [modalManualAberto, definirModalManualAberto] = useState(false);
  const [modalFiltrosAberto, definirModalFiltrosAberto] = useState(false);
  const [produtoSelecionado, definirProdutoSelecionado] = useState(null);
  const [modoModalProduto, definirModoModalProduto] = useState('novo');
  const usuarioSomenteConsulta = usuarioLogado?.tipo === 'Usuario padrao';

  useEffect(() => {
    carregarDados();
  }, []);

  useEffect(() => {
    function tratarAtalhosProdutos(evento) {
      if (evento.key !== 'F1') {
        return;
      }

      evento.preventDefault();

      if (!modalAberto && !modalManualAberto && !modalFiltrosAberto) {
        definirModalManualAberto(true);
      }
    }

    window.addEventListener('keydown', tratarAtalhosProdutos);

    return () => {
      window.removeEventListener('keydown', tratarAtalhosProdutos);
    };
  }, [modalAberto, modalManualAberto, modalFiltrosAberto]);

  async function carregarDados() {
    definirCarregando(true);
    definirMensagemErro('');

    try {
      const [
        produtosCarregados,
        gruposCarregados,
        marcasCarregadas,
        unidadesCarregadas
      ] = await Promise.all([
        listarProdutos(),
        listarGruposProduto(),
        listarMarcas(),
        listarUnidadesMedida()
      ]);

      definirProdutos(
        enriquecerProdutos(
          produtosCarregados,
          gruposCarregados,
          marcasCarregadas,
          unidadesCarregadas
        )
      );
      definirGruposProduto(gruposCarregados);
      definirMarcas(marcasCarregadas);
      definirUnidadesMedida(unidadesCarregadas);
    } catch (erro) {
      definirMensagemErro('Nao foi possivel carregar os produtos.');
    } finally {
      definirCarregando(false);
    }
  }

  async function salvarProduto(dadosProduto) {
    const payload = normalizarPayloadProduto({
      ...dadosProduto,
      idProduto: produtoSelecionado?.idProduto || proximoCodigoProduto
    });

    if (modoModalProduto === 'edicao' && produtoSelecionado?.idProduto) {
      await atualizarProduto(produtoSelecionado.idProduto, payload);
    } else {
      await incluirProduto(payload);
    }

    await carregarDados();
    fecharModalProduto();
  }

  async function inativarProduto(produto) {
    if (usuarioSomenteConsulta) {
      return;
    }

    await atualizarProduto(produto.idProduto, { status: 0 });
    await carregarDados();
  }

  async function salvarGrupoProduto(dadosGrupo) {
    const payload = {
      descricao: dadosGrupo.descricao.trim(),
      status: dadosGrupo.status ? 1 : 0
    };

    let grupoSalvo = null;

    if (dadosGrupo.idGrupo) {
      await atualizarGrupoProduto(dadosGrupo.idGrupo, payload);
      grupoSalvo = { idGrupo: Number(dadosGrupo.idGrupo), ...payload };
    } else {
      grupoSalvo = await incluirGrupoProduto(payload);
    }

    await carregarDados();
    return grupoSalvo;
  }

  async function inativarGrupoProdutoRegistro(registro) {
    await atualizarGrupoProduto(registro.idGrupo, { status: 0 });
    await carregarDados();
  }

  async function salvarMarca(dadosMarca) {
    const payload = {
      descricao: dadosMarca.descricao.trim(),
      status: dadosMarca.status ? 1 : 0
    };

    let marcaSalva = null;

    if (dadosMarca.idMarca) {
      await atualizarMarca(dadosMarca.idMarca, payload);
      marcaSalva = { idMarca: Number(dadosMarca.idMarca), ...payload };
    } else {
      marcaSalva = await incluirMarca(payload);
    }

    await carregarDados();
    return marcaSalva;
  }

  async function inativarMarcaRegistro(registro) {
    await atualizarMarca(registro.idMarca, { status: 0 });
    await carregarDados();
  }

  async function salvarUnidadeMedida(dadosUnidade) {
    const payload = {
      descricao: dadosUnidade.descricao.trim(),
      status: dadosUnidade.status ? 1 : 0
    };

    let unidadeSalva = null;

    if (dadosUnidade.idUnidade) {
      await atualizarUnidadeMedida(dadosUnidade.idUnidade, payload);
      unidadeSalva = { idUnidade: Number(dadosUnidade.idUnidade), ...payload };
    } else {
      unidadeSalva = await incluirUnidadeMedida(payload);
    }

    await carregarDados();
    return unidadeSalva;
  }

  async function inativarUnidadeMedidaRegistro(registro) {
    await atualizarUnidadeMedida(registro.idUnidade, { status: 0 });
    await carregarDados();
  }

  function abrirNovoProduto() {
    if (usuarioSomenteConsulta) {
      return;
    }

    definirProdutoSelecionado(null);
    definirModoModalProduto('novo');
    definirModalAberto(true);
  }

  function abrirEdicaoProduto(produto) {
    if (usuarioSomenteConsulta) {
      abrirConsultaProduto(produto);
      return;
    }

    definirProdutoSelecionado(produto);
    definirModoModalProduto('edicao');
    definirModalAberto(true);
  }

  function abrirConsultaProduto(produto) {
    definirProdutoSelecionado(produto);
    definirModoModalProduto('consulta');
    definirModalAberto(true);
  }

  function fecharModalProduto() {
    definirModalAberto(false);
    definirProdutoSelecionado(null);
    definirModoModalProduto('novo');
  }

  const produtosFiltrados = filtrarProdutos(produtos, pesquisa, filtros);
  const proximoCodigoProduto = obterPrimeiroCodigoDisponivel(produtos, 'idProduto');
  const filtrosAtivos = Object.values(filtros).some(Boolean);

  return (
    <>
      <CabecalhoProdutos
        pesquisa={pesquisa}
        aoAlterarPesquisa={definirPesquisa}
        aoAbrirFiltros={() => definirModalFiltrosAberto(true)}
        aoNovoProduto={abrirNovoProduto}
        filtrosAtivos={filtrosAtivos}
        somenteConsulta={usuarioSomenteConsulta}
      />
      <CorpoProdutos
        produtos={produtosFiltrados}
        carregando={carregando}
        mensagemErro={mensagemErro}
        aoConsultarProduto={abrirConsultaProduto}
        aoEditarProduto={abrirEdicaoProduto}
        aoInativarProduto={inativarProduto}
        somenteConsulta={usuarioSomenteConsulta}
      />
      <ModalFiltros
        aberto={modalFiltrosAberto}
        titulo="Filtros de produtos"
        filtros={filtros}
        campos={[
          {
            name: 'idGrupo',
            label: 'Grupo',
            options: gruposProduto.map((grupo) => ({
              valor: String(grupo.idGrupo),
              label: grupo.descricao
            }))
          },
          {
            name: 'idMarca',
            label: 'Marca',
            options: marcas.map((marca) => ({
              valor: String(marca.idMarca),
              label: marca.descricao
            }))
          },
          {
            name: 'idUnidade',
            label: 'Unidade',
            options: unidadesMedida.map((unidade) => ({
              valor: String(unidade.idUnidade),
              label: unidade.descricao
            }))
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
        aoLimpar={() => definirFiltros(filtrosIniciaisProdutos)}
      />
      <ModalProduto
        aberto={modalAberto}
        produto={produtoSelecionado}
        codigoSugerido={proximoCodigoProduto}
        gruposProduto={gruposProduto}
        marcas={marcas}
        unidadesMedida={unidadesMedida}
        modo={modoModalProduto}
        somenteConsultaGrupos={usuarioSomenteConsulta}
        aoSalvarGrupoProduto={salvarGrupoProduto}
        aoInativarGrupoProduto={inativarGrupoProdutoRegistro}
        somenteConsultaMarcas={usuarioSomenteConsulta}
        aoSalvarMarca={salvarMarca}
        aoInativarMarca={inativarMarcaRegistro}
        somenteConsultaUnidades={usuarioSomenteConsulta}
        aoSalvarUnidadeMedida={salvarUnidadeMedida}
        aoInativarUnidadeMedida={inativarUnidadeMedidaRegistro}
        aoFechar={fecharModalProduto}
        aoSalvar={salvarProduto}
      />
      <ModalManualProdutos
        aberto={modalManualAberto}
        aoFechar={() => definirModalManualAberto(false)}
        produtos={produtosFiltrados}
        gruposProduto={gruposProduto}
        marcas={marcas}
        unidadesMedida={unidadesMedida}
        filtros={filtros}
        usuarioLogado={usuarioLogado}
      />
    </>
  );
}

function normalizarFiltrosProdutos(filtros, filtrosPadrao) {
  return normalizarFiltrosPorPadrao(filtros, filtrosPadrao);
}

function enriquecerProdutos(produtos, grupos, marcas, unidades) {
  const gruposPorId = new Map(
    grupos.map((grupo) => [grupo.idGrupo, grupo.descricao])
  );
  const marcasPorId = new Map(
    marcas.map((marca) => [marca.idMarca, marca.descricao])
  );
  const unidadesPorId = new Map(
    unidades.map((unidade) => [unidade.idUnidade, unidade.descricao])
  );

  return produtos.map((produto) => ({
    ...produto,
    nomeGrupo: gruposPorId.get(produto.idGrupo) || 'Nao informado',
    nomeMarca: marcasPorId.get(produto.idMarca) || 'Nao informado',
    nomeUnidade: unidadesPorId.get(produto.idUnidade) || 'Nao informado'
  }));
}

function normalizarPayloadProduto(dadosProduto) {
  const payload = {
    referencia: dadosProduto.referencia.trim(),
    descricao: dadosProduto.descricao.trim(),
    idGrupo: Number(dadosProduto.idGrupo),
    idMarca: Number(dadosProduto.idMarca),
    idUnidade: Number(dadosProduto.idUnidade),
    preco: converterPrecoParaNumero(dadosProduto.preco) || 0,
    imagem: limparTextoOpcional(dadosProduto.imagem),
    status: dadosProduto.status ? 1 : 0
  };

  if (dadosProduto.idProduto) {
    payload.idProduto = Number(dadosProduto.idProduto);
  }

  return payload;
}

function limparTextoOpcional(valor) {
  const texto = String(valor || '').trim();
  return texto || null;
}
