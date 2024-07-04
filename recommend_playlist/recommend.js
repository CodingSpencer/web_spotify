// Spotify API Tutorial (Spotify Developer)
const token =
  "BQBcvvIHvMZaZzOxMBezQKrV3jQh_lHP5bn3LR89aD9vmYuWMWlQPR7hr0KGDzEhDirtMtreyJLcmkb-xuvbaDnJjaiaDMDYTnbYvvAqXTcM20p89XNmgUszWTBEi4F4FH5iWiXv2AtcVirjWI5nxqiDnc82Grb8DqIlGnlKZk7F3a_rwCJ6xReC_zXJCPDpOoVlMek0yu6eRGBl7fTOodDS2Y7tYysLLZxsIMUUbjV4AYbko04CUy-rOB5j12SljpWcKw";

async function fetchWebApi(endpoint, method, body) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
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
// End Spotify API Tutorial (Spotify Developer)

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

  const name = document.getElementById("nameInput").value;
  const container = document.getElementById("customContainer");

  const customMessage = document.createElement("p");
  customMessage.innerHTML = `${name} playlist has been created! `;
  //  `<a href="https://open.spotify.com/embed/playlist/${createdPlaylist.id}">Click here</a> to listen to it.`;
  container.appendChild(customMessage);

  document.getElementById("name").classList.add("hide");

  // document.getElementById("custom").style.display = "none";

  main();
});
