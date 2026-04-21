import { Botao } from '../comuns/botao';
import '../../recursos/estilos/cabecalhoPagina.css';
import '../../recursos/estilos/cabecalhoInicio.css';

export function CabecalhoInicio({
  aoAbrirFiltros,
  filtrosAtivos = false,
  resumo = '',
  descricao = '',
  somenteTitulo = false,
  abas = [],
  abaAtiva = '',
  aoSelecionarAba
}) {
  return (
    <header className="cabecalhoPagina inicioCabecalho">
      <div>
        <h1>Painel inicial</h1>
        {!somenteTitulo ? <p>{descricao || 'Acompanhe os principais sinais comerciais do SRM.'}</p> : null}
        {!somenteTitulo && resumo ? <small className="inicioCabecalhoResumo">{resumo}</small> : null}
      </div>

      {aoAbrirFiltros && !somenteTitulo ? (
        <div className="acoesCabecalhoPagina">
          {Array.isArray(abas) && abas.length > 0 ? (
            <div className="inicioCabecalhoAbas" role="tablist" aria-label="Secoes da pagina inicial">
              {abas.map((aba) => (
                <button
                  key={aba.id}
                  type="button"
                  role="tab"
                  className={`inicioCabecalhoAba ${abaAtiva === aba.id ? 'ativa' : ''}`.trim()}
                  aria-selected={abaAtiva === aba.id}
                  onClick={() => aoSelecionarAba?.(aba.id)}
                >
                  {aba.rotulo}
                </button>
              ))}
            </div>
          ) : null}

          <Botao
            variante={filtrosAtivos ? 'primario' : 'secundario'}
            icone="filtro"
            somenteIcone
            title="Filtrar"
            aria-label="Filtrar"
            onClick={aoAbrirFiltros}
          />
        </div>
      ) : !somenteTitulo && Array.isArray(abas) && abas.length > 0 ? (
        <div className="acoesCabecalhoPagina">
          <div className="inicioCabecalhoAbas" role="tablist" aria-label="Secoes da pagina inicial">
            {abas.map((aba) => (
              <button
                key={aba.id}
                type="button"
                role="tab"
                className={`inicioCabecalhoAba ${abaAtiva === aba.id ? 'ativa' : ''}`.trim()}
                aria-selected={abaAtiva === aba.id}
                onClick={() => aoSelecionarAba?.(aba.id)}
              >
                {aba.rotulo}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}

