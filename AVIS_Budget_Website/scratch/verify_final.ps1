$files = Get-ChildItem -Path . -Include *.html,*.js -Recurse
$foundAny = $false
foreach ($f in $files) {
    $m1 = Select-String -Path $f.FullName -Pattern 'similar'
    $m2 = Select-String -Path $f.FullName -Pattern 'Group\s*[A-Z]'
    if ($m1) {
        Write-Host "File $($f.Name) contains 'similar':"
        $m1 | ForEach-Object { Write-Host "  Line $($_.LineNumber): $($_.Line.Trim())" }
        $foundAny = $true
    }
    if ($m2) {
        Write-Host "File $($f.Name) contains 'Group X':"
        $m2 | ForEach-Object { Write-Host "  Line $($_.LineNumber): $($_.Line.Trim())" }
        $foundAny = $true
    }
}
if (-not $foundAny) {
    Write-Host "SUCCESS: Zero occurrences of 'similar' and zero occurrences of 'Group [A-Z]' across all HTML and JS files!"
}
