import { CorpoPagina } from '../layout/corpoPagina';
import { ListaFornecedores } from './fornecedores-listaFornecedores';

export function CorpoFornecedores({
  empresa,
  fornecedores,
  clientes = [],
  carregando,
  mensagemErro,
  aoEditarCliente,
  aoConsultarCliente,
  aoInativarCliente
}) {
  const listaFornecedores = Array.isArray(fornecedores) ? fornecedores : clientes;

  return (
    <CorpoPagina>
      <div className="gradePainelClientes">
        <ListaFornecedores
          empresa={empresa}
          fornecedores={listaFornecedores}
          carregando={carregando}
          mensagemErro={mensagemErro}
          aoEditarCliente={aoEditarCliente}
          aoConsultarCliente={aoConsultarCliente}
          aoInativarCliente={aoInativarCliente}
        />
      </div>
    </CorpoPagina>
  );
}

