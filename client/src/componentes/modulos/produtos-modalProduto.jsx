import { useEffect, useMemo, useState } from 'react';
import { Botao } from '../comuns/botao';
import { MensagemErroPopup } from '../comuns/mensagemErroPopup';
import { CampoImagemPadrao } from '../comuns/campoImagemPadrao';
import { CodigoRegistro } from '../comuns/codigoRegistro';
import { ModalFiltros } from '../comuns/modalFiltros';
import { listarClientes, listarContatos, listarVendedores } from '../../servicos/clientes';
import { listarEtapasPedidoConfiguracao, listarPrazosPagamentoConfiguracao } from '../../servicos/configuracoes';
import { listarEmpresas } from '../../servicos/empresa';
import { ModalPedido } from './pedidos-modalPedido';
import { listarPedidos } from '../../servicos/pedidos';
import { ModalHistoricoVendasProduto } from './produtos-modalHistoricoVendasProduto';
import { ModalGruposProduto } from './configuracoes-modalGruposProduto';
import { ModalMarcas } from './configuracoes-modalMarcas';
import { ModalUnidadesMedida } from './configuracoes-modalUnidadesMedida';
import { listarUsuarios } from '../../servicos/usuarios';
import {
  desformatarPreco,
  normalizarPreco,
  normalizarPrecoDigitado
} from '../../utilitarios/normalizarPreco';
import { normalizarValorEntradaFormulario } from '../../utilitarios/normalizarTextoFormulario';

const abasModalProduto = [
  { id: 'dadosGerais', label: 'Dados gerais' },
  { id: 'vendas', label: 'Vendas', abreModal: 'vendas' }
];

const estadoInicialFormulario = {
  referencia: '',
  descricao: '',
  idGrupo: '',
  idMarca: '',
  idUnidade: '',
  preco: '',
  imagem: '',
  status: true
};

export function ModalProduto({
  aberto,
  produto,
  codigoSugerido,
  gruposProduto,
  marcas,
  unidadesMedida,
  modo = 'novo',
  somenteConsultaGrupos = false,
  aoSalvarGrupoProduto,
  aoInativarGrupoProduto,
  somenteConsultaMarcas = false,
  aoSalvarMarca,
  aoInativarMarca,
  somenteConsultaUnidades = false,
  aoSalvarUnidadeMedida,
  aoInativarUnidadeMedida,
  aoFechar,
  aoSalvar
}) {
  const [formulario, definirFormulario] = useState(estadoInicialFormulario);
  const [abaAtiva, definirAbaAtiva] = useState(abasModalProduto[0].id);
  const [salvando, definirSalvando] = useState(false);
  const [mensagemErro, definirMensagemErro] = useState('');
  const [confirmandoSaida, definirConfirmandoSaida] = useState(false);
  const [modalGruposProdutoAberto, definirModalGruposProdutoAberto] = useState(false);
  const [modalMarcasAberto, definirModalMarcasAberto] = useState(false);
  const [modalUnidadesAberto, definirModalUnidadesAberto] = useState(false);
  const [clientesPedidos, definirClientesPedidos] = useState([]);
  const [contatosPedidos, definirContatosPedidos] = useState([]);
  const [usuariosHistorico, definirUsuariosHistorico] = useState([]);
  const [vendedoresHistorico, definirVendedoresHistorico] = useState([]);
  const [prazosPagamentoPedidos, definirPrazosPagamentoPedidos] = useState([]);
  const [etapasPedido, definirEtapasPedido] = useState([]);
  const [empresaPedidos, definirEmpresaPedidos] = useState(null);
  const [pedidosProduto, definirPedidosProduto] = useState([]);
  const [carregandoPedidos, definirCarregandoPedidos] = useState(false);
  const [mensagemErroPedidos, definirMensagemErroPedidos] = useState('');
  const [modalHistoricoVendasAberto, definirModalHistoricoVendasAberto] = useState(false);
  const [modalFiltrosPedidosAberto, definirModalFiltrosPedidosAberto] = useState(false);
  const [pedidoSelecionado, definirPedidoSelecionado] = useState(null);
  const [modalPedidoAberto, definirModalPedidoAberto] = useState(false);
  const [filtrosPedidos, definirFiltrosPedidos] = useState(criarFiltrosIniciaisVendasProduto());
  const [pesquisaRapidaVendas, definirPesquisaRapidaVendas] = useState('');
  const somenteLeitura = modo === 'consulta';
  const modoInclusao = !produto;
  const gruposAtivos = gruposProduto.filter((grupo) => grupo.status !== 0);
  const marcasAtivas = marcas.filter((marca) => marca.status !== 0);
  const unidadesAtivas = unidadesMedida.filter((unidade) => unidade.status !== 0);

  useEffect(() => {
    if (!aberto) {
      return;
    }

    definirFormulario(criarFormularioProduto(produto));
    definirAbaAtiva(abasModalProduto[0].id);
    definirSalvando(false);
    definirMensagemErro('');
    definirConfirmandoSaida(false);
    definirModalGruposProdutoAberto(false);
    definirModalMarcasAberto(false);
    definirModalUnidadesAberto(false);
    definirModalHistoricoVendasAberto(false);
    definirModalFiltrosPedidosAberto(false);
    definirPedidoSelecionado(null);
    definirModalPedidoAberto(false);
    definirFiltrosPedidos(criarFiltrosIniciaisVendasProduto());
    definirPesquisaRapidaVendas('');
  }, [aberto, produto]);

  useEffect(() => {
    if (!aberto || !produto?.idProduto) {
      return;
    }

    let cancelado = false;

    async function carregarHistoricoProduto() {
      definirCarregandoPedidos(true);
      definirMensagemErroPedidos('');

      try {
        const resultados = await Promise.allSettled([
          listarPedidos(),
          listarClientes(),
          listarContatos(),
          listarUsuarios(),
          listarVendedores(),
          listarPrazosPagamentoConfiguracao(),
          listarEtapasPedidoConfiguracao(),
          listarEmpresas()
        ]);

        if (cancelado) {
          return;
        }

        const [
          pedidosResultado,
          clientesResultado,
          contatosResultado,
          usuariosResultado,
          vendedoresResultado,
          prazosResultado,
          etapasResultado,
          empresasResultado
        ] = resultados;

        const pedidosCarregados = pedidosResultado.status === 'fulfilled' ? pedidosResultado.value : [];
        const clientesCarregados = clientesResultado.status === 'fulfilled' ? clientesResultado.value : [];
        const contatosCarregados = contatosResultado.status === 'fulfilled' ? contatosResultado.value : [];
        const usuariosCarregados = usuariosResultado.status === 'fulfilled' ? usuariosResultado.value : [];
        const vendedoresCarregados = vendedoresResultado.status === 'fulfilled' ? vendedoresResultado.value : [];
        const prazosCarregados = prazosResultado.status === 'fulfilled' ? prazosResultado.value : [];
        const etapasCarregadas = etapasResultado.status === 'fulfilled' ? etapasResultado.value : [];
        const empresasCarregadas = empresasResultado.status === 'fulfilled' ? empresasResultado.value : [];

        definirClientesPedidos(clientesCarregados);
        definirContatosPedidos(contatosCarregados);
        definirUsuariosHistorico(usuariosCarregados);
        definirVendedoresHistorico(vendedoresCarregados);
        definirPrazosPagamentoPedidos(prazosCarregados);
        definirEtapasPedido(normalizarEtapasPedidoHistorico(etapasCarregadas));
        definirEmpresaPedidos(empresasCarregadas[0] || null);
        definirPedidosProduto(
          enriquecerPedidosProduto(
            pedidosCarregados,
            produto.idProduto,
            clientesCarregados,
            vendedoresCarregados,
            etapasCarregadas
          )
        );
      } catch (_erro) {
        if (!cancelado) {
          definirMensagemErroPedidos('Nao foi possivel carregar as vendas deste produto.');
        }
      } finally {
        if (!cancelado) {
          definirCarregandoPedidos(false);
        }
      }
    }

    carregarHistoricoProduto();

    return () => {
      cancelado = true;
    };
  }, [aberto, produto?.idProduto]);

  useEffect(() => {
    if (!aberto) {
      return undefined;
    }

    function tratarTecla(evento) {
      if (evento.key === 'Escape' && !salvando) {
        tentarFecharModal();
      }
    }

    window.addEventListener('keydown', tratarTecla);

    return () => {
      window.removeEventListener('keydown', tratarTecla);
    };
  }, [aberto, aoFechar, salvando]);

  async function submeterFormulario(evento) {
    evento.preventDefault();

    if (somenteLeitura) {
      return;
    }

    const camposObrigatorios = [
      ['referencia', 'Informe a referencia do produto.'],
      ['descricao', 'Informe a descricao do produto.'],
      ['idGrupo', 'Selecione um grupo.'],
      ['idMarca', 'Selecione uma marca.'],
      ['idUnidade', 'Selecione uma unidade.'],
      ['preco', 'Informe o preco do produto.']
    ];

    const mensagemValidacao = camposObrigatorios.find(([campo]) => {
      const valor = formulario[campo];
      return valor === '' || valor === null || valor === undefined;
    });

    if (mensagemValidacao) {
      definirMensagemErro(mensagemValidacao[1]);
      return;
    }

    definirSalvando(true);
    definirMensagemErro('');

    try {
      await aoSalvar(formulario);
    } catch (erro) {
      definirMensagemErro(erro.message || 'Nao foi possivel salvar o produto.');
      definirSalvando(false);
    }
  }

  function alterarCampo(evento) {
    const { name, value, type, checked } = evento.target;
    const valorNormalizado = normalizarValorEntradaFormulario(evento);

    definirFormulario((estadoAtual) => ({
      ...estadoAtual,
      [name]: type === 'checkbox'
        ? checked
        : name === 'preco' ? normalizarPrecoDigitado(value) : valorNormalizado
    }));
  }

  function tratarFocoPreco() {
    definirFormulario((estadoAtual) => ({
      ...estadoAtual,
      preco: desformatarPreco(estadoAtual.preco)
    }));
  }

  function tratarDesfoquePreco() {
    definirFormulario((estadoAtual) => ({
      ...estadoAtual,
      preco: estadoAtual.preco ? normalizarPreco(estadoAtual.preco) : ''
    }));
  }

  function fecharAoClicarNoFundo(evento) {
    if (evento.target === evento.currentTarget && !salvando) {
      tentarFecharModal();
    }
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

  function abrirModalGruposProduto() {
    if (somenteLeitura || typeof aoSalvarGrupoProduto !== 'function') {
      return;
    }

    definirModalGruposProdutoAberto(true);
    definirMensagemErro('');
  }

  function fecharModalGruposProduto() {
    definirModalGruposProdutoAberto(false);
  }

  function selecionarGrupo(registro) {
    definirFormulario((estadoAtual) => ({
      ...estadoAtual,
      idGrupo: String(registro?.idGrupo || estadoAtual.idGrupo || '')
    }));
  }

  function abrirModalMarcas() {
    if (somenteLeitura || typeof aoSalvarMarca !== 'function') {
      return;
    }

    definirModalMarcasAberto(true);
    definirMensagemErro('');
  }

  function fecharModalMarcas() {
    definirModalMarcasAberto(false);
  }

  function selecionarMarca(registro) {
    definirFormulario((estadoAtual) => ({
      ...estadoAtual,
      idMarca: String(registro?.idMarca || estadoAtual.idMarca || '')
    }));
  }

  function abrirModalUnidades() {
    if (somenteLeitura || typeof aoSalvarUnidadeMedida !== 'function') {
      return;
    }

    definirModalUnidadesAberto(true);
    definirMensagemErro('');
  }

  function fecharModalUnidades() {
    definirModalUnidadesAberto(false);
  }

  function selecionarUnidade(registro) {
    definirFormulario((estadoAtual) => ({
      ...estadoAtual,
      idUnidade: String(registro?.idUnidade || estadoAtual.idUnidade || '')
    }));
  }

  function abrirModalHistoricoVendas() {
    definirModalHistoricoVendasAberto(true);
  }

  function fecharModalHistoricoVendas() {
    definirModalHistoricoVendasAberto(false);
  }

  function consultarPedido(pedido) {
    definirPedidoSelecionado(pedido);
    definirModalPedidoAberto(true);
  }

  function fecharModalPedido() {
    definirPedidoSelecionado(null);
    definirModalPedidoAberto(false);
  }

  function selecionarAbaProduto(aba) {
    if (aba.abreModal === 'vendas') {
      abrirModalHistoricoVendas();
      return;
    }

    definirAbaAtiva(aba.id);
  }

  const itensPedidosFiltrados = useMemo(
    () => filtrarItensPedidosDigitacaoProduto(
      criarItensPedidosProduto(pedidosProduto, produto?.idProduto, filtrosPedidos),
      pesquisaRapidaVendas
    ),
    [pedidosProduto, produto?.idProduto, filtrosPedidos, pesquisaRapidaVendas]
  );
  const produtosConsultaPedido = useMemo(
    () => (produto ? [produto] : []),
    [produto]
  );
  const filtrosPedidosAtivos = filtrosHistoricoEstaoAtivos(filtrosPedidos, criarFiltrosIniciaisVendasProduto());

  if (!aberto) {
    return null;
  }

  return (
    <>
      <div className="camadaModal" role="presentation" onMouseDown={fecharAoClicarNoFundo}>
        <form
          className="modalCliente modalClienteComAbas"
          role="dialog"
          aria-modal="true"
          aria-labelledby="tituloModalProduto"
          onMouseDown={(evento) => evento.stopPropagation()}
          onSubmit={submeterFormulario}
        >
          <header className="cabecalhoModalCliente">
            <h2 id="tituloModalProduto">
              {somenteLeitura ? 'Consultar produto' : produto ? 'Editar produto' : 'Incluir produto'}
            </h2>

            <div className="acoesCabecalhoModalCliente">
              <Botao variante="secundario" type="button" onClick={tentarFecharModal} disabled={salvando}>
                {somenteLeitura ? 'Fechar' : 'Cancelar'}
              </Botao>
              {!somenteLeitura ? (
                <Botao variante="primario" type="submit" disabled={salvando}>
                  {salvando ? 'Salvando...' : 'Salvar'}
                </Botao>
              ) : null}
            </div>
          </header>

          <div className="abasModalCliente" role="tablist" aria-label="Secoes do cadastro do produto">
            {abasModalProduto.map((aba) => (
              <button
                key={aba.id}
                type="button"
                role={aba.abreModal ? undefined : 'tab'}
                className={`abaModalCliente ${abaAtiva === aba.id ? 'ativa' : ''}`}
                aria-selected={aba.abreModal ? undefined : abaAtiva === aba.id}
                onClick={() => selecionarAbaProduto(aba)}
                disabled={aba.id === 'vendas' && modoInclusao}
              >
                {aba.label}
              </button>
            ))}
          </div>

          <div className="corpoModalCliente">
            {abaAtiva === 'dadosGerais' ? (
              <section className="painelDadosGeraisCliente">
                <CampoImagemPadrao
                  valor={formulario.imagem}
                  alt={`Imagem de ${formulario.descricao || formulario.referencia || 'produto'}`}
                  iniciais={obterIniciaisProduto(formulario)}
                  codigo={produto?.idProduto || codigoSugerido || 0}
                  disabled={somenteLeitura}
                  tamanhoSaidaImagem={320}
                  qualidadeSaidaImagem={0.82}
                  onChange={(imagem) => definirFormulario((estadoAtual) => ({
                    ...estadoAtual,
                    imagem: imagem || estadoAtual.imagem
                  }))}
                />

                <div className="gradeCamposModalCliente">
                  <CampoFormulario
                    label="Referencia"
                    name="referencia"
                    value={formulario.referencia}
                    onChange={alterarCampo}
                    disabled={somenteLeitura}
                    required
                  />
                  <CampoFormulario
                    label="Descricao"
                    name="descricao"
                    value={formulario.descricao}
                    onChange={alterarCampo}
                    disabled={somenteLeitura}
                    required
                  />
                  <CampoSelect
                    label="Grupo de Produto"
                    name="idGrupo"
                    value={formulario.idGrupo}
                    onChange={alterarCampo}
                    options={gruposAtivos.map((grupo) => ({
                      valor: String(grupo.idGrupo),
                      label: grupo.descricao
                    }))}
                    disabled={somenteLeitura}
                    required
                    acaoExtra={!somenteLeitura ? (
                      <Botao
                        variante="secundario"
                        type="button"
                        icone="pesquisa"
                        className="botaoCampoAcao"
                        onClick={abrirModalGruposProduto}
                        somenteIcone
                        title="Abrir grupos de produto"
                        aria-label="Abrir grupos de produto"
                      >
                        Abrir grupos de produto
                      </Botao>
                    ) : null}
                  />
                  <CampoSelect
                    label="Marca"
                    name="idMarca"
                    value={formulario.idMarca}
                    onChange={alterarCampo}
                    options={marcasAtivas.map((marca) => ({
                      valor: String(marca.idMarca),
                      label: marca.descricao
                    }))}
                    disabled={somenteLeitura}
                    required
                    acaoExtra={!somenteLeitura ? (
                      <Botao
                        variante="secundario"
                        type="button"
                        icone="pesquisa"
                        className="botaoCampoAcao"
                        onClick={abrirModalMarcas}
                        somenteIcone
                        title="Abrir marcas"
                        aria-label="Abrir marcas"
                      >
                        Abrir marcas
                      </Botao>
                    ) : null}
                  />
                  <CampoSelect
                    label="Unidade"
                    name="idUnidade"
                    value={formulario.idUnidade}
                    onChange={alterarCampo}
                    options={unidadesAtivas.map((unidade) => ({
                      valor: String(unidade.idUnidade),
                      label: unidade.descricao
                    }))}
                    disabled={somenteLeitura}
                    required
                    acaoExtra={!somenteLeitura ? (
                      <Botao
                        variante="secundario"
                        type="button"
                        icone="pesquisa"
                        className="botaoCampoAcao"
                        onClick={abrirModalUnidades}
                        somenteIcone
                        title="Abrir unidades"
                        aria-label="Abrir unidades"
                      >
                        Abrir unidades
                      </Botao>
                    ) : null}
                  />
                  <CampoFormulario
                    label="Preco"
                    name="preco"
                    value={formulario.preco}
                    onChange={alterarCampo}
                    onFocus={tratarFocoPreco}
                    onBlur={tratarDesfoquePreco}
                    disabled={somenteLeitura}
                    inputMode="decimal"
                    required
                  />
                  <label className="campoCheckboxFormulario" htmlFor="statusProduto">
                    <input
                      id="statusProduto"
                      type="checkbox"
                      name="status"
                      checked={formulario.status}
                      onChange={alterarCampo}
                      disabled={somenteLeitura}
                    />
                    <span>Produto ativo</span>
                  </label>
                </div>
              </section>
            ) : null}
          </div>

          <MensagemErroPopup mensagem={mensagemErro} titulo="Nao foi possivel salvar o produto." />

          {confirmandoSaida ? (
            <div className="camadaConfirmacaoModal" role="presentation" onMouseDown={fecharConfirmacaoSaida}>
              <div
                className="modalConfirmacaoAgenda"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="tituloConfirmacaoSaidaProduto"
                onMouseDown={(evento) => evento.stopPropagation()}
              >
                <div className="cabecalhoConfirmacaoModal">
                  <h4 id="tituloConfirmacaoSaidaProduto">Cancelar cadastro</h4>
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
        </form>
      </div>

      <ModalGruposProduto
        aberto={modalGruposProdutoAberto}
        registros={gruposProduto}
        somenteConsulta={somenteConsultaGrupos}
        fecharAoSalvar
        aoFechar={fecharModalGruposProduto}
        aoSalvar={aoSalvarGrupoProduto}
        aoInativar={aoInativarGrupoProduto}
        aoSelecionarGrupo={selecionarGrupo}
      />

      <ModalMarcas
        aberto={modalMarcasAberto}
        registros={marcas}
        somenteConsulta={somenteConsultaMarcas}
        fecharAoSalvar
        aoFechar={fecharModalMarcas}
        aoSalvar={aoSalvarMarca}
        aoInativar={aoInativarMarca}
        aoSelecionarMarca={selecionarMarca}
      />

      <ModalUnidadesMedida
        aberto={modalUnidadesAberto}
        registros={unidadesMedida}
        somenteConsulta={somenteConsultaUnidades}
        fecharAoSalvar
        aoFechar={fecharModalUnidades}
        aoSalvar={aoSalvarUnidadeMedida}
        aoInativar={aoInativarUnidadeMedida}
        aoSelecionarUnidade={selecionarUnidade}
      />

      <ModalHistoricoVendasProduto
        aberto={modalHistoricoVendasAberto}
        produto={produto}
        carregando={carregandoPedidos}
        mensagemErro={mensagemErroPedidos}
        itensPedidos={itensPedidosFiltrados}
        filtrosAtivos={filtrosPedidosAtivos}
        valorPesquisa={pesquisaRapidaVendas}
        onAlterarPesquisa={definirPesquisaRapidaVendas}
        onFechar={fecharModalHistoricoVendas}
        onAbrirFiltros={() => definirModalFiltrosPedidosAberto(true)}
        onConsultarPedido={consultarPedido}
      />

      <ModalPedido
        aberto={modalPedidoAberto}
        pedido={pedidoSelecionado}
        clientes={clientesPedidos}
        contatos={contatosPedidos}
        usuarios={usuariosHistorico}
        vendedores={vendedoresHistorico}
        prazosPagamento={prazosPagamentoPedidos}
        etapasPedido={etapasPedido}
        produtos={produtosConsultaPedido}
        camposPedido={[]}
        empresa={empresaPedidos}
        usuarioLogado={null}
        modo="consulta"
        camadaSecundaria
        aoFechar={fecharModalPedido}
        aoSalvar={async () => {}}
      />

      <ModalFiltros
        aberto={modalFiltrosPedidosAberto}
        titulo="Filtros de itens vendidos"
        filtros={filtrosPedidos}
        campos={[
          {
            name: 'dataInclusaoInicio',
            label: 'Inclusao inicial',
            type: 'date',
            inputProps: {
              max: filtrosPedidos.dataInclusaoFim || undefined
            }
          },
          {
            name: 'dataInclusaoFim',
            label: 'Inclusao final',
            type: 'date',
            inputProps: {
              min: filtrosPedidos.dataInclusaoInicio || undefined
            }
          },
          {
            name: 'dataEntregaInicio',
            label: 'Entrega inicial',
            type: 'date',
            inputProps: {
              max: filtrosPedidos.dataEntregaFim || undefined
            }
          },
          {
            name: 'dataEntregaFim',
            label: 'Entrega final',
            type: 'date',
            inputProps: {
              min: filtrosPedidos.dataEntregaInicio || undefined
            }
          },
          {
            name: 'codigoPedido',
            label: 'Ordem de Compra',
            type: 'text',
            inputProps: {
              placeholder: 'Todos'
            }
          },
          {
            name: 'prazoPagamento',
            label: 'Prazo de pagamento',
            type: 'text',
            inputProps: {
              placeholder: 'Todos'
            }
          },
          {
            name: 'referenciaProduto',
            label: 'Referencia',
            type: 'text',
            inputProps: {
              placeholder: 'Todas'
            }
          },
          {
            name: 'descricaoProduto',
            label: 'Descricao',
            type: 'text',
            inputProps: {
              placeholder: 'Todas'
            }
          },
          {
            name: 'idEtapaPedido',
            label: 'Etapa',
            options: etapasPedido.map((etapa) => ({
              valor: String(etapa.idEtapaPedido),
              label: etapa.descricao
            }))
          },
          {
            name: 'idVendedor',
            label: 'Comprador',
            options: vendedoresHistorico.map((vendedor) => ({
              valor: String(vendedor.idVendedor),
              label: vendedor.nome
            }))
          }
        ]}
        aoFechar={() => definirModalFiltrosPedidosAberto(false)}
        aoAplicar={(proximosFiltros) => {
          definirFiltrosPedidos(proximosFiltros);
          definirModalFiltrosPedidosAberto(false);
        }}
        aoLimpar={() => definirFiltrosPedidos(criarFiltrosIniciaisVendasProduto())}
      />
    </>
  );
}

function CampoFormulario({ label, name, type = 'text', ...props }) {
  return (
    <div className="campoFormulario">
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} className="entradaFormulario" {...props} />
    </div>
  );
}

function CampoSelect({ label, name, options, acaoExtra = null, ...props }) {
  return (
    <div className="campoFormulario">
      <label htmlFor={name}>{label}</label>
      <div className={`campoSelectComAcao ${acaoExtra ? 'temAcao' : ''}`.trim()}>
        <select id={name} name={name} className="entradaFormulario" {...props}>
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

function criarFormularioProduto(produto) {
  if (!produto) {
    return estadoInicialFormulario;
  }

  return {
    referencia: produto.referencia || '',
    descricao: produto.descricao || '',
    idGrupo: String(produto.idGrupo || ''),
    idMarca: String(produto.idMarca || ''),
    idUnidade: String(produto.idUnidade || ''),
    preco: produto.preco ? normalizarPreco(produto.preco) : '',
    imagem: produto.imagem || '',
    status: Boolean(produto.status)
  };
}

function obterIniciaisProduto(produto) {
  const textoBase = produto.referencia || produto.descricao || 'PR';

  return textoBase.slice(0, 2).toUpperCase();
}

function enriquecerPedidosProduto(pedidos, idProduto, clientes, vendedores, etapasPedido) {
  const clientesPorId = new Map((clientes || []).map((cliente) => [cliente.idCliente, cliente.nomeFantasia || cliente.razaoSocial || '']));
  const vendedoresPorId = new Map((vendedores || []).map((vendedor) => [vendedor.idVendedor, vendedor.nome]));
  const etapasNormalizadas = normalizarEtapasPedidoHistorico(etapasPedido);
  const etapasPorId = new Map(etapasNormalizadas.map((etapa) => [etapa.idEtapaPedido, etapa]));

  return (pedidos || [])
    .filter((pedido) => Array.isArray(pedido.itens) && pedido.itens.some((item) => String(item.idProduto) === String(idProduto)))
    .sort((pedidoA, pedidoB) => {
      const dataHoraA = `${pedidoA.dataInclusao || ''}T00:00:00`;
      const dataHoraB = `${pedidoB.dataInclusao || ''}T00:00:00`;
      return new Date(dataHoraB).getTime() - new Date(dataHoraA).getTime();
    })
    .map((pedido) => ({
      ...pedido,
      totalPedido: Array.isArray(pedido.itens)
        ? pedido.itens.reduce((total, item) => total + (Number(item.valorTotal) || 0), 0)
        : 0,
      nomeClienteSnapshot: pedido.nomeClienteSnapshot || clientesPorId.get(pedido.idCliente) || '',
      nomeVendedorSnapshot: pedido.nomeVendedorSnapshot || vendedoresPorId.get(pedido.idVendedor) || '',
      nomeEtapaPedidoSnapshot: pedido.nomeEtapaPedidoSnapshot || etapasPorId.get(pedido.idEtapaPedido)?.descricao || ''
    }));
}

function criarItensPedidosProduto(pedidos, idProduto, filtros) {
  return (pedidos || []).flatMap((pedido) => (
    Array.isArray(pedido.itens)
      ? pedido.itens
        .filter((item) => String(item.idProduto) === String(idProduto))
        .filter((item) => itemPedidoAtendeFiltrosProduto(pedido, item, filtros))
        .map((item, indice) => ({
          chave: `${pedido.idPedido || 'pedido'}-${item.idItemPedido || indice}`,
          idPedido: pedido.idPedido,
          dataInclusao: pedido.dataInclusao,
          dataEntrega: pedido.dataEntrega,
          nomeCliente: pedido.nomeClienteSnapshot || 'Fornecedor nao informado',
          referenciaProduto: item.referenciaProdutoSnapshot || '',
          descricaoProduto: item.descricaoProdutoSnapshot || 'Produto nao informado',
          valorUnitario: Number(item.valorUnitario) || 0,
          quantidade: item.quantidade || 0,
          valorTotal: Number(item.valorTotal) || 0,
          pedido
        }))
      : []
  ));
}

function criarFiltrosIniciaisVendasProduto() {
  return {
    dataInclusaoInicio: '',
    dataInclusaoFim: '',
    dataEntregaInicio: '',
    dataEntregaFim: '',
    codigoPedido: '',
    prazoPagamento: '',
    referenciaProduto: '',
    descricaoProduto: '',
    idEtapaPedido: '',
    idVendedor: ''
  };
}

function itemPedidoAtendeFiltrosProduto(pedido, item, filtros) {
  const dataInclusao = String(pedido?.dataInclusao || '');
  const dataEntrega = String(pedido?.dataEntrega || '');
  const codigoPedido = String(pedido?.idPedido || '');
  const prazoPagamento = String(pedido?.nomePrazoPagamentoSnapshot || '').toLowerCase();
  const referencia = String(item?.referenciaProdutoSnapshot || '').toLowerCase();
  const descricao = String(item?.descricaoProdutoSnapshot || '').toLowerCase();

  return (
    (!filtros.dataInclusaoInicio || dataInclusao >= filtros.dataInclusaoInicio)
    && (!filtros.dataInclusaoFim || dataInclusao <= filtros.dataInclusaoFim)
    && (!filtros.dataEntregaInicio || (dataEntrega && dataEntrega >= filtros.dataEntregaInicio))
    && (!filtros.dataEntregaFim || (dataEntrega && dataEntrega <= filtros.dataEntregaFim))
    && (!String(filtros.codigoPedido || '').trim() || codigoPedido.includes(String(filtros.codigoPedido || '').trim()))
    && (!String(filtros.prazoPagamento || '').trim() || prazoPagamento.includes(String(filtros.prazoPagamento || '').trim().toLowerCase()))
    && (!String(filtros.referenciaProduto || '').trim() || referencia.includes(String(filtros.referenciaProduto || '').trim().toLowerCase()))
    && (!String(filtros.descricaoProduto || '').trim() || descricao.includes(String(filtros.descricaoProduto || '').trim().toLowerCase()))
    && (!filtros.idEtapaPedido || String(pedido?.idEtapaPedido) === String(filtros.idEtapaPedido))
    && (!filtros.idVendedor || String(pedido?.idVendedor) === String(filtros.idVendedor))
  );
}

function filtrarItensPedidosDigitacaoProduto(itensPedidos, pesquisa) {
  const termo = String(pesquisa || '').trim().toLowerCase();

  if (!termo) {
    return itensPedidos;
  }

  return (itensPedidos || []).filter((item) => [
    item.idPedido,
    item.dataInclusao,
    item.dataEntrega,
    item.nomeCliente,
    item.referenciaProduto,
    item.descricaoProduto,
    item.valorUnitario,
    item.quantidade,
    item.valorTotal,
    item.pedido?.nomePrazoPagamentoSnapshot,
    item.pedido?.nomeEtapaPedidoSnapshot,
    item.pedido?.nomeVendedorSnapshot
  ].some((valor) => String(valor || '').toLowerCase().includes(termo)));
}

function filtrosHistoricoEstaoAtivos(filtros, filtrosPadrao) {
  return Object.keys(filtrosPadrao).some((chave) => String(filtros?.[chave] || '') !== String(filtrosPadrao[chave] || ''));
}

function normalizarEtapasPedidoHistorico(etapasPedido) {
  if (!Array.isArray(etapasPedido)) {
    return [];
  }

  return etapasPedido
    .map((etapa) => ({
      ...etapa,
      idEtapaPedido: etapa.idEtapaPedido ?? etapa.idEtapa
    }))
    .sort((etapaA, etapaB) => {
      const ordemA = obterValorOrdemEtapaHistorico(etapaA?.ordem, etapaA?.idEtapaPedido);
      const ordemB = obterValorOrdemEtapaHistorico(etapaB?.ordem, etapaB?.idEtapaPedido);

      if (ordemA !== ordemB) {
        return ordemA - ordemB;
      }

      return Number(etapaA?.idEtapaPedido || 0) - Number(etapaB?.idEtapaPedido || 0);
    });
}

function obterValorOrdemEtapaHistorico(ordem, fallback) {
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

