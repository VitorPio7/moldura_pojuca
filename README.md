# Gerador de Moldura

Site estático que aplica automaticamente uma foto à moldura enviada, com recorte circular e exportação em PNG.

## Executar localmente

Como o navegador pode bloquear o carregamento da imagem ao abrir o HTML diretamente, execute um servidor local na pasta do projeto:

```bash
python -m http.server 8000
```

Abra `http://localhost:8000`.

## Publicar e compartilhar

1. Envie os arquivos `index.html`, `style.css`, `app.js` e `moldura-original.jpg` para um repositório GitHub.
2. Importe o repositório na Vercel ou Netlify.
3. Publique o site e compartilhe o link pelo WhatsApp.

## Ajustar a posição do círculo

No arquivo `app.js`, altere o objeto `portrait`:

```js
const portrait = { x: 272, y: 269, r: 158 };
```

- `x`: centro horizontal do círculo.
- `y`: centro vertical do círculo.
- `r`: raio do círculo.

Os valores são relativos à arte recortada de 540 x 676 pixels.

## Observação importante

A implementação usa a arte original como camada de fundo e desenha a nova foto por cima do retrato já existente. Isso preserva os textos e demais elementos sem precisar remover manualmente a foto original. As barras pretas do screenshot foram removidas para que a exportação contenha apenas o cartaz. O recorte circular está configurado para a imagem fornecida e pode precisar de pequenos ajustes se você substituir a arte-base.
# moldura_pojuca
