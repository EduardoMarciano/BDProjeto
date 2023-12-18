function createBars() {
    fetch('header.html')
        .then(response => response.text())
        .then(navBarHTML => {
            let navBarContainer = document.getElementById('header-bar-container');
            navBarContainer.innerHTML = navBarHTML;
        });

    fetch('footer.html')
        .then(response => response.text())
        .then(footerBarHTML => {
            let footerBarContainer = document.getElementById('footerbar-container');
            footerBarContainer.innerHTML = footerBarHTML;
   })
    let head  = document.getElementsByTagName('head')[0];
    let link  = document.createElement('link');

    link.rel  = 'stylesheet';
    link.href = '/css/reusables.css';
    head.appendChild(link);
}