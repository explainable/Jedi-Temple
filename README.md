# Jedi-Temple
Repo for public facing Webapp


## Dependency Management
Python packages are managed with <a href="https://pypi.org/project/pipenv/">pipenv</a>

To install dependencies, run
```
pipenv install
```

To begin a session, run
```
pipenv shell
``` 

## Running Locally
Create a set_vars.sh file for initializing environment variables. (It's in the .gitignore, so it's safe to put API keys here).
```
source set_vars.sh
```

Once you've set environment variables, you can run the server as follows
```
./start_server.sh
```
