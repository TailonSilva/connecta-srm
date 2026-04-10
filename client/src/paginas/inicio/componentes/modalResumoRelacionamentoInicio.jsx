import '../../../recursos/estilos/modalResumoRelacionamentoInicio.css';
import { Botao } from '../../../componentes/comuns/botao';

export function ModalResumoRelacionamentoInicio({
  aberto,
  titulo,
  subtitulo = 'Lista completa do mes corrente.',
  itens = [],
  obterRotulo = (item) => item.descricao,
  obterValorTexto = (item) => item.valor,
  obterValorPercentual = (item) => item.percentualValor,
  obterQuantidadeTexto = (item) => `${item.quantidadeItens} itens`,
  obterCorValor,
  varianteValor = '',
  aoFechar
}) {
  if (!aberto) {
    return null;
  }

  return (
    <div className="paginaInicioModalCamada" role="presentation" onClick={aoFechar}>
      <section
        className="paginaInicioModalResumo"
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        onClick={(evento) => evento.stopPropagation()}
      >
        <div className="paginaInicioModalResumoCabecalho">
          <div>
            <h3>{titulo}</h3>
            <p>{subtitulo}</p>
          </div>
          <Botao variante="secundario" onClick={aoFechar}>Fechar</Botao>
        </div>

        <div className="paginaInicioModalResumoLista">
          {itens.length > 0 ? itens.map((item, indice) => (
            <article key={`${item.id || indice}-modal`} className="paginaInicioGraficoBarraItem">
              <div className="paginaInicioGraficoBarraCabecalho paginaInicioGraficoBarraCabecalhoLista">
                <span>{obterRotulo(item)}</span>
                <strong>{`${obterValorTexto(item)} | ${obterQuantidadeTexto(item)}`}</strong>
              </div>
              <div className={`paginaInicioGraficoBarraTrilha ${varianteValor ? `paginaInicioGraficoBarraTrilha${varianteValor}` : ''}`.trim()}>
                <span
                  style={{
                    width: `${obterValorPercentual(item) || 0}%`,
                    ...(obterCorValor?.(item) ? { background: obterCorValor(item) } : {})
                  }}
                />
              </div>
            </article>
          )) : (
            <p className="paginaInicioPainelMensagem">Nenhum registro encontrado.</p>
          )}
        </div>
      </section>
    </div>
  );
}
