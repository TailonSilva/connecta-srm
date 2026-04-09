import { SecaoGraficosDuplosInicio } from './secaoGraficosDuplosInicio';

export function SecaoFunilOrcamentosInicio({ itens }) {
  return (
    <SecaoGraficosDuplosInicio
      titulo="Funil de orcamentos"
      subtitulo=""
      colunasPainel={2}
      modoExibicao="lista"
      ajudaSecao={{
        conceito: 'Quantidade de produtos e valor total por etapa do funil, respeitando ordem e etapas consideradas.'
      }}
      itens={itens}
      mensagemVazia="Nenhuma etapa marcada para considerar no funil ou nenhum orcamento em aberto nessas etapas."
      tituloValor="Valor total"
      tituloQuantidade="Quantidade"
      obterChave={(item) => item.idEtapaOrcamento}
      obterRotulo={(item) => item.descricao}
      obterValorTexto={(item) => item.valor}
      obterValorPercentual={(item) => item.percentualValor}
      obterQuantidadeTexto={(item) => `${item.quantidadeItens} itens`}
      obterQuantidadePercentual={(item) => item.percentualProdutos}
      obterCorValor={(item) => item.cor || ''}
      obterCorQuantidade={(item) => item.cor || ''}
      obterAjuda={(item) => item.ajuda}
    />
  );
}
