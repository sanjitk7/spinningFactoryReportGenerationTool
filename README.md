# Project Overview

Basic application to store and retrive spinning mill data - machines, hostels, buildings, workers, raw materials, production.

**Backend**: mySQL
Data is stored in mySQL database by default on the above mentioned entities.
**Frontend**: nodeJS
NodeJS is used here to retrive data from the backend sql with express.js framework.

~Utilites~:
1. Insersion of production details
2. Finding idle workers
3. Worker production report
4. machine-wise production report
5. building-wise production report
6. max raw material consumed

## Architecture

**Frontend:**
![] (images/FLOW_ARCH.jpg)

**Backend:**
![] (images/flowDiagram.jpg)

# Installation

**Backend:**

*install mySQL server*

Go [here](https://dev.mysql.com/doc/refman/5.7/en/osx-installation-pkg.html)

*go to preferences and select mySQL and click start server*

*login to sql as admin*

```bash
mysql -u root -p
```
**Frontend:**

*install node*

Install node from [here](https://nodejs.org/en/download/)

*start server by*

```bash
npm start
```

**Start Application:**


*open a browser and go to the [homeUrl]*(http://localhost:3000/production) : 
http://localhost:3000/production