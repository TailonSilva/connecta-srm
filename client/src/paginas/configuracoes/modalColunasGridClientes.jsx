import { useEffect, useMemo, useState } from 'react';
import { Botao } from '../../componentes/comuns/botao';
import { MensagemErroPopup } from '../../componentes/comuns/mensagemErroPopup';
import { BotaoAcaoGrade } from '../../componentes/comuns/botaoAcaoGrade';
import {
  normalizarConfiguracoesColunasGridClientes,
  reposicionarConfiguracaoColunaGridClientes,
  reordenarConfiguracoesColunasGridClientes,
  TOTAL_COLUNAS_GRID_CLIENTES
} from '../../utilitarios/colunasGridClientes';

export function ModalColunasGridClientes({
  aberto,
  empresa,
  somenteConsulta = false,
  aoFechar,
  aoSalvar
}) {
  const [configuracoesColunas, definirConfiguracoesColunas] = useState([]);
  const [colunaEmEdicao, definirColunaEmEdicao] = useState(null);
  const [formularioEdicao, definirFormularioEdicao] = useState({ ordem: 1, span: 1, rotulo: '' });
  const [salvando, definirSalvando] = useState(false);
  const [mensagemErro, definirMensagemErro] = useState('');

  useEffect(() => {
    if (!aberto) {
      return;
    }

    definirConfiguracoesColunas(
      normalizarConfiguracoesColunasGridClientes(empresa?.colunasGridClientes)
    );
    definirColunaEmEdicao(null);
    definirFormularioEdicao({ ordem: 1, span: 1, rotulo: '' });
    definirSalvando(false);
    definirMensagemErro('');
  }, [aberto, empresa]);

  useEffect(() => {
    if (!aberto) {
      return undefined;
    }

    function tratarTecla(evento) {
      if (evento.key === 'Escape' && !salvando) {
        if (colunaEmEdicao) {
          definirColunaEmEdicao(null);
          return;
        }

        aoFechar();
      }
    }

    window.addEventListener('keydown', tratarTecla);

    return () => {
      window.removeEventListener('keydown', tratarTecla);
    };
  }, [aberto, aoFechar, colunaEmEdicao, salvando]);

  const colunasOrdenadas = useMemo(
    () => reordenarConfiguracoesColunasGridClientes(configuracoesColunas),
    [configuracoesColunas]
  );
  const totalColunasUtilizadas = colunasOrdenadas
    .filter((coluna) => coluna.visivel)
    .reduce((total, coluna) => total + Number(coluna.span || 0), 0);
  const colunaEditadaAtual = colunasOrdenadas.find((coluna) => coluna.id === colunaEmEdicao) || null;

  if (!aberto) {
    return null;
  }

  function atualizarVisibilidade(idColuna, visivel) {
    if (somenteConsulta) {
      return;
    }

    definirConfiguracoesColunas((estadoAtual) => reordenarConfiguracoesColunasGridClientes(
      estadoAtual.map((coluna) => {
        if (coluna.id !== idColuna) {
          return coluna;
        }

        return {
          ...coluna,
          visivel: coluna.obrigatoria ? true : Boolean(visivel),
          ordem: visivel ? (coluna.ordem || obterMaiorOrdem(estadoAtual) + 1) : null
        };
      })
    ));
  }

  function abrirModalEdicao(coluna) {
    definirMensagemErro('');
    definirColunaEmEdicao(coluna.id);
    definirFormularioEdicao({
      ordem: coluna.ordem || obterMaiorOrdem(colunasOrdenadas) + 1,
      span: coluna.spanFixo || coluna.span || 1,
      rotulo: coluna.rotulo || coluna.rotuloPadrao || ''
    });
  }

  function fecharModalEdicao() {
    if (!salvando) {
      definirColunaEmEdicao(null);
    }
  }

  function salvarEdicaoColuna(evento) {
    evento.preventDefault();

    if (!colunaEmEdicao) {
      return;
    }

    definirMensagemErro('');

    definirConfiguracoesColunas((estadoAtual) => {
      const proximaLista = estadoAtual.map((coluna) => {
        if (coluna.id !== colunaEmEdicao) {
          return coluna;
        }

        return {
          ...coluna,
          rotulo: normalizarRotuloCabecalho(formularioEdicao.rotulo, coluna.rotuloPadrao || coluna.rotulo),
          span: normalizarSpan(formularioEdicao.span, coluna.spanFixo || coluna.spanPadrao || 1),
          ordem: coluna.visivel || coluna.obrigatoria
            ? normalizarNumeroInteiro(formularioEdicao.ordem, coluna.ordem || 1)
            : null
        };
      });

      const colunaAtualizada = proximaLista.find((coluna) => coluna.id === colunaEmEdicao);

      if (!colunaAtualizada?.visivel && !colunaAtualizada?.obrigatoria) {
        return reordenarConfiguracoesColunasGridClientes(proximaLista);
      }

      return reposicionarConfiguracaoColunaGridClientes(
        proximaLista,
        colunaEmEdicao,
        normalizarNumeroInteiro(formularioEdicao.ordem, colunaAtualizada?.ordem || 1)
      );
    });

    definirColunaEmEdicao(null);
  }

  async function submeterFormulario(evento) {
    evento.preventDefault();

    if (somenteConsulta) {
      return;
    }

    definirMensagemErro('');

    const colunasNormalizadas = reordenarConfiguracoesColunasGridClientes(configuracoesColunas);
    const colunasVisiveis = colunasNormalizadas.filter((coluna) => coluna.visivel);
    const totalSpan = colunasVisiveis.reduce((total, coluna) => total + Number(coluna.span || 0), 0);

    if (totalSpan > TOTAL_COLUNAS_GRID_CLIENTES) {
      definirMensagemErro(
        `As colunas visiveis somam ${totalSpan} espacos. Reduza para no maximo ${TOTAL_COLUNAS_GRID_CLIENTES}.`
      );
      return;
    }

    definirSalvando(true);

    try {
      await aoSalvar({
        colunasGridClientes: colunasNormalizadas.map((coluna) => ({
          id: coluna.id,
          base: coluna.base,
          rotulo: normalizarRotuloCabecalho(coluna.rotulo, coluna.rotuloPadrao || coluna.rotulo),
          visivel: coluna.obrigatoria ? true : Boolean(coluna.visivel),
          ordem: coluna.visivel || coluna.obrigatoria ? coluna.ordem : null,
          span: normalizarSpan(coluna.span, coluna.spanFixo || coluna.spanPadrao || 1)
        }))
      });
    } catch (erro) {
      definirMensagemErro(erro.message || 'Nao foi possivel salvar as colunas do grid de clientes.');
      definirSalvando(false);
    }
  }

  function fecharAoClicarNoFundo(evento) {
    if (evento.target === evento.currentTarget && !salvando) {
      aoFechar();
    }
  }

  return (
    <div className="camadaModal" role="presentation" onMouseDown={fecharAoClicarNoFundo}>
      <form
        className="modalCliente"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tituloModalColunasGridClientes"
        onMouseDown={(evento) => evento.stopPropagation()}
        onSubmit={submeterFormulario}
      >
        <header className="cabecalhoModalCliente">
          <h2 id="tituloModalColunasGridClientes">Colunas do Grid de Clientes</h2>

          <div className="acoesCabecalhoModalCliente">
            <Botao variante="secundario" type="button" onClick={aoFechar} disabled={salvando}>
              {somenteConsulta ? 'Fechar' : 'Cancelar'}
            </Botao>
            {!somenteConsulta ? (
              <Botao variante="primario" type="submit" disabled={salvando}>
                {salvando ? 'Salvando...' : 'Salvar'}
              </Botao>
            ) : null}
          </div>
        </header>

        <div className="corpoModalCliente">
          <section className="gradeCamposModalCliente">
            <div className="campoFormularioIntegral">
              <p className="descricaoOpcaoEmpresaPaginaInicial">
                Marque as informacoes visiveis da grade principal e use editar para ajustar ordem e espaco. A lista se reorganiza automaticamente pela ordem real dos itens ativos; os desmarcados ficam no fim, sem ordem.
              </p>
              <p className={`resumoColunasGridAtendimentos ${totalColunasUtilizadas > TOTAL_COLUNAS_GRID_CLIENTES ? 'excedido' : ''}`}>
                Espaco usado pelas colunas visiveis: {totalColunasUtilizadas}/{TOTAL_COLUNAS_GRID_CLIENTES}
              </p>
            </div>

            <div className="campoFormularioIntegral listaCheckboxesGridAtendimentos">
              {colunasOrdenadas.map((coluna) => {
                const chipOrdem = coluna.visivel || coluna.obrigatoria ? `Ordem ${coluna.ordem}` : 'Sem ordem';
                const chipEspaco = `Espaco ${coluna.span}`;
                const chipRotulo = coluna.rotulo || coluna.rotuloPadrao;

                return (
                  <div
                    key={coluna.id}
                    className={`itemCheckboxGridAtendimentos ${coluna.visivel ? 'ativo' : ''} ${coluna.obrigatoria ? 'obrigatorio' : ''}`}
                  >
                    <label className="cabecalhoItemCheckboxGridAtendimentos">
                      <input
                        type="checkbox"
                        checked={coluna.visivel}
                        onChange={(evento) => atualizarVisibilidade(coluna.id, evento.target.checked)}
                        disabled={somenteConsulta || coluna.obrigatoria || salvando}
                      />
                      <span>{obterRotuloConfiguracaoColuna(coluna)}</span>
                    </label>

                    <div className="acoesItemCheckboxGridAtendimentos">
                      <div className="grupoChipsGridAtendimentos">
                        {coluna.obrigatoria ? (
                          <span className="chipResumoGridAtendimentos chipResumoGridAtendimentosObrigatorio">Obrigatoria</span>
                        ) : null}
                        <span className="chipResumoGridAtendimentos chipResumoGridAtendimentosRotulo" title={chipRotulo}>{chipRotulo}</span>
                        <span className={`chipResumoGridAtendimentos ${coluna.visivel ? 'ativo' : 'inativo'}`}>{chipOrdem}</span>
                        <span className="chipResumoGridAtendimentos">{chipEspaco}</span>
                      </div>
                      <BotaoAcaoGrade
                        icone="editar"
                        titulo={`Editar ${obterRotuloConfiguracaoColuna(coluna)}`}
                        disabled={somenteConsulta || salvando}
                        onClick={() => abrirModalEdicao(coluna)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <MensagemErroPopup mensagem={mensagemErro} titulo="Nao foi possivel salvar as colunas do grid." />
      </form>

      {colunaEmEdicao ? (
        <div className="camadaModalContato camadaModalFiltroPeriodo" role="presentation" onMouseDown={fecharModalEdicao}>
          <form
            className="modalContatoCliente modalFiltros modalEdicaoColunaGridAtendimentos"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tituloModalEdicaoColunaGridClientes"
            onMouseDown={(evento) => evento.stopPropagation()}
            onSubmit={salvarEdicaoColuna}
          >
            <header className="cabecalhoModalContato">
              <h3 id="tituloModalEdicaoColunaGridClientes">
                Editar {obterRotuloColuna(colunasOrdenadas, colunaEmEdicao)}
              </h3>

              <div className="acoesFormularioContatoModal">
                <Botao variante="secundario" type="button" onClick={fecharModalEdicao} disabled={salvando}>
                  Cancelar
                </Botao>
                <Botao variante="primario" type="submit" disabled={salvando}>
                  Aplicar
                </Botao>
              </div>
            </header>

            <div className="corpoModalContato">
              <div className="painelEdicaoColunaGridAtendimentos">
                <label className="campoEdicaoColunaGridAtendimentos">
                  <span>Rotulo</span>
                  <input
                    type="text"
                    maxLength="60"
                    value={formularioEdicao.rotulo}
                    onChange={(evento) => definirFormularioEdicao((estadoAtual) => ({ ...estadoAtual, rotulo: evento.target.value }))}
                  />
                </label>

                <label className="campoEdicaoColunaGridAtendimentos">
                  <span>Ordem</span>
                  <input
                    type="number"
                    min="1"
                    value={formularioEdicao.ordem}
                    onChange={(evento) => definirFormularioEdicao((estadoAtual) => ({ ...estadoAtual, ordem: evento.target.value }))}
                  />
                </label>

                <label className="campoEdicaoColunaGridAtendimentos">
                  <span>Espaco</span>
                  <input
                    type="number"
                    min="1"
                    max={String(TOTAL_COLUNAS_GRID_CLIENTES)}
                    value={formularioEdicao.span}
                    disabled={Boolean(colunaEditadaAtual?.spanFixo)}
                    onChange={(evento) => definirFormularioEdicao((estadoAtual) => ({ ...estadoAtual, span: evento.target.value }))}
                  />
                </label>
              </div>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}

function obterMaiorOrdem(colunas) {
  return (colunas || []).reduce((maior, coluna) => {
    if (!coluna.visivel && !coluna.obrigatoria) {
      return maior;
    }

    return Math.max(maior, Number(coluna.ordem || 0));
  }, 0);
}

function obterRotuloColuna(colunas, idColuna) {
  const coluna = colunas.find((item) => item.id === idColuna);
  return obterRotuloConfiguracaoColuna(coluna) || 'coluna';
}

function obterRotuloConfiguracaoColuna(coluna) {
  if (!coluna) {
    return '';
  }

  if (coluna.id === 'codigo') {
    return 'Codigo Principal do Cliente';
  }

  if (coluna.id === 'idCliente') {
    return 'Codigo Interno do Cliente';
  }

  if (coluna.id === 'codigoAlternativo') {
    return 'Codigo Alternativo do Cliente';
  }

  if (coluna.id === 'cliente') {
    return 'Nome do Cliente';
  }

  if (coluna.id === 'razaoSocial') {
    return 'Razao Social';
  }

  if (coluna.id === 'nomeFantasia') {
    return 'Nome Fantasia';
  }

  if (coluna.id === 'documento') {
    return 'CNPJ ou CPF';
  }

  if (coluna.id === 'cnpj') {
    return 'CNPJ ou CPF do Cadastro';
  }

  if (coluna.id === 'tipo') {
    return 'Tipo de Pessoa';
  }

  if (coluna.id === 'inscricaoEstadual') {
    return 'Inscricao Estadual';
  }

  if (coluna.id === 'idGrupoEmpresa') {
    return 'Grupo de Empresa';
  }

  if (coluna.id === 'idRamo') {
    return 'Ramo de Atividade';
  }

  if (coluna.id === 'contato') {
    return 'Contato Principal do Cliente';
  }

  if (coluna.id === 'emailContatoPrincipal') {
    return 'E-mail do Contato Principal';
  }

  if (coluna.id === 'email') {
    return 'E-mail do Cadastro';
  }

  if (coluna.id === 'telefone') {
    return 'Telefone do Cadastro';
  }

  if (coluna.id === 'logradouro') {
    return 'Logradouro';
  }

  if (coluna.id === 'numero') {
    return 'Numero';
  }

  if (coluna.id === 'complemento') {
    return 'Complemento';
  }

  if (coluna.id === 'bairro') {
    return 'Bairro';
  }

  if (coluna.id === 'cep') {
    return 'CEP';
  }

  if (coluna.id === 'vendedor' || coluna.id === 'idVendedor') {
    return 'Vendedor do Cliente';
  }

  if (coluna.id === 'observacao') {
    return 'Observacao do Cadastro';
  }

  if (coluna.id === 'dataCriacao') {
    return 'Data de Criacao';
  }

  return coluna.rotulo;
}

function normalizarNumeroInteiro(valor, valorPadrao = 1) {
  const numero = Number.parseInt(String(valor ?? '').trim(), 10);
  return Number.isFinite(numero) && numero > 0 ? numero : valorPadrao;
}

function normalizarSpan(valor, valorPadrao = 1) {
  return Math.min(TOTAL_COLUNAS_GRID_CLIENTES, normalizarNumeroInteiro(valor, valorPadrao));
}

function normalizarRotuloCabecalho(valor, valorPadrao = '') {
  const texto = String(valor ?? '').trim();
  return texto || String(valorPadrao || '').trim();
}
