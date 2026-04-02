import '../../recursos/estilos/funilVendasCabecalho.css';
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

export function FunilVendasCabecalho({ totalOrcamentos, totalValor }) {
  return (
    <header className="funilVendasCabecalho">
      <div className="funilVendasCabecalhoConteudo">
        <span className="funilVendasCabecalhoRotulo">Funil de vendas</span>
        <h2>Visão Por Etapa do Orcamento</h2>
      </div>

      <div className="funilVendasCabecalhoResumo">
        <article className="funilVendasCabecalhoResumoCard">
          <div className="funilVendasCabecalhoResumoCardConteudo">
            <span>Total de orcamentos</span>
            <strong>{formatarNumero(totalOrcamentos)}</strong>
          </div>
          <span className="funilVendasCabecalhoResumoCardIcone" aria-hidden="true">
            <Icone nome="orcamento" />
          </span>
        </article>
        <article className="funilVendasCabecalhoResumoCard">
          <div className="funilVendasCabecalhoResumoCardConteudo">
            <span>Valor total</span>
            <strong>{formatarMoeda(totalValor)}</strong>
          </div>
          <span className="funilVendasCabecalhoResumoCardIcone" aria-hidden="true">
            <Icone nome="pagamento" />
          </span>
        </article>
      </div>
    </header>
  );
}