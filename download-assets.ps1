$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$html = [IO.File]::ReadAllText((Join-Path $root 'index.html'))
$urls = [Collections.Generic.HashSet[string]]::new()
$add = { param($url) [void]$urls.Add($url) }

# IDs usados pelas linhas evolutivas do jogo.
$ids = [Collections.Generic.HashSet[int]]::new()
foreach ($m in [regex]::Matches($html, "(?m)^ln\([^,]+,\[([0-9,]+)\]")) {
  foreach ($n in $m.Groups[1].Value.Split(',')) { [void]$ids.Add([int]$n) }
}
# Pokémon mostrados diretamente em eventos, sem fazer parte das cartas da loja.
foreach ($m in [regex]::Matches($html, "(?m)^\s*BEV\('[^']+',([0-9]+),")) { [void]$ids.Add([int]$m.Groups[1].Value) }
foreach ($id in 242,440,531) { [void]$ids.Add($id) } # Blissey, Happiny e Audino no Centro Pokémon.
foreach ($id in 1,52,150,151,249,250,251) { [void]$ids.Add($id) }
$base = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/'
foreach ($id in $ids) {
  foreach ($path in @("pokemon/other/showdown/$id.gif", "pokemon/other/showdown/back/$id.gif", "pokemon/other/showdown/shiny/$id.gif", "pokemon/other/showdown/back/shiny/$id.gif", "pokemon/versions/generation-v/black-white/animated/$id.gif", "pokemon/versions/generation-v/black-white/animated/back/$id.gif", "pokemon/$id.png")) { & $add ($base + $path) }
  foreach ($path in @("pokemon/versions/generation-v/black-white/animated/shiny/$id.gif", "pokemon/versions/generation-v/black-white/animated/back/shiny/$id.gif", "pokemon/shiny/$id.png")) { & $add ($base + $path) }
  & $add "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/$id.ogg"
}

# Itens usados por loja, mochila, crafting e interface.
$itemBlock = [regex]::Match($html, '(?s)const ITEMS=\[(.*?)\];')
if ($itemBlock.Success) {
  foreach ($m in [regex]::Matches($itemBlock.Groups[1].Value, "s:'([^']+)'")) { & $add ($base + 'items/' + $m.Groups[1].Value + '.png') }
}
foreach ($name in @('focus-band','great-ball','lock-capsule','master-ball','poke-ball','poke-flute','poke-radar','rare-candy','town-map','ultra-ball','x-attack','x-speed')) { & $add ($base + 'items/' + $name + '.png') }
foreach ($id in 1..18) { & $add ($base + "types/generation-ix/scarlet-violet/small/$id.png") }
foreach ($id in 1..8) { & $add ($base + "badges/$id.png") }

# Trainers nomeados no modo história e nas rotas.
$trainerNames = [Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
foreach ($m in [regex]::Matches($html, "trainerUrl\('([a-z0-9-]+)'\)")) { [void]$trainerNames.Add($m.Groups[1].Value) }
$leaderBlock = [regex]::Match($html, '(?s)const LEADERS=\[(.*?)\];')
$leagueBlock = [regex]::Match($html, '(?s)const LEAGUE=\[(.*?)\];')
$stageBlock = [regex]::Match($html, '(?s)const STAGE_TR=\[(.*?)\];')
foreach ($block in @($leaderBlock,$leagueBlock)) {
  if ($block.Success) { foreach ($m in [regex]::Matches($block.Groups[1].Value, "\bs:'([a-z][a-z0-9-]+)'")) { [void]$trainerNames.Add($m.Groups[1].Value) } }
}
if ($stageBlock.Success) {
  foreach ($m in [regex]::Matches($stageBlock.Groups[1].Value, "\['[^']+','([a-z][a-z0-9-]+)'")) { [void]$trainerNames.Add($m.Groups[1].Value) }
}
foreach ($name in @('brock','misty','ltsurge','erika','koga','sabrina','blaine','giovanni','lorelei','bruno','agatha','lance','blue','red','oak','nurse')) { [void]$trainerNames.Add($name) }
foreach ($name in $trainerNames) { & $add "https://play.pokemonshowdown.com/sprites/trainers/$name.png" }

$queue = foreach ($url in $urls) {
  $rel = $url -replace '^https://raw\.githubusercontent\.com/PokeAPI/sprites/master/sprites/','assets/pokeapi/sprites/'
  $rel = $rel -replace '^https://raw\.githubusercontent\.com/PokeAPI/cries/main/cries/','assets/pokeapi/cries/'
  $rel = $rel -replace '^https://play\.pokemonshowdown\.com/sprites/trainers/','assets/showdown/trainers/'
  [pscustomobject]@{ Url=$url; Path=(Join-Path $root ($rel -replace '/', [IO.Path]::DirectorySeparatorChar)) }
}

$results = $queue | ForEach-Object -Parallel {
  $item = $_
  try {
    $dir = Split-Path -Parent $item.Path
    [IO.Directory]::CreateDirectory($dir) | Out-Null
    if (Test-Path -LiteralPath $item.Path) { return [pscustomobject]@{ Ok=$true; Path=$item.Path } }
    Invoke-WebRequest -Uri $item.Url -OutFile $item.Path -TimeoutSec 30 -ErrorAction Stop
    [pscustomobject]@{ Ok=$true; Path=$item.Path }
  } catch {
    if (Test-Path -LiteralPath $item.Path) { Remove-Item -LiteralPath $item.Path -Force }
    [pscustomobject]@{ Ok=$false; Path=$item.Path }
  }
} -ThrottleLimit 12

$ok = @($results | Where-Object Ok)
$bad = @($results | Where-Object { -not $_.Ok })
"Downloaded $($ok.Count) / $($queue.Count) files; $($bad.Count) unavailable."
if ($bad.Count) { $bad | ForEach-Object { $_.Path.Substring($root.Length + 1) } | Set-Content (Join-Path $root 'assets\missing-assets.txt') }
