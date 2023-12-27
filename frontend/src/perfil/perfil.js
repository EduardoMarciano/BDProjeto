function carregaPosts() {
  let userId = parseInt(sessionStorage.getItem('userId'));
  const postContainer = document.getElementById("posts-container");

  postContainer.innerHTML = "";

  const data = {
    userId: userId,
  };

  fetch('http://localhost:5600/html/perfil-post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  })
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error('Erro ao carregar os posts');
      }
    })
    .then(posts => {
      for (const element of posts) {
        const post = element;

        const postHTML = `
          <div class="post">
            <div class="post-metadata">
              <img src="${post.user_image}" class="user-profile-picture" width="48" height="48">
              <p class="post-author-name">${post.username}</p>
              <p class="post-date">${post.created_time}</p>
            </div>
            <p class="post-text-content">${post.content}</p>
            <div class="post-image-container">
            </div>
            
            <div class="post-reply-button">
              <button class="post-trash-can" id="${post.id+"R"}" onclick ="openModal(this.id)">
                <img src="/svg/edit.svg", width=20, height=20>
              </button>

            </div>
            <div class="post-trash-can">
              <button class="post-trash-can" id="${post.id}" onclick ="deletePost(this.id)">
                <img src="/svg/trash-symbolic.svg" width="24" height="24" alt="Lixeira">
              </button>
            </div>
          </div>
        `;
        postContainer.innerHTML += postHTML;
      }

      console.log('Informações carregadas.');
    })
    .catch(error => {
      console.error(error);
    });
}

function openModal(postId) {
  postId = postId.slice(0, -1);
  sessionStorage.setItem('postId', postId);
  const dialogElement = document.getElementById('modal-post-editor-2');
  dialogElement.style.display = 'flex';
  dialogElement.showModal();
}
function closeModal() {
  const dialogElement = document.getElementById("modal-post-editor-2");
  dialogElement.style.display = "none";
  dialogElement.close();
}
function publishModal() {
  const postId = sessionStorage.getItem('postId');
  releaseUpdate(postId);
  closeModal();
}


function carregarDados() {
    let userId = parseInt(sessionStorage.getItem('userId'));
  
    const data = {
      userId: userId,
    };
  
    fetch('http://localhost:5600/html/perfil', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        }
      }).then(data => {
        userId = data.userId;
        let role = '🏢 '+data.role;
        let email = '✉️ '+data.email;
        let username = data.username;
  
        let area_role = document.getElementById('cargo-area');
        let area_email = document.getElementById('email-area');
        let area_username = document.getElementById('name-area');
        let image_user = document.getElementById('user-profile-picture');
  
        area_role.textContent = role;
        area_email.textContent = email;
        area_username.textContent = username;
        image_user.src = data.image;

        let area_comment = document.getElementsByClassName("post-author-name");

        for (const element of area_comment) {
          element.textContent = username;
        }
        
  
        console.log('Informações carregadas.');
      })
  }

  function setupModalPostEditor() {
    const modalPostEditor = {
      close: function() {
        modalPostEditor.dialogElement.style.display = "none";
        modalPostEditor.dialogElement.close();
      },
      open: function() {
        modalPostEditor.dialogElement.style.display = "flex";
        modalPostEditor.dialogElement.showModal();
      },
      publish: function() {
        releasePost();
        modalPostEditor.dialogElement.style.display = "none";
        modalPostEditor.dialogElement.close();
      },
  
      dialogElement: document.getElementById("modal-post-editor"),
      openButton: document.getElementById("new-post-button"),
      closeButton: document.getElementById("modal-post-editor-cancel"),
      publishButton: document.getElementById("modal-post-editor-publish"),
    };
  
    modalPostEditor.openButton.onclick = modalPostEditor.open;
    modalPostEditor.closeButton.onclick = modalPostEditor.close;
    modalPostEditor.publishButton.onclick = modalPostEditor.publish;
  }

function releasePost(){
  let userId = parseInt(sessionStorage.getItem('userId'));

  let content = document.getElementById("new-content-post").value;
  console.log(content);
  const data = {
    userId: userId,
    content: content,
  };

  fetch('http://localhost:5600/html/perfil-new-post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  })
    .then(response => {
      if (response.status === 200) {
        carregaPosts();
        carregarDados();
        console.log("Post foi criado.")
      }
      else{
        console.log("problema interno no servidor.")
      }
    })
}


function deletePost(postId) {
  let userId = parseInt(sessionStorage.getItem('userId'));
  const data = {
    userId: userId,
    postId: postId,
  };

  fetch('http://localhost:5600/html/perfil-delete-post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  })
    .then(response => {
      if (response.status === 200) {
        carregaPosts();
        carregarDados();
        console.log("Post foi deletado.")
      }
      else {
        console.log("Problema interno no servidor.")
      }
    })
}

function deleteUser() {
  let userId = parseInt(sessionStorage.getItem('userId'));
  const data = {
    userId: userId,
  };

  fetch('http://localhost:5600/html/perfil-delete-user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  })
    .then(response => {
      if (response.status === 200) {
        goToLogin();
      }
      else {
        console.log("Problema interno no servidor.")
      }
    })
}

function goToLogin() {
  sessionStorage.removeItem('userId');
  window.location.href = "login.html";
}

function goToEditar() {
  window.location.href = "editar-dados.html";
}

function releaseUpdate(postId) {
  let content = document.getElementById("new-content-post-2").value;
  const data = {
    postId: postId,
    content: content
  };

  fetch('http://localhost:5600/html/perfil-update-post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  })
    .then(response => {
      if (response.status === 200) {
        carregaPosts();
        console.log("Post atualizado com sucesso.")
      } else {
        console.log("Problema interno no servidor.")
      }
    });
}

function selecionaFiles() {
  const selectProfileImage = document.getElementById("select-profile-image");
  const imageInput = document.getElementById("image-input");
  const userId = parseInt(sessionStorage.getItem('userId'));

  selectProfileImage.onclick = function() {
    imageInput.click();
  };

  imageInput.onchange = function(event) {
    const filePath = event.target.value;

    if (filePath !== "") {
      const data = {
        userId: userId,
        imagePath: filePath
      };

      enviarArquivo(data);
    }
  };
}

function enviarArquivo(data) {
  fetch('http://localhost:5600/html/perfil-change-image', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  })
    .then(response => {
      if (response.status === 200) {
        console.log("Imagem atualizada com sucesso.");
        carregarDados();
        carregaPosts();
      } else {
        console.log("Problema interno no servidor.");
      }
    })
    .catch(error => {
      console.log("Erro ao atualizar imagem:", error);
    });

  }

//Executa a função quando a página é carregada
document.addEventListener("DOMContentLoaded", carregaPosts);
document.addEventListener("DOMContentLoaded", carregarDados);
document.addEventListener("DOMContentLoaded", selecionaFiles);