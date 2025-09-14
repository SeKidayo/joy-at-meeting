#!/usr/bin/env node

/**
 * 发布前验证脚本
 * 确保项目在发布前满足所有质量要求
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 颜色输出
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  log(`\n🔍 ${description}...`, 'blue');
  try {
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} 通过`, 'green');
    return true;
  } catch (error) {
    log(`❌ ${description} 失败`, 'red');
    return false;
  }
}

function checkFile(filePath, description) {
  log(`\n📁 检查 ${description}...`, 'blue');
  if (fs.existsSync(filePath)) {
    log(`✅ ${description} 存在`, 'green');
    return true;
  } else {
    log(`❌ ${description} 不存在: ${filePath}`, 'red');
    return false;
  }
}

function checkPackageJson() {
  log('\n📦 检查 package.json 配置...', 'blue');
  const packagePath = path.join(process.cwd(), 'package.json');
  
  if (!fs.existsSync(packagePath)) {
    log('❌ package.json 不存在', 'red');
    return false;
  }
  
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const requiredFields = ['name', 'version', 'description', 'main', 'types', 'author', 'license', 'repository'];
  
  let allFieldsPresent = true;
  
  requiredFields.forEach(field => {
    if (!pkg[field]) {
      log(`❌ package.json 缺少必需字段: ${field}`, 'red');
      allFieldsPresent = false;
    }
  });
  
  if (allFieldsPresent) {
    log('✅ package.json 配置完整', 'green');
  }
  
  return allFieldsPresent;
}

function checkDistFiles() {
  log('\n📂 检查构建产物...', 'blue');
  const distPath = path.join(process.cwd(), 'dist');
  
  if (!fs.existsSync(distPath)) {
    log('❌ dist 目录不存在，请先运行 npm run build', 'red');
    return false;
  }
  
  const requiredFiles = ['index.js', 'index.esm.js', 'index.d.ts'];
  let allFilesPresent = true;
  
  requiredFiles.forEach(file => {
    const filePath = path.join(distPath, file);
    if (!fs.existsSync(filePath)) {
      log(`❌ 构建产物缺少文件: ${file}`, 'red');
      allFilesPresent = false;
    }
  });
  
  if (allFilesPresent) {
    log('✅ 构建产物完整', 'green');
  }
  
  return allFilesPresent;
}

function main() {
  log('🚀 开始发布前验证...', 'yellow');
  
  const checks = [
    () => checkPackageJson(),
    () => runCommand('npm run lint', 'ESLint 检查'),
    () => runCommand('npm run type-check', 'TypeScript 类型检查'),
    () => runCommand('npm run test', '单元测试'),
    () => runCommand('npm run build', '项目构建'),
    () => checkDistFiles(),
    () => checkFile('README.md', 'README.md'),
    () => checkFile('LICENSE', 'LICENSE 文件'),
    () => checkFile('.npmignore', '.npmignore 文件')
  ];
  
  let allPassed = true;
  
  for (const check of checks) {
    if (!check()) {
      allPassed = false;
    }
  }
  
  log('\n' + '='.repeat(50), 'blue');
  
  if (allPassed) {
    log('🎉 所有检查通过！项目已准备好发布', 'green');
    log('\n可以运行以下命令进行发布:', 'blue');
    log('  npm run release:patch  # 补丁版本', 'yellow');
    log('  npm run release:minor  # 次要版本', 'yellow');
    log('  npm run release:major  # 主要版本', 'yellow');
    process.exit(0);
  } else {
    log('❌ 发布前检查失败，请修复上述问题后重试', 'red');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };