console.log("IMDb Play Icon Script Running!");

const observer = new MutationObserver(() => {
  const pageTitle = document.querySelector("h1");
  console.log(pageTitle);
  if (pageTitle && !pageTitle.querySelector('.play-icon')) {
    console.log("Target element found:", pageTitle);

    const playIcon = document.createElement("span");
    playIcon.className = "play-icon"; // Add a class to avoid duplicates
    playIcon.textContent = " ▶️";
    playIcon.style.cursor = "pointer";
    playIcon.style.color = "green";
    playIcon.title = "Click to play in an overlay, ctrl+click (cmd+click on Mac) to open in a new tab.";
    playIcon.addEventListener("click", (e) => {
      const pathSegments = window.location.pathname.split('/').filter(segment => segment);
      let imdb_id = pathSegments[1];
      let media_type = document.querySelector('meta[property="og:type"]')?.content;
      let base_url = localStorage.getItem('lightboxBaseUrl') || 'https://vidsrc.xyz/embed/';

      if (!base_url.endsWith('/')) {
        base_url += '/';
      }

      let video_url = base_url + '/movie/' + imdb_id;
      if (media_type === 'video.tv_show') {
        video_url = base_url + '/tv/' + imdb_id;
      }

      if (e.ctrlKey || e.metaKey) {
        window.open(video_url);
      } else {
        createLightbox(video_url);
      }
    });

    pageTitle.appendChild(playIcon);
  }
});

// Start observing the body for changes
observer.observe(document.body, {childList: true, subtree: true});


function createLightbox(iframeSrc) {
  // Create lightbox container
  const lightbox = document.createElement('div');
  Object.assign(lightbox.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '9999',
  });

  // Create iframe
  const iframe = document.createElement('iframe');
  Object.assign(iframe.style, {
    width: '90%',
    height: '90%',
    border: 'none',
    borderRadius: '8px',
  });
  iframe.allowFullscreen = true;
  iframe.src = iframeSrc;

  // Append iframe to lightbox
  lightbox.appendChild(iframe);

  // Close lightbox when clicking outside iframe
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      lightbox.remove();
    }
  });

  // Add lightbox to the body
  document.body.appendChild(lightbox);
}