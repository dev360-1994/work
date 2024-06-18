export class VideoModel {
    androidImplementation: string = '';
    didJustFinish: boolean = false;
    durationMillis: number = 0;
    isBuffering: boolean = false;
    isLoaded: boolean = false;
    isLooping: boolean = false;
    isMuted: boolean = false;
    isPlaying: boolean = false;
    playableDurationMillis: number = 0;
    positionMillis: number = 0;
    progressUpdateIntervalMillis: number = 0;
    rate: number = 0;
    shouldCorrectPitch: boolean = false;
    shouldPlay: boolean = false;
    uri: string = '';
    volume: number = 0;
}