export function DetalhesCliente({ cliente }) {
  return (
    <div className="celulaClienteDetalhes">
      <div className="topoClienteDetalhes">
        <strong>{cliente.nomeFantasia || cliente.razaoSocial}</strong>
        <span className="codigoCliente">#{String(cliente.idCliente).padStart(4, '0')}</span>
      </div>

      <span>{cliente.cnpj || 'CNPJ nao informado'}</span>
    </div>
  );
}
