FROM debian:10

ENV NODEJS_VERSION=12

RUN     apt-get update && apt-get install --allow-unauthenticated -y \
                wget \
                curl \
                nano \
                sudo  \
                git \
        && rm -rf /var/lib/apt/lists/*



RUN curl -sL https://deb.nodesource.com/setup_$NODEJS_VERSION.x | sudo -E bash -
RUN sudo apt-get install -y nodejs

WORKDIR ./DatafariUI
COPY . .
RUN COMMIT_NUMBER=$(git rev-parse --short HEAD) && echo $COMMIT_NUMBER && echo COMMIT_NUMBER=$COMMIT_NUMBER > .env.production
RUN npm install
RUN npm run build
