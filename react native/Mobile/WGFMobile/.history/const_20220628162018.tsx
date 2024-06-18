import { Platform } from "react-native";
import Constants from "expo-constants";

function getEnvironment() {

    let releaseChannel = Constants.manifest?.releaseChannel;

    //DEV END SETTINGS
    //no releaseChannel (is undefined) in dev
    if (releaseChannel === undefined) {
        return {
            envName: "DEVELOPMENT",
            //https://localhost:44315/swagger/index.html
            // dbUrl: "https://api.watchgamefilm.com",
            dbUrl: "https://localhost:44315",
            replaceUrl:
                "r5-pzw.tririd.wgfmobile.exp.direct/--/watchgamefilm/",
        };
    }

    //STAGING ENV SETTINGS
    // matches staging-v1, staging-v2
    if (releaseChannel.indexOf("staging") !== -1) {
        return {
            envName: "STAGING",
            dbUrl: "https://api.watchgamefilm.com",
            replaceUrl: `exp.host/@tririd/WatchGameFilm?release-channel=staging-v${Constants.manifest?.version}&`,
        };
    }

    //PROD ENV SETTINGS
    // matches prod-v1, prod-v2, prod-v3
    if (releaseChannel.indexOf("prod") !== -1) {
        return {
            envName: "PRODUCTION",
            dbUrl: "https://api.watchgamefilm.com",
            replaceUrl: "watchgamefilm://",
        };
    }

}

let appEnv = getEnvironment();

export const BASE_URL = appEnv?.dbUrl;

export const REPLACE_URL = appEnv?.replaceUrl;

export const CLIENT_ID = '52F6CB5F-882C-4EFA-A5AE-6ACDA2F88D41';
export const CLIENT_SECRET = 'DFB6CC32-F375-4C44-B262-61188BB8A96E';
export const CLIP_SERVER_NAME = 'https://wgfstorage.blob.core.windows.net';
