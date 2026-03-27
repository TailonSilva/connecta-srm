function obterTextoProduto(produto) {
  const textoBase = produto.referencia || produto.descricao || 'PR';

  return textoBase.slice(0, 2).toUpperCase();
}

export function ImagemProduto({ produto }) {
  if (produto.imagem) {
    return (
      <div className="celulaImagemProduto">
        <img
          className="imagemProduto"
          src={produto.imagem}
          alt={`Imagem de ${produto.descricao}`}
        />
      </div>
    );
  }

  return (
    <div className="celulaImagemProduto" aria-hidden="true">
      <span className="imagemProdutoPlaceholder">{obterTextoProduto(produto)}</span>
    </div>
  );
}
