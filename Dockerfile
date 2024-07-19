FROM node:10-alpine

#COPY PACKAGE JSON FILE
COPY package.json package.json
COPY package-lock.json package-lock.json

#INSTALL PACKAGE
RUN npm install

#COPY SOURCE FILES
COPY . .

#EXPOSE API PORT
EXPOSE 8000

#RUN THE APP
CMD ["npm", "start"]