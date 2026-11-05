const fs = require('fs')
const path = require('path')

const root = process.cwd()
const outDir = path.join(root, 'out')
const distDir = path.join(root, 'dist')
const buildDir = path.join(root, 'build')

if (fs.existsSync(outDir)) {
  try {
    fs.cpSync(outDir, distDir, { recursive: true })
    fs.cpSync(outDir, buildDir, { recursive: true })
    console.log('✓ Successfully mirrored build artifacts from out/ to dist/ and build/')
  } catch (err) {
    console.error('Error copying build artifacts:', err)
  }
} else {
  console.warn('⚠ out/ directory not found after build')
}
