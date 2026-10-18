$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
$projectRoot=Split-Path -Parent $PSScriptRoot
$sourceRoot=Join-Path $projectRoot 'tmp/emerald-source/pokeemerald-master/graphics/battle_anims/backgrounds'
$targetRoot=Join-Path $projectRoot 'assets/move-fx/backgrounds'
New-Item -ItemType Directory -Force $targetRoot | Out-Null
$exported=@()
foreach($sourceFile in (Get-ChildItem -LiteralPath $sourceRoot -Filter '*.png')){
 $name=$sourceFile.BaseName
 $mapPath=Join-Path $sourceRoot ($name+'.bin')
 if(!(Test-Path -LiteralPath $mapPath)){$mapPath=Join-Path $sourceRoot ($name+'_player.bin')}
 if(!(Test-Path -LiteralPath $mapPath)){continue}
 $tiles=[System.Drawing.Bitmap]::FromFile((Join-Path $sourceRoot ($name+'.png')))
 $map=[System.IO.File]::ReadAllBytes($mapPath)
 $rows=[Math]::Ceiling(($map.Length/2)/32)
 $image=New-Object System.Drawing.Bitmap(256,($rows*8))
 for($entry=0;$entry -lt $map.Length/2;$entry++){
  $value=[int]$map[$entry*2]+([int]$map[$entry*2+1]*256)
  $tile=$value -band 1023;$srcX=($tile % ($tiles.Width/8))*8;$srcY=[Math]::Floor($tile/($tiles.Width/8))*8
  if($srcY+8 -gt $tiles.Height){continue}
  for($py=0;$py -lt 8;$py++){for($px=0;$px -lt 8;$px++){
   $flipX=if($value -band 1024){7-$px}else{$px};$flipY=if($value -band 2048){7-$py}else{$py}
   $image.SetPixel((($entry%32)*8+$px),([Math]::Floor($entry/32)*8+$py),$tiles.GetPixel(($srcX+$flipX),($srcY+$flipY)))
  }}
 }
 $image.Save((Join-Path $targetRoot ($name+'.png')),[System.Drawing.Imaging.ImageFormat]::Png);$image.Dispose();$tiles.Dispose()
 $exported+=$name
}
[System.IO.File]::WriteAllText((Join-Path $projectRoot 'assets/move-fx/emerald-backgrounds.js'),('window.EMERALD_BACKGROUNDS='+ (ConvertTo-Json -InputObject @($exported) -Compress)+';'))
Write-Output ('Prepared '+$exported.Count+' backgrounds from source tiles and tile maps.')
