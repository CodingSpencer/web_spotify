// let minAcoustic = 0;
// let maxAcoustic = 0;

// let minDance = 0;
// let maxDance = 0;

// let minLiveness = 0;
// let maxLiveness = 0;

// const token = "BQDefR8aMF2q7hOD1Z1yieThCqHZRdFJk0fM4TZgPtVm-HPMYB6uSlKMY5Ecp55k9pxgGc_FJTMhdrDVEsV9oZ5EDWAr-VM3NVnXAPY_jqzJHKxwYn-40ko7O2eT7ibwbOgXa1teddkVs13hNC6DOyspxZcqZdo1cttyBT7kLx-lVoXT2J6FIE1k-h_KmLzoLMduc9sTGkYQyaf5rwapXo7_fwNJIM6GEY962BD28SjyywT5hOJnoBHWtwPwyYGENKjZ7w";

// async function fetchWebApi(endpoint, method, body) {
//   const res = await fetch(`https://api.spotify.com/${endpoint}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//     method,
//     body: JSON.stringify(body),
//   });
//   return await res.json();
// }

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

// async function getTopTracks() {
//   // return (
//   //   await fetchWebApi("v1/me/top/tracks?time_range=long_term&limit=5", "GET")
//   // ).items;
//   try {
//     // Replace with your actual API call
//     const response = await fetchWebApi(
//       "v1/me/top/tracks?time_range=long_term&limit=5",
//       "GET"
//     );
//     if (!response.ok) {
//       throw new Error("Network response was not ok");
//     }
//     const data = await response.json();
//     return data.tracks; // Adjust based on actual API response structure
//   } catch (error) {
//     console.error("Error fetching top tracks:", error);
//     return null;
//   }

//   return response.items;
// }

// async function getRecommendations() {
//   // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-recommendations
//   return (
//     await fetchWebApi(
//       `v1/recommendations?limit=5&seed_tracks=${topTracksIds.join(",")}`,
//       "GET"
//     )
//   ).tracks;
// }

// // async function getRecommendations(topTracksIds) {
// //   return (
// //     await fetchWebApi(
// //       `v1/recommendations?limit=5&seed_tracks=${topTracksIds.join(",")},
// //       &min_acousticness=${minAcoustic}&max_acousticness=${maxAcoustic}&min_danceability=${minDance}&max_danceability=${maxDance}&min_liveness=${minLiveness}&max_liveness=${maxLiveness}`,
// //       "GET"
// //     )
// //   ).tracks;
// // }

// async function createPlaylist(tracksUri) {
//   const { id: user_id } = await fetchWebApi("v1/me", "GET");

//   const playlist = await fetchWebApi(`v1/users/${user_id}/playlists`, "POST", {
//     name: "My recommendation playlist",
//     description: "Playlist created by the tutorial on developer.spotify.com",
//     public: false,
//   });

//   await fetchWebApi(
//     `v1/playlists/${playlist.id}/tracks?uris=${tracksUri.join(",")}`,
//     "POST"
//   );

//   return playlist;
// }

// async function main() {
//   const topTracks = await getTopTracks();
//   console.log(
//     topTracks?.map(
//       ({ name, artists }) =>
//         `${name} by ${artists.map((artist) => artist.name).join(", ")}`
//     )
//   );

//   const topTracksIds = topTracks.map((track) => track.id);

//   const recommendedTracks = await getRecommendations(topTracksIds);
//   console.log(
//     recommendedTracks?.map(
//       ({ name, artists }) =>
//         `${name} by ${artists.map((artist) => artist.name).join(", ")}`
//     )
//   );

//   const tracksUri = recommendedTracks.map(
//     (track) => `spotify:track:${track.id}`
//   );

//   const createdPlaylist = await createPlaylist(tracksUri);
//   console.log(createdPlaylist.name, createdPlaylist.id);

//   const iframe = document.createElement("iframe");
//   iframe.src = `https://open.spotify.com/embed/playlist/${createdPlaylist.id}`;
//   iframe.title = "Spotify Embed: Recommendation Playlist ";
//   iframe.width = "100%";
//   iframe.height = "100%";
//   iframe.style.minHeight = "360px";
//   iframe.frameBorder = "0";
//   iframe.allow =
//     "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
//   iframe.loading = "lazy";

//   document.body.appendChild(iframe);
// }

// // const myButton = document.getElementById("submitButton");

// const Button = document.getElementById("submitButton");

// Button.addEventListener("click", function () {
//   event.preventDefault();

//   // setDanceRecommendations();
//   // setLivenessRecommendations();
//   // setAcousticRecommendations();
//   main();
// });

const token =
  "BQAv67u6ZOKy4cAP3oBYlJK2RH1mvZ-NZhBBd_CJrtrCBu7Kt5CTKZeB88dgP9mi07CzhAjbPweDvClf_xwAWD8W_LwSvuMTZS-MUH0PFQEfwJRljopSMDNsRV1-zGXEoT-CNQ0HnZcTUKsL82wY2S97UX8vpFDw_zKKIcjH7pY3O47uZwTJnHYeH3e-IyrJYzPxGq5nnJ28h5Sr8vmJVih-r295tWrIk-fWhJdr15gMcoZ1DMUF2oIMOrOh9Kuj8P7jBg";
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
  customMessage.innerHTML = `${name} playlist has been created! <a href="https://open.spotify.com/embed/playlist/${createdPlaylist.id}">Click here</a> to listen to it.`;
  container.appendChild(customMessage);

  document.getElementById("name").classList.add("hide");

  // document.getElementById("custom").style.display = "none";

  // setDanceRecommendations();
  // setLivenessRecommendations();
  // setAcousticRecommendations();

  main();
});
