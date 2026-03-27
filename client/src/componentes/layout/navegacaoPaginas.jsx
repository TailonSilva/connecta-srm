export function NavegacaoPaginas({
  itens,
  paginaAtiva,
  aoSelecionarPagina
}) {
  return (
    <div className="navegacaoPaginas">
      {itens.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`abaPagina ${paginaAtiva === item.id ? 'ativa' : ''}`}
          onClick={() => aoSelecionarPagina(item.id)}
        >
          {item.rotulo}
        </button>
      ))}
    </div>
  );
}
