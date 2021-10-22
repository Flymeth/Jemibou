FROM baseImage
ARG path=./main.js
RUN node ${path}