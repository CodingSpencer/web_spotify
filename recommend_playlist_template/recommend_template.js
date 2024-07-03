const clientId = "c109829ae04f4b2aa0fad9528b087fca";
const clientSecret = "4282162045f1450384ef84e9e609c07e";

const authorization = clientId + ":" + clientSecret;

// private methods
const getRefreshToken = async () => {
  // Refresh token that has been previously stored
  const refreshToken = localStorage.getItem("refresh_token");
  const url = "https://accounts.spotify.com/api/token";

  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(authorization),
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  };

  const response = await fetch(url, payload);
  const data = await response.json();

  if (response.ok) {
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token || refreshToken);
  } else {
    console.error("Failed to refresh token:", data);
  }
};

const getAccessToken = () => localStorage.getItem("access_token");
const getRefreshToken = () => localStorage.getItem("refresh_token");

async function fetchWebApi(endpoint, method, body) {
  const accessToken = getAccessToken();

  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
    method,
    body: JSON.stringify(body),
  });
  return await res.json();
}

async function getTopTracks() {
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  return (
    await fetchWebApi("v1/me/top/tracks?time_range=long_term&limit=5", "GET")
  ).items;
}

const topTracksIds = [
  "1bSS3K3xpmizze5OsndqpF",
  "3ZEno9fORwMA1HPecdLi0R",
  "12cZWGf5ZgLcKubEW9mx5q",
  "4j5gXarJqoiwh4ZIAqZcmh",
  "3fHvOiVB4KfakM0Iaw3u2D",
];

async function getRecommendations() {
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-recommendations
  return (
    await fetchWebApi(
      `v1/recommendations?limit=5&seed_tracks=${topTracksIds.join(",")}`,
      "GET"
    )
  ).tracks;
}

const tracksUri = [
  "spotify:track:1bSS3K3xpmizze5OsndqpF",
  "spotify:track:0we7ShV1o6cPTFjxOADPbC",
  "spotify:track:3ZEno9fORwMA1HPecdLi0R",
  "spotify:track:7pT6WSg4PCt4mr5ZFyUfsF",
  "spotify:track:12cZWGf5ZgLcKubEW9mx5q",
  "spotify:track:1GcfoHt1DmszYmKWzngGor",
  "spotify:track:4j5gXarJqoiwh4ZIAqZcmh",
  "spotify:track:3cgHwqbHcu1DKFADvkgPJ7",
  "spotify:track:3fHvOiVB4KfakM0Iaw3u2D",
  "spotify:track:1bzfMcmuImln3h9YWyhOnh",
];

async function createPlaylist(tracksUri) {
  const { id: user_id } = await fetchWebApi("v1/me", "GET");

  const playlist = await fetchWebApi(`v1/users/${user_id}/playlists`, "POST", {
    name: "My recommendation playlist",
    description: "Playlist created by the tutorial on developer.spotify.com",
    public: false,
  });

  await fetchWebApi(
    `v1/playlists/${playlist.id}/tracks?uris=${tracksUri.join(",")}`,
    "POST"
  );

  return playlist;
}

async function main() {
  const topTracks = await getTopTracks();
  console.log(
    topTracks?.map(
      ({ name, artists }) =>
        `${name} by ${artists.map((artist) => artist.name).join(", ")}`
    )
  );

  const recommendedTracks = await getRecommendations();
  console.log(
    recommendedTracks.map(
      ({ name, artists }) =>
        `${name} by ${artists.map((artist) => artist.name).join(", ")}`
    )
  );

  const createdPlaylist = await createPlaylist(tracksUri);
  console.log(createdPlaylist.name, createdPlaylist.id);

  const playlistId = "1638VpguBJDUeYS0aTD8HL";

  const iframe = document.createElement("iframe");
  iframe.src = `https://open.spotify.com/embed/playlist/${createdPlaylist.id}`;
  iframe.title = "Spotify Embed: Recommendation Playlist ";
  iframe.width = "100%";
  iframe.height = "100%";
  iframe.style.minHeight = "360px";
  iframe.frameBorder = "0";
  iframe.allow =
    "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
  iframe.loading = "lazy";

  document.body.appendChild(iframe);
}

const Button = document.getElementById("submitButton");

Button.addEventListener("click", function (event) {
  event.preventDefault();

  // setDanceRecommendations();
  // setLivenessRecommendations();
  // setAcousticRecommendations();
  main();
});
