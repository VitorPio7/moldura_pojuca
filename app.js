(() => {
  const canvas = document.getElementById("preview");
  const ctx = canvas.getContext("2d");
  const photoInput = document.getElementById("photoInput");
  const downloadBtn = document.getElementById("downloadBtn");
  const shareBtn = document.getElementById("shareBtn");
  const status = document.getElementById("status");

  const W = 540, H = 676;
  canvas.width = W;
  canvas.height = H;
  // Moldura original enviada pelo usuário.
  const template = new Image();
  template.src = "moldura-original.jpeg";

  // Área circular da foto na arte original (coordenadas do arquivo 540 x 1200).
  // Se a arte-base mudar, ajuste estes valores.
  const portrait = { x: 272, y: 269, r: 158 };

  let selectedPhoto = null;
  let ready = false;

  function drawCover(image, x, y, width, height) {
    const sourceRatio = image.width / image.height;
    const targetRatio = width / height;
    let sx = 0, sy = 0, sw = image.width, sh = image.height;
    if (sourceRatio > targetRatio) {
      sw = image.height * targetRatio;
      sx = (image.width - sw) / 2;
    } else {
      sh = image.width / targetRatio;
      sy = (image.height - sh) / 2;
    }
    ctx.drawImage(image, sx, sy, sw, sh, x, y, width, height);
  }

  function render() {
    ctx.clearRect(0, 0, W, H);
    if (!template.complete || !template.naturalWidth) return;
    ctx.drawImage(template, 0, 0, W, H);

    if (selectedPhoto) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(portrait.x, portrait.y, portrait.r, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      drawCover(
        selectedPhoto,
        portrait.x - portrait.r,
        portrait.y - portrait.r,
        portrait.r * 2,
        portrait.r * 2
      );
      ctx.restore();

      // Redesenha uma borda discreta para manter o recorte visual limpo.
      ctx.beginPath();
      ctx.arc(portrait.x, portrait.y, portrait.r - 0.5, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ready = true;
    downloadBtn.disabled = !selectedPhoto;
    shareBtn.disabled = !selectedPhoto;
  }

  template.onload = render;
  template.onerror = () => { status.textContent = "Não foi possível carregar a moldura. Verifique se moldura-original.jpg está na mesma pasta."; };

  photoInput.addEventListener("change", () => {
    const file = photoInput.files && photoInput.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      status.textContent = "Selecione um arquivo de imagem.";
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      selectedPhoto = image;
      render();
      status.textContent = "Foto aplicada automaticamente. Você já pode baixar a arte.";
      URL.revokeObjectURL(objectUrl);
    };
    image.onerror = () => {
      status.textContent = "Não foi possível abrir essa foto. Tente outro arquivo.";
      URL.revokeObjectURL(objectUrl);
    };
    image.src = objectUrl;
  });

  function canvasBlob() {
    return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  }

  downloadBtn.addEventListener("click", async () => {
    if (!ready || !selectedPhoto) return;
    const blob = await canvasBlob();
    if (!blob) {
      status.textContent = "Não foi possível gerar o PNG neste navegador.";
      return;
    }
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "minha-moldura.png";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    status.textContent = "Download iniciado.";
  });

  shareBtn.addEventListener("click", async () => {
    if (!ready || !selectedPhoto) return;
    const blob = await canvasBlob();
    if (!blob) return;
    const file = new File([blob], "minha-moldura.png", { type: "image/png" });
    try {
      if (navigator.canShare && navigator.canShare({ files: [file] }) && navigator.share) {
        await navigator.share({ files: [file], title: "Minha moldura" });
        status.textContent = "Compartilhamento aberto.";
      } else {
        status.textContent = "Seu navegador não compartilha arquivos diretamente. Baixe o PNG e anexe-o no WhatsApp.";
      }
    } catch (error) {
      if (error.name !== "AbortError") status.textContent = "Não foi possível compartilhar. Baixe o PNG e envie pelo WhatsApp.";
    }
  });

  template.onload = () => {
    render();
    status.textContent = "Escolha uma foto para gerar sua arte.";
  };
})();
