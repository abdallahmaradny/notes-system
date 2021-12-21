upstream backend {
server localhost:4020;
}

server {
listen 80 default_server;
listen [::]:80 default_server;
server_name _;

root /home/abdallah/Desktop/modeso/notes-system/Backend;
index index.html;

location / {
try_files $uri @backend;
}

location /notes {
root /home/abdallah/Desktop/modeso/notes-system/Backend/public;
}


location @backend {
proxy_pass http://backend;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header Host $host;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
# Following is necessary for Websocket support
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
}
}