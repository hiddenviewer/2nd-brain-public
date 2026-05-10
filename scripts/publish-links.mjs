import { execFileSync } from 'node:child_process'

function run(command, args, options = {}) {
  return execFileSync(command, args, {
    encoding: 'utf8',
    stdio: options.stdio || 'pipe',
  }).trim()
}

function hasChanges() {
  const status = run('git', ['status', '--porcelain'])
  return status.length > 0
}

run('npm', ['run', 'export:links'], { stdio: 'inherit' })
run('npm', ['run', 'build'], { stdio: 'inherit' })

if (!hasChanges()) {
  console.log('No public link changes to publish.')
  process.exit(0)
}

run('git', ['add', 'src/data/links.json'])
if (!hasChanges()) {
  console.log('No staged public link changes to publish.')
  process.exit(0)
}

const stamp = new Date().toISOString().slice(0, 16).replace('T', ' ')
run('git', ['commit', '-m', `Update public links (${stamp} UTC)`], { stdio: 'inherit' })
run('git', ['push'], { stdio: 'inherit' })
