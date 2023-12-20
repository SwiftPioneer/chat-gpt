## 1. DB Setup
### 1. DB Setup for MongoDB
1. DownMongoDB server here:
https://www.mongodb.com/try/download/community

2. Install mongodb with the default settings.
3. Run mongodb service.



### 2. DB Setup for MySQL
1. Check your MySQL server running.
2. Open file at 'backend/db_setup/mysql/db_setup.py'
3. Type your db informations.

```bash
host = "your MySQL Server Host"         default: localhost
user = "your DB user name"              default: root
password = "your our DB Password"       default: 
dbname = "your db name"                 default: tax_genii
tablename = "your table name"           default: chat_logs
```
4. If you already have table with the same name, drop your table first.
```bash
cd backend
python dropdb.py
```



## 2. ChatGPT API KEY
1. In backend directory create a new file called config.py
2. Open that file (backend/config.py) and place your api key information.

```bash
API_KEY = "Your API KEY"
```

## 3. Backend

#### Locate to your backend directory.
```bash
cd backend
```

#### Setup python libraries
```bash
pip install -r requirements.txt
```

#### If you already have table with the same name, drop your table first.
```bash
python dropdb.py
```

#### Run backend
```bash
python server.py
```




## 4. Frontend

#### Go to frontend and setup npm
```bash
cd frontend
npm install
```

#### Run frontend
```bash
npm start
```

Visit your website at :
http://localhost:3000/
