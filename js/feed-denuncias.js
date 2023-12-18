function carregaReports() {
    let userId = parseInt(sessionStorage.getItem('userId'));
    const postContainer = document.getElementById("posts-container");
  
    postContainer.innerHTML = "";
  
    const data = {
      userId: userId,
    };
  
    fetch('http://localhost:5600/html/feed-report-comments', {
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
        for (const element of comments) {
          const comment = element;
          const url_img_user = comment.user_image;
  
          const postHTML = `
            <div class="post">
                <div class="post-metadata">
                    <img src="${url_img_user}" class="user-profile-picture" width="48" height="48">
                    <p class="post-author-name">${comment.user_username}</p>
                    <p class="post-date">${comment.comment_created_time}</p>
                </div>
                <p class="post-text-content">${comment.comment_content}</p>
                <div class="post-accept">
                    <button class="post-trash-can" id="${comment.comment_id + 'T'}" onclick="acceptReport(this.id)">
                        <img src="/svg/aceppty.svg" width="24" height="24" alt="Lixeira">
                    </button>
                </div>
                <div class="post-deny">
                    <button class="post-report" id="${comment.comment_id + 'R'}" onclick="denyReport(this.id, ${comment.user_id})">
                        <img src="/svg/deny.svg" width="24" height="24" alt="Lixeira">
                    </button>
                </div>
            </div>
          `;
          postContainer.innerHTML += postHTML;
          checkUserIdVisibility(comment.comment_id);
        }
        console.log('Informações carregadas.');
      })
      .catch(error => {
        console.error(error);
      });
}
function checkUserIdVisibility(ID) {
    const sim = document.getElementById(ID+'T');
    const nao = document.getElementById(ID+'R');
    let isAdm = sessionStorage.getItem('is_adm');
  
    console.log(isAdm);
    
    if (parseInt(isAdm) === 1) {
        sim.style.display = 'block';
        nao.style.display = 'block';
    } else {
      sim.style.display = 'none';
      nao.style.display = 'none';
    }
  }
    
function denyReport(commentId) {
    commentId = commentId.slice(0, -1);;
    let userId = parseInt(sessionStorage.getItem('userId'));
    const data = {
      userId: userId,
      commentId: commentId,
    };
  
    fetch('http://localhost:5600/html/feed-report-deny-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (response.status === 200) {
          carregaReports();
          console.log("Denuncia foi rejeitada.")
        }
        else {
          console.log("Problema interno no servidor.")
        }
      })
  }

function acceptReport(commentId) {
    commentId = commentId.slice(0, -1);;
    let userId = parseInt(sessionStorage.getItem('userId'));
    const data = {
      userId: userId,
      commentId: commentId,
    };
  
    fetch('http://localhost:5600/html/feed-report-accept-report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (response.status === 200) {
            carregaReports();
          console.log("Denuncia foi aceita.")
        }
        else {
          console.log("Problema interno no servidor.")
        }
      })
  }
  
  //Executa a função quando a página é carregada
  document.addEventListener("DOMContentLoaded", carregaReports);