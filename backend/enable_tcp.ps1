# Enable TCP/IP for SQLEXPRESS and set port to 1433
Import-Module 'sqlps' -DisableNameChecking

$wmi = New-Object ('Microsoft.SqlServer.Management.Smo.Wmi.ManagedComputer')
$instance = $wmi.ServerInstances['SQLEXPRESS']
$tcp = $instance.ServerProtocols['Tcp']

Write-Host "Current TCP Enabled: $($tcp.IsEnabled)"

if (-not $tcp.IsEnabled) {
    $tcp.IsEnabled = $true
    $tcp.Alter()
    Write-Host "TCP/IP enabled successfully"
}

# Set IPAll to port 1433
$ipAll = $tcp.IPAddresses | Where-Object { $_.Name -eq 'IPAll' }
$ipAll.IPAddressProperties['TcpPort'].Value = '1433'
$ipAll.IPAddressProperties['TcpDynamicPorts'].Value = ''
$tcp.Alter()
Write-Host "Port set to 1433"

# Restart SQL Server
Write-Host "Restarting MSSQL`$SQLEXPRESS service..."
Restart-Service -Name 'MSSQL$SQLEXPRESS' -Force
Write-Host "SQL Server restarted successfully"
