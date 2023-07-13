async function carregaProfessor() {
  var userId = parseInt(sessionStorage.getItem('userId'));
  const postContainer = document.getElementById("posts-container");
  postContainer.innerHTML = "";

  const data = {
    userId: userId,
  };

  try {
    const response = await fetch('http://localhost:5600/html/feed-professor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });

    if (response.status === 200) {
      const professors = await response.json();

      for (let i = 0; i < professors.length; i++) {
        const professor = professors[i];
        var url_img_user = '/svg/user.svg';

        const professorHTML = `
          <div class="post-professor">
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

        await carregaComment(professor.professor_id);
      }
      
      console.log('Professores carregados com comentários.');
    } else {
      throw new Error('Erro ao carregar os professores');
    }
  } catch (error) {
    console.error(error);
  }
}

async function carregaComment(professorId) {
  var userId = parseInt(sessionStorage.getItem('userId'));
  const postContainer = document.getElementById("posts-container");
  const data = {
    professorId: professorId
  };

  try {
    const response = await fetch('http://localhost:5600/html/feed-professor-comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });

    if (response.status === 200) {
      const comments = await response.json();

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
              <div class="">
                <button class="post-like-button" id="${comment.comment_id}" onclick="like(this.id)">
                <img src="/svg/like.svg" width="20" height="20">
              </button>
              <span class="likes-count">${comment.comment_likes}</span>
              </div>
              <div class="post-trash-can">
                <button class="post-trash-can" id="${comment.comment_id + 'T'}" onclick="deleteComment(this.id)">
                  <img src="/svg/trash-symbolic.svg" width="24" height="24" alt="Lixeira">
                </button>
              </div>
              <div class="post-report">
              <button class="post-report" id="${comment.comment_id + 'R'}" onclick="reportComment(this.id, ${comment.user_id})">
                <img src="/svg/report.svg" width="24" height="24" alt="Lixeira">
              </button>
            </div>
            
              
          </div>
        `;
        postContainer.innerHTML += commentHTML;
        checkUserIdVisibility(userId, comment.user_id, comment.comment_id );
      }

      console.log('Comentários carregados.');
    } else {
      throw new Error('Erro ao carregar os comentários');
    }
  } catch (error) {
    console.error(error);
  }
}

function checkUserIdVisibility(userId, commentId, ID) {
  const trashCanElement = document.getElementById(ID+'T');
  var isAdm = sessionStorage.getItem('is_adm');

  console.log(isAdm);
  
  if ((userId === commentId) || (parseInt(isAdm) === 1)) {
    trashCanElement.style.display = 'block';
  } else {
    trashCanElement.style.display = 'none';
  }
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
function like(commentId) {
  const userId = sessionStorage.getItem('userId');
  const data = {
    userId: userId,
    commentId: commentId
  };

  fetch('http://localhost:5600/html/feed-professor-like', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  })
    .then(response => {
      if (response.status === 200) {
        carregaProfessor();
        console.log("Like foi dado.")
      } else {
        console.log("problema interno no servidor.")
      }
    });
}

function deleteComment(commentId) {
  commentId = commentId.slice(0, -1);;
  var userId = parseInt(sessionStorage.getItem('userId'));
  const data = {
    userId: userId,
    commentId: commentId,
  };

  fetch('http://localhost:5600/html/feed-professor-delete-comment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  })
    .then(response => {
      if (response.status === 200) {
        carregaProfessor();
        console.log("Comment foi deletado.")
      }
      else {
        console.log("Problema interno no servidor.")
      }
    })
}

function reportComment(commentId, user_id) {
  commentId = commentId.slice(0, -1);;
  const data = {
    userId: user_id,
    commentId: commentId,
  };

  fetch('http://localhost:5600/html/feed-professor-report-comment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  })
    .then(response => {
      if (response.status === 200) {
        carregaProfessor();
        console.log("Comment foi deletado.")
      }
      else {
        console.log("Problema interno no servidor.")
      }
    })
}
//Executa a função quando a página é carregada
document.addEventListener("DOMContentLoaded", carregaProfessor);