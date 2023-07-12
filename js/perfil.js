function carregaPosts() {
  var userId = parseInt(sessionStorage.getItem('userId'));
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
      for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        var url_img_user = '/svg/user.svg';

        const postHTML = `
          <div class="post">
            <div class="post-metadata">
              <img src="${url_img_user}" class="user-profile-picture" width="48" height="48">
              <p class="post-author-name">${post.username}</p>
              <p class="post-date">${post.created_time}</p>
            </div>
            <p class="post-text-content">${post.content}</p>
            <div class="post-image-container">
            </div>
            <div class="post-reply-button">
              <img src="/svg/edit.svg", width=20, height=20>
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


function carregarDados() {
    var userId = parseInt(sessionStorage.getItem('userId'));
  
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
        var role = '🏢 '+data.role;
        var email = '✉️ '+data.email;
        var username = data.username;
  
        var area_role = document.getElementById('cargo-area');
        var area_email = document.getElementById('email-area');
        var area_username = document.getElementById('name-area');
  
        area_role.textContent = role;
        area_email.textContent = email;
        area_username.textContent = username;

        var area_comment = document.getElementsByClassName("post-author-name");

        for (var i = 0; i < area_comment.length; i++) {
          area_comment[i].textContent = username;
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
  var userId = parseInt(sessionStorage.getItem('userId'));

  var content = document.getElementById("new-content-post").value;
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
  var userId = parseInt(sessionStorage.getItem('userId'));
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
  var userId = parseInt(sessionStorage.getItem('userId'));
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


//Executa a função quando a página é carregada
document.addEventListener("DOMContentLoaded", carregaPosts);
document.addEventListener("DOMContentLoaded", carregarDados);