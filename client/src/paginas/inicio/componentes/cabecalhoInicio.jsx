import { Botao } from '../../../componentes/comuns/botao';
import '../../../recursos/estilos/cabecalhoPagina.css';
import '../../../recursos/estilos/cabecalhoInicio.css';

export function CabecalhoInicio({
  aoAbrirFiltros,
  filtrosAtivos = false,
  resumo = '',
  descricao = '',
  somenteTitulo = false
}) {
  return (
    <header className="cabecalhoPagina inicioCabecalho">
      <div>
        <h1>Painel inicial</h1>
        {!somenteTitulo ? <p>{descricao || 'Acompanhe os principais sinais comerciais do CRM.'}</p> : null}
        {!somenteTitulo && resumo ? <small className="inicioCabecalhoResumo">{resumo}</small> : null}
      </div>

      {aoAbrirFiltros && !somenteTitulo ? (
        <div className="acoesCabecalhoPagina">
          <Botao
            variante={filtrosAtivos ? 'primario' : 'secundario'}
            icone="filtro"
            somenteIcone
            title="Filtrar"
            aria-label="Filtrar"
            onClick={aoAbrirFiltros}
          />
        </div>
      ) : null}
    </header>
  );
}
