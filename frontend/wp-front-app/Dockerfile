FROM node:18-alpine

ARG APP_HOME=/frontend

RUN mkdir ${APP_HOME}
WORKDIR ${APP_HOME}

# install npm
COPY ./package.json ./
RUN npm install

COPY . ${APP_HOME}

# copy start script
COPY ./script/start /start
RUN sed -i  's/\r$//g' /start
RUN chmod +x /start

EXPOSE 3000

CMD [ "/start" ]

