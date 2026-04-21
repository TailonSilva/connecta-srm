import { ModalBuscaTabela } from './modalBuscaTabela';
import { formatarCodigoFornecedor } from '../../utilitarios/codigoFornecedor';

export function ModalBuscaFornecedores({
  aberto,
  empresa = null,
  fornecedores = [],
  placeholder = 'Pesquisar fornecedor no grid',
  ariaLabelPesquisa = 'Pesquisar fornecedor no grid',
  rotuloAcaoPrimaria = '',
  tituloAcaoPrimaria = '',
  iconeAcaoPrimaria = 'adicionar',
  aoAcionarPrimaria = null,
  aoSelecionar,
  aoFechar
}) {
  return (
    <ModalBuscaTabela
      aberto={aberto}
      titulo="Buscar fornecedor"
      placeholder={placeholder}
      ariaLabelPesquisa={ariaLabelPesquisa}
      colunas={[
        {
          key: 'codigo',
          label: 'Codigo',
          render: (fornecedor) => formatarCodigoFornecedor(fornecedor, empresa)
        },
        { key: 'razaoSocial', label: 'Razao social', render: (fornecedor) => fornecedor.razaoSocial || '-' },
        { key: 'nomeFantasia', label: 'Nome fantasia', render: (fornecedor) => fornecedor.nomeFantasia || '-' },
        { key: 'cidade', label: 'Cidade', render: (fornecedor) => fornecedor.cidade || '-' },
        { key: 'estado', label: 'UF', render: (fornecedor) => fornecedor.estado || '-' },
        { key: 'cnpj', label: 'CNPJ', render: (fornecedor) => fornecedor.cnpj || '-' }
      ]}
      registros={fornecedores}
      obterTextoBusca={(fornecedor) => [
        fornecedor.idFornecedor,
        fornecedor.codigoAlternativo,
        fornecedor.razaoSocial,
        fornecedor.nomeFantasia,
        fornecedor.cidade,
        fornecedor.estado,
        fornecedor.cnpj
      ].join(' ')}
      obterChaveRegistro={(fornecedor) => fornecedor.idFornecedor}
      rotuloAcaoPrimaria={rotuloAcaoPrimaria}
      tituloAcaoPrimaria={tituloAcaoPrimaria}
      iconeAcaoPrimaria={iconeAcaoPrimaria}
      aoAcionarPrimaria={aoAcionarPrimaria}
      aoSelecionar={aoSelecionar}
      aoFechar={aoFechar}
    />
  );
}
