module.exports = {
  hooks: {
    readPackage,
  }
}

function readPackage(pkg, context) {
  if (pkg.name == 'solid-start' && pkg.version.startsWith('0.1.')) {
    pkg.dependencies.rollup = "^2.0.0"
    context.log('Added rollup@^2.0.0 as dependency of solid-start')
  }
  return pkg
}
