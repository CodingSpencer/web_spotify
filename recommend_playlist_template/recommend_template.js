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

function setRecommendations(select) {
  if (select === "acoustic") {
    return `seed_genres=pop&min_acousticness=.5&max_acousticness=1`;
  }
  if (select === "dance") {
    return `seed_genres=pop&min_danceability=.5&max_danceability=1`;
  } else {
    return `seed_genres=pop&min_liveness=.5&max_liveness=1`;
  }
}

// function setDanceRecommendations() {
//   const danceElement = document.getElementById("dance-select");
//   const danceSelect = danceElement.value;

//   if (danceSelect === "more") {
//     minDance = 0.5;
//     maxDance = 0.8;
//   } else {
//     minDance = 0.3;
//     maxDance = 0.5;
//   }
// }

// function setLivenessRecommendations() {
//   const livenessElement = document.getElementById("liveness-select");
//   const livenessSelect = livenessElement.value;

//   if (livenessSelect === "more") {
//     minLiveness = 0.5;
//     maxLiveness = 0.8;
//   } else {
//     minLiveness = 0.3;
//     maxLiveness = 0.5;
//   }
// }

// function setAcousticRecommendations() {
//   const acousticElement = document.getElementById("acoustic-select");
//   const acousticSelect = acousticElement.value;

//   if (acousticSelect === "more") {
//     minAcoustic = 0.5;
//     maxAcoustic = 0.8;
//   } else {
//     minAcoustic = 0.3;
//     maxAcoustic = 0.5;
//   }
// }

async function getTopTracks() {
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  return (
    await fetchWebApi("v1/me/top/tracks?time_range=long_term&limit=5", "GET")
  ).items;
}

async function getRecommendations(end) {
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-recommendations
  return (await fetchWebApi(`v1/recommendations?limit=5&${end}`, "GET")).tracks;
}

// async function getRecommendations(topTracksIds) {
//   return (await fetchWebApi(
//     `v1/recommendations?limit=4&seed_tracks=${topTracksIds.join(",")}`,
//     "GET"
//   )).tracks;

// }

async function createPlaylist(tracksUri) {
  const { id: user_id } = await fetchWebApi("v1/me", "GET");

  const playlist = await fetchWebApi(`v1/users/${user_id}/playlists`, "POST", {
    name: "My recommendation playlist",
    description: "Playlist created by the tutorial on developer.spotify.com",
    public: false,
  });

  await fetchWebApi(`v1/playlists/${playlist.id}/tracks`, "POST", {
    uris: tracksUri,
  });

  return playlist;
}

async function main(end) {
  const topTracks = await getTopTracks();
  console.log(
    topTracks?.map(
      ({ name, artists }) =>
        `${name} by ${artists.map((artist) => artist.name).join(", ")}`
    )
  );

  let tracksUri = topTracks.map((track) => `spotify:track:${track.id}`);

  const recommendedTracks = await getRecommendations(end);
  console.log(
    recommendedTracks?.map(
      ({ name, artists }) =>
        `${name} by ${artists.map((artist) => artist.name).join(", ")}`
    )
  );

  tracksUri = tracksUri.concat(
    recommendedTracks.map((track) => `spotify:track:${track.id}`)
  );

  const createdPlaylist = await createPlaylist(tracksUri);
  console.log(createdPlaylist.name, createdPlaylist.id);

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

// const myButton = document.getElementById("submitButton");

const Button = document.getElementById("submitButton");

Button.addEventListener("click", function (event) {
  event.preventDefault();

  const genre = document.getElementById("genre-select");
  const end = setRecommendations(genre);
  main(end);
});
