// === LOAD DETAIL BERITA ===
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const container = document.getElementById("detail-berita");

  if (!id) {
    container.innerHTML = `<p class="text-danger">ID berita tidak ditemukan di URL.</p>`;
    return;
  }

  fetch("data/berita.json")
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      return res.json();
    })
    .then((data) => {
      if (!Array.isArray(data))
        throw new Error("Format JSON harus berupa array.");

      const berita = data.find((item) => String(item.id) === String(id));
      if (!berita) {
        container.innerHTML = `<p class="text-danger">Berita dengan ID ${id} tidak ditemukan.</p>`;
        return;
      }

      container.innerHTML = `
        <h3 class="fw-bold mb-2">${berita.judul}</h3>
        <div class="d-flex gap-3 text-muted small mb-3">
          <span>${berita.penulis || "Redaksi Siantar Codes Academy"}</span>
          <span><i class="bi bi-calendar"></i> ${berita.tanggal || "-"}</span>
        </div>
        <img src="${berita.gambar}" class="card-img-top mb-4 rounded" alt="${
        berita.judul
      }">
        ${
          Array.isArray(berita.isi)
            ? berita.isi.map((p) => `<p>${p}</p>`).join("")
            : `<p>${berita.isi}</p>`
        }
      `;
    })
    .catch((err) => {
      console.error("Gagal memuat berita:", err);
      container.innerHTML = `<p class="text-danger">Gagal memuat data berita.</p>`;
    });
});

// === SISTEM KOMENTAR ===
document.addEventListener("DOMContentLoaded", () => {
  const sendBtn = document.getElementById("sendComment");
  const input = document.getElementById("commentInput");
  const commentList = document.getElementById("commentList");
  const count = document.getElementById("commentCount");
  let commentCount = 0;

  if (!sendBtn || !input) return; 

  sendBtn.addEventListener("click", () => {
    const text = input.value.trim();
    if (text === "") return;

    const newComment = document.createElement("div");
    newComment.classList.add("comment-item", "d-flex", "gap-3", "mb-4");
    newComment.innerHTML = `
      <div class="icon">
        <img src="https://via.placeholder.com/40" class="rounded-circle" alt="user">
      </div>
      <div>
        <h6 class="fw-semibold mb-1">John Doe <small class="text-muted">• baru saja</small></h6>
        <p class="mb-2 text-muted small">${text}</p>
        <div class="d-flex align-items-center gap-3 small text-secondary">
          <span class="like-btn" style="cursor:pointer;">👍 <span class="like-count">0</span></span>
          <span class="reply-btn" style="cursor:pointer;">💬 Balas</span>
        </div>
      </div>
    `;
    commentList.prepend(newComment);
    input.value = "";
    commentCount++;
    count.textContent = commentCount;
  });

  commentList.addEventListener("click", (e) => {
    if (e.target.closest(".like-btn")) {
      const like = e.target.closest(".like-btn").querySelector(".like-count");
      like.textContent = parseInt(like.textContent) + 1;
    }

    if (e.target.closest(".reply-btn")) {
      const replyBox = document.createElement("input");
      replyBox.type = "text";
      replyBox.placeholder = "Tulis balasan...";
      replyBox.className = "form-control form-control-sm mt-2";
      e.target.closest(".reply-btn").parentNode.appendChild(replyBox);
      replyBox.focus();

      replyBox.addEventListener("keypress", (ev) => {
        if (ev.key === "Enter" && replyBox.value.trim() !== "") {
          const replyText = document.createElement("p");
          replyText.className = "text-muted small ms-4 mt-2";
          replyText.textContent = "↳ " + replyBox.value;
          e.target
            .closest(".reply-btn")
            .parentNode.parentNode.appendChild(replyText);
          replyBox.remove();
        }
      });
    }
  });
});
