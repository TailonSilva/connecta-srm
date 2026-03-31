import { ModalBuscaTabela } from './modalBuscaTabela';

export function ModalBuscaClientes({
  aberto,
  clientes = [],
  placeholder = 'Pesquisar cliente no grid',
  ariaLabelPesquisa = 'Pesquisar cliente no grid',
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
      titulo="Buscar cliente"
      placeholder={placeholder}
      ariaLabelPesquisa={ariaLabelPesquisa}
      rotuloAcaoPrimaria={rotuloAcaoPrimaria}
      tituloAcaoPrimaria={tituloAcaoPrimaria}
      iconeAcaoPrimaria={iconeAcaoPrimaria}
      aoAcionarPrimaria={aoAcionarPrimaria}
      colunas={[
        {
          key: 'codigo',
          label: 'Codigo',
          render: (cliente) => `#${String(cliente.idCliente).padStart(4, '0')}`
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
        cliente.razaoSocial,
        cliente.nomeFantasia,
        cliente.cidade,
        cliente.estado,
        cliente.cnpj
      ].join(' ')}
      obterChaveRegistro={(cliente) => cliente.idCliente}
      aoSelecionar={aoSelecionar}
      aoFechar={aoFechar}
    />
  );
}
