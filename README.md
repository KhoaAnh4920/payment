# ![PlantSmart](/icon.png "This is a sample image.") PS User Service 

## Installation

* _**Config environment**_

Copy file .env.example to .env. then change configuration with your environment.

`cp .env.example .env`

* _**Install modules**_

Install required node modules

`npm install`

* _**Data migration**_

Open file /config/config.json. Change configuration with your environment.

Run migration command.

`npm run migrate`

## Start service

Now you are ready to play. Run start command.

`npm start`