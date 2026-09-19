import {
    isSupabaseConfigured,
    saveSupabaseConfig,
    signIn,
    signOut,
    getCurrentUser,
    getPosts,
    createPost,
    updatePost,
    deletePost,
    uploadCoverImage
} from './supabase.js';

let currentFilter = 'all';
let allPosts = [];
let editingPostId = null;

// ELEMENTOS DOM
const sectionConfig = document.getElementById('section-config');
const sectionLogin = document.getElementById('section-login');
const sectionDashboard = document.getElementById('section-dashboard');
const sectionEditor = document.getElementById('section-editor');

const formConfig = document.getElementById('form-config');
const formLogin = document.getElementById('form-login');
const formPost = document.getElementById('form-post');

const btnLogout = document.getElementById('btn-logout');
const btnNewPost = document.getElementById('btn-new-post');
const btnCancelEdit = document.getElementById('btn-cancel-edit');
const btnCancelEdit2 = document.getElementById('btn-cancel-edit-2');
const btnReconfig = document.getElementById('btn-reconfig');

const inputTitle = document.getElementById('input-title');
const inputSlug = document.getElementById('input-slug');
const inputType = document.getElementById('input-type');
const inputCategory = document.getElementById('input-category');
const inputAuthor = document.getElementById('input-author');
const inputReadingTime = document.getElementById('input-reading-time');
const inputCover = document.getElementById('input-cover');
const inputFile = document.getElementById('input-file');
const inputSummary = document.getElementById('input-summary');
const inputContent = document.getElementById('input-content');
const inputPublished = document.getElementById('input-published');
const postIdField = document.getElementById('post-id');
const editorTitle = document.getElementById('editor-title');
const btnSavePost = document.getElementById('btn-save-post');

const postsTableBody = document.getElementById('posts-table-body');
const toastEl = document.getElementById('toast');
const loginErrorEl = document.getElementById('login-error');

function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.style.display = 'block';
    setTimeout(() => {
        toastEl.style.display = 'none';
    }, 3500);
}

// GERAÇÃO AUTOMÁTICA DE SLUG
function generateSlug(text) {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove acentos
        .replace(/[^a-z0-9 -]/g, '') // remove chars inválidos
        .trim()
        .replace(/\s+/g, '-') // espaços para -
        .replace(/-+/g, '-'); // múltiplos - para único -
}

if (inputTitle) {
    inputTitle.addEventListener('input', () => {
        if (!editingPostId) {
            inputSlug.value = generateSlug(inputTitle.value);
        }
    });
}

// INICIALIZAÇÃO DE ESTADOS
async function checkAuthState() {
    if (!isSupabaseConfigured()) {
        showView('config');
        return;
    }

    try {
        const user = await getCurrentUser();
        if (user) {
            btnLogout.style.display = 'inline-block';
            showView('dashboard');
            await loadPosts();
        } else {
            btnLogout.style.display = 'none';
            showView('login');
        }
    } catch (e) {
        showView('login');
    }
}

function showView(view) {
    if (sectionConfig) sectionConfig.style.display = view === 'config' ? 'block' : 'none';
    if (sectionLogin) sectionLogin.style.display = view === 'login' ? 'block' : 'none';
    if (sectionDashboard) sectionDashboard.style.display = view === 'dashboard' ? 'block' : 'none';
    if (sectionEditor) sectionEditor.style.display = view === 'editor' ? 'block' : 'none';
}

// CARREGAR E RENDERIZAR TABELA DE POSTS
async function loadPosts() {
    postsTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: rgba(255,255,255,0.5);">A carregar publicações...</td></tr>';
    
    try {
        allPosts = await getPosts({ publishedOnly: false });
        renderPostsTable();
    } catch (err) {
        postsTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 40px; color: #f87171;">Erro ao carregar: ${err.message}</td></tr>`;
    }
}

function renderPostsTable() {
    const filtered = allPosts.filter(post => {
        if (currentFilter === 'all') return true;
        return post.type === currentFilter;
    });

    // Atualizar contadores
    const countAll = allPosts.length;
    const countPub = allPosts.filter(p => p.type === 'publicacao').length;
    const countNot = allPosts.filter(p => p.type === 'noticia').length;

    document.getElementById('count-all').textContent = countAll;
    document.getElementById('count-pub').textContent = countPub;
    document.getElementById('count-not').textContent = countNot;

    if (filtered.length === 0) {
        postsTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: rgba(255,255,255,0.5);">Nenhuma publicação encontrada para esta categoria.</td></tr>';
        return;
    }

    postsTableBody.innerHTML = filtered.map(post => {
        const isNoticia = post.type === 'noticia';
        const badgeClass = isNoticia ? 'badge-noticia' : 'badge-pub';
        const badgeText = isNoticia ? 'Notícia' : 'Publicação';
        const coverSrc = post.cover_image || '/ideiaa.png';
        const postDate = post.published_at ? new Date(post.published_at).toLocaleDateString('pt-PT') : 'Sem data';

        return `
            <tr>
                <td>
                    <img src="${coverSrc}" alt="" class="post-thumb" onerror="this.src='/ideiaa.png'">
                </td>
                <td>
                    <strong style="color: #fff; font-size: 1rem; display: block; margin-bottom: 4px;">${post.title}</strong>
                    <span style="color: rgba(255,255,255,0.5); font-size: 0.8rem; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;">
                        ${post.summary || ''}
                    </span>
                </td>
                <td>
                    <span class="badge ${badgeClass}">${badgeText}</span>
                </td>
                <td style="color: var(--admin-gold); font-size: 0.85rem;">
                    ${post.category || '-'}
                </td>
                <td style="color: rgba(255,255,255,0.6); font-size: 0.85rem;">
                    ${postDate}
                </td>
                <td style="text-align: right; white-space: nowrap;">
                    <a href="/artigo.html?slug=${post.slug}" target="_blank" class="btn-secondary" style="padding: 6px 10px; font-size: 0.75rem; margin-right: 6px;">Ver ↗</a>
                    <button type="button" class="btn-secondary btn-edit-post" data-id="${post.id}" style="padding: 6px 10px; font-size: 0.75rem; margin-right: 6px;">Editar</button>
                    <button type="button" class="btn-danger btn-delete-post" data-id="${post.id}" style="padding: 6px 10px; font-size: 0.75rem;">Apagar</button>
                </td>
            </tr>
        `;
    }).join('');

    // Adicionar eventos de Editar e Apagar
    document.querySelectorAll('.btn-edit-post').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            openEditor(id);
        });
    });

    document.querySelectorAll('.btn-delete-post').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.getAttribute('data-id');
            if (confirm('Tem a certeza absoluta de que deseja eliminar esta publicação? Esta ação não pode ser desfeita.')) {
                try {
                    await deletePost(id);
                    showToast('Publicação eliminada com sucesso.');
                    await loadPosts();
                } catch (err) {
                    alert('Erro ao apagar: ' + err.message);
                }
            }
        });
    });
}

// ABRIR FORMULÁRIO DE EDIÇÃO / CRIAÇÃO
function openEditor(postId = null) {
    editingPostId = postId;
    formPost.reset();

    if (postId) {
        const post = allPosts.find(p => p.id === postId);
        if (post) {
            editorTitle.textContent = 'Editar Publicação';
            postIdField.value = post.id;
            inputTitle.value = post.title || '';
            inputSlug.value = post.slug || '';
            inputType.value = post.type || 'publicacao';
            inputCategory.value = post.category || '';
            inputAuthor.value = post.author || '';
            inputReadingTime.value = post.reading_time || '';
            inputCover.value = post.cover_image || '';
            inputSummary.value = post.summary || '';
            inputContent.value = post.content || '';
            inputPublished.checked = post.published !== false;
            btnSavePost.textContent = 'Guardar Alterações';
        }
    } else {
        editorTitle.textContent = 'Nova Publicação';
        postIdField.value = '';
        inputAuthor.value = 'ID&IA Concreto África';
        inputReadingTime.value = '4 min de leitura';
        inputPublished.checked = true;
        btnSavePost.textContent = 'Guardar & Publicar';
    }

    showView('editor');
}

// EVENTOS DE SUBMISSÃO E BOTÕES
if (formConfig) {
    formConfig.addEventListener('submit', (e) => {
        e.preventDefault();
        const url = document.getElementById('cfg-url').value;
        const key = document.getElementById('cfg-key').value;
        if (saveSupabaseConfig(url, key)) {
            showToast('Configuração guardada com sucesso!');
            checkAuthState();
        }
    });
}

if (btnReconfig) {
    btnReconfig.addEventListener('click', (e) => {
        e.preventDefault();
        showView('config');
    });
}

if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();
        loginErrorEl.style.display = 'none';
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-password').value;

        try {
            await signIn(email, pass);
            showToast('Sessão iniciada com sucesso.');
            btnLogout.style.display = 'inline-block';
            showView('dashboard');
            await loadPosts();
        } catch (err) {
            loginErrorEl.textContent = 'Falha no login: ' + (err.message || 'Verifique as suas credenciais.');
            loginErrorEl.style.display = 'block';
        }
    });
}

if (btnLogout) {
    btnLogout.addEventListener('click', async () => {
        await signOut();
        showToast('Sessão terminada.');
        btnLogout.style.display = 'none';
        showView('login');
    });
}

if (btnNewPost) {
    btnNewPost.addEventListener('click', () => openEditor(null));
}

if (btnCancelEdit) {
    btnCancelEdit.addEventListener('click', () => showView('dashboard'));
}
if (btnCancelEdit2) {
    btnCancelEdit2.addEventListener('click', () => showView('dashboard'));
}

// UPLOAD DE IMAGEM AO SELECIONAR ARQUIVO
if (inputFile) {
    inputFile.addEventListener('change', async () => {
        const file = inputFile.files[0];
        if (!file) return;

        showToast('A enviar imagem para o Storage...');
        try {
            const publicUrl = await uploadCoverImage(file);
            inputCover.value = publicUrl;
            showToast('Imagem carregada com sucesso!');
        } catch (err) {
            alert('Não foi possível carregar a imagem: ' + err.message + '\nPode inserir um link de imagem diretamente.');
        }
    });
}

// TOOLBAR DO EDITOR
document.querySelectorAll('.editor-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tag = btn.getAttribute('data-tag');
        const start = inputContent.selectionStart;
        const end = inputContent.selectionEnd;
        const text = inputContent.value;
        const selected = text.substring(start, end) || 'Texto aqui';

        let replacement = '';
        if (tag === 'ul') {
            replacement = `<ul>\n  <li>${selected}</li>\n</ul>`;
        } else if (tag === 'blockquote') {
            replacement = `<blockquote>"${selected}"</blockquote>`;
        } else {
            replacement = `<${tag}>${selected}</${tag}>`;
        }

        inputContent.value = text.substring(0, start) + replacement + text.substring(end);
        inputContent.focus();
    });
});

// SUBMISSÃO DO POST (CRIAR OU ATUALIZAR)
if (formPost) {
    formPost.addEventListener('submit', async (e) => {
        e.preventDefault();
        btnSavePost.disabled = true;
        btnSavePost.textContent = 'A guardar...';

        const postData = {
            title: inputTitle.value.trim(),
            slug: inputSlug.value.trim(),
            type: inputType.value,
            category: inputCategory.value.trim(),
            author: inputAuthor.value.trim() || 'ID&IA Concreto África',
            reading_time: inputReadingTime.value.trim() || '4 min de leitura',
            cover_image: inputCover.value.trim(),
            summary: inputSummary.value.trim(),
            content: inputContent.value.trim(),
            published: inputPublished.checked
        };

        try {
            if (editingPostId) {
                await updatePost(editingPostId, postData);
                showToast('Publicação atualizada com sucesso!');
            } else {
                await createPost(postData);
                showToast('Nova publicação criada com sucesso!');
            }

            await loadPosts();
            showView('dashboard');
        } catch (err) {
            alert('Erro ao guardar publicação: ' + err.message);
        } finally {
            btnSavePost.disabled = false;
            btnSavePost.textContent = editingPostId ? 'Guardar Alterações' : 'Guardar & Publicar';
        }
    });
}

// FILTROS DE TABELA
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        renderPostsTable();
    });
});

// INICIAR
document.addEventListener('DOMContentLoaded', checkAuthState);
