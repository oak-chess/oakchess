$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$html = [IO.File]::ReadAllText((Join-Path $root 'index.html'))
$ids = [Collections.Generic.HashSet[int]]::new()
foreach ($m in [regex]::Matches($html, "(?m)^ln\([^,]+,\[([0-9,]+)\]")) {
  foreach ($n in $m.Groups[1].Value.Split(',')) { [void]$ids.Add([int]$n) }
}
# Pokémon mostrados diretamente em eventos, sem fazer parte das cartas da loja.
foreach ($m in [regex]::Matches($html, "(?m)^\s*BEV\('[^']+',([0-9]+),")) { [void]$ids.Add([int]$m.Groups[1].Value) }
foreach ($id in 242,440,531) { [void]$ids.Add($id) } # Blissey, Happiny e Audino no Centro Pokémon.
foreach ($id in 1,52,150,151,249,250,251) { [void]$ids.Add($id) }
$base = 'https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/sprite/'
$spriteRoot = Join-Path $root 'assets\pmd\sprite'
[IO.Directory]::CreateDirectory($spriteRoot) | Out-Null

# Baixa os metadados de animação normais e shiny para cada espécie usada.
$xmlQueue = foreach ($id in $ids) {
  $k = $id.ToString('0000')
  foreach ($isShiny in @($false,$true)) {
    $rel = if ($isShiny) { "$k/0000/0001/AnimData.xml" } else { "$k/AnimData.xml" }
    [pscustomobject]@{ Url=($base + $rel); Path=(Join-Path $spriteRoot ($rel -replace '/', [IO.Path]::DirectorySeparatorChar)); Key=($k + $(if($isShiny){'s'}else{''})) }
  }
}
$xmlResults = $xmlQueue | ForEach-Object -Parallel {
  $item = $_
  if (Test-Path -LiteralPath $item.Path) { return [pscustomobject]@{ Ok=$true; Item=$item } }
  try {
    [IO.Directory]::CreateDirectory((Split-Path -Parent $item.Path)) | Out-Null
    Invoke-WebRequest -Uri $item.Url -OutFile $item.Path -TimeoutSec 45 -ErrorAction Stop
    [pscustomobject]@{ Ok=$true; Item=$item }
  } catch { [pscustomobject]@{ Ok=$false; Item=$item } }
} -ThrottleLimit 12

# Guarda os XMLs como dados embutidos para que o modo local funcione até ao abrir index.html por file://.
$manifest = [ordered]@{}
$wantedNames = [Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
$wantedList = @('Idle','Walk','Attack','Hurt','Pain','Cringe','Sleep','EventSleep','Shoot','Charge','Strike','Swing','Double','Pose','Kick','Hop','Wake','Tumble','LookUp','Nod','DeepBreath','Sit')
foreach ($name in $wantedList) { [void]$wantedNames.Add($name) }
$sheetQueue = [Collections.Generic.Dictionary[string,object]]::new([StringComparer]::OrdinalIgnoreCase)
foreach ($item in $xmlQueue) {
  if (-not (Test-Path -LiteralPath $item.Path)) { continue }
  try {
    $src = [IO.File]::ReadAllText($item.Path)
    $manifest[$item.Key] = $src
    [xml]$doc = $src
    $anims = @{}
    foreach ($anim in $doc.SelectNodes('//Anim')) {
      $name = $anim.SelectSingleNode('Name')
      if (-not $name) { continue }
      $copy = $anim.SelectSingleNode('CopyOf')
      $anims[$name.InnerText] = if ($copy) { $copy.InnerText } else { $null }
    }
    $dir = Split-Path -Parent $item.Path
    foreach ($name in $wantedList) {
      if (-not $anims.ContainsKey($name)) { continue }
      $resolved = $name; $guard = 0
      while ($anims[$resolved] -and $guard++ -lt 4) { $resolved = $anims[$resolved] }
      if (-not $anims.ContainsKey($resolved)) { continue }
      $relName = "$resolved-Anim.png"
      $path = Join-Path $dir $relName
      $url = $item.Url.Substring(0, $item.Url.LastIndexOf('/') + 1) + $relName
      if (-not $sheetQueue.ContainsKey($path)) { $sheetQueue[$path] = [pscustomobject]@{ Url=$url; Path=$path } }
    }
  } catch { }
}

$sheetResults = @($sheetQueue.Values) | ForEach-Object -Parallel {
  $item = $_
  if (Test-Path -LiteralPath $item.Path) { return [pscustomobject]@{ Ok=$true; Item=$item } }
  try {
    [IO.Directory]::CreateDirectory((Split-Path -Parent $item.Path)) | Out-Null
    Invoke-WebRequest -Uri $item.Url -OutFile $item.Path -TimeoutSec 45 -ErrorAction Stop
    [pscustomobject]@{ Ok=$true; Item=$item }
  } catch { [pscustomobject]@{ Ok=$false; Item=$item } }
} -ThrottleLimit 12

$manifestPath = Join-Path $root 'assets\pmd\anim-data.js'
$json = ConvertTo-Json -InputObject $manifest -Compress -Depth 8
[IO.File]::WriteAllText($manifestPath, 'window.PMD_ANIM_DATA=' + $json + ';', [Text.UTF8Encoding]::new($false))
$bad = @($xmlResults + $sheetResults | Where-Object { -not $_.Ok })
if ($bad.Count) { $bad | ForEach-Object { $_.Item.Url } | Set-Content (Join-Path $root 'assets\pmd\missing-assets.txt') }
"Species IDs: $($ids.Count); animation data: $($manifest.Count); sheets: $($sheetQueue.Count); missing: $($bad.Count)."
