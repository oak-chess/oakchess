$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
$nineRoot=Split-Path -Parent $PSScriptRoot
$nineInput=Join-Path $nineRoot 'tmp/dex-source/nine-graphics'
$nineResources=Get-Content (Join-Path $nineRoot 'tmp/dex-source/nine-resources.json') -Raw | ConvertFrom-Json
foreach($nineResource in $nineResources){
 $nineImage=[System.Drawing.Bitmap]::FromFile((Join-Path $nineInput ([IO.Path]::GetFileName($nineResource.png))))
 $nineColors=$nineImage.Palette.Entries
 $nineReplacement=$nineColors
 if($nineResource.pal -like '*.pal'){
  $nineReplacement=@(Get-Content (Join-Path $nineInput ([IO.Path]::GetFileName($nineResource.pal))) | Select-Object -Skip 3 | Where-Object {$_ -match '^\d+\s+\d+\s+\d+'} | ForEach-Object {$nineRgb=$_ -split '\s+';[System.Drawing.Color]::FromArgb([int]$nineRgb[0],[int]$nineRgb[1],[int]$nineRgb[2])})
 }elseif($nineResource.pal -ne $nineResource.png){
  $ninePaletteImage=[System.Drawing.Bitmap]::FromFile((Join-Path $nineInput ([IO.Path]::GetFileName($nineResource.pal))))
  $nineReplacement=$ninePaletteImage.Palette.Entries
  $ninePaletteImage.Dispose()
 }
 $nineLookup=@{}
 for($nineIndex=0;$nineIndex -lt $nineColors.Length;$nineIndex++){if(!$nineLookup.ContainsKey($nineColors[$nineIndex].ToArgb())){$nineLookup[$nineColors[$nineIndex].ToArgb()]=$nineIndex}}
 $nineOutput=New-Object System.Drawing.Bitmap($nineImage.Width,$nineImage.Height)
 for($nineY=0;$nineY -lt $nineImage.Height;$nineY++){for($nineX=0;$nineX -lt $nineImage.Width;$nineX++){
  $ninePixel=$nineImage.GetPixel($nineX,$nineY)
  $nineIndex=$nineLookup[$ninePixel.ToArgb()]
  if($null -ne $nineIndex -and $nineIndex -ne 0){$nineOutput.SetPixel($nineX,$nineY,$nineReplacement[$nineIndex % $nineReplacement.Length])}
 }}
 $nineImage.Dispose()
 $nineOutput.Save((Join-Path $nineRoot ('assets/move-fx/sheets/'+$nineResource.name+'.png')),[System.Drawing.Imaging.ImageFormat]::Png)
 $nineOutput.Dispose()
}
Write-Output ('Prepared '+$nineResources.Count+' original sprite sheets with source palettes.')
