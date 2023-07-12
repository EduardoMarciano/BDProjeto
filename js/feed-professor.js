function carregaProfessor() {
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
                <p class="post-author-name">${post.name}</p>
                <p class="post-date">${post.departament}</p>
              </div>
              <p class="post-text-content">${post.content}</p>
              <div class="post-image-container">
              </div>
              <div class="post-reply-button">
                <img src="/svg/edit.svg", width=20, height=20>
              </div>
              <div class="post-trash-can"}">
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
  
    

  


//Executa a função quando a página é carregada
document.addEventListener("DOMContentLoaded", carregaPosts);