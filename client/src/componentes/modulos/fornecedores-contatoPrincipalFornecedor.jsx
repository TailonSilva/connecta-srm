export function ContatoPrincipalFornecedor({ fornecedor }) {
  return (
    <div className="celulaContatoPrincipal">
      <strong>{fornecedor.nomeContatoPrincipal || 'Nao informado'}</strong>
      <span>{fornecedor.emailContatoPrincipal || 'E-mail nao informado'}</span>
    </div>
  );
}

