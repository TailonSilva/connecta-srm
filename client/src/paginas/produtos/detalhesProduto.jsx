export function DetalhesProduto({ produto }) {
  return (
    <div className="celulaProdutoDetalhes">
      <strong>{produto.descricao}</strong>
      <span>{produto.referencia || 'Referencia nao informada'}</span>
    </div>
  );
}
