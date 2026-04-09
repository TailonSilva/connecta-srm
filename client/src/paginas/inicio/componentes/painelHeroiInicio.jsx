import { IconeAjudaSessaoInicio } from './iconeAjudaSessaoInicio';
import { TooltipExplicacaoInicio } from './tooltipExplicacaoInicio';

export function PainelHeroiInicio({
  tag,
  titulo,
  subtitulo,
  metricas = [],
  faixas = [],
  carregando = false,
  ajuda,
  className = ''
}) {
  return (
    <section className={`paginaInicioPainelHeroi ${className}`.trim()}>
      <div className="paginaInicioPainelHeroiCabecalho">
        <div>
          <span className="paginaInicioPainelTag">{tag}</span>
          <h2>{titulo}</h2>
          <p>{subtitulo}</p>
        </div>
        <IconeAjudaSessaoInicio titulo={titulo} ajuda={ajuda} />
      </div>

      <div className="paginaInicioHeroiMetricas">
        {metricas.map((item) => (
          <article key={item.rotulo} tabIndex={0}>
            <span>{item.rotulo}</span>
            <strong>{carregando ? '...' : item.valor}</strong>
            <TooltipExplicacaoInicio titulo={item.rotulo} ajuda={item.ajuda} />
          </article>
        ))}
      </div>

      <div className="paginaInicioHeroiFaixas">
        {faixas.map((item) => (
          <article key={item.rotulo} className="paginaInicioHeroiFaixa" tabIndex={0}>
            <span>{item.rotulo}</span>
            <strong>{carregando ? '...' : item.valor}</strong>
            <TooltipExplicacaoInicio titulo={item.rotulo} ajuda={item.ajuda} />
          </article>
        ))}
      </div>
    </section>
  );
}
