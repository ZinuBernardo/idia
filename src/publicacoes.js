import { getPosts } from './supabase.js';

document.addEventListener('DOMContentLoaded', async () => {
    const pubGrid = document.querySelector('.pub-grid');
    if (!pubGrid) return;

    try {
        const posts = await getPosts({ type: 'publicacao' });
        if (!posts || posts.length === 0) return;

        pubGrid.innerHTML = posts.map(post => {
            const dateStr = post.category || 'Publicação ID&IA';
            const readingTime = post.reading_time ? ` • ${post.reading_time}` : '';
            return `
                <div class="pub-card">
                    <div>
                        <div class="pub-meta">${dateStr}${readingTime}</div>
                        <h3 class="pub-title">${post.title}</h3>
                        <p class="cinematic-desc" style="text-align: left; margin: 0 0 30px 0; font-size: 0.85rem; color: rgba(255,255,255,0.7);">
                            ${post.summary || ''}
                        </p>
                    </div>
                    <a href="/artigo.html?slug=${post.slug}" class="btn btn-primary" style="align-self: flex-start; padding: 10px 20px;">LER ARTIGO →</a>
                </div>
            `;
        }).join('');
    } catch (err) {
        console.warn('Erro ao carregar publicações dinâmicas:', err);
    }
});
