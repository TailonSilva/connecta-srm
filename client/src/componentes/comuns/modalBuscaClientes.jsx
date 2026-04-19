import { ModalBuscaTabela } from './modalBuscaTabela';
import { formatarCodigoCliente } from '../../utilitarios/codigoCliente';

export function ModalBuscaClientes({
  aberto,
  empresa = null,
  clientes = [],
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
          render: (cliente) => formatarCodigoCliente(cliente, empresa)
        },
        { key: 'razaoSocial', label: 'Razao social', render: (cliente) => cliente.razaoSocial || '-' },
        { key: 'nomeFantasia', label: 'Nome fantasia', render: (cliente) => cliente.nomeFantasia || '-' },
        { key: 'cidade', label: 'Cidade', render: (cliente) => cliente.cidade || '-' },
        { key: 'estado', label: 'UF', render: (cliente) => cliente.estado || '-' },
        { key: 'cnpj', label: 'CNPJ', render: (cliente) => cliente.cnpj || '-' }
      ]}
      registros={clientes}
      obterTextoBusca={(cliente) => [
        cliente.idCliente,
        cliente.codigoAlternativo,
        cliente.razaoSocial,
        cliente.nomeFantasia,
        cliente.cidade,
        cliente.estado,
        cliente.cnpj
      ].join(' ')}
      obterChaveRegistro={(cliente) => cliente.idCliente}
      rotuloAcaoPrimaria={rotuloAcaoPrimaria}
      tituloAcaoPrimaria={tituloAcaoPrimaria}
      iconeAcaoPrimaria={iconeAcaoPrimaria}
      aoAcionarPrimaria={aoAcionarPrimaria}
      aoSelecionar={aoSelecionar}
      aoFechar={aoFechar}
    />
  );
}
