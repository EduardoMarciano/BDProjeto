function carregaPosts() {
    let userId = parseInt(sessionStorage.getItem('userId'));
    const postContainer = document.getElementById("posts-container");
  
    postContainer.innerHTML = "";
  
    const data = {
      userId: userId,
    };
  
    fetch('http://localhost:5600/html/feed-post', {
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
        posts = posts[0];

        for (let i = 0; i < posts.length; i++) {
          const post = posts[i];

          console.log(post);
          console.log(i);
          let url_img_user = post.user_image;
  
          const postHTML = `
            <div class="post">
              <div class="post-metadata">
                <img src="${url_img_user}" class="user-profile-picture" width="48" height="48">
                <p class="post-author-name">${post.username}</p>
                <p class="post-date">${post.created_time}</p>
              </div>
              <p class="post-text-content">${post.content}</p>
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


  document.addEventListener("DOMContentLoaded", carregaPosts);
