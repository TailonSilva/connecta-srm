import { Botao } from '../../componentes/comuns/botao';

export function CabecalhoClientes() {
  return (
    <header className="cabecalhoPagina">
      <div>
        <h1>Clientes</h1>
        <p>Gerencie o cadastro e a consulta dos clientes do CRM.</p>
      </div>

      <div className="acoesCabecalhoPagina">
        <Botao variante="secundario" icone="importar">
          Importar
        </Botao>
        <Botao variante="primario" icone="adicionar">
          Novo cliente
        </Botao>
      </div>
    </header>
  );
}
