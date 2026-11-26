Add-Type -AssemblyName System.Drawing

$b1 = [System.Drawing.Bitmap]::FromFile('c:\Users\shahfarid\Downloads\budget_malaysia_website\assets\images\banner-1.jpg')
$b3 = [System.Drawing.Bitmap]::FromFile('c:\Users\shahfarid\Downloads\budget_malaysia_website\assets\images\banner-3.jpg')

Write-Host "Banner 1: $($b1.Width) x $($b1.Height)"
Write-Host "Banner 3: $($b3.Width) x $($b3.Height)"

$b1.Dispose()
$b3.Dispose()
