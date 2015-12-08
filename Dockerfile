FROM ubuntu:14.04
MAINTAINER Adam Michael <adam@ajmichael.net>

RUN apt-get clean && apt-get update
RUN apt-get -y install python-software-properties git build-essential
RUN apt-get -y install software-properties-common
RUN add-apt-repository -y ppa:chris-lea/node.js
RUN apt-get update
RUN apt-get -y install nodejs

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /opt/app && cp -a /tmp/node_modules /opt/app/

WORKDIR /opt/app
ADD . /opt/app

EXPOSE 3000
CMD [ "npm", "start" ]
