import { useEffect, useState } from 'react';
import { Botao } from './botao';
import { CampoSelecaoMultiplaModal } from './campoSelecaoMultiplaModal';
import { normalizarValorEntradaFormulario } from '../../utilitarios/normalizarTextoFormulario';

export function ModalFiltros({
  aberto,
  titulo,
  campos,
  filtros,
  aoFechar,
  aoAplicar,
  aoLimpar
}) {
  const [formulario, definirFormulario] = useState(filtros);
  const [campoPeriodoAberto, definirCampoPeriodoAberto] = useState(null);

  useEffect(() => {
    if (!aberto) {
      return;
    }

    definirFormulario(filtros);
    definirCampoPeriodoAberto(null);
  }, [aberto, filtros]);

  useEffect(() => {
    if (!aberto) {
      return undefined;
    }

    function tratarTecla(evento) {
      if (evento.key === 'Escape') {
        aoFechar();
      }
    }

    window.addEventListener('keydown', tratarTecla);

    return () => {
      window.removeEventListener('keydown', tratarTecla);
    };
  }, [aberto, aoFechar]);

  if (!aberto) {
    return null;
  }

  function alterarCampo(evento) {
    const { name, value } = evento.target;
    const valorNormalizado = normalizarValorEntradaFormulario(evento);

    definirFormulario((estadoAtual) => ({
      ...estadoAtual,
      [name]: valorNormalizado || value
    }));
  }

  function alternarCampoMultiplo(nomeCampo, valorCampo) {
    definirFormulario((estadoAtual) => {
      const valoresAtuais = Array.isArray(estadoAtual[nomeCampo]) ? estadoAtual[nomeCampo] : [];
      const valorNormalizado = String(valorCampo);
      const selecionado = valoresAtuais.includes(valorNormalizado);

      return {
        ...estadoAtual,
        [nomeCampo]: selecionado
          ? valoresAtuais.filter((item) => item !== valorNormalizado)
          : [...valoresAtuais, valorNormalizado]
      };
    });
  }

  function aplicarFiltros(evento) {
    evento.preventDefault();
    aoAplicar(formulario);
  }

  function limparFiltros() {
    const filtrosLimpos = typeof aoLimpar === 'function'
      ? aoLimpar(formulario)
      : null;

    if (filtrosLimpos && typeof filtrosLimpos === 'object') {
      definirFormulario(filtrosLimpos);
      aoAplicar(filtrosLimpos);
      return;
    }

    aoFechar();
  }

  function fecharAoClicarNoFundo(evento) {
    if (evento.target === evento.currentTarget) {
      aoFechar();
    }
  }

  function alterarCampoPeriodo(nomeCampo, valor) {
    definirFormulario((estadoAtual) => ({
      ...estadoAtual,
      [nomeCampo]: valueOrEmpty(valor)
    }));
  }

  function abrirCampoPeriodo(campo) {
    definirCampoPeriodoAberto(campo);
  }

  function fecharCampoPeriodo() {
    definirCampoPeriodoAberto(null);
  }

  function limparCampoPeriodo(campo) {
    definirFormulario((estadoAtual) => {
      const proximoEstado = { ...estadoAtual };

      obterPeriodosCampoDatas(campo).forEach((periodo) => {
        proximoEstado[periodo.nomeInicio] = '';
        proximoEstado[periodo.nomeFim] = '';
      });

      return proximoEstado;
    });
  }

  return (
    <div className="camadaModalContato" role="presentation" onMouseDown={fecharAoClicarNoFundo}>
      <form
        className="modalContatoFornecedor modalFiltros"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`titulo${titulo.replace(/\s+/g, '')}`}
        onMouseDown={(evento) => evento.stopPropagation()}
        onSubmit={aplicarFiltros}
      >
        <div className="cabecalhoModalContato">
          <h3 id={`titulo${titulo.replace(/\s+/g, '')}`}>{titulo}</h3>

          <div className="acoesFormularioContatoModal">
            <Botao
              variante="secundario"
              type="button"
              icone="limpar"
              somenteIcone
              title="Limpar"
              aria-label="Limpar"
              onClick={limparFiltros}
            >
              Limpar
            </Botao>
            <Botao
              variante="secundario"
              type="button"
              icone="fechar"
              somenteIcone
              title="Fechar"
              aria-label="Fechar"
              onClick={aoFechar}
            >
              Cancelar
            </Botao>
            <Botao
              variante="primario"
              type="submit"
              icone="confirmar"
              somenteIcone
              title="Aplicar"
              aria-label="Aplicar"
            >
              Aplicar
            </Botao>
          </div>
        </div>

        <div className="corpoModalContato">
          <div className="gradeCamposModalFornecedor gradeFiltrosModal">
            {campos.map((campo) => (
              campo.multiple ? (
                <CampoSelecaoMultiplaModal
                  key={campo.name}
                  label={campo.label}
                  titulo={campo.tituloSelecao || campo.label}
                  itens={campo.options}
                  valoresSelecionados={Array.isArray(formulario[campo.name]) ? formulario[campo.name] : []}
                  placeholder={campo.placeholder || 'Todos'}
                  disabled={campo.disabled}
                  aoAlterar={(valores) => alternarCampoMultiploSubstituir(campo.name, valores)}
                />
              ) : campo.type === 'busca-modal' ? (
                <div key={campo.name} className="campoFormulario">
                  <label htmlFor={campo.name}>{campo.label}</label>
                  <div className={`campoSelectComAcao ${campo.acaoExtra ? 'temAcao' : ''}`.trim()}>
                    <Botao
                      id={campo.name}
                      variante="secundario"
                      type="button"
                      className="botaoFiltroPeriodo"
                      disabled={campo.disabled}
                      onClick={campo.onClick}
                    >
                      {typeof campo.obterResumo === 'function'
                        ? campo.obterResumo(formulario)
                        : (formulario[campo.name] || campo.placeholder || 'Selecionar')}
                    </Botao>
                    {campo.acaoExtra ? <div className="acoesCampoSelect">{campo.acaoExtra}</div> : null}
                  </div>
                </div>
              ) : campo.type === 'date-filters-modal' || campo.type === 'date-range-modal' ? (
                <div key={campo.name} className="campoFormulario campoFormularioIntegral">
                  <label htmlFor={campo.name}>{campo.label}</label>
                  <Botao
                    id={campo.name}
                    variante="secundario"
                    type="button"
                    className="botaoFiltroPeriodo"
                    disabled={campo.disabled}
                    onClick={() => abrirCampoPeriodo(campo)}
                  >
                    {montarResumoCampoDatas(formulario, campo)}
                  </Botao>
                </div>
              ) : campo.type && campo.type !== 'select' ? (
                <div key={campo.name} className="campoFormulario">
                  <label htmlFor={campo.name}>{campo.label}</label>
                  <input
                    id={campo.name}
                    name={campo.name}
                    type={campo.type}
                    className="entradaFormulario"
                    value={formulario[campo.name] || ''}
                    onChange={alterarCampo}
                    disabled={campo.disabled}
                    {...campo.inputProps}
                  />
                </div>
              ) : (
                <div key={campo.name} className="campoFormulario">
                  <label htmlFor={campo.name}>{campo.label}</label>
                  <div className={`campoSelectComAcao ${campo.acaoExtra ? 'temAcao' : ''}`.trim()}>
                    <select
                      id={campo.name}
                      name={campo.name}
                      className="entradaFormulario"
                      value={formulario[campo.name] || ''}
                      onChange={alterarCampo}
                      disabled={campo.disabled}
                    >
                      <option value="">{campo.placeholder || 'Todos'}</option>
                      {(campo.options || []).map((opcao) => (
                        <option key={opcao.valor} value={opcao.valor}>
                          {opcao.label}
                        </option>
                      ))}
                    </select>
                    {campo.acaoExtra ? <div className="acoesCampoSelect">{campo.acaoExtra}</div> : null}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </form>

      {campoPeriodoAberto ? (
        <div className="camadaModalContato camadaModalFiltroPeriodo" role="presentation" onMouseDown={fecharCampoPeriodo}>
          <div
            className="modalContatoFornecedor modalFiltroPeriodo"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`titulo${campoPeriodoAberto.name}`}
            onMouseDown={(evento) => evento.stopPropagation()}
          >
            <div className="cabecalhoModalContato">
              <h3 id={`titulo${campoPeriodoAberto.name}`}>{campoPeriodoAberto.tituloSelecao || campoPeriodoAberto.label}</h3>

              <div className="acoesFormularioContatoModal">
                <Botao
                  variante="secundario"
                  type="button"
                  icone="limpar"
                  somenteIcone
                  title="Limpar periodo"
                  aria-label="Limpar periodo"
                  onClick={() => limparCampoPeriodo(campoPeriodoAberto)}
                >
                  Limpar
                </Botao>
                <Botao
                  variante="secundario"
                  type="button"
                  icone="fechar"
                  somenteIcone
                  title="Fechar"
                  aria-label="Fechar"
                  onClick={fecharCampoPeriodo}
                >
                  Fechar
                </Botao>
              </div>
            </div>

            <div className="corpoModalContato corpoModalFiltroPeriodo">
              <div className="painelFiltrosPeriodo">
                {obterPeriodosCampoDatas(campoPeriodoAberto).map((periodo) => (
                  <section key={periodo.nomeInicio} className="blocoFiltroPeriodo">
                    <div className="cabecalhoBlocoFiltroPeriodo">
                      <strong>{periodo.titulo || periodo.label || 'Periodo'}</strong>
                    </div>

                    <div className="gradeCamposModalFornecedor gradeFiltroPeriodo">
                      <div className="campoFormulario">
                        <label htmlFor={`${campoPeriodoAberto.name}-${periodo.nomeInicio}`}>{periodo.labelInicio || 'Data inicial'}</label>
                        <input
                          id={`${campoPeriodoAberto.name}-${periodo.nomeInicio}`}
                          type={periodo.tipoInicio || 'date'}
                          className="entradaFormulario"
                          value={formulario[periodo.nomeInicio] || ''}
                          max={(periodo.tipoInicio || 'date') === 'date' ? (formulario[periodo.nomeFim] || undefined) : undefined}
                          onChange={(evento) => alterarCampoPeriodo(periodo.nomeInicio, evento.target.value)}
                        />
                      </div>

                      <div className="campoFormulario">
                        <label htmlFor={`${campoPeriodoAberto.name}-${periodo.nomeFim}`}>{periodo.labelFim || 'Data final'}</label>
                        <input
                          id={`${campoPeriodoAberto.name}-${periodo.nomeFim}`}
                          type={periodo.tipoFim || 'date'}
                          className="entradaFormulario"
                          value={formulario[periodo.nomeFim] || ''}
                          min={(periodo.tipoFim || 'date') === 'date' ? (formulario[periodo.nomeInicio] || undefined) : undefined}
                          onChange={(evento) => alterarCampoPeriodo(periodo.nomeFim, evento.target.value)}
                        />
                      </div>
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );

  function alternarCampoMultiploSubstituir(nomeCampo, valores) {
    definirFormulario((estadoAtual) => ({
      ...estadoAtual,
      [nomeCampo]: valores
    }));
  }
}

function montarResumoCampoDatas(formulario, campo) {
  const periodos = obterPeriodosCampoDatas(campo);
  const periodosAtivos = periodos.filter((periodo) => {
    const dataInicio = valueOrEmpty(formulario?.[periodo.nomeInicio]);
    const dataFim = valueOrEmpty(formulario?.[periodo.nomeFim]);

    return Boolean(dataInicio || dataFim);
  });

  if (periodosAtivos.length === 0) {
    return campo.placeholder || 'Selecionar datas';
  }

  if (periodosAtivos.length === 1) {
    const periodoAtivo = periodosAtivos[0];
    const dataInicio = valueOrEmpty(formulario?.[periodoAtivo.nomeInicio]);
    const dataFim = valueOrEmpty(formulario?.[periodoAtivo.nomeFim]);
    const resumoPeriodo = montarResumoPeriodoIndividual(dataInicio, dataFim, periodoAtivo);

    return `${periodoAtivo.titulo || periodoAtivo.label || 'Periodo'}: ${resumoPeriodo}`;
  }

  return `${periodosAtivos.length} periodos configurados`;
}

function montarResumoPeriodoIndividual(dataInicio, dataFim, periodo = null) {
  const tipoPeriodo = periodo?.tipoInicio || periodo?.tipoFim || 'date';

  if (dataInicio && dataFim) {
    return `${formatarResumoValorPeriodo(dataInicio, tipoPeriodo)} ate ${formatarResumoValorPeriodo(dataFim, tipoPeriodo)}`;
  }

  if (dataInicio) {
    return `A partir de ${formatarResumoValorPeriodo(dataInicio, tipoPeriodo)}`;
  }

  return `Ate ${formatarResumoValorPeriodo(dataFim, tipoPeriodo)}`;
}

function obterPeriodosCampoDatas(campo) {
  if (Array.isArray(campo?.periodos) && campo.periodos.length > 0) {
    return campo.periodos;
  }

  if (campo?.nomeInicio && campo?.nomeFim) {
    return [campo];
  }

  return [];
}

function formatarDataResumo(valor) {
  const data = valueOrEmpty(valor);

  if (!data || !/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    return 'Nao definida';
  }

  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

function formatarHoraResumo(valor) {
  const hora = valueOrEmpty(valor);

  if (!hora || !/^\d{2}:\d{2}$/.test(hora)) {
    return 'Nao definida';
  }

  return hora;
}

function formatarResumoValorPeriodo(valor, tipo = 'date') {
  if (tipo === 'time') {
    return formatarHoraResumo(valor);
  }

  return formatarDataResumo(valor);
}

function valueOrEmpty(valor) {
  return String(valor || '').trim();
}
