const core = require('@actions/core');
const path = require('path');
const fs = require('fs')
const Fingerprint = require ("@expo/fingerprint");

async function run() {

  try {
    const projectPath = core.getInput("project-path") || "./";
    const fullProjectPath = path.resolve(projectPath);
    const currentFingerprint = await Fingerprint.createFingerprintAsync(fullProjectPath);

    const projectFingerprintPath = core.getInput('fingerprint-path') || "./.expo-fingerprint.json";
    const fullProjectFingerprintPath = path.resolve(projectFingerprintPath);

    const fingerprintExists = fs.existsSync(fullProjectFingerprintPath);

    let projectFingerprint;

    if (fingerprintExists) {
      const fullProjectFingerprint = fs.readFileSync(fullProjectFingerprintPath);
      projectFingerprint = JSON.parse(fullProjectFingerprint);
    }

    core.setOutput("matches", fingerprintExists ? currentFingerprint.hash === projectFingerprint.hash : false);

    fs.writeFileSync(fullProjectFingerprintPath, JSON.stringify(currentFingerprint));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
