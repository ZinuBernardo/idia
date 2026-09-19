import { getPostBySlug } from './supabase.js';

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');

    const skeletonEl = document.getElementById('article-skeleton');
    const contentEl = document.getElementById('article-content');

    if (!slug) {
        window.location.href = '/publicacoes';
        return;
    }

    try {
        const post = await getPostBySlug(slug);

        if (!post) {
            if (skeletonEl) skeletonEl.style.display = 'none';
            if (contentEl) {
                contentEl.style.display = 'block';
                contentEl.innerHTML = `
                    <div style="text-align: center; padding: 100px 20px;">
                        <h2 style="font-size: 2rem; margin-bottom: 20px;">Publicação não encontrada</h2>
                        <p style="color: rgba(255,255,255,0.7); margin-bottom: 40px;">O artigo ou notícia que está à procura não existe ou foi removido.</p>
                        <a href="/publicacoes" class="btn btn-primary" style="padding: 12px 25px;">VOLTAR ÀS PUBLICAÇÕES</a>
                    </div>
                `;
            }
            return;
        }

        // Configurar Título e Meta Tags da Página
        document.title = `${post.title} | ID&IA Global`;

        const metaDesc = document.getElementById('meta-description');
        const ogTitle = document.getElementById('og-title');
        const ogDesc = document.getElementById('og-description');
        const ogImg = document.getElementById('og-image');

        if (metaDesc && post.summary) metaDesc.setAttribute('content', post.summary);
        if (ogTitle) ogTitle.setAttribute('content', `${post.title} | ID&IA Global`);
        if (ogDesc && post.summary) ogDesc.setAttribute('content', post.summary);
        if (ogImg && post.cover_image) ogImg.setAttribute('content', post.cover_image.startsWith('http') ? post.cover_image : `https://idia-africa.com${post.cover_image}`);

        // Preencher elementos
        const titleEl = document.getElementById('post-title');
        const categoryEl = document.getElementById('post-category');
        const dateEl = document.getElementById('post-date');
        const readingTimeEl = document.getElementById('post-reading-time');
        const summaryEl = document.getElementById('post-summary');
        const bodyEl = document.getElementById('post-body');
        const imageEl = document.getElementById('post-image');
        const authorEl = document.getElementById('post-author');
        const backLinkEl = document.getElementById('back-link');

        if (titleEl) titleEl.textContent = post.title;
        if (categoryEl) categoryEl.textContent = post.category || (post.type === 'noticia' ? 'Notícia' : 'Publicação');
        
        // Data formatada
        if (dateEl && post.published_at) {
            const dateObj = new Date(post.published_at);
            dateEl.textContent = dateObj.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' });
        } else if (dateEl) {
            dateEl.textContent = 'Recente';
        }

        if (readingTimeEl) readingTimeEl.textContent = post.reading_time || '4 min de leitura';
        if (summaryEl) summaryEl.textContent = post.summary || '';
        if (authorEl && post.author) authorEl.textContent = post.author;

        // Imagem de capa
        if (imageEl && post.cover_image) {
            imageEl.src = post.cover_image;
            imageEl.alt = post.title;
            imageEl.style.display = 'block';
        }

        // Conteúdo
        if (bodyEl) {
            bodyEl.innerHTML = post.content || '<p>Sem conteúdo disponível.</p>';
        }

        // Link de retorno inteligente
        if (backLinkEl) {
            if (post.type === 'noticia') {
                backLinkEl.href = '/noticias';
                backLinkEl.textContent = '← Voltar às Notícias & Eventos';
            } else {
                backLinkEl.href = '/publicacoes';
                backLinkEl.textContent = '← Voltar às Publicações';
            }
        }

        // Configurar botões de partilha
        const shareUrl = window.location.href;
        const shareTitle = encodeURIComponent(`${post.title} - ID&IA Concreto África`);

        const copyBtn = document.getElementById('btn-copy-link');
        if (copyBtn) {
            copyBtn.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(shareUrl);
                    const originalText = copyBtn.textContent;
                    copyBtn.textContent = '✓ Link Copiado!';
                    setTimeout(() => { copyBtn.textContent = originalText; }, 2500);
                } catch (e) {
                    alert('Link copiado: ' + shareUrl);
                }
            });
        }

        const whatsappBtn = document.getElementById('btn-share-whatsapp');
        if (whatsappBtn) {
            whatsappBtn.href = `https://api.whatsapp.com/send?text=${shareTitle}%20${encodeURIComponent(shareUrl)}`;
        }

        const linkedinBtn = document.getElementById('btn-share-linkedin');
        if (linkedinBtn) {
            linkedinBtn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        }

        // Exibir conteúdo
        if (skeletonEl) skeletonEl.style.display = 'none';
        if (contentEl) contentEl.style.display = 'block';

    } catch (error) {
        console.error('Erro ao renderizar artigo:', error);
        if (skeletonEl) skeletonEl.style.display = 'none';
        if (contentEl) contentEl.style.display = 'block';
    }
});
