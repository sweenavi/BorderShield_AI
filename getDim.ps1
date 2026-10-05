Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("d:\BorderShieldAI\final_bordershield_ai\BoarderShieldAI\SOURCE\MAP V5 AC.png")
Write-Host "$($img.Width) $($img.Height)"
$img.Dispose()
