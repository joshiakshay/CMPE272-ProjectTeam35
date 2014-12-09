

# Virtual-Badge
This is `Virtual Badge` app a college project for `CMPE 272` made by Prashant Yadav, Prashant Luthra, Akshay Talathi and Akshay Joshi. The basic idea of this project is to make badging system by combining everyday usable devices with intelligent software, which can read QR code generated for the user.

The whole concept of it is to give user valid access by scanning QR code generated by system after user logins to the system. We are trying to give solution to the problems of physically carrying badges all around and redundancy in existing system with duplicate badges.
##URL of app-
(http://virtual-badge.mybluemix.net/)

## Developmnet
We used NodeJS,Express as the middleware and Bootstrap for our User Interface.Our backend was implemented using MySQL.

We used Sencha Touch to develop mobile interface for login, where the user login using his credentials and he gets the QR code after successful login. The mobile app was hosted on XAMP server which was access over the internet on the phone.
Using Sencha touch we can develop rich HTML5 CSS3 rich client mobile application.

## Deployment
We have deployed our application on Bluemix - PaaS provided by IBM. We have used NodeJS container and we have binded the MySQL service provided by CLearDB.

## Working

#####1.	User registers into the system with login credentials.
![][drag]
#####2.	For the project purpose we have assigned admin rights to :
Username – `admin@vb.com` , password – `admin`.
![][admin]
#####3.	Admin will log into the system and manage organizations, manage access points of organizations and grant access to registered users.
Manage Organizations:
![][org]
Manage Access Points:
![][access-pt]
Manage Users : 
![][user]
#####4.	Registered use mobile device to login into the system using login credentials and generated QR code will be displayed on the mobile screen.

User login on mobile:
![][mobile-login]

Generated QR code:
![][QR]

QR scanner screen:
![][screen]

#####5.	User will scan the QR code and system will validate user access and display the status on the screen.

Access granted to user:
![][granted]

Access denied to user:
![][denied]


[drag]: https://cloud.githubusercontent.com/assets/8674941/5333858/bd24daa0-7e39-11e4-8a3f-9edde6c370b3.png
[admin]: https://cloud.githubusercontent.com/assets/8674941/5333891/e992ecd4-7e3a-11e4-8ea4-1b62c65344d4.png
[org]: https://cloud.githubusercontent.com/assets/8674941/5333893/f29f8c1a-7e3a-11e4-9199-71a980087c12.png
[user]: https://cloud.githubusercontent.com/assets/8674941/5333895/fa724d38-7e3a-11e4-861d-e7dc70cff677.png
[access-pt]: https://cloud.githubusercontent.com/assets/8674941/5333894/f5c34170-7e3a-11e4-9709-fe2315a63023.png
[mobile-login]: https://cloud.githubusercontent.com/assets/8674941/5333938/a7ef49c0-7e3b-11e4-9175-b924b9d1c836.png
[QR]: https://cloud.githubusercontent.com/assets/8674941/5333942/b4679180-7e3b-11e4-9691-ff07e3fc45a4.png
[screen]: https://cloud.githubusercontent.com/assets/8674941/5333944/be717cf4-7e3b-11e4-8d9c-dec102c1f717.png
[granted]: https://cloud.githubusercontent.com/assets/8674941/5346997/e7dc5ef8-7ed9-11e4-9638-140e65223785.png
[denied]: https://cloud.githubusercontent.com/assets/8674941/5346995/e5d37506-7ed9-11e4-9158-75b1133ded1b.png
## Tools

Created with [Nodeclipse](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   

Nodeclipse is free open-source project that grows with your contributions.
