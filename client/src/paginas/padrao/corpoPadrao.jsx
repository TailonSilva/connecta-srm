import { CorpoPagina } from '../../componentes/layout/corpoPagina';
import { CartaoPaginaVazia } from '../../componentes/layout/cartaoPaginaVazia';

export function CorpoPadrao({ pagina }) {
  return (
    <CorpoPagina>
      <div className="gradePainel">
        <CartaoPaginaVazia
          titulo={pagina.rotulo}
          descricao="Espaco reservado para o conteudo principal desta pagina."
        />
        <CartaoPaginaVazia
          titulo="Resumo"
          descricao="Area de apoio para cards, graficos, indicadores ou filtros."
        />
        <CartaoPaginaVazia
          titulo="Detalhes"
          descricao="Bloco preparado para informacoes complementares da pagina."
        />
        <CartaoPaginaVazia
          titulo="Atividades"
          descricao="Espaco reservado para listagens, historicos ou observacoes."
        />
      </div>
    </CorpoPagina>
  );
}
