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

      standard : {
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

  thumbnails : {         // Links to two different sizes of the thumbnail
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

  added : string;        // Date added to the playlist
  published? : string    // Date uploaded to Youtube (needs videos.list endpoint instead)

  viewCount? : string;   // Viewcount when requested (needs videos.list endpoint instead)

  index : number;        // Index in playlist

  channelId : string;    // Id of uploading channel
  channelTitle : string; // Name of uploading channel

  note? : string;
}


function convertPlaylistItemToVideo (item : PlaylistRawItem) : Video
{
  let {
    resourceId : { videoId },
    title,

    thumbnails : {
      medium : list,     // 320x180
      maxres : gallery,  // 1280x720
      standard : backup, // 640x480
      high : backup2     // 480x360
    },

    publishedAt : added,

    position : index,

    videoOwnerChannelId : channelId,
    videoOwnerChannelTitle : channelTitle
  } = item.snippet;

  if (title !== "Private video" && title !== "Deleted video")
  {
    list.link = list.url;
    delete list.url;

    gallery = (gallery !== undefined) ? gallery : backup;
    gallery = (gallery !== undefined) ? gallery : backup2;

    gallery.link = gallery.url;
    delete gallery.url;
  }

  return {
    videoId,
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

function isUnavailable (video : Video) : boolean
{
  return video.channelId === undefined;
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

        return [
          videoId,
          {
            videoId,
            published,
            viewCount
          }
        ];
      }
    )
  );

  for (const video of videos)
  {
    const responseItem = map.get(video.videoId);

    // Missing video
    if (isUnavailable(video))
    {
      continue;
    }

    // Else
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
export { convertPlaylistItemToVideo, augmentVideoStatistics, isUnavailable };
