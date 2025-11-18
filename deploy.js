const { NodeSSH } = require("node-ssh");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const readline = require("readline");
require('dotenv').config();
const ssh = new NodeSSH();
const {PROJECT_NAME, SSH_HOST, SSH_USERNAME} = process.env;

// Helper pour les couleurs (remplace chalk pour compatibilité CommonJS)
const colors = {
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
};

// Helper pour poser une question
function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

// Helper pour poser une question avec masquage (mot de passe)
function askPassword(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    let password = '';
    process.stdout.write(query);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    const onData = (char) => {
      char = char.toString();
      switch (char) {
        case '\n':
        case '\r':
        case '\u0004':
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdin.removeListener('data', onData);
          process.stdout.write('\n');
          rl.close();
          resolve(password);
          break;
        case '\u0003':
          process.exit();
        case '\u007f':
          if (password.length > 0) {
            password = password.slice(0, -1);
            process.stdout.write('\b \b');
          }
          break;
        default:
          password += char;
          process.stdout.write('*');
          break;
      }
    };

    process.stdin.on('data', onData);
  });
}

async function askParams() {
  const params = {};

  if (!SSH_HOST) {
    params.ip = await askQuestion("Adresse IP du serveur : ");
  }

  if (!SSH_USERNAME) {
    params.username = await askQuestion("Nom d'utilisateur SSH : ");
  }

  console.log("\nMéthode d'authentification :");
  console.log("1. Mot de passe");
  console.log("2. Clé SSH");
  const authChoice = await askQuestion("Choisissez (1 ou 2) : ");

  if (authChoice === "1") {
    params.authMethod = "Mot de passe";
    params.password = await askPassword("Mot de passe SSH : ");
  } else {
    params.authMethod = "Clé SSH";
    params.privateKey = await askQuestion("Chemin vers la clé SSH : ");
  }

  if (!PROJECT_NAME) {
    params.projectName = await askQuestion("Nom du projet : ");
  }

  return params;
}

function buildLocalProject() {
  console.log(colors.blue("🛠️ Build local du projet Vite..."));
  try {
    execSync("npm run build", { stdio: "inherit" });
    const distPath = path.join(process.cwd(), "dist");
    if (!fs.existsSync(distPath)) {
      console.log(colors.red("❌ Dossier dist/ introuvable après le build"));
      process.exit(1);
    }
    console.log(colors.green("✅ Build local terminé"));
  } catch (error) {
    console.error(
      colors.red("❌ Erreur pendant le build local :"),
      error.message
    );
    process.exit(1);
  }
}

async function uploadBuild({
  ip,
  username,
  password,
  privateKey,
  projectName,
}) {
  const remoteDir = `/var/www/${projectName || PROJECT_NAME}/`;
  const localDist = path.join(process.cwd(), "dist");

  console.log(colors.blue(`🔗 Connexion au serveur ${ip || SSH_HOST}...`));
  try {
    await ssh.connect({
      host: ip || SSH_HOST,
      username : username || SSH_USERNAME,
      password : password ,
      privateKey,
    });

    console.log(colors.green("✅ Connexion SSH établie"));

    console.log(colors.blue(`📤 Upload du dossier dist/ vers ${remoteDir}...`));
    await ssh.putDirectory(localDist, remoteDir, {
      recursive: true,
      concurrency: 10,
      validate: (itemPath) => {
        // Accepte tous les fichiers et dossiers
        return true;
      },
      tick: (localPath, remotePath, error) => {
        if (error) {
          console.log(colors.red(`❌ Échec : ${localPath}`));
        } else {
          console.log(colors.green(`✅ Uploadé : ${localPath}`));
        }
      },
    });

    console.log(colors.yellow("🎉 Upload terminé avec succès !"));
  } catch (error) {
    console.error(colors.red("❌ Erreur pendant l'upload :"), error.message);
  } finally {
    ssh.dispose();
  }
}

(async () => {
  buildLocalProject();
  const params = await askParams();
  await uploadBuild(params);
})();
