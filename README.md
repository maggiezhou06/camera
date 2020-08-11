# Mobile Camera
Run [demo](https://54.90.130.57/#/)  

## Architecture
![Diagram](https://github.com/maggiezhou06/camera/blob/master/ubuntu_webpack_server/architecture.png)

## Project setup


### Generate SSL Certificate Webpack
#### Generate private key
openssl genrsa -out private.key 4096
#### Signing request
openssl req -new -sha256 \
    -out private.csr \
    -key private.key \
    -config ssl.conf 
#### Generate certificate
openssl x509 -req \
    -days 3650 \
    -in private.csr \
    -signkey private.key \
    -out private.crt \
    -extensions req_ext \
    -extfile ssl.conf
#### Add to keychain and trust certificate
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain private.crt
#### Create pem file from certificate
openssl x509 -in private.crt -out private.pem -outform PEM

### Connect to servers
ssh -i "aws-keypair.pem" ubuntu@54.175.248.168
ssh -i "aws-keypair.pem" ubuntu@54.90.130.57

### MySql setup
CREATE TABLE `listOfUsers` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `First_Name` varchar(255) NOT NULL,
  `Last_Name` varchar(255) NOT NULL,
  `Username` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `Username` (`Username`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

### Installations
```
npm install
```
### Compile
```
npm run build
```
### Run project
```
npm start
```
