# Поставување на Logistik кај клиент (локален сервер)

Упатство за инсталација на апликацијата на серверот на клиентот
**Solaris — Windows Server 2012, IP `192.168.2.1`**.

## Како функционира (архитектура)

- **Еден процес** (`.NET backend`) ги сервира и **API-то** и **веб-страницата** (Angular),
  на еден порт — **5000**.
- Работи како **Windows сервис** (автоматски старт, автоматски рестарт).
- Базата е **PostgreSQL**, инсталирана локално на серверот.
- Корисниците пристапуваат преку прелистувач на **`http://192.168.2.1:5000`** —
  ништо не се инсталира на нивните компјутери.
- **Admin корисникот се креира автоматски** при првиот старт.

> Портот 80 е зафатен (постоечки Server 2012 сајт), затоа користиме 5000.
> Постоечките податоци на дискот G: не се дираат.

---

## ДЕЛ А — на твојот компјутер (каде што е кодот)

Тука ја „спакуваш" апликацијата, па го носиш пакетот на серверот.

### 1. Спакувај го backend-от (self-contained — серверот не бара .NET инсталација)

Во root од проектот (`...\Logistik\Reports`), во PowerShell:

```powershell
dotnet publish src/Logistik.API/Logistik.API.csproj -c Release -r win-x64 --self-contained true -o publish
```

### 2. Изгради го frontend-от за on-prem

```powershell
cd logistik-frontend
npx ng build --configuration onprem
cd ..
```

### 3. Стави го frontend-от во backend-от (во `wwwroot`)

```powershell
New-Item -ItemType Directory -Force publish\wwwroot | Out-Null
Copy-Item -Recurse -Force logistik-frontend\dist\logistik-frontend\browser\* publish\wwwroot\
```

### 4. Спакувај ја папката `publish` во ZIP

```powershell
Compress-Archive -Path publish\* -DestinationPath Logistik-app.zip -Force
```

`Logistik-app.zip` го носиш на серверот (преку AnyDesk → file transfer, или копирај на G:).

---

## ДЕЛ Б — на серверот Solaris (преку AnyDesk)

### 1. Инсталирај PostgreSQL

- Симни **PostgreSQL 15** за Windows x64:
  https://www.enterprisedb.com/downloads/postgres-postgresql-downloads (верзија 15.x)
- Инсталирај со default поставки. Кога ќе побара **лозинка за `postgres`** корисникот —
  запиши ја (пр. силна лозинка, нека биде `POSTGRES_PASS`).
- Port: остави **5432**. Не мора Stack Builder на крај (откажи го).

### 2. Направи ја базата и корисникот

Отвори **SQL Shell (psql)** од Start менито → притискај Enter на првите прашања
(Server/Database/Port/Username = default), внеси ја `postgres` лозинката, па залепи:

```sql
CREATE DATABASE logistik_db;
CREATE USER logistik WITH PASSWORD 'STRONG_DB_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE logistik_db TO logistik;
\c logistik_db
GRANT ALL ON SCHEMA public TO logistik;
```

> Замени `STRONG_DB_PASSWORD` со вистинска силна лозинка и **запиши ја**.

### 3. Распакувај ја апликацијата

- Направи папка **`C:\Logistik\app`**.
- Распакувај го `Logistik-app.zip` таму (внатре треба да е `Logistik.API.exe` + `wwwroot\`).

### 4. Намести ја конфигурацијата

Отвори го фајлот **`C:\Logistik\app\appsettings.Production.json`** со Notepad и стави го ова
(замени ги вредностите со CAPS):

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=logistik_db;Username=logistik;Password=STRONG_DB_PASSWORD"
  },
  "JwtSettings": {
    "SecretKey": "STAVI_SLUCAEN_KLUC_NAJMALKU_48_ZNACI_1234567890ABCdef",
    "Issuer": "logistik.mk",
    "Audience": "logistik.mk"
  },
  "Seed": {
    "AdminUsername": "admin",
    "AdminEmail": "admin@logistik.mk",
    "AdminPassword": "STAVI_SILNA_ADMIN_LOZINKA"
  }
}
```

- `DefaultConnection` → истата `STRONG_DB_PASSWORD` од чекор 2.
- `JwtSettings:SecretKey` → долг случаен текст (≥ 48 знаци). Не го споделувај.
- `Seed:AdminPassword` → лозинката за најава како `admin`. **Запиши ја.**

> (По желба — ако сакаш автоматски мејлови при одјава на вработен — додади и
> `EmailSettings` блок со SMTP податоци. Не е задолжително.)

### 5. Инсталирај го како Windows сервис (NSSM)

- Симни **NSSM**: https://nssm.cc/download → распакувај → земи го `nssm.exe` од
  папката `win64`.
- Отвори **Command Prompt како Administrator**, оди до nssm и искуцај:

```bat
nssm install LogistikAPI
```

Во прозорецот што се отвора:
- **Application → Path:** `C:\Logistik\app\Logistik.API.exe`
- **Application → Startup directory:** `C:\Logistik\app`
- Таб **Environment** → во полето залепи (секое во нов ред):
  ```
  ASPNETCORE_ENVIRONMENT=Production
  ASPNETCORE_URLS=http://0.0.0.0:5000
  ```
- Таб **Details** → Startup type: **Automatic**
- Кликни **Install service**.

Старт на сервисот:

```bat
nssm start LogistikAPI
```

> При првиот старт автоматски се прават табелите (миграции) + admin корисникот.
> Почекај ~20–30 секунди.

### 6. Отвори го портот во firewall (за другите компјутери)

Во Command Prompt (Administrator):

```bat
netsh advfirewall firewall add rule name="Logistik 5000" dir=in action=allow protocol=TCP localport=5000
```

### 7. Тест

- На серверот, во прелистувач: **`http://localhost:5000`** → треба да се појави најавата.
- Од друг компјутер на мрежата: **`http://192.168.2.1:5000`** → најави се со
  `admin` / (admin лозинката од чекор 4).

---

## ДЕЛ В — лесен пристап за сите корисници

Бидејќи веќе имаат мапиран диск **G:** на сите компјутери, стави таму пречка (shortcut):

1. На серверот, во папката на G: (пр. корен или нова папка `Logistik`), десен клик →
   **New → Shortcut**.
2. За локација внеси: `http://192.168.2.1:5000`
3. Име: `Логистик`.

Секој корисник само двапати кликнува на неа → се отвора апликацијата во прелистувач.

> Побарај од IT/рутерот **да ја фиксира IP-то** на Solaris (`192.168.2.1`) за да не се менува.

---

## ДЕЛ Г — резервни копии на базата (важно!)

За да не се изгубат податоците, намести дневна резервна копија:

1. Направи папка `C:\Logistik\backup`.
2. Направи фајл `C:\Logistik\backup.bat` со содржина:

```bat
@echo off
set PGPASSWORD=STRONG_DB_PASSWORD
for /f "tokens=1-3 delims=.- " %%a in ("%date%") do set D=%%c-%%b-%%a
"C:\Program Files\PostgreSQL\15\bin\pg_dump.exe" -U logistik -h localhost logistik_db > "C:\Logistik\backup\logistik_%D%.sql"
```

3. Отвори **Task Scheduler** → Create Basic Task → дневно во пр. 20:00 → Action:
   Start a program → `C:\Logistik\backup.bat`.

> По желба, копирај ги и на G: за дополнителна сигурност.

---

## Ажурирање на апликацијата (во иднина)

1. На твојот компјутер повтори **ДЕЛ А** (нов `Logistik-app.zip`).
2. На серверот: `nssm stop LogistikAPI`
3. Замени ги фајловите во `C:\Logistik\app` (НЕ го бриши `appsettings.Production.json`).
4. `nssm start LogistikAPI`

---

## Белешки

- **Self-contained** билд — серверот НЕ бара .NET инсталација; `.exe`-то си го носи runtime-от.
- **Безбедност на OS:** Windows Server 2012 е стар. За продукција се препорачуваат
  Extended Security Updates (ESU) од Microsoft, или план за надградба на серверот.
  Апликацијата работи на 2012, но OS-от сам по себе треба да се одржува безбеден.
- Сите податоци остануваат **локално во мрежата** — нема потреба од интернет.
```

### Корисни команди за сервисот

```bat
nssm status LogistikAPI     :: дали работи
nssm restart LogistikAPI    :: рестарт
nssm stop LogistikAPI       :: стоп
```
