const APIController = (function () {
  // Define clientId and clientSecret here
  const clientId = "c109829ae04f4b2aa0fad9528b087fca"; // replace with your client ID
  const clientSecret = "4282162045f1450384ef84e9e609c07e"; // replace with your client secret

  const _getToken = async () => {
    const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
      },
      body: "grant_type=client_credentials",
    });

    const data = await result.json();
    return data.access_token;
  };

  // const _fetchWebApi = async (endpoint, method, body, token) = {
  //   const res = await fetch(`https://api.spotify.com/${endpoint}`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //     method,
  //     body: JSON.stringify(body),
  //   });
  //   return await res.json();
  // }

  // Function to get top tracks
  const _getTopTracks = async (token) => {
    const response = await fetch(
      "https://api.spotify.com/v1/me/shows?offset=0&limit=20",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
        },
        body: "grant_type=client_credentials",
      }
    );
    if (!response) {
      console.error("Failed to retrieve top tracks.");
      return [];
    }
    return response.items;
  };

  // Function to get recommendations based on top tracks
  const _getRecommendations = async (topTracksIds, token) => {
    const response = await fetchWebApi(
      `v1/recommendations?limit=5&seed_tracks=${topTracksIds.join(
        ","
      )}&min_acousticness=${minAcoustic}&max_acousticness=${maxAcoustic}&min_danceability=${minDance}&max_danceability=${maxDance}&min_liveness=${minLiveness}&max_liveness=${maxLiveness}`,
      "GET",
      null,
      token
    );
    if (!response) {
      console.error("Failed to retrieve recommendations.");
      return [];
    }
    return response.tracks;
  };

  // Function to create a new playlist
  const _createPlaylist = async (tracksUri, token) => {
    const user = await fetchWebApi("v1/me", "GET", null, token);
    if (!user) {
      console.error("Failed to retrieve user information.");
      return null;
    }

    const playlist = await fetchWebApi(
      `v1/users/${user.id}/playlists`,
      "POST",
      {
        name: "My recommendation playlist",
        description:
          "Playlist created by the tutorial on developer.spotify.com",
        public: false,
      }
    );
    if (!playlist) {
      console.error("Failed to create playlist.");
      return null;
    }

    const response = await fetchWebApi(
      `v1/playlists/${playlist.id}/tracks?uris=${tracksUri.join(",")}`,
      "POST"
    );
    if (!response) {
      console.error("Failed to add tracks to playlist.");
      return null;
    }

    return playlist;
  };

  return {
    getToken() {
      return _getToken();
    },
    getTopTracks(token) {
      return _getTopTracks(token);
    },
    getRecommendations(topTracksIds, token) {
      return _getRecommendations(topTracksIds, token);
    },
    createPlaylist(tracksUri, token) {
      return _createPlaylist(tracksUri, token);
    },
  };
})();

const UIController = (function () {
  // Main function to orchestrate the playlist creation
  const main = async () => {
    const token = await _getToken();

    const topTracks = await getTopTracks(token);
    if (!topTracks.length) {
      console.error("No top tracks available.");
      return;
    }
    console.log(
      topTracks.map(
        ({ name, artists }) =>
          `${name} by ${artists.map((artist) => artist.name).join(", ")}`
      )
    );

    const topTracksIds = topTracks.map((track) => track.id);

    const recommendedTracks = await getRecommendations(topTracksIds, token);
    if (!recommendedTracks.length) {
      console.error("No recommended tracks available.");
      return;
    }
    console.log(
      recommendedTracks.map(
        ({ name, artists }) =>
          `${name} by ${artists.map((artist) => artist.name).join(", ")}`
      )
    );

    const tracksUri = recommendedTracks.map(
      (track) => `spotify:track:${track.id}`
    );

    const createdPlaylist = await createPlaylist(tracksUri, token);
    if (!createdPlaylist) {
      console.error("Failed to create playlist.");
      return;
    }
    console.log(createdPlaylist.name, createdPlaylist.id);

    const iframe = document.createElement("iframe");
    iframe.src = `https://open.spotify.com/embed/playlist/${createdPlaylist.id}`;
    iframe.title = "Spotify Embed: Recommendation Playlist";
    iframe.width = "100%";
    iframe.height = "100%";
    iframe.style.minHeight = "360px";
    iframe.frameBorder = "0";
    iframe.allow =
      "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
    iframe.loading = "lazy";

    document.body.appendChild(iframe);
  };

  const submitButton = document.getElementById("submitButton");

  submitButton.addEventListener("click", function (event) {
    event.preventDefault();
    main();
  });
})();

const APPController = (function (UICtrl, APICtrl) {
  // get input field object ref
  const DOMInputs = UICtrl.inputField();

  // get genres on page load
  const loadGenres = async () => {
    //get the token
    const token = await APICtrl.getToken();
    //store the token onto the page
    UICtrl.storeToken(token);
    //get the genres
    const genres = await APICtrl.getGenres(token);
    //populate our genres select element
    genres.forEach((element) => UICtrl.createGenre(element.name, element.id));
  };

  // create genre change event listener
  DOMInputs.genre.addEventListener("change", async () => {
    //reset the playlist
    UICtrl.resetPlaylist();
    //get the token that's stored on the page
    const token = UICtrl.getStoredToken().token;
    // get the genre select field
    const genreSelect = UICtrl.inputField().genre;
    // get the genre id associated with the selected genre
    const genreId = genreSelect.options[genreSelect.selectedIndex].value;
    // ge the playlist based on a genre
    const playlist = await APICtrl.getPlaylistByGenre(token, genreId);
    // create a playlist list item for every playlist returned
    playlist.forEach((p) => UICtrl.createPlaylist(p.name, p.tracks.href));
  });

  // create submit button click event listener
  DOMInputs.submit.addEventListener("click", async (e) => {
    // prevent page reset
    e.preventDefault();
    // clear tracks
    UICtrl.resetTracks();
    //get the token
    const token = UICtrl.getStoredToken().token;
    // get the playlist field
    const playlistSelect = UICtrl.inputField().playlist;
    // get track endpoint based on the selected playlist
    const tracksEndPoint =
      playlistSelect.options[playlistSelect.selectedIndex].value;
    // get the list of tracks
    const tracks = await APICtrl.getTracks(token, tracksEndPoint);
    // create a track list item
    tracks.forEach((el) => UICtrl.createTrack(el.track.href, el.track.name));
  });

  // create song selection click event listener
  DOMInputs.tracks.addEventListener("click", async (e) => {
    // prevent page reset
    e.preventDefault();
    UICtrl.resetTrackDetail();
    // get the token
    const token = UICtrl.getStoredToken().token;
    // get the track endpoint
    const trackEndpoint = e.target.id;
    //get the track object
    const track = await APICtrl.getTrack(token, trackEndpoint);
    // load the track details
    UICtrl.createTrackDetail(
      track.album.images[2].url,
      track.name,
      track.artists[0].name
    );
  });

  return {
    init() {
      console.log("App is starting");
      loadGenres();
    },
  };
})(UIController, APIController);

// will need to call a method to load the genres on page load
APPController.init();
