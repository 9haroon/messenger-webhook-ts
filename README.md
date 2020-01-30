
# Description
to run it in development mode. You should use openssl to create browser certificate like

    openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365
then key.pem & cert.pem will be in root folder

to use `ngrox`
run yarn watch
and open another terminal and run ./ngrox http 3000

> Written with [StackEdit](https://stackedit.io/).
