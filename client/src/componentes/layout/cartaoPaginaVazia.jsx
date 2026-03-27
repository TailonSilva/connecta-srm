export function CartaoPaginaVazia({ titulo, descricao }) {
  return (
    <section className="cartaoPaginaVazia">
      <div className="faixaDestaque" />
      <div className="conteudoCartaoVazio">
        <h2>{titulo}</h2>
        <p>{descricao}</p>
      </div>
    </section>
  );
}
