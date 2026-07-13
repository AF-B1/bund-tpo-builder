$root = Split-Path $PSScriptRoot -Parent
$out = Join-Path $root 'dist\Bund-TPO-Builder.html'

function Strip-ModuleSyntax([string]$code) {
    $code = [regex]::Replace($code, '(?ms)^import\s+.+?;\r?\n', '')
    $code = $code -replace '\bexport ', ''
    return $code.Trim()
}

$css = Get-Content (Join-Path $root 'src\styles\app.css') -Raw

$jsFiles = @(
    'src\config.js',
    'src\profile\periods.js',
    'src\state.js',
    'src\profile\analytics.js',
    'src\render\split-view.js',
    'src\render\full-profile.js',
    'src\render\layout.js',
    'src\render\session-status.js',
    'src\keyboard.js',
    'src\main.js'
)

$js = ($jsFiles | ForEach-Object {
    Strip-ModuleSyntax (Get-Content (Join-Path $root $_) -Raw)
}) -join "`n`n"

$html = @"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bund TPO Builder</title>
  <style>
$css
  </style>
</head>
<body>
  <div id="app-shell" class="split-only">
    <div class="workspace">
      <aside id="session-status" class="session-sidebar" aria-live="polite"></aside>
      <section class="panel split-panel" aria-label="Split View">
        <div id="split-view"></div>
      </section>
      <section class="panel full-panel" aria-label="Full Profile" hidden>
        <div id="full-profile"></div>
      </section>
    </div>
  </div>
  <script>
$js
  </script>
</body>
</html>
"@

New-Item -ItemType Directory -Path (Split-Path $out) -Force | Out-Null
Set-Content -Path $out -Value $html -Encoding UTF8
Write-Host "Built $out"