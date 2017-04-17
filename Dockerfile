FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Set environment to production
ENV NODE_ENV production
# ENV ADMIN_EMAIL aaron_colaco@persistent.co.in
# ENV ADMIN_EMAIL_PASSWORD user_password_here

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

EXPOSE 3000
CMD [ "npm", "start" ]
