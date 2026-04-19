import '../../recursos/estilos/funilVendasCardDetalhe.css';
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

  if (descricaoNormalizada.includes('pedido')) {
    return 'pedido';
  }

  if (descricaoNormalizada.includes('fechado')) {
    return 'selo';
  }

  const icones = ['orcamento', 'contato', 'mensagem', 'pagamento', 'pedido', 'selo'];
  return icones[indice % icones.length];
}

export function FunilVendasCardDetalhe({ referencia, etapaSelecionada, indiceSelecionado, participacaoValor, ticketMedio }) {
  return (
    <aside
      ref={referencia}
      className="funilVendasCardDetalhe"
      style={{ '--cor-etapa-funil': etapaSelecionada.cor || '#EC8702' }}
    >
      <div className="funilVendasCardDetalheTopo">
        <div>
          <span className="funilVendasCardDetalheRotulo">Etapa selecionada</span>
          <h3>{etapaSelecionada.descricao}</h3>
        </div>

        <span className="funilVendasCardDetalheIcone" aria-hidden="true">
          <Icone nome={obterIconeEtapa(etapaSelecionada.descricao, indiceSelecionado)} />
        </span>
      </div>

      <div className="funilVendasCardDetalheCorpo" aria-hidden="true">
        <div className="funilVendasCardDetalheAnel" style={{ '--percentual-etapa-funil': `${participacaoValor}%` }}>
          <div>
            <strong>{participacaoValor}%</strong>
            <span>do total</span>
          </div>
        </div>

        <div className="funilVendasCardDetalheResumo">
          <article>
            <span>Posicao</span>
            <strong>{String(indiceSelecionado + 1).padStart(2, '0')}</strong>
          </article>
          <article>
            <span>Qtd.</span>
            <strong>{formatarNumero(etapaSelecionada.quantidadeOrcamentos)}</strong>
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