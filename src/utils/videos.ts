// Result of `axios.get` from playlistItems.list
interface PlaylistItemsResponse
{
  nextPageToken? : string;
  items : PlaylistRawItem[];
}

// Single video item in playlist, minus the published date and viewcount
interface PlaylistRawItem
{
  snippet: {
    resourceId : {
      videoId : string;
    };
    title : string;

    thumbnails : {
      medium : {
        url : string;
        width : number;
        height : number;
      };

      maxres : {
        url : string;
        width : number;
        height : number;
      };
    };

    publishedAt : string;

    position : number;

    videoOwnerChannelId : string;
    videoOwnerChannelTitle : string;
  };
}

// Result of `axios.get` from videos.list`
interface VideoItemsResponse
{
  items : VideoRawItem[];
}

// Single video item from videos.list, with the published date and viewcount
interface VideoRawItem
{
  id : string;

  snippet : {
    publishedAt : string
  };

  statistics : {
    viewCount : string
  };
}

// Single unified video interface
interface Video
{
  videoId : string;      // watch?v={videoId}
  title : string;        // video title

  thumbnail : {          // Links to two different sizes of the thumbnail
    list : {
      link : string;
      width : number;
      height : number;
    };

    gallery : {
      link : string;
      width : number;
      height : number;
    };
  };

  added : Date;          // Date added to the playlist
  published? : Date;     // Date uploaded to Youtube (needs videos.list endpoint instead)

  viewCount? : string;   // Viewcount when requested (needs videos.list endpoint instead)

  index : number;        // Index in playlist

  channelId : string;    // Id of uploading channel
  channelTitle : string; // Name of uploading channel
}


function convertPlaylistItemToVideo (item : PlaylistRawItem) : Video
{
  let {
    resourceId : { videoId },
    title,

    thumbnails : {
      medium : list,
      maxres : gallery
    },

    publishedAt : added,

    position : index,

    videoOwnerChannelId : channelId,
    videoOwnerChannelTitle : channelTitle
  } = item.snippet;

  added = new Date(added);

  return {
    resourceId,
    title,

    thumbnails : {
      list,
      gallery
    },

    added,

    index,

    channelId,
    channelTitle
  };
}

function augmentVideoStatistics (videos : Video[], response : VideoItemsResponse)
{
  const map = new Map(
    response.items.map(
      videoRawItem => {
        let {
          id : videoId,

          snippet: {
            publishedAt : published
          },

          statistics: {
            viewCount
          }
        } = videoRawItem;

        published = new Date(published);

        return {
          videoId,
          published,
          viewCount
        };
      }
    )
  );

  for (const video of videos)
  {
    const responseItem = map.get(video.videoId);

    // Copy `published` and `viewCount` into `video`
    (
      {
        published : video.published,
        viewCount : video.viewCount
      } = responseItem
    );
  }
}


export type { PlaylistItemsResponse, Video, VideoItemsResponse };
export { convertPlaylistItemToVideo, augmentVideoStatistics };
