' ============================================================
' DesignAI Backend Launcher (VBS)
' Double-click this file to start the backend server.
' This bypasses any .bat/.cmd file association issues.
' ============================================================

Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)

' Launch cmd.exe explicitly to run the batch file
WshShell.Run "cmd.exe /k """ & WshShell.CurrentDirectory & "\start_backend.bat""", 1, False
