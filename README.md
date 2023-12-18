# BDProjeto | Blog para Avaliação de Professores e Disciplinas.
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
## Configuração do MariaDB.
### É necessário ter o MariaDB instalado em seu sistema. A instalação é possível seguindo estes passos:
	sudo apt update
	sudo apt install mariadb-server
#### Depois, será necessário definir uma senha de acesso segura. Isto pode ser feito seguindo estes passos:
### iniciar o serviço do MariaDB:
	sudo systemctl start mariadb
### Acessar o shell do MariaDB:
	mysql -u root -p
### Atualizar os privilégios:
	FLUSH PRIVILEGES;
### Criar a DataBase:
	CREATE DATABASE BDprojeto;
### Conceder privilégios ao usuário root para acessar a base de dados:
	GRANT ALL PRIVILEGES ON BDprojeto.* TO 'root'@'localhost';
	FLUSH PRIVILEGES;
 ## Gerar tabelas e povoá-las:
 ### Por fim, para gerar as tabelas da database e fazer o povoamento automático do banco de dados, execute os seguintes comando:
	node db.js
 	node geraEntidades.js
  	node server.js
## Executar código:
#### Para rodar o sistema, agora, basta apenas usar o Live Server, https://open-vsx.org/extension/ritwickdey/LiveServer, na página de login. Lembre-se de deixar o server.js rodando enquanto a utilização do sistema.
## Modelo Conceitual:
![Diagrama de Entidade-Relacionamento](MER/ModeloConceitual.png)
## Modelo Relacional:
![Diagrama de Entidade-Relacionamento 2](MER/ModeloRelacional.png)
## Vídeo Demonstrativo:
### https://youtu.be/HDrOMiBEB-w
## Relatório Técnico (Link apenas para visualização):
### https://www.overleaf.com/read/gbfbbbswxqsr

