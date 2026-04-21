import { CorpoPagina } from '../layout/corpoPagina';
import { ListaFornecedores } from './fornecedores-listaFornecedores';

export function CorpoFornecedores({
  empresa,
  fornecedores = [],
  carregando,
  mensagemErro,
  aoEditarFornecedor,
  aoConsultarFornecedor,
  aoInativarFornecedor
}) {
  const listaFornecedores = Array.isArray(fornecedores) ? fornecedores : [];

  return (
    <CorpoPagina>
      <div className="gradePainelFornecedores">
        <ListaFornecedores
          empresa={empresa}
          fornecedores={listaFornecedores}
          carregando={carregando}
          mensagemErro={mensagemErro}
          aoEditarFornecedor={aoEditarFornecedor}
          aoConsultarFornecedor={aoConsultarFornecedor}
          aoInativarFornecedor={aoInativarFornecedor}
        />
      </div>
    </CorpoPagina>
  );
}
