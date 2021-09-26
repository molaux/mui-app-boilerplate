const { spawnSync } = require('child_process')
const path = require('path')

const source = path.join('src', 'ui', 'icon.png')
const sizes = [
  16, 32, 48, 70, 96, 120, 128, 152, 167, 180, 196, 228, 270, 310
]

const convert = (source, target, width) => {
  console.log(`Converting to ${target}...`)
  const { stderr } = spawnSync('convert', [
    '-background', 'none',
    source,
    '-resize', `${width}x`,
    target
  ])
  if (stderr.length) {
    // eslint-disable-next-line no-console
    console.error(stderr.toString())
  }
}

const png2icns = (source, target) => {
  console.log(`Converting to ${target}...`)
  const { stderr } = spawnSync('png2icns', [
    target,
    source
  ])

  if (stderr.length) {
    // eslint-disable-next-line no-console
    console.error(stderr.toString())
  }
}

for (const size of sizes) {
  convert(source, path.join('public', 'assets', `favicon-${size}x${size}.png`), size)
}
convert(source, path.join('public', 'icons', '512x512.png'), 512)
convert(source, path.join('public', 'icons', 'icon.png'), 512)
png2icns(path.join('public', 'icons', '512x512.png'), path.join('public', 'icons', 'icon.icns'))

convert(source, path.join('icons', '512x512.png'), 512)
convert(source, path.join('icons', 'icon.png'), 512)
png2icns(path.join('icons', '512x512.png'), path.join('icons', 'icon.icns'))
