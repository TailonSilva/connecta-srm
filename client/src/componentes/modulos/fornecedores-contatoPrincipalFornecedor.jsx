export function ContatoPrincipalFornecedor({ cliente }) {
  return (
    <div className="celulaContatoPrincipal">
      <strong>{cliente.nomeContatoPrincipal || 'Nao informado'}</strong>
      <span>{cliente.emailContatoPrincipal || 'E-mail nao informado'}</span>
    </div>
  );
}

