import { createClient } from '@supabase/supabase-js';

const FALLBACK_URL = 'https://qirnekjgmbzlyncbznju.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpcm5la2pnbWJ6bHluY2J6bmp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4MDU3NTQsImV4cCI6MjEwNTM4MTc1NH0.bzKcHw4AIhftOkezVmD8nvW3wk9ePPsD--gwTmPXU-8';

let supabaseInstance = null;

export function getSupabase() {
    const url = import.meta.env.VITE_SUPABASE_URL || localStorage.getItem('idia_supabase_url') || FALLBACK_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY || localStorage.getItem('idia_supabase_key') || FALLBACK_KEY;

    if (!url || !key) {
        return null;
    }

    if (!supabaseInstance) {
        supabaseInstance = createClient(url, key);
    }
    return supabaseInstance;
}

export function isSupabaseConfigured() {
    return !!getSupabase();
}

export function saveSupabaseConfig(url, key) {
    if (url && key) {
        localStorage.setItem('idia_supabase_url', url.trim());
        localStorage.setItem('idia_supabase_key', key.trim());
        supabaseInstance = createClient(url.trim(), key.trim());
        return true;
    }
    return false;
}

// 2. Dados Reais Iniciais (Fallback garantido se o banco ainda estiver em processo de conexão)
export const SEED_POSTS = [
    {
        id: 'seed-1',
        title: 'Autonomia Cognitiva e os Modelos Linguísticos em África',
        slug: 'autonomia-cognitiva-e-os-modelos-linguisticos-em-africa',
        type: 'publicacao',
        category: 'Tratado Científico / 2026',
        summary: 'Uma exploração matemática sobre o impacto de grandes modelos neurais na preservação da memória civilizacional africana.',
        content: `<h2>Introdução e Fundamentação</h2>
        <p>A autonomia cognitiva representa o limiar crítico da autodeterminação no século XXI. À medida que as arquiteturas de aprendizagem profunda e os modelos de linguagem em larga escala (LLMs) assumem o papel de mediadores fundamentais do conhecimento universal, torna-se imperativo examinar as suas implicações ontológicas no contexto do Sul Global e, em particular, de África.</p>
        <h3>A Preservação da Memória Civilizacional</h3>
        <p>O ID&IA tem desenvolvido modelos neurais fundamentados na preservação semântica e dialética de conceitos originários de matriz africana, assegurando que o processamento de linguagem natural não opere como uma força de homogeneização, mas como um motor de soberania epistémica.</p>
        <blockquote>"O processamento artificial da linguagem não pode ser mero espelho de dados colonizados; tem de nascer do substrato vivo do Humano Concreto."</blockquote>
        <p>Convidamos a comunidade académica e os parceiros do ecossistema a aprofundar os ensaios analíticos e as formulações matemáticas que sustentam esta abordagem.</p>`,
        cover_image: '/bg_instituto_1778978636191.png',
        author: 'ID&IA Concreto África - Direcção Científica',
        reading_time: '7 min de leitura',
        published: true,
        published_at: '2026-05-10T10:00:00Z'
    },
    {
        id: 'seed-2',
        title: 'A Nova Infraestrutura de Dados e a Soberania Económica Regional',
        slug: 'a-nova-infraestrutura-de-dados-e-a-soberania-economica-regional',
        type: 'publicacao',
        category: 'Policy Brief / 2025',
        summary: 'Diretrizes políticas para governos da SADC sobre a regulação ética e controle soberano de redes inteligentes.',
        content: `<h2>Resumo Executivo</h2>
        <p>Este documento estratégico endereça os desafios prementes relativos à soberania de infraestruturas computacionais e corredores de dados na região da Comunidade de Desenvolvimento da África Austral (SADC).</p>
        <h3>Directrizes Estratégicas para a Região</h3>
        <p>Propomos um modelo tripartite de governação digital: data centers soberanos, redes de interconexão territorialmente protegidas e protocolos de inteligência artificial alinhados com o desenvolvimento humano sustentável e a segurança económica local.</p>
        <p>As nações africanas possuem hoje a oportunidade de liderar a próxima vaga de inovação descentralizada e industrial sem incorrer nos erros de dependência externa que marcaram os séculos transatos.</p>`,
        cover_image: '/bg_ideia_global_1778978622357.png',
        author: 'ID&IA Concreto África - Políticas Públicas',
        reading_time: '5 min de leitura',
        published: true,
        published_at: '2025-11-15T14:30:00Z'
    },
    {
        id: 'seed-3',
        title: 'Relatório de Aplicação Territorial Cuito Cuanavale',
        slug: 'relatorio-de-aplicacao-territorial-cuito-cuanavale',
        type: 'publicacao',
        category: 'Relatório de Impacto / 2026',
        summary: 'Resultados práticos obtidos nos primeiros 12 meses de implantação física e digital no Sul global.',
        content: `<h2>Contexto Operacional</h2>
        <p>O Memorial e Centro de Inovação de Cuito Cuanavale representa o ápice da comunhão entre história, biologia e computação aplicada. Durante os últimos 12 meses, as equipas multidisciplinares do ID&IA implementaram infraestruturas de pesquisa e monitoramento territorial avançado.</p>
        <h3>Resultados Mensuráveis</h3>
        <p>Entre as principais realizações destacam-se a catalogação biomecânica local, a implementação dos primeiros nós computacionais de baixa latência e a integração com as comunidades locais através de programas de capacitação tecnológica imersiva.</p>`,
        cover_image: '/cuito_memorial.png',
        author: 'Conselho Gestor ID&IA',
        reading_time: '6 min de leitura',
        published: true,
        published_at: '2026-03-01T09:00:00Z'
    },
    {
        id: 'seed-4',
        title: 'ID&IA Apresenta Modelo SADC no Fórum de Soberania de Dados',
        slug: 'idia-apresenta-modelo-sadc-no-forum-de-soberania-de-dados',
        type: 'noticia',
        category: 'Fórum Regional / Maio 2026',
        summary: 'O comissariado executivo do ID&IA palestrou sobre a injeção da identidade regional no desenvolvimento de sistemas inteligentes.',
        content: `<h2>Participação de Destaque</h2>
        <p>Durante a sessão plenária do Fórum Internacional de Soberania de Dados realizado em Luanda, os representantes do ID&IA apresentaram a tese de integração regional para infraestruturas críticas e modelos de inteligência estratégica.</p>
        <p>O evento reuniu ministros das telecomunicações, líderes industriais e delegações académicas de mais de 14 países africanos, consolidando o instituto como referência consultiva em soberania digital.</p>`,
        cover_image: '/bg_centros_1778978650925.png',
        author: 'Comunicação ID&IA',
        reading_time: '3 min de leitura',
        published: true,
        published_at: '2026-05-18T11:00:00Z'
    },
    {
        id: 'seed-5',
        title: 'Laboratório Malelwa Abre Candidaturas para Investigadores Regionais',
        slug: 'laboratorio-malelwa-abre-candidaturas-para-investigadores-regionais',
        type: 'noticia',
        category: 'Investigação / Abril 2026',
        summary: 'Programa de bolsas avançadas para doutorados e pós-doutorados no domínio da biotecnologia e sistemas cognitivos.',
        content: `<h2>Chamada de Investigadores 2026/2027</h2>
        <p>O Laboratório de Biotecnologia e Inteligência Artificial Malelwa abre oficialmente o processo de seleção para investigadores nas áreas de bioinformática, genómica computacional e ciência dos materiais.</p>
        <p>Os candidatos selecionados terão acesso às infraestruturas laboratoriais do ecossistema ID&IA e trabalharão em estreita colaboração com centros universitários parceiros internacionais.</p>`,
        cover_image: '/bg_africa_concreta_1778978607545.png',
        author: 'Secretaria Académica',
        reading_time: '4 min de leitura',
        published: true,
        published_at: '2026-04-20T08:30:00Z'
    }
];

// 3. Funções de Busca (Leitura)
export async function getPosts({ type = null, limit = null, publishedOnly = true } = {}) {
    const supabase = getSupabase();
    if (!supabase) {
        let list = [...SEED_POSTS];
        if (type) list = list.filter(p => p.type === type);
        if (publishedOnly) list = list.filter(p => p.published !== false);
        return list;
    }

    try {
        let query = supabase.from('posts').select('*').order('published_at', { ascending: false });
        if (type) {
            query = query.eq('type', type);
        }
        if (publishedOnly) {
            query = query.eq('published', true);
        }
        if (limit) {
            query = query.limit(limit);
        }

        const { data, error } = await query;
        if (error) {
            console.warn('Erro ao consultar Supabase, usando fallback local:', error.message);
            let list = [...SEED_POSTS];
            if (type) list = list.filter(p => p.type === type);
            return list;
        }
        return data && data.length > 0 ? data : SEED_POSTS.filter(p => !type || p.type === type);
    } catch (err) {
        console.warn('Excepção na consulta do Supabase:', err);
        return SEED_POSTS.filter(p => !type || p.type === type);
    }
}

export async function getPostBySlug(slug) {
    const supabase = getSupabase();
    if (!supabase) {
        return SEED_POSTS.find(p => p.slug === slug) || null;
    }

    try {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error || !data) {
            return SEED_POSTS.find(p => p.slug === slug) || null;
        }
        return data;
    } catch (err) {
        return SEED_POSTS.find(p => p.slug === slug) || null;
    }
}

// 4. Funções Administrativas (Criar, Actualizar, Apagar, Upload)
export async function createPost(postData) {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase não configurado. Por favor insira as credenciais no painel.');

    const { data, error } = await supabase
        .from('posts')
        .insert([postData])
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updatePost(id, postData) {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase não configurado.');

    const { data, error } = await supabase
        .from('posts')
        .update(postData)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function deletePost(id) {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase não configurado.');

    const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

    if (error) throw error;
    return true;
}

export async function uploadCoverImage(file) {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase não configurado.');

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const filePath = `capas/${fileName}`;

    const { data, error } = await supabase.storage
        .from('posts-media')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
        .from('posts-media')
        .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
}

// 5. Autenticação Administrativa
export async function signIn(email, password) {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Supabase não configurado.');

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    if (error) throw error;
    return data;
}

export async function signOut() {
    const supabase = getSupabase();
    if (!supabase) return;
    await supabase.auth.signOut();
}

export async function getCurrentUser() {
    const supabase = getSupabase();
    if (!supabase) return null;
    const { data: { session } } = await supabase.auth.getSession();
    return session ? session.user : null;
}
