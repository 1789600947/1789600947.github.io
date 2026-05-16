/* ========================================
   NEON TECH — Interactive Scripts
   ======================================== */

(function() {
  'use strict';

  /* ---------- Back to Top ---------- */
  var totop = document.getElementById('totop');
  var upperLimit = 800;

  function toggleTotop() {
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > upperLimit) {
      totop.classList.add('visible');
    } else {
      totop.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', toggleTotop);

  totop.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Scroll Reveal Animation ---------- */
  var reveals = document.querySelectorAll('.reveal');

  function revealOnScroll() {
    var windowHeight = window.innerHeight;
    reveals.forEach(function(el) {
      var top = el.getBoundingClientRect().top;
      var revealPoint = 120;
      if (top < windowHeight - revealPoint) {
        el.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', revealOnScroll);
  window.addEventListener('load', revealOnScroll);
  revealOnScroll(); // run on load in case some are already visible

  /* ---------- Header Parallax Glow ---------- */
  var header = document.getElementById('header');

  if (header) {
    window.addEventListener('scroll', function() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var opacity = Math.max(0, 1 - scrollTop / 400);
      header.style.opacity = opacity;

      // Move header rings
      var scale = 1 + scrollTop * 0.001;
      var rings = header.querySelector(':after');
      // We adjust through the header itself for simplicity
      if (scrollTop < 360) {
        header.style.backgroundPosition = '50% ' + (scrollTop * 0.3) + 'px';
      }
    });
  }

  /* ---------- Share Button ---------- */
  document.addEventListener('click', function(e) {
    document.querySelectorAll('.article-share-box.on').forEach(function(b) { b.classList.remove('on'); });
    document.querySelectorAll('.qrcode').forEach(function(q) { q.style.display = 'none'; });
  });

  document.addEventListener('click', function(e) {
    var link = e.target.closest('.article-share-link');
    if (!link) return;

    e.stopPropagation();
    e.preventDefault();

    var url = link.getAttribute('data-url') || window.location.href;
    var encodedUrl = encodeURIComponent(url);
    var id = 'article-share-box-' + link.getAttribute('data-id');

    var existing = document.getElementById(id);
    if (existing) {
      existing.classList.toggle('on');
      return;
    }

    var box = document.createElement('div');
    box.id = id;
    box.className = 'article-share-box';
    box.innerHTML =
      '<input class="article-share-input" value="' + url + '" readonly>' +
      '<div class="article-share-links">' +
        '<a href="https://twitter.com/intent/tweet?url=' + encodedUrl + '" class="article-share-twitter" target="_blank" title="Twitter">T</a>' +
        '<a href="https://www.facebook.com/sharer.php?u=' + encodedUrl + '" class="article-share-facebook" target="_blank" title="Facebook">F</a>' +
        '<a href="https://www.linkedin.com/shareArticle?url=' + encodedUrl + '" class="article-share-linkedin" target="_blank" title="LinkedIn">L</a>' +
        '<a href="http://service.weibo.com/share/share.php?url=' + encodedUrl + '" class="article-share-weibo" target="_blank" title="Weibo">W</a>' +
        '<a class="article-share-weixin" title="WeChat">V</a>' +
        '<a class="article-copy-link" title="Copy Link">&#128279;</a>' +
      '</div>';

    box.addEventListener('click', function(ev) { ev.stopPropagation(); });
    document.body.appendChild(box);

    var rect = link.getBoundingClientRect();
    box.style.top = (rect.bottom + window.scrollY + 8) + 'px';
    box.style.left = (rect.left + window.scrollX - 180) + 'px';
    box.classList.add('on');

    box.querySelector('.article-share-input').addEventListener('click', function() {
      this.select();
    });

    box.querySelector('.article-copy-link').addEventListener('click', function() {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(function() {
          var btn = box.querySelector('.article-copy-link');
          btn.textContent = '✓';
          setTimeout(function() { btn.textContent = '🔗'; }, 1500);
        });
      } else {
        box.querySelector('.article-share-input').select();
        document.execCommand('copy');
      }
    });

    box.querySelector('.article-share-weixin').addEventListener('click', function() {
      var qrDiv = box.nextElementSibling;
      if (qrDiv && qrDiv.classList.contains('qrcode')) {
        qrDiv.style.display = qrDiv.style.display === 'block' ? 'none' : 'block';
        return;
      }
      qrDiv = document.createElement('div');
      qrDiv.className = 'qrcode';
      qrDiv.style.cssText = 'padding:10px;text-align:center;';
      var canvas = document.createElement('canvas');
      canvas.width = 180; canvas.height = 180;
      var ctx = canvas.getContext('2d');
      ctx.fillStyle = '#12121a'; ctx.fillRect(0, 0, 180, 180);
      ctx.fillStyle = '#00e5ff';
      ctx.font = '11px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('QR: ' + url.substring(0, 35) + '...', 90, 90);
      qrDiv.appendChild(canvas);
      box.parentNode.insertBefore(qrDiv, box.nextSibling);
      var boxRect = box.getBoundingClientRect();
      qrDiv.style.position = 'absolute';
      qrDiv.style.top = (boxRect.bottom + window.scrollY + 8) + 'px';
      qrDiv.style.left = (boxRect.left + window.scrollX - 180) + 'px';
    });
  });

  /* ---------- Image Caption + Lightbox ---------- */
  document.querySelectorAll('.article-entry').forEach(function(entry) {
    entry.querySelectorAll('img').forEach(function(img) {
      if (img.parentElement.classList.contains('fancybox') ||
          img.parentElement.classList.contains('lightbox-overlay')) return;

      var alt = img.alt;
      if (alt) {
        var caption = document.createElement('span');
        caption.className = 'caption';
        caption.textContent = alt;
        img.parentNode.insertBefore(caption, img.nextSibling);
      }

      img.style.cursor = 'zoom-in';
      img.addEventListener('click', function() {
        var overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';
        var clone = document.createElement('img');
        clone.src = img.src;
        clone.alt = img.alt;
        overlay.appendChild(clone);
        document.body.appendChild(overlay);
        document.body.style.overflow = 'hidden';
        overlay.addEventListener('click', function() {
          document.body.removeChild(overlay);
          document.body.style.overflow = '';
        });
        document.addEventListener('keydown', function escHandler(e) {
          if (e.key === 'Escape') {
            document.body.removeChild(overlay);
            document.body.style.overflow = '';
            document.removeEventListener('keydown', escHandler);
          }
        });
      });
    });
  });

  /* ---------- Mobile Navigation ---------- */
  var container = document.getElementById('container');
  var toggle = document.getElementById('main-nav-toggle');
  var wrap = document.getElementById('wrap');
  var isAnimating = false;

  if (toggle && container && wrap) {
    toggle.addEventListener('click', function() {
      if (isAnimating) return;
      isAnimating = true;
      container.classList.toggle('mobile-nav-on');
      setTimeout(function() { isAnimating = false; }, 200);
    });

    wrap.addEventListener('click', function() {
      if (isAnimating || !container.classList.contains('mobile-nav-on')) return;
      container.classList.remove('mobile-nav-on');
    });
  }

  /* ---------- Keyboard Shortcuts ---------- */
  document.addEventListener('keydown', function(e) {
    // 't' for back to top
    if (e.key === 't' && !e.ctrlKey && !e.metaKey && !e.altKey &&
        document.activeElement === document.body) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // 'h' for home
    if (e.key === 'h' && !e.ctrlKey && !e.metaKey && !e.altKey &&
        document.activeElement === document.body) {
      window.location.href = '/';
    }
  });

})();
