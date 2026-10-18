$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
$projectRoot=Split-Path -Parent $PSScriptRoot
$directory=Join-Path $projectRoot 'tmp/emerald-source/pokeemerald-master/graphics/battle_anims/sprites'
foreach($name in @('ice_crystals','mud_sand','flower','spark')){
 $parts=@(Get-ChildItem -LiteralPath $directory -Filter ($name+'_*.png') | Sort-Object Name)
 $indices=New-Object 'System.Collections.Generic.List[byte]'
 $palette=$null
 foreach($part in $parts){
  $image=[System.Drawing.Bitmap]::FromFile($part.FullName)
  if($null -eq $palette){$palette=$image.Palette}
  $lookup=@{};$entries=$image.Palette.Entries
  for($ci=0;$ci -lt $entries.Length;$ci++){if(!$lookup.ContainsKey($entries[$ci].ToArgb())){$lookup[$entries[$ci].ToArgb()]=[byte]$ci}}
  for($ty=0;$ty -lt $image.Height;$ty+=8){for($tx=0;$tx -lt $image.Width;$tx+=8){for($py=0;$py -lt 8;$py++){for($px=0;$px -lt 8;$px++){
   $indices.Add($lookup[$image.GetPixel(($tx+$px),($ty+$py)).ToArgb()])
  }}}}
  $image.Dispose()
 }
 $output=New-Object System.Drawing.Bitmap(8,($indices.Count/8),[System.Drawing.Imaging.PixelFormat]::Format8bppIndexed)
 $output.Palette=$palette
 $rect=New-Object System.Drawing.Rectangle(0,0,$output.Width,$output.Height)
 $locked=$output.LockBits($rect,[System.Drawing.Imaging.ImageLockMode]::WriteOnly,[System.Drawing.Imaging.PixelFormat]::Format8bppIndexed)
 [System.Runtime.InteropServices.Marshal]::Copy($indices.ToArray(),0,$locked.Scan0,$indices.Count)
 $output.UnlockBits($locked)
 $output.Save((Join-Path $directory ($name+'.png')),[System.Drawing.Imaging.ImageFormat]::Png);$output.Dispose()
}
Write-Output 'Reconstructed four composite sprite sheets in source tile order.'
