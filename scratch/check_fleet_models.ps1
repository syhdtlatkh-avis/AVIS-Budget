$content = Get-Content assets/js/app.js -Raw
if ($content -match 'const BUDGET_FLEET = \[(.*?)\];' -and $matches[1]) {
    Write-Host "Found BUDGET_FLEET definition."
}
$personaFound = $content -match 'Proton Persona 1.6'
$xpanderFound = $content -match 'Mitsubishi Xpander'
$bezzaFound = $content -match 'Perodua Bezza'
$hiluxFound = $content -match 'Toyota Hilux'

Write-Host "Persona present: $personaFound"
Write-Host "Xpander present: $xpanderFound"
Write-Host "Bezza present: $bezzaFound"
Write-Host "Hilux present: $hiluxFound"
