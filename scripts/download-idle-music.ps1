$ErrorActionPreference='Stop'
$root=Split-Path $PSScriptRoot -Parent
$destination=Join-Path $root 'assets/music/idle'
New-Item -ItemType Directory -Path $destination -Force | Out-Null
$tracks=@(
@{key='forest';file='HGSS 218 Viridian Forest.ogg'},
@{key='meadow';file='HGSS 109 Route 29.ogg'},
@{key='garden';file='HGSS 158 National Park.ogg'},
@{key='cave';file='HGSS 128 Union Cave.ogg'},
@{key='water';file='HGSS 170 Surf.ogg'},
@{key='ghost';file='HGSS 162 Burned Tower.ogg'},
@{key='ice';file='HGSS 179 Ice Path.ogg'},
@{key='dragon';file='HGSS 181 Dragon_s Den.ogg'},
@{key='volcano';file='HGSS 230 Cinnabar Island.ogg'},
@{key='center';file='HGSS 115 Poke Center.ogg'},
@{key='shop';file='HGSS 125 Poke Mart.ogg'},
@{key='gym';file='HGSS 204 Battle! (Gym Leader Kanto).ogg'},
@{key='birds';file='HGSS 168 Battle! (Raikou).ogg'},
@{key='mewtwo';file='HGSS 275 Battle! (Lugia).ogg'},
@{key='trainer';file='HGSS 118 Battle! (Trainer Battle Johto).ogg'}
)
$tracks | ForEach-Object -Parallel {
 $t=$_;$out=Join-Path $using:destination ($t.key+'.ogg')
 $url='https://www.enls.eu/prelooped/downloads/HGSS/'+[uri]::EscapeDataString($t.file)
 Invoke-WebRequest -Uri $url -OutFile $out -TimeoutSec 90
 Write-Output ($t.key+' · '+[Math]::Round((Get-Item $out).Length/1MB,2)+' MB')
} -ThrottleLimit 3
$tracks | ConvertTo-Json | Set-Content (Join-Path $destination 'tracks-source.json')
