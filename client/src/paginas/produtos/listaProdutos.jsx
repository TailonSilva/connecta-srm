import { GradePadrao } from '../../componentes/comuns/gradePadrao';
import { CabecalhoGradeProdutos } from './cabecalhoGradeProdutos';
import { LinhaProduto } from './linhaProduto';

export function ListaProdutos({
  produtos,
  carregando,
  mensagemErro
}) {
  return (
    <GradePadrao
      cabecalho={<CabecalhoGradeProdutos />}
      carregando={carregando}
      mensagemErro={mensagemErro}
      temItens={produtos.length > 0}
      mensagemCarregando="Carregando produtos..."
      mensagemVazia="Nenhum produto encontrado."
    >
      {produtos.map((produto) => (
        <LinhaProduto key={produto.idProduto} produto={produto} />
      ))}
    </GradePadrao>
  );
}
