import { useEffect, useMemo, useState } from 'react';
import '../../recursos/estilos/modalGraficosPaginaInicial.css';
import { Botao } from '../../componentes/comuns/botao';
import { BotaoAcaoGrade } from '../../componentes/comuns/botaoAcaoGrade';
import { MensagemErroPopup } from '../../componentes/comuns/mensagemErroPopup';

export function ModalGraficosPaginaInicial({
  aberto,
  titulo,
  empresa,
  configuracoesAtuais = [],
  normalizarConfiguracoes,
  reordenarConfiguracoes,
  reposicionarConfiguracao,
  totalColunas,
  limiteTotalColunas = null,
  maxLinhas = null,
  permitirOrdenacao = true,
  somenteConsulta = false,
  camadaSecundaria = false,
  aoFechar,
  aoSalvar
}) {
  const [configuracoes, definirConfiguracoes] = useState([]);
  const [graficoEmEdicao, definirGraficoEmEdicao] = useState(null);
  const [formularioEdicao, definirFormularioEdicao] = useState({ ordem: 1, span: 1, rotulo: '' });
  const [salvando, definirSalvando] = useState(false);
  const [mensagemErro, definirMensagemErro] = useState('');

  useEffect(() => {
    if (!aberto) {
      return;
    }

    definirConfiguracoes(normalizarConfiguracoes(configuracoesAtuais));
    definirGraficoEmEdicao(null);
    definirFormularioEdicao({ ordem: 1, span: 1, rotulo: '' });
    definirSalvando(false);
    definirMensagemErro('');
  }, [aberto, configuracoesAtuais, normalizarConfiguracoes]);

  useEffect(() => {
    if (!aberto) {
      return undefined;
    }

    function tratarTecla(evento) {
      if (evento.key === 'Escape' && !salvando) {
        if (graficoEmEdicao) {
          definirGraficoEmEdicao(null);
          return;
        }

        aoFechar();
      }
    }

    window.addEventListener('keydown', tratarTecla);
    return () => window.removeEventListener('keydown', tratarTecla);
  }, [aberto, aoFechar, graficoEmEdicao, salvando]);

  const configuracoesOrdenadas = useMemo(
    () => reordenarConfiguracoes(configuracoes),
    [configuracoes, reordenarConfiguracoes]
  );
  const resumoLinhas = useMemo(
    () => calcularResumoLinhas(configuracoesOrdenadas, totalColunas),
    [configuracoesOrdenadas, totalColunas]
  );

  if (!aberto) {
    return null;
  }

  function atualizarVisibilidade(idGrafico, visivel) {
    if (somenteConsulta) {
      return;
    }

    definirConfiguracoes((estadoAtual) => reordenarConfiguracoes(
      estadoAtual.map((grafico) => {
        if (grafico.id !== idGrafico) {
          return grafico;
        }

        return {
          ...grafico,
          visivel: Boolean(visivel),
          ordem: permitirOrdenacao && visivel ? (grafico.ordem || obterMaiorOrdem(estadoAtual) + 1) : grafico.ordem
        };
      })
    ));
  }

  function abrirModalEdicao(grafico) {
    definirMensagemErro('');
    definirGraficoEmEdicao(grafico.id);
    definirFormularioEdicao({
      ordem: grafico.ordem || obterMaiorOrdem(configuracoesOrdenadas) + 1,
      span: grafico.span || 1,
      rotulo: grafico.rotulo || grafico.rotuloPadrao || ''
    });
  }

  function fecharModalEdicao() {
    if (!salvando) {
      definirGraficoEmEdicao(null);
    }
  }

  function salvarEdicao(evento) {
    evento.preventDefault();

    if (!graficoEmEdicao) {
      return;
    }

    definirConfiguracoes((estadoAtual) => {
      const proximaLista = estadoAtual.map((grafico) => {
        if (grafico.id !== graficoEmEdicao) {
          return grafico;
        }

        return {
          ...grafico,
          rotulo: normalizarRotulo(formularioEdicao.rotulo, grafico.rotuloPadrao || grafico.rotulo),
          span: normalizarNumeroInteiro(formularioEdicao.span, grafico.spanPadrao || 1),
          ordem: permitirOrdenacao && grafico.visivel
            ? normalizarNumeroInteiro(formularioEdicao.ordem, grafico.ordem || 1)
            : grafico.ordem
        };
      });

      const graficoAtualizado = proximaLista.find((grafico) => grafico.id === graficoEmEdicao);

      if (!graficoAtualizado?.visivel || !permitirOrdenacao) {
        return reordenarConfiguracoes(proximaLista);
      }

      return reposicionarConfiguracao(
        proximaLista,
        graficoEmEdicao,
        normalizarNumeroInteiro(formularioEdicao.ordem, graficoAtualizado?.ordem || 1)
      );
    });

    definirGraficoEmEdicao(null);
  }

  async function submeterFormulario(evento) {
    evento.preventDefault();

    if (somenteConsulta) {
      return;
    }

    definirMensagemErro('');
    const configuracoesNormalizadas = reordenarConfiguracoes(configuracoes);
    const totalSpan = configuracoesNormalizadas
      .filter((grafico) => grafico.visivel)
      .reduce((total, grafico) => total + Number(grafico.span || 0), 0);

    if (limiteTotalColunas && totalSpan > limiteTotalColunas) {
      definirMensagemErro(
        `As sessoes visiveis somam ${totalSpan} colunas. Reduza para no maximo ${limiteTotalColunas}.`
      );
      return;
    }

    if (maxLinhas && resumoLinhas.quantidadeLinhas > maxLinhas) {
      definirMensagemErro(
        `A distribuicao atual ocupa ${resumoLinhas.quantidadeLinhas} linhas. Ajuste ordem e colunas para caber em no maximo ${maxLinhas} linhas de ${totalColunas}.`
      );
      return;
    }

    definirSalvando(true);

    try {
      await aoSalvar(configuracoesNormalizadas.map((grafico) => ({
        id: grafico.id,
        base: grafico.base,
        rotulo: normalizarRotulo(grafico.rotulo, grafico.rotuloPadrao),
        visivel: Boolean(grafico.visivel),
        ordem: permitirOrdenacao && grafico.visivel ? grafico.ordem : grafico.ordem,
        span: normalizarNumeroInteiro(grafico.span, grafico.spanPadrao || 1)
      })));
    } catch (erro) {
      definirMensagemErro(erro.message || 'Nao foi possivel salvar os graficos da pagina inicial.');
      definirSalvando(false);
    }
  }

  function fecharAoClicarNoFundo(evento) {
    if (evento.target === evento.currentTarget && !salvando) {
      aoFechar();
    }
  }

  const classeCamada = camadaSecundaria
    ? 'camadaModalContato camadaModalFiltroPeriodo'
    : 'camadaModal';

  return (
    <div className={classeCamada} role="presentation" onMouseDown={fecharAoClicarNoFundo}>
      <form
        className="modalCliente modalGraficosPaginaInicial"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tituloModalGraficosPaginaInicial"
        onMouseDown={(evento) => evento.stopPropagation()}
        onSubmit={submeterFormulario}
      >
        <header className="cabecalhoModalCliente">
          <h2 id="tituloModalGraficosPaginaInicial">{titulo}</h2>
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
                Marque as sessoes visiveis da aba e ajuste largura em colunas e rotulo. Cada item pode ocupar de 1 a {totalColunas} colunas por linha{permitirOrdenacao ? ', e a ordem segue a leitura da tela, de cima para baixo e da esquerda para a direita' : ''}.
              </p>
              <p className="resumoColunasGridAtendimentos">
                {limiteTotalColunas
                  ? `A soma total dos itens visiveis pode ocupar no maximo ${limiteTotalColunas} colunas dentro dessa composicao.`
                  : 'A largura configurada vale por sessao dentro da malha da home, sem limitar a soma total da aba.'}
              </p>
              {maxLinhas ? (
                <p className={`resumoColunasGridAtendimentos ${resumoLinhas.quantidadeLinhas > maxLinhas ? 'excedido' : ''}`}>
                  Linha 1: {resumoLinhas.linhas[0] || 0}/{totalColunas}
                  {maxLinhas >= 2 ? ` | Linha 2: ${resumoLinhas.linhas[1] || 0}/${totalColunas}` : ''}
                  {resumoLinhas.quantidadeLinhas > maxLinhas ? ` | Excedeu para ${resumoLinhas.quantidadeLinhas} linhas` : ''}
                </p>
              ) : null}
            </div>

            <div className="campoFormularioIntegral listaCheckboxesGridAtendimentos">
              {configuracoesOrdenadas.map((grafico) => (
                <div
                  key={grafico.id}
                  className={`itemCheckboxGridAtendimentos ${grafico.visivel ? 'ativo' : ''}`}
                >
                  <label className="cabecalhoItemCheckboxGridAtendimentos">
                    <input
                      type="checkbox"
                      checked={grafico.visivel}
                      onChange={(evento) => atualizarVisibilidade(grafico.id, evento.target.checked)}
                      disabled={somenteConsulta || salvando}
                    />
                    <span>{grafico.rotulo}</span>
                  </label>

                  <div className="acoesItemCheckboxGridAtendimentos">
                    <div className="grupoChipsGridAtendimentos">
                      <span className="chipResumoGridAtendimentos chipResumoGridAtendimentosRotulo" title={grafico.rotulo}>
                        {grafico.rotulo}
                      </span>
                      {permitirOrdenacao ? (
                        <span className={`chipResumoGridAtendimentos ${grafico.visivel ? 'ativo' : 'inativo'}`}>
                          {grafico.visivel ? `Ordem ${grafico.ordem}` : 'Sem ordem'}
                        </span>
                      ) : null}
                      <span className="chipResumoGridAtendimentos">
                        Colunas {grafico.span}
                      </span>
                    </div>
                    <BotaoAcaoGrade
                      icone="editar"
                      titulo={`Editar ${grafico.rotulo}`}
                      disabled={somenteConsulta || salvando}
                      onClick={() => abrirModalEdicao(grafico)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <MensagemErroPopup mensagem={mensagemErro} titulo="Nao foi possivel salvar os graficos." />
      </form>

      {graficoEmEdicao ? (
        <div className="camadaModalContato camadaModalFiltroPeriodo" role="presentation" onMouseDown={fecharModalEdicao}>
          <form
            className="modalContatoCliente modalFiltros modalEdicaoColunaGridAtendimentos"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tituloModalEdicaoGraficoPaginaInicial"
            onMouseDown={(evento) => evento.stopPropagation()}
            onSubmit={salvarEdicao}
          >
            <header className="cabecalhoModalContato">
              <h3 id="tituloModalEdicaoGraficoPaginaInicial">
                Editar {obterRotuloGrafico(configuracoesOrdenadas, graficoEmEdicao)}
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
                    maxLength="80"
                    value={formularioEdicao.rotulo}
                    onChange={(evento) => definirFormularioEdicao((estadoAtual) => ({
                      ...estadoAtual,
                      rotulo: evento.target.value
                    }))}
                  />
                </label>

                {permitirOrdenacao ? (
                  <label className="campoEdicaoColunaGridAtendimentos">
                    <span>Ordem</span>
                    <input
                      type="number"
                      min="1"
                      value={formularioEdicao.ordem}
                      onChange={(evento) => definirFormularioEdicao((estadoAtual) => ({
                        ...estadoAtual,
                        ordem: evento.target.value
                      }))}
                    />
                  </label>
                ) : null}

                <label className="campoEdicaoColunaGridAtendimentos">
                  <span>Colunas</span>
                  <input
                    type="number"
                    min="1"
                    max={String(totalColunas)}
                    value={formularioEdicao.span}
                    onChange={(evento) => definirFormularioEdicao((estadoAtual) => ({
                      ...estadoAtual,
                      span: evento.target.value
                    }))}
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

function obterMaiorOrdem(configuracoes) {
  return (configuracoes || []).reduce((maior, grafico) => {
    if (!grafico.visivel) {
      return maior;
    }

    return Math.max(maior, Number(grafico.ordem || 0));
  }, 0);
}

function obterRotuloGrafico(configuracoes, idGrafico) {
  return configuracoes.find((grafico) => grafico.id === idGrafico)?.rotulo || 'grafico';
}

function normalizarNumeroInteiro(valor, fallback = 1) {
  const numero = Number(valor);
  return Number.isInteger(numero) && numero > 0 ? numero : fallback;
}

function normalizarRotulo(valor, fallback = '') {
  const texto = String(valor || '').trim();
  return texto || fallback;
}

function calcularResumoLinhas(configuracoes, totalColunas) {
  const linhas = [];
  let ocupacaoLinhaAtual = 0;

  configuracoes
    .filter((item) => item.visivel)
    .forEach((item) => {
      const span = normalizarNumeroInteiro(item.span, 1);

      if ((ocupacaoLinhaAtual + span) > totalColunas) {
        linhas.push(ocupacaoLinhaAtual);
        ocupacaoLinhaAtual = span;
        return;
      }

      ocupacaoLinhaAtual += span;
    });

  if (ocupacaoLinhaAtual > 0 || linhas.length === 0) {
    linhas.push(ocupacaoLinhaAtual);
  }

  return {
    linhas,
    quantidadeLinhas: linhas.filter((linha) => linha > 0).length
  };
}
