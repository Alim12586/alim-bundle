#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import AdmZip from "adm-zip"; // npm install adm-zip

const args = process.argv.slice(2);
const command = args[0];

if (!command) {
  console.log(`
Kullanım:
  alim-bundle build <aab_dosyasi> <output_prefix>
  alim-bundle install <apk_dosyasi>
`);
  process.exit(1);
}

switch (command) {
  case "build":
    buildAll(args[1], args[2]);
    break;
  case "install":
    installApk(args[1]);
    break;
  default:
    console.log("Bilinmeyen komut:", command);
}

function buildAll(bundle, prefix) {
  if (!bundle) {
    console.error("Lütfen .aab dosyası belirtin.");
    process.exit(1);
  }
  prefix = prefix || "alim-output";

  const apksFile = `${prefix}.apks`;
  const apkFile = `${prefix}.apk`;
  const zipFile = `${prefix}.zip`;

  console.log(`[INFO] APK seti oluşturuluyor: ${apksFile}`);
  // Burada bundletool çağrısı yapılabilir, şimdilik simülasyon
  execSync(`echo Simülasyon: ${bundle} → ${apksFile}`, { stdio: "inherit" });

  console.log(`[INFO] Universal APK çıkarılıyor: ${apkFile}`);
  fs.writeFileSync(apkFile, "dummy-apk-content");

  console.log(`[INFO] ZIP paketi hazırlanıyor: ${zipFile}`);
  const zip = new AdmZip();
  zip.addLocalFile(apksFile);
  zip.addLocalFile(apkFile);
  zip.writeZip(zipFile);

  console.log("[OK] Çıktılar hazır:");
  console.log(`  - ${apksFile}`);
  console.log(`  - ${apkFile}`);
  console.log(`  - ${zipFile}`);
}

function installApk(apk) {
  if (!apk) {
    console.error("Lütfen .apk dosyası belirtin.");
    process.exit(1);
  }
  console.log(`[INFO] APK cihazınıza yükleniyor: ${apk}`);
  execSync(`adb install -r ${apk}`, { stdio: "inherit" });
}
