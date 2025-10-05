# Save this as export-repo-contents.ps1

$outputFile = "repo-contents.txt"
$excludeDirs = @('.git', 'node_modules', 'dist', 'build', 'coverage', 'storybook-static', '.next', '.vscode')
$excludeFiles = @('yarn.lock', 'package-lock.json', '*.log')

# Clear output file if it exists
if (Test-Path $outputFile) {
    Remove-Item $outputFile
}

# Function to check if path should be excluded
function Should-Exclude {
    param($path)
    foreach ($dir in $excludeDirs) {
        if ($path -like "*\$dir\*" -or $path -like "*/$dir/*") {
            return $true
        }
    }
    foreach ($pattern in $excludeFiles) {
        if ($path -like "*$pattern") {
            return $true
        }
    }
    return $false
}

# Add header
"=" * 80 | Out-File -FilePath $outputFile -Encoding utf8
"REPOSITORY CONTENTS EXPORT" | Out-File -FilePath $outputFile -Append -Encoding utf8
"Generated: $(Get-Date)" | Out-File -FilePath $outputFile -Append -Encoding utf8
"=" * 80 | Out-File -FilePath $outputFile -Append -Encoding utf8
"`n" | Out-File -FilePath $outputFile -Append -Encoding utf8

# Get all files recursively
Get-ChildItem -Recurse -File | ForEach-Object {
    $relativePath = $_.FullName.Replace((Get-Location).Path, "").TrimStart('\', '/')
    
    if (-not (Should-Exclude $relativePath)) {
        # Add file header
        "`n" + "=" * 80 | Out-File -FilePath $outputFile -Append -Encoding utf8
        "FILE: $relativePath" | Out-File -FilePath $outputFile -Append -Encoding utf8
        "=" * 80 | Out-File -FilePath $outputFile -Append -Encoding utf8
        
        # Try to read file content
        try {
            $content = Get-Content $_.FullName -Raw -ErrorAction Stop
            $content | Out-File -FilePath $outputFile -Append -Encoding utf8
        } catch {
            "[Binary file or unable to read]" | Out-File -FilePath $outputFile -Append -Encoding utf8
        }
    }
}

Write-Host "Export complete! Contents saved to $outputFile"
Write-Host "File size: $((Get-Item $outputFile).Length / 1MB) MB"
