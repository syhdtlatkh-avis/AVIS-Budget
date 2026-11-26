$res = Select-String -Path 'assets/js/app.js' -Pattern '\.group'
foreach ($r in $res) {
    Write-Host "Line $($r.LineNumber): $($r.Line.Trim())"
}
