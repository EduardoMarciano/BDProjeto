# Blog para Avaliação de Professores e Disciplinas.
#### Feito por Eduardo Marciano de Melo Meneses, 4 semestre, semestre 2023/1.

## Configurações de ambiente, sistema operacional Linux (Debian):

### Necessário instalação do node.js para rodar o back-end:
	sudo apt update
	sudo apt install nodejs
	sudo npm install -g npm
### Instalar dependências do sistema:
		cd ../BDProjeto/node
		npm install
#### O npm irá cuidar automaticamente de instalar cada dependência do sistema.

#### Caso a primeira alternativa não funcione, é possível instalar individualmente todas as bibliotecas utilizadas no sistema com sua devida versão.
## Configurações da .env:
### É necessário colocar na .env o nome e a senha de acesso do usuário que irá interagir com o MariaDB, seguirei utilzando o user como root.
	DB_user		= Seu usuário de acesso.
	DB_PASSWORD = Sua senha de acesso.
### Caso queira utlizar os serviços de envio de email, será necessário ter um email configurado para utilizar o smtp do outlook e inserir as seguintes variáveis na .env:
	MAIL_USER= Seu email corretamente configurado.
	MAIL_PASSWORD= Sua senha de acesso ao email.
## Configuração do MariaDB.
### É necessário ter o MariaDB instalado em seu sistema. A instalação é possível seguindo estes passos:
	sudo apt update
	sudo apt install mariadb-server
### iniciar o serviço do MariaDB:
	sudo systemctl start mariadb
### Acessar o shell do MariaDB:
	mysql -u root -p
### Criar a DataBase:
	CREATE DATABASE BDprojeto;
### Conceder privilégios ao usuário de acesso, exemplo para o usuário root, para acessar a base de dados:
	GRANT ALL PRIVILEGES ON BDprojeto.* TO 'root'@'localhost';
	FLUSH PRIVILEGES;
 ## Gerar tabelas e povoá-las:
 ### Por fim, para gerar as tabelas da database e fazer o povoamento automático do banco de dados, execute os seguintes comando:
	node db.js
 	node geraEntidades.js
  	node server.js
## Execução da Aplicação:
#### Para rodar o sistema, agora, basta apenas usar o Live Server, https://open-vsx.org/extension/ritwickdey/LiveServer, na página de login. Lembre-se de deixar o server.js rodando enquanto a utilização do sistema.
## Modelo Conceitual:
![Diagrama de Entidade-Relacionamento](MER/ModeloConceitual.png)
## Modelo Relacional:
![Diagrama de Entidade-Relacionamento 2](MER/ModeloRelacional.png)
## Vídeo Demonstrativo:
### https://youtu.be/HDrOMiBEB-w
## Relatório Técnico (Link apenas para visualização):
### https://www.overleaf.com/read/gbfbbbswxqsr
