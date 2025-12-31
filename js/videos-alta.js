// ===================== CONFIGURAÇÃO =====================
const JSON_DATA_URL = "data/videos.json"; // Caminho para seu arquivo JSON
const MAX_RESULTS = 5; // Número máximo de vídeos a exibir

// ===================== ELEMENTOS DOM =====================

const trendingContainer = document.getElementById("trendingVideos");
const videoTemplate = document.getElementById("videoCardTemplate");

// ===================== FUNÇÕES =====================
async function fetchVideosData() {
    try {
        const response = await fetch(JSON_DATA_URL);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP ${response.status}`);
        }
        
        const videos = await response.json();
        return videos;
    } catch (error) {
        console.error("Erro ao carregar vídeos:", error);
        throw error;
    }
}

// ===================== RENDERIZAÇÃO =====================
function formatNumber(n) {
    return Number(n).toLocaleString("pt-BR");
}

function formatDate(dateString) {
    // Se a data já está formatada como "Há X dias", mantém como está
    if (dateString.startsWith("Há")) {
        return dateString;
    }
    
    // Se for uma data ISO, pode formatar aqui
    // Exemplo: return new Date(dateString).toLocaleDateString("pt-BR");
    
    return dateString;
}

function createVideoCard(video) {
    const card = videoTemplate.content.cloneNode(true);
    
    // Configurar os dados do vídeo
    card.querySelector(".video-link").href = video.url;
    card.querySelector(".title-link").href = video.url;
    
    // Thumbnail
    if (video.thumbnail) {
        card.querySelector(".video-thumb").src = video.thumbnail;
    }
    card.querySelector(".video-thumb").alt = video.title;
    
    // Título
    card.querySelector(".video-title a").textContent = video.title;
    
    // Estatísticas
    if (video.views) {
        card.querySelector(".views").textContent = 
            `${formatNumber(video.views)} visualizações`;
    }
    
    if (video.date) {
        card.querySelector(".date").textContent = formatDate(video.date);
    }
    
    if (video.likes) {
        card.querySelector(".likes").textContent = 
            `${formatNumber(video.likes)} likes`;
    }
    
    // Se quiser mostrar a duração também, pode adicionar um elemento no template
    // ou substituir uma das informações existentes
    // Exemplo: mostrar duração no lugar da data
    // card.querySelector(".date").textContent = video.duration;
    
    return card;
}

function renderTrendingVideos(videos) {
    trendingContainer.innerHTML = "";

    if (!videos || videos.length === 0) {
        trendingContainer.innerHTML = "<p>Nenhum vídeo encontrado.</p>";
        return;
    }

    // Ordenar por views (mais visualizados primeiro)
    const sortedVideos = [...videos].sort((a, b) => {
        return (b.views || 0) - (a.views || 0);
    });
    
    // Pega apenas os primeiros MAX_RESULTS vídeos
    const videosToShow = sortedVideos.slice(0, MAX_RESULTS);
    
    videosToShow.forEach(video => {
        trendingContainer.appendChild(createVideoCard(video));
    });
}

// ===================== INICIALIZAÇÃO =====================
async function loadTrendingVideos() {
    try {
        trendingContainer.innerHTML = "<p>Carregando vídeos...</p>";
        
        const videos = await fetchVideosData();
        renderTrendingVideos(videos);
        
    } catch (err) {
        console.error("Erro detalhado:", err);
        trendingContainer.innerHTML = `
            <p style="color: #ff6b6b; text-align: center; padding: 20px;">
                Erro ao carregar vídeos. Verifique o console para mais detalhes.
            </p>
        `;
    }
}

// Iniciar quando a página carregar
document.addEventListener("DOMContentLoaded", loadTrendingVideos);

// Se quiser também permitir recarregar manualmente (opcional)
function reloadVideos() {
    loadTrendingVideos();
}

// Exemplo de como adicionar um botão de recarregar (opcional)
// <button onclick="reloadVideos()">Recarregar Vídeos</button>