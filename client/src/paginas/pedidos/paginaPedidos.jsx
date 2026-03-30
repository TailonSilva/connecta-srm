import { useEffect, useMemo, useState } from 'react';
import { AcoesRegistro } from '../../componentes/comuns/acoesRegistro';
import { Botao } from '../../componentes/comuns/botao';
import { CampoPesquisa } from '../../componentes/comuns/campoPesquisa';
import { CodigoRegistro } from '../../componentes/comuns/codigoRegistro';
import { GradePadrao } from '../../componentes/comuns/gradePadrao';
import { ModalFiltros } from '../../componentes/comuns/modalFiltros';
import { CorpoPagina } from '../../componentes/layout/corpoPagina';
import { listarClientes, listarContatos, listarVendedores } from '../../servicos/clientes';
import { listarCamposPedidoConfiguracao, listarEtapasPedidoConfiguracao, listarPrazosPagamentoConfiguracao } from '../../servicos/configuracoes';
import { listarEmpresas } from '../../servicos/empresa';
import { atualizarPedido, excluirPedido, incluirPedido, listarPedidos } from '../../servicos/pedidos';
import { listarProdutos } from '../../servicos/produtos';
import { listarUsuarios } from '../../servicos/usuarios';
import { normalizarPreco } from '../../utilitarios/normalizarPreco';
import { ModalPedido } from './modalPedido';

function criarFiltrosIniciaisPedidos() {
  return {
    idCliente: '',
    idUsuario: '',
    idVendedor: '',
    idEtapaPedido: ''
  };
}

function normalizarEtapasPedido(etapasPedido) {
  if (!Array.isArray(etapasPedido)) {
    return [];
  }

  return etapasPedido.map((etapa) => ({
    ...etapa,
    idEtapaPedido: etapa.idEtapaPedido ?? etapa.idEtapa
  }));
}

export function PaginaPedidos({ usuarioLogado }) {
  const [pesquisa, definirPesquisa] = useState('');
  const [filtros, definirFiltros] = useState(criarFiltrosIniciaisPedidos);
  const [pedidos, definirPedidos] = useState([]);
  const [clientes, definirClientes] = useState([]);
  const [contatos, definirContatos] = useState([]);
  const [usuarios, definirUsuarios] = useState([]);
  const [vendedores, definirVendedores] = useState([]);
  const [prazosPagamento, definirPrazosPagamento] = useState([]);
  const [produtos, definirProdutos] = useState([]);
  const [camposPedido, definirCamposPedido] = useState([]);
  const [etapasPedido, definirEtapasPedido] = useState([]);
  const [empresa, definirEmpresa] = useState(null);
  const [carregando, definirCarregando] = useState(true);
  const [mensagemErro, definirMensagemErro] = useState('');
  const [pedidoSelecionado, definirPedidoSelecionado] = useState(null);
  const [modoModal, definirModoModal] = useState('consulta');
  const [modalAberto, definirModalAberto] = useState(false);
  const [modalFiltrosAberto, definirModalFiltrosAberto] = useState(false);
  const [pedidoExclusaoPendente, definirPedidoExclusaoPendente] = useState(null);
  const permitirExcluir = usuarioLogado?.tipo !== 'Usuario padrao';

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    definirCarregando(true);
    definirMensagemErro('');

    try {
      const [
        pedidosCarregados,
        etapasCarregadas,
        clientesCarregados,
        contatosCarregados,
        usuariosCarregados,
        vendedoresCarregados,
        prazosCarregados,
        produtosCarregados,
        camposCarregados,
        empresasCarregadas
      ] = await Promise.all([
        listarPedidos(),
        listarEtapasPedidoConfiguracao(),
        listarClientes(),
        listarContatos(),
        listarUsuarios(),
        listarVendedores(),
        listarPrazosPagamentoConfiguracao(),
        listarProdutos(),
        listarCamposPedidoConfiguracao(),
        listarEmpresas()
      ]);

      const etapasNormalizadas = normalizarEtapasPedido(etapasCarregadas);

      definirPedidos(enriquecerPedidos(pedidosCarregados, etapasNormalizadas));
      definirEtapasPedido(etapasNormalizadas);
      definirClientes(clientesCarregados);
      definirContatos(contatosCarregados);
      definirUsuarios(usuariosCarregados);
      definirVendedores(vendedoresCarregados);
      definirPrazosPagamento(prazosCarregados);
      definirProdutos(produtosCarregados);
      definirCamposPedido(camposCarregados);
      definirEmpresa(empresasCarregadas[0] || null);
    } catch (_erro) {
      definirMensagemErro('Nao foi possivel carregar os pedidos.');
    } finally {
      definirCarregando(false);
    }
  }

  function abrirNovoPedido() {
    definirPedidoSelecionado(null);
    definirModoModal('novo');
    definirModalAberto(true);
  }

  function abrirConsultaPedido(pedido) {
    definirPedidoSelecionado(pedido);
    definirModoModal('consulta');
    definirModalAberto(true);
  }

  function abrirEdicaoPedido(pedido) {
    definirPedidoSelecionado(pedido);
    definirModoModal('edicao');
    definirModalAberto(true);
  }

  function fecharModal() {
    definirPedidoSelecionado(null);
    definirModoModal('consulta');
    definirModalAberto(false);
  }

  async function salvarPedido(dadosPedido) {
    const payload = normalizarPayloadPedido(dadosPedido);

    if (pedidoSelecionado?.idPedido) {
      await atualizarPedido(pedidoSelecionado.idPedido, payload);
    } else {
      await incluirPedido(payload);
    }

    await carregarDados();
    fecharModal();
  }

  function abrirExclusaoPedido(pedido) {
    if (!permitirExcluir) {
      return;
    }

    definirPedidoExclusaoPendente(pedido);
  }

  function cancelarExclusaoPedido() {
    definirPedidoExclusaoPendente(null);
  }

  async function confirmarExclusaoPedido() {
    if (!pedidoExclusaoPendente) {
      return;
    }

    await excluirPedido(pedidoExclusaoPendente.idPedido);
    definirPedidoExclusaoPendente(null);
    await carregarDados();
  }

  const pedidosFiltrados = useMemo(
    () => filtrarPedidos(pedidos, pesquisa, filtros),
    [pedidos, pesquisa, filtros]
  );
  const filtrosAtivos = JSON.stringify(filtros) !== JSON.stringify(criarFiltrosIniciaisPedidos());

  return (
    <>
      <header className="cabecalhoPagina">
        <div>
          <h1>Pedidos</h1>
          <p>Acompanhe os pedidos gerados a partir das propostas comerciais do CRM.</p>
        </div>

        <div className="acoesCabecalhoPagina">
          <CampoPesquisa
            valor={pesquisa}
            aoAlterar={definirPesquisa}
            placeholder="Pesquisar pedidos"
            ariaLabel="Pesquisar pedidos"
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
            variante="primario"
            icone="adicionar"
            somenteIcone
            title="Novo pedido"
            aria-label="Novo pedido"
            onClick={abrirNovoPedido}
          />
        </div>
      </header>

      <CorpoPagina>
        <GradePadrao
          cabecalho={<CabecalhoGradePedidos />}
          carregando={carregando}
          mensagemErro={mensagemErro}
          temItens={pedidosFiltrados.length > 0}
          mensagemCarregando="Carregando pedidos..."
          mensagemVazia="Nenhum pedido encontrado."
        >
          {pedidosFiltrados.map((pedido) => (
            <LinhaPedido
              key={pedido.idPedido}
              pedido={pedido}
              permitirExcluir={permitirExcluir}
              aoConsultar={() => abrirConsultaPedido(pedido)}
              aoEditar={() => abrirEdicaoPedido(pedido)}
              aoExcluir={() => abrirExclusaoPedido(pedido)}
            />
          ))}
        </GradePadrao>
      </CorpoPagina>

      <ModalFiltros
        aberto={modalFiltrosAberto}
        titulo="Filtros de pedidos"
        filtros={filtros}
        campos={[
          {
            name: 'idCliente',
            label: 'Cliente',
            options: clientes.map((cliente) => ({
              valor: String(cliente.idCliente),
              label: cliente.nomeFantasia || cliente.razaoSocial
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
            name: 'idVendedor',
            label: 'Vendedor',
            options: vendedores.map((vendedor) => ({
              valor: String(vendedor.idVendedor),
              label: vendedor.nome
            }))
          },
          {
            name: 'idEtapaPedido',
            label: 'Etapa',
            options: etapasPedido.map((etapa) => ({
              valor: String(etapa.idEtapaPedido),
              label: etapa.descricao
            }))
          }
        ]}
        aoFechar={() => definirModalFiltrosAberto(false)}
        aoAplicar={(proximosFiltros) => {
          definirFiltros(proximosFiltros);
          definirModalFiltrosAberto(false);
        }}
        aoLimpar={() => definirFiltros(criarFiltrosIniciaisPedidos())}
      />

      <ModalPedido
        aberto={modalAberto}
        pedido={pedidoSelecionado}
        clientes={clientes}
        contatos={contatos}
        usuarios={usuarios}
        vendedores={vendedores}
        prazosPagamento={prazosPagamento}
        etapasPedido={etapasPedido}
        produtos={produtos}
        camposPedido={camposPedido}
        empresa={empresa}
        usuarioLogado={usuarioLogado}
        modo={modoModal}
        aoFechar={fecharModal}
        aoSalvar={salvarPedido}
      />

      {pedidoExclusaoPendente ? (
        <div className="camadaConfirmacaoModal" role="presentation" onMouseDown={cancelarExclusaoPedido}>
          <div
            className="modalConfirmacaoAgenda"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="tituloConfirmacaoExclusaoPedido"
            onMouseDown={(evento) => evento.stopPropagation()}
          >
            <div className="cabecalhoConfirmacaoModal">
              <h4 id="tituloConfirmacaoExclusaoPedido">Excluir pedido</h4>
            </div>

            <div className="corpoConfirmacaoModal">
              <p>Tem certeza que deseja excluir este pedido?</p>
            </div>

            <div className="acoesConfirmacaoModal">
              <Botao variante="secundario" type="button" onClick={cancelarExclusaoPedido}>
                Nao
              </Botao>
              <Botao variante="perigo" type="button" onClick={confirmarExclusaoPedido}>
                Sim
              </Botao>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function CabecalhoGradePedidos() {
  return (
    <tr className="cabecalhoGradePedidos">
      <th>Codigo</th>
      <th>Cliente</th>
      <th>Etapa</th>
      <th>Vendedor</th>
      <th>Total</th>
      <th>Acoes</th>
    </tr>
  );
}

function LinhaPedido({ pedido, permitirExcluir, aoConsultar, aoEditar, aoExcluir }) {
  return (
    <tr className="linhaPedido">
      <td>
        <CodigoRegistro valor={pedido.idPedido} />
      </td>
      <td>
        <div className="celulaRegistroDetalhes">
          <div className="topoRegistroDetalhes">
            <strong>{pedido.nomeClienteSnapshot || 'Nao informado'}</strong>
          </div>
          <span className="textoSecundarioRegistro">{pedido.nomeContatoSnapshot || 'Sem contato'}</span>
        </div>
      </td>
      <td>
        {pedido.nomeEtapaPedidoSnapshot ? (
          <span
            className="etiquetaEtapaOrcamento"
            style={criarEstiloEtapaPedido(pedido.corEtapaPedido)}
          >
            {pedido.nomeEtapaPedidoSnapshot}
          </span>
        ) : (
          <span className="textoSecundarioRegistro">Sem etapa</span>
        )}
      </td>
      <td>{pedido.nomeVendedorSnapshot || 'Nao informado'}</td>
      <td>{normalizarPreco(pedido.totalPedido)}</td>
      <td>
        <AcoesRegistro
          rotuloConsulta="Consultar pedido"
          rotuloEdicao="Editar pedido"
          rotuloInativacao="Excluir pedido"
          iconeInativacao="limpar"
          exibirInativacao={permitirExcluir}
          aoConsultar={aoConsultar}
          aoEditar={aoEditar}
          aoInativar={aoExcluir}
        />
      </td>
    </tr>
  );
}

function enriquecerPedidos(pedidos, etapasPedido) {
  const etapasPorId = new Map(
    etapasPedido.map((etapa) => [etapa.idEtapaPedido, etapa])
  );

  return pedidos.map((pedido) => ({
    ...pedido,
    totalPedido: Array.isArray(pedido.itens)
      ? pedido.itens.reduce((total, item) => total + (Number(item.valorTotal) || 0), 0)
      : 0,
    nomeEtapaPedidoSnapshot:
      pedido.nomeEtapaPedidoSnapshot
      || etapasPorId.get(pedido.idEtapaPedido)?.descricao
      || '',
    corEtapaPedido: etapasPorId.get(pedido.idEtapaPedido)?.cor || ''
  }));
}

function filtrarPedidos(pedidos, pesquisa, filtros) {
  const termo = String(pesquisa || '').trim().toLowerCase();

  return pedidos.filter((pedido) => {
    const atendePesquisa = !termo || [
      pedido.nomeClienteSnapshot,
      pedido.nomeContatoSnapshot,
      pedido.nomeUsuarioSnapshot,
      pedido.nomeVendedorSnapshot,
      pedido.nomePrazoPagamentoSnapshot,
      pedido.nomeEtapaPedidoSnapshot,
      pedido.observacao,
      pedido.codigoOrcamentoOrigem
    ].some((valor) => String(valor || '').toLowerCase().includes(termo));

    const atendeFiltros = (
      (!filtros.idCliente || String(pedido.idCliente) === String(filtros.idCliente))
      && (!filtros.idUsuario || String(pedido.idUsuario) === String(filtros.idUsuario))
      && (!filtros.idVendedor || String(pedido.idVendedor) === String(filtros.idVendedor))
      && (!filtros.idEtapaPedido || String(pedido.idEtapaPedido) === String(filtros.idEtapaPedido))
    );

    return atendePesquisa && atendeFiltros;
  });
}

function normalizarPayloadPedido(dadosPedido) {
  return {
    idOrcamento: dadosPedido.idOrcamento ? Number(dadosPedido.idOrcamento) : null,
    idCliente: dadosPedido.idCliente ? Number(dadosPedido.idCliente) : null,
    idContato: dadosPedido.idContato ? Number(dadosPedido.idContato) : null,
    idUsuario: dadosPedido.idUsuario ? Number(dadosPedido.idUsuario) : null,
    idVendedor: dadosPedido.idVendedor ? Number(dadosPedido.idVendedor) : null,
    idPrazoPagamento: dadosPedido.idPrazoPagamento ? Number(dadosPedido.idPrazoPagamento) : null,
    idEtapaPedido: dadosPedido.idEtapaPedido ? Number(dadosPedido.idEtapaPedido) : null,
    comissao: normalizarNumeroDecimal(dadosPedido.comissao),
    dataInclusao: limparTextoOpcional(dadosPedido.dataInclusao),
    dataEntrega: limparTextoOpcional(dadosPedido.dataEntrega),
    dataValidade: limparTextoOpcional(dadosPedido.dataValidade),
    observacao: limparTextoOpcional(dadosPedido.observacao),
    codigoOrcamentoOrigem: dadosPedido.codigoOrcamentoOrigem ? Number(dadosPedido.codigoOrcamentoOrigem) : null,
    nomeClienteSnapshot: limparTextoOpcional(dadosPedido.nomeClienteSnapshot),
    nomeContatoSnapshot: limparTextoOpcional(dadosPedido.nomeContatoSnapshot),
    nomeUsuarioSnapshot: limparTextoOpcional(dadosPedido.nomeUsuarioSnapshot),
    nomeVendedorSnapshot: limparTextoOpcional(dadosPedido.nomeVendedorSnapshot),
    nomeMetodoPagamentoSnapshot: limparTextoOpcional(dadosPedido.nomeMetodoPagamentoSnapshot),
    nomePrazoPagamentoSnapshot: limparTextoOpcional(dadosPedido.nomePrazoPagamentoSnapshot),
    nomeEtapaPedidoSnapshot: limparTextoOpcional(dadosPedido.nomeEtapaPedidoSnapshot),
    itens: Array.isArray(dadosPedido.itens) ? dadosPedido.itens.map((item) => ({
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
    camposExtras: Array.isArray(dadosPedido.camposExtras) ? dadosPedido.camposExtras.map((campo) => ({
      idCampoPedido: campo.idCampoPedido ? Number(campo.idCampoPedido) : null,
      tituloSnapshot: limparTextoOpcional(campo.tituloSnapshot || campo.titulo),
      valor: limparTextoOpcional(campo.valor)
    })) : []
  };
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

function criarEstiloEtapaPedido(cor) {
  const corBase = normalizarCorHexadecimal(cor || '#1791e2');

  return {
    background: converterHexParaRgba(corBase, 0.22),
    color: escurecerCorHexadecimal(corBase, 0.18)
  };
}

function normalizarCorHexadecimal(cor) {
  const texto = String(cor || '').trim();
  return /^#([0-9a-fA-F]{6})$/.test(texto) ? texto : '#1791e2';
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
