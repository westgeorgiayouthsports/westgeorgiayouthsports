param(
  [int]$Port = 8000
)

# Start a simple local server. Preference order:
# 1) python (python -m http.server)
# 2) py (Windows python launcher)
# 3) npx http-server

$cwd = Split-Path -Path $MyInvocation.MyCommand.Definition -Parent
if (-not $cwd) { $cwd = Get-Location }
Set-Location $cwd

Write-Host "Starting dev server in: $cwd on port $Port`n"

if (Get-Command python -ErrorAction SilentlyContinue) {
  Write-Host "Using Python http.server..."
  Start-Process -FilePath "python" -ArgumentList "-m","http.server",$Port -WorkingDirectory $cwd
  Write-Host "Python http.server launched (separate process). Open http://localhost:$Port"
  exit 0
}

if (Get-Command py -ErrorAction SilentlyContinue) {
  Write-Host "Using py launcher (Python)..."
  Start-Process -FilePath "py" -ArgumentList "-m","http.server",$Port -WorkingDirectory $cwd
  Write-Host "py http.server launched (separate process). Open http://localhost:$Port"
  exit 0
}

if (Get-Command npx -ErrorAction SilentlyContinue) {
  Write-Host "Using npx http-server..."
  Start-Process -FilePath "npx" -ArgumentList "http-server","-p",$Port -WorkingDirectory $cwd
  Write-Host "npx http-server launched (separate process). Open http://localhost:$Port"
  exit 0
}

Write-Host "No suitable server command found. Install Python or Node.js (npx).
You can also run manually:
  python -m http.server 8000
  OR
  npx http-server -p 8000"
exit 1
