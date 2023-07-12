function carregaProfessor() {
  var userId = parseInt(sessionStorage.getItem('userId'));
  const postContainer = document.getElementById("posts-container");
  postContainer.innerHTML = "";

  const data = {
    userId: userId,
  };

  fetch('http://localhost:5600/html/feed-professor', {
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
    .then(professors => {
      const promises = [];

      for (let i = 0; i < professors.length; i++) {
        const professor = professors[i];
        var url_img_user = '/svg/user.svg';

        const professorHTML = `
          <div class="post">
            <div class="post-metadata">
              <img src="${url_img_user}" class="user-profile-picture" width="48" height="48">
              <p class="post-author-name">${professor.professor_name}</p>
              <p class="post-date">${professor.discipline_code} ${professor.department_name}</p>
            </div>
            <p class="post-text-content">Professor de ${professor.discipline_name} da Turma ${professor.turma_id}.</p>
            <div class="post-image-container">
            </div>
            <div class="post-reply-button" id="${professor.professor_id}">
              <button class="post-reply-button" id="${professor.professor_id}" onclick="openModal(this.id)">
              <img src="/svg/chat-bubble-symbolic.svg" width="20" height="20">
            </button>
            </div>
          </div>
        `;
        postContainer.innerHTML += professorHTML;

        carregaComment(professor.professor_id);
      }

    }).catch(error => {
      console.error(error);
    });
}


function carregaComment(professorId) {
  const postContainer = document.getElementById("posts-container");
  const data = {
    professorId: professorId
  };

  fetch('http://localhost:5600/html/feed-professor-comments', {
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
    .then(comments => {
      for (let i = 0; i < comments.length; i++) {
        const comment = comments[i];
        console.log(comment);
        var url_img_user = '/svg/user.svg';

        const commentHTML = `
        <div class="post">
        <div class="post-metadata">
          <img src="${url_img_user}" class="user-profile-picture" width="48" height="48">
          <p class="post-author-name">${comment.user_username}</p>
          <p class="post-date">${comment.comment_created_time}</p>
        </div>
        <p class="post-text-content">${comment.comment_content}</p>
        <div class="post-image-container">
      </div>
        `;
        postContainer.innerHTML += commentHTML;
      }

      console.log('Comentários carregados.');
    })
    .catch(error => {
      console.error(error);
    });
}


function openModal(professor_id) {
  sessionStorage.setItem('professor_id', professor_id);

  const dialogElement = document.getElementById('modal-post-editor');
  dialogElement.style.display = 'flex';
  dialogElement.showModal();
}

function closeModal() {
  const dialogElement = document.getElementById("modal-post-editor");
  dialogElement.style.display = "none";
  dialogElement.close();
}

function publishModal() {
  const professorId = sessionStorage.getItem('professor_id');
  releaseComment(professorId);
  closeModal();
}

function releaseComment(professorId) {
  var content = document.getElementById("new-content-post").value;
  const userId = sessionStorage.getItem('userId');
  const data = {
    userId: userId,
    professorId: professorId,
    content: content
  };

  fetch('http://localhost:5600/html/feed-professor-new-comment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  })
    .then(response => {
      if (response.status === 200) {
        carregaProfessor();
        console.log("Comment foi criado.")
      } else {
        console.log("problema interno no servidor.")
      }
    });
}

//Executa a função quando a página é carregada
document.addEventListener("DOMContentLoaded", carregaProfessor);