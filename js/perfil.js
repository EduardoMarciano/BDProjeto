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

//Executa a função quando a página é carregada
document.addEventListener("DOMContentLoaded", carregaPosts);
document.addEventListener("DOMContentLoaded", carregarDados);
document.addEventListener("DOMContentLoaded", carregaPosts());