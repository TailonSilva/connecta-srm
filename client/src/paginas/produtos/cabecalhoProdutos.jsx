import { Botao } from '../../componentes/comuns/botao';

export function CabecalhoProdutos() {
  return (
    <header className="cabecalhoPagina">
      <div>
        <h1>Produtos</h1>
        <p>Gerencie o catalogo e a consulta dos produtos do CRM.</p>
      </div>

      <div className="acoesCabecalhoPagina">
        <Botao variante="secundario" icone="importar">
          Importar
        </Botao>
        <Botao variante="primario" icone="adicionar">
          Novo produto
        </Botao>
      </div>
    </header>
  );
}
