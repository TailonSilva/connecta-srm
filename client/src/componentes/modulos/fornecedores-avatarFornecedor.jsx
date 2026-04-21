function obterIniciais(fornecedor) {
  const nomeBase = fornecedor.nomeFantasia || fornecedor.razaoSocial || 'Fornecedor';
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

export function AvatarFornecedor({ fornecedor }) {
  if (fornecedor.imagem) {
    return (
      <div className="celulaAvatarFornecedor">
        <img
          className="AvatarFornecedorImagem"
          src={fornecedor.imagem}
          alt={`Imagem de ${fornecedor.nomeFantasia || fornecedor.razaoSocial}`}
        />
      </div>
    );
  }

  return (
    <div className="celulaAvatarFornecedor" aria-hidden="true">
      <span className="AvatarFornecedorPlaceholder">{obterIniciais(fornecedor)}</span>
    </div>
  );
}

