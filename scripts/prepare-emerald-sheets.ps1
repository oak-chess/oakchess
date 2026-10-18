$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
$projectRoot=Split-Path -Parent $PSScriptRoot
$sourceRoot=Join-Path $projectRoot 'tmp/emerald-source/pokeemerald-master'
$resources=Get-Content (Join-Path $projectRoot 'tmp/emerald-source/resources.json') -Raw | ConvertFrom-Json
$destination=Join-Path $projectRoot 'assets/move-fx/sheets'
New-Item -ItemType Directory -Force $destination | Out-Null
foreach($resource in $resources){
 $src=[System.Drawing.Bitmap]::FromFile((Join-Path $sourceRoot $resource.png))
 $colors=$src.Palette.Entries
 $replacement=$colors
 if($resource.pal -like '*.pal'){
  $replacement=@(Get-Content (Join-Path $sourceRoot $resource.pal) | Select-Object -Skip 3 | Where-Object {$_ -match '^\d+\s+\d+\s+\d+'} | ForEach-Object {$rgb=$_ -split '\s+';[System.Drawing.Color]::FromArgb([int]$rgb[0],[int]$rgb[1],[int]$rgb[2])})
 }elseif($resource.pal -ne $resource.png){
  $palImage=[System.Drawing.Bitmap]::FromFile((Join-Path $sourceRoot $resource.pal));$replacement=$palImage.Palette.Entries;$palImage.Dispose()
 }
 $lookup=@{}
 for($ci=0;$ci -lt $colors.Length;$ci++){if(!$lookup.ContainsKey($colors[$ci].ToArgb())){$lookup[$colors[$ci].ToArgb()]=$ci}}
 $dst=New-Object System.Drawing.Bitmap($src.Width,$src.Height)
 for($py=0;$py -lt $src.Height;$py++){for($px=0;$px -lt $src.Width;$px++){
  $color=$src.GetPixel($px,$py);$index=$lookup[$color.ToArgb()]
  if($null -ne $index -and $index -ne 0){$dst.SetPixel($px,$py,$replacement[$index % $replacement.Length])}
 }}
 $src.Dispose();$dst.Save((Join-Path $destination ($resource.name+'.png')),[System.Drawing.Imaging.ImageFormat]::Png);$dst.Dispose()
}
Write-Output ('Prepared '+$resources.Count+' transparent sheets with source palettes.')
