

**Генерация файла file.txt**
=====================================

**Команда:**
```powershell
Get-ChildItem -File -Recurse -Exclude @('logo.svg', 'reportWebVitals.js', 'setupTests.js') | ForEach-Object {
  $filePath = $_.FullName
  "===== $filePath =====" | Out-File -FilePath file.txt -Append -Encoding utf8
  Get-Content $_.FullName -Encoding UTF8 | Out-File -FilePath file.txt -Append -Encoding utf8
  "`n" | Out-File -FilePath file.txt -Append -Encoding utf8
}
```
**Что делает:**

* Собирает файлы:
	+ Рекурсивно обходит все папки (-Recurse)
	+ Исключает файлы: logo.svg, reportWebVitals.js, setupTests.js (-Exclude)
* Записывает в file.txt:
	+ Полный путь к файлу (с разделителем =====)
	+ Содержимое файла
	+ Пустую строку между записями
* Кодировка:
	+ Использует UTF-8 для корректного отображения кириллицы и спецсимволов

**Пример результата:**
```
===== C:\project\src\App.jsx =====
import React from 'react';

function App() {
  return <div>Hello World!</div>;
}

===== C:\project\README.md =====
# Project Documentation
...
```