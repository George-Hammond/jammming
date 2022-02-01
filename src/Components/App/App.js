import React from 'react';
import './App.css';
import {SearchBar} from '../SearchBar/SearchBar.js';
import {SearchResults} from '../SearchResults/SearchResults.js';
import {Playlist} from '../Playlist/Playlist.js';
import Spotify from '../../util/Spotify.js'


class App extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'My Playlist',
      playlistTracks: []
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savedPlaylist = this.savedPlaylist.bind(this);
    this.search = this.search.bind(this); 
  }
  addTrack(track){
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }

    this.state.playlistTracks.push(track);
    this.setState({playlistTracks: this.state.playlistTracks})
  }

  removeTrack(track){
    this.state.playlistTracks.filter(currentTrack => currentTrack.id !== track.id);
    this.setState({playlistTracks: this.state.playlistTracks})
  }

  updatePlaylistName(newName){
    this.setState({playlistName: newName});
  }

  savePlaylist(){
    const trackUris = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackUris).then(()=>{
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      })
    })
  }

  search(searchTerm){
    Spotify.search(searchTerm).then(searchResults =>{
      this.setState({searchResults: searchResults})
    })
  }
  render(){
    return(
      <div>
        <h1>Ja<span className= "highlight">mmm</span>ing</h1>
        <div className= "App">
          <SearchBar onSearch = {this.state.search}/>
          <div className= "App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistName = {this.state.playlistName} 
                      playlistTracks = {this.state.playlistTracks} 
                      onRemove = {this.removeTrack}
                      onNameChange = {this.updatePlaylistName}
                      onSave = {this.state.savedPlaylist}/>
          </div>
        </div>
      </div>
      
      )
  }
}

export default App
