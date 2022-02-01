import React from 'react';
import {TrackList} from '../TrackList/TrackList.js';
import './Playlist.css';

export class Playlist extends React.Component{
constructor(props){
	super(props);

	this.handleNameChange = this.handleNameChange.bind(this);	
}
handleNameChange(e){
	var eventChange = e.target.value;
	this.props.onNameChange(eventChange);
}


render(){
	return (
		<div className = "Playlist">
			<input defaultValue= {"New Playlist"}
					onChange= {this.props.handleNameChange}/>
			<TrackList tracks = {this.props.playlistsTracks} 
					   onRemove = {this.props.onRemove} 
					   isRemoval = {true}/>
			<button className="Playlist-save" onClick= {this.props.onSave}>SAVE TO SPOTIFY</button>
		</div>
		)
	} 
} 
