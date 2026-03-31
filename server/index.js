const app = require('./app');
const { caminhoBanco } = require('./configuracoes/banco');
const porta = process.env.PORT || 3001;

app.listen(porta, () => {
  console.log(`Connecta CRM backend ativo em http://localhost:${porta}`);
  console.log(`Banco SQLite zerado em ${caminhoBanco}`);
});
