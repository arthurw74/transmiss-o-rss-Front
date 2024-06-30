# transmiss-o-rss-Front
Repositório básico para adicionar seus feeds RSS ao arquivo YAML do Transmissão-RSS.

## Configuração do Servidor Node.js
Primeiro, crie um projeto Node.js e instale as dependências necessárias:

mkdir yaml-editor
cd yaml-editor
npm init -y
npm install express body-parser

##Clone o repositório.

##Permissões
Certifique-se de que o arquivo /etc/transmission-rss.conf tem as permissões corretas para ser lido e escrito pelo servidor Node.js. Você pode precisar ajustar as permissões usando chmod e chown:
sudo chmod 666 /etc/transmission-rss.conf
sudo chown <seu-usuario>:<seu-grupo> /etc/transmission-rss.conf

##Testar a Aplicação
Inicie o servidor Node.js:

sudo node server.js
Usar sudo pode ser necessário para garantir que o Node.js tenha permissões para acessar o arquivo /etc/transmission-rss.conf.

Criar um Serviço para Iniciar com o Sistema Operacional
Caso queira criar um serviço para iniciar este componente junto com o sistema operacional, siga os passos abaixo:

Crie um arquivo chamado /etc/systemd/system/node-app.service com o seguinte conteúdo:
sudo nano /etc/systemd/system/node-app.service
Edite conforme necessário seguindo o modelo abaixo (edite o local do arquivo em ExecStart):

[Unit]
Description=Node.js Application
After=network.target

[Service]
ExecStart=/usr/bin/node /<local>/yaml-editor/server.js
Restart=always
User=root
Group=root

[Install]
WantedBy=multi-user.target

Execute o comando para habilitar o serviço:
sudo systemctl enable node-app.service
Execute o comando para iniciar o serviço:
sudo systemctl start node-app.service
Para verificar se o serviço está rodando, execute o comando abaixo:
sudo systemctl status node-app.service



