# Fix esbuild permissions for Vite build on Windows
# This script finds esbuild binaries and adds execute permissions

Get-ChildItem -Path "node_modules" -Recurse -Filter "esbuild" -File | ForEach-Object {
    try {
        $acl = Get-Acl $_.FullName
        $acl.SetAccessRuleProtection($false, $false)
        $rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
            "Everyone", "ReadAndExecute", "Allow"
        )
        $acl.AddAccessRule($rule)
        Set-Acl $_.FullName $acl
        Write-Host "Fixed permissions for: $($_.FullName)"
    } catch {
        Write-Host "Could not fix permissions for: $($_.FullName) - $_"
    }
}

# Also fix @esbuild specifically
Get-ChildItem -Path "node_modules" -Recurse -Filter "esbuild" -Directory | Where-Object { $_.FullName -like "*@esbuild*" } | ForEach-Object {
    $binFile = Join-Path $_.FullName "bin\esbuild.exe"
    if (Test-Path $binFile) {
        try {
            $acl = Get-Acl $binFile
            $rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
                "Everyone", "ReadAndExecute", "Allow"
            )
            $acl.AddAccessRule($rule)
            Set-Acl $binFile $acl
            Write-Host "Fixed permissions for: $binFile"
        } catch {
            Write-Host "Could not fix permissions for: $binFile - $_"
        }
    }
}

Write-Host "Done fixing esbuild permissions"
