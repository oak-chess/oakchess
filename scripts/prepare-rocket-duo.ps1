# Prepare transparent arena copies offline. Browsers opened with file: cannot
# safely read pixels from a canvas after drawing another local image.
Add-Type -AssemblyName System.Drawing
$taskRoot = Split-Path $PSScriptRoot -Parent
foreach ($character in @('jessie','james')) {
    $sourcePath = Join-Path $taskRoot "assets/rocket-duo/$character.png"
    $sourceImage = [Drawing.Image]::FromFile($sourcePath)
    $bitmap = [Drawing.Bitmap]::new($sourceImage.Width,$sourceImage.Height,[Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [Drawing.Graphics]::FromImage($bitmap)
    $graphics.DrawImageUnscaled($sourceImage,0,0)
    $graphics.Dispose()
    for ($frameY=0; $frameY -lt $bitmap.Height; $frameY+=16) {
        $queue = [Collections.Generic.Queue[int]]::new()
        $visited = [bool[]]::new(256)
        for ($n=0; $n -lt 16; $n++) {
            $queue.Enqueue($n); $queue.Enqueue(240+$n)
            $queue.Enqueue($n*16); $queue.Enqueue($n*16+15)
        }
        while ($queue.Count -gt 0) {
            $pixelIndex=$queue.Dequeue()
            if ($visited[$pixelIndex]) { continue }
            $visited[$pixelIndex]=$true
            $x=$pixelIndex%16; $y=[int][Math]::Floor($pixelIndex/16)
            if ($x -ge $bitmap.Width -or $frameY+$y -ge $bitmap.Height) { continue }
            $color=$bitmap.GetPixel($x,$frameY+$y)
            if ($color.R -gt 245 -and $color.G -gt 245 -and $color.B -gt 245) {
                $bitmap.SetPixel($x,$frameY+$y,[Drawing.Color]::Transparent)
                if ($x -gt 0) { $queue.Enqueue($pixelIndex-1) }
                if ($x -lt 15) { $queue.Enqueue($pixelIndex+1) }
                if ($y -gt 0) { $queue.Enqueue($pixelIndex-16) }
                if ($y -lt 15) { $queue.Enqueue($pixelIndex+16) }
            }
        }
    }
    $bitmap.Save((Join-Path $taskRoot "assets/rocket-duo/$character-arena.png"),[Drawing.Imaging.ImageFormat]::Png)
    $bitmap.Dispose(); $sourceImage.Dispose()
}
