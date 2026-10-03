$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$source = Join-Path $PSScriptRoot '../section_bg'
$destination = Join-Path $PSScriptRoot '../public/media/section-backgrounds'
New-Item -ItemType Directory -Path $destination -Force | Out-Null
$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
foreach ($file in (Get-ChildItem -LiteralPath $source -File)) {
  $image = [System.Drawing.Image]::FromFile($file.FullName)
  # Normalize camera orientation before making browser derivatives.
  if ($image.PropertyIdList -contains 274) {
    $orientation = [BitConverter]::ToUInt16($image.GetPropertyItem(274).Value, 0)
    switch ($orientation) {
      2 { $image.RotateFlip([System.Drawing.RotateFlipType]::RotateNoneFlipX) }
      3 { $image.RotateFlip([System.Drawing.RotateFlipType]::Rotate180FlipNone) }
      4 { $image.RotateFlip([System.Drawing.RotateFlipType]::Rotate180FlipX) }
      5 { $image.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipX) }
      6 { $image.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone) }
      7 { $image.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipX) }
      8 { $image.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipNone) }
    }
  }
  foreach ($variant in @(@{suffix='mobile';size=1100;quality=82}, @{suffix='desktop';size=2200;quality=85})) {
    $scale = [Math]::Min(1.0, $variant.size / [Math]::Max($image.Width, $image.Height))
    $bitmap = New-Object System.Drawing.Bitmap ([int]($image.Width*$scale)),([int]($image.Height*$scale))
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.DrawImage($image, 0, 0, $bitmap.Width, $bitmap.Height)
    $parameters = New-Object System.Drawing.Imaging.EncoderParameters 1
    $parameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality),([long]$variant.quality)
    $bitmap.Save((Join-Path $destination "$($file.BaseName)-$($variant.suffix).jpg"),$encoder,$parameters)
    $parameters.Dispose()
    $graphics.Dispose()
    $bitmap.Dispose()
  }
  $image.Dispose()
}
