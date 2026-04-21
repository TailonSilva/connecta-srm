import '../../recursos/estilos/funilCotacoesCabecalho.css';
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

export function FunilCotacoesCabecalho({ totalCotacoes, totalValor }) {
  return (
    <header className="funilCotacoesCabecalho">
      <div className="funilCotacoesCabecalhoConteudo">
        <h2>Visão Por Etapa do Cotacao</h2>
      </div>

      <div className="funilCotacoesCabecalhoResumo">
        <article className="funilCotacoesCabecalhoResumoCard">
          <div className="funilCotacoesCabecalhoResumoCardConteudo">
            <span>Total de cotacoes</span>
            <strong>{formatarNumero(totalCotacoes)}</strong>
          </div>
          <span className="funilCotacoesCabecalhoResumoCardIcone" aria-hidden="true">
            <Icone nome="cotacao" />
          </span>
        </article>
        <article className="funilCotacoesCabecalhoResumoCard">
          <div className="funilCotacoesCabecalhoResumoCardConteudo">
            <span>Valor total</span>
            <strong>{formatarMoeda(totalValor)}</strong>
          </div>
          <span className="funilCotacoesCabecalhoResumoCardIcone" aria-hidden="true">
            <Icone nome="pagamento" />
          </span>
        </article>
      </div>
    </header>
  );
}