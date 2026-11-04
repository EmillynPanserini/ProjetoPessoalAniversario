# Batata vegano 🍟💚

Um presente de aniversário em HTML, CSS e JavaScript puro. Não precisa de Node.js, pacotes, banco de dados ou chaves de API.

## Abrir o site

Abra `index.html` no navegador. Ou use um servidor estático:

```sh
cd /workspace/ProjetoPessoalAniversario
python3 -m http.server 8000 --bind 0.0.0.0
```

## Páginas

- `index.html`: cabeçalho, pergunta “Você é bocó?”, “Não” que foge do mouse e do toque e “Sim” que abre `happyhappy.html`.
- `happyhappy.html`: fogos em canvas, bolo em CSS 3D com a etiqueta “Batata” e link para a seção da mensagem.
- `styles.css` e `script.js`: estilos responsivos e interações compartilhadas.

As animações respeitam a preferência de movimento reduzido do navegador. A segunda página também oferece um botão para pausá-las.

## Foto pendente

A foto escolhida está no [Google Drive](https://drive.google.com/file/d/1v5OWdK6MBjHYzXQSfE3IWr1_smbYqTDd/view). O download está pendente porque a rede do ambiente bloqueou a conexão com `drive.google.com` (HTTP 403 no túnel do proxy). Foi salva no rascunho da configuração a liberação de `drive.google.com` e `drive.usercontent.google.com`; salvar o rascunho não aplica a mudança à máquina atual. `assets/batata.svg` é **uma ilustração provisória**, não a foto enviada.

Quando o arquivo estiver disponível, salve-o em `assets/foto-batata.jpg` e substitua o `src` das três imagens nas páginas pelo caminho da foto. Atualize os textos alternativos para “Foto do Batata vegano”. O SVG pode continuar como favicon. O CSS já cuida do recorte da foto.

## Publicação

Os arquivos podem ser publicados em qualquer hospedagem estática, como GitHub Pages. A página inicial é `index.html`; não é necessário build. Nenhuma publicação é realizada automaticamente.
