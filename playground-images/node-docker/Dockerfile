FROM ubuntu:focal

RUN apt-get update
RUN apt-get install -y unzip curl
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get upgrade -y
RUN apt-get install -y nodejs

RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
RUN unzip awscliv2.zip
RUN ./aws/install

WORKDIR /home/app

COPY main.sh main.sh
COPY index.js index.js

RUN chmod +x main.sh

ENTRYPOINT [ "/home/app/main.sh" ]
