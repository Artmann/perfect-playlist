import { BaseModel } from 'esix'

export interface Song {
  artist: string
  title: string
  youtubeId?: string
}

export class Playlist extends BaseModel {
  public description = ''
  public songs: Song[] = []
  public title = ''
  public prompt = ''
}
