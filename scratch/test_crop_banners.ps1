Add-Type -AssemblyName System.Drawing

$b1 = [System.Drawing.Bitmap]::FromFile('c:\Users\shahfarid\Downloads\budget_malaysia_website\assets\images\banner-1.jpg')

# Crop Persona from banner-1 (approx X=80..240, Y=140..280)
$rectP1 = New-Object System.Drawing.Rectangle 80, 140, 170, 140
$cropP1 = $b1.Clone($rectP1, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$cropP1.Save('c:\Users\shahfarid\Downloads\budget_malaysia_website\assets\images\crop-p1-test.png', [System.Drawing.Imaging.ImageFormat]::Png)
$cropP1.Dispose()

# Crop Xpander from banner-1 (approx X=220..420, Y=140..280)
$rectX1 = New-Object System.Drawing.Rectangle 220, 140, 200, 140
$cropX1 = $b1.Clone($rectX1, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$cropX1.Save('c:\Users\shahfarid\Downloads\budget_malaysia_website\assets\images\crop-x1-test.png', [System.Drawing.Imaging.ImageFormat]::Png)
$cropX1.Dispose()

$b1.Dispose()
Write-Host "Test crops saved."
