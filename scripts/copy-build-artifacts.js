const fs = require('fs')
const path = require('path')

const root = process.cwd()
const outDir = path.join(root, 'out')
const distDir = path.join(root, 'dist')
const buildDir = path.join(root, 'build')

// Prepare complete Next.js standalone and static output artifacts
const standaloneDir = path.join(root, '.next', 'standalone')
const staticDir = path.join(root, '.next', 'static')
const publicDir = path.join(root, 'public')

if (fs.existsSync(standaloneDir)) {
  try {
    // Copy public into standalone/public
    if (fs.existsSync(publicDir)) {
      const targetPublic = path.join(standaloneDir, 'public')
      fs.mkdirSync(targetPublic, { recursive: true })
      fs.cpSync(publicDir, targetPublic, { recursive: true })
    }

    // Copy .next/static into standalone/.next/static
    if (fs.existsSync(staticDir)) {
      const targetStatic = path.join(standaloneDir, '.next', 'static')
      fs.mkdirSync(targetStatic, { recursive: true })
      fs.cpSync(staticDir, targetStatic, { recursive: true })
    }

    console.log('✓ Successfully prepared .next/standalone with public and static assets')
  } catch (err) {
    console.error('Error preparing standalone assets:', err)
  }
}

// Also ensure out, dist, and build directories are populated
if (fs.existsSync(outDir)) {
  try {
    fs.cpSync(outDir, distDir, { recursive: true })
    fs.cpSync(outDir, buildDir, { recursive: true })
    console.log('✓ Successfully mirrored build artifacts from out/ to dist/ and build/')
  } catch (err) {
    console.error('Error copying out artifacts:', err)
  }
} else if (fs.existsSync(standaloneDir)) {
  try {
    fs.mkdirSync(distDir, { recursive: true })
    fs.mkdirSync(buildDir, { recursive: true })
    fs.cpSync(standaloneDir, distDir, { recursive: true })
    fs.cpSync(standaloneDir, buildDir, { recursive: true })
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true })
      fs.cpSync(standaloneDir, outDir, { recursive: true })
    }
    console.log('✓ Successfully mirrored standalone artifacts to dist/, build/, and out/')
  } catch (err) {
    console.error('Error copying standalone artifacts:', err)
  }
}

