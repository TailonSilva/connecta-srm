import { Botao } from '../../../componentes/comuns/botao';
import '../../../recursos/estilos/cabecalhoPagina.css';
import '../../../recursos/estilos/cabecalhoInicio.css';

export function CabecalhoInicio({ aoAbrirFiltros, filtrosAtivos = false }) {
  return (
    <header className="cabecalhoPagina inicioCabecalho">
      <div>
        <h1>Painel inicial</h1>
        <p>Visao rapida dos indicadores principais do CRM.</p>
      </div>

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
    </header>
  );
}