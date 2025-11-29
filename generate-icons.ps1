# generate-icons.ps1
# Downloads the official WGYS logo (if not present) and generates icon files:
# favicon-32x32.png, favicon-16x16.png, apple-touch-icon.png (180x180), and favicon.ico

$ErrorActionPreference = 'Stop'

# Source URL for official logo
$url = 'https://s3.amazonaws.com/jerseywatch-files/production/organizations/26934/downloads/wgys-baseball-logo-9-small-transparent.png'

# Use the script's directory as the workspace root so the script is portable
$root = Split-Path -Parent $MyInvocation.MyCommand.Definition
if (-not $root) { $root = (Get-Location).Path }

$src = Join-Path $root 'logo-source.png'

if (-not (Test-Path $src)) {
    Write-Output "Downloading logo from $url to $src"
    Invoke-WebRequest -Uri $url -OutFile $src
} else {
    Write-Output "Logo already exists at $src"
}

Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile($src)

function Resize-Save([int]$w, [int]$h, [string]$out) {
    $b = New-Object System.Drawing.Bitmap $w, $h
    $g = [System.Drawing.Graphics]::FromImage($b)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

    # Fill a white background to make sure icons render well on devices
    $g.Clear([System.Drawing.Color]::FromArgb(255,255,255))

    # Preserve aspect ratio and center the logo
    $ratio = [double]$img.Width / $img.Height
    if ($ratio -gt 1) {
        $dw = $w; $dh = [int]($w / $ratio); $dx = 0; $dy = [int](($h - $dh)/2)
    } else {
        $dh = $h; $dw = [int]($h * $ratio); $dx = [int](($w - $dw)/2); $dy = 0
    }

    $g.DrawImage($img, $dx, $dy, $dw, $dh)
    $b.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $b.Dispose()
}

# Generate PNG icons
Resize-Save 32 32 (Join-Path $root 'favicon-32x32.png')
Resize-Save 16 16 (Join-Path $root 'favicon-16x16.png')
Resize-Save 180 180 (Join-Path $root 'apple-touch-icon.png')

# Build ICO by embedding the PNG blobs (modern browsers accept PNG-encoded ICO entries)
$png32 = [System.IO.File]::ReadAllBytes((Join-Path $root 'favicon-32x32.png'))
$png16 = [System.IO.File]::ReadAllBytes((Join-Path $root 'favicon-16x16.png'))
$icons = @($png32, $png16)

$mem = New-Object System.IO.MemoryStream
$bw = New-Object System.IO.BinaryWriter($mem)

# ICONDIR header
$bw.Write([Int16]0)   # reserved
$bw.Write([Int16]1)   # type (1 = ICO)
$bw.Write([Int16]$icons.Count) # count

$offset = 6 + (16 * $icons.Count)

foreach ($icon in $icons) {
    # Determine size based on blob length (we have two sizes: 32 and 16)
    $width = if ($icon.Length -eq $png32.Length) { 32 } else { 16 }
    $height = $width
    $bw.Write([byte]$width)
    $bw.Write([byte]$height)
    $bw.Write([byte]0)               # color palette
    $bw.Write([byte]0)               # reserved
    $bw.Write([Int16]0)              # color planes
    $bw.Write([Int16]0)              # bit count
    $bw.Write([Int32]$icon.Length)   # size
    $bw.Write([Int32]$offset)        # offset
    $offset += $icon.Length
}

# Write image data after directory
foreach ($icon in $icons) { $bw.Write($icon) }
$bw.Flush()
[System.IO.File]::WriteAllBytes((Join-Path $root 'favicon.ico'), $mem.ToArray())

# Clean up
$bw.Close(); $mem.Close(); $img.Dispose()

Write-Output "Generated: `n - $(Join-Path $root 'favicon.ico')`n - $(Join-Path $root 'favicon-32x32.png')`n - $(Join-Path $root 'favicon-16x16.png')`n - $(Join-Path $root 'apple-touch-icon.png')"
