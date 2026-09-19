import { getPosts } from './supabase.js';

document.addEventListener('DOMContentLoaded', async () => {
    const newsGrid = document.querySelector('.news-grid');
    if (!newsGrid) return;

    try {
        const posts = await getPosts({ type: 'noticia' });
        if (!posts || posts.length === 0) return;

        newsGrid.innerHTML = posts.map(post => {
            const metaStr = post.category || 'Notícia & Evento';
            const readingTime = post.reading_time ? ` • ${post.reading_time}` : '';
            return `
                <div class="news-card">
                    <div>
                        <div class="news-meta">${metaStr}${readingTime}</div>
                        <h3 class="news-title">${post.title}</h3>
                        <p class="cinematic-desc" style="text-align: left; margin: 0 0 30px 0; font-size: 0.85rem; color: rgba(255,255,255,0.7);">
                            ${post.summary || ''}
                        </p>
                    </div>
                    <a href="/artigo?slug=${post.slug}" class="btn btn-primary" style="align-self: flex-start; padding: 10px 20px;">SABER MAIS →</a>
                </div>
            `;
        }).join('');
    } catch (err) {
        console.warn('Erro ao carregar notícias dinâmicas:', err);
    }
});
