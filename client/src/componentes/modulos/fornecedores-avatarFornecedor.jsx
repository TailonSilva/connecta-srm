function obterIniciais(cliente) {
  const nomeBase = cliente.nomeFantasia || cliente.razaoSocial || 'Cliente';
  const partesNome = nomeBase
    .split(' ')
    .map((parte) => parte.trim())
    .filter(Boolean)
    .slice(0, 2);

  if (partesNome.length === 0) {
    return 'CL';
  }

  return partesNome.map((parte) => parte[0].toUpperCase()).join('');
}

export function AvatarFornecedor({ cliente }) {
  if (cliente.imagem) {
    return (
      <div className="celulaAvatarFornecedor">
        <img
          className="AvatarFornecedorImagem"
          src={cliente.imagem}
          alt={`Imagem de ${cliente.nomeFantasia || cliente.razaoSocial}`}
        />
      </div>
    );
  }

  return (
    <div className="celulaAvatarFornecedor" aria-hidden="true">
      <span className="AvatarFornecedorPlaceholder">{obterIniciais(cliente)}</span>
    </div>
  );
}

