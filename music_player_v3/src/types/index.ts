export interface Song {
  id: string;
  name: string;
  url: string;
  duration?: number;
  liked?: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  songs: any; // Será DoublyLinkedList<Song>
  isLikedPlaylist?: boolean;
}