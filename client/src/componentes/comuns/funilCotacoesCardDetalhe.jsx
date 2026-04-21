import '../../recursos/estilos/funilCotacoesCardDetalhe.css';
import { Icone } from './icone';

function formatarMoeda(valor) {
  return Number(valor || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

function formatarNumero(valor) {
  return Number(valor || 0).toLocaleString('pt-BR');
}

function obterIconeEtapa(descricao = '', indice = 0) {
  const descricaoNormalizada = descricao.toLowerCase();

  if (descricaoNormalizada.includes('contato')) {
    return 'contato';
  }

  if (descricaoNormalizada.includes('negoci')) {
    return 'mensagem';
  }

  if (descricaoNormalizada.includes('pagamento')) {
    return 'pagamento';
  }

  if (descricaoNormalizada.includes('ordemCompra')) {
    return 'ordemCompra';
  }

  if (descricaoNormalizada.includes('fechado')) {
    return 'selo';
  }

  const icones = ['cotacao', 'contato', 'mensagem', 'pagamento', 'ordemCompra', 'selo'];
  return icones[indice % icones.length];
}

export function FunilCotacoesCardDetalhe({ referencia, etapaSelecionada, indiceSelecionado, participacaoValor, ticketMedio }) {
  return (
    <aside
      ref={referencia}
      className="funilCotacoesCardDetalhe"
      style={{ '--cor-etapa-funil': etapaSelecionada.cor || '#9506F4' }}
    >
      <div className="funilCotacoesCardDetalheTopo">
        <div>
          <span className="funilCotacoesCardDetalheRotulo">Etapa selecionada</span>
          <h3>{etapaSelecionada.descricao}</h3>
        </div>

        <span className="funilCotacoesCardDetalheIcone" aria-hidden="true">
          <Icone nome={obterIconeEtapa(etapaSelecionada.descricao, indiceSelecionado)} />
        </span>
      </div>

      <div className="funilCotacoesCardDetalheCorpo" aria-hidden="true">
        <div className="funilCotacoesCardDetalheAnel" style={{ '--percentual-etapa-funil': `${participacaoValor}%` }}>
          <div>
            <strong>{participacaoValor}%</strong>
            <span>do total</span>
          </div>
        </div>

        <div className="funilCotacoesCardDetalheResumo">
          <article>
            <span>Posicao</span>
            <strong>{String(indiceSelecionado + 1).padStart(2, '0')}</strong>
          </article>
          <article>
            <span>Qtd.</span>
            <strong>{formatarNumero(etapaSelecionada.quantidadeCotacoes)}</strong>
          </article>
          <article>
            <span>Ticket</span>
            <strong>{formatarMoeda(ticketMedio)}</strong>
          </article>
          <article>
            <span>Total</span>
            <strong>{formatarMoeda(etapaSelecionada.valorTotal)}</strong>
          </article>
        </div>
      </div>
    </aside>
  );
}