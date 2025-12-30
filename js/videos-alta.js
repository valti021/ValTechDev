// ===================== YOUTUBE CONFIG =====================
const YT_API_KEY = "CHAVE_API_YT";
const YT_CHANNEL_HANDLE = "USUARIO_YT"; // sem @
const YT_MAX_RESULTS = 4;

const trendingContainer = document.getElementById("trendingVideos");
const videoTemplate = document.getElementById("videoCardTemplate");

// ===================== YOUTUBE FUNCTIONS =====================
async function fetchChannelIdByHandle(handle) {
    const handleClean = handle.replace(/^@/, '');

    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&maxResults=1&q=${encodeURIComponent(handleClean)}&key=${YT_API_KEY}`;
    const resp = await fetch(searchUrl);

    if (!resp.ok) {
        throw new Error(`Erro HTTP ${resp.status}`);
    }

    const data = await resp.json();

    if (!data.items || data.items.length === 0) {
        throw new Error("Canal não encontrado");
    }

    return data.items[0].snippet.channelId;
}

async function fetchUploadsPlaylist(channelId) {
    const url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${YT_API_KEY}`;
    const resp = await fetch(url);
    const data = await resp.json();

    if (!data.items || data.items.length === 0) {
        throw new Error("Uploads não encontrados");
    }

    return data.items[0].contentDetails.relatedPlaylists.uploads;
}

async function fetchRecentVideoIds(playlistId, maxResults = 20) {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=${maxResults}&playlistId=${playlistId}&key=${YT_API_KEY}`;
    const resp = await fetch(url);
    const data = await resp.json();

    if (!data.items) return [];
    return data.items.map(item => item.contentDetails.videoId);
}

async function fetchVideosDetails(ids) {
    if (ids.length === 0) return [];

    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${ids.join(",")}&key=${YT_API_KEY}`;
    const resp = await fetch(url);
    const data = await resp.json();

    return data.items || [];
}

// ===================== RENDER =====================
function formatNumber(n) {
    return Number(n).toLocaleString("pt-BR");
}

function createVideoCard(video) {
    const card = videoTemplate.content.cloneNode(true);

    const thumb =
        video.snippet.thumbnails.maxres?.url ||
        video.snippet.thumbnails.high?.url ||
        video.snippet.thumbnails.medium?.url;

    const videoUrl = `https://www.youtube.com/watch?v=${video.id}`;

    card.querySelector(".video-link").href = videoUrl;
    card.querySelector(".title-link").href = videoUrl;
    card.querySelector(".video-thumb").src = thumb;
    card.querySelector(".video-thumb").alt = video.snippet.title;
    card.querySelector(".video-title a").textContent = video.snippet.title;
    card.querySelector(".views").textContent =
        `${formatNumber(video.statistics.viewCount)} visualizações`;

    return card;
}

function renderTrendingVideos(videos) {
    trendingContainer.innerHTML = "";

    if (!videos.length) {
        trendingContainer.innerHTML = "<p>Nenhum vídeo encontrado.</p>";
        return;
    }

    videos.forEach(video => {
        trendingContainer.appendChild(createVideoCard(video));
    });
}

// ===================== INIT =====================
async function loadTrendingVideos() {
    try {
        trendingContainer.innerHTML = "<p>Carregando vídeos...</p>";

        const channelId = await fetchChannelIdByHandle(YT_CHANNEL_HANDLE);
        const uploads = await fetchUploadsPlaylist(channelId);
        const videoIds = await fetchRecentVideoIds(uploads);
        const videos = await fetchVideosDetails(videoIds);

        const sorted = videos.sort(
            (a, b) => b.statistics.viewCount - a.statistics.viewCount
        );

        renderTrendingVideos(sorted.slice(0, YT_MAX_RESULTS));
    } catch (err) {
        console.error(err);
        trendingContainer.innerHTML = "<p>Erro ao carregar vídeos.</p>";
    }
}

document.addEventListener("DOMContentLoaded", loadTrendingVideos);
