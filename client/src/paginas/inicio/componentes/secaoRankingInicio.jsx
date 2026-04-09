import { IconeAjudaSessaoInicio } from './iconeAjudaSessaoInicio';
import { TooltipExplicacaoInicio } from './tooltipExplicacaoInicio';

export function SecaoRankingInicio({ titulo, descricao, itens }) {
  return (
    <section className="paginaInicioPainel paginaInicioPainelSpan1">
      <div className="paginaInicioPainelCabecalho">
        <div>
          <h3>{titulo}</h3>
          {descricao ? <p>{descricao}</p> : null}
        </div>
        <IconeAjudaSessaoInicio
          titulo={titulo}
          ajuda={{
            conceito: descricao
          }}
        />
      </div>

      <div className="paginaInicioGraficoListaSimples">
        <div className="paginaInicioGraficoListaSimplesCabecalho">
          <span />
          <strong>Valor | Volume</strong>
        </div>

        <div className="paginaInicioGraficoBarraLista">
          {itens.length > 0 ? itens.map((item, indice) => (
            <article key={`${item.rotulo}-${indice}`} className="paginaInicioGraficoBarraItem" tabIndex={0}>
              <div className="paginaInicioGraficoBarraCabecalho paginaInicioGraficoBarraCabecalhoLista">
                <span>{`${indice + 1}. ${item.rotulo}`}</span>
                <strong>{`${item.valor} | ${item.descricao}`}</strong>
              </div>
              <div className="paginaInicioGraficoBarraTrilha">
                <span style={{ width: `${item.percentual}%` }} />
              </div>
              <TooltipExplicacaoInicio titulo={item.rotulo} ajuda={item.ajuda} />
            </article>
          )) : (
            <p className="paginaInicioPainelMensagem">Sem movimentacao suficiente para ranking.</p>
          )}
        </div>
      </div>
    </section>
  );
}
