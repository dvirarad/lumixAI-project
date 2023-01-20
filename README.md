# DataManipolator

This application is designed to save unstructured data at scale and expose an API for searching the data and getting metadata about it. Additionally, there is an audit log service for research.

## Services

The application consists of four services:

1.  data-search
2.  statistics-manager
3.  MongoDB
4.  RabbitMQ

## Deployment

To start the service, first run `git clone`. The application can be deployed in two ways:

1.  Using the `docker-compose up` command line
2.  By running the following commands:
    -   `cd data-search` then `node start run`
    -   `cd statistics-manager` then `node start run`

## data-search

The data-search service exposes the following:

-   Port: 3000
-   Swagger documentation can be found at [https://localhost:3000/api](https://localhost:3000/api)
-   Two APIs:

    1.  `POST http://localhost:3000/data-fetcher`

    -   This API takes a URL parameter in the body and calls the API. Using pagination, the data is called and saved in the MongoDB.
    -   The service runs vector normalization for the text and publishes it to the RabbitMQ exchange.
    -   At the end of the API, the audit log is updated using a different RabbitMQ exchange.
    -   Environment variable:
        -   TOTAL_INSERT_DATA_PER_REQUEST:2000 - block the amount of rows to update per request

    2.  `GET http://localhost:3000/data-fetcher?text=<string>`

    -   This API performs a search query over the saved data from API (1).
    -   At the end of the API, the audit log is updated using a different RabbitMQ exchange.

![enter image description here](https://www.websequencediagrams.com/cgi-bin/cdraw?lz=dGl0bGUgIERhdGEgdHJhbnNmZXIgCgphY3RvciBVc2VyCgpwYXJ0aWNpcGFudAAjBVRyYXNuZGVyIGFzIEEAEQ1OZXR3b3JrIGFzIEIAKg1Nb25nb0RCIGFzIEQAJA5vcm1hbGl6YXRpb24gYXMgVgBiDUFNUVAgYXMgUgoKVXNlci0-QTpQT1NUIHVybApBLT5COiBHZXQgZGF0YSB1c2luZwAUBUItPkE6AIFMBmdldCBpbiBwYWdhaW5nCgpsb29wIHBhZ2UKICAgIEEtPkQ6IGluc2VydCB0byBEQiBpbiBjaHVua3Mgb2YgMTAwACAIVjoAgRwPdGhlAHIGdG8gdmUAgikFb2Ygd29yZHMgZm9yIHJvdwBcCFI6IHB1Ymxpc2gAMQVuAIFtBmUgdmVjb3RyIHRvIHJvdXRpbmcga2V5IAplbmQKCgApDkF1ZGl0IGxvZwoKQU1RUDwtLT5Vc2VyOgABDToKAIIbCkdFVCB0ZXh0IHNlYXJjaAoAgWQGAAcGAIIjBwAaBWluZGV4CkQAgiwFcmV0dXJuaW5nIHJvdwCCTwUAbhggIAoKCgo&s=roundgreen)

## statistics-manager

The statistics-manager service exposes the following:

-   Port: 5000
-   Swagger documentation can be found at [https://localhost:5000/api](https://localhost:5000/api)
-   Two flows:

    1.  Audit management

    -   Subscribes to the audit log and saves it in the MongoDB
    -   GET API [http://localhost:5000/audit?text=](http://localhost:5000/audit?text=)<string>&startTime=<number>&endTime=<number>

    ![enter image description here](https://www.websequencediagrams.com/cgi-bin/cdraw?lz=dGl0bGUgIEF1ZGl0IFNlcnZpY2UKCmFjdG9yIFVzZXIKCnBhcnRpY2lwYW50IEFNUVAgYXMgUgAID3VkaXQANgcgYXMgQQAoDU1vbmdvREIgYXMgRApSLT4gQTogc3Vic2NyaXZlIHRvIGEAeAVldmVudApBLT5EOiBpbnNlcnQgbmV3IHJvdyB0byBEQgogClVzZXIAOQdlYXJjaCBieSBkYXRlIGFuZC9vcgAOCHRleABBCHJ1bm5pbmcgaW5kZXggcXVlcnkgdG8gZmV0Y2ggdGhlIGRhdGEKCgoKCgo&s=modern-blue)
    2.  Word popolated API

    -   GET [http://localhost:5000/word-counter?top=](http://localhost:5000/word-counter?top=)<number>
    -   This API returns the most populated words in the MongoDB.

![enter image description here](https://www.websequencediagrams.com/cgi-bin/cdraw?lz=dGl0bGUgIFdvcmQgQ291bnRlciBTZXJ2aWNlCgphY3RvciBVc2VyCgpwYXJ0aWNpcGFudCBBTVFQIGFzIFIACQ4AOQwAPQcgYXMgQQAvDU1vbmdvREIgYXMgRApSLT4gQTogc3Vic2NyaXZlIHRvIHdvcmQgY291bnQgZXZlbnQKQS0-QTogcnVubmluZyBncm91cEJ5IGxvZ2ljIHRvIG9wdGltemUgdGhlIGluc2VyAC0FRDogdXBzZXJ0ABMFREIgdXNpbmcgYnVsayBvcGVyYXRpb24KIApVc2VyAIB_BmFzayBmb3IgdG9wAIB_BXMAQAcAcQhzb3J0IHF1ZXJ5IHRvIGZldGNoAG8FbW9zdCBwb3BvbGF0ZQAzBwoKCgoK&s=omegapple)

## MongoDB and RabbitMQ

MongoDB is used to store the data and audit logs, while RabbitMQ is used for message publishing and subscription between services.

## Note

Please make sure to configure the environment variables according to your setup and configure the MongoDB and RabbitMQ credentials accordingly.




