import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'

// Renders README.md with GitHub's own Markdown API (via the gh CLI) so the preview matches the profile page.
const markdown = readFileSync('README.md', 'utf8')
const html = execFileSync('gh', ['api', 'markdown', '-f', 'mode=gfm', '-f', `text=${markdown}`], { encoding: 'utf8' })

writeFileSync('preview.html', `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Profile README preview</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.8.1/github-markdown.min.css">
<style>
  body { margin: 0; background: #ffffff; }
  @media (prefers-color-scheme: dark) { body { background: #0d1117; } }
  .markdown-body { box-sizing: border-box; max-width: 896px; margin: 32px auto; padding: 24px; }
</style>
</head>
<body><article class="markdown-body">${html}</article></body>
</html>
`)
console.log('Wrote preview.html')
