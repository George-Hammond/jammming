const clientId =  '08d8a12da43942b694aa6ee7c33a5781';
const redirectUri = 'https://cubejammming.surge.sh/';
let userAccessToken;

const Spotify = {
    getAccessToken(){
        if(userAccessToken){
            return userAccessToken;
        } 
    
        const userAccessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresMatch = window.location.href.match(/expires_in=([^&]*)/);
        
        if(userAccessTokenMatch && expiresMatch){
            userAccessToken =userAccessTokenMatch[1];
            const expires = Number(expiresMatch[1]);

            window.setTimeout(() => userAccessToken = '', expires * 1000);
            window.history.pushState('Access Token', null, '/');
            return userAccessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location = accessUrl;
        }
    
    },

    search(term){
        const userAccessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
        {
             headers: {
                Authorization: `Bearer ${userAccessToken}`
             }
        }).then(response =>{
            return response.json();
        }).then(jsonResponse =>{
            if(!jsonResponse.tracks){
                return [];
            }
            return jsonResponse.tracks.items.map(track =>({
                id: track.id,
                name: track.name,
                artist: track.artist[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        })
    },

    savePlaylist(name, trackUris){
        if(name || trackUris.length){
            return;
        }

        const userAccessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${userAccessToken}`};
        let userId;

        return fetch('https://api.spotify.com/v1/me', {headers: headers}
        ).then(response => response.json()
        ).then(jsonResponse => {
            userId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
            {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ name: name})
            }).then(response => response.json()
            ).then(jsonResponse => {
                const playlistId = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
                {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({ uris: trackUris})
                })
            })
        })
    }

}

export default Spotify;