import { AcoesRegistro } from '../../componentes/comuns/acoesRegistro';
import { DetalhesProduto } from './detalhesProduto';
import { ImagemProduto } from './imagemProduto';

function formatarPreco(valor) {
  const numero = Number(valor || 0);

  return numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

export function LinhaProduto({ produto }) {
  return (
    <article className="linhaProduto" role="row">
      <ImagemProduto produto={produto} />
      <DetalhesProduto produto={produto} />
      <span>{produto.nomeGrupo}</span>
      <span>{produto.nomeMarca}</span>
      <span>{produto.nomeUnidade}</span>
      <span>{formatarPreco(produto.preco)}</span>
      <span className={`etiquetaStatus ${produto.status ? 'ativo' : 'inativo'}`}>
        {produto.status ? 'Ativo' : 'Inativo'}
      </span>
      <AcoesRegistro
        rotuloConsulta="Consultar produto"
        rotuloEdicao="Editar produto"
        rotuloInativacao="Inativar produto"
      />
    </article>
  );
}
