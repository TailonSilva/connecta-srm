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

export function AvatarCliente({ cliente }) {
  if (cliente.imagem) {
    return (
      <div className="celulaAvatarCliente">
        <img
          className="avatarClienteImagem"
          src={cliente.imagem}
          alt={`Imagem de ${cliente.nomeFantasia || cliente.razaoSocial}`}
        />
      </div>
    );
  }

  return (
    <div className="celulaAvatarCliente" aria-hidden="true">
      <span className="avatarClientePlaceholder">{obterIniciais(cliente)}</span>
    </div>
  );
}
