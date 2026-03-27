import { AvatarCliente } from './avatarCliente';
import { AcoesRegistro } from '../../componentes/comuns/acoesRegistro';
import { ContatoPrincipalCliente } from './contatoPrincipalCliente';
import { DetalhesCliente } from './detalhesCliente';

export function LinhaCliente({ cliente }) {
  return (
    <article className="linhaCliente" role="row">
      <AvatarCliente cliente={cliente} />
      <DetalhesCliente cliente={cliente} />
      <span>{cliente.cidade}</span>
      <span>{cliente.estado || 'Nao informado'}</span>
      <ContatoPrincipalCliente cliente={cliente} />
      <span>{cliente.nomeVendedor}</span>
      <span className={`etiquetaStatus ${cliente.status ? 'ativo' : 'inativo'}`}>
        {cliente.status ? 'Ativo' : 'Inativo'}
      </span>
      <AcoesRegistro
        rotuloConsulta="Consultar cliente"
        rotuloEdicao="Editar cliente"
        rotuloInativacao="Inativar cliente"
      />
    </article>
  );
}
