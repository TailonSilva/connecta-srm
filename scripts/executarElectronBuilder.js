const { spawn } = require('node:child_process');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');

const raizProjeto = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const pastaSaidaFinal = path.join(raizProjeto, 'dist', 'electron');
const pastaSaidaTemporaria = path.join(os.tmpdir(), 'connecta-crm-electron-dist');

const comando = process.platform === 'win32'
  ? path.join(raizProjeto, 'node_modules', '.bin', 'electron-builder.cmd')
  : path.join(raizProjeto, 'node_modules', '.bin', 'electron-builder');

executar().catch((erro) => {
  console.error('Falha ao executar o electron-builder:', erro);
  process.exit(1);
});

async function executar() {
  await prepararPastaTemporaria();

  const codigo = await executarBuilder();
  if (codigo !== 0) {
    process.exit(codigo ?? 1);
    return;
  }

  await sincronizarArtefatosFinais();
  await limparPastaTemporaria();

  console.log('Artefatos finais sincronizados em dist/electron');
  process.exit(0);
}

async function prepararPastaTemporaria() {
  await fs.rm(pastaSaidaTemporaria, { recursive: true, force: true });
  await fs.mkdir(pastaSaidaTemporaria, { recursive: true });
}

function executarBuilder() {
  return new Promise((resolve, reject) => {
    const processo = spawn(comando, [
      ...args,
      `--config.directories.output=${pastaSaidaTemporaria}`
    ], {
      cwd: raizProjeto,
      stdio: 'inherit',
      shell: process.platform === 'win32'
    });

    processo.on('error', reject);
    processo.on('exit', resolve);
  });
}

async function sincronizarArtefatosFinais() {
  await fs.rm(pastaSaidaFinal, { recursive: true, force: true });
  await fs.mkdir(pastaSaidaFinal, { recursive: true });

  const entradas = await fs.readdir(pastaSaidaTemporaria, { withFileTypes: true });

  for (const entrada of entradas) {
    if (entrada.name === 'win-unpacked') {
      continue;
    }

    const origem = path.join(pastaSaidaTemporaria, entrada.name);
    const destino = path.join(pastaSaidaFinal, entrada.name);
    await fs.cp(origem, destino, { recursive: true, force: true });
  }
}

async function limparPastaTemporaria() {
  try {
    await fs.rm(pastaSaidaTemporaria, { recursive: true, force: true });
  } catch (erro) {
    console.warn('Nao foi possivel limpar a pasta temporaria de empacotamento:', erro.message);
  }
}